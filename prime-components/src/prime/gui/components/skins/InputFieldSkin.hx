

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
package prime.gui.components.skins;
 import prime.gui.components.InputField;
 import prime.gui.events.KeyboardEvents;
 import prime.gui.input.KeyCodes;
  using prime.utils.BitUtil;
  using prime.utils.Bind;
  using prime.utils.TypeUtil;


private typedef Flags = prime.gui.core.UIElementFlags;


/**
 * Default-Skin for InputField with support for an icon and the textfield
 * 
 * @author Ruben Weijers
 * @creation-date Jan 27, 2011
 */
class InputFieldSkin extends ButtonIconLabelSkin
{
	override public function createChildren ()
	{
		super.createChildren();
		var owner = getInputField();
		labelField.restrict				= owner.restrict;
		labelField.maxChars				= owner.maxChars;
		
#if flash9
		labelField.makeEditable();
		labelField.mouseEnabled = labelField.tabEnabled = true;
#end
		(untyped owner).field	= labelField;
		checkToUpdateVO.on( labelField.userEvents.key.down, this );
		resetHorScroll .on( owner.userEvents.blur, this );		// make sure the inputfield scrolls back when it loses focus

		owner.setFocus.on( owner.userEvents.mouse.down, this );
	//	owner.setFocus.on( iconGraphic.userEvents.mouse.down, this );
	}


	override public function disposeChildren ()
	{
		labelField.userEvents.key.down.unbind(this);
		owner.userEvents.blur.unbind(this);
		super.disposeChildren();
	}
	
	
	private inline function getInputField () {
		return owner.as(InputField);
	}
	
	
	override public function validate (changes:Int)
	{
		super.validate(changes);
		if (changes.has( Flags.RESTRICT | Flags.MAX_CHARS ))
		{
			var owner = getInputField();
			if (changes.has( Flags.RESTRICT ))		labelField.restrict	= owner.restrict;
			if (changes.has( Flags.MAX_CHARS ))		labelField.maxChars	= owner.maxChars;
		}
	}
	
	
	private function checkToUpdateVO (state:KeyboardState) : Void
	{
		if		(KeyCodes.isEnter( state.keyCode() ))	getInputField().applyInput();
		else if (state.keyCode() == KeyCodes.ESCAPE)	getInputField().cancelInput();
	}


	private function resetHorScroll ()
	{
		labelField.scrollH = 0;
	}
}