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
package primevc.utils;
 

/**
 * @creation-date	Jun 17, 2010
 * @author			Ruben Weijers
 */
class FloatUtil 
{
	/**
	 * Helper function which will return the float-value of the first parameter 
	 * as long as it is between the min and max values.
	 * 
	 * @param	value
	 * @param	min
	 * @param	max
	 */
	public static inline function within (value:Float, min:Float, max:Float) : Float {
		if (value < min)		value = min;
		else if (value > max)	value = max;
		return value;
	}
	
	
	/**
	 * Helper function to check of the given value is between the min and max 
	 * value.
	 * 
	 * @param	value
	 * @param	min
	 * @param	max
	 * @return	true or false
	 */
	public static inline function isWithin (value:Float, min:Float, max:Float) : Bool {
		return value >= min && value <= max;
	}
	
	
	public static inline function round (value:Float, precision:Int = 0) : Float {
		value = value * Math.pow(10, precision);
		value = Math.round( value ) / Math.pow(10, precision);
		return value;
	}


	public static inline function notSet (value:Float) : Bool {
		return value == Number.FLOAT_NOT_SET;
	}


	public static inline function isSet (value:Float) : Bool {
		return value != Number.FLOAT_NOT_SET;
	}
}