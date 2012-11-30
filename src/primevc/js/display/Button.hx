package primevc.js.display;

/**
 * @since	January 26, 2012
 * @author	Stanislav Sopov 
 */
class Button extends DOMElem 
{
    public var icon(default, null):Image;
    public var iconURI(default, setIconURI):String;
    
    public function new() {
        super("div");
        className = "button";
    }
    
    private function setIconURI(v:String):String {
        iconURI = v;
        if (icon == null) {
            icon = new Image();
            children.add(icon);
        }
        icon.src = v;
        icon.load();
        return v;
    } 
}