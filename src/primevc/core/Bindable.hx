/*
 * Copyright (c) 2010, The PrimeVC Project Contributors
 * All rights reserved.
 * Redistribution and use in source and binary forms, with or without
 * modification, are permitted provided that the following conditions are met:
 *
 *   - Redistributions of source code must retain the above copyright
 *     notice, this list of conditions and the following disclaimer.
 *   - Redistributions in binary form must reproduce the above copyright
 *     notice, this list of conditions and the following disclaimer in the
 *     documentation and/or other materials provided with the distribution.
 *
 * THIS SOFTWARE IS PROVIDED BY THE PRIMEVC PROJECT CONTRIBUTORS "AS IS" AND ANY
 * EXPRESS OR IMPLIED WARRANTIES, INCLUDING, BUT NOT LIMITED TO, THE IMPLIED
 * WARRANTIES OF MERCHANTABILITY AND FITNESS FOR A PARTICULAR PURPOSE ARE
 * DISCLAIMED. IN NO EVENT SHALL THE PRIMVC PROJECT CONTRIBUTORS BE LIABLE FOR
 * ANY DIRECT, INDIRECT, INCIDENTAL, SPECIAL, EXEMPLARY, OR CONSEQUENTIAL
 * DAMAGES (INCLUDING, BUT NOT LIMITED TO, PROCUREMENT OF SUBSTITUTE GOODS OR
 * SERVICES; LOSS OF USE, DATA, OR PROFITS; OR BUSINESS INTERRUPTION) HOWEVER
 * CAUSED AND ON ANY THEORY OF LIABILITY, WHETHER IN CONTRACT, STRICT
 * LIABILITY, OR TORT (INCLUDING NEGLIGENCE OR OTHERWISE) ARISING IN ANY WAY
 * OUT OF THE USE OF THIS SOFTWARE, EVEN IF ADVISED OF THE POSSIBILITY OF SUCH
 * DAMAGE.
 *
 *
 * Authors:
 *  Danny Wilson	<danny @ onlinetouch.nl>
 *  Ruben Weijers	<ruben @ onlinetouch.nl>
 */
package primevc.core;
 import primevc.core.IBindableReadonly;
 import primevc.core.dispatcher.Signal2;
 import primevc.core.traits.IClonable;
 import haxe.FastList;
  using primevc.utils.IfUtil;


/**
 * Class to keep a value automatically updated.
 * 
 * You can trigger another bindable to update by doing:
 * 	
 * 		var a = new Bindable <Int> (5);
 * 		var b = new Bindable <Int> (6);
 * 		a.bind(b);		//a will be 6 now
 * 		b.value = 8;	//a will be 8 now
 * 	
 * You can also create a two way binding by doing:
 * 		a.pair(b);
 * 	
 * Which is effictively the same as doing:
 * 		a.bind(b);
 * 		b.bind(a);  	//will not create an infinte loop ;-)
 * 
 * 
 * You can trigger a method when the property is changed:
 * 		
 * 		using primevc.utils.BindUtil;
 * 
 * 		function updateLabel (newLabel:String) : Void {
 * 			textField.text = newLabel;
 * 		}
 * 		
 * 		var a = new Bindable <String> ("aap");
 * 		updateLabel.on( a.change, this );
 * 		
 * 		a.value = "2 apen";		//textField.text will also be changed now
 * 		
 * 
 * The 'change' event will be dispatched after 'this.value' changes.
 * 
 * @creation-date	Jun 18, 2010
 * @author			Ruben Weijers, Danny Wilson
 */
class Bindable <DataType> implements IBindable<DataType>, implements IClonable<Bindable<DataType>>, implements haxe.rtti.Generic
{
	public var value	(default, setValue)	: DataType;
	
	/** 
	 * Dispatched just before "value" is set to a new value.
	 * Signal argument: The new value.
	 */
	public var change	(default, null)	: Signal2 < DataType, OldValue < DataType > >;
	
	/**
	 * Keeps track of which Bindables update this.value
	 */
	private var boundTo : FastList < IBindableReadonly < DataType > >;
	/**
	 * Keeps track of which Bindables should be updated when this.value changes.
	 */
	private var writeTo : FastList < IBindable < DataType > >;
	
	
	public function new (?val : Null<DataType>)
	{
		change = new Signal2();
		set( val );
	}
	
	
	public function dispose ()
	{
		if (change == null) return; // already disposed
		
		if (boundTo != null) {
		 	// Dispose of all binding connections
			unbindAll();
			boundTo = null;
		}
		if (writeTo != null) {
		 	// Dispose of all binding connections
			while (!writeTo.isEmpty()) writeTo.pop().unbind(this);
			writeTo = null;
		}
		
		change.dispose();
		change = null;
		
		(untyped this).value = null; // Int can't be set to null, so we trick it with untyped
	}
	
	
	public inline function isEmpty () : Bool
	{
		return (untyped this).value == null;
	}
	
	
	public function clone ()
	{
		return new Bindable<DataType>(value);
	}
	
	
	/**
	 * Sets value directly, without the requirement to be in edit mode, and without dispatching any events.
	 */
	public inline function set (val:DataType) : Void
	{
		(untyped this).value = val;
	}
	
	
#if debug
	public function isBoundTo(otherBindable)
	{
		if (boundTo != null) for (b in boundTo) if (b == otherBindable) return true;
		return false;
	}
	
	
	public function writesTo(otherBindable)
	{
		if (writeTo != null) for (b in writeTo) if (b == otherBindable) return true;
		return false;
	}
#end
	
	
	private function setValue (newValue:DataType) : DataType
	{
		if (value != newValue)	//FIXME (Ruben @ Mar 11, 2011) Will also evaluate true with NaN == NaN and (Null<Bool> = null) == false 
		{
			var oldV	= value;
			value		= newValue;			//first set the value -> will possibly trigger an infinite loop otherwise
			change.send( newValue, oldV );
		//	value = newValue;
			BindableTools.dispatchValueToBound(writeTo, newValue);
		}
		
		return newValue;
	}
	
	
	/**
	 * Makes sure this.value is (and remains) equal
	 * to otherBindable's value.
	 *	
	 * In other words: 
	 * - update this when otherBindable.value changes
	 */
	public function bind (otherBindable:IBindableReadonly<DataType>)
	{
		Assert.that(otherBindable != null);
		Assert.that(otherBindable != this);
		
		registerBoundTo(otherBindable);
		untyped otherBindable.keepUpdated(this);
	}
	
	
	private inline function registerBoundTo(otherBindable:IBindableReadonly<DataType>)
	{
		Assert.notNull(otherBindable);
		
		var b = this.boundTo;
		if (!b.notNull())
			b = this.boundTo = new FastList<IBindableReadonly<DataType>>();
		
		addToBoundList(b, otherBindable);
	}
	
	
	private inline function addToBoundList<T>(list:FastList<T>, otherBindable:T)
	{
		Assert.that(list != null);
		
		// Only bind if not already bound.
		var n = list.head;
		while (n.notNull())
		 	if (n.elt == otherBindable) { list = null; break; } // already bound, skip add()
			else n = n.next;
		
		if (list.notNull())
			list.add(otherBindable);
	}
	
	
	/**
	 * @see IBindableReadonly
	 */
	private function keepUpdated (otherBindable:IBindable<DataType>)
	{
		Assert.that(otherBindable != null);
		Assert.that(otherBindable != this);
		
		otherBindable.value = this.value;
		untyped otherBindable.registerBoundTo(this);
		
		var w = this.writeTo;
		if (!w.notNull())
			w = this.writeTo = new FastList<IBindable<DataType>>();
		
		addToBoundList(w, otherBindable);
	}
	
	
	/** 
	 * Makes sure this Bindable and otherBindable always have the same value.
	 * 
	 * In other words: 
	 * - update this when otherBindable.value changes
	 * - update otherBindable when this.value changes
	 */
	public function pair (otherBindable:IBindable<DataType>)
	{
		untyped otherBindable.keepUpdated(this);
		keepUpdated(otherBindable);
	}
	
	
	/**
	 * @see IBindableReadonly
	 */
	public function unbind (otherBindable:IBindableReadonly<DataType>)
	{
		Assert.that(otherBindable != null);
		Assert.that(otherBindable != this);
	
	// TODO: Optimally this should only trace twice, not 3 times.
	//	trace("unbind");
	
		
		var removed = false;
		if (boundTo.notNull())
		 	removed = this.boundTo.remove(otherBindable);
		if (writeTo.notNull())
		 	removed = this.writeTo.remove(cast otherBindable) || removed;
		if (removed)
			otherBindable.unbind(this);
		
		return removed;
	}
	
	
	/**
	 * Will remove every binding to bindables which update this object, or which this object updates.
	 */
	public function unbindAll ()
	{
		if (writeTo.notNull()) while (!writeTo.isEmpty())
		 	writeTo.pop().unbind(this);
		if (boundTo.notNull()) while (!boundTo.isEmpty())
			boundTo.pop().unbind(this);
	}
	
	
//#if debug
	public inline function toString () : String {
		return "Bindable("+value+")";
	}
//#end
}




class BindableTools
{
	/**
	 * Propagate a value to Bindables in the given FastList.
	 */
	public static inline function dispatchValueToBound<T> (list:FastList<IBindable<T>>, newValue:T)
	{
		if (list != null)
		{
			var n = list.head;
			while (n.notNull()) {
				n.elt.value = newValue;
				n = n.next;
			}
		}
	}
}