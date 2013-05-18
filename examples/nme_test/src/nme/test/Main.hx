package nme.test;

import flash.display.Bitmap;
import flash.display.Sprite;
import nme.Assets;
import flash.Lib;

import prime.bindable.Bindable;
import prime.layout.LayoutClient;

import prime.gui.display.Window;
import prime.gui.core.UIWindow;
import prime.gui.components.Button;

class Main extends Sprite
{
	private var testBindabe:Bindable<Float>;
	
	public function new () {
		
		super ();
		var window = Window.startup( function(stage) return new MainWindow(stage) );

		var bitmap = new Bitmap (Assets.getBitmapData ("assets/nme.png"));
		addChild (bitmap);
		
		bitmap.x = (Lib.current.stage.stageWidth - bitmap.width) / 2;
		bitmap.y = (Lib.current.stage.stageHeight - bitmap.height) / 2;

		testBindabe = new Bindable<Float>(0);
		testBindabe.value = 123;

		var layout:LayoutClient = new LayoutClient(100,100);
	}

	public static function Go()
	{
	#if flash
	   new Main();
	#else
	   Lib.create(function(){new Main();},320,480,60,0xccccff,(1*Lib.HARDWARE) | Lib.RESIZABLE);
	#end
	}
}

class MainWindow extends UIWindow
{
	public function new(stage) {
		Assert.isNotNull(stage);
		super(stage, "MainWindow");
	
		var button = new Button( "buttonAdd", "+" );
		button.visible = true;
		button.graphicData.fill = new prime.gui.graphics.fills.SolidFill(0xffaaaaff);
		button.graphicData.shape = new prime.gui.graphics.shapes.RegularRectangle();
		button.layout.margin = new prime.core.geom.Box(20,5);
		button.layout.resize( 30, 50 );

		children.add( button );
		//untyped console.log(button);
	}
}