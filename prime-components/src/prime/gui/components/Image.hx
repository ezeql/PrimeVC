

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
package prime.gui.components;
#if flash9
 import flash.geom.ColorTransform;
#end
 import prime.gui.core.UIDataComponent;
 import prime.gui.graphics.fills.BitmapFill;
 import prime.gui.graphics.fills.SolidFill;
 import prime.gui.graphics.IGraphicElement;
 import prime.layout.AdvancedLayoutClient;
 import prime.layout.LayoutFlags;
 import prime.types.Asset;
 import prime.types.Number;
  using prime.utils.Bind;
  using prime.utils.BitUtil;
  using prime.utils.Color;
  using prime.utils.NumberUtil;
  using prime.utils.TypeUtil;


/**
 * @author Ruben Weijers
 * @creation-date Oct 31, 2010
 */
class Image extends UIDataComponent<Asset>	//FIXME (Ruben @ Mar 16, '11): used to be a UIGraphic, but since we want vectors to be children, this is not possible.. Change back when refactoring
{
	/**
	 * Bool indicating wether the image should maintain its aspect-ratio
	 * @default true
	 */
	public var maintainAspectRatio	(default, setMaintainAspectRatio)	: Bool;
	
#if flash9
	public var assetChild			(default, null) 					: flash.display.DisplayObject;
	public var assetFill			(default, null) 					: BitmapFill;
#end
	
	
	public function new (id:String = null, data:Asset = null, enabled:Bool = false)
	{
	    layout = new AdvancedLayoutClient();
		super(id, data);
		this.maintainAspectRatio = true;
		if (!enabled)
			disable();
	}
	
	
	override public function getDataCursor ()	{ return null; }
	
	
	override private function initData () : Void
	{
		assetStateChangeHandler.on( data.state.change, this );
		
		if (data.state.is(AssetStates.loadable)) {
			cancelLoading.onceOn( displayEvents.removedFromStage, data );
			data.load();
		}
		else if (data.state.is(AssetStates.ready))		applyAsset();
	}
	
	
	override private function removeData () : Void
	{
		data.state.change.unbind(this);
		unsetAsset();
	}
	
	
	private function applyAsset ()
	{
#if flash9
		Assert.isNotNull(data.type);
		
		switch (data.type)
		{
			case AssetType.displayObject:	applyDisplayObject();
			case AssetType.bitmapData:		applyBitmapData();
		}
		
		displayEvents.removedFromStage.unbind( data );
		updateSize();
#end
	}


	private inline function applyBitmapData ()
	{
		if (graphicData.fill == null || !graphicData.fill.is(BitmapFill))
			graphicData.fill = assetFill = new BitmapFill( null, data, null, false );
		
		else if (graphicData.fill.is(BitmapFill)) {
			assetFill		= graphicData.fill.as(BitmapFill);
			assetFill.asset	= data;
		}
	}


	private inline function applyDisplayObject ()
	{
		addChild( assetChild = data.toDisplayObject() );
		updateChildSize.on( layout.changed, this );
		updateChildSize(LayoutFlags.SIZE);
	}
	
	
	
	private function unsetAsset ()
	{
#if flash9
		if (data.type == null)
			return;
		
		displayEvents.removedFromStage.unbind( data );
		Assert.isNotNull(data.type, "asset: "+data);
		switch (data.type)
		{
			case AssetType.displayObject:
				if (assetChild != null) {
					layout.changed.unbind(this);
					removeChild( assetChild );
					assetChild = null;
				}

			case AssetType.bitmapData:
				if (assetFill != null)
					graphicData.fill = assetFill = null;
		}

		updateSize();
#end
	}
	
	
	
	public function colorize (fill:IGraphicElement)
	{
#if flash9
		if (fill == null || !fill.is(SolidFill))
			return;
		
		var a = alpha;
		var t = new ColorTransform();
		t.color						= fill.as(SolidFill).color.rgb();
		t.alphaMultiplier			= a;
		transform.colorTransform	= t;
#end
	}
	
	
	private function updateChildSize (changes:Int)
	{
#if flash9
		if (changes.hasNone( LayoutFlags.SIZE ))
			return;
		
	//	trace(this+".newsize: "+layout.innerBounds.width+", "+layout.innerBounds.height+"; oldSize: "+assetChild.width+", "+assetChild.height+"; dataWidth "+data.width+", "+data.height+"; state: "+assetChild.scrollRect);
		Assert.isNotNull( assetChild );
		// setting the width will go wrong the first time when the asset is an swf
	//	assetChild.width	= layout.innerBounds.width;
	//	assetChild.height	= layout.innerBounds.height;
		assetChild.scaleX	= assetChild.scaleY = layout.innerBounds.width / data.width;
		
	//	trace(this+".cursize: "+assetChild.width+", "+assetChild.height+"; scaleXY: "+assetChild.scaleX+", "+assetChild.scaleY);
#end
	}
	
	
	
	
	//
	// GETTERS / SETTERS
	//
	
	
	private inline function setMaintainAspectRatio (v:Bool) : Bool
	{
		if (v != maintainAspectRatio)
		{
			maintainAspectRatio = v;
			if (layout != null)
				layout.maintainAspectRatio = v;
		}
		return v;
	}
	
	
	
	//
	// EVENT HANDLERS
	//
	
	private inline function updateSize ()
	{
		var l = layout.as(AdvancedLayoutClient);
		
		if (data != null && data.state.is( AssetStates.ready ))
		{
			l.maintainAspectRatio = maintainAspectRatio;
			l.measuredResize( data.width, data.height );
		}
		else
		{	
			l.maintainAspectRatio	= false;
			l.measuredWidth			= Number.INT_NOT_SET;
			l.measuredHeight		= Number.INT_NOT_SET;
		}
	//	trace("\t\t\t measured: "+this+"; "+l.measuredWidth+", "+l.measuredHeight+"; datasize: "+data.width+", "+data.height);
	}
	
	
	private function assetStateChangeHandler (newState:AssetStates, oldState:AssetStates)
	{
		switch (newState)
		{
			case AssetStates.ready:	applyAsset();
			case AssetStates.empty:	unsetAsset();
			
			case AssetStates.loading:
			case AssetStates.loadable:
			default:
		}
	}
	
	
	private function cancelLoading ()
	{
		data.close();
		initData.onceOn( displayEvents.addedToStage, this );
	}
}