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
 * ...
 * @author ...
 */
  
class InspectorNode<TargetClass> extends UIDataContainer<TargetClass>
{
	public var depth:Int;
	private var inspector:Inspector;
	
	/* inspector hierachy
	 * 
	 * parentNode
	 * 		+this
	 * 			+childNodes
	 * */ 	
	private var parentNode:InspectorNode<TargetClass>;
	private var childNodes:SimpleList<InspectorNode<TargetClass>>;
	
	/* data hierachy
	 * 
	 * target
	 * 		+targetChildren 
	 * */
	private var target:TargetClass;
	private var targetChildren:IReadOnlyList<TargetClass>;
	
	
	/* display/layout hierachy
	 * 
	 * parentNode:InspectorNode
	 * 		+childrenView:SelectableListView 
	 * 			+this
	 * 				+childrenView [item:Inspector, data:TargetClass]
	 * */
	private var childrenView:SelectableListView<TargetClass>;
	
	private var childListResolver:TargetClass -> IReadOnlyList<TargetClass>;
	private var targetClassLabelString:TargetClass -> String;

	private var lastSelected : Bindable<TargetClass>;
	
	public function new(inspector:Inspector, parentNode:InspectorNode<TargetClass>, target:TargetClass, childListResolver:TargetClass -> IReadOnlyList<TargetClass>, targetClassLabelString:TargetClass -> String ) 
	{
		super("InspectorNode", target);
		
		this.inspector = inspector;
		this.parentNode = parentNode;
		this.target = target;
		this.childListResolver = childListResolver;
		this.targetClassLabelString = targetClassLabelString;
		depth = parentNode != null ? parentNode.depth + 1 : 0;
		lastSelected = new Bindable<TargetClass>(null);
		childNodes = new SimpleList<InspectorNode<TargetClass>>();
	}
	
	override public function dispose()
	{
		super.dispose();
		if( parentNode != null )
			parentNode.destroyChildNode( this );
	}	
	
	private function destroyChildNode( child : InspectorNode<TargetClass> )
	{
		childNodes.remove( child );
	}
	
	private function createChildNode( data : TargetClass, depth : Int ) : IUIDataElement<TargetClass>
	{
		var item : InspectorNode<TargetClass> = new InspectorNode( inspector, this, data, childListResolver, targetClassLabelString );
		
		childNodes.add( item );
		
		/*
		 * When using Label class, it is a datacomponent but the data type is of 
		 * Bindable<String>, so when you click on it, SelectableListView select handler tries to find
		 * a renderer for Bindable<String> when it is typed to TargetClass (could be anything), this results in coercion error.
		 * 
		 * Disable the label and select events pass through to the parent InspectorNode, which is typed correctly but will
		 * have different data.
		 * */
		var label : Label = new Label( "InspectorTreeLabel", new Bindable( targetClassLabelString(data) ) );
		label.disable();
		item.attach( label );
		trace( depth + ":" + targetClassLabelString(data) );
		return item;
	}
	
	private override function createChildren ()	: Void
	{
		super.createChildren();
		
		targetChildren = childListResolver( target );
		//Assert.isNotNull( targetChildren );
		
		childrenView = new SelectableListView( "InspectorTree" );
		childrenView.data = targetChildren;
		childrenView.createItemRenderer = createChildNode;
		childrenView.attachTo( this );
		
		//childrenView.on( tree.itemSelected, this );
	}
	
	public function toggleChildrenView()
	{
		Assert.isNotNull( childNodes );
		if ( childrenView.container == null )
			childrenView.attachTo( this );
		else
			childrenView.detach();
	}
}