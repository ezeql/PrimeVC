/*
 * Copyright (c) 2013, The PrimeVC Project Contributors
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
 *  Danny Wilson	<danny @ prime.vc>
 */
package prime.perceptor.embedded;
 import prime.gui.core.UIContainer;
 import prime.gui.components.SelectableListView;
 import prime.gui.components.ListView;
 import prime.layout.algorithms.float.HorizontalFloatAlgorithm;
 import prime.gui.core.IUIElement;
 import prime.gui.core.IUIComponent;
 import prime.gui.core.UIWindow;
 using prime.utils.Bind;

import prime.gui.display.Window;

/**
 * Use me to establish a remoting connection to Perceptor.
 * 
 * @author Danny Wilson
 * @creation-date Mar 20, 2013
 */
class Inspector extends UIContainer
{
	private var tree : SelectableListView<IUIElement>;
	private var data : ListView<IUIElement>;
	
	public function new( w:UIWindow )
	{
		super("Inspector");
		
		//layoutContainer.algorithm = new HorizontalFloatAlgorithm();
		//test.onceOn( displayEvents.addedToStage, this );
	}
	
	private override function createChildren ()	: Void
	{
		super.createChildren();
		
		tree = new SelectableListView();
		
	}
	
	private function test()
	{
		data = null;
	}
}
