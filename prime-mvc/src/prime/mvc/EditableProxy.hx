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
package prime.mvc;
#if prime_data
 import prime.core.traits.IEditableValueObject;
 import prime.core.traits.IEditEnabledValueObject;
  using prime.utils.BitUtil;


/**
 * A proxy that allows mediators to edit the VO managed by the proxy.
 * 
 * @author Danny Wilson
 * @creation-date Jul 09, 2010
 */
class EditableProxy	< VOType:IEditableValueObject, EditEnabledVOType:IEditEnabledValueObject, EventsTypedef >
 		extends Proxy <VOType, EventsTypedef>
	,	implements IEditableProxy < EditEnabledVOType >
{
	public function beginEdit() : EditEnabledVOType
	{
		if (!isEnabled())
			return null;
		
		setEditing();
		vo.beginEdit();
		return cast vo;
	}
	
	
	public function commitEdit() : Void
	{
		if (isEditing())
		{
			vo.commitEdit();
			unsetEditing();
		}
	}
	
	
	public function cancelEdit() : Void
	{
		if (isEditing())
		{
			vo.cancelEdit();
			unsetEditing();
		}
	}
	
	
	public  inline function isEditing ()	{ return state.has( MVCFlags.EDITING ); }
	private inline function setEditing ()	{ state = state  .set(MVCFlags.EDITING); }
	private inline function unsetEditing ()	{ state = state.unset(MVCFlags.EDITING); }
	override public function disable ()	{ cancelEdit(); super.disable(); }
}
#end