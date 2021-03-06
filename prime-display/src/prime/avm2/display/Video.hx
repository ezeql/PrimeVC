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
package prime.avm2.display;
 import flash.display.DisplayObject;
 import prime.core.geom.IntRectangle;
 import prime.gui.display.DisplayDataCursor;
 import prime.gui.display.IDisplayContainer;
 import prime.gui.display.IDisplayObject;
 import prime.gui.display.ISprite;
 import prime.gui.display.IVideo;
 import prime.gui.display.Window;
 import prime.gui.events.DisplayEvents;
  using prime.utils.NumberUtil;
  using prime.utils.TypeUtil;


/**
 * AVM2 Video implementation
 * 
 * @author Ruben Weijers
 * @creation-date Jan 07, 2011
 */
class Video extends flash.media.Video, implements IVideo 
{
	public var container		(default, default)		: IDisplayContainer;
	public var window			(default, setWindow)	: Window;
	public var displayEvents	(default, null)			: DisplayEvents;
	public var rect				(default, null)			: IntRectangle;
	
	
	public function new () 
	{
		super();
		displayEvents	= new DisplayEvents( this );
		rect			= new IntRectangle( x.roundFloat(), y.roundFloat(), width.roundFloat(), height.roundFloat() );
	}
	
	
	public function dispose ()
	{
		if (displayEvents == null)
			return;		// already disposed
		
		if (container != null)
			container.children.remove(this);
		
		rect.dispose();
		displayEvents.dispose();
		
		displayEvents	= null;
		container		= null;
		window			= null;
		rect			= null;
	}


	public function isObjectOn (otherObj:IDisplayObject) : Bool
	{
		return otherObj == null ? false : otherObj.as(DisplayObject).hitTestObject( this.as(DisplayObject) );
	}
	
	
#if !CSSParser
	public function getDisplayCursor			() : DisplayDataCursor											{ return new DisplayDataCursor(this); }
	public #if !noinline inline #end function attachDisplayTo		(target:IDisplayContainer, pos:Int = -1)	: IDisplayObject	{ target.children.add( this, pos ); return this; }
	public #if !noinline inline #end function detachDisplay		()											: IDisplayObject	{ container.children.remove( this ); return this; }
	public #if !noinline inline #end function changeDisplayDepth	(newPos:Int)								: IDisplayObject	{ container.children.move( this, newPos ); return this; }
#end
	
	
	
	//
	// GETTERS / SETTERS
	//
	
/*	private inline function setContainer (v) {
		container	= v;
		if (v != null)	window = container.window;
		else			window = null;
		return v;
	}
*/	
	
	private inline function setWindow (v) {
		return window = v;
	}
}