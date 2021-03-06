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
 *  Danny Wilson	<danny @ onlinetouch.nl>
 */
package prime.signals;
 import prime.core.traits.IDisablable;
 import prime.core.traits.IDisposable;
 import prime.core.ListNode;
  using prime.utils.BitUtil;
  using prime.signals.Signal;

/**
 * A Wire is the connection between a Signal0-4 dispatcher, and a handler object+function.
 * 
 * This allows to quickly (temporarily) disconnect (disable) the handler from the signal dispatcher.
 * 
 * Implementation detail: Wires are added to a bounded freelist (max MAX_WIRES free objects) to reduce garbage collector pressure.
 * This means you should never reuse a Wire after calling dispose() and/or after unbinding the handler from the signal (which returned this Wire).
 */
class Wire <FunctionSignature> extends WireList<FunctionSignature>, implements IDisposable, implements IDisablable
{
	static private inline var MAX_WIRES		= 8096;
	
	/** Wire.flags bit which tells if the Wire is isEnabled(). */
	static public inline var ENABLED		= 1;
	/** Wire.flags bit which tells if Wire.handler takes 0 arguments. */
	static public inline var VOID_HANDLER	= 2;
	/** Wire.flags bit which tells if the Wire should be disposed() right after Signal.send(...) */
	static public inline var SEND_ONCE		= 4;
	
	static private var free : Wire<Dynamic>;
	static public  var freeCount : Int = 0;
	
	static function __init__()
	{
		var W = Wire;
	  #if js
		var dummyOwner   = new Signal0();
		var dummyHandler = dummyOwner.unbindAll;
	  #end

		// Pre-allocate roughly 36 * MAX_WIRES bytes of Wires
		// to potentionally have them placed closely togheter in memory.
		for (i in 0 ... MAX_WIRES) {
			var w     = new Wire<Dynamic>();
		  #if js // Set all fields to increase the odds V8 will initialize the correct hidden class type
			w.owner   = dummyOwner;
			w.signal  = dummyOwner;
			w.handler = dummyHandler;
			w.flags   = 0;
			w.owner   = null;
			w.signal  = null;
			w.handler = null;
		  #end
			w.n       = W.free;
			W.free    = w;
			W.freeCount++;
		}
	}

	static public function make<T>( dispatcher:Signal<T>, owner:Dynamic, handlerFn:T, flags:Int #if debug, ?pos : haxe.PosInfos #end ) : Wire<T>
	{
		Assert.isNotNull(dispatcher);

		var w:Wire<Dynamic>,
			W = Wire;
		
		if (W.free == null)
			w = new Wire<T>();
		else {
			W.free = (w = W.free).n; // I know it's unreadable.. but it's faster.
			--W.freeCount;
			w.n = null;
			Assert.that(w.owner == null && w.handler == null && w.signal == null && w.n == null, w.owner + ", " + w.handler + ", " + w.signal + ", " + w.n);
			w.flags	  = flags;
		}
		
		w.owner   = owner;
		w.signal  = dispatcher;
		w.handler = handlerFn;
		w.flags   = flags;
		if (flags.has(ENABLED))
			w.doEnable();
		
		#if debug w.bindPos = pos; #end
		Assert.isNotNull(w.signal);
		Assert.isNotNull(untyped w.signal.n);
		return cast w;
	}
	
	static public #if !noinline inline #end function sendVoid<T>( wire:Wire<Dynamic> ) {
		wire.handler();
	}
	
	
	// -----------------------
	// Instance implementation
	// -----------------------
	
	
	/** Is this Wire connected? Should it be called with 0 args? Should it be unbound after calling? **/
	public var flags	(default, null) : Int;
	/** Handler function **/
	public var handler	(default, null) : FunctionSignature;
	/** Wire owner object **/
	public var owner	(default, null) : Dynamic;
	/** Object referencing the parent Link in the Chain **/
	public var signal	(default, null) : Signal<FunctionSignature>;
	
#if debug
	public static var instanceCount	= 0;
	public static var disposeCount	= 0;
	public var bindPos		: haxe.PosInfos;
	public var instanceNum	: Int;
	
	public function toString() {
		return "{Wire["+instanceNum+" (total: "+instanceCount+"/"+disposeCount+")] bound at: "+ bindPos.fileName + ":" + bindPos.lineNumber + ", flags = 0x"+ StringTools.hex(flags, 2) +", owner = " + owner + "}";
	}
	public function pos(?p:haxe.PosInfos) : Wire<FunctionSignature> {
		#if debug untyped this.bindPos = p; return this; #end
	}
	
#else
	
	public #if !noinline inline #end function pos() : Wire<FunctionSignature> {
		return this;
	}
#end
	
	
	
	private function new() {
		#if !flash9 flags = 0; #end
		#if debug instanceNum = ++instanceCount; #end
	}

	
	//
	// INLINE PROPERTIES
	//
	
	public #if !noinline inline #end function isEnabled() : Bool
	{
		#if DebugEvents
		{
			var root = signal;
		
			var x = root.next();
			var total = 0;
			var found = 0;
			while (x != null) {
				if (x == this) ++found;
				++total;
				x = x.n;
			}
			var isEnabled = flags.has(ENABLED);
			trace("Total: "+total+" ; Found: "+found + " ; Enabled: "+isEnabled);
			Assert.that(isEnabled ? found == 1 : found == 0, "Found: "+found + " ; Enabled: "+isEnabled);
		}
		#end
		return flags.has(ENABLED);
	}
	
	public #if !noinline inline #end function setArgsHandler( h:FunctionSignature )
	{
		// setHandler only accepts functions with FunctionSignature
		// and this is not a VOID_HANDLER for Signal1..4
		flags.unset( VOID_HANDLER );
		
		return handler = h;
	}
	
	public #if !noinline inline #end function setVoidHandler( h:Void->Void )
	{
		flags.set(VOID_HANDLER);
		return handler = cast h;
	}
	
	/** Enable propagation for the handler this link belongs too. **/
	public #if !noinline inline #end function enable()
	{
		if (!isEnabled())
		{
			flags.set( ENABLED );
			doEnable();
		}
	}
	
	private inline function doEnable()
	{
		var s:ListNode<Wire<FunctionSignature>> = this.signal;
		this.n = s.n;
		s.n = this;
		signal.notifyEnabled(this);
	}
	
	/**
	 * Disable propagation for the handler this link belongs too. Usefull to 
	 * quickly (syntax and performance wise) temporarily disable a handler.
	 * 
	 * Adviced to use in classes which "in the usual way" would add and remove 
	 * listeners alot.
	 */
	public /*inline*/ function disable()
	{
		if (isEnabled())
		{
			flags.unset( ENABLED );
			
			// Find LinkNode before this one
			var x:ListNode<Wire<FunctionSignature>> = signal;
			while (x.n != null && x.n != this) x = x.n;
			
			x.n = this.n;
			this.n = null;
			
			// If this wire is disabled during the call to its handler we need 
			// to update the reference to the next-sendable in the Signal.send-list.
			// @see Signal.nextSendable
			if (signal.nextSendable == this)
				signal.nextSendable = x.n;
			
			Signal.notifyDisabled(signal, this);
		}
	}
	
	public function dispose()
	{
		if (signal == null) return; // already disposed;
		
		disable();
		
		// Cleanup all connections
		handler = owner = signal = null;
		flags	= 0;
		
#if debug
		disposeCount++;
#end
		var W = Wire;
		if (W.freeCount != MAX_WIRES) {
			++W.freeCount;
			this.n = cast W.free;
			W.free = this;
		}
		else
		 	Assert.isEqual(n, null);
	}
	
	
	public #if !noinline inline #end function isBoundTo( target : Dynamic, ?handlerFn : Dynamic )
	{
		return this.owner == target 
			&& (handlerFn == null ||
		(
		  #if flash9
			this.handler == handlerFn
		  #else
			Reflect.compareMethods(handlerFn, this.handler)
		  #end
		));
	}
	
	
	public #if !noinline inline #end function isDisposed () : Bool
	{
		return signal == null && owner == null;
	}
}