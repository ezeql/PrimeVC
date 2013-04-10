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
 import prime.bindable.collections.IReadOnlyList;
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
   using prime.utils.Bind;
   using prime.utils.TypeUtil;
	
/**
 * 
 * @author Danny Wilson
 * @creation-date Mar 20, 2013
 */
class Inspector extends UIContainer
{
	//private var window	: UIWindow;
	
	// A maintained duplicate of window.children with the first 3 children 
	// removed, as they are some flash specific stuff (DisplayObjectContainer, TextField, VectorShape).
	// prime.avm2.display.DisplayList.getItemAt(0) returns null because
	// this boot object isn't of type IDisplayObject, and this cascades into
	// index and null object errors with SelectableListView
	private var displayList : SimpleList<IDisplayObject>;
	private var dataList : SimpleList<String>;
	private var tree : SelectableListView<IDisplayObject>;
	private var data : ListView<String>;
	
	private var lastSelected : Bindable<IDisplayObject>;
	
	private var rootNode : InspectorNode<IDisplayObject>;	
	private var rootData : ListFilterPair;
	
	public function new( w:UIWindow )
	{
		super("Inspector");
		//window = w;
		
		//var lf:ListFilter<Class<IDisplayObject>> = new ListFilter();
		//var lff:ListFilter<Class<Int>> = new ListFilter();

		displayList = new SimpleList<IDisplayObject>();
		//listChange.on( w.children.change, this );
		
		//layoutContainer.algorithm = new HorizontalFloatAlgorithm();
		/*test.on( displayEvents.enterFrame, this );
		var c1 = w.children.getItemAt(0);
		var c2 = w.children.getItemAt(1);
		var c3 = w.children.getItemAt(2);
		trace(c1);
		trace(c2);
		trace(c3);*/
		dataList = new SimpleList<String>();
		//fill.on( w.children.change, this );
		fill(null);
		
		lastSelected = new Bindable<IDisplayObject>(null);
	}
	
	private function fill( change:ListChange<IDisplayObject> )
	{
		dataList.removeAll();
		var num : Int = 5;// + Std.random( 10 );
		for ( i in 0...num )
			dataList.add( Math.random()+"" );
		
	}
	
	private function treeSelected()
	{
		if ( lastSelected.value == tree.selected.value )
		{
			//same item selected again, close any child list
			trace("Reselected " + lastSelected.value);
		}
		else
		{
			// can we make child list
			trace("Selected " + tree.selected.value);
		}
		lastSelected.value = tree.selected.value;
		
	}
	
	private function listChange( change : ListChange<IDisplayObject> )
	{
		// restrict to IDisplayContainer for now, weird things come though that break stuff even more
		//trace( change );
		switch( change )
		{
			case added( item, newPos ): if( item.is(IDisplayContainer) ) displayList.add( item, newPos );
			case removed( item, oldPos ): if( item.is(IDisplayContainer) ) displayList.remove( item, oldPos );
			case moved( item, newPos, oldPos ): if( item.is(IDisplayContainer) ) displayList.move( item, newPos, oldPos );
			case reset:
			default:
		}
	}
	
	private override function createChildren ()	: Void
	{
		super.createChildren();
		
		if ( false )
		{			
			tree = new SelectableListView( "InspectorTree" );
			//tree.styleClasses.add( "InspectorTree" );
			
			//lastSelected.bind( tree.selected );
			
			tree.data = displayList;
			tree.createItemRenderer = DisplayObjectItemRenderer;
			tree.attachTo( this );
			
			data = new ListView( "InspectorData" );
			data.data = dataList;
			data.createItemRenderer = StringObjectItemRenderer;
			data.attachTo( this );
			
			treeSelected.on( tree.itemSelected, this );
		}
		else
		{
			//rootNode = new InspectorNode<IDisplayObject>( this, null, this, targetClassChildListResolver, targetClassLabelString );
			//rootNode.attachTo( this );
		}
	}
	
	public function go()
	{
		rootData = new ListFilterPair( window.children, displayList, [IDisplayContainer] );
		//listChange.on( window.children.change, this );
		// root created here because of an ordering problem with display list changes
		rootNode = new InspectorNode<IDisplayObject>( this, null, this, targetClassChildListResolver, targetClassLabelString );
		rootNode.attachTo( this );
		
		
		//test.on( displayEvents.enterFrame, this );
	}
	
	private var cnt:Int;
	public function test()
	{
		if (cnt++ == 100)
			cnt;
	}
	
	private function targetClassChildListResolver( data:IDisplayObject ) : IReadOnlyList<IDisplayObject>
	{
		// rootNode is initialised with the filtered display list
		if ( data == this )
			return displayList;
		if( data.is( IDisplayContainer ) )
			return data.as( IDisplayContainer ).children;
		return null;
	}
	
	private function targetClassLabelString( data:IDisplayObject ):String
	{
		//Assert.isTrue( data.is( IDisplayContainer ) );
		var hasChildren : Bool = false;
		var numChildren : Int = 0;
		if ( data.is( IDisplayContainer ) )
			numChildren = data.as( IDisplayContainer ).children.length;
		
		var cn : String = Type.getClassName(Type.getClass(data));
		cn = cn.substr( cn.lastIndexOf( "." )+1 );
		var s : String =  "[" + numChildren + "] " + data.name + ":" + cn;
		return s;
	}
	
	private function StringObjectItemRenderer( data : String, depth : Int ) : IUIDataElement<String>
	{
		var item : UIDataContainer<String> = new UIDataContainer( "InspectorDataLabelContainer", data );
		var label : Label = new Label( "InspectorDataLabel", new Bindable( data ) );
		item.attach( label );
		return item;
		//return label;
	}
	
	private function DisplayObjectItemRenderer( data : IDisplayObject, depth : Int ) : IUIDataElement<IDisplayObject>
	{
		var item : UIDataContainer<IDisplayObject> = new UIDataContainer( "InspectorTreeLabelContainer", data );
		
		Assert.isTrue( data.is( IDisplayContainer ) );
		var hasChildren : Bool = false;
		var numChildren : Int = 0;
		if ( data.is( IDisplayContainer ) )
			numChildren = data.as( IDisplayContainer ).children.length;
		
		var cn : String = Type.getClassName(Type.getClass(data));
		cn = cn.substr( cn.lastIndexOf( "." )+1 );
		var s : String =  "["+numChildren+"] " + data.name+":"+ cn;
		
		/*
		 * When using Label class, it is a datacomponent but the data type is of 
		 * Bindable<String>, so when you click on it, SelectableListView select handler tries to find
		 * a renderer for Bindable<String> when it is typed to data of IDisplayObject - coercion error.
		 * 
		 * Disable the label and select events pass through to the parent UIDataContainer, which is typed
		 * correctly and has correct data
		 * */
		var label : Label = new Label( "InspectorTreeLabel", new Bindable( s ) );
		label.disable();
		item.attach( label );
		
		return item;
	}
	
	private function targetIDisplayObjectLabelString( target:IDisplayObject ) : String
	{
		Assert.isTrue( data.is( IDisplayContainer ) );
		var hasChildren : Bool = false;
		var numChildren : Int = 0;
		if ( data.is( IDisplayContainer ) )
			numChildren = data.as( IDisplayContainer ).children.length;
		
		var cn : String = Type.getClassName(Type.getClass(data));
		cn = cn.substr( cn.lastIndexOf( "." )+1 );
		var s : String =  "[" + numChildren + "] " + data.name + ":" + cn;
		
		return s;
	}
}
