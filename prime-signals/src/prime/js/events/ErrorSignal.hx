package prime.js.events;

import js.Dom;

/**
 * @author	Stanislav Sopov
 * @since	April 6, 2011
 */
class ErrorSignal extends DOMSignal1<String>
{
	override private function dispatch(e:Event) 
	{
		send("error");
	}
}