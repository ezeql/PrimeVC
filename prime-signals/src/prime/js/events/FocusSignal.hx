package prime.js.events;

import prime.js.events.DOMSignal1;
import js.Dom;

typedef FocusEvent = 
{
	>DOMEvent,
	public var relatedTarget	(default, null):Dynamic; // A secondary event target related to the event.
}

/**
 * @author	Stanislav Sopov
 * @since	March 2, 2011
 */
class FocusSignal extends DOMSignal1<FocusEvent>
{
	override private function dispatch(e:Event) 
	{
		send(cast e);
	}
}