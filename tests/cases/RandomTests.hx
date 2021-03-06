package cases;
 import prime.utils.FastArray;
 import Benchmark;
  using prime.utils.FastArray;
 

/**
 * Description
 * 
 * @creation-date	Jun 21, 2010
 * @author			Ruben Weijers
 */
class RandomTests 
{
	public static function main ()
	{
		var bench = new Benchmark();
		var test = new RandomTests();
		
		var group = new Comparison( "function call vs function.apply", 100000 );
		bench.add( group );
		group.add( new Test( test.maxFuncByReflect,				"function reflect") );
		group.add( new Test( test.maxFuncByApply,				"function.apply") );
		group.add( new Test( test.maxFuncByCall,				"function call") );
		
		var group = new Comparison( "Create arrays", 100000 );
		bench.add( group );
		group.add( new Test( test.newArrayByValue,				"by value") );
		group.add( new Test( test.newArrayConstructor,			"constructor") );
		
		var group = new Comparison( "Insert item in beginning of list", 10000 );
		bench.add( group );
		group.add( new Test( test.testSpliceBeginMethod,		"insert arr",		1, test.initArray) );
		group.add( new Test( test.testUtilInsertBeginMethod,	"FastArray util",	1, test.initList) );
		
		var group = new Comparison( "Insert item at end of list", 10000 );
		bench.add( group );
		group.add( new Test( test.testSpliceEndMethod,			"insert arr",		1, test.initArray) );
		group.add( new Test( test.testUtilInsertEndMethod,		"FastArray util",	1, test.initList) );
		
		var group = new Comparison( "MaintainAspectratio", 1000000 );
		bench.add( group );
		group.add( new Test( test.testAspectRatio1,				"aspectRatio 1") );
		group.add( new Test( test.testAspectRatio2,				"aspectRatio 2") );
		
		
		bench.start();
		test.testModulos();
		test.testBitModulos();
	}
	
	public function new();
	
	
	public function testModulos () {
		for ( i in 0...10)
			trace(i+": "+(i % 3));
	}
	public function testBitModulos () {
		for ( i in 0...10)
			trace(i+": "+(i & (4 - 1)));
	}
	
	
	public function testAspectRatio1 ()
	{
		var oldW:Int = 300;
		var oldH:Int = 200;
		var newW:Int = 700;
		var newH:Int = cast newW / (oldW / oldH);
	}
	
	
	public function testAspectRatio2 ()
	{
		var oldW:Int = 300;
		var oldH:Int = 200;
		var newW:Int = 700;
		var newH:Int = cast ((newW / oldW) * oldH);
	}
	
	
	public function newArrayConstructor ()	{ var a = new Array(); }
	public function newArrayByValue ()		{ var a = []; }
	public function maxFuncByReflect ()		{ var a = Reflect.callMethod( Math, Reflect.field(Math, "max"), [10, 5]); }
	public function maxFuncByCall ()		{ var a = Math.max(10, 5); }
	public function maxFuncByApply ()		{ var a = untyped Math.max.apply( null, [10, 5]); }
	
	
	
	private var list:FastArray<Cell>;
	private var arr:Array<Cell>;
	
	
	public function initList () {
		list = FastArrayUtil.create();
		for (i in 0...100)
			list.push(new Cell());
	}
	
	public function initArray () {
		arr = new Array<Cell>();
		for (i in 0...100)
			arr.push(new Cell());
	}
	
	
	public function testSpliceBeginMethod () {
		var newCell = new Cell();
		arr.insert(1, newCell);
	}
	public function testSpliceEndMethod () {
		var newCell = new Cell();
		arr.insert(99, newCell);
	}
	
	public function testUtilInsertBeginMethod () {
		var newCell = new Cell();
		list.insertAt(newCell, 1);
	}
	public function testUtilInsertEndMethod () {
		var newCell = new Cell();
		list.insertAt(newCell, 99);
	}
}


class Cell {
	public function new () {}
}