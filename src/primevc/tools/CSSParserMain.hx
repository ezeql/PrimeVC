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
package primevc.tools;
 import primevc.gui.styling.StyleBlock;
 import primevc.tools.generator.ICodeFormattable;
 import primevc.tools.generator.HaxeCodeGenerator;
  using primevc.utils.TypeUtil;


/**
 * Main class for compiling a css file to a haxe file.
 * 
 * @author Ruben Weijers
 * @creation-date Sep 15, 2010
 */
class CSSParserMain
{
	
	/**
	 * This script needs one parameter to run: the location of the skin folder
	 */
	public static function main ()
	{
		if (neko.Sys.args().length == 0)
			throw "Skin folder location is needed to run this script.";
		
		var css = new CSSParserMain( neko.Sys.args()[0] );
		css.parse();
		css.generateCode();
		css.flush();
	}
	
	
	private var styles		: StyleBlock;
	private var parser		: CSSParser;
	private var generator	: HaxeCodeGenerator;
	private var manifest	: Manifest;
	
	private var template	: String;
	private var skinFolder	: String;
	
	
	public function new (skin:String)
	{
		skinFolder	= skin;
		styles		= new StyleBlock(null);
		manifest	= new Manifest( skinFolder + "/manifest.xml" );
		parser		= new CSSParser( styles, manifest );
		generator	= new HaxeCodeGenerator( 2 );
		generator.instanceIgnoreList.set( styles.uuid, styles );
		
		var tplName = "src/primevc/tools/StyleSheet.tpl.hx";
		if (!neko.FileSystem.exists( tplName ))
			throw "Template does not exist! "+tplName;
		
		template = neko.io.File.getContent( tplName );
	}
	
	
	public function parse ()
	{
		parser.parse( skinFolder + "/Style.css", ".." );
	}
	
	
	public function generateCode ()
	{
		var code:String = "";
		generator.start();
		
		if (styles.children != null)
		{
			if (styles.children.elementSelectors != null)	code += generateSelectorCode( cast styles.children.elementSelectors, "elementSelectors" );
			if (styles.children.styleNameSelectors != null)	code += generateSelectorCode( cast styles.children.styleNameSelectors, "styleNameSelectors" );
			if (styles.children.idSelectors != null)		code += generateSelectorCode( cast styles.children.idSelectors, "idSelectors" );
		}
		
		//write to template
		var name = "//selectors";
		var pos = template.indexOf( name );
		if (pos > -1) {
			pos += name.length;
			var begin	= template.substr( 0, pos );
			var end 	= template.substr( pos );
			template	= begin + generator.flush() + end;
		}
	}
	
	
	public function flush ()
	{
		//write haxe code
		var output = neko.io.File.write( skinFolder + "/StyleSheet.hx", false );
		output.writeString( template );
		output.close();
	}
	
	
	
	private function generateSelectorCode (selectorHash:Hash<ICodeFormattable>, name:String) : Void
	{
		//create selector code
		var keys = selectorHash.keys();
		for (key in keys)
		{
			var val = selectorHash.get(key);
			if (!val.isEmpty())
				generator.setSelfAction( name + ".set", [ key, val ] );
		}
	}
}