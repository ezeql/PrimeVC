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
package prime.gui.styling;
 import prime.gui.core.IUIContainer;
 import prime.gui.core.IUIElement;
 import prime.gui.display.IDisplayObject;
 import prime.gui.graphics.borders.EmptyBorder;
 import prime.gui.graphics.EmptyGraphicProperty;
 import prime.gui.graphics.GraphicProperties;
 import prime.gui.styling.StyleCollectionBase;
 import prime.gui.traits.IDrawable;
 import prime.gui.traits.ISkinnable;
  using prime.utils.BitUtil;
  using prime.utils.Color;
  using prime.utils.TypeUtil;
  using Type;


private typedef Flags = GraphicFlags;

/**
 * @author Ruben Weijers
 * @creation-date Okt 25, 2010
 */
class GraphicsCollection extends StyleCollectionBase < GraphicsStyle >
{
	public function new (elementStyle:UIElementStyle)			super( elementStyle, StyleFlags.GRAPHICS )
	override public function forwardIterator ()					return new GraphicsCollectionForwardIterator(elementStyle, propertyTypeFlag)
	override public function reversedIterator ()				return new GraphicsCollectionReversedIterator(elementStyle, propertyTypeFlag)
#if debug
	override public function readProperties (props:Int = -1)	return Flags.readProperties( (props == -1) ? filledProperties : props )
#end
	
	
	override public function apply ()
	{
		if (changes == 0)
			return;
		
		var target = elementStyle.target;
		if (!target.is(ISkinnable))		changes = changes.unset( Flags.SKIN );
		if (!target.is(IDrawable))		changes = changes.unset( Flags.DRAWING_PROPERTIES );
		if (!target.is(IUIContainer))	changes = changes.unset( Flags.OVERFLOW );
		if (!target.is(IUIElement))		changes = changes.unset( Flags.VISIBLE );
		if (!target.is(IDisplayObject))	changes = changes.unset( Flags.OPACITY ); // | Flags.VISIBLE );
		if (!target.is(IIconOwner))		changes = changes.unset( Flags.ICON | Flags.ICON_FILL );
		
		if (changes == 0)
			return;
		
		//
		// LOOP THROUGH ALL AVAILABLE STLYE-BLOCKS TO FIND THE STYLING PROPERTIES
		//
		
		var graphicProps:GraphicProperties = null;
#if flash9		
		if (changes.has( Flags.DRAWING_PROPERTIES ))
			graphicProps = elementStyle.target.as(IDrawable).graphicData;
#end		
		for (styleObj in this)
		{
			if (changes == 0)
				break;
			
			if (!styleObj.allFilledProperties.has( changes ))
				continue;
			
			var propsToSet	= styleObj.allFilledProperties.filter( changes );
			changes			= changes.unset( propsToSet );
			applyGraphicsStyleObj( propsToSet, styleObj, graphicProps );
		}
		
		if (changes > 0) {
			applyGraphicsStyleObj( changes, null, graphicProps );
			changes = 0;
		}
	}
	
	
	private function applyGraphicsStyleObj (propsToSet:Int, styleObj:GraphicsStyle, graphicProps:GraphicProperties)
	{
		var target	= elementStyle.target;
		var empty	= styleObj == null;
		
		if ( propsToSet.has( Flags.SHAPE ))			graphicProps.shape					= empty ? null	: styleObj.shape;
		if ( propsToSet.has( Flags.BORDER_RADIUS ))	graphicProps.borderRadius			= empty ? null	: styleObj.borderRadius;
#if flash9
		if ( propsToSet.has( Flags.ICON ))			target.as(IIconOwner).icon			= empty ? null	: styleObj.getIconInstance(); 
#end
		if ( propsToSet.has( Flags.ICON_FILL ))		target.as(IIconOwner).iconFill		= empty ? null	: styleObj.iconFill;
		if ( propsToSet.has( Flags.OPACITY ))		target.as(IDisplayObject).alpha		= empty ? 1		: styleObj.opacity;
		
		
		if ( propsToSet.has( Flags.VISIBLE ))
		{
			var t = target.as(IUIElement);	//save assumption since the 'apply' method otherwise would have filtered the VISIBLE flag
			if (!empty && !styleObj.visible)	t.hide();
			else if (!t.visible)				t.show();
		}
		
		
		if (propsToSet.has( Flags.OVERFLOW ))
		{
			var target = target.as(IUIContainer);

			//remove old overflow behaviours
			for (b in target.behaviours.list)
				if (b.is(prime.gui.behaviours.scroll.IScrollBehaviour)) {
					target.behaviours.remove(b);
					break;
				}

			//create new overflow behaviour
			if (!empty && styleObj.overflow != null)
				target.behaviours.add( styleObj.overflow(target) );
		}
		
		
		if ( propsToSet.has( Flags.SKIN ))
		{
		    var target = target.as(ISkinnable);
		    if (target.skin != null)
		        target.skin.dispose();
		    
		    target.skin = (empty || styleObj.skin == null) ? null : styleObj.skin();
		}
		
		
		
		if ( propsToSet.has( Flags.BACKGROUND ))
			graphicProps.fill = (empty || styleObj.background.is(EmptyGraphicProperty)) ? null : styleObj.background;
		
		if ( propsToSet.has( Flags.BORDER ))
			graphicProps.border = (empty || styleObj.border.is(EmptyBorder)) ? null : styleObj.border;
	}
}


class GraphicsCollectionForwardIterator extends StyleCollectionForwardIterator < GraphicsStyle >
{
	override public function next ()	{ return setNext().data.graphics; }
}


class GraphicsCollectionReversedIterator extends StyleCollectionReversedIterator < GraphicsStyle >
{
	override public function next ()	{ return setNext().data.graphics; }
}