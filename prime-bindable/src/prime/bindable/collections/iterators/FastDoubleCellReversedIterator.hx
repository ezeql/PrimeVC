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
 *  Ruben Weijers	<ruben @ prime.vc>
 */
package prime.bindable.collections.iterators;
 import prime.bindable.collections.FastDoubleCell;


/**
 * Iterate object for the DoubleFastList implementation
 * 
 * @creation-date	Jul 23, 2010
 * @author			Ruben Weijers
 */
#if flash9 @:generic #end
class FastDoubleCellReversedIterator <T> implements IIterator <T>
{
	private var last (default, null)	: FastDoubleCell<T>;
	public var current (default, null)	: FastDoubleCell<T>;

	public function new (last:FastDoubleCell<T>) 
	{
		this.last = last;
		rewind();
#if (unitTesting && debug)
		test();
#end
	}

	@:keep public #if !noinline inline #end function setCurrent (val:Dynamic)	{ current = val; }
	@:keep public #if !noinline inline #end function rewind ()				{ current = last; }
	@:keep public #if !noinline inline #end function hasNext ()				{ return current != null; }
	@:keep public #if !noinline inline #end function value ()					{ return current.data; }

	@:keep public #if !noinline inline #end function next () : T
	{
		var c = current;
		current = current.prev;
		return c.data;
	}
	
	
#if (unitTesting && debug)
	public function test ()
	{
		var cur = last, prev:FastDoubleCell<T> = null;
		while (cur != null)
		{
			if (prev == null)	Assert.isNull( cur.next );
			else				Assert.isEqual( cur.next, prev );
			
			prev	= cur;
			cur		= cur.prev;
		}
	}
#end
}