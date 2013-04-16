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
 import prime.bindable.Bindable;
 import prime.bindable.Bindable;
 import prime.gui.core.UIDataComponent;
 import prime.gui.core.UITextField;
 import prime.gui.events.FocusState;
 import prime.gui.events.UserEventTarget;
 import prime.layout.AdvancedLayoutClient;
 import prime.gui.text.TextFormat;
 import prime.gui.traits.ITextStylable;
 import prime.gui.core.UIElementFlags;
  using prime.utils.Bind;
  using prime.utils.BitUtil;
  using prime.utils.TypeUtil;
  
  
private typedef Flags		= prime.gui.core.UIElementFlags;
  
/**
 * Functionally this class is the same as prime.gui.components.Label, except that it is not
 * typed to Bindable<String>. This allows ListLabel to be typed to match SelectableListView/ListView
 * and used as interactive children of those components, with references to data.
 * @author ...
 */
class ListLabel<T> extends UIDataComponent <T>, implements ITextStylable
{
	public var field				(default, null)				: UITextField;
	public var displayHTML			(default, setDisplayHTML)	: Bool;
	public var multiline			(default, setMultiline)		: Bool;
	
#if flash9
	public var textStyle			(default, setTextStyle)		: TextFormat;
	public var wordWrap				: Bool;
	public var embedFonts			: Bool;
#end
	private var text				: Bindable<String>;

	public function new(id:String, text:String, data:T)
	{
		this.text = new Bindable<String>(text);
		layout = new AdvancedLayoutClient();
		super(id, data);
	}
	
	override private function createChildren ()
	{
		field = UITextField.createLabelField(id.value+"TextField", text, this, layout.as(AdvancedLayoutClient) );
	//	behaviours.add( new LabelLayoutBehaviour(field) );
		field.attachDisplayTo( this );
	}
	
	
	override public  function disposeChildren ()
	{
		super.disposeChildren();
		field.dispose();
		field = null;
	}
	
	
	override private function initData ()		{ field.data = text; }
	override private function removeData ()		{ field.data = null; }
	
	
#if flash9
	override public function isFocusOwner (target:UserEventTarget)
	{
		return super.isFocusOwner(target) || field.isFocusOwner(target);
	}
#end

	override public function validate ()
	{
		var changes = this.changes;
		super.validate();
		
		if (changes.has(Flags.DISPLAY_HTML))	field.displayHTML	= displayHTML;
		if (changes.has(Flags.MULTILINE))		field.multiline		= multiline;
	}
	
	
	//
	// GETERS / SETTERS
	//
	
#if flash9
	private inline function setTextStyle (v:TextFormat)
	{
		if (field != null) {
			field.wordWrap		= wordWrap;
			field.embedFonts	= embedFonts;
			field.textStyle 	= v;
		}
		
		return textStyle = v;
	}
#end
	
	
	private inline function setDisplayHTML (v:Bool)
	{
		if (displayHTML != v)
		{
			displayHTML = v;
			invalidate( Flags.DISPLAY_HTML );
		}
		return v;
	}
	
	
	private inline function setMultiline (v:Bool)
	{
		if (multiline != v)
		{
			multiline = v;
			invalidate( Flags.MULTILINE );
		}
		return v;
	}
}