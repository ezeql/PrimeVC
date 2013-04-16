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
 import prime.bindable.Bindable;
 import prime.bindable.Bindable;
 import prime.bindable.Bindable;
 import prime.bindable.collections.SimpleList;
 import prime.bindable.collections.SimpleList;
 import prime.bindable.collections.SimpleList;
 import prime.bindable.collections.SimpleList;
 import prime.bindable.collections.SimpleList;
 import prime.bindable.collections.SimpleList;
 import prime.gui.components.Label;
 import prime.gui.core.UIContainer;
 import prime.gui.components.SelectableListView;
 import prime.gui.components.ListView;
 import prime.gui.core.UITextField;
 import prime.layout.algorithms.float.HorizontalFloatAlgorithm;
 import prime.gui.core.IUIElement;
 import prime.gui.core.IUIComponent;
 import prime.gui.core.UIWindow;
 import prime.gui.display.IDisplayObject;
 import prime.gui.core.IUIDataElement;
 import prime.gui.core.UIDataContainer;
 import prime.bindable.collections.ListChange;
 import prime.gui.display.IDisplayContainer;
 import prime.gui.display.Window;
 import prime.bindable.collections.IReadOnlyList;
   using prime.utils.Bind;
   using prime.utils.TypeUtil;
	
/**
 * GUI data component designed to work with and visualise a TypedProxyTree,
 * which is stored in data property.
 * ...
 * @author ...
 */

// private typedef DataType = TypedProxyTree<T, F>;
 
class TreeComponent<T, F> extends UIDataContainer< TypedProxyTree<T, F> >
{
	private var label : Label;
	
	// Subtrees grouped in a container to simplify attaching/detaching
	// all at once
	private var subtrees : UIContainer;

	public function new ( data:TypedProxyTree<T, F>, isRoot:Bool = false )
	{
		super( isRoot ? "InspectorTreeComponentRoot" : "InspectorTreeComponent", data);
	}
	
	private function listChange( change : ListChange< TypedProxyTree<T, F> > )
	{
		switch( change )
		{
			case added( item, newPos ):
				var subtree : TreeComponent<T, F> = new TreeComponent<T, F>( item );
				subtree.attachTo( subtrees );
			case removed( item, oldPos ): 
			case moved( item, newPos, oldPos ):
			case reset:
			default:
		}
	}
 
	public override function createChildren()
	{
		super.createChildren();	
		
		label = new Label("InspectorTreeLabel", new Bindable<String>( data+"" ) );
		label.attachTo( this );
		
		subtrees = new UIContainer( "InspectorTreeContainer" );
		for ( subtreeData in data )
		{
			var subtree : TreeComponent<T, F> = new TreeComponent<T, F>( subtreeData );
			subtree.attachTo( subtrees );
		}
		subtrees.attachTo( this );
		
		toggleSubtrees.on( label.userEvents.mouse.click, this );
		listChange.on( data.change, this );
	}
	
	public function toggleSubtrees()
	{
		if ( subtrees.isOnStage() )
			subtrees.detach();
		else
			subtrees.attachTo( this );
	}
}