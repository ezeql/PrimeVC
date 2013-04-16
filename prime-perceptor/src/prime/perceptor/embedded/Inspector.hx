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
 import prime.avm2.display.DisplayContainer;
 import prime.bindable.Bindable;
 import prime.bindable.Bindable;
 import prime.bindable.Bindable;
 import prime.bindable.Bindable;
 import prime.bindable.collections.IReadOnlyList;
 import prime.bindable.collections.IReadOnlyList;
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
 import prime.gui.display.DisplayObject;
 import prime.gui.display.IDisplayContainer;
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
	
	private var rootNode : InspectorNode<IDisplayObject>;	
	private var rootData : ListFilterPair;
	
	private var moretest : TypedProxyTree<IDisplayContainer, IDisplayContainer>;
	private var tree2 : SelectableListView < TypedProxyTree < IDisplayContainer, IDisplayContainer >> ;
	
	private var finalTree : TreeComponent< IDisplayContainer, IDisplayContainer >;
	
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
		fill.on( w.children.change, this );
		fill(null);
		
		lastSelected = new Bindable < TypedProxyTree < IDisplayContainer, IDisplayContainer >> (null);
		currentSelected  = new Bindable < TypedProxyTree < IDisplayContainer, IDisplayContainer >> (null);
		
		moretest = new TypedProxyTree < IDisplayContainer, IDisplayContainer > ( cast w.children.owner, g, IDisplayContainer, IDisplayContainer );
	}
	
	private function g( i:IDisplayContainer ) : IReadOnlyList<IDisplayContainer>
	{
		return cast i.children;
	}
	
	private function fill( change:ListChange<IDisplayObject> )
	{
		dataList.removeAll();
		var num : Int = 5;// + Std.random( 10 );
		for ( i in 0...num )
			dataList.add( Math.random()+"" );
		
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
			
			//callback( treeSelected, dataList ).on( tree.itemSelected, this );
		}
		else
		{		
			/*var t1:UIDataContainer<Int> = new UIDataContainer<Int>("t1",1);
			var t2:UIDataContainer<Int> = new UIDataContainer<Int>("t2",2);
			t3 = new UIDataContainer<Int>("t3",3);
		
			t1.stylingEnabled = t2.stylingEnabled = t3.stylingEnabled = false;
			
			t2.attachTo( t1 );
			t3.attachTo( t1 );*/
			//t1.addChild( t2 );
			//t1.addChild( t3 );
			//var tpt = new TypedProxyTree< IDisplayContainer, IDisplayContainer >( t1, g, IDisplayContainer, IDisplayContainer );
			
			tree2 = new SelectableListView( "InspectorTree" );
			
			var sl : SimpleList < TypedProxyTree < IDisplayContainer, IDisplayContainer >> = new SimpleList < TypedProxyTree < IDisplayContainer, IDisplayContainer >> ();
			//sl.add(  tpt );
			sl.add(  moretest );
			
			var tpt = new TypedProxyTree< IDisplayContainer, IDisplayContainer >( null, null, IDisplayContainer, IDisplayContainer );
			tpt.add( moretest );
			
			finalTree = new TreeComponent< IDisplayContainer, IDisplayContainer >( moretest, true );
			finalTree.attachTo( this );
			
			/*tree2.data = tpt;
			tree2.createItemRenderer = TypedProxyTreeRenderer;
			tree2.attachTo( this );*/
			//t1.attachTo( this );
						
			//for ( subtree in moretest )
			//	subtree.view.visible = false;
			
			//callback( treeSelected, tree2 ).on( tree2.itemSelected, this );
			//rt.on( this.displayEvents.enterFrame, this );
			//handleTreeSelection.on( this.displayEvents.enterFrame, this );
		}
	}	
	
	private var lastSelected : Bindable < TypedProxyTree < IDisplayContainer, IDisplayContainer >> ;
	private var currentSelected : Bindable<TypedProxyTree < IDisplayContainer, IDisplayContainer >>;
	
	private function handleTreeSelection()
	{
		if ( currentSelected.value == null )
			return;

		//moretest.debugg(); return;
		if ( lastSelected.value == currentSelected.value )
		{
			//lastSelected.value.view.visible = !lastSelected.value.view.visible;
			//for ( subtree in lastSelected.value )
			//	subtree.view.visible = !subtree.view.visible;
			
			trace("Reselected " + lastSelected.value.sourceId);
		}
		else
		{
			/*if ( lastSelected.value != null )
				for ( subtree in lastSelected.value )
					subtree.view.visible = false;
			for ( subtree in currentSelected.value )
					subtree.view.visible = true;*/
			trace("Selected " + currentSelected.value.sourceId);
		}
moretest.debugg();
		lastSelected.value = currentSelected.value;
		currentSelected.value = null;
	}	
	
	private function treeSelected( t:TypedProxyTree<IDisplayContainer, IDisplayContainer>  )
	{
		if ( currentSelected.value != null )
			return;
		currentSelected.value = t;		
	}	
	
	var t3:UIDataContainer<Int>;
	var c:Int;
	public function rt()
	{
		
		if ( c++ == 100 )
		{
			//t3.displayEvents.enterFrame.unbind( this );
			//t3.dispose();
			//t3.detach();
			//tree2.visible = false;
		}
	}
	
	private function TypedProxyTreeRenderer( data : TypedProxyTree<IDisplayContainer,IDisplayContainer>, depth : Int ) : IUIDataElement<TypedProxyTree<IDisplayContainer,IDisplayContainer>>
	{
		var item : UIDataContainer<TypedProxyTree<IDisplayContainer,IDisplayContainer>> = new UIDataContainer( "InspectorTreeLabelContainer", data );
		
		//Assert.isTrue( data.is( IDisplayContainer ) );
		var hasChildren : Bool = false;
		var numChildren : Int = 0;
		//if ( data.is( IDisplayContainer ) )
			numChildren = data.length;
		//
		var cn : String = Type.getClassName(Type.getClass(data.source));
		cn = cn.substr( cn.lastIndexOf( "." )+1 );
		var s : String =  "["+numChildren+"] " + data.source +":"+ cn;
		//
		///*
		 //* When using Label class, it is a datacomponent but the data type is of 
		 //* Bindable<String>, so when you click on it, SelectableListView select handler tries to find
		 //* a renderer for Bindable<String> when it is typed to data of IDisplayObject - coercion error.
		 //* 
		 //* Disable the label and select events pass through to the parent UIDataContainer, which is typed
		 //* correctly and has correct data
		 //* */

		//var label : Label = new Label( "InspectorTreeLabel", new Bindable( s ) );
		
		var label : ListLabel < TypedProxyTree < IDisplayContainer, IDisplayContainer >> = new ListLabel < TypedProxyTree < IDisplayContainer, IDisplayContainer >> ( "InspectorTreeLabel", s, data );
		
		label.disable();
		item.attach( label );
		 for ( i in 0 ... 4 )
		 {
		//var label : Label = new Label( "InspectorTreeLabel", new Bindable( "the second" ) );
		//label.disable();
		//item.attach( label );
		 }
		// reference for the mouse click code to use
		data.view = item;
		
		
		//for ( node in data )
		{
			var subtreeview = new SelectableListView<TypedProxyTree < IDisplayContainer, IDisplayContainer >>( "InspectorTreeSub" );
	//
			subtreeview.data = data;
			subtreeview.createItemRenderer = TypedProxyTreeRenderer;
			
			//subtreeview.attachTo( this );
			item.attach( subtreeview );
			
			//
			//defaults to hidden, unhidden if parent is ever selected
			item.visible = false;
			//
			//callback( treeSelected, data ).on( subtreeview.itemSelected, this );
			//callback( treeSelected, data ).on( subtreeview.itemSelected, this );
		}
		
		// this needs delaying until the SelectableViewList its under can be reached
		callback( enableLabelClick, label, data ).onceOn( label.displayEvents.addedToStage, this );
		
		return item;
		//return null;
	}
	
	public function enableLabelClick( label : ListLabel < TypedProxyTree < IDisplayContainer, IDisplayContainer >>, data : TypedProxyTree<IDisplayContainer,IDisplayContainer> )
	{
		label.enable();
		var listParent : SelectableListView < TypedProxyTree < IDisplayContainer, IDisplayContainer >> = cast label.container.container;// .as( SelectableListView < TypedProxyTree < IDisplayContainer, IDisplayContainer >> );
		callback( treeSelected, data ).on( listParent.itemSelected, this );
		
	}
	
	public function go()
	{
//		rootData = new ListFilterPair( window.children, displayList, [IDisplayContainer] );
		//listChange.on( window.children.change, this );
		// root created here because of an ordering problem with display list changes
		//rootNode = new InspectorNode<IDisplayObject>( this, null, this, targetClassChildListResolver, targetClassLabelString );
		//rootNode.attachTo( this );
		
		
		test.on( displayEvents.enterFrame, this );
	}
	
	private var cnt:Int;
	public function test()
	{
		//trace("-----------------------------------------");
		//.moretest.debugg();
		//if (cnt++ == 100)
		//	moretest.debugg();
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
