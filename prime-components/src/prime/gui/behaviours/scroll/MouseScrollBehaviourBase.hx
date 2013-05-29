

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
package prime.gui.behaviours.scroll;
#if !CSSParser
 import prime.signals.Wire;
 import prime.gui.events.MouseEvents;
  using prime.utils.Bind;
  using prime.utils.TypeUtil;
#end


/**
 * Base class for scrolling behaviours that react on the mouseposition.
 * 
 * @author Ruben Weijers
 * @creation-date Jul 29, 2010
 */
class MouseScrollBehaviourBase extends prime.gui.behaviours.BehaviourBase<prime.gui.traits.IScrollable>, implements IScrollBehaviour
{
#if !CSSParser
	private var activateBinding		: Wire < Dynamic >;
	private var deactivateBinding	: Wire < Dynamic >;
	private var calcScrollBinding	: Wire < Dynamic >;
	
	
	override private function init ()
	{
		Assert.isNotNull( target.scrollableLayout, "target.layout of "+target+" must be a IScrollableLayout" );
		target.enableClipping();
		if (target.container == null)
			addListeners.onceOn(target.displayEvents.addedToStage, this);
		else
			addListeners();
	}


	private function addListeners ()
	{
		var mouse = target.container.userEvents.mouse;
		activateBinding		= mouse.rollOver.bind(this, activateScrolling);
		deactivateBinding	= mouse.rollOut.observeDisabled(this, deactivateScrolling);
		calcScrollBinding	= mouse.move.bindDisabled(this, calculateScroll);
	}
	
	
	override private function reset ()
	{
		trace(this+" - "+target);
		target.displayEvents.addedToStage.unbind(this);
		calcScrollBinding.dispose();
		activateBinding.dispose();
		deactivateBinding.dispose();
		activateBinding		= null;
		deactivateBinding	= null;
		calcScrollBinding	= null;
		target.disableClipping();
	}


	private function activateScrolling (mouseObj:MouseState) {
		if (!target.isScrollable)
			return;
		
		activateBinding.disable();
		deactivateBinding.enable();
		calcScrollBinding.enable();
		
		calculateScroll( mouseObj );
	}


	private function deactivateScrolling () {
		calcScrollBinding.disable();
		deactivateBinding.disable();
		activateBinding.enable();
	}
	
	
	private function calculateScroll (mouseObj:MouseState) {
	#if debug
		throw "Method calculateScrollPosition should be overwritten";
	#end
	}
#end
}