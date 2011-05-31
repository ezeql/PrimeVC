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
 * DAMAGE.s
 *
 *
 * Authors:
 *  Danny Wilson	<danny @ onlinetouch.nl>
 */
package primevc.tools.valueobjects;
 import primevc.core.collections.IRevertableList;
 import primevc.core.collections.ListChange;
 import primevc.core.traits.IEditableValueObject;
 import primevc.core.traits.IFlagOwner;
 import primevc.core.traits.IValueObject;
 import primevc.core.collections.RevertableArrayList;
 import primevc.core.dispatcher.Signal1;
 import primevc.core.RevertableBindable;
 import primevc.core.RevertableBindableFlags;
 import primevc.utils.FastArray;
  using primevc.utils.BitUtil;
  using primevc.utils.IfUtil;
  using primevc.utils.TypeUtil;
  using primevc.utils.FastArray;
  using primevc.utils.ChangesUtil;


typedef PropertyID	= Int;
typedef Flags		= RevertableBindableFlags;


/**
 * Base class for all generated ValueObjects
 * 
 * @author Danny Wilson
 * @creation-date Dec 03, 2010
 */
class ValueObjectBase implements IValueObject, implements IFlagOwner
{
	public var change (default, null) : Signal1<ObjectChangeSet>;
	
	private var _changedFlags	: Int;
	private var _propertiesSet	: Int;
	private var _flags			: Int;
	
	private function new ()
	{
		change = new Signal1();
		_changedFlags = _propertiesSet = _flags = 0;
	}
	
	
	public function dispose()
	{
		if (change.notNull()) {
			change.dispose();
			change = null;
		}
		_changedFlags = 0;
	}
	
	
	public function isEmpty() : Bool				{ return !_propertiesSet.not0(); }
	public inline function isEditable() : Bool		{ return _flags.has(Flags.IN_EDITMODE); }
	public inline function isDisposed() : Bool		{ return change == null; }
	public function has (propertyID : Int) : Bool	{ return (_propertiesSet & (1 << ((propertyID & 0xFF) + _fieldOffset(propertyID >>> 8)))).not0(); }
	public inline function changed () : Bool		{ return _changedFlags.not0(); }
	
	private inline function setPropertyFlag(propertyID : Int) : Void {
		_propertiesSet = _propertiesSet.set(1 << ((propertyID & 0xFF) + _fieldOffset(propertyID >>> 8)));
	}
	private inline function unsetPropertyFlag(propertyID : Int) : Void {
		_propertiesSet = _propertiesSet.unset(1 << ((propertyID & 0xFF) + _fieldOffset(propertyID >>> 8)));
	}
	
	public function commitEdit()
	{
		if(!isEditable()) return;
		
		if (changed())
		{
			var set = ObjectChangeSet.make(this, _changedFlags);
			addChanges(set);
			this.change.send(set);
		}
		commitBindables();
		
		_flags			= _flags.unset( Flags.IN_EDITMODE );
		_changedFlags	= 0;
	}
	
	
	public function objectChangedHandler(propertyID : Int) : ObjectChangeSet -> Void
	{
		var self = this;
		var pathNode = ObjectPathVO.make(this, propertyID); // Same ObjectPathVO instance reused
		
		return function(change:ObjectChangeSet)
		{
			Assert.notNull(self.change);
			Assert.notNull(change);
			
			var p = change.parent;
			
			if (p.notNull()) {
				// Find either pathNode, or the last parent
				while (p.notNull() && p.parent.notNull() && p.parent != pathNode) p = p.parent;
				untyped p.parent = pathNode;
			}
			else untyped change.parent = pathNode;
			
			if (change.vo.isEmpty())
				self.unsetPropertyFlag(propertyID);
			else
				self.setPropertyFlag(propertyID);
			self.change.send(change);
		}
	}
	
	
	private function addChanges(changeSet:ObjectChangeSet) {} // Creates and adds all PropertyChangeVO and ListChangeVO
	private function commitBindables() {}
	private function _fieldOffset(typeID:Int): Int { Assert.abstract(); return -1; }
	
	
	public function beginEdit()
	{
	//	Assert.that( !isEditable() );
		_flags = _flags.set( Flags.IN_EDITMODE );
	}
	
	
	public function cancelEdit()
	{
		Assert.that( isEditable(), this + "; flags: "+_flags );
		_flags			= _flags.unset( Flags.IN_EDITMODE );
		_changedFlags	= 0;
	}
	
/*
	Kijken wat kleinere SWF geeft: calls hiernaar, of methods genereren...
	
	private static function propertyChangeHandler<T>(instance:ValueObjectBase, propertyBit : Int) : Void -> Void
	{
		return function() {
			instance._changedFlags |= propertyBit;
		}
	}
*/
}





class PropertyChangeVO extends ChangeVO
{
	public var propertyID	(default, null) : Int;
}





class ChangeVO implements IValueObject
{
	public var next (default,null) : PropertyChangeVO;
	
	
	public function dispose()
	{
		if (next.notNull()) {
			next.dispose();
			next = null;
		}
	}
}





class PropertyValueChangeVO extends PropertyChangeVO
{
	public static inline function make(propertyID, oldValue, newValue)
	{
		var p = new PropertyValueChangeVO(); // Could come from freelist if profiling tells us to
		p.propertyID = propertyID;
		p.oldValue   = oldValue;
		p.newValue   = newValue;
		return p;
	}
	
	
	public var oldValue		(default, null) : Dynamic;
	public var newValue		(default, null) : Dynamic;
	
	private function new() {}
	
	
	override public function dispose()
	{
		propertyID = -1;
		this.oldValue = this.newValue = null;
		super.dispose();
	}
	
#if debug
	public function toString ()
	{
		return oldValue + " -> " + newValue;
	}
#end
}





class ListChangeVO extends PropertyChangeVO
{
	public static inline function make(propertyID, changes : FastArray<ListChange<Dynamic>>)
	{
		var l = new ListChangeVO(); // Could come from freelist if profiling tells us to
		l.propertyID = propertyID;
		l.changes = changes.clone();
		return l;
	}
	
	
	public var changes : FastArray<ListChange<Dynamic>>;
	private function new() {}
	
	
	override public function dispose()
	{
		if (this.changes.notNull()) {
			for (i in 0 ... this.changes.length) changes[i] = null;
			this.changes = null;
		}
		super.dispose();
	}
	
	
#if debug
	public function toString ()
	{
		var output = [];
		for (change in changes)
			output.push( change );
		
		return output.length > 0 ? "\n\t\t\t\t" + output.join("\n\t\t\t\t") : "no-changes";
	}
#end
}
/*
ObjectChangeVO {
  vo : instanceof PublicationVO
  id : "pub1"
  propertiesChanged: SPREAD
  
  next: ObjectChangeVO {
    vo: instanceof SpreadVO
    id: "spread1"
    propertiesChanged: (bits)[ X, Y ]
    next: PropertyChangeVO { propertyID: X, oldValue: 0, newValue: 100,
      next: PropertyChangeVO { propertyID: Y, oldValue: 0, newValue: 100 }
    }
  }
}
*/



class ObjectChangeSet extends ChangeVO
{
	public static inline function make (vo:ValueObjectBase, changes:Int)
	{
		var s = new ObjectChangeSet();	// Could come from freelist if profiling tells us to
		s.vo = vo;
		s.timestamp = haxe.Timer.stamp();
		s.propertiesChanged = changes;
		return s;
	}
	
	public var vo					(default, null) : ValueObjectBase;
	public var parent				(default, null) : ObjectPathVO;
	public var timestamp			(default, null) : Float;
	public var propertiesChanged	(default, null) : Int;
	
	
	private function new() {}
	
	
	public function add (change:PropertyChangeVO)
	{
		untyped change.next = next;
		next = change;
	}
	
	public function has (propertyID : Int) : Bool	{ return (propertiesChanged & (1 << ((propertyID & 0xFF) + untyped vo._fieldOffset(propertyID >>> 8)))).not0(); }
	
	
	public inline function addChange (id:Int, flagBit:Int, value:Dynamic)
	{
		if (flagBit.not0())
			add(PropertyValueChangeVO.make(id, null, value));
	}
	
	
	public inline function addBindableChange<T> (id:Int, flagBit:Int, oldValue:Dynamic, value:Dynamic)
	{
		if (flagBit.not0())
			add(PropertyValueChangeVO.make(id, oldValue, value));
	}
	
	
	public inline function addListChanges<T> (id:Int, flagBit:Int, list:IRevertableList<T>)
	{
		if (flagBit.not0())
			add(ListChangeVO.make(id, list.changes));
	}
	
	
//#if debug
	public function toString ()
	{
		var output = [];
		
		var change = next;
		while(change != null)
		{
			output.push( vo.propertyIdToString(change.propertyID) + ": " + change );
			change = change.next;
		}
		
		return "ChangeSet of " + Date.fromTime( timestamp * 1000 ) + " on "+vo+"; changes: \n\t\t\t" + output.join("\n\t\t\t");
	}
//#end
}




class ObjectPathVO implements IValueObject
{
	public var parent		(default, null) : ObjectPathVO;
	public var object		(default, null) : IValueObject;
	public var propertyID	(default, null) : Int;
	
	
	private function new() {}
	
	
	public function dispose()
	{
		parent = null;
		object = null;
	}
	
	
	static inline public function make(vo:ValueObjectBase, propertyID:Int)
	{
		var p = new ObjectPathVO();
		p.object = vo;
		p.propertyID = propertyID;
		return p;
	}
}