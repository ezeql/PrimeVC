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
 import prime.bindable.collections.ListChange;
   using prime.utils.Bind;
   using prime.utils.TypeUtil;
   
/**
 * Takes two lists A and B, keeps list B in sync
 * with A only for the given class types.
 * 
 * @author AndrewP
 */
class ListFilterPair
{
	public var from:IReadOnlyList<Dynamic>;
	public var to:IEditableList<Dynamic>;
	public var filters:Array<Class<Dynamic>>;
	private var filter:Class<Dynamic>;
	
	public function new( from:IReadOnlyList<Dynamic>, to:IEditableList<Dynamic>, filters:Array<Class<Dynamic>> ) 
	{
		this.from = from;
		this.to = to;
		this.filters = filters;
		
		if ( filters.length == 1 )
		{
			filter = filters[0];
			listChangeSingle.on( from.change, this );
		}
		else
			listChange.on( from.change, this );
	}
	
	private function listChangeSingle( change : ListChange<Dynamic> )
	{
		switch( change )
		{
			case added( item, newPos ): if ( item.is(filter) ) to.add( item, newPos ) else debug(item);
			case removed( item, oldPos ): if ( item.is(filter) ) to.remove( item, oldPos ) else debug(item);
			case moved( item, newPos, oldPos ): if ( item.is(filter) ) to.move( item, newPos, oldPos ) else debug(item);
			case reset: to.removeAll();
			default:
		}
	}
	
	private function listChange( change : ListChange<Dynamic> )
	{
		switch( change )
		{
			case added( item, newPos ): if(check(item)) to.add( item, newPos );
			case removed( item, oldPos ): if(check(item)) to.remove( item, oldPos );
			case moved( item, newPos, oldPos ): if(check(item)) to.move( item, newPos, oldPos );
			case reset: to.removeAll();
			default:
		}
	}
	
	private /*inline*/ function check( item:Dynamic ):Bool
	{
		for ( f in filters )
			if ( item.is(filter) )
				return true;
		debug(item);
		return false;
	}
	
	private inline function debug( item:Dynamic )
	{
		trace( "item did not meet filter conditions:" + item + ", class:" + Type.getClass(item));
	}
}