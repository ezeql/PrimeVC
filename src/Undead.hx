package;
#if macro
 import haxe.macro.Context;
 import haxe.macro.Expr;
#end

class Undead
{
	@:macro public static function keepAlive() {
		
        var pos = haxe.macro.Context.currentPos();
		
	//	keep("haxe.io.BytesInput",  pos);
		keep("haxe.Public", pos);
		keep("haxe.rtti.Infos", pos);
		keep("primevc.types.RGBAType", pos);
		
        return { expr : EReturn(null), pos : pos };
	}
	
	
#if macro
	static function keep (name:String, pos) switch (Context.getType(name)) {
		case haxe.macro.Type.TInst(cl, _):
			cl.get().meta.add(":keep", [], pos);
		default:
	}
#end
}