/*
 * Copyright (c) 2013, The PrimeVC Project Contributors
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
 *  Danny Wilson	<danny @ prime.vc>
 */

package prime.perceptor.embedded;
 import prime.bindable.collections.IEditableList;
 import prime.bindable.collections.IReadOnlyList;
 import prime.bindable.collections.IReadOnlyList;
 import prime.bindable.collections.SimpleList;
 import prime.types.SimpleDictionary;
 import prime.bindable.collections.ListChange;
   using prime.utils.Bind;
   using prime.utils.TypeUtil;

/**
 * Takes a source tree A, and maintains a copy but only keeping
 * members that match the parameterized type.
 * @author ...
 */
class TypedProxyTree<T, F> extends SimpleList< TypedProxyTree<T, F> >
{
	public var view : Dynamic;
	public var source : T;
	public var sourceId : String;
	
	private var sourceChildren : IReadOnlyList<T>;
	private var getChildList : T -> IReadOnlyList<T>;
	private var type : Class<T>;
	private var filter : Class<F>;
	private var childNodeMap : SimpleDictionary< T, TypedProxyTree < T, F >> ;
	
#if debug
	private var ok:Bool;
#end
#if embed_perceptor
	// some magic to allow Inspector to inspect its own UI items but only for InspectorNodes that are bound
	// to the app, to stop recursing forever
#end
	
	public function new( source:T, getChildList : T -> IReadOnlyList<T>, sourceType:Class<T>, filterType:Class<F> ) 
	{
		super();
		this.source = source;
		this.getChildList = getChildList;
		if( getChildList != null )
			sourceChildren = getChildList( source );
		if( sourceChildren != null )
			childNodeMap = new SimpleDictionary < T, TypedProxyTree < T, F >> ( sourceChildren.length );
		type = sourceType;
		filter = filterType;
		if( sourceChildren != null )
			build();
		if( sourceChildren != null )
			sync.on( sourceChildren.change, this );

#if debug
		ok = false;
		sourceId = "" + source;
		if ( sourceId == "toolTip" )
			sourceId = "toolTip";
#end
	}
	
	public override function dispose ()
	{
		removeAll();
		
		sourceChildren.change.unbind( this );
		
		childNodeMap.dispose();
		childNodeMap = null;
		
		source = null;
		sourceChildren = null;
		getChildList = null;
		filter = null;
		
		super.dispose();
	}
	
	private function build()
	{
#if debug
		ok = true;
#end
		for ( i in sourceChildren )
		{
			if ( i != null && i.is(filter) )
			{
				var child : T = i.as(type);
				var node : TypedProxyTree<T, F> = new TypedProxyTree<T, F>( child, getChildList, type, filter );
				childNodeMap.set( child, node );
				add( node );
			}
			else
				debug( i );
		}
#if debug
		ok = false;
#end
	}
		
	private function sync( change : ListChange<T> )
	{
#if debug
		ok = true;
#end
		switch( change )
		{
			case added( item, newPos ): 
#if embed_perceptor
			if ( item.is(prime.perceptor.embedded.Inspector) )
			{
				
			}else
#end
				if ( item.is(filter) ) addChildNode( item ) else debug(item);
			case removed( item, oldPos ): if ( item.is(filter) ) removeChildNode( item ) else debug(item);
			case moved( item, newPos, oldPos ): // dont care, no need to maintain ordering
			case reset: clear();
			default:
		}
#if debug
		ok = false;
#end
	}
	
	// Recursively searchs subtrees for item, and returns index
	// on the subtree that has it, or -1 if item not found 
	public override function indexOf (item:TypedProxyTree<T, F>) : Int
	{
		/*var cur = first;
		var pos = -1, foundPos = -1;
		while (cur != null && foundPos == -1)
		{
			pos++;
			if (cur.data == item)
				foundPos = pos;
			
			cur = cur.next;
		}
		return foundPos;*/
		var i:Int = super.indexOf(item);
		/*if ( i == -1 )
			for ( child in this )
			{
				i = child.indexOf(item);
				if ( i != -1 )
					break;
			}*/
		return i;
	}
	
	private function addChildNode( child:T )
	{
#if debug
		Assert.isTrue( ok );
#end
		var node : TypedProxyTree<T, F> = new TypedProxyTree<T, F>( child, getChildList, type, filter );
		childNodeMap.set( child, node );
		add( node );
	}
	
	private function removeChildNode( child:T )
	{
		var node : TypedProxyTree<T, F> = childNodeMap.get( child );
#if debug
		Assert.isTrue( ok );
		Assert.isTrue( has( node ) );
		var h = has( node );
		var i = indexOf( node );
		var l = length;
		//trace( "removing:" + child + " from " + source );
#end
		childNodeMap.unset( child );
		remove( node );
		node.dispose();
	}
	
	private function clear()
	{
#if debug
		Assert.isTrue( ok );
#end
		childNodeMap.removeAll();
		removeAll();
	}	
	
	public function debug( item:T )
	{
		//trace("item rejected:" + item);
	}
	
	public function debugg(indent:Int=0)
	{
		var indentation:String = "["+indent+"]["+length+"]";
		for ( i in 0...indent )
			indentation += " ";
		trace( indentation + source );
		for ( node in this )
			node.debugg( indent + 1 );
	}
	
//#if debug
	public override function toString () {
		return "[" + length + "]:" + sourceId;
	}
//#end	
	
	////LIST MANIPULATION METHODS
	//
	//
	///**
	 //* Method will add the item on the given position. It will add the 
	 //* item at the end of the childlist when the value is equal to -1.
	 //* 
	 //* @param	item
	 //* @param	pos		default-value: -1
	 //* @return	item
	 //*/
	//public function add		(item:T, pos:Int = -1)						: T;
	///**
	 //* Method will try to remove the given item from the childlist.
	 //* 
	 //* @param	item
	 //* @return	item
	 //*/
	//public function remove	(item:T, oldPos:Int = -1)					: T;
	///**
	 //* Method will change the depth of the given item.
	 //* 
	 //* @param	item
	 //* @param	newPos
	 //* @param	curPos	Optional parameter that can be used to speed up the 
	 //* 					moving process since the list doesn't have to search 
	 //* 					for the original location of the item.
	 //* @return	item
	 //*/
	//public function move	(item:T, newPos:Int, curPos:Int = -1)		: T;
	//
	//public function removeAll ()
	//
	//public var change		(default, null)									: ListChangeSignal<T>;
	///**
	 //* TODO - Ruben sep 5, 2011:
	 //* Maybe combine change and beforeChange to one Signal2 that has an extra parameter
	 //* to indicate if the change is before or after applying the change..
	 //*/
	//public var beforeChange	(default, null)									: ListChangeSignal<T>;
	//public var length		(getLength, never)								: Int;
	//
	///**
	 //* Method will check if the requested item is in this collection
	 //* @param	item
	 //* @return	true if the item is in the list, otherwise false
	 //*/
	//public function has		(item:T)									: Bool;
	//
	///**
	 //* Method will return the index of the requested item or -1 of the item is 
	 //* not in the list.
	 //* @param	item
	 //* @return	position of the requested item
	 //*/
	//public function indexOf	(item:T)									: Int;
	//
	//
	//
	 //ITERATION METHODS
	//
	//
	//public function getItemAt (pos:Int)		: T;
	//public function iterator ()				: Iterator<T>;
	//public function forwardIterator ()		: IIterator<T>;
	//public function reversedIterator ()		: IIterator<T>;
	//
	//
//#if debug
	//public var name : String;
//#end
//
	//public function clone () : ClassType;
	//
	//public function duplicate () : ClassType;
	//
	//public function dispose() : Void;
}