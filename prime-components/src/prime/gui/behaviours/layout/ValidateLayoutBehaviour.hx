

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
package prime.gui.behaviours.layout;
 import prime.bindable.collections.FastDoubleCell;
 import prime.signals.Wire;
 import prime.gui.behaviours.ValidatingBehaviour;
 import prime.gui.core.IUIElement;
 import prime.layout.LayoutClient;
 import prime.layout.LayoutFlags;
 import prime.fsm.states.ValidateStates;
 import prime.gui.traits.IDrawable;
 import prime.gui.traits.IPropertyValidator;
  using prime.utils.Bind;
  using prime.utils.BitUtil;
  using prime.utils.IfUtil;
  using prime.utils.TypeUtil;
 

/**
 * Instance will trigger layout.validate on a 'enterFrame event' when the 
 * layout is invalidated or when the target is added to the stage with an 
 * invalidated layout.
 * 
 * @creation-date	Jun 14, 2010
 * @author			Ruben Weijers
 */
class ValidateLayoutBehaviour extends ValidatingBehaviour < IUIElement >, implements IPropertyValidator
{
	private var isNotPositionedYet	: Bool;
	private var isNotSizedYet		: Bool;
	private var stateChangeWire		: Wire<Dynamic>;
	private var layoutChangeWire	: Wire<Dynamic>;
	
	
	override private function init ()
	{
		var layout			= target.layout;
		isNotPositionedYet	= true;
		isNotSizedYet		= true;
#if debug
		Assert.isNotNull(layout, "Layout of "+target+" can't be null for "+this);
		layout.name = target.id.value+"Layout";
#end
		stateChangeWire		= layoutStateChangeHandler	.on( layout.state.change, this );
		layoutChangeWire	= applyChanges				.on( layout.changed, this );
		
		updateTarget.on( target.displayEvents.addedToStage, this );
		disableWires.on( target.displayEvents.removedFromStage, this );
		
		if (isOnStage())	updateTarget();
		else				disableWires();
	}
	
	
	override private function reset ()
	{
		if (target.layout.isNull())
			return;
		
		target.displayEvents.addedToStage.unbind( this );
		target.displayEvents.removedFromStage.unbind( this );
		
		if (stateChangeWire.notNull())		stateChangeWire.dispose();
		if (layoutChangeWire.notNull())		layoutChangeWire.dispose();
		
		super.reset();
	}
	
	
	private function updateTarget ()
	{
		stateChangeWire.enable();
		layoutChangeWire.enable();
		
		var curState = target.layout.state.current;
		layoutStateChangeHandler( curState, null );
		
		if (curState == ValidateStates.validated)
			applyChanges( LayoutFlags.POSITION | LayoutFlags.SIZE );
	}
	
	
	private function disableWires ()
	{
		stateChangeWire.disable();
		layoutChangeWire.disable();
		
		if (isQueued())
			getValidationManager().remove( this );
		
		Assert.that(!isQueued());
	}
	
	
#if debug
	/**
	 * method will return the state of all the parents/grandparents of the 
	 * given layoutclient
	 */
	private function getParentsState (layout:LayoutClient, level:Int = 0) : String
	{
		var s = "\n\t\t\t\t[ "+level+" ] = "+layout+" => "+layout.state.current; //+"; in queue? "+isQueued();
		if (layout.parent.notNull())
			s += getParentsState( cast layout.parent, level + 1 );
		
		return s;
	}
#end
	
	private function layoutStateChangeHandler (newState:ValidateStates, oldState:ValidateStates)
	{
#if debug	untyped Assert.that(target.isOnStage(), target); #end
		
	//	if (isQueued() && newState == ValidateStates.parent_invalidated)
	//		getValidationManager().remove( this );
	
		if (newState == ValidateStates.invalidated)
			invalidate();
		
	//	else if (newState == ValidateStates.validated) // && !target.layout.includeInLayout)		will happen in the queuemanager
	//		getValidationManager().remove(this);
	}
	
	
	public #if !noinline inline #end function invalidate ()				getValidationManager().add( this )
	public #if !noinline inline #end function validate ()					if (target.notNull()) { target.layout.validate(); }
	override private function getValidationManager ()	return isOnStage() ? target.system.invalidation : null
	
	
	public function applyChanges (changes:Int)
	{
		var l = target.layout;
		
	//	if (changes.has( LayoutFlags.SIZE | LayoutFlags.POSITION ) && Std.string(target) == "publicationIndexPanel")
	//		trace(target+"; oldPos: "+target.x+", "+target.y+"; newPos: "+l.getHorPosition()+", "+l.getVerPosition()+"; "+changes.has( LayoutFlags.POSITION )+"; margin: "+l.margin+"; padding: "+l.padding);
	//	trace(target+"; oldSize: "+target.rect.width+", "+target.rect.height+"; newSize: "+l.innerBounds.width+", "+l.innerBounds.height+"; "+changes.has( LayoutFlags.SIZE )+"; measured: "+(untyped l).measuredWidth+", "+(untyped l).measuredHeight+"; explicit: "+(untyped l).explicitWidth+", "+(untyped l).explicitHeight);
		
		if (changes.has( LayoutFlags.POSITION ))
		{
			if (isNotPositionedYet || target.effects.isNull())
			{
				var l = target.layout;
				var newX = l.getHorPosition();
				var newY = l.getVerPosition();
				
//#if debug		Assert.that( newX > -10000 && newX < 10000, target+".invalidX: "+newX+"; "+target.container );
//				Assert.that( newY > -10000 && newY < 10000, target+".invalidY: "+newY+"; "+target.container ); #end
				
				if (isNotPositionedYet || target.x != newX || target.y != newY)
				{
					target.rect.move( newX, newY );
					target.x = newX;
					target.y = newY;
					isNotPositionedYet = false;
				}
			}
			else
				target.effects.playMove();
		}
		
		
		
		if (changes.has( LayoutFlags.SIZE ))
		{
			if (isNotSizedYet || target.effects.isNull())
			{
				var b = target.layout.innerBounds;
//#if debug		Assert.that(b.width < 10000 && b.width > -1, target+".invalidWidth: "+b+"; "+target.container);
//				Assert.that(b.height < 10000 && b.height > -1, target+".invalidHeight: "+b+"; "+target.container); #end
				target.rect.resize( b.width, b.height );
				
				if (!target.is(IDrawable)) {
					target.width	= target.rect.width;
					target.height	= target.rect.height;
				}
				isNotSizedYet = false;
			}
			else
				target.effects.playResize();
		}
	}
	
	
#if debug
	override public function toString ()
	{
		var className = Type.getClassName( Type.getClass( this ) );
		return className.split(".").pop() + " ( "+target+"."+target.layout.state.current+" )";
	}
#end
}