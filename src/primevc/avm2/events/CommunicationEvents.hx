/*
 * Copyright (c) 2010, The PrimeVC Project Contributors
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
 *  Ruben Weijers	<ruben @ onlinetouch.nl>
 */
package primevc.avm2.events;
private typedef ErrorSignal		= primevc.avm2.events.TextSignal;		// override import
private typedef ProgressSignal	= primevc.avm2.events.ProgressSignal;	// override import

 import flash.events.IEventDispatcher;
 import flash.events.IOErrorEvent;
 import flash.events.Event;
 import flash.events.ProgressEvent;
 import primevc.core.events.CommunicationEvents;


/**
 * @author Ruben Weijers
 * @creation-date Nov 15, 2010
 */
class CommunicationEvents extends CommunicationSignals
{
	public function new (target:IEventDispatcher)
	{
		super();
		started		= new FlashSignal0( target, 	Event.OPEN );
		progress	= new ProgressSignal( target,	ProgressEvent.PROGRESS );
		init		= new FlashSignal0( target,		Event.INIT );
		completed	= new FlashSignal0( target,		Event.COMPLETE );
		error		= new ErrorSignal( target,		IOErrorEvent.IO_ERROR );
	}
}