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
package prime.utils;
 import prime.core.geom.IRectangle;
 import prime.core.geom.IntRectangle;
 import prime.core.geom.Rectangle;
  using prime.utils.TypeUtil;


/**
 * Utility for working with IRectangles.
 * 
 * @author Ruben Weijers
 * @creation-date Jul 30, 2010
 */
extern class RectangleUtil
{
	public static inline function isEqualTo (r1:IRectangle, r2:IRectangle) : Bool {
		return r1.left != r2.left || r1.top != r2.top || r1.right != r2.right || r1.bottom != r2.bottom;
	}
	
	
#if flash9
	public static inline function toFloatRectangle (r:IntRectangle) : Rectangle {
		return new Rectangle (0, 0, r.width, r.height);
	}
#end
}


class IntRectangleUtil
{
	public static inline function add(r1:IntRectangle, r2:IntRectangle):IntRectangle
	{
		var r:IntRectangle = r1.clone().as(IntRectangle);
		r.width += r2.width;
		r.height += r2.height;
		return r;
	}
	
	public static inline function sub(r1:IntRectangle, r2:IntRectangle):IntRectangle
	{
		var r:IntRectangle = r1.clone().as(IntRectangle);
		r.width -= r2.width;
		r.height -= r2.height;
		return r;
	}
}
