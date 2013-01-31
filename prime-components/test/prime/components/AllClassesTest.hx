package prime.components;

import massive.munit.util.Timer;
import massive.munit.Assert;
import massive.munit.async.AsyncFactory;

import prime.core.math.PercentageHelper;
import prime.gui.behaviours.BehaviourBase;
import prime.gui.behaviours.BehaviourList;
import prime.gui.behaviours.IBehaviour;
import prime.gui.behaviours.RenderGraphicsBehaviour;
import prime.gui.behaviours.UpdateMaskBehaviour;
import prime.gui.behaviours.ValidatingBehaviour;
import prime.gui.behaviours.components.ButtonSelectedOpenPopup;
import prime.gui.behaviours.components.DirectToolTipBehaviour;
import prime.gui.behaviours.components.KeyboardListNavigation;
import prime.gui.behaviours.components.ShowProgressBarBehaviour;
import prime.gui.behaviours.drag.ApplyDropBehaviour;
import prime.gui.behaviours.drag.DragBehaviourBase;
import prime.gui.behaviours.drag.DragDropBehaviour;
import prime.gui.behaviours.drag.DragHelper;
import prime.gui.behaviours.drag.DragInfo;
import prime.gui.behaviours.drag.DragMoveBehaviour;
import prime.gui.behaviours.drag.ShowDragGapBehaviour;
import prime.gui.behaviours.layout.AutoChangeLayoutChildlistBehaviour;
import prime.gui.behaviours.layout.ClippedLayoutBehaviour;
import prime.gui.behaviours.layout.FollowObjectBehaviour;
import prime.gui.behaviours.layout.UnclippedLayoutBehaviour;
import prime.gui.behaviours.layout.ValidateLayoutBehaviour;
import prime.gui.behaviours.layout.WindowLayoutBehaviour;
import prime.gui.behaviours.scroll.CornerScrollBehaviour;
import prime.gui.behaviours.scroll.DragScrollBehaviour;
import prime.gui.behaviours.scroll.IScrollBehaviour;
import prime.gui.behaviours.scroll.MouseMoveScrollBehaviour;
import prime.gui.behaviours.scroll.MouseScrollBehaviourBase;
import prime.gui.behaviours.scroll.ScrollHelper;
import prime.gui.behaviours.scroll.ShowScrollbarsBehaviour;
import prime.gui.behaviours.styling.InteractiveStyleChangeBehaviour;
import prime.gui.components.AlertPanel;
import prime.gui.components.AudioPlayer;
import prime.gui.components.Button;
import prime.gui.components.ColorPicker;
import prime.gui.components.ComboBox;
import prime.gui.components.ConfirmPanel;
import prime.gui.components.DataButton;
import prime.gui.components.DebugBar;
import prime.gui.components.Form;
import prime.gui.components.IItemRenderer;
import prime.gui.components.IListHolder;
import prime.gui.components.Image;
import prime.gui.components.InputField;
import prime.gui.components.ITextArea;
import prime.gui.components.Label;
import prime.gui.components.ListHolder;
import prime.gui.components.ListView;
import prime.gui.components.Panel;
import prime.gui.components.ProgressBar;
import prime.gui.components.ScrollBar;
import prime.gui.components.SelectableListView;
import prime.gui.components.Slider;
import prime.gui.components.SliderBase;
import prime.gui.components.TextArea;
import prime.gui.components.ToggleGroup;
import prime.gui.components.UploadPanel;
import prime.gui.components.VideoPlayer;

import prime.signal.Wire;

/**
* Auto generated MassiveUnit Test Class 
*/
class AllClassesTest 
{
	
	
	public function new() 
	{
		
	}
	
	@BeforeClass
	public function beforeClass():Void
	{
	}
	
	@AfterClass
	public function afterClass():Void
	{
	}
	
	@Before
	public function setup():Void
	{
	}
	
	@After
	public function tearDown():Void
	{
	}
	
	
	@Test
	public function testExample():Void
	{
		Assert.isTrue(true);

		//Assert.isEqual( 1, 0, "Assert message yo" ); 
	}
}