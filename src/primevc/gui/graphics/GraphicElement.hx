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
 *  Ruben Weijers	<ruben @ onlinetouch.nl>
 */
package primevc.gui.graphics;
 import primevc.core.traits.Invalidatable;
#if neko
 import primevc.tools.generator.ICodeGenerator;
#end
#if (neko || debug)
 import primevc.utils.ID;
#end



/**
 * Base class for all graphic elements.
 * 
 * @author Ruben Weijers
 * @creation-date Jul 31, 2010
 */
class GraphicElement extends Invalidatable, implements IGraphicElement 
{
#if (neko || debug)
	public var _oid (default, null)	: Int;
	
	
	public function new ()
	{
		super();
		_oid = ID.getNext();
	}
	
	
	override public function dispose ()
	{
		_oid = 0;
		super.dispose();
	}
#end

#if neko	
	public function toCode (code:ICodeGenerator) { Assert.abstract(); }
#end


#if (neko || debug)
	public function toString () : String				{ return toCSS(); }
	@:keep public function toCSS (prefix:String = "") : String	{ /*Assert.abstract();*/ return "GraphicElement"; }
	public function isEmpty () : Bool					{ return false; }
	public function cleanUp () : Void					{}
#end
}