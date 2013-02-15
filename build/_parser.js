var $estr = function() { return js.Boot.__string_rec(this,''); };
function $extend(from, fields) {
	function inherit() {}; inherit.prototype = from; var proto = new inherit();
	for (var name in fields) proto[name] = fields[name];
	return proto;
}
var Assert = function() { }
Assert.__name__ = ["Assert"];
var EReg = function(r,opt) {
	opt = opt.split("u").join("");
	this.r = new RegExp(r,opt);
};
EReg.__name__ = ["EReg"];
EReg.prototype = {
	customReplace: function(s,f) {
		var buf = new StringBuf();
		while(true) {
			if(!this.match(s)) break;
			buf.b += Std.string(this.matchedLeft());
			buf.b += Std.string(f(this));
			s = this.matchedRight();
		}
		buf.b += Std.string(s);
		return buf.b;
	}
	,replace: function(s,by) {
		return s.replace(this.r,by);
	}
	,matchedRight: function() {
		if(this.r.m == null) throw "No string matched";
		var sz = this.r.m.index + this.r.m[0].length;
		return this.r.s.substr(sz,this.r.s.length - sz);
	}
	,matchedLeft: function() {
		if(this.r.m == null) throw "No string matched";
		return this.r.s.substr(0,this.r.m.index);
	}
	,matched: function(n) {
		return this.r.m != null && n >= 0 && n < this.r.m.length?this.r.m[n]:(function($this) {
			var $r;
			throw "EReg::matched";
			return $r;
		}(this));
	}
	,match: function(s) {
		if(this.r.global) this.r.lastIndex = 0;
		this.r.m = this.r.exec(s);
		this.r.s = s;
		return this.r.m != null;
	}
	,__class__: EReg
}
var Hash = function() {
	this.h = { };
};
Hash.__name__ = ["Hash"];
Hash.prototype = {
	iterator: function() {
		return { ref : this.h, it : this.keys(), hasNext : function() {
			return this.it.hasNext();
		}, next : function() {
			var i = this.it.next();
			return this.ref["$" + i];
		}};
	}
	,keys: function() {
		var a = [];
		for( var key in this.h ) {
		if(this.h.hasOwnProperty(key)) a.push(key.substr(1));
		}
		return HxOverrides.iter(a);
	}
	,exists: function(key) {
		return this.h.hasOwnProperty("$" + key);
	}
	,get: function(key) {
		return this.h["$" + key];
	}
	,set: function(key,value) {
		this.h["$" + key] = value;
	}
	,__class__: Hash
}
var HxOverrides = function() { }
HxOverrides.__name__ = ["HxOverrides"];
HxOverrides.cca = function(s,index) {
	var x = s.charCodeAt(index);
	if(x != x) return undefined;
	return x;
}
HxOverrides.substr = function(s,pos,len) {
	if(pos != null && pos != 0 && len != null && len < 0) return "";
	if(len == null) len = s.length;
	if(pos < 0) {
		pos = s.length + pos;
		if(pos < 0) pos = 0;
	} else if(len < 0) len = s.length + len - pos;
	return s.substr(pos,len);
}
HxOverrides.remove = function(a,obj) {
	var i = 0;
	var l = a.length;
	while(i < l) {
		if(a[i] == obj) {
			a.splice(i,1);
			return true;
		}
		i++;
	}
	return false;
}
HxOverrides.iter = function(a) {
	return { cur : 0, arr : a, hasNext : function() {
		return this.cur < this.arr.length;
	}, next : function() {
		return this.arr[this.cur++];
	}};
}
var IntHash = function() {
	this.h = { };
};
IntHash.__name__ = ["IntHash"];
IntHash.prototype = {
	exists: function(key) {
		return this.h.hasOwnProperty(key);
	}
	,get: function(key) {
		return this.h[key];
	}
	,set: function(key,value) {
		this.h[key] = value;
	}
	,__class__: IntHash
}
var List = function() {
	this.length = 0;
};
List.__name__ = ["List"];
List.prototype = {
	iterator: function() {
		return { h : this.h, hasNext : function() {
			return this.h != null;
		}, next : function() {
			if(this.h == null) return null;
			var x = this.h[0];
			this.h = this.h[1];
			return x;
		}};
	}
	,add: function(item) {
		var x = [item];
		if(this.h == null) this.h = x; else this.q[1] = x;
		this.q = x;
		this.length++;
	}
	,__class__: List
}
var Reflect = function() { }
Reflect.__name__ = ["Reflect"];
Reflect.hasField = function(o,field) {
	return Object.prototype.hasOwnProperty.call(o,field);
}
Reflect.field = function(o,field) {
	var v = null;
	try {
		v = o[field];
	} catch( e ) {
	}
	return v;
}
Reflect.isFunction = function(f) {
	return typeof(f) == "function" && !(f.__name__ || f.__ename__);
}
Reflect.compare = function(a,b) {
	return a == b?0:a > b?1:-1;
}
Reflect.compareMethods = function(f1,f2) {
	if(f1 == f2) return true;
	if(!Reflect.isFunction(f1) || !Reflect.isFunction(f2)) return false;
	return f1.scope == f2.scope && f1.method == f2.method && f1.method != null;
}
var Std = function() { }
Std.__name__ = ["Std"];
Std.string = function(s) {
	return js.Boot.__string_rec(s,"");
}
Std.parseInt = function(x) {
	var v = parseInt(x,10);
	if(v == 0 && (HxOverrides.cca(x,1) == 120 || HxOverrides.cca(x,1) == 88)) v = parseInt(x);
	if(isNaN(v)) return null;
	return v;
}
Std.parseFloat = function(x) {
	return parseFloat(x);
}
var StringBuf = function() {
	this.b = "";
};
StringBuf.__name__ = ["StringBuf"];
StringBuf.prototype = {
	__class__: StringBuf
}
var StringTools = function() { }
StringTools.__name__ = ["StringTools"];
StringTools.isSpace = function(s,pos) {
	var c = HxOverrides.cca(s,pos);
	return c >= 9 && c <= 13 || c == 32;
}
StringTools.ltrim = function(s) {
	var l = s.length;
	var r = 0;
	while(r < l && StringTools.isSpace(s,r)) r++;
	if(r > 0) return HxOverrides.substr(s,r,l - r); else return s;
}
StringTools.rtrim = function(s) {
	var l = s.length;
	var r = 0;
	while(r < l && StringTools.isSpace(s,l - r - 1)) r++;
	if(r > 0) return HxOverrides.substr(s,0,l - r); else return s;
}
StringTools.trim = function(s) {
	return StringTools.ltrim(StringTools.rtrim(s));
}
StringTools.replace = function(s,sub,by) {
	return s.split(sub).join(by);
}
StringTools.hex = function(n,digits) {
	var s = "";
	var hexChars = "0123456789ABCDEF";
	do {
		s = hexChars.charAt(n & 15) + s;
		n >>>= 4;
	} while(n > 0);
	if(digits != null) while(s.length < digits) s = "0" + s;
	return s;
}
var ValueType = { __ename__ : ["ValueType"], __constructs__ : ["TNull","TInt","TFloat","TBool","TObject","TFunction","TClass","TEnum","TUnknown"] }
ValueType.TNull = ["TNull",0];
ValueType.TNull.toString = $estr;
ValueType.TNull.__enum__ = ValueType;
ValueType.TInt = ["TInt",1];
ValueType.TInt.toString = $estr;
ValueType.TInt.__enum__ = ValueType;
ValueType.TFloat = ["TFloat",2];
ValueType.TFloat.toString = $estr;
ValueType.TFloat.__enum__ = ValueType;
ValueType.TBool = ["TBool",3];
ValueType.TBool.toString = $estr;
ValueType.TBool.__enum__ = ValueType;
ValueType.TObject = ["TObject",4];
ValueType.TObject.toString = $estr;
ValueType.TObject.__enum__ = ValueType;
ValueType.TFunction = ["TFunction",5];
ValueType.TFunction.toString = $estr;
ValueType.TFunction.__enum__ = ValueType;
ValueType.TClass = function(c) { var $x = ["TClass",6,c]; $x.__enum__ = ValueType; $x.toString = $estr; return $x; }
ValueType.TEnum = function(e) { var $x = ["TEnum",7,e]; $x.__enum__ = ValueType; $x.toString = $estr; return $x; }
ValueType.TUnknown = ["TUnknown",8];
ValueType.TUnknown.toString = $estr;
ValueType.TUnknown.__enum__ = ValueType;
var Type = function() { }
Type.__name__ = ["Type"];
Type.getClass = function(o) {
	if(o == null) return null;
	return o.__class__;
}
Type.getEnum = function(o) {
	if(o == null) return null;
	return o.__enum__;
}
Type.getClassName = function(c) {
	var a = c.__name__;
	return a.join(".");
}
Type.getEnumName = function(e) {
	var a = e.__ename__;
	return a.join(".");
}
Type["typeof"] = function(v) {
	switch(typeof(v)) {
	case "boolean":
		return ValueType.TBool;
	case "string":
		return ValueType.TClass(String);
	case "number":
		if(Math.ceil(v) == v % 2147483648.0) return ValueType.TInt;
		return ValueType.TFloat;
	case "object":
		if(v == null) return ValueType.TNull;
		var e = v.__enum__;
		if(e != null) return ValueType.TEnum(e);
		var c = v.__class__;
		if(c != null) return ValueType.TClass(c);
		return ValueType.TObject;
	case "function":
		if(v.__name__ || v.__ename__) return ValueType.TObject;
		return ValueType.TFunction;
	case "undefined":
		return ValueType.TNull;
	default:
		return ValueType.TUnknown;
	}
}
var Xml = function() {
};
Xml.__name__ = ["Xml"];
Xml.parse = function(str) {
	return haxe.xml.Parser.parse(str);
}
Xml.createElement = function(name) {
	var r = new Xml();
	r.nodeType = Xml.Element;
	r._children = new Array();
	r._attributes = new Hash();
	r.setNodeName(name);
	return r;
}
Xml.createPCData = function(data) {
	var r = new Xml();
	r.nodeType = Xml.PCData;
	r.setNodeValue(data);
	return r;
}
Xml.createCData = function(data) {
	var r = new Xml();
	r.nodeType = Xml.CData;
	r.setNodeValue(data);
	return r;
}
Xml.createComment = function(data) {
	var r = new Xml();
	r.nodeType = Xml.Comment;
	r.setNodeValue(data);
	return r;
}
Xml.createDocType = function(data) {
	var r = new Xml();
	r.nodeType = Xml.DocType;
	r.setNodeValue(data);
	return r;
}
Xml.createProlog = function(data) {
	var r = new Xml();
	r.nodeType = Xml.Prolog;
	r.setNodeValue(data);
	return r;
}
Xml.createDocument = function() {
	var r = new Xml();
	r.nodeType = Xml.Document;
	r._children = new Array();
	return r;
}
Xml.prototype = {
	toString: function() {
		if(this.nodeType == Xml.PCData) return this._nodeValue;
		if(this.nodeType == Xml.CData) return "<![CDATA[" + this._nodeValue + "]]>";
		if(this.nodeType == Xml.Comment) return "<!--" + this._nodeValue + "-->";
		if(this.nodeType == Xml.DocType) return "<!DOCTYPE " + this._nodeValue + ">";
		if(this.nodeType == Xml.Prolog) return "<?" + this._nodeValue + "?>";
		var s = new StringBuf();
		if(this.nodeType == Xml.Element) {
			s.b += Std.string("<");
			s.b += Std.string(this._nodeName);
			var $it0 = this._attributes.keys();
			while( $it0.hasNext() ) {
				var k = $it0.next();
				s.b += Std.string(" ");
				s.b += Std.string(k);
				s.b += Std.string("=\"");
				s.b += Std.string(this._attributes.get(k));
				s.b += Std.string("\"");
			}
			if(this._children.length == 0) {
				s.b += Std.string("/>");
				return s.b;
			}
			s.b += Std.string(">");
		}
		var $it1 = this.iterator();
		while( $it1.hasNext() ) {
			var x = $it1.next();
			s.b += Std.string(x.toString());
		}
		if(this.nodeType == Xml.Element) {
			s.b += Std.string("</");
			s.b += Std.string(this._nodeName);
			s.b += Std.string(">");
		}
		return s.b;
	}
	,addChild: function(x) {
		if(this._children == null) throw "bad nodetype";
		if(x._parent != null) HxOverrides.remove(x._parent._children,x);
		x._parent = this;
		this._children.push(x);
	}
	,firstElement: function() {
		if(this._children == null) throw "bad nodetype";
		var cur = 0;
		var l = this._children.length;
		while(cur < l) {
			var n = this._children[cur];
			if(n.nodeType == Xml.Element) return n;
			cur++;
		}
		return null;
	}
	,elementsNamed: function(name) {
		if(this._children == null) throw "bad nodetype";
		return { cur : 0, x : this._children, hasNext : function() {
			var k = this.cur;
			var l = this.x.length;
			while(k < l) {
				var n = this.x[k];
				if(n.nodeType == Xml.Element && n._nodeName == name) break;
				k++;
			}
			this.cur = k;
			return k < l;
		}, next : function() {
			var k = this.cur;
			var l = this.x.length;
			while(k < l) {
				var n = this.x[k];
				k++;
				if(n.nodeType == Xml.Element && n._nodeName == name) {
					this.cur = k;
					return n;
				}
			}
			return null;
		}};
	}
	,elements: function() {
		if(this._children == null) throw "bad nodetype";
		return { cur : 0, x : this._children, hasNext : function() {
			var k = this.cur;
			var l = this.x.length;
			while(k < l) {
				if(this.x[k].nodeType == Xml.Element) break;
				k += 1;
			}
			this.cur = k;
			return k < l;
		}, next : function() {
			var k = this.cur;
			var l = this.x.length;
			while(k < l) {
				var n = this.x[k];
				k += 1;
				if(n.nodeType == Xml.Element) {
					this.cur = k;
					return n;
				}
			}
			return null;
		}};
	}
	,iterator: function() {
		if(this._children == null) throw "bad nodetype";
		return { cur : 0, x : this._children, hasNext : function() {
			return this.cur < this.x.length;
		}, next : function() {
			return this.x[this.cur++];
		}};
	}
	,exists: function(att) {
		if(this.nodeType != Xml.Element) throw "bad nodeType";
		return this._attributes.exists(att);
	}
	,set: function(att,value) {
		if(this.nodeType != Xml.Element) throw "bad nodeType";
		this._attributes.set(att,value);
	}
	,get: function(att) {
		if(this.nodeType != Xml.Element) throw "bad nodeType";
		return this._attributes.get(att);
	}
	,getParent: function() {
		return this._parent;
	}
	,setNodeValue: function(v) {
		if(this.nodeType == Xml.Element || this.nodeType == Xml.Document) throw "bad nodeType";
		return this._nodeValue = v;
	}
	,getNodeValue: function() {
		if(this.nodeType == Xml.Element || this.nodeType == Xml.Document) throw "bad nodeType";
		return this._nodeValue;
	}
	,setNodeName: function(n) {
		if(this.nodeType != Xml.Element) throw "bad nodeType";
		return this._nodeName = n;
	}
	,getNodeName: function() {
		if(this.nodeType != Xml.Element) throw "bad nodeType";
		return this._nodeName;
	}
	,__class__: Xml
}
var haxe = haxe || {}
haxe.FastCell = function(elt,next) {
	this.elt = elt;
	this.next = next;
};
haxe.FastCell.__name__ = ["haxe","FastCell"];
haxe.FastCell.prototype = {
	__class__: haxe.FastCell
}
haxe.FastList = function() {
};
haxe.FastList.__name__ = ["haxe","FastList"];
haxe.FastList.prototype = {
	remove: function(v) {
		var prev = null;
		var l = this.head;
		while(l != null) {
			if(l.elt == v) {
				if(prev == null) this.head = l.next; else prev.next = l.next;
				break;
			}
			prev = l;
			l = l.next;
		}
		return l != null;
	}
	,pop: function() {
		var k = this.head;
		if(k == null) return null; else {
			this.head = k.next;
			return k.elt;
		}
	}
	,add: function(item) {
		this.head = new haxe.FastCell(item,this.head);
	}
	,__class__: haxe.FastList
}
haxe.Public = function() { }
haxe.Public.__name__ = ["haxe","Public"];
haxe.Timer = function(time_ms) {
	var me = this;
	this.id = window.setInterval(function() {
		me.run();
	},time_ms);
};
haxe.Timer.__name__ = ["haxe","Timer"];
haxe.Timer.stamp = function() {
	return new Date().getTime() / 1000;
}
haxe.Timer.prototype = {
	run: function() {
	}
	,__class__: haxe.Timer
}
if(!haxe.xml) haxe.xml = {}
if(!haxe.xml._Fast) haxe.xml._Fast = {}
haxe.xml._Fast.NodeAccess = function(x) {
	this.__x = x;
};
haxe.xml._Fast.NodeAccess.__name__ = ["haxe","xml","_Fast","NodeAccess"];
haxe.xml._Fast.NodeAccess.prototype = {
	resolve: function(name) {
		var x = this.__x.elementsNamed(name).next();
		if(x == null) {
			var xname = this.__x.nodeType == Xml.Document?"Document":this.__x.getNodeName();
			throw xname + " is missing element " + name;
		}
		return new haxe.xml.Fast(x);
	}
	,__class__: haxe.xml._Fast.NodeAccess
}
haxe.xml._Fast.AttribAccess = function(x) {
	this.__x = x;
};
haxe.xml._Fast.AttribAccess.__name__ = ["haxe","xml","_Fast","AttribAccess"];
haxe.xml._Fast.AttribAccess.prototype = {
	resolve: function(name) {
		if(this.__x.nodeType == Xml.Document) throw "Cannot access document attribute " + name;
		var v = this.__x.get(name);
		if(v == null) throw this.__x.getNodeName() + " is missing attribute " + name;
		return v;
	}
	,__class__: haxe.xml._Fast.AttribAccess
}
haxe.xml._Fast.HasAttribAccess = function(x) {
	this.__x = x;
};
haxe.xml._Fast.HasAttribAccess.__name__ = ["haxe","xml","_Fast","HasAttribAccess"];
haxe.xml._Fast.HasAttribAccess.prototype = {
	resolve: function(name) {
		if(this.__x.nodeType == Xml.Document) throw "Cannot access document attribute " + name;
		return this.__x.exists(name);
	}
	,__class__: haxe.xml._Fast.HasAttribAccess
}
haxe.xml._Fast.HasNodeAccess = function(x) {
	this.__x = x;
};
haxe.xml._Fast.HasNodeAccess.__name__ = ["haxe","xml","_Fast","HasNodeAccess"];
haxe.xml._Fast.HasNodeAccess.prototype = {
	resolve: function(name) {
		return this.__x.elementsNamed(name).hasNext();
	}
	,__class__: haxe.xml._Fast.HasNodeAccess
}
haxe.xml._Fast.NodeListAccess = function(x) {
	this.__x = x;
};
haxe.xml._Fast.NodeListAccess.__name__ = ["haxe","xml","_Fast","NodeListAccess"];
haxe.xml._Fast.NodeListAccess.prototype = {
	resolve: function(name) {
		var l = new List();
		var $it0 = this.__x.elementsNamed(name);
		while( $it0.hasNext() ) {
			var x = $it0.next();
			l.add(new haxe.xml.Fast(x));
		}
		return l;
	}
	,__class__: haxe.xml._Fast.NodeListAccess
}
haxe.xml.Fast = function(x) {
	if(x.nodeType != Xml.Document && x.nodeType != Xml.Element) throw "Invalid nodeType " + Std.string(x.nodeType);
	this.x = x;
	this.node = new haxe.xml._Fast.NodeAccess(x);
	this.nodes = new haxe.xml._Fast.NodeListAccess(x);
	this.att = new haxe.xml._Fast.AttribAccess(x);
	this.has = new haxe.xml._Fast.HasAttribAccess(x);
	this.hasNode = new haxe.xml._Fast.HasNodeAccess(x);
};
haxe.xml.Fast.__name__ = ["haxe","xml","Fast"];
haxe.xml.Fast.prototype = {
	getElements: function() {
		var it = this.x.elements();
		return { hasNext : $bind(it,it.hasNext), next : function() {
			var x = it.next();
			if(x == null) return null;
			return new haxe.xml.Fast(x);
		}};
	}
	,getInnerHTML: function() {
		var s = new StringBuf();
		var $it0 = this.x.iterator();
		while( $it0.hasNext() ) {
			var x = $it0.next();
			s.b += Std.string(x.toString());
		}
		return s.b;
	}
	,getInnerData: function() {
		var it = this.x.iterator();
		if(!it.hasNext()) throw this.getName() + " does not have data";
		var v = it.next();
		var n = it.next();
		if(n != null) {
			if(v.nodeType == Xml.PCData && n.nodeType == Xml.CData && StringTools.trim(v.getNodeValue()) == "") {
				var n2 = it.next();
				if(n2 == null || n2.nodeType == Xml.PCData && StringTools.trim(n2.getNodeValue()) == "" && it.next() == null) return n.getNodeValue();
			}
			throw this.getName() + " does not only have data";
		}
		if(v.nodeType != Xml.PCData && v.nodeType != Xml.CData) throw this.getName() + " does not have data";
		return v.getNodeValue();
	}
	,getName: function() {
		return this.x.nodeType == Xml.Document?"Document":this.x.getNodeName();
	}
	,__class__: haxe.xml.Fast
}
haxe.xml.Parser = function() { }
haxe.xml.Parser.__name__ = ["haxe","xml","Parser"];
haxe.xml.Parser.parse = function(str) {
	var doc = Xml.createDocument();
	haxe.xml.Parser.doParse(str,0,doc);
	return doc;
}
haxe.xml.Parser.doParse = function(str,p,parent) {
	if(p == null) p = 0;
	var xml = null;
	var state = 1;
	var next = 1;
	var aname = null;
	var start = 0;
	var nsubs = 0;
	var nbrackets = 0;
	var c = str.charCodeAt(p);
	while(!(c != c)) {
		switch(state) {
		case 0:
			switch(c) {
			case 10:case 13:case 9:case 32:
				break;
			default:
				state = next;
				continue;
			}
			break;
		case 1:
			switch(c) {
			case 60:
				state = 0;
				next = 2;
				break;
			default:
				start = p;
				state = 13;
				continue;
			}
			break;
		case 13:
			if(c == 60) {
				var child = Xml.createPCData(HxOverrides.substr(str,start,p - start));
				parent.addChild(child);
				nsubs++;
				state = 0;
				next = 2;
			}
			break;
		case 17:
			if(c == 93 && str.charCodeAt(p + 1) == 93 && str.charCodeAt(p + 2) == 62) {
				var child = Xml.createCData(HxOverrides.substr(str,start,p - start));
				parent.addChild(child);
				nsubs++;
				p += 2;
				state = 1;
			}
			break;
		case 2:
			switch(c) {
			case 33:
				if(str.charCodeAt(p + 1) == 91) {
					p += 2;
					if(HxOverrides.substr(str,p,6).toUpperCase() != "CDATA[") throw "Expected <![CDATA[";
					p += 5;
					state = 17;
					start = p + 1;
				} else if(str.charCodeAt(p + 1) == 68 || str.charCodeAt(p + 1) == 100) {
					if(HxOverrides.substr(str,p + 2,6).toUpperCase() != "OCTYPE") throw "Expected <!DOCTYPE";
					p += 8;
					state = 16;
					start = p + 1;
				} else if(str.charCodeAt(p + 1) != 45 || str.charCodeAt(p + 2) != 45) throw "Expected <!--"; else {
					p += 2;
					state = 15;
					start = p + 1;
				}
				break;
			case 63:
				state = 14;
				start = p;
				break;
			case 47:
				if(parent == null) throw "Expected node name";
				start = p + 1;
				state = 0;
				next = 10;
				break;
			default:
				state = 3;
				start = p;
				continue;
			}
			break;
		case 3:
			if(!(c >= 97 && c <= 122 || c >= 65 && c <= 90 || c >= 48 && c <= 57 || c == 58 || c == 46 || c == 95 || c == 45)) {
				if(p == start) throw "Expected node name";
				xml = Xml.createElement(HxOverrides.substr(str,start,p - start));
				parent.addChild(xml);
				state = 0;
				next = 4;
				continue;
			}
			break;
		case 4:
			switch(c) {
			case 47:
				state = 11;
				nsubs++;
				break;
			case 62:
				state = 9;
				nsubs++;
				break;
			default:
				state = 5;
				start = p;
				continue;
			}
			break;
		case 5:
			if(!(c >= 97 && c <= 122 || c >= 65 && c <= 90 || c >= 48 && c <= 57 || c == 58 || c == 46 || c == 95 || c == 45)) {
				var tmp;
				if(start == p) throw "Expected attribute name";
				tmp = HxOverrides.substr(str,start,p - start);
				aname = tmp;
				if(xml.exists(aname)) throw "Duplicate attribute";
				state = 0;
				next = 6;
				continue;
			}
			break;
		case 6:
			switch(c) {
			case 61:
				state = 0;
				next = 7;
				break;
			default:
				throw "Expected =";
			}
			break;
		case 7:
			switch(c) {
			case 34:case 39:
				state = 8;
				start = p;
				break;
			default:
				throw "Expected \"";
			}
			break;
		case 8:
			if(c == str.charCodeAt(start)) {
				var val = HxOverrides.substr(str,start + 1,p - start - 1);
				xml.set(aname,val);
				state = 0;
				next = 4;
			}
			break;
		case 9:
			p = haxe.xml.Parser.doParse(str,p,xml);
			start = p;
			state = 1;
			break;
		case 11:
			switch(c) {
			case 62:
				state = 1;
				break;
			default:
				throw "Expected >";
			}
			break;
		case 12:
			switch(c) {
			case 62:
				if(nsubs == 0) parent.addChild(Xml.createPCData(""));
				return p;
			default:
				throw "Expected >";
			}
			break;
		case 10:
			if(!(c >= 97 && c <= 122 || c >= 65 && c <= 90 || c >= 48 && c <= 57 || c == 58 || c == 46 || c == 95 || c == 45)) {
				if(start == p) throw "Expected node name";
				var v = HxOverrides.substr(str,start,p - start);
				if(v != parent.getNodeName()) throw "Expected </" + parent.getNodeName() + ">";
				state = 0;
				next = 12;
				continue;
			}
			break;
		case 15:
			if(c == 45 && str.charCodeAt(p + 1) == 45 && str.charCodeAt(p + 2) == 62) {
				parent.addChild(Xml.createComment(HxOverrides.substr(str,start,p - start)));
				p += 2;
				state = 1;
			}
			break;
		case 16:
			if(c == 91) nbrackets++; else if(c == 93) nbrackets--; else if(c == 62 && nbrackets == 0) {
				parent.addChild(Xml.createDocType(HxOverrides.substr(str,start,p - start)));
				state = 1;
			}
			break;
		case 14:
			if(c == 63 && str.charCodeAt(p + 1) == 62) {
				p++;
				var str1 = HxOverrides.substr(str,start + 1,p - start - 2);
				parent.addChild(Xml.createProlog(str1));
				state = 1;
			}
			break;
		}
		c = str.charCodeAt(++p);
	}
	if(state == 1) {
		start = p;
		state = 13;
	}
	if(state == 13) {
		if(p != start || nsubs == 0) parent.addChild(Xml.createPCData(HxOverrides.substr(str,start,p - start)));
		return p;
	}
	throw "Unexpected end";
}
var js = js || {}
js.Boot = function() { }
js.Boot.__name__ = ["js","Boot"];
js.Boot.__string_rec = function(o,s) {
	if(o == null) return "null";
	if(s.length >= 5) return "<...>";
	var t = typeof(o);
	if(t == "function" && (o.__name__ || o.__ename__)) t = "object";
	switch(t) {
	case "object":
		if(o instanceof Array) {
			if(o.__enum__) {
				if(o.length == 2) return o[0];
				var str = o[0] + "(";
				s += "\t";
				var _g1 = 2, _g = o.length;
				while(_g1 < _g) {
					var i = _g1++;
					if(i != 2) str += "," + js.Boot.__string_rec(o[i],s); else str += js.Boot.__string_rec(o[i],s);
				}
				return str + ")";
			}
			var l = o.length;
			var i;
			var str = "[";
			s += "\t";
			var _g = 0;
			while(_g < l) {
				var i1 = _g++;
				str += (i1 > 0?",":"") + js.Boot.__string_rec(o[i1],s);
			}
			str += "]";
			return str;
		}
		var tostr;
		try {
			tostr = o.toString;
		} catch( e ) {
			return "???";
		}
		if(tostr != null && tostr != Object.toString) {
			var s2 = o.toString();
			if(s2 != "[object Object]") return s2;
		}
		var k = null;
		var str = "{\n";
		s += "\t";
		var hasp = o.hasOwnProperty != null;
		for( var k in o ) { ;
		if(hasp && !o.hasOwnProperty(k)) {
			continue;
		}
		if(k == "prototype" || k == "__class__" || k == "__super__" || k == "__interfaces__" || k == "__properties__") {
			continue;
		}
		if(str.length != 2) str += ", \n";
		str += s + k + " : " + js.Boot.__string_rec(o[k],s);
		}
		s = s.substring(1);
		str += "\n" + s + "}";
		return str;
	case "function":
		return "<function>";
	case "string":
		return o;
	default:
		return String(o);
	}
}
js.Boot.__interfLoop = function(cc,cl) {
	if(cc == null) return false;
	if(cc == cl) return true;
	var intf = cc.__interfaces__;
	if(intf != null) {
		var _g1 = 0, _g = intf.length;
		while(_g1 < _g) {
			var i = _g1++;
			var i1 = intf[i];
			if(i1 == cl || js.Boot.__interfLoop(i1,cl)) return true;
		}
	}
	return js.Boot.__interfLoop(cc.__super__,cl);
}
js.Boot.__instanceof = function(o,cl) {
	try {
		if(o instanceof cl) {
			if(cl == Array) return o.__enum__ == null;
			return true;
		}
		if(js.Boot.__interfLoop(o.__class__,cl)) return true;
	} catch( e ) {
		if(cl == null) return false;
	}
	switch(cl) {
	case Int:
		return Math.ceil(o%2147483648.0) === o;
	case Float:
		return typeof(o) == "number";
	case Bool:
		return o === true || o === false;
	case String:
		return typeof(o) == "string";
	case Dynamic:
		return true;
	default:
		if(o == null) return false;
		if(cl == Class && o.__name__ != null) return true; else null;
		if(cl == Enum && o.__ename__ != null) return true; else null;
		return o.__enum__ == cl;
	}
}
js.Boot.__cast = function(o,t) {
	if(js.Boot.__instanceof(o,t)) return o; else throw "Cannot cast " + Std.string(o) + " to " + Std.string(t);
}
js.Node = function() { }
js.Node.__name__ = ["js","Node"];
var prime = prime || {}
if(!prime.core) prime.core = {}
if(!prime.core.traits) prime.core.traits = {}
prime.core.traits.IClonable = function() { }
prime.core.traits.IClonable.__name__ = ["prime","core","traits","IClonable"];
prime.core.traits.IClonable.prototype = {
	__class__: prime.core.traits.IClonable
}
prime.core.traits.IDisposable = function() { }
prime.core.traits.IDisposable.__name__ = ["prime","core","traits","IDisposable"];
prime.core.traits.IDisposable.prototype = {
	__class__: prime.core.traits.IDisposable
}
prime.core.traits.IValueObject = function() { }
prime.core.traits.IValueObject.__name__ = ["prime","core","traits","IValueObject"];
prime.core.traits.IValueObject.__interfaces__ = [prime.core.traits.IDisposable];
prime.core.traits.IEditEnabledValueObject = function() { }
prime.core.traits.IEditEnabledValueObject.__name__ = ["prime","core","traits","IEditEnabledValueObject"];
prime.core.traits.IEditEnabledValueObject.__interfaces__ = [prime.core.traits.IValueObject];
prime.core.traits.IEditEnabledValueObject.prototype = {
	__class__: prime.core.traits.IEditEnabledValueObject
}
prime.core.IBindableReadonly = function() { }
prime.core.IBindableReadonly.__name__ = ["prime","core","IBindableReadonly"];
prime.core.IBindableReadonly.__interfaces__ = [prime.core.traits.IValueObject];
prime.core.IBindableReadonly.prototype = {
	__class__: prime.core.IBindableReadonly
}
prime.core.IBindable = function() { }
prime.core.IBindable.__name__ = ["prime","core","IBindable"];
prime.core.IBindable.__interfaces__ = [prime.core.traits.IEditEnabledValueObject,prime.core.IBindableReadonly];
prime.core.IBindable.prototype = {
	__class__: prime.core.IBindable
}
prime.bindable.Bindable = function(val) {
	this.change = new prime.signal.Signal2();
	this.value = val;
};
prime.bindable.Bindable.__name__ = ["prime","core","Bindable"];
prime.bindable.Bindable.__interfaces__ = [prime.core.traits.IClonable,prime.core.IBindable];
prime.bindable.Bindable.prototype = {
	unbindAll: function() {
		if(this.writeTo) while(!(this.writeTo.head == null)) this.writeTo.pop().unbind(this);
		if(this.boundTo) while(!(this.boundTo.head == null)) this.boundTo.pop().unbind(this);
	}
	,unbind: function(otherBindable) {
		var removed = false;
		if(this.boundTo) removed = this.boundTo.remove(otherBindable);
		if(this.writeTo) removed = this.writeTo.remove(otherBindable) || removed;
		if(removed) otherBindable.unbind(this);
		return removed;
	}
	,pair: function(otherBindable) {
		otherBindable.keepUpdated(this);
		this.keepUpdated(otherBindable);
	}
	,keepUpdated: function(otherBindable) {
		otherBindable.setValue(this.value);
		otherBindable.registerBoundTo(this);
		var w = this.writeTo;
		if(!w) w = this.writeTo = new haxe.FastList();
		this.addToBoundList(w,otherBindable);
	}
	,addToBoundList: function(list,otherBindable) {
		var n = list.head;
		while(n) if(n.elt == otherBindable) {
			list = null;
			break;
		} else n = n.next;
		if(list) list.head = new haxe.FastCell(otherBindable,list.head);
	}
	,registerBoundTo: function(otherBindable) {
		var b = this.boundTo;
		if(!b) b = this.boundTo = new haxe.FastList();
		this.addToBoundList(b,otherBindable);
	}
	,bind: function(otherBindable) {
		otherBindable.keepUpdated(this);
	}
	,setValue: function(newValue) {
		if(this.value != newValue) {
			var oldV = this.value;
			this.value = newValue;
			this.change.send(newValue,oldV);
			prime.bindable.BindableTools.dispatchValueToBound(this.writeTo,newValue);
		}
		return newValue;
	}
	,clone: function() {
		return new prime.bindable.Bindable(this.value);
	}
	,isEmpty: function() {
		return this.value == null;
	}
	,dispose: function() {
		if(this.change == null) return;
		this.unbindAll();
		this.writeTo = null;
		this.boundTo = null;
		this.change.unbindAll();
		this.change = null;
		this.value = null;
	}
	,__class__: prime.bindable.Bindable
}
prime.bindable.BindableTools = function() { }
prime.bindable.BindableTools.__name__ = ["prime","core","BindableTools"];
prime.bindable.BindableTools.dispatchValueToBound = function(list,newValue) {
	if(list != null) {
		var n = list.head;
		while(n) {
			n.elt.setValue(newValue);
			n = n.next;
		}
	}
}
prime.core.ListNode = function() { }
prime.core.ListNode.__name__ = ["prime","core","ListNode"];
prime.core.ListNode.prototype = {
	__class__: prime.core.ListNode
}
prime.core.traits.IDuplicatable = function() { }
prime.core.traits.IDuplicatable.__name__ = ["prime","core","traits","IDuplicatable"];
prime.core.traits.IDuplicatable.prototype = {
	__class__: prime.core.traits.IDuplicatable
}
if(!prime.bindable.collections) prime.bindable.collections = {}
prime.bindable.collections.IReadOnlyList = function() { }
prime.bindable.collections.IReadOnlyList.__name__ = ["prime","core","collections","IReadOnlyList"];
prime.bindable.collections.IReadOnlyList.__interfaces__ = [prime.core.traits.IDisposable,prime.core.traits.IValueObject,prime.core.traits.IDuplicatable,prime.core.traits.IClonable];
prime.bindable.collections.IReadOnlyList.prototype = {
	__class__: prime.bindable.collections.IReadOnlyList
}
prime.bindable.collections.ReadOnlyArrayList = function(wrapAroundList) {
	this.change = new prime.signal.Signal1();
	this.beforeChange = new prime.signal.Signal1();
	if(!wrapAroundList) this.list = []; else this.list = wrapAroundList;
};
prime.bindable.collections.ReadOnlyArrayList.__name__ = ["prime","core","collections","ReadOnlyArrayList"];
prime.bindable.collections.ReadOnlyArrayList.__interfaces__ = [prime.bindable.collections.IReadOnlyList];
prime.bindable.collections.ReadOnlyArrayList.prototype = {
	applyChanges: function(c) {
		var $e = (c);
		switch( $e[1] ) {
		case 0:
			var newPos = $e[3], item = $e[2];
			prime.utils.FastArrayUtil.insertAt(this.list,item,newPos);
			break;
		case 1:
			var oldPos = $e[3], item = $e[2];
			prime.utils.FastArrayUtil.removeAt(this.list,oldPos);
			break;
		case 2:
			var oldPos = $e[4], newPos = $e[3], item = $e[2];
			prime.utils.FastArrayUtil.move(this.list,item,newPos,oldPos);
			break;
		case 3:
			prime.utils.FastArrayUtil.removeAll(this.list);
			break;
		}
		this.change.send(c);
	}
	,keepUpdated: function(other) {
		other.list = this.list.slice();
		this.beforeChange.bind(other,($_=other.beforeChange,$bind($_,$_.send)));
		this.change.bind(other,$bind(other,other.applyChanges));
		other.registerBoundTo(this);
		var w = this.writeTo;
		if(!w) w = this.writeTo = new haxe.FastList();
		this.addToBoundList(w,other);
	}
	,addToBoundList: function(list,other) {
		var n = list.head;
		while(n) if(n.elt == other) {
			list = null;
			break;
		} else n = n.next;
		if(list) list.head = new haxe.FastCell(other,list.head);
	}
	,registerBoundTo: function(other) {
		var b = this.boundTo;
		if(!b) b = this.boundTo = new haxe.FastList();
		this.addToBoundList(b,other);
	}
	,unbindAll: function() {
		if(this.writeTo) while(!(this.writeTo.head == null)) this.writeTo.pop().unbind(this);
		if(this.boundTo) while(!(this.boundTo.head == null)) this.boundTo.pop().unbind(this);
	}
	,unbind: function(other) {
		var removed = false;
		if(this.writeTo) {
			removed = this.writeTo.remove(other);
			if(removed) {
				this.beforeChange.unbind(other);
				this.change.unbind(other);
			}
		}
		if(this.boundTo) removed = this.boundTo.remove(other) || removed;
		if(removed) other.unbind(this);
		return removed;
	}
	,bind: function(other) {
		other.keepUpdated(this);
	}
	,inject: function(otherList) {
		this.list = otherList;
		this.change.send(prime.bindable.collections.ListChange.reset);
	}
	,has: function(item) {
		return prime.utils.FastArrayUtil.indexOf(this.list,item,null) >= 0;
	}
	,indexOf: function(item) {
		return prime.utils.FastArrayUtil.indexOf(this.list,item,null);
	}
	,getItemAt: function(pos) {
		return this.list[pos];
	}
	,reversedIterator: function() {
		return new prime.bindable.collections.iterators.FastArrayReversedIterator(this.list);
	}
	,forwardIterator: function() {
		return new prime.bindable.collections.iterators.FastArrayForwardIterator(this.list);
	}
	,iterator: function() {
		return new prime.bindable.collections.iterators.FastArrayForwardIterator(this.list);
	}
	,getLength: function() {
		return this.list.length;
	}
	,duplicate: function() {
		return new prime.bindable.collections.ReadOnlyArrayList(prime.utils.FastArrayUtil.duplicate(this.list));
	}
	,clone: function() {
		return new prime.bindable.collections.ReadOnlyArrayList(this.list.slice());
	}
	,dispose: function() {
		this.beforeChange.unbindAll();
		this.change.unbindAll();
		this.list = null;
		this.change = this.beforeChange = null;
	}
	,__class__: prime.bindable.collections.ReadOnlyArrayList
}
prime.bindable.collections.IEditableList = function() { }
prime.bindable.collections.IEditableList.__name__ = ["prime","core","collections","IEditableList"];
prime.bindable.collections.IEditableList.__interfaces__ = [prime.core.traits.IEditEnabledValueObject,prime.bindable.collections.IReadOnlyList];
prime.bindable.collections.IEditableList.prototype = {
	__class__: prime.bindable.collections.IEditableList
}
prime.bindable.collections.ArrayList = function(wrapAroundList) {
	prime.bindable.collections.ReadOnlyArrayList.call(this,wrapAroundList);
};
prime.bindable.collections.ArrayList.__name__ = ["prime","core","collections","ArrayList"];
prime.bindable.collections.ArrayList.__interfaces__ = [prime.bindable.collections.IEditableList];
prime.bindable.collections.ArrayList.__super__ = prime.bindable.collections.ReadOnlyArrayList;
prime.bindable.collections.ArrayList.prototype = $extend(prime.bindable.collections.ReadOnlyArrayList.prototype,{
	duplicate: function() {
		return new prime.bindable.collections.ArrayList(prime.utils.FastArrayUtil.duplicate(this.list));
	}
	,clone: function() {
		return new prime.bindable.collections.ArrayList(this.list.slice());
	}
	,move: function(item,newPos,curPos) {
		if(curPos == null) curPos = -1;
		if(curPos == -1) curPos = prime.utils.FastArrayUtil.indexOf(this.list,item,null);
		if(newPos > this.list.length - 1) newPos = this.list.length - 1; else if(newPos < 0) newPos = this.list.length - newPos;
		if(curPos != newPos) {
			var msg = prime.bindable.collections.ListChange.moved(item,newPos,curPos);
			this.beforeChange.send(msg);
			if(prime.utils.FastArrayUtil.move(this.list,item,newPos,curPos)) this.change.send(msg);
		}
		return item;
	}
	,remove: function(item,curPos) {
		if(curPos == null) curPos = -1;
		if(curPos == -1) curPos = prime.utils.FastArrayUtil.indexOf(this.list,item,null);
		if(curPos > -1) {
			var msg = prime.bindable.collections.ListChange.removed(item,curPos);
			this.beforeChange.send(msg);
			prime.utils.FastArrayUtil.removeAt(this.list,curPos);
			this.change.send(msg);
		}
		return item;
	}
	,add: function(item,pos) {
		if(pos == null) pos = -1;
		pos = prime.utils.FastArrayUtil.validateNewIndex(this.list,pos);
		var msg = prime.bindable.collections.ListChange.added(item,pos);
		this.beforeChange.send(msg);
		var p = prime.utils.FastArrayUtil.insertAt(this.list,item,pos);
		this.change.send(msg);
		return item;
	}
	,isEmpty: function() {
		return this.list.length == 0;
	}
	,removeAll: function() {
		if(this.list.length > 0) {
			var msg = prime.bindable.collections.ListChange.reset;
			this.beforeChange.send(msg);
			prime.utils.FastArrayUtil.removeAll(this.list);
			this.change.send(msg);
		}
	}
	,dispose: function() {
		this.removeAll();
		prime.bindable.collections.ReadOnlyArrayList.prototype.dispose.call(this);
	}
	,__class__: prime.bindable.collections.ArrayList
});
prime.bindable.collections.ReadOnlyArrayList_prime_gui_effects_Effect = function(wrapAroundList) {
	this.change = new prime.signal.Signal1();
	this.beforeChange = new prime.signal.Signal1();
	if(!wrapAroundList) this.list = []; else this.list = wrapAroundList;
};
prime.bindable.collections.ReadOnlyArrayList_prime_gui_effects_Effect.__name__ = ["prime","core","collections","ReadOnlyArrayList_prime_gui_effects_Effect"];
prime.bindable.collections.ReadOnlyArrayList_prime_gui_effects_Effect.__interfaces__ = [prime.bindable.collections.IReadOnlyList];
prime.bindable.collections.ReadOnlyArrayList_prime_gui_effects_Effect.prototype = {
	applyChanges: function(c) {
		var $e = (c);
		switch( $e[1] ) {
		case 0:
			var newPos = $e[3], item = $e[2];
			prime.utils.FastArrayUtil.insertAt(this.list,item,newPos);
			break;
		case 1:
			var oldPos = $e[3], item = $e[2];
			prime.utils.FastArrayUtil.removeAt(this.list,oldPos);
			break;
		case 2:
			var oldPos = $e[4], newPos = $e[3], item = $e[2];
			prime.utils.FastArrayUtil.move(this.list,item,newPos,oldPos);
			break;
		case 3:
			prime.utils.FastArrayUtil.removeAll(this.list);
			break;
		}
		this.change.send(c);
	}
	,keepUpdated: function(other) {
		other.list = this.list.slice();
		this.beforeChange.bind(other,($_=other.beforeChange,$bind($_,$_.send)));
		this.change.bind(other,$bind(other,other.applyChanges));
		other.registerBoundTo(this);
		var w = this.writeTo;
		if(!w) w = this.writeTo = new haxe.FastList();
		this.addToBoundList(w,other);
	}
	,addToBoundList: function(list,other) {
		var n = list.head;
		while(n) if(n.elt == other) {
			list = null;
			break;
		} else n = n.next;
		if(list) list.head = new haxe.FastCell(other,list.head);
	}
	,registerBoundTo: function(other) {
		var b = this.boundTo;
		if(!b) b = this.boundTo = new haxe.FastList();
		this.addToBoundList(b,other);
	}
	,unbindAll: function() {
		if(this.writeTo) while(!(this.writeTo.head == null)) this.writeTo.pop().unbind(this);
		if(this.boundTo) while(!(this.boundTo.head == null)) this.boundTo.pop().unbind(this);
	}
	,unbind: function(other) {
		var removed = false;
		if(this.writeTo) {
			removed = this.writeTo.remove(other);
			if(removed) {
				this.beforeChange.unbind(other);
				this.change.unbind(other);
			}
		}
		if(this.boundTo) removed = this.boundTo.remove(other) || removed;
		if(removed) other.unbind(this);
		return removed;
	}
	,bind: function(other) {
		other.keepUpdated(this);
	}
	,inject: function(otherList) {
		this.list = otherList;
		this.change.send(prime.bindable.collections.ListChange.reset);
	}
	,has: function(item) {
		return prime.utils.FastArrayUtil.indexOf(this.list,item,null) >= 0;
	}
	,indexOf: function(item) {
		return prime.utils.FastArrayUtil.indexOf(this.list,item,null);
	}
	,getItemAt: function(pos) {
		return this.list[pos];
	}
	,reversedIterator: function() {
		return new prime.bindable.collections.iterators.FastArrayReversedIterator(this.list);
	}
	,forwardIterator: function() {
		return new prime.bindable.collections.iterators.FastArrayForwardIterator(this.list);
	}
	,iterator: function() {
		return new prime.bindable.collections.iterators.FastArrayForwardIterator(this.list);
	}
	,getLength: function() {
		return this.list.length;
	}
	,duplicate: function() {
		return new prime.bindable.collections.ReadOnlyArrayList_prime_gui_effects_Effect(prime.utils.FastArrayUtil.duplicate(this.list));
	}
	,clone: function() {
		return new prime.bindable.collections.ReadOnlyArrayList_prime_gui_effects_Effect(this.list.slice());
	}
	,dispose: function() {
		this.beforeChange.unbindAll();
		this.change.unbindAll();
		this.list = null;
		this.change = this.beforeChange = null;
	}
	,__class__: prime.bindable.collections.ReadOnlyArrayList_prime_gui_effects_Effect
}
prime.bindable.collections.ArrayList_prime_gui_effects_Effect = function(wrapAroundList) {
	prime.bindable.collections.ReadOnlyArrayList_prime_gui_effects_Effect.call(this,wrapAroundList);
};
prime.bindable.collections.ArrayList_prime_gui_effects_Effect.__name__ = ["prime","core","collections","ArrayList_prime_gui_effects_Effect"];
prime.bindable.collections.ArrayList_prime_gui_effects_Effect.__interfaces__ = [prime.bindable.collections.IEditableList];
prime.bindable.collections.ArrayList_prime_gui_effects_Effect.__super__ = prime.bindable.collections.ReadOnlyArrayList_prime_gui_effects_Effect;
prime.bindable.collections.ArrayList_prime_gui_effects_Effect.prototype = $extend(prime.bindable.collections.ReadOnlyArrayList_prime_gui_effects_Effect.prototype,{
	duplicate: function() {
		return new prime.bindable.collections.ArrayList_prime_gui_effects_Effect(prime.utils.FastArrayUtil.duplicate(this.list));
	}
	,clone: function() {
		return new prime.bindable.collections.ArrayList_prime_gui_effects_Effect(this.list.slice());
	}
	,move: function(item,newPos,curPos) {
		if(curPos == null) curPos = -1;
		if(curPos == -1) curPos = prime.utils.FastArrayUtil.indexOf(this.list,item,null);
		if(newPos > this.list.length - 1) newPos = this.list.length - 1; else if(newPos < 0) newPos = this.list.length - newPos;
		if(curPos != newPos) {
			var msg = prime.bindable.collections.ListChange.moved(item,newPos,curPos);
			this.beforeChange.send(msg);
			if(prime.utils.FastArrayUtil.move(this.list,item,newPos,curPos)) this.change.send(msg);
		}
		return item;
	}
	,remove: function(item,curPos) {
		if(curPos == null) curPos = -1;
		if(curPos == -1) curPos = prime.utils.FastArrayUtil.indexOf(this.list,item,null);
		if(curPos > -1) {
			var msg = prime.bindable.collections.ListChange.removed(item,curPos);
			this.beforeChange.send(msg);
			prime.utils.FastArrayUtil.removeAt(this.list,curPos);
			this.change.send(msg);
		}
		return item;
	}
	,add: function(item,pos) {
		if(pos == null) pos = -1;
		pos = prime.utils.FastArrayUtil.validateNewIndex(this.list,pos);
		var msg = prime.bindable.collections.ListChange.added(item,pos);
		this.beforeChange.send(msg);
		var p = prime.utils.FastArrayUtil.insertAt(this.list,item,pos);
		this.change.send(msg);
		return item;
	}
	,isEmpty: function() {
		return this.list.length == 0;
	}
	,removeAll: function() {
		if(this.list.length > 0) {
			var msg = prime.bindable.collections.ListChange.reset;
			this.beforeChange.send(msg);
			prime.utils.FastArrayUtil.removeAll(this.list);
			this.change.send(msg);
		}
	}
	,dispose: function() {
		this.removeAll();
		prime.bindable.collections.ReadOnlyArrayList_prime_gui_effects_Effect.prototype.dispose.call(this);
	}
	,__class__: prime.bindable.collections.ArrayList_prime_gui_effects_Effect
});
prime.bindable.collections.FastCell = function(data,prev) {
	this.data = data;
	if(prev != null) {
		this.next = prev.next;
		prev.next = this;
	}
};
prime.bindable.collections.FastCell.__name__ = ["prime","core","collections","FastCell"];
prime.bindable.collections.FastCell.__interfaces__ = [prime.core.traits.IDisposable];
prime.bindable.collections.FastCell.prototype = {
	dispose: function() {
		this.data = null;
		this.next = null;
	}
	,__class__: prime.bindable.collections.FastCell
}
prime.bindable.collections.FastDoubleCell = function(data,prev,next) {
	this.data = data;
	this.prev = prev;
	this.next = next;
};
prime.bindable.collections.FastDoubleCell.__name__ = ["prime","core","collections","FastDoubleCell"];
prime.bindable.collections.FastDoubleCell.prototype = {
	remove: function() {
		if(this.prev != null) this.prev.next = this.next;
		if(this.next != null) this.next.prev = this.prev;
		this.prev = this.next = null;
	}
	,insertAfter: function(cell) {
		if(cell.next != this) {
			this.next = cell.next;
			if(this.next != null) this.next.prev = this;
			cell.next = this;
			this.prev = cell;
		}
		return this;
	}
	,insertBefore: function(cell) {
		if(cell.prev != this) {
			this.prev = cell.prev;
			if(this.prev != null) this.prev.next = this;
			cell.prev = this;
			this.next = cell;
		}
		return this;
	}
	,__class__: prime.bindable.collections.FastDoubleCell
}
prime.bindable.collections.ListChange = { __ename__ : ["prime","core","collections","ListChange"], __constructs__ : ["added","removed","moved","reset"] }
prime.bindable.collections.ListChange.added = function(item,newPos) { var $x = ["added",0,item,newPos]; $x.__enum__ = prime.bindable.collections.ListChange; $x.toString = $estr; return $x; }
prime.bindable.collections.ListChange.removed = function(item,oldPos) { var $x = ["removed",1,item,oldPos]; $x.__enum__ = prime.bindable.collections.ListChange; $x.toString = $estr; return $x; }
prime.bindable.collections.ListChange.moved = function(item,newPos,oldPos) { var $x = ["moved",2,item,newPos,oldPos]; $x.__enum__ = prime.bindable.collections.ListChange; $x.toString = $estr; return $x; }
prime.bindable.collections.ListChange.reset = ["reset",3];
prime.bindable.collections.ListChange.reset.toString = $estr;
prime.bindable.collections.ListChange.reset.__enum__ = prime.bindable.collections.ListChange;
prime.bindable.collections.SimpleList = function() {
	this._length = 0;
	this.change = new prime.signal.Signal1();
	this.beforeChange = new prime.signal.Signal1();
};
prime.bindable.collections.SimpleList.__name__ = ["prime","core","collections","SimpleList"];
prime.bindable.collections.SimpleList.__interfaces__ = [prime.bindable.collections.IEditableList];
prime.bindable.collections.SimpleList.prototype = {
	removeCell: function(cell) {
		if(cell == this.first) this.first = cell.next;
		if(cell == this.last) this.last = cell.prev;
		cell.remove();
		this._length--;
	}
	,removeItem: function(item,curPos) {
		if(curPos == null) curPos = -1;
		if(curPos == -1) curPos = this.indexOf(item);
		if(curPos > -1) {
			var cell = this.getCellAt(curPos);
			if(cell != null) this.removeCell(cell);
		}
		return curPos;
	}
	,getCellAt: function(pos) {
		var currentCell = this.first;
		pos = pos < 0?this._length + pos:pos;
		if(pos == 0) return this.first;
		if(pos == this._length - 1) return this.last;
		if(pos < (function($this) {
			var $r;
			var var1 = $this._length / 2;
			$r = var1 < 0?var1 - .9 | 0:var1 | 0;
			return $r;
		}(this))) {
			var _g = 0;
			while(_g < pos) {
				var i = _g++;
				if(currentCell != null) currentCell = currentCell.next;
			}
		} else {
			currentCell = this.last;
			pos = this._length - pos - 1;
			var _g = 0;
			while(_g < pos) {
				var i = _g++;
				if(currentCell != null) currentCell = currentCell.prev;
			}
		}
		return currentCell;
	}
	,insertCellAt: function(cell,pos) {
		if(pos == null) pos = -1;
		if(pos < 0 || pos > this._length) pos = this._length;
		if(pos == 0) {
			if(this.first != null) cell.insertBefore(this.first);
			this.first = cell;
			if(this.last == null) this.last = cell;
		} else if(pos == this._length) {
			cell.insertAfter(this.last);
			this.last = cell;
			null;
		} else {
			cell.insertBefore(this.getCellAt(pos));
			null;
		}
		this._length++;
		return pos;
	}
	,has: function(item) {
		return this.indexOf(item) > -1;
	}
	,indexOf: function(item) {
		var cur = this.first;
		var pos = -1, foundPos = -1;
		while(cur != null && foundPos == -1) {
			pos++;
			if(cur.data == item) foundPos = pos;
			cur = cur.next;
		}
		return foundPos;
	}
	,move: function(item,newPos,curPos) {
		if(curPos == null) curPos = -1;
		if(curPos == -1) curPos = this.indexOf(item);
		if(newPos > this._length) newPos = this._length; else if(newPos < 0) newPos = this._length + newPos;
		if(curPos != newPos) {
			this.beforeChange.send(prime.bindable.collections.ListChange.moved(item,newPos,curPos));
			var cell = this.getCellAt(curPos);
			this.removeCell(cell);
			if(newPos == this._length || curPos > newPos) this.insertCellAt(cell,newPos); else this.insertCellAt(cell,newPos - 1);
			this.change.send(prime.bindable.collections.ListChange.moved(item,newPos,curPos));
		}
		return item;
	}
	,remove: function(item,curPos) {
		if(curPos == null) curPos = -1;
		if(item != null) {
			if(curPos == -1) curPos = this.indexOf(item);
			if(curPos == -1) return item;
			this.beforeChange.send(prime.bindable.collections.ListChange.removed(item,curPos));
			this.removeItem(item,curPos);
			this.change.send(prime.bindable.collections.ListChange.removed(item,curPos));
		}
		return item;
	}
	,add: function(item,pos) {
		if(pos == null) pos = -1;
		this.beforeChange.send(prime.bindable.collections.ListChange.added(item,pos));
		pos = this.insertCellAt(new prime.bindable.collections.FastDoubleCell(item,null),pos);
		this.change.send(prime.bindable.collections.ListChange.added(item,pos));
		return item;
	}
	,getItemAt: function(pos) {
		var cell = this.getCellAt(pos);
		return cell != null?cell.data:null;
	}
	,reversedIterator: function() {
		return new prime.bindable.collections.iterators.FastDoubleCellReversedIterator(this.last);
	}
	,forwardIterator: function() {
		return new prime.bindable.collections.iterators.FastDoubleCellForwardIterator(this.first);
	}
	,iterator: function() {
		return this.forwardIterator();
	}
	,getLength: function() {
		return this._length;
	}
	,isEmpty: function() {
		return this._length == 0;
	}
	,duplicate: function() {
		var inst = new prime.bindable.collections.SimpleList();
		var length = this._length;
		var _g = 0;
		while(_g < length) {
			var i = _g++;
			inst.insertCellAt(new prime.bindable.collections.FastDoubleCell(prime.utils.DuplicateUtil.duplicateItem(this.getItemAt(i)),null),i);
		}
		return inst;
	}
	,clone: function() {
		var inst = new prime.bindable.collections.SimpleList();
		var length = this._length;
		var _g = 0;
		while(_g < length) {
			var i = _g++;
			inst.insertCellAt(new prime.bindable.collections.FastDoubleCell(this.getItemAt(i),null),i);
		}
		return inst;
	}
	,dispose: function() {
		if(this.change == null) return;
		this.removeAll();
		this.change.unbindAll();
		this.change = null;
	}
	,removeAll: function() {
		if(this._length > 0) {
			this.beforeChange.send(prime.bindable.collections.ListChange.reset);
			var cur = this.first;
			while(cur != null) {
				var tmp = cur;
				cur = cur.next;
				tmp.data = null;
				tmp.next = tmp.prev = null;
			}
			this.first = this.last = null;
			this._length = 0;
			this.change.send(prime.bindable.collections.ListChange.reset);
		}
	}
	,__class__: prime.bindable.collections.SimpleList
}
if(!prime.bindable.collections.iterators) prime.bindable.collections.iterators = {}
prime.bindable.collections.iterators.IIterator = function() { }
prime.bindable.collections.iterators.IIterator.__name__ = ["prime","core","collections","iterators","IIterator"];
prime.bindable.collections.iterators.IIterator.prototype = {
	__class__: prime.bindable.collections.iterators.IIterator
}
prime.bindable.collections.iterators.FastArrayForwardIterator = function(target) {
	this.target = target;
	this.current = 0;
};
prime.bindable.collections.iterators.FastArrayForwardIterator.__name__ = ["prime","core","collections","iterators","FastArrayForwardIterator"];
prime.bindable.collections.iterators.FastArrayForwardIterator.__interfaces__ = [prime.bindable.collections.iterators.IIterator];
prime.bindable.collections.iterators.FastArrayForwardIterator.prototype = {
	value: function() {
		return this.target[this.current];
	}
	,next: function() {
		return this.target[this.current++];
	}
	,hasNext: function() {
		return this.current < (this.target.length | 0);
	}
	,rewind: function() {
		this.current = 0;
	}
	,setCurrent: function(val) {
		this.current = val;
	}
	,__class__: prime.bindable.collections.iterators.FastArrayForwardIterator
}
prime.bindable.collections.iterators.FastArrayReversedIterator = function(target) {
	this.target = target;
	this.current = this.target.length - 1;
};
prime.bindable.collections.iterators.FastArrayReversedIterator.__name__ = ["prime","core","collections","iterators","FastArrayReversedIterator"];
prime.bindable.collections.iterators.FastArrayReversedIterator.__interfaces__ = [prime.bindable.collections.iterators.IIterator];
prime.bindable.collections.iterators.FastArrayReversedIterator.prototype = {
	value: function() {
		return this.target[this.current];
	}
	,next: function() {
		return this.target[this.current--];
	}
	,hasNext: function() {
		return this.current >= 0;
	}
	,rewind: function() {
		this.current = this.target.length - 1;
	}
	,setCurrent: function(val) {
		this.current = val;
	}
	,__class__: prime.bindable.collections.iterators.FastArrayReversedIterator
}
prime.bindable.collections.iterators.FastDoubleCellForwardIterator = function(first) {
	this.first = first;
	this.current = this.first;
};
prime.bindable.collections.iterators.FastDoubleCellForwardIterator.__name__ = ["prime","core","collections","iterators","FastDoubleCellForwardIterator"];
prime.bindable.collections.iterators.FastDoubleCellForwardIterator.__interfaces__ = [prime.bindable.collections.iterators.IIterator];
prime.bindable.collections.iterators.FastDoubleCellForwardIterator.prototype = {
	next: function() {
		var c = this.current;
		this.current = this.current.next;
		return c.data;
	}
	,value: function() {
		return this.current.data;
	}
	,hasNext: function() {
		return this.current != null;
	}
	,rewind: function() {
		this.current = this.first;
	}
	,setCurrent: function(val) {
		this.current = val;
	}
	,__class__: prime.bindable.collections.iterators.FastDoubleCellForwardIterator
}
prime.bindable.collections.iterators.FastDoubleCellReversedIterator = function(last) {
	this.last = last;
	this.current = this.last;
};
prime.bindable.collections.iterators.FastDoubleCellReversedIterator.__name__ = ["prime","core","collections","iterators","FastDoubleCellReversedIterator"];
prime.bindable.collections.iterators.FastDoubleCellReversedIterator.__interfaces__ = [prime.bindable.collections.iterators.IIterator];
prime.bindable.collections.iterators.FastDoubleCellReversedIterator.prototype = {
	next: function() {
		var c = this.current;
		this.current = this.current.prev;
		return c.data;
	}
	,value: function() {
		return this.current.data;
	}
	,hasNext: function() {
		return this.current != null;
	}
	,rewind: function() {
		this.current = this.last;
	}
	,setCurrent: function(val) {
		this.current = val;
	}
	,__class__: prime.bindable.collections.iterators.FastDoubleCellReversedIterator
}
if(!prime.core.dispatcher) prime.core.dispatcher = {}
prime.signal.IUnbindable = function() { }
prime.signal.IUnbindable.__name__ = ["prime","core","dispatcher","IUnbindable"];
prime.signal.IUnbindable.prototype = {
	__class__: prime.signal.IUnbindable
}
prime.signal.INotifier = function() { }
prime.signal.INotifier.__name__ = ["prime","core","dispatcher","INotifier"];
prime.signal.INotifier.__interfaces__ = [prime.core.traits.IDisposable,prime.signal.IUnbindable];
prime.signal.INotifier.prototype = {
	__class__: prime.signal.INotifier
}
prime.signal.ISender = function() { }
prime.signal.ISender.__name__ = ["prime","core","dispatcher","ISender"];
prime.signal.ISender0 = function() { }
prime.signal.ISender0.__name__ = ["prime","core","dispatcher","ISender0"];
prime.signal.ISender0.__interfaces__ = [prime.signal.ISender];
prime.signal.ISender0.prototype = {
	__class__: prime.signal.ISender0
}
prime.signal.ISender1 = function() { }
prime.signal.ISender1.__name__ = ["prime","core","dispatcher","ISender1"];
prime.signal.ISender1.__interfaces__ = [prime.signal.ISender];
prime.signal.ISender1.prototype = {
	__class__: prime.signal.ISender1
}
prime.signal.ISender2 = function() { }
prime.signal.ISender2.__name__ = ["prime","core","dispatcher","ISender2"];
prime.signal.ISender2.__interfaces__ = [prime.signal.ISender];
prime.signal.ISender2.prototype = {
	__class__: prime.signal.ISender2
}
prime.signal.IWireWatcher = function() { }
prime.signal.IWireWatcher.__name__ = ["prime","core","dispatcher","IWireWatcher"];
prime.signal.IWireWatcher.prototype = {
	__class__: prime.signal.IWireWatcher
}
prime.signal.WireList = function() { }
prime.signal.WireList.__name__ = ["prime","core","dispatcher","WireList"];
prime.signal.WireList.__super__ = prime.core.ListNode;
prime.signal.WireList.prototype = $extend(prime.core.ListNode.prototype,{
	__class__: prime.signal.WireList
});
prime.core.traits.IDisablable = function() { }
prime.core.traits.IDisablable.__name__ = ["prime","core","traits","IDisablable"];
prime.core.traits.IDisablable.prototype = {
	__class__: prime.core.traits.IDisablable
}
prime.signal.Signal = function() { }
prime.signal.Signal.__name__ = ["prime","core","dispatcher","Signal"];
prime.signal.Signal.__interfaces__ = [prime.core.traits.IDisablable,prime.core.traits.IDisposable,prime.signal.IUnbindable];
prime.signal.Signal.notifyEnabled = function(s,w) {
	if(js.Boot.__instanceof(s,prime.signal.IWireWatcher)) {
		var x = s;
		x.wireEnabled(w);
	}
}
prime.signal.Signal.notifyDisabled = function(s,w) {
	if(js.Boot.__instanceof(s,prime.signal.IWireWatcher)) {
		var x = s;
		x.wireDisabled(w);
	}
}
prime.signal.Signal.__super__ = prime.signal.WireList;
prime.signal.Signal.prototype = $extend(prime.signal.WireList.prototype,{
	unbindAll: function() {
		var b = this.n;
		while(b) {
			var x = b.n;
			b.dispose();
			b = x;
		}
	}
	,dispose: function() {
		this.unbindAll();
	}
	,unbind: function(listener,handler) {
		var b = this.n;
		while(b) {
			var x = b.n;
			if(b.owner == listener && (handler == null || Reflect.compareMethods(handler,b.handler))) b.dispose();
			b = x;
		}
	}
	,isEnabled: function() {
		return this.enabled;
	}
	,disable: function() {
		this.enabled = false;
	}
	,enable: function() {
		this.enabled = true;
	}
	,__class__: prime.signal.Signal
});
prime.signal.Signal0 = function() {
	this.enabled = true;
};
prime.signal.Signal0.__name__ = ["prime","core","dispatcher","Signal0"];
prime.signal.Signal0.__interfaces__ = [prime.signal.INotifier,prime.signal.ISender0];
prime.signal.Signal0.__super__ = prime.signal.Signal;
prime.signal.Signal0.prototype = $extend(prime.signal.Signal.prototype,{
	observeDisabled: function(owner,handler) {
		return prime.signal.Wire.make(this,owner,handler,0);
	}
	,observeOnce: function(owner,handler) {
		return prime.signal.Wire.make(this,owner,handler,5);
	}
	,observe: function(owner,handler) {
		return prime.signal.Wire.make(this,owner,handler,1);
	}
	,bindDisabled: function(owner,handler) {
		return prime.signal.Wire.make(this,owner,handler,0);
	}
	,bindOnce: function(owner,handler) {
		return prime.signal.Wire.make(this,owner,handler,5);
	}
	,bind: function(owner,handler) {
		return prime.signal.Wire.make(this,owner,handler,1);
	}
	,send: function() {
		if(this.enabled) {
			var w = this.n;
			while(w) {
				this.nextSendable = w.n;
				if((w.flags & 4) != 0) w.disable();
				w.handler();
				if((w.flags & 4) != 0) w.dispose();
				w = this.nextSendable;
			}
			this.nextSendable = null;
		}
	}
	,__class__: prime.signal.Signal0
});
prime.signal.Signal1 = function() {
	this.enabled = true;
};
prime.signal.Signal1.__name__ = ["prime","core","dispatcher","Signal1"];
prime.signal.Signal1.__interfaces__ = [prime.signal.INotifier,prime.signal.ISender1];
prime.signal.Signal1.__super__ = prime.signal.Signal;
prime.signal.Signal1.prototype = $extend(prime.signal.Signal.prototype,{
	observeDisabled: function(owner,handler) {
		return prime.signal.Wire.make(this,owner,handler,2);
	}
	,observeOnce: function(owner,handler) {
		return prime.signal.Wire.make(this,owner,handler,7);
	}
	,observe: function(owner,handler) {
		return prime.signal.Wire.make(this,owner,handler,3);
	}
	,bindDisabled: function(owner,handler) {
		return prime.signal.Wire.make(this,owner,handler,0);
	}
	,bindOnce: function(owner,handler) {
		return prime.signal.Wire.make(this,owner,handler,5);
	}
	,bind: function(owner,handler) {
		return prime.signal.Wire.make(this,owner,handler,1);
	}
	,send: function(_1) {
		if(this.enabled) {
			var w = this.n;
			while(w) {
				this.nextSendable = w.n;
				if((w.flags & 4) != 0) w.disable();
				if((w.flags & 2) != 0) w.handler(); else w.handler(_1);
				if((w.flags & 4) != 0) w.dispose();
				w = this.nextSendable;
			}
			this.nextSendable = null;
		}
	}
	,__class__: prime.signal.Signal1
});
prime.signal.Signal2 = function() {
	this.enabled = true;
};
prime.signal.Signal2.__name__ = ["prime","core","dispatcher","Signal2"];
prime.signal.Signal2.__interfaces__ = [prime.signal.INotifier,prime.signal.ISender2];
prime.signal.Signal2.__super__ = prime.signal.Signal;
prime.signal.Signal2.prototype = $extend(prime.signal.Signal.prototype,{
	observeDisabled: function(owner,handler) {
		return prime.signal.Wire.make(this,owner,handler,2);
	}
	,observeOnce: function(owner,handler) {
		return prime.signal.Wire.make(this,owner,handler,7);
	}
	,observe: function(owner,handler) {
		return prime.signal.Wire.make(this,owner,handler,3);
	}
	,bindDisabled: function(owner,handler) {
		return prime.signal.Wire.make(this,owner,handler,0);
	}
	,bindOnce: function(owner,handler) {
		return prime.signal.Wire.make(this,owner,handler,5);
	}
	,bind: function(owner,handler) {
		return prime.signal.Wire.make(this,owner,handler,1);
	}
	,send: function(_1,_2) {
		if(this.enabled) {
			var w = this.n;
			while(w) {
				this.nextSendable = w.n;
				if((w.flags & 4) != 0) w.disable();
				if((w.flags & 2) != 0) w.handler(); else w.handler(_1,_2);
				if((w.flags & 4) != 0) w.dispose();
				w = this.nextSendable;
			}
			this.nextSendable = null;
		}
	}
	,__class__: prime.signal.Signal2
});
prime.signal.Signals = function() { }
prime.signal.Signals.__name__ = ["prime","core","dispatcher","Signals"];
prime.signal.Signals.__interfaces__ = [haxe.Public,prime.core.traits.IDisablable,prime.core.traits.IDisposable,prime.signal.IUnbindable];
prime.signal.Signals.prototype = {
	isEnabled: function() {
		return this._enabled;
	}
	,unbindAll: function() {
	}
	,unbind: function(listener,handler) {
	}
	,dispose: function() {
	}
	,enable: function() {
		this._enabled = true;
	}
	,disable: function() {
		this._enabled = false;
	}
	,__class__: prime.signal.Signals
}
prime.signal.Wire = function(f) {
	if(f == null) f = 0;
	this.flags = f;
};
prime.signal.Wire.__name__ = ["prime","core","dispatcher","Wire"];
prime.signal.Wire.__interfaces__ = [prime.core.traits.IDisablable,prime.core.traits.IDisposable];
prime.signal.Wire.make = function(dispatcher,owner,handlerFn,flags) {
	var w, W = prime.signal.Wire;
	if(W.free == null) w = new prime.signal.Wire(flags); else {
		W.free = (w = W.free).n;
		--W.freeCount;
		w.n = null;
		w.flags = flags;
	}
	w.owner = owner;
	w.signal = dispatcher;
	w.handler = handlerFn;
	if((flags & 1) != 0) w.doEnable();
	return w;
}
prime.signal.Wire.__super__ = prime.signal.WireList;
prime.signal.Wire.prototype = $extend(prime.signal.WireList.prototype,{
	dispose: function() {
		if(this.signal == null) return;
		this.disable();
		this.setHandler(this.owner = this.signal = null);
		this.flags = 0;
		var W = prime.signal.Wire;
		if(W.freeCount != 8096) {
			++W.freeCount;
			this.n = W.free;
			W.free = this;
		} else null;
	}
	,disable: function() {
		if((this.flags & 1) != 0) {
			this.flags = (function($this) {
				var $r;
				var bits = $this.flags;
				$r = bits &= -2;
				return $r;
			}(this));
			var x = this.signal;
			while(x.n != null && x.n != this) x = x.n;
			x.n = this.n;
			this.n = null;
			if(this.signal.nextSendable == this) this.signal.nextSendable = x.n;
			prime.signal.Signal.notifyDisabled(this.signal,this);
		}
	}
	,doEnable: function() {
		var s = this.signal;
		this.n = s.n;
		s.n = this;
		prime.signal.Signal.notifyEnabled(this.signal,this);
	}
	,enable: function() {
		if(!((this.flags & 1) != 0)) {
			this.flags = (function($this) {
				var $r;
				var bits = $this.flags;
				$r = bits |= 1;
				return $r;
			}(this));
			this.doEnable();
		}
	}
	,setHandler: function(h) {
		this.flags = (function($this) {
			var $r;
			var bits = $this.flags;
			$r = bits &= -3;
			return $r;
		}(this));
		return this.handler = h;
	}
	,isEnabled: function() {
		return (this.flags & 1) != 0;
	}
	,__class__: prime.signal.Wire
});
if(!prime.core.events) prime.core.events = {}
prime.core.events.CommunicationSignals = function() { }
prime.core.events.CommunicationSignals.__name__ = ["prime","core","events","CommunicationSignals"];
prime.core.events.CommunicationSignals.__super__ = prime.signal.Signals;
prime.core.events.CommunicationSignals.prototype = $extend(prime.signal.Signals.prototype,{
	enable: function() {
		if(this._enabled) return;
		if(this.started != null) this.started.enable();
		if(this.init != null) this.init.enable();
		if(this.progress != null) this.progress.enable();
		if(this.completed != null) this.completed.enable();
		if(this.error != null) this.error.enable(); else null;
		prime.signal.Signals.prototype.enable.call(this);
	}
	,disable: function() {
		if(!this._enabled) return;
		if(this.started != null) this.started.disable();
		if(this.init != null) this.init.disable();
		if(this.progress != null) this.progress.disable();
		if(this.completed != null) this.completed.disable();
		if(this.error != null) this.error.disable(); else null;
		prime.signal.Signals.prototype.disable.call(this);
	}
	,unbind: function(l,h) {
		if(this.started != null) this.started.unbind(l,h);
		if(this.init != null) this.init.unbind(l,h);
		if(this.progress != null) this.progress.unbind(l,h);
		if(this.completed != null) this.completed.unbind(l,h);
		if(this.error != null) this.error.unbind(l,h); else null;
		prime.signal.Signals.prototype.unbind.call(this,l,h);
	}
	,unbindAll: function() {
		if(this.started != null) this.started.unbindAll();
		if(this.init != null) this.init.unbindAll();
		if(this.progress != null) this.progress.unbindAll();
		if(this.completed != null) this.completed.unbindAll();
		if(this.error != null) this.error.unbindAll(); else null;
		prime.signal.Signals.prototype.unbindAll.call(this);
	}
	,dispose: function() {
		if(this.started != null) this.started.dispose();
		if(this.init != null) this.init.dispose();
		if(this.progress != null) this.progress.dispose();
		if(this.completed != null) this.completed.dispose();
		if(this.error != null) this.error.dispose();
		this.started = null;
		this.init = null;
		this.progress = null;
		this.completed = null;
		this.error = null;
		prime.signal.Signals.prototype.dispose.call(this);
	}
	,__class__: prime.core.events.CommunicationSignals
});
prime.core.events.LoaderSignals = function() { }
prime.core.events.LoaderSignals.__name__ = ["prime","core","events","LoaderSignals"];
prime.core.events.LoaderSignals.__super__ = prime.signal.Signals;
prime.core.events.LoaderSignals.prototype = $extend(prime.signal.Signals.prototype,{
	enable: function() {
		if(this._enabled) return;
		if(this.unloaded != null) this.unloaded.enable();
		if(this.load != null) this.load.enable();
		if(this.httpStatus != null) this.httpStatus.enable();
		if(this.uploadComplete != null) this.uploadComplete.enable();
		if(this.uploadCanceled != null) this.uploadCanceled.enable(); else null;
		prime.signal.Signals.prototype.enable.call(this);
	}
	,disable: function() {
		if(!this._enabled) return;
		if(this.unloaded != null) this.unloaded.disable();
		if(this.load != null) this.load.disable();
		if(this.httpStatus != null) this.httpStatus.disable();
		if(this.uploadComplete != null) this.uploadComplete.disable();
		if(this.uploadCanceled != null) this.uploadCanceled.disable(); else null;
		prime.signal.Signals.prototype.disable.call(this);
	}
	,unbind: function(l,h) {
		if(this.unloaded != null) this.unloaded.unbind(l,h);
		if(this.load != null) this.load.unbind(l,h);
		if(this.httpStatus != null) this.httpStatus.unbind(l,h);
		if(this.uploadComplete != null) this.uploadComplete.unbind(l,h);
		if(this.uploadCanceled != null) this.uploadCanceled.unbind(l,h); else null;
		prime.signal.Signals.prototype.unbind.call(this,l,h);
	}
	,unbindAll: function() {
		if(this.unloaded != null) this.unloaded.unbindAll();
		if(this.load != null) this.load.unbindAll();
		if(this.httpStatus != null) this.httpStatus.unbindAll();
		if(this.uploadComplete != null) this.uploadComplete.unbindAll();
		if(this.uploadCanceled != null) this.uploadCanceled.unbindAll(); else null;
		prime.signal.Signals.prototype.unbindAll.call(this);
	}
	,dispose: function() {
		if(this.unloaded != null) this.unloaded.dispose();
		if(this.load != null) this.load.dispose();
		if(this.httpStatus != null) this.httpStatus.dispose();
		if(this.uploadComplete != null) this.uploadComplete.dispose();
		if(this.uploadCanceled != null) this.uploadCanceled.dispose();
		this.unloaded = null;
		this.load = null;
		this.httpStatus = null;
		this.uploadComplete = null;
		this.uploadCanceled = null;
		prime.signal.Signals.prototype.dispose.call(this);
	}
	,__class__: prime.core.events.LoaderSignals
});
prime.core.traits.IUIdentifiable = function() { }
prime.core.traits.IUIdentifiable.__name__ = ["prime","core","traits","IUIdentifiable"];
prime.core.traits.IUIdentifiable.prototype = {
	__class__: prime.core.traits.IUIdentifiable
}
if(!prime.tools) prime.tools = {}
if(!prime.tools.generator) prime.tools.generator = {}
prime.tools.generator.ICodeFormattable = function() { }
prime.tools.generator.ICodeFormattable.__name__ = ["prime","tools","generator","ICodeFormattable"];
prime.tools.generator.ICodeFormattable.__interfaces__ = [prime.core.traits.IUIdentifiable];
prime.tools.generator.ICodeFormattable.prototype = {
	__class__: prime.tools.generator.ICodeFormattable
}
prime.tools.generator.ICSSFormattable = function() { }
prime.tools.generator.ICSSFormattable.__name__ = ["prime","tools","generator","ICSSFormattable"];
prime.tools.generator.ICSSFormattable.prototype = {
	__class__: prime.tools.generator.ICSSFormattable
}
if(!prime.core.geom) prime.core.geom = {}
prime.core.geom.IBox = function() { }
prime.core.geom.IBox.__name__ = ["prime","core","geom","IBox"];
prime.core.geom.IBox.__interfaces__ = [prime.core.traits.IClonable];
prime.core.geom.IBox.prototype = {
	__class__: prime.core.geom.IBox
}
prime.core.geom.Box = function(top,right,bottom,left) {
	if(left == null) left = -2147483648;
	if(bottom == null) bottom = -2147483648;
	if(right == null) right = -2147483648;
	if(top == null) top = 0;
	this._oid = prime.utils.ID.next++;
	this.top = top;
	this.right = right == -2147483648 || right == null?this.top:right;
	this.bottom = bottom == -2147483648 || bottom == null?this.top:bottom;
	this.left = left == -2147483648 || left == null?this.right:left;
};
prime.core.geom.Box.__name__ = ["prime","core","geom","Box"];
prime.core.geom.Box.__interfaces__ = [prime.tools.generator.ICodeFormattable,prime.tools.generator.ICSSFormattable,prime.core.geom.IBox];
prime.core.geom.Box.prototype = {
	toCode: function(code) {
		if(!this.isEmpty()) code.construct(this,[this.top,this.right,this.bottom,this.left]);
	}
	,cleanUp: function() {
	}
	,getCSSValue: function(v) {
		return v == 0?"0":v + "px";
	}
	,toCSS: function(prefix) {
		if(prefix == null) prefix = "";
		return this.getCSSValue(this.top) + " " + this.getCSSValue(this.right) + " " + this.getCSSValue(this.bottom) + " " + this.getCSSValue(this.left);
	}
	,isEmpty: function() {
		return (function($this) {
			var $r;
			var value = $this.top;
			$r = value == -2147483648 || value == null;
			return $r;
		}(this)) && (function($this) {
			var $r;
			var value = $this.left;
			$r = value == -2147483648 || value == null;
			return $r;
		}(this)) && (function($this) {
			var $r;
			var value = $this.bottom;
			$r = value == -2147483648 || value == null;
			return $r;
		}(this)) && (function($this) {
			var $r;
			var value = $this.right;
			$r = value == -2147483648 || value == null;
			return $r;
		}(this));
	}
	,setBottom: function(v) {
		return this.bottom = v;
	}
	,setTop: function(v) {
		return this.top = v;
	}
	,setRight: function(v) {
		return this.right = v;
	}
	,setLeft: function(v) {
		return this.left = v;
	}
	,getBottom: function() {
		return this.bottom;
	}
	,getTop: function() {
		return this.top;
	}
	,getRight: function() {
		return this.right;
	}
	,getLeft: function() {
		return this.left;
	}
	,clone: function() {
		return new prime.core.geom.Box(this.top,this.right,this.bottom,this.left);
	}
	,__class__: prime.core.geom.Box
}
prime.core.geom.Corners = function(topLeft,topRight,bottomRight,bottomLeft) {
	if(bottomLeft == null) bottomLeft = -2147483648;
	if(bottomRight == null) bottomRight = -2147483648;
	if(topRight == null) topRight = -2147483648;
	if(topLeft == null) topLeft = 0;
	this._oid = prime.utils.ID.next++;
	this.topLeft = topLeft;
	this.topRight = topRight != null && topRight == topRight?topRight:this.topLeft;
	this.bottomLeft = bottomLeft != null && bottomLeft == bottomLeft?bottomLeft:this.topLeft;
	this.bottomRight = bottomRight != null && bottomRight == bottomRight?bottomRight:this.topRight;
};
prime.core.geom.Corners.__name__ = ["prime","core","geom","Corners"];
prime.core.geom.Corners.__interfaces__ = [prime.tools.generator.ICodeFormattable,prime.core.traits.IClonable];
prime.core.geom.Corners.prototype = {
	toCode: function(code) {
		code.construct(this,[this.topLeft,this.topRight,this.bottomRight,this.bottomLeft]);
	}
	,isEmpty: function() {
		return (function($this) {
			var $r;
			var value = $this.topLeft;
			$r = !(value != null && value == value);
			return $r;
		}(this)) && (function($this) {
			var $r;
			var value = $this.topRight;
			$r = !(value != null && value == value);
			return $r;
		}(this)) && (function($this) {
			var $r;
			var value = $this.bottomRight;
			$r = !(value != null && value == value);
			return $r;
		}(this)) && (function($this) {
			var $r;
			var value = $this.bottomLeft;
			$r = !(value != null && value == value);
			return $r;
		}(this));
	}
	,cleanUp: function() {
	}
	,clone: function() {
		return new prime.core.geom.Corners(this.topLeft,this.topRight,this.bottomRight,this.bottomLeft);
	}
	,__class__: prime.core.geom.Corners
}
prime.core.geom.IRectangle = function() { }
prime.core.geom.IRectangle.__name__ = ["prime","core","geom","IRectangle"];
prime.core.geom.IRectangle.__interfaces__ = [prime.core.geom.IBox];
prime.core.geom.IRectangle.prototype = {
	__class__: prime.core.geom.IRectangle
}
prime.core.geom.IntPoint = function(x,y) {
	if(y == null) y = 0;
	if(x == null) x = 0;
	this._oid = prime.utils.ID.next++;
	this.setX(x);
	this.setY(y);
};
prime.core.geom.IntPoint.__name__ = ["prime","core","geom","IntPoint"];
prime.core.geom.IntPoint.__interfaces__ = [prime.tools.generator.ICodeFormattable,prime.tools.generator.ICSSFormattable,prime.core.traits.IClonable];
prime.core.geom.IntPoint.prototype = {
	isEmpty: function() {
		return (function($this) {
			var $r;
			var value = $this.getX();
			$r = value == -2147483648 || value == null;
			return $r;
		}(this)) && (function($this) {
			var $r;
			var value = $this.getY();
			$r = value == -2147483648 || value == null;
			return $r;
		}(this));
	}
	,toCode: function(code) {
		code.construct(this,[this.getX(),this.getY()]);
	}
	,cleanUp: function() {
	}
	,toCSS: function(prefix) {
		if(prefix == null) prefix = "";
		return this.getX() + "px, " + this.getY() + "px";
	}
	,setY: function(v) {
		return this.y = v;
	}
	,getY: function() {
		return this.y;
	}
	,setX: function(v) {
		return this.x = v;
	}
	,getX: function() {
		return this.x;
	}
	,clone: function() {
		return new prime.core.geom.IntPoint(this.getX(),this.getY());
	}
	,__class__: prime.core.geom.IntPoint
}
prime.core.traits.IInvalidateListener = function() { }
prime.core.traits.IInvalidateListener.__name__ = ["prime","core","traits","IInvalidateListener"];
prime.core.traits.IInvalidateListener.__interfaces__ = [prime.core.traits.IDisposable];
prime.core.traits.IInvalidateListener.prototype = {
	__class__: prime.core.traits.IInvalidateListener
}
prime.core.traits.IInvalidatable = function() { }
prime.core.traits.IInvalidatable.__name__ = ["prime","core","traits","IInvalidatable"];
prime.core.traits.IInvalidatable.__interfaces__ = [prime.core.traits.IInvalidateListener];
prime.core.traits.IInvalidatable.prototype = {
	__class__: prime.core.traits.IInvalidatable
}
prime.core.traits.Invalidatable = function() {
	this.listeners = new haxe.FastList();
};
prime.core.traits.Invalidatable.__name__ = ["prime","core","traits","Invalidatable"];
prime.core.traits.Invalidatable.__interfaces__ = [prime.core.traits.IInvalidatable];
prime.core.traits.Invalidatable.prototype = {
	invalidateCall: function(changeFromOther,sender) {
		this.invalidate(changeFromOther);
	}
	,invalidate: function(change) {
		var current = this.listeners.head;
		while(current != null) {
			current.elt.invalidateCall(change,this);
			current = current.next;
		}
	}
	,dispose: function() {
		while(!(this.listeners.head == null)) this.listeners.pop();
		this.listeners = null;
	}
	,__class__: prime.core.traits.Invalidatable
}
prime.core.traits.IQueueingInvalidatable = function() { }
prime.core.traits.IQueueingInvalidatable.__name__ = ["prime","core","traits","IQueueingInvalidatable"];
prime.core.traits.IQueueingInvalidatable.__interfaces__ = [prime.core.traits.IInvalidatable];
prime.core.traits.IQueueingInvalidatable.prototype = {
	__class__: prime.core.traits.IQueueingInvalidatable
}
prime.core.traits.QueueingInvalidatable = function() {
	prime.core.traits.Invalidatable.call(this);
	{
		this.changes = 0;
		this.invalidatable = true;
	}
};
prime.core.traits.QueueingInvalidatable.__name__ = ["prime","core","traits","QueueingInvalidatable"];
prime.core.traits.QueueingInvalidatable.__interfaces__ = [prime.core.traits.IQueueingInvalidatable];
prime.core.traits.QueueingInvalidatable.__super__ = prime.core.traits.Invalidatable;
prime.core.traits.QueueingInvalidatable.prototype = $extend(prime.core.traits.Invalidatable.prototype,{
	setInvalidatable: function(v) {
		if(v != this.invalidatable) {
			this.invalidatable = v;
			if(v && this.changes > 0) {
				this.invalidate(this.changes);
				this.changes = 0;
			}
		}
		return v;
	}
	,invalidate: function(change) {
		if(this.invalidatable) prime.core.traits.Invalidatable.prototype.invalidate.call(this,change); else this.changes = (function($this) {
			var $r;
			var bits = $this.changes;
			$r = bits |= change;
			return $r;
		}(this));
	}
	,resetValidation: function() {
		this.changes = 0;
		this.invalidatable = true;
	}
	,__class__: prime.core.traits.QueueingInvalidatable
});
prime.core.geom.IntRectangle = function(x,y,width,height) {
	if(height == null) height = 0;
	if(width == null) width = 0;
	if(y == null) y = 0;
	if(x == null) x = 0;
	prime.core.traits.QueueingInvalidatable.call(this);
	if(false != this.invalidatable) {
		this.invalidatable = false;
	}
	false;
	this.setTop(y);
	this.setLeft(x);
	this.setWidth(width);
	this.setHeight(height);
	if(true != this.invalidatable) {
		this.invalidatable = true;
		if(this.changes > 0) {
			this.invalidate(this.changes);
			this.changes = 0;
		}
	}
	true;
};
prime.core.geom.IntRectangle.__name__ = ["prime","core","geom","IntRectangle"];
prime.core.geom.IntRectangle.__interfaces__ = [prime.core.geom.IRectangle];
prime.core.geom.IntRectangle.__super__ = prime.core.traits.QueueingInvalidatable;
prime.core.geom.IntRectangle.prototype = $extend(prime.core.traits.QueueingInvalidatable.prototype,{
	getCenterY: function() {
		return this.top + (this.height >> 1);
	}
	,getCenterX: function() {
		return this.left + (this.width >> 1);
	}
	,getHeight: function() {
		return this.height;
	}
	,getWidth: function() {
		return this.width;
	}
	,getBottom: function() {
		return this.bottom;
	}
	,getTop: function() {
		return this.top;
	}
	,getRight: function() {
		return this.right;
	}
	,getLeft: function() {
		return this.left;
	}
	,setCenterY: function(v) {
		this.setTop(v - (this.height >> 1));
		return v;
	}
	,setCenterX: function(v) {
		this.setLeft(v - (this.width >> 1));
		return v;
	}
	,setRight: function(v) {
		if(v != this.right) {
			var c = this.invalidatable;
			if(false != this.invalidatable) {
				this.invalidatable = false;
			}
			false;
			this.right = v;
			this.setLeft(v - this.width);
			this.invalidate(128);
			if(c != this.invalidatable) {
				this.invalidatable = c;
				if(c && this.changes > 0) {
					this.invalidate(this.changes);
					this.changes = 0;
				}
			}
			c;
		}
		return v;
	}
	,setLeft: function(v) {
		if(v != this.left) {
			var c = this.invalidatable;
			if(false != this.invalidatable) {
				this.invalidatable = false;
			}
			false;
			this.left = v;
			this.setRight(v + this.width);
			this.invalidate(32);
			if(c != this.invalidatable) {
				this.invalidatable = c;
				if(c && this.changes > 0) {
					this.invalidate(this.changes);
					this.changes = 0;
				}
			}
			c;
		}
		return v;
	}
	,setBottom: function(v) {
		if(v != this.bottom) {
			var c = this.invalidatable;
			if(false != this.invalidatable) {
				this.invalidatable = false;
			}
			false;
			this.bottom = v;
			this.setTop(v - this.height);
			this.invalidate(16);
			if(c != this.invalidatable) {
				this.invalidatable = c;
				if(c && this.changes > 0) {
					this.invalidate(this.changes);
					this.changes = 0;
				}
			}
			c;
		}
		return v;
	}
	,setTop: function(v) {
		if(v != this.top) {
			var c = this.invalidatable;
			if(false != this.invalidatable) {
				this.invalidatable = false;
			}
			false;
			this.top = v;
			this.setBottom(v + this.height);
			this.invalidate(4);
			if(c != this.invalidatable) {
				this.invalidatable = c;
				if(c && this.changes > 0) {
					this.invalidate(this.changes);
					this.changes = 0;
				}
			}
			c;
		}
		return v;
	}
	,setHeight: function(v) {
		if(v != this.height) {
			var c = this.invalidatable;
			if(false != this.invalidatable) {
				this.invalidatable = false;
			}
			false;
			this.height = v;
			this.setBottom(this.top + v);
			this.invalidate(2);
			if(c != this.invalidatable) {
				this.invalidatable = c;
				if(c && this.changes > 0) {
					this.invalidate(this.changes);
					this.changes = 0;
				}
			}
			c;
		}
		return v;
	}
	,setWidth: function(v) {
		if(v != this.width) {
			var c = this.invalidatable;
			if(false != this.invalidatable) {
				this.invalidatable = false;
			}
			false;
			this.width = v;
			this.setRight(this.left + v);
			this.invalidate(1);
			if(c != this.invalidatable) {
				this.invalidatable = c;
				if(c && this.changes > 0) {
					this.invalidate(this.changes);
					this.changes = 0;
				}
			}
			c;
		}
		return v;
	}
	,move: function(newX,newY) {
		var c = this.invalidatable;
		if(false != this.invalidatable) {
			this.invalidatable = false;
		}
		false;
		this.setTop(newX);
		this.setLeft(newY);
		if(c != this.invalidatable) {
			this.invalidatable = c;
			if(c && this.changes > 0) {
				this.invalidate(this.changes);
				this.changes = 0;
			}
		}
		c;
	}
	,resize: function(newWidth,newHeight) {
		var c = this.invalidatable;
		if(false != this.invalidatable) {
			this.invalidatable = false;
		}
		false;
		this.setWidth(newWidth);
		this.setHeight(newHeight);
		if(c != this.invalidatable) {
			this.invalidatable = c;
			if(c && this.changes > 0) {
				this.invalidate(this.changes);
				this.changes = 0;
			}
		}
		c;
	}
	,clone: function() {
		return new prime.core.geom.IntRectangle(this.left,this.top,this.width,this.height);
	}
	,__class__: prime.core.geom.IntRectangle
});
prime.core.geom.Matrix2D = function() { }
prime.core.geom.Matrix2D.__name__ = ["prime","core","geom","Matrix2D"];
prime.core.geom.Matrix2D.__interfaces__ = [prime.tools.generator.ICodeFormattable];
prime.core.geom.Matrix2D.prototype = {
	cleanUp: function() {
	}
	,isEmpty: function() {
		return false;
	}
	,toCode: function(code) {
		code.construct(this,[this.a,this.b,this.c,this.d,this.tx,this.ty]);
	}
	,__class__: prime.core.geom.Matrix2D
}
if(!prime.core.geom.space) prime.core.geom.space = {}
prime.core.geom.space.Direction = { __ename__ : ["prime","core","geom","space","Direction"], __constructs__ : ["vertical","horizontal"] }
prime.core.geom.space.Direction.vertical = ["vertical",0];
prime.core.geom.space.Direction.vertical.toString = $estr;
prime.core.geom.space.Direction.vertical.__enum__ = prime.core.geom.space.Direction;
prime.core.geom.space.Direction.horizontal = ["horizontal",1];
prime.core.geom.space.Direction.horizontal.toString = $estr;
prime.core.geom.space.Direction.horizontal.__enum__ = prime.core.geom.space.Direction;
prime.core.geom.space.Horizontal = { __ename__ : ["prime","core","geom","space","Horizontal"], __constructs__ : ["left","center","right"] }
prime.core.geom.space.Horizontal.left = ["left",0];
prime.core.geom.space.Horizontal.left.toString = $estr;
prime.core.geom.space.Horizontal.left.__enum__ = prime.core.geom.space.Horizontal;
prime.core.geom.space.Horizontal.center = ["center",1];
prime.core.geom.space.Horizontal.center.toString = $estr;
prime.core.geom.space.Horizontal.center.__enum__ = prime.core.geom.space.Horizontal;
prime.core.geom.space.Horizontal.right = ["right",2];
prime.core.geom.space.Horizontal.right.toString = $estr;
prime.core.geom.space.Horizontal.right.__enum__ = prime.core.geom.space.Horizontal;
prime.core.geom.space.MoveDirection = { __ename__ : ["prime","core","geom","space","MoveDirection"], __constructs__ : ["LeftToRight","RightToLeft","TopToBottom","BottomToTop"] }
prime.core.geom.space.MoveDirection.LeftToRight = ["LeftToRight",0];
prime.core.geom.space.MoveDirection.LeftToRight.toString = $estr;
prime.core.geom.space.MoveDirection.LeftToRight.__enum__ = prime.core.geom.space.MoveDirection;
prime.core.geom.space.MoveDirection.RightToLeft = ["RightToLeft",1];
prime.core.geom.space.MoveDirection.RightToLeft.toString = $estr;
prime.core.geom.space.MoveDirection.RightToLeft.__enum__ = prime.core.geom.space.MoveDirection;
prime.core.geom.space.MoveDirection.TopToBottom = ["TopToBottom",2];
prime.core.geom.space.MoveDirection.TopToBottom.toString = $estr;
prime.core.geom.space.MoveDirection.TopToBottom.__enum__ = prime.core.geom.space.MoveDirection;
prime.core.geom.space.MoveDirection.BottomToTop = ["BottomToTop",3];
prime.core.geom.space.MoveDirection.BottomToTop.toString = $estr;
prime.core.geom.space.MoveDirection.BottomToTop.__enum__ = prime.core.geom.space.MoveDirection;
prime.core.geom.space.Position = { __ename__ : ["prime","core","geom","space","Position"], __constructs__ : ["TopLeft","TopCenter","TopRight","MiddleLeft","MiddleCenter","MiddleRight","BottomLeft","BottomCenter","BottomRight","Custom"] }
prime.core.geom.space.Position.TopLeft = ["TopLeft",0];
prime.core.geom.space.Position.TopLeft.toString = $estr;
prime.core.geom.space.Position.TopLeft.__enum__ = prime.core.geom.space.Position;
prime.core.geom.space.Position.TopCenter = ["TopCenter",1];
prime.core.geom.space.Position.TopCenter.toString = $estr;
prime.core.geom.space.Position.TopCenter.__enum__ = prime.core.geom.space.Position;
prime.core.geom.space.Position.TopRight = ["TopRight",2];
prime.core.geom.space.Position.TopRight.toString = $estr;
prime.core.geom.space.Position.TopRight.__enum__ = prime.core.geom.space.Position;
prime.core.geom.space.Position.MiddleLeft = ["MiddleLeft",3];
prime.core.geom.space.Position.MiddleLeft.toString = $estr;
prime.core.geom.space.Position.MiddleLeft.__enum__ = prime.core.geom.space.Position;
prime.core.geom.space.Position.MiddleCenter = ["MiddleCenter",4];
prime.core.geom.space.Position.MiddleCenter.toString = $estr;
prime.core.geom.space.Position.MiddleCenter.__enum__ = prime.core.geom.space.Position;
prime.core.geom.space.Position.MiddleRight = ["MiddleRight",5];
prime.core.geom.space.Position.MiddleRight.toString = $estr;
prime.core.geom.space.Position.MiddleRight.__enum__ = prime.core.geom.space.Position;
prime.core.geom.space.Position.BottomLeft = ["BottomLeft",6];
prime.core.geom.space.Position.BottomLeft.toString = $estr;
prime.core.geom.space.Position.BottomLeft.__enum__ = prime.core.geom.space.Position;
prime.core.geom.space.Position.BottomCenter = ["BottomCenter",7];
prime.core.geom.space.Position.BottomCenter.toString = $estr;
prime.core.geom.space.Position.BottomCenter.__enum__ = prime.core.geom.space.Position;
prime.core.geom.space.Position.BottomRight = ["BottomRight",8];
prime.core.geom.space.Position.BottomRight.toString = $estr;
prime.core.geom.space.Position.BottomRight.__enum__ = prime.core.geom.space.Position;
prime.core.geom.space.Position.Custom = function(point) { var $x = ["Custom",9,point]; $x.__enum__ = prime.core.geom.space.Position; $x.toString = $estr; return $x; }
prime.core.geom.space.Vertical = { __ename__ : ["prime","core","geom","space","Vertical"], __constructs__ : ["top","center","bottom"] }
prime.core.geom.space.Vertical.top = ["top",0];
prime.core.geom.space.Vertical.top.toString = $estr;
prime.core.geom.space.Vertical.top.__enum__ = prime.core.geom.space.Vertical;
prime.core.geom.space.Vertical.center = ["center",1];
prime.core.geom.space.Vertical.center.toString = $estr;
prime.core.geom.space.Vertical.center.__enum__ = prime.core.geom.space.Vertical;
prime.core.geom.space.Vertical.bottom = ["bottom",2];
prime.core.geom.space.Vertical.bottom.toString = $estr;
prime.core.geom.space.Vertical.bottom.__enum__ = prime.core.geom.space.Vertical;
if(!prime.core.net) prime.core.net = {}
prime.core.net.ICommunicator = function() { }
prime.core.net.ICommunicator.__name__ = ["prime","core","net","ICommunicator"];
prime.core.net.ICommunicator.__interfaces__ = [prime.core.traits.IDisposable];
prime.core.net.ICommunicator.prototype = {
	__class__: prime.core.net.ICommunicator
}
if(!prime.core.states) prime.core.states = {}
prime.fsm.SimpleStateMachine = function() { }
prime.fsm.SimpleStateMachine.__name__ = ["prime","core","states","SimpleStateMachine"];
prime.fsm.SimpleStateMachine.__interfaces__ = [prime.core.traits.IDisposable];
prime.fsm.SimpleStateMachine.prototype = {
	setCurrent: function(v) {
		if(this.current != v) {
			var old = this.current;
			this.current = v;
			this.change.send(v,old);
		}
		return v;
	}
	,dispose: function() {
		this.defaultState = null;
		this.current = null;
		this.change.unbindAll();
		this.change = null;
	}
	,__class__: prime.fsm.SimpleStateMachine
}
prime.core.traits.IFlagOwner = function() { }
prime.core.traits.IFlagOwner.__name__ = ["prime","core","traits","IFlagOwner"];
prime.core.traits.IFlagOwner.prototype = {
	__class__: prime.core.traits.IFlagOwner
}
prime.core.traits.IPrioritizable = function() { }
prime.core.traits.IPrioritizable.__name__ = ["prime","core","traits","IPrioritizable"];
prime.core.traits.IPrioritizable.prototype = {
	__class__: prime.core.traits.IPrioritizable
}
if(!prime.gui) prime.gui = {}
if(!prime.gui.traits) prime.gui.traits = {}
prime.gui.traits.IDisplayable = function() { }
prime.gui.traits.IDisplayable.__name__ = ["prime","gui","traits","IDisplayable"];
prime.gui.traits.IDisplayable.__interfaces__ = [prime.core.traits.IDisposable];
prime.gui.traits.IInteractive = function() { }
prime.gui.traits.IInteractive.__name__ = ["prime","gui","traits","IInteractive"];
prime.gui.traits.IInteractive.prototype = {
	__class__: prime.gui.traits.IInteractive
}
if(!prime.gui.display) prime.gui.display = {}
prime.gui.display.IDisplayContainer = function() { }
prime.gui.display.IDisplayContainer.__name__ = ["prime","gui","display","IDisplayContainer"];
prime.gui.display.IDisplayContainer.__interfaces__ = [prime.gui.traits.IDisplayable,prime.gui.traits.IInteractive];
prime.gui.traits.ISizeable = function() { }
prime.gui.traits.ISizeable.__name__ = ["prime","gui","traits","ISizeable"];
prime.gui.traits.ISizeable.prototype = {
	__class__: prime.gui.traits.ISizeable
}
prime.gui.traits.IScaleable = function() { }
prime.gui.traits.IScaleable.__name__ = ["prime","gui","traits","IScaleable"];
prime.gui.traits.IPositionable = function() { }
prime.gui.traits.IPositionable.__name__ = ["prime","gui","traits","IPositionable"];
prime.gui.traits.IPositionable.prototype = {
	__class__: prime.gui.traits.IPositionable
}
prime.gui.display.IDisplayObject = function() { }
prime.gui.display.IDisplayObject.__name__ = ["prime","gui","display","IDisplayObject"];
prime.gui.display.IDisplayObject.__interfaces__ = [prime.gui.traits.ISizeable,prime.gui.traits.IScaleable,prime.gui.traits.IPositionable,prime.gui.traits.IDisplayable];
prime.gui.display.IDisplayObject.prototype = {
	__class__: prime.gui.display.IDisplayObject
}
if(!prime.gui.effects) prime.gui.effects = {}
prime.gui.effects.IEffect = function() { }
prime.gui.effects.IEffect.__name__ = ["prime","gui","effects","IEffect"];
prime.gui.effects.IEffect.__interfaces__ = [prime.core.traits.IClonable,prime.tools.generator.ICodeFormattable,prime.tools.generator.ICSSFormattable,prime.core.traits.IInvalidatable,prime.core.traits.IDisposable];
prime.gui.effects.IEffect.prototype = {
	__class__: prime.gui.effects.IEffect
}
prime.gui.effects.Effect = function(newDuration,newDelay,newEasing,isReverted) {
	if(isReverted == null) isReverted = false;
	if(newDelay == null) newDelay = 0;
	if(newDuration == null) newDuration = 350;
	prime.core.traits.Invalidatable.call(this);
	this._oid = prime.utils.ID.next++;
	this.setDuration(newDuration == -2147483648 || newDuration == null?350:newDuration);
	this.setDelay(newDelay <= 0?-2147483648:newDelay);
	if(this.isReverted != isReverted) {
		this.isReverted = isReverted;
		this.invalidate(2048);
	}
	isReverted;
	if(this.autoHideFilters != false) {
		this.autoHideFilters = false;
		this.invalidate(8);
	}
	false;
};
prime.gui.effects.Effect.__name__ = ["prime","gui","effects","Effect"];
prime.gui.effects.Effect.__interfaces__ = [prime.gui.effects.IEffect];
prime.gui.effects.Effect.__super__ = prime.core.traits.Invalidatable;
prime.gui.effects.Effect.prototype = $extend(prime.core.traits.Invalidatable.prototype,{
	toCode: function(code) {
		null;
	}
	,cleanUp: function() {
	}
	,isEmpty: function() {
		return this.duration <= 0;
	}
	,toCSS: function(prefix) {
		if(prefix == null) prefix = "";
		return null;
	}
	,setAutoHideFilters: function(v) {
		if(this.autoHideFilters != v) {
			this.autoHideFilters = v;
			this.invalidate(8);
		}
		return v;
	}
	,setIsReverted: function(v) {
		if(this.isReverted != v) {
			this.isReverted = v;
			this.invalidate(2048);
		}
		return v;
	}
	,setDuration: function(v) {
		if(this.duration != v) {
			this.duration = v;
			this.invalidate(4);
		}
		return v;
	}
	,setEasing: function(v) {
		if(this.easing != v) {
			this.easing = v;
			this.invalidate(1);
		}
		return v;
	}
	,setDelay: function(v) {
		if(this.delay != v) {
			this.delay = v;
			this.invalidate(2);
		}
		return v;
	}
	,setValues: function(v) {
		null;
	}
	,clone: function() {
		return null;
	}
	,dispose: function() {
		if(this.easing != null) {
			this.easing = null;
			this.invalidate(1);
		}
		null;
		prime.core.traits.Invalidatable.prototype.dispose.call(this);
	}
	,__class__: prime.gui.effects.Effect
});
prime.gui.effects.AnchorScaleEffect = function(duration,delay,easing,isReverted,position,startV,endV) {
	if(endV == null) endV = -2147483648;
	if(startV == null) startV = -2147483648;
	if(isReverted == null) isReverted = false;
	if(delay == null) delay = 0;
	if(duration == null) duration = 350;
	prime.gui.effects.Effect.call(this,duration,delay,easing);
	this.zoomPosition = position != null?position:prime.core.geom.space.Position.TopLeft;
	this.startValue = startV == -2147483648?prime.types.Number.FLOAT_NOT_SET:startV;
	this.endValue = endV == -2147483648?prime.types.Number.FLOAT_NOT_SET:endV;
};
prime.gui.effects.AnchorScaleEffect.__name__ = ["prime","gui","effects","AnchorScaleEffect"];
prime.gui.effects.AnchorScaleEffect.__super__ = prime.gui.effects.Effect;
prime.gui.effects.AnchorScaleEffect.prototype = $extend(prime.gui.effects.Effect.prototype,{
	toCode: function(code) {
		if(!this.isEmpty()) code.construct(this,[this.duration,this.delay,this.easing,this.isReverted,this.zoomPosition,this.startValue,this.endValue]);
	}
	,toCSS: function(prefix) {
		if(prefix == null) prefix = "";
		var props = [];
		if((function($this) {
			var $r;
			var value = $this.duration;
			$r = value != -2147483648 && value != null;
			return $r;
		}(this))) props.push(this.duration + "ms");
		if((function($this) {
			var $r;
			var value = $this.delay;
			$r = value != -2147483648 && value != null;
			return $r;
		}(this))) props.push(this.delay + "ms");
		if(this.easing != null) props.push((function($this) {
			var $r;
			var $e = ($this.easing);
			switch( $e[1] ) {
			case 3:
				var css = $e[3], name = $e[2];
				$r = css != null?css:"Class( " + name + " )";
				break;
			case 1:
				var factory = $e[2];
				$r = factory.toCSS();
				break;
			case 2:
				var css = $e[4], p = $e[3], name = $e[2];
				$r = css != null?css:name;
				break;
			case 0:
				var css = $e[3], name = $e[2];
				$r = css != null?css:"unkown-function";
				break;
			}
			return $r;
		}(this)));
		if(this.zoomPosition != null) props.push(this.posToCSS());
		if((function($this) {
			var $r;
			var value = $this.startValue;
			$r = value != null && value == value;
			return $r;
		}(this))) props.push(this.startValue * 100 + "%");
		if((function($this) {
			var $r;
			var value = $this.endValue;
			$r = value != null && value == value;
			return $r;
		}(this))) props.push(this.endValue * 100 + "%");
		if(this.isReverted) props.push("reverted");
		return "anchor-scale " + props.join(" ");
	}
	,posToCSS: function() {
		return (function($this) {
			var $r;
			switch( ($this.zoomPosition)[1] ) {
			case 7:
				$r = "bottom-center";
				break;
			case 6:
				$r = "bottom-left";
				break;
			case 8:
				$r = "bottom-right";
				break;
			case 3:
				$r = "middle-left";
				break;
			case 4:
				$r = "middle-center";
				break;
			case 5:
				$r = "middle-right";
				break;
			case 0:
				$r = "top-left";
				break;
			case 1:
				$r = "top-center";
				break;
			case 2:
				$r = "top-right";
				break;
			default:
				$r = null;
			}
			return $r;
		}(this));
	}
	,setValues: function(v) {
	}
	,dispose: function() {
		this.zoomPosition = null;
		prime.gui.effects.Effect.prototype.dispose.call(this);
	}
	,clone: function() {
		return new prime.gui.effects.AnchorScaleEffect(this.duration,this.delay,this.easing,this.isReverted,this.zoomPosition,this.startValue,this.endValue);
	}
	,__class__: prime.gui.effects.AnchorScaleEffect
});
prime.gui.effects.CompositeEffect = function(duration,delay,easing,isReverted) {
	if(isReverted == null) isReverted = false;
	if(delay == null) delay = 0;
	if(duration == null) duration = 0;
	this.effects = new prime.bindable.collections.ArrayList_prime_gui_effects_Effect();
	duration = duration <= 0?-2147483648:duration;
	prime.gui.effects.Effect.call(this,duration,delay,easing,isReverted);
	this.init();
};
prime.gui.effects.CompositeEffect.__name__ = ["prime","gui","effects","CompositeEffect"];
prime.gui.effects.CompositeEffect.__super__ = prime.gui.effects.Effect;
prime.gui.effects.CompositeEffect.prototype = $extend(prime.gui.effects.Effect.prototype,{
	toCode: function(code) {
		if(!this.isEmpty()) {
			code.construct(this,[this.duration,this.delay,this.easing,this.isReverted]);
			var $it0 = new prime.bindable.collections.iterators.FastArrayForwardIterator(this.effects.list);
			while( $it0.hasNext() ) {
				var effect = $it0.next();
				code.setAction(this,"add",[effect]);
			}
		}
	}
	,isEmpty: function() {
		return this.getCompositeDuration() <= 0 || this.effects.list.length <= 0;
	}
	,toCSS: function(prefix) {
		if(prefix == null) prefix = "";
		var props = [];
		if((function($this) {
			var $r;
			var value = $this.duration;
			$r = value != -2147483648 && value != null;
			return $r;
		}(this))) props.push(this.duration + "ms");
		if((function($this) {
			var $r;
			var value = $this.delay;
			$r = value != -2147483648 && value != null;
			return $r;
		}(this))) props.push(this.delay + "ms");
		if(this.easing != null) props.push((function($this) {
			var $r;
			var $e = ($this.easing);
			switch( $e[1] ) {
			case 3:
				var css = $e[3], name = $e[2];
				$r = css != null?css:"Class( " + name + " )";
				break;
			case 1:
				var factory = $e[2];
				$r = factory.toCSS();
				break;
			case 2:
				var css = $e[4], p = $e[3], name = $e[2];
				$r = css != null?css:name;
				break;
			case 0:
				var css = $e[3], name = $e[2];
				$r = css != null?css:"unkown-function";
				break;
			}
			return $r;
		}(this)));
		if(this.isReverted) props.push("reverted");
		if(this.effects.list.length > 0) {
			var cssEff = [];
			var $it0 = new prime.bindable.collections.iterators.FastArrayForwardIterator(this.effects.list);
			while( $it0.hasNext() ) {
				var effect = $it0.next();
				cssEff.push(effect.toCSS());
			}
			props.push("(" + cssEff.join(", ") + ")");
		}
		return props.join(" ");
	}
	,getCompositeDuration: function() {
		var duration = this.duration;
		var $it0 = new prime.bindable.collections.iterators.FastArrayForwardIterator(this.effects.list);
		while( $it0.hasNext() ) {
			var effect = $it0.next();
			duration = (function($this) {
				var $r;
				var var2 = effect.duration;
				$r = duration > var2?duration:var2;
				return $r;
			}(this));
		}
		return duration;
	}
	,add: function(effect) {
		this.effects.add(effect);
	}
	,dispose: function() {
		this.effects.dispose();
		this.effects = null;
		prime.gui.effects.Effect.prototype.dispose.call(this);
	}
	,setValues: function(v) {
		var $it0 = new prime.bindable.collections.iterators.FastArrayForwardIterator(this.effects.list);
		while( $it0.hasNext() ) {
			var effect = $it0.next();
			effect.setValues(v);
		}
	}
	,init: function() {
	}
	,__class__: prime.gui.effects.CompositeEffect
});
prime.gui.effects.EffectProperties = { __ename__ : ["prime","gui","effects","EffectProperties"], __constructs__ : ["alpha","rotation","size","position","scale","any"] }
prime.gui.effects.EffectProperties.alpha = function(from,to) { var $x = ["alpha",0,from,to]; $x.__enum__ = prime.gui.effects.EffectProperties; $x.toString = $estr; return $x; }
prime.gui.effects.EffectProperties.rotation = function(from,to) { var $x = ["rotation",1,from,to]; $x.__enum__ = prime.gui.effects.EffectProperties; $x.toString = $estr; return $x; }
prime.gui.effects.EffectProperties.size = function(fromW,fromH,toW,toH) { var $x = ["size",2,fromW,fromH,toW,toH]; $x.__enum__ = prime.gui.effects.EffectProperties; $x.toString = $estr; return $x; }
prime.gui.effects.EffectProperties.position = function(fromX,fromY,toX,toY) { var $x = ["position",3,fromX,fromY,toX,toY]; $x.__enum__ = prime.gui.effects.EffectProperties; $x.toString = $estr; return $x; }
prime.gui.effects.EffectProperties.scale = function(fromSx,fromSy,toSx,toSy) { var $x = ["scale",4,fromSx,fromSy,toSx,toSy]; $x.__enum__ = prime.gui.effects.EffectProperties; $x.toString = $estr; return $x; }
prime.gui.effects.EffectProperties.any = function(propName,from,to) { var $x = ["any",5,propName,from,to]; $x.__enum__ = prime.gui.effects.EffectProperties; $x.toString = $estr; return $x; }
prime.gui.effects.FadeEffect = function(duration,delay,easing,isReverted,startValue,endValue) {
	if(endValue == null) endValue = -2147483648;
	if(startValue == null) startValue = -2147483648;
	if(isReverted == null) isReverted = false;
	if(delay == null) delay = 0;
	if(duration == null) duration = 350;
	prime.gui.effects.Effect.call(this,duration,delay,easing,isReverted);
	if(this.autoHideFilters != false) {
		this.autoHideFilters = false;
		this.invalidate(8);
	}
	false;
	this.startValue = startValue == -2147483648?prime.types.Number.FLOAT_NOT_SET:startValue;
	this.endValue = endValue == -2147483648?prime.types.Number.FLOAT_NOT_SET:endValue;
};
prime.gui.effects.FadeEffect.__name__ = ["prime","gui","effects","FadeEffect"];
prime.gui.effects.FadeEffect.__super__ = prime.gui.effects.Effect;
prime.gui.effects.FadeEffect.prototype = $extend(prime.gui.effects.Effect.prototype,{
	toCode: function(code) {
		if(!this.isEmpty()) code.construct(this,[this.duration,this.delay,this.easing,this.isReverted,this.startValue,this.endValue]);
	}
	,toCSS: function(prefix) {
		if(prefix == null) prefix = "";
		var props = [];
		if((function($this) {
			var $r;
			var value = $this.duration;
			$r = value != -2147483648 && value != null;
			return $r;
		}(this))) props.push(this.duration + "ms");
		if((function($this) {
			var $r;
			var value = $this.delay;
			$r = value != -2147483648 && value != null;
			return $r;
		}(this))) props.push(this.delay + "ms");
		if(this.easing != null) props.push((function($this) {
			var $r;
			var $e = ($this.easing);
			switch( $e[1] ) {
			case 3:
				var css = $e[3], name = $e[2];
				$r = css != null?css:"Class( " + name + " )";
				break;
			case 1:
				var factory = $e[2];
				$r = factory.toCSS();
				break;
			case 2:
				var css = $e[4], p = $e[3], name = $e[2];
				$r = css != null?css:name;
				break;
			case 0:
				var css = $e[3], name = $e[2];
				$r = css != null?css:"unkown-function";
				break;
			}
			return $r;
		}(this)));
		if((function($this) {
			var $r;
			var value = $this.startValue;
			$r = value != null && value == value;
			return $r;
		}(this))) props.push(this.startValue * 100 + "%");
		if((function($this) {
			var $r;
			var value = $this.endValue;
			$r = value != null && value == value;
			return $r;
		}(this))) props.push(this.endValue * 100 + "%");
		if(this.isReverted) props.push("reverted");
		return "fade " + props.join(" ");
	}
	,setValues: function(v) {
		var $e = (v);
		switch( $e[1] ) {
		case 0:
			var to = $e[3], from = $e[2];
			this.startValue = from;
			this.endValue = to;
			break;
		default:
			return;
		}
	}
	,clone: function() {
		return new prime.gui.effects.FadeEffect(this.duration,this.duration,this.easing,this.isReverted,this.startValue,this.endValue);
	}
	,__class__: prime.gui.effects.FadeEffect
});
prime.gui.effects.MoveEffect = function(duration,delay,easing,isReverted,startX,startY,endX,endY) {
	if(endY == null) endY = -2147483648;
	if(endX == null) endX = -2147483648;
	if(startY == null) startY = -2147483648;
	if(startX == null) startX = -2147483648;
	if(isReverted == null) isReverted = false;
	if(delay == null) delay = 0;
	if(duration == null) duration = 350;
	prime.gui.effects.Effect.call(this,duration,delay,easing,isReverted);
	this.startX = startX == -2147483648?prime.types.Number.FLOAT_NOT_SET:startX;
	this.startY = startY == -2147483648?prime.types.Number.FLOAT_NOT_SET:startY;
	this.endX = endX == -2147483648?prime.types.Number.FLOAT_NOT_SET:endX;
	this.endY = endY == -2147483648?prime.types.Number.FLOAT_NOT_SET:endY;
};
prime.gui.effects.MoveEffect.__name__ = ["prime","gui","effects","MoveEffect"];
prime.gui.effects.MoveEffect.__super__ = prime.gui.effects.Effect;
prime.gui.effects.MoveEffect.prototype = $extend(prime.gui.effects.Effect.prototype,{
	toCode: function(code) {
		if(!this.isEmpty()) code.construct(this,[this.duration,this.delay,this.easing,this.isReverted,this.startX,this.startY,this.endX,this.endY]);
	}
	,toCSS: function(prefix) {
		if(prefix == null) prefix = "";
		var props = [];
		if((function($this) {
			var $r;
			var value = $this.duration;
			$r = value != -2147483648 && value != null;
			return $r;
		}(this))) props.push(this.duration + "ms");
		if((function($this) {
			var $r;
			var value = $this.delay;
			$r = value != -2147483648 && value != null;
			return $r;
		}(this))) props.push(this.delay + "ms");
		if(this.easing != null) props.push((function($this) {
			var $r;
			var $e = ($this.easing);
			switch( $e[1] ) {
			case 3:
				var css = $e[3], name = $e[2];
				$r = css != null?css:"Class( " + name + " )";
				break;
			case 1:
				var factory = $e[2];
				$r = factory.toCSS();
				break;
			case 2:
				var css = $e[4], p = $e[3], name = $e[2];
				$r = css != null?css:name;
				break;
			case 0:
				var css = $e[3], name = $e[2];
				$r = css != null?css:"unkown-function";
				break;
			}
			return $r;
		}(this)));
		if((function($this) {
			var $r;
			var value = $this.startX;
			$r = value != null && value == value;
			return $r;
		}(this))) props.push(this.startX + "px");
		if((function($this) {
			var $r;
			var value = $this.startY;
			$r = value != null && value == value;
			return $r;
		}(this))) props.push(this.startY + "px");
		if((function($this) {
			var $r;
			var value = $this.endX;
			$r = value != null && value == value;
			return $r;
		}(this))) props.push(this.endX + "px");
		if((function($this) {
			var $r;
			var value = $this.endY;
			$r = value != null && value == value;
			return $r;
		}(this))) props.push(this.endY + "px");
		if(this.isReverted) props.push("reverted");
		return "move " + props.join(" ");
	}
	,setValues: function(v) {
		var $e = (v);
		switch( $e[1] ) {
		case 3:
			var toY = $e[5], toX = $e[4], fromY = $e[3], fromX = $e[2];
			this.startX = fromX;
			this.startY = fromY;
			this.endX = toX;
			this.endY = toY;
			break;
		default:
			return;
		}
	}
	,clone: function() {
		return new prime.gui.effects.MoveEffect(this.duration,this.duration,this.easing,this.isReverted,this.startX,this.startY,this.endX,this.endY);
	}
	,__class__: prime.gui.effects.MoveEffect
});
prime.gui.effects.ParallelEffect = function(duration,delay,easing,isReverted) {
	prime.gui.effects.CompositeEffect.call(this,duration,delay,easing,isReverted);
};
prime.gui.effects.ParallelEffect.__name__ = ["prime","gui","effects","ParallelEffect"];
prime.gui.effects.ParallelEffect.__super__ = prime.gui.effects.CompositeEffect;
prime.gui.effects.ParallelEffect.prototype = $extend(prime.gui.effects.CompositeEffect.prototype,{
	toCSS: function(prefix) {
		if(prefix == null) prefix = "";
		return "parallel " + prime.gui.effects.CompositeEffect.prototype.toCSS.call(this,prefix);
	}
	,getCompositeDuration: function() {
		var d = 0;
		var $it0 = new prime.bindable.collections.iterators.FastArrayForwardIterator(this.effects.list);
		while( $it0.hasNext() ) {
			var effect = $it0.next();
			d = (function($this) {
				var $r;
				var var2 = effect.duration;
				$r = d > var2?d:var2;
				return $r;
			}(this));
		}
		return d;
	}
	,clone: function() {
		return new prime.gui.effects.ParallelEffect(this.duration,this.delay,this.easing,this.isReverted);
	}
	,__class__: prime.gui.effects.ParallelEffect
});
prime.gui.effects.ResizeEffect = function(duration,delay,easing,isReverted,startW,startH,endW,endH) {
	if(endH == null) endH = -2147483648;
	if(endW == null) endW = -2147483648;
	if(startH == null) startH = -2147483648;
	if(startW == null) startW = -2147483648;
	if(isReverted == null) isReverted = false;
	if(delay == null) delay = 0;
	if(duration == null) duration = 350;
	prime.gui.effects.Effect.call(this,duration,delay,easing,isReverted);
	this.startW = startW == -2147483648?prime.types.Number.FLOAT_NOT_SET:startW;
	this.startH = startH == -2147483648?prime.types.Number.FLOAT_NOT_SET:startH;
	this.endW = endW == -2147483648?prime.types.Number.FLOAT_NOT_SET:endW;
	this.endH = endH == -2147483648?prime.types.Number.FLOAT_NOT_SET:endH;
};
prime.gui.effects.ResizeEffect.__name__ = ["prime","gui","effects","ResizeEffect"];
prime.gui.effects.ResizeEffect.__super__ = prime.gui.effects.Effect;
prime.gui.effects.ResizeEffect.prototype = $extend(prime.gui.effects.Effect.prototype,{
	toCode: function(code) {
		if(!this.isEmpty()) code.construct(this,[this.duration,this.delay,this.easing,this.isReverted,this.startW,this.startH,this.endW,this.endH]);
	}
	,toCSS: function(prefix) {
		if(prefix == null) prefix = "";
		var props = [];
		if((function($this) {
			var $r;
			var value = $this.duration;
			$r = value != -2147483648 && value != null;
			return $r;
		}(this))) props.push(this.duration + "ms");
		if((function($this) {
			var $r;
			var value = $this.delay;
			$r = value != -2147483648 && value != null;
			return $r;
		}(this))) props.push(this.delay + "ms");
		if(this.easing != null) props.push((function($this) {
			var $r;
			var $e = ($this.easing);
			switch( $e[1] ) {
			case 3:
				var css = $e[3], name = $e[2];
				$r = css != null?css:"Class( " + name + " )";
				break;
			case 1:
				var factory = $e[2];
				$r = factory.toCSS();
				break;
			case 2:
				var css = $e[4], p = $e[3], name = $e[2];
				$r = css != null?css:name;
				break;
			case 0:
				var css = $e[3], name = $e[2];
				$r = css != null?css:"unkown-function";
				break;
			}
			return $r;
		}(this)));
		if((function($this) {
			var $r;
			var value = $this.startW;
			$r = value != null && value == value;
			return $r;
		}(this))) props.push(this.startW + "px, " + this.startH + "px");
		if((function($this) {
			var $r;
			var value = $this.endW;
			$r = value != null && value == value;
			return $r;
		}(this))) props.push(this.endW + "px, " + this.endH + "px");
		if(this.isReverted) props.push("reverted");
		return "resize " + props.join(" ");
	}
	,setValues: function(v) {
		var $e = (v);
		switch( $e[1] ) {
		case 2:
			var toH = $e[5], toW = $e[4], fromH = $e[3], fromW = $e[2];
			this.startW = fromW;
			this.startH = fromH;
			this.endW = toW;
			this.endH = toH;
			break;
		default:
			return;
		}
	}
	,clone: function() {
		return new prime.gui.effects.ResizeEffect(this.duration,this.duration,this.easing,this.isReverted,this.startW,this.startH,this.endW,this.endH);
	}
	,__class__: prime.gui.effects.ResizeEffect
});
prime.gui.effects.RotateEffect = function(duration,delay,easing,isReverted,startV,endV) {
	if(endV == null) endV = -2147483648;
	if(startV == null) startV = -2147483648;
	if(isReverted == null) isReverted = false;
	if(delay == null) delay = 0;
	if(duration == null) duration = 350;
	prime.gui.effects.Effect.call(this,duration,delay,easing,isReverted);
	this.startValue = startV == -2147483648?prime.types.Number.FLOAT_NOT_SET:startV;
	this.endValue = endV == -2147483648?prime.types.Number.FLOAT_NOT_SET:endV;
};
prime.gui.effects.RotateEffect.__name__ = ["prime","gui","effects","RotateEffect"];
prime.gui.effects.RotateEffect.__super__ = prime.gui.effects.Effect;
prime.gui.effects.RotateEffect.prototype = $extend(prime.gui.effects.Effect.prototype,{
	toCode: function(code) {
		if(!this.isEmpty()) code.construct(this,[this.duration,this.delay,this.easing,this.isReverted,this.startValue,this.endValue]);
	}
	,toCSS: function(prefix) {
		if(prefix == null) prefix = "";
		var props = [];
		if((function($this) {
			var $r;
			var value = $this.duration;
			$r = value != -2147483648 && value != null;
			return $r;
		}(this))) props.push(this.duration + "ms");
		if((function($this) {
			var $r;
			var value = $this.delay;
			$r = value != -2147483648 && value != null;
			return $r;
		}(this))) props.push(this.delay + "ms");
		if(this.easing != null) props.push((function($this) {
			var $r;
			var $e = ($this.easing);
			switch( $e[1] ) {
			case 3:
				var css = $e[3], name = $e[2];
				$r = css != null?css:"Class( " + name + " )";
				break;
			case 1:
				var factory = $e[2];
				$r = factory.toCSS();
				break;
			case 2:
				var css = $e[4], p = $e[3], name = $e[2];
				$r = css != null?css:name;
				break;
			case 0:
				var css = $e[3], name = $e[2];
				$r = css != null?css:"unkown-function";
				break;
			}
			return $r;
		}(this)));
		if((function($this) {
			var $r;
			var value = $this.startValue;
			$r = value != null && value == value;
			return $r;
		}(this))) props.push(this.startValue + "deg");
		if((function($this) {
			var $r;
			var value = $this.endValue;
			$r = value != null && value == value;
			return $r;
		}(this))) props.push(this.endValue + "deg");
		if(this.isReverted) props.push("reverted");
		return "rotate " + props.join(" ");
	}
	,setValues: function(v) {
		var $e = (v);
		switch( $e[1] ) {
		case 1:
			var to = $e[3], from = $e[2];
			this.startValue = from;
			this.endValue = to;
			break;
		default:
			return;
		}
	}
	,clone: function() {
		return new prime.gui.effects.RotateEffect(this.duration,this.delay,this.easing,this.isReverted,this.startValue,this.endValue);
	}
	,__class__: prime.gui.effects.RotateEffect
});
prime.gui.effects.ScaleEffect = function(duration,delay,easing,isReverted,startX,startY,endX,endY) {
	if(endY == null) endY = -2147483648;
	if(endX == null) endX = -2147483648;
	if(startY == null) startY = -2147483648;
	if(startX == null) startX = -2147483648;
	if(isReverted == null) isReverted = false;
	if(delay == null) delay = 0;
	if(duration == null) duration = 350;
	prime.gui.effects.Effect.call(this,duration,delay,easing,isReverted);
	this.startX = startX == -2147483648?prime.types.Number.FLOAT_NOT_SET:startX;
	this.startY = startY == -2147483648?prime.types.Number.FLOAT_NOT_SET:startY;
	this.endX = endX == -2147483648?prime.types.Number.FLOAT_NOT_SET:endX;
	this.endY = endY == -2147483648?prime.types.Number.FLOAT_NOT_SET:endY;
};
prime.gui.effects.ScaleEffect.__name__ = ["prime","gui","effects","ScaleEffect"];
prime.gui.effects.ScaleEffect.__super__ = prime.gui.effects.Effect;
prime.gui.effects.ScaleEffect.prototype = $extend(prime.gui.effects.Effect.prototype,{
	toCode: function(code) {
		if(!this.isEmpty()) code.construct(this,[this.duration,this.delay,this.easing,this.isReverted,this.startX,this.startY,this.endX,this.endY]);
	}
	,toCSS: function(prefix) {
		if(prefix == null) prefix = "";
		var props = [];
		if((function($this) {
			var $r;
			var value = $this.duration;
			$r = value != -2147483648 && value != null;
			return $r;
		}(this))) props.push(this.duration + "ms");
		if((function($this) {
			var $r;
			var value = $this.delay;
			$r = value != -2147483648 && value != null;
			return $r;
		}(this))) props.push(this.delay + "ms");
		if(this.easing != null) props.push((function($this) {
			var $r;
			var $e = ($this.easing);
			switch( $e[1] ) {
			case 3:
				var css = $e[3], name = $e[2];
				$r = css != null?css:"Class( " + name + " )";
				break;
			case 1:
				var factory = $e[2];
				$r = factory.toCSS();
				break;
			case 2:
				var css = $e[4], p = $e[3], name = $e[2];
				$r = css != null?css:name;
				break;
			case 0:
				var css = $e[3], name = $e[2];
				$r = css != null?css:"unkown-function";
				break;
			}
			return $r;
		}(this)));
		if((function($this) {
			var $r;
			var value = $this.startX;
			$r = value != null && value == value;
			return $r;
		}(this))) props.push(this.startX * 100 + "%");
		if((function($this) {
			var $r;
			var value = $this.startY;
			$r = value != null && value == value;
			return $r;
		}(this))) props.push(this.startY * 100 + "%");
		if((function($this) {
			var $r;
			var value = $this.endX;
			$r = value != null && value == value;
			return $r;
		}(this))) props.push(this.endX * 100 + "px");
		if((function($this) {
			var $r;
			var value = $this.endY;
			$r = value != null && value == value;
			return $r;
		}(this))) props.push(this.endY * 100 + "px");
		if(this.isReverted) props.push("reverted");
		return "scale " + props.join(" ");
	}
	,setValues: function(v) {
		var $e = (v);
		switch( $e[1] ) {
		case 4:
			var toSy = $e[5], toSx = $e[4], fromSy = $e[3], fromSx = $e[2];
			this.startX = fromSx;
			this.startY = fromSy;
			this.endX = toSx;
			this.endY = toSy;
			break;
		default:
			return;
		}
	}
	,clone: function() {
		return new prime.gui.effects.ScaleEffect(this.duration,this.duration,this.easing,this.isReverted,this.startX,this.startY,this.endX,this.endY);
	}
	,__class__: prime.gui.effects.ScaleEffect
});
prime.gui.effects.SequenceEffect = function(duration,delay,easing,isReverted) {
	prime.gui.effects.CompositeEffect.call(this,duration,delay,easing,isReverted);
};
prime.gui.effects.SequenceEffect.__name__ = ["prime","gui","effects","SequenceEffect"];
prime.gui.effects.SequenceEffect.__super__ = prime.gui.effects.CompositeEffect;
prime.gui.effects.SequenceEffect.prototype = $extend(prime.gui.effects.CompositeEffect.prototype,{
	toCSS: function(prefix) {
		if(prefix == null) prefix = "";
		return "sequence " + prime.gui.effects.CompositeEffect.prototype.toCSS.call(this,prefix);
	}
	,getCompositeDuration: function() {
		var d = 0;
		var $it0 = new prime.bindable.collections.iterators.FastArrayForwardIterator(this.effects.list);
		while( $it0.hasNext() ) {
			var effect = $it0.next();
			d += effect.duration;
		}
		return d;
	}
	,clone: function() {
		return new prime.gui.effects.SequenceEffect(this.duration,this.delay,this.easing,this.isReverted);
	}
	,__class__: prime.gui.effects.SequenceEffect
});
prime.gui.effects.SetAction = function(duration,delay,easing,isReverted,prop) {
	if(isReverted == null) isReverted = false;
	if(delay == null) delay = 0;
	if(duration == null) duration = 350;
	prime.gui.effects.Effect.call(this,duration,delay,easing,isReverted);
	this.prop = prop;
};
prime.gui.effects.SetAction.__name__ = ["prime","gui","effects","SetAction"];
prime.gui.effects.SetAction.__super__ = prime.gui.effects.Effect;
prime.gui.effects.SetAction.prototype = $extend(prime.gui.effects.Effect.prototype,{
	toCode: function(code) {
		if(!this.isEmpty()) code.construct(this,[this.duration,this.delay,this.isReverted,this.easing,this.prop]);
	}
	,isEmpty: function() {
		return false;
	}
	,propToCSS: function() {
		var propStr = (function($this) {
			var $r;
			var $e = ($this.prop);
			switch( $e[1] ) {
			case 0:
				var to = $e[3], from = $e[2];
				$r = "alpha(" + from + ", " + to + ")";
				break;
			case 5:
				var to = $e[4], from = $e[3], propName = $e[2];
				$r = "any(" + propName + ", " + Std.string(from) + ", " + Std.string(to) + ")";
				break;
			case 3:
				var toY = $e[5], toX = $e[4], fromY = $e[3], fromX = $e[2];
				$r = "position(" + fromX + ", " + fromY + ", " + toX + ", " + toY + ")";
				break;
			case 1:
				var to = $e[3], from = $e[2];
				$r = "rotation(" + from + ", " + to + ")";
				break;
			case 4:
				var toSy = $e[5], toSx = $e[4], fromSy = $e[3], fromSx = $e[2];
				$r = "scale(" + fromSx + ", " + fromSy + ", " + toSx + ", " + toSy + ")";
				break;
			case 2:
				var toH = $e[5], toW = $e[4], fromH = $e[3], fromW = $e[2];
				$r = "size(" + fromW + ", " + fromH + ")";
				break;
			default:
				$r = "";
			}
			return $r;
		}(this));
		return propStr;
	}
	,toCSS: function(prefix) {
		if(prefix == null) prefix = "";
		var props = [];
		if((function($this) {
			var $r;
			var value = $this.duration;
			$r = value != -2147483648 && value != null;
			return $r;
		}(this))) props.push(this.duration + "ms");
		if((function($this) {
			var $r;
			var value = $this.delay;
			$r = value != -2147483648 && value != null;
			return $r;
		}(this))) props.push(this.delay + "ms");
		if(this.easing != null) props.push((function($this) {
			var $r;
			var $e = ($this.easing);
			switch( $e[1] ) {
			case 3:
				var css = $e[3], name = $e[2];
				$r = css != null?css:"Class( " + name + " )";
				break;
			case 1:
				var factory = $e[2];
				$r = factory.toCSS();
				break;
			case 2:
				var css = $e[4], p = $e[3], name = $e[2];
				$r = css != null?css:name;
				break;
			case 0:
				var css = $e[3], name = $e[2];
				$r = css != null?css:"unkown-function";
				break;
			}
			return $r;
		}(this)));
		if(this.prop != null) props.push(this.propToCSS());
		if(this.isReverted) props.push("reverted");
		return "set-action " + props.join(" ");
	}
	,clone: function() {
		return new prime.gui.effects.SetAction(this.duration,this.delay,this.easing,this.isReverted,this.prop);
	}
	,setValues: function(v) {
		this.prop = v;
	}
	,__class__: prime.gui.effects.SetAction
});
prime.gui.effects.WipeEffect = function(duration,delay,easing,isReverted,direction,startValue,endValue) {
	if(endValue == null) endValue = -2147483648;
	if(startValue == null) startValue = -2147483648;
	if(isReverted == null) isReverted = false;
	if(delay == null) delay = 0;
	if(duration == null) duration = 350;
	prime.gui.effects.Effect.call(this,duration,delay,easing,isReverted);
	this.direction = direction == null?prime.core.geom.space.MoveDirection.LeftToRight:direction;
	this.startValue = startValue == -2147483648?prime.types.Number.FLOAT_NOT_SET:startValue;
	this.endValue = endValue == -2147483648?prime.types.Number.FLOAT_NOT_SET:endValue;
};
prime.gui.effects.WipeEffect.__name__ = ["prime","gui","effects","WipeEffect"];
prime.gui.effects.WipeEffect.__super__ = prime.gui.effects.Effect;
prime.gui.effects.WipeEffect.prototype = $extend(prime.gui.effects.Effect.prototype,{
	toCode: function(code) {
		if(!this.isEmpty()) code.construct(this,[this.duration,this.delay,this.easing,this.isReverted,this.direction,this.startValue,this.endValue]);
	}
	,directionToCSS: function() {
		return (function($this) {
			var $r;
			switch( ($this.direction)[1] ) {
			case 0:
				$r = "left-to-right";
				break;
			case 1:
				$r = "right-to-left";
				break;
			case 2:
				$r = "top-to-bottom";
				break;
			case 3:
				$r = "bottom-to-top";
				break;
			default:
				$r = null;
			}
			return $r;
		}(this));
	}
	,toCSS: function(prefix) {
		if(prefix == null) prefix = "";
		var props = [];
		if((function($this) {
			var $r;
			var value = $this.duration;
			$r = value != -2147483648 && value != null;
			return $r;
		}(this))) props.push(this.duration + "ms");
		if((function($this) {
			var $r;
			var value = $this.delay;
			$r = value != -2147483648 && value != null;
			return $r;
		}(this))) props.push(this.delay + "ms");
		if(this.easing != null) props.push((function($this) {
			var $r;
			var $e = ($this.easing);
			switch( $e[1] ) {
			case 3:
				var css = $e[3], name = $e[2];
				$r = css != null?css:"Class( " + name + " )";
				break;
			case 1:
				var factory = $e[2];
				$r = factory.toCSS();
				break;
			case 2:
				var css = $e[4], p = $e[3], name = $e[2];
				$r = css != null?css:name;
				break;
			case 0:
				var css = $e[3], name = $e[2];
				$r = css != null?css:"unkown-function";
				break;
			}
			return $r;
		}(this)));
		if(this.direction != null) props.push(this.directionToCSS());
		if((function($this) {
			var $r;
			var value = $this.startValue;
			$r = value != null && value == value;
			return $r;
		}(this))) props.push(this.startValue + "px");
		if((function($this) {
			var $r;
			var value = $this.endValue;
			$r = value != null && value == value;
			return $r;
		}(this))) props.push(this.endValue + "px");
		if(this.isReverted) props.push("reverted");
		return "wipe " + props.join(" ");
	}
	,clone: function() {
		return new prime.gui.effects.WipeEffect(this.duration,this.delay,this.easing,this.isReverted,this.direction,this.startValue,this.endValue);
	}
	,setValues: function(v) {
	}
	,__class__: prime.gui.effects.WipeEffect
});
if(!prime.gui.filters) prime.gui.filters = {}
prime.gui.filters.IBitmapFilter = function() { }
prime.gui.filters.IBitmapFilter.__name__ = ["prime","gui","filters","IBitmapFilter"];
prime.gui.filters.IBitmapFilter.__interfaces__ = [prime.tools.generator.ICodeFormattable,prime.tools.generator.ICSSFormattable];
prime.gui.filters.BitmapFilter = function() {
	this._oid = prime.utils.ID.next++;
};
prime.gui.filters.BitmapFilter.__name__ = ["prime","gui","filters","BitmapFilter"];
prime.gui.filters.BitmapFilter.__interfaces__ = [prime.gui.filters.IBitmapFilter];
prime.gui.filters.BitmapFilter.prototype = {
	isEmpty: function() {
		return false;
	}
	,toCode: function(code) {
		null;
	}
	,cleanUp: function() {
	}
	,toCSS: function(prefix) {
		if(prefix == null) prefix = "";
		return "";
	}
	,__class__: prime.gui.filters.BitmapFilter
}
prime.gui.filters.BevelFilter = function(distance,angle,highlightColor,highlightAlpha,shadowColor,shadowAlpha,blurX,blurY,strength,quality,type,knockout) {
	if(knockout == null) knockout = false;
	if(quality == null) quality = 1;
	if(strength == null) strength = 1.0;
	if(blurY == null) blurY = 4.0;
	if(blurX == null) blurX = 4.0;
	if(shadowAlpha == null) shadowAlpha = 1.0;
	if(shadowColor == null) shadowColor = 0;
	if(highlightAlpha == null) highlightAlpha = 1.0;
	if(highlightColor == null) highlightColor = 16777215;
	if(angle == null) angle = 45;
	if(distance == null) distance = 4.0;
	prime.gui.filters.BitmapFilter.call(this);
	this.distance = distance;
	this.angle = angle;
	this.highlightColor = highlightColor;
	this.highlightAlpha = highlightAlpha;
	this.shadowColor = shadowColor;
	this.shadowAlpha = shadowAlpha;
	this.blurX = blurX;
	this.blurY = blurY;
	this.strength = strength;
	this.quality = quality;
	this.type = type == null?prime.gui.filters.BitmapFilterType.INNER:type;
	this.knockout = knockout;
};
prime.gui.filters.BevelFilter.__name__ = ["prime","gui","filters","BevelFilter"];
prime.gui.filters.BevelFilter.__super__ = prime.gui.filters.BitmapFilter;
prime.gui.filters.BevelFilter.prototype = $extend(prime.gui.filters.BitmapFilter.prototype,{
	isEmpty: function() {
		return false;
	}
	,toCode: function(code) {
		code.construct(this,[this.distance,this.angle,this.highlightColor,this.highlightAlpha,this.shadowColor,this.shadowAlpha,this.blurX,this.blurY,this.strength,this.quality,this.type,this.knockout]);
	}
	,toCSS: function(prefix) {
		if(prefix == null) prefix = "";
		var css = [];
		css.push(this.distance + "px");
		css.push(this.blurX + "px");
		css.push(this.blurY + "px");
		css.push(Std.string(this.strength));
		css.push(this.angle + "deg");
		css.push((function($this) {
			var $r;
			var v = ($this.highlightColor & -256 | (function($this) {
				var $r;
				var v1 = 255;
				$r = (function($this) {
					var $r;
					var value = (v1 & -256) >>> 8;
					if(value < 0) value = 0; else if(value > 16777215) value = 16777215;
					$r = value;
					return $r;
				}($this)) << 8 | (function($this) {
					var $r;
					var value = v1 & 255;
					if(value < 0) value = 0; else if(value > 255) value = 255;
					$r = value;
					return $r;
				}($this));
				return $r;
			}($this)) & 255) & -256 | (function($this) {
				var $r;
				var value = $this.highlightAlpha * 255 | 0;
				if(value < 0) value = 0; else if(value > 255) value = 255;
				$r = value;
				return $r;
			}($this));
			$r = "0x" + StringTools.hex((v & -256) >>> 8,6) + StringTools.hex(v & 255,2);
			return $r;
		}(this)));
		css.push((function($this) {
			var $r;
			var v = ($this.shadowColor & -256 | (function($this) {
				var $r;
				var v1 = 255;
				$r = (function($this) {
					var $r;
					var value = (v1 & -256) >>> 8;
					if(value < 0) value = 0; else if(value > 16777215) value = 16777215;
					$r = value;
					return $r;
				}($this)) << 8 | (function($this) {
					var $r;
					var value = v1 & 255;
					if(value < 0) value = 0; else if(value > 255) value = 255;
					$r = value;
					return $r;
				}($this));
				return $r;
			}($this)) & 255) & -256 | (function($this) {
				var $r;
				var value = $this.shadowAlpha * 255 | 0;
				if(value < 0) value = 0; else if(value > 255) value = 255;
				$r = value;
				return $r;
			}($this));
			$r = "0x" + StringTools.hex((v & -256) >>> 8,6) + StringTools.hex(v & 255,2);
			return $r;
		}(this)));
		if(this.knockout) css.push("knockout");
		css.push((function($this) {
			var $r;
			switch( ($this.type)[1] ) {
			case 1:
				$r = "inner";
				break;
			case 2:
				$r = "outer";
				break;
			case 0:
				$r = "full";
				break;
			}
			return $r;
		}(this)));
		css.push((function($this) {
			var $r;
			switch($this.quality) {
			case 1:
				$r = "low";
				break;
			case 2:
				$r = "medium";
				break;
			case 3:
				$r = "high";
				break;
			}
			return $r;
		}(this)));
		return css.join(" ");
	}
	,__class__: prime.gui.filters.BevelFilter
});
prime.gui.filters.BitmapFilterType = { __ename__ : ["prime","gui","filters","BitmapFilterType"], __constructs__ : ["FULL","INNER","OUTER"] }
prime.gui.filters.BitmapFilterType.FULL = ["FULL",0];
prime.gui.filters.BitmapFilterType.FULL.toString = $estr;
prime.gui.filters.BitmapFilterType.FULL.__enum__ = prime.gui.filters.BitmapFilterType;
prime.gui.filters.BitmapFilterType.INNER = ["INNER",1];
prime.gui.filters.BitmapFilterType.INNER.toString = $estr;
prime.gui.filters.BitmapFilterType.INNER.__enum__ = prime.gui.filters.BitmapFilterType;
prime.gui.filters.BitmapFilterType.OUTER = ["OUTER",2];
prime.gui.filters.BitmapFilterType.OUTER.toString = $estr;
prime.gui.filters.BitmapFilterType.OUTER.__enum__ = prime.gui.filters.BitmapFilterType;
prime.gui.filters.BlurFilter = function(blurX,blurY,quality) {
	if(quality == null) quality = 1;
	if(blurY == null) blurY = 4.0;
	if(blurX == null) blurX = 4.0;
	prime.gui.filters.BitmapFilter.call(this);
	this.blurX = blurX;
	this.blurY = blurY;
	this.quality = quality;
};
prime.gui.filters.BlurFilter.__name__ = ["prime","gui","filters","BlurFilter"];
prime.gui.filters.BlurFilter.__super__ = prime.gui.filters.BitmapFilter;
prime.gui.filters.BlurFilter.prototype = $extend(prime.gui.filters.BitmapFilter.prototype,{
	isEmpty: function() {
		return this.blurX == 0 && this.blurY == 0;
	}
	,toCode: function(code) {
		code.construct(this,[this.blurX,this.blurY,this.quality]);
	}
	,toCSS: function(prefix) {
		if(prefix == null) prefix = "";
		var css = [];
		css.push(this.blurX + "px");
		css.push(this.blurY + "px");
		css.push((function($this) {
			var $r;
			switch($this.quality) {
			case 1:
				$r = "low";
				break;
			case 2:
				$r = "medium";
				break;
			case 3:
				$r = "high";
				break;
			}
			return $r;
		}(this)));
		return css.join(" ");
	}
	,__class__: prime.gui.filters.BlurFilter
});
prime.gui.filters.DropShadowFilter = function(distance,angle,color,alpha,blurX,blurY,strength,quality,inner,knockout,hideObject) {
	if(hideObject == null) hideObject = false;
	if(knockout == null) knockout = false;
	if(inner == null) inner = false;
	if(quality == null) quality = 1;
	if(strength == null) strength = 1.0;
	if(blurY == null) blurY = 4.0;
	if(blurX == null) blurX = 4.0;
	if(alpha == null) alpha = 1.0;
	if(color == null) color = 0;
	if(angle == null) angle = 45;
	if(distance == null) distance = 4.0;
	prime.gui.filters.BitmapFilter.call(this);
	this.distance = distance;
	this.angle = angle;
	this.color = color;
	this.alpha = alpha;
	this.blurX = blurX;
	this.blurY = blurY;
	this.strength = strength;
	this.quality = quality;
	this.inner = inner;
	this.knockout = knockout;
	this.hideObject = hideObject;
};
prime.gui.filters.DropShadowFilter.__name__ = ["prime","gui","filters","DropShadowFilter"];
prime.gui.filters.DropShadowFilter.__super__ = prime.gui.filters.BitmapFilter;
prime.gui.filters.DropShadowFilter.prototype = $extend(prime.gui.filters.BitmapFilter.prototype,{
	isEmpty: function() {
		return this.alpha == 0;
	}
	,toCode: function(code) {
		code.construct(this,[this.distance,this.angle,this.color,this.alpha,this.blurX,this.blurY,this.strength,this.quality,this.inner,this.knockout,this.hideObject]);
	}
	,toCSS: function(prefix) {
		if(prefix == null) prefix = "";
		var css = [];
		css.push(this.distance + "px");
		css.push(this.blurX + "px");
		css.push(this.blurY + "px");
		css.push(Std.string(this.strength));
		css.push(this.angle + "deg");
		css.push((function($this) {
			var $r;
			var v = ($this.color & -256 | (function($this) {
				var $r;
				var v1 = 255;
				$r = (function($this) {
					var $r;
					var value = (v1 & -256) >>> 8;
					if(value < 0) value = 0; else if(value > 16777215) value = 16777215;
					$r = value;
					return $r;
				}($this)) << 8 | (function($this) {
					var $r;
					var value = v1 & 255;
					if(value < 0) value = 0; else if(value > 255) value = 255;
					$r = value;
					return $r;
				}($this));
				return $r;
			}($this)) & 255) & -256 | (function($this) {
				var $r;
				var value = $this.alpha * 255 | 0;
				if(value < 0) value = 0; else if(value > 255) value = 255;
				$r = value;
				return $r;
			}($this));
			$r = "0x" + StringTools.hex((v & -256) >>> 8,6) + StringTools.hex(v & 255,2);
			return $r;
		}(this)));
		if(this.inner) css.push("inner");
		if(this.knockout) css.push("knockout");
		if(this.hideObject) css.push("hide-object");
		css.push((function($this) {
			var $r;
			switch($this.quality) {
			case 1:
				$r = "low";
				break;
			case 2:
				$r = "medium";
				break;
			case 3:
				$r = "high";
				break;
			}
			return $r;
		}(this)));
		return css.join(" ");
	}
	,__class__: prime.gui.filters.DropShadowFilter
});
prime.gui.filters.GlowFilter = function(color,alpha,blurX,blurY,strength,quality,inner,knockout) {
	if(knockout == null) knockout = false;
	if(inner == null) inner = false;
	if(quality == null) quality = 1;
	if(strength == null) strength = 1.0;
	if(blurY == null) blurY = 4.0;
	if(blurX == null) blurX = 4.0;
	if(alpha == null) alpha = 1.0;
	if(color == null) color = 0;
	prime.gui.filters.BitmapFilter.call(this);
	this.color = color;
	this.alpha = alpha;
	this.blurX = blurX;
	this.blurY = blurY;
	this.strength = strength;
	this.quality = quality;
	this.inner = inner;
	this.knockout = knockout;
};
prime.gui.filters.GlowFilter.__name__ = ["prime","gui","filters","GlowFilter"];
prime.gui.filters.GlowFilter.__super__ = prime.gui.filters.BitmapFilter;
prime.gui.filters.GlowFilter.prototype = $extend(prime.gui.filters.BitmapFilter.prototype,{
	isEmpty: function() {
		return this.alpha == 0;
	}
	,toCode: function(code) {
		code.construct(this,[this.color,this.alpha,this.blurX,this.blurY,this.strength,this.quality,this.inner,this.knockout]);
	}
	,toCSS: function(prefix) {
		if(prefix == null) prefix = "";
		var css = [];
		css.push(this.blurX + "px");
		css.push(this.blurY + "px");
		css.push(Std.string(this.strength));
		css.push((function($this) {
			var $r;
			var v = ($this.color & -256 | (function($this) {
				var $r;
				var v1 = 255;
				$r = (function($this) {
					var $r;
					var value = (v1 & -256) >>> 8;
					if(value < 0) value = 0; else if(value > 16777215) value = 16777215;
					$r = value;
					return $r;
				}($this)) << 8 | (function($this) {
					var $r;
					var value = v1 & 255;
					if(value < 0) value = 0; else if(value > 255) value = 255;
					$r = value;
					return $r;
				}($this));
				return $r;
			}($this)) & 255) & -256 | (function($this) {
				var $r;
				var value = $this.alpha * 255 | 0;
				if(value < 0) value = 0; else if(value > 255) value = 255;
				$r = value;
				return $r;
			}($this));
			$r = "0x" + StringTools.hex((v & -256) >>> 8,6) + StringTools.hex(v & 255,2);
			return $r;
		}(this)));
		if(this.inner) css.push("inner");
		if(this.knockout) css.push("knockout");
		css.push((function($this) {
			var $r;
			switch($this.quality) {
			case 1:
				$r = "low";
				break;
			case 2:
				$r = "medium";
				break;
			case 3:
				$r = "high";
				break;
			}
			return $r;
		}(this)));
		return css.join(" ");
	}
	,__class__: prime.gui.filters.GlowFilter
});
prime.gui.filters.GradientBevelFilter = function(distance,angle,colors,alphas,ratios,blurX,blurY,strength,quality,type,knockout) {
	if(knockout == null) knockout = false;
	if(quality == null) quality = 1;
	if(strength == null) strength = 1.0;
	if(blurY == null) blurY = 4.0;
	if(blurX == null) blurX = 4.0;
	if(angle == null) angle = 45;
	if(distance == null) distance = 4.0;
	prime.gui.filters.BitmapFilter.call(this);
	this.distance = distance;
	this.angle = angle;
	this.colors = colors == null?[]:colors;
	this.alphas = alphas == null?[]:alphas;
	this.ratios = ratios == null?[]:ratios;
	this.blurX = blurX;
	this.blurY = blurY;
	this.strength = strength;
	this.quality = quality;
	this.type = type == null?prime.gui.filters.BitmapFilterType.INNER:type;
	this.knockout = knockout;
};
prime.gui.filters.GradientBevelFilter.__name__ = ["prime","gui","filters","GradientBevelFilter"];
prime.gui.filters.GradientBevelFilter.__super__ = prime.gui.filters.BitmapFilter;
prime.gui.filters.GradientBevelFilter.prototype = $extend(prime.gui.filters.BitmapFilter.prototype,{
	isEmpty: function() {
		return this.colors.length == 0;
	}
	,toCode: function(code) {
		code.construct(this,[this.distance,this.angle,this.colors,this.alphas,this.ratios,this.blurX,this.blurY,this.strength,this.quality,this.type,this.knockout]);
	}
	,toCSS: function(prefix) {
		if(prefix == null) prefix = "";
		var css = [];
		css.push(this.distance + "px");
		css.push(this.blurX + "px");
		css.push(this.blurY + "px");
		css.push(Std.string(this.strength));
		css.push(this.angle + "deg");
		var len = this.colors.length;
		var _g = 0;
		while(_g < len) {
			var i = _g++;
			css.push((function($this) {
				var $r;
				var v = ($this.colors[i] & -256 | (function($this) {
					var $r;
					var v1 = 255;
					$r = (function($this) {
						var $r;
						var value = (v1 & -256) >>> 8;
						if(value < 0) value = 0; else if(value > 16777215) value = 16777215;
						$r = value;
						return $r;
					}($this)) << 8 | (function($this) {
						var $r;
						var value = v1 & 255;
						if(value < 0) value = 0; else if(value > 255) value = 255;
						$r = value;
						return $r;
					}($this));
					return $r;
				}($this)) & 255) & -256 | (function($this) {
					var $r;
					var value = $this.alphas[i] * 255 | 0;
					if(value < 0) value = 0; else if(value > 255) value = 255;
					$r = value;
					return $r;
				}($this));
				$r = "0x" + StringTools.hex((v & -256) >>> 8,6) + StringTools.hex(v & 255,2);
				return $r;
			}(this)) + " " + this.ratios[i]);
		}
		if(this.knockout) css.push("knockout");
		css.push((function($this) {
			var $r;
			switch( ($this.type)[1] ) {
			case 1:
				$r = "inner";
				break;
			case 2:
				$r = "outer";
				break;
			case 0:
				$r = "full";
				break;
			}
			return $r;
		}(this)));
		css.push((function($this) {
			var $r;
			switch($this.quality) {
			case 1:
				$r = "low";
				break;
			case 2:
				$r = "medium";
				break;
			case 3:
				$r = "high";
				break;
			}
			return $r;
		}(this)));
		return css.join(" ");
	}
	,__class__: prime.gui.filters.GradientBevelFilter
});
prime.gui.filters.GradientGlowFilter = function(distance,angle,colors,alphas,ratios,blurX,blurY,strength,quality,type,knockout) {
	prime.gui.filters.GradientBevelFilter.call(this,distance,angle,colors,alphas,ratios,blurX,blurY,strength,quality,type,knockout);
};
prime.gui.filters.GradientGlowFilter.__name__ = ["prime","gui","filters","GradientGlowFilter"];
prime.gui.filters.GradientGlowFilter.__super__ = prime.gui.filters.GradientBevelFilter;
prime.gui.filters.GradientGlowFilter.prototype = $extend(prime.gui.filters.GradientBevelFilter.prototype,{
	__class__: prime.gui.filters.GradientGlowFilter
});
if(!prime.gui.graphics) prime.gui.graphics = {}
prime.gui.graphics.IGraphicElement = function() { }
prime.gui.graphics.IGraphicElement.__name__ = ["prime","gui","graphics","IGraphicElement"];
prime.gui.graphics.IGraphicElement.__interfaces__ = [prime.tools.generator.ICSSFormattable,prime.tools.generator.ICodeFormattable,prime.core.traits.IDisposable,prime.core.traits.IInvalidatable];
prime.gui.graphics.GraphicElement = function() {
	prime.core.traits.Invalidatable.call(this);
	this._oid = prime.utils.ID.next++;
};
prime.gui.graphics.GraphicElement.__name__ = ["prime","gui","graphics","GraphicElement"];
prime.gui.graphics.GraphicElement.__interfaces__ = [prime.gui.graphics.IGraphicElement];
prime.gui.graphics.GraphicElement.__super__ = prime.core.traits.Invalidatable;
prime.gui.graphics.GraphicElement.prototype = $extend(prime.core.traits.Invalidatable.prototype,{
	cleanUp: function() {
	}
	,isEmpty: function() {
		return false;
	}
	,toCSS: function(prefix) {
		if(prefix == null) prefix = "";
		return "GraphicElement";
	}
	,toString: function() {
		return this.toCSS();
	}
	,toCode: function(code) {
		null;
	}
	,dispose: function() {
		this._oid = 0;
		prime.core.traits.Invalidatable.prototype.dispose.call(this);
	}
	,__class__: prime.gui.graphics.GraphicElement
});
prime.gui.graphics.IGraphicProperty = function() { }
prime.gui.graphics.IGraphicProperty.__name__ = ["prime","gui","graphics","IGraphicProperty"];
prime.gui.graphics.IGraphicProperty.__interfaces__ = [prime.gui.graphics.IGraphicElement];
prime.gui.graphics.IGraphicProperty.prototype = {
	__class__: prime.gui.graphics.IGraphicProperty
}
prime.gui.graphics.IComposedGraphicProperty = function() { }
prime.gui.graphics.IComposedGraphicProperty.__name__ = ["prime","gui","graphics","IComposedGraphicProperty"];
prime.gui.graphics.IComposedGraphicProperty.__interfaces__ = [prime.bindable.collections.iterators.IIterator,prime.gui.graphics.IGraphicProperty];
prime.gui.graphics.IComposedGraphicProperty.prototype = {
	__class__: prime.gui.graphics.IComposedGraphicProperty
}
prime.gui.graphics.ComposedGraphicProperty = function() {
	this.length = 0;
	prime.gui.graphics.GraphicElement.call(this);
};
prime.gui.graphics.ComposedGraphicProperty.__name__ = ["prime","gui","graphics","ComposedGraphicProperty"];
prime.gui.graphics.ComposedGraphicProperty.__interfaces__ = [prime.gui.graphics.IComposedGraphicProperty];
prime.gui.graphics.ComposedGraphicProperty.__super__ = prime.gui.graphics.GraphicElement;
prime.gui.graphics.ComposedGraphicProperty.prototype = $extend(prime.gui.graphics.GraphicElement.prototype,{
	toCode: function(code) {
		code.construct(this);
		var cur = this.firstCell;
		while(cur != null) {
			code.setAction(this,"add",[cur.data]);
			cur = cur.next;
		}
	}
	,isEmpty: function() {
		return this.firstCell == null || this.firstCell.data == null;
	}
	,toCSS: function(prefix) {
		if(prefix == null) prefix = "";
		var str = "";
		var cur = this.firstCell;
		while(cur != null) {
			str += cur.data.toCSS(prefix);
			cur = cur.next;
		}
		return str;
	}
	,merge: function(other) {
		other.rewind();
		while(other.hasNext()) {
			var n = other.next();
			other.remove(n);
			this.add(n);
		}
		other.dispose();
	}
	,remove: function(property) {
		var prev = null;
		var cur = this.firstCell;
		var success = false;
		while(cur != null) {
			if(cur.data == property) {
				if(prev == null) this.firstCell = cur.next; else prev.next = cur.next;
				if(this.lastCell == cur) this.lastCell = prev;
				cur.dispose();
				success = true;
				this.length--;
				break;
			}
			prev = cur;
			cur = cur.next;
		}
		return success;
	}
	,add: function(property) {
		if(property == null) return false;
		if(js.Boot.__instanceof(property,prime.gui.graphics.IComposedGraphicProperty)) this.merge(property); else {
			var cell = new prime.bindable.collections.FastCell(property,this.lastCell);
			if(this.firstCell == null) this.nextCell = this.firstCell = cell;
			this.lastCell = cell;
			this.length++;
		}
		return true;
	}
	,next: function() {
		var cur = this.nextCell;
		this.nextCell = this.nextCell.next;
		return cur.data;
	}
	,value: function() {
		return this.nextCell.data;
	}
	,setCurrent: function(v) {
	}
	,hasNext: function() {
		return this.nextCell != null;
	}
	,rewind: function() {
		this.nextCell = this.firstCell;
	}
	,end: function(target,bounds) {
		if(this.nextCell != null) {
			this.nextCell.data.end(target,bounds);
			this.next();
		}
	}
	,begin: function(target,bounds) {
		if(this.nextCell != null) this.nextCell.data.begin(target,bounds);
	}
	,dispose: function() {
		var cur = this.firstCell;
		while(cur != null) {
			var tmp = cur;
			cur = cur.next;
			tmp.dispose();
		}
		this.length = 0;
		this.firstCell = this.lastCell = null;
		prime.gui.graphics.GraphicElement.prototype.dispose.call(this);
	}
	,__class__: prime.gui.graphics.ComposedGraphicProperty
});
prime.gui.graphics.EmptyGraphicProperty = function() {
	prime.gui.graphics.GraphicElement.call(this);
};
prime.gui.graphics.EmptyGraphicProperty.__name__ = ["prime","gui","graphics","EmptyGraphicProperty"];
prime.gui.graphics.EmptyGraphicProperty.__interfaces__ = [prime.gui.graphics.IGraphicProperty];
prime.gui.graphics.EmptyGraphicProperty.__super__ = prime.gui.graphics.GraphicElement;
prime.gui.graphics.EmptyGraphicProperty.prototype = $extend(prime.gui.graphics.GraphicElement.prototype,{
	toCode: function(code) {
		code.construct(this,[]);
	}
	,toCSS: function(prefix) {
		if(prefix == null) prefix = "";
		return "none";
	}
	,end: function(target,bounds) {
		null;
	}
	,begin: function(target,bounds) {
		null;
	}
	,__class__: prime.gui.graphics.EmptyGraphicProperty
});
if(!prime.gui.graphics.borders) prime.gui.graphics.borders = {}
prime.gui.graphics.borders.IBorder = function() { }
prime.gui.graphics.borders.IBorder.__name__ = ["prime","gui","graphics","borders","IBorder"];
prime.gui.graphics.borders.IBorder.__interfaces__ = [prime.gui.graphics.IGraphicProperty];
prime.gui.graphics.borders.IBorder.prototype = {
	__class__: prime.gui.graphics.borders.IBorder
}
prime.gui.graphics.borders.BorderBase = function(fill,weight,innerBorder,caps,joint,pixelHinting) {
	if(pixelHinting == null) pixelHinting = false;
	if(innerBorder == null) innerBorder = false;
	if(weight == null) weight = 1.0;
	prime.gui.graphics.GraphicElement.call(this);
	if(fill != this.fill) {
		if(this.fill != null) this.fill.listeners.remove(this);
		this.fill = fill;
		if(this.fill != null) this.fill.listeners.add(this);
		this.invalidate(2);
	}
	fill;
	if(weight != this.weight) {
		this.weight = weight;
		this.invalidate(2);
	}
	weight;
	this.setCaps(caps != null?caps:prime.gui.graphics.borders.CapsStyle.NONE);
	this.setJoint(joint != null?joint:prime.gui.graphics.borders.JointStyle.ROUND);
	if(innerBorder != this.innerBorder) {
		this.innerBorder = innerBorder;
		this.invalidate(2);
	}
	innerBorder;
	if(pixelHinting != this.pixelHinting) {
		this.pixelHinting = pixelHinting;
		this.invalidate(2);
	}
	pixelHinting;
};
prime.gui.graphics.borders.BorderBase.__name__ = ["prime","gui","graphics","borders","BorderBase"];
prime.gui.graphics.borders.BorderBase.__interfaces__ = [prime.gui.graphics.borders.IBorder];
prime.gui.graphics.borders.BorderBase.__super__ = prime.gui.graphics.GraphicElement;
prime.gui.graphics.borders.BorderBase.prototype = $extend(prime.gui.graphics.GraphicElement.prototype,{
	toCode: function(code) {
		code.construct(this,[this.fill,this.weight,this.innerBorder,this.caps,this.joint,this.pixelHinting]);
	}
	,isEmpty: function() {
		return this.fill == null;
	}
	,toCSS: function(prefix) {
		if(prefix == null) prefix = "";
		return Std.string(this.fill) + " " + this.weight + "px " + (this.innerBorder?"inside":"outside");
	}
	,setInnerBorder: function(v) {
		if(v != this.innerBorder) {
			this.innerBorder = v;
			this.invalidate(2);
		}
		return v;
	}
	,setJoint: function(v) {
		if(v != this.joint) {
			this.joint = v;
			this.invalidate(2);
		}
		return v;
	}
	,setCaps: function(v) {
		if(v != this.caps) {
			this.caps = v;
			this.invalidate(2);
		}
		return v;
	}
	,setWeight: function(v) {
		if(v != this.weight) {
			this.weight = v;
			this.invalidate(2);
		}
		return v;
	}
	,end: function(target,bounds) {
	}
	,begin: function(target,bounds) {
	}
	,dispose: function() {
		if(null != this.fill) {
			if(this.fill != null) this.fill.listeners.remove(this);
			this.fill = null;
			if(this.fill != null) this.fill.listeners.add(this);
			this.invalidate(2);
		}
		null;
		prime.gui.graphics.GraphicElement.prototype.dispose.call(this);
	}
	,__class__: prime.gui.graphics.borders.BorderBase
});
prime.gui.graphics.borders.BitmapBorder = function(fill,weight,innerBorder,caps,joint,pixelHinting) {
	prime.gui.graphics.borders.BorderBase.call(this,fill,weight,innerBorder,caps,joint,pixelHinting);
};
prime.gui.graphics.borders.BitmapBorder.__name__ = ["prime","gui","graphics","borders","BitmapBorder"];
prime.gui.graphics.borders.BitmapBorder.__super__ = prime.gui.graphics.borders.BorderBase;
prime.gui.graphics.borders.BitmapBorder.prototype = $extend(prime.gui.graphics.borders.BorderBase.prototype,{
	begin: function(target,bounds) {
		prime.gui.graphics.borders.BorderBase.prototype.begin.call(this,target,bounds);
	}
	,__class__: prime.gui.graphics.borders.BitmapBorder
});
prime.gui.graphics.borders.CapsStyle = { __ename__ : ["prime","gui","graphics","borders","CapsStyle"], __constructs__ : ["NONE","ROUND","SQUARE"] }
prime.gui.graphics.borders.CapsStyle.NONE = ["NONE",0];
prime.gui.graphics.borders.CapsStyle.NONE.toString = $estr;
prime.gui.graphics.borders.CapsStyle.NONE.__enum__ = prime.gui.graphics.borders.CapsStyle;
prime.gui.graphics.borders.CapsStyle.ROUND = ["ROUND",1];
prime.gui.graphics.borders.CapsStyle.ROUND.toString = $estr;
prime.gui.graphics.borders.CapsStyle.ROUND.__enum__ = prime.gui.graphics.borders.CapsStyle;
prime.gui.graphics.borders.CapsStyle.SQUARE = ["SQUARE",2];
prime.gui.graphics.borders.CapsStyle.SQUARE.toString = $estr;
prime.gui.graphics.borders.CapsStyle.SQUARE.__enum__ = prime.gui.graphics.borders.CapsStyle;
prime.gui.graphics.borders.ComposedBorder = function() {
	if(0 != this.weight) this.weight = 0;
	0;
	prime.gui.graphics.ComposedGraphicProperty.call(this);
};
prime.gui.graphics.borders.ComposedBorder.__name__ = ["prime","gui","graphics","borders","ComposedBorder"];
prime.gui.graphics.borders.ComposedBorder.__interfaces__ = [prime.gui.graphics.borders.IBorder];
prime.gui.graphics.borders.ComposedBorder.__super__ = prime.gui.graphics.ComposedGraphicProperty;
prime.gui.graphics.borders.ComposedBorder.prototype = $extend(prime.gui.graphics.ComposedGraphicProperty.prototype,{
	setInnerBorder: function(v) {
		return v;
	}
	,setWeight: function(v) {
		if(v != this.weight) this.weight = v;
		return v;
	}
	,remove: function(property) {
		if(!prime.gui.graphics.ComposedGraphicProperty.prototype.remove.call(this,property)) return false;
		var border = property;
		if(!border.innerBorder) {
			var _g = this;
			_g.setWeight(_g.weight - border.weight);
		}
		this.invalidate(2);
		return true;
	}
	,add: function(property) {
		if(!prime.gui.graphics.ComposedGraphicProperty.prototype.add.call(this,property)) return false;
		var border = property;
		if(!border.innerBorder) {
			var _g = this;
			_g.setWeight(_g.weight + border.weight);
		}
		this.invalidate(2);
		return true;
	}
	,__class__: prime.gui.graphics.borders.ComposedBorder
});
prime.gui.graphics.borders.EmptyBorder = function() {
	prime.gui.graphics.GraphicElement.call(this);
};
prime.gui.graphics.borders.EmptyBorder.__name__ = ["prime","gui","graphics","borders","EmptyBorder"];
prime.gui.graphics.borders.EmptyBorder.__interfaces__ = [prime.gui.graphics.borders.IBorder,prime.gui.graphics.IGraphicProperty];
prime.gui.graphics.borders.EmptyBorder.__super__ = prime.gui.graphics.GraphicElement;
prime.gui.graphics.borders.EmptyBorder.prototype = $extend(prime.gui.graphics.GraphicElement.prototype,{
	toCode: function(code) {
		code.construct(this,[]);
	}
	,toCSS: function(prefix) {
		if(prefix == null) prefix = "";
		return "none";
	}
	,setInnerBorder: function(v) {
		return false;
	}
	,setWeight: function(v) {
		return 0;
	}
	,end: function(target,bounds) {
		null;
	}
	,begin: function(target,bounds) {
		null;
	}
	,__class__: prime.gui.graphics.borders.EmptyBorder
});
prime.gui.graphics.borders.GradientBorder = function(fill,weight,innerBorder,caps,joint,pixelHinting) {
	prime.gui.graphics.borders.BorderBase.call(this,fill,weight,innerBorder,caps,joint,pixelHinting);
};
prime.gui.graphics.borders.GradientBorder.__name__ = ["prime","gui","graphics","borders","GradientBorder"];
prime.gui.graphics.borders.GradientBorder.__super__ = prime.gui.graphics.borders.BorderBase;
prime.gui.graphics.borders.GradientBorder.prototype = $extend(prime.gui.graphics.borders.BorderBase.prototype,{
	begin: function(target,bounds) {
		prime.gui.graphics.borders.BorderBase.prototype.begin.call(this,target,bounds);
		this.lastBounds = bounds.clone();
	}
	,__class__: prime.gui.graphics.borders.GradientBorder
});
prime.gui.graphics.borders.JointStyle = { __ename__ : ["prime","gui","graphics","borders","JointStyle"], __constructs__ : ["MITER","ROUND","BEVEL"] }
prime.gui.graphics.borders.JointStyle.MITER = ["MITER",0];
prime.gui.graphics.borders.JointStyle.MITER.toString = $estr;
prime.gui.graphics.borders.JointStyle.MITER.__enum__ = prime.gui.graphics.borders.JointStyle;
prime.gui.graphics.borders.JointStyle.ROUND = ["ROUND",1];
prime.gui.graphics.borders.JointStyle.ROUND.toString = $estr;
prime.gui.graphics.borders.JointStyle.ROUND.__enum__ = prime.gui.graphics.borders.JointStyle;
prime.gui.graphics.borders.JointStyle.BEVEL = ["BEVEL",2];
prime.gui.graphics.borders.JointStyle.BEVEL.toString = $estr;
prime.gui.graphics.borders.JointStyle.BEVEL.__enum__ = prime.gui.graphics.borders.JointStyle;
prime.gui.graphics.borders.SolidBorder = function(fill,weight,innerBorder,caps,joint,pixelHinting) {
	prime.gui.graphics.borders.BorderBase.call(this,fill,weight,innerBorder,caps,joint,pixelHinting);
};
prime.gui.graphics.borders.SolidBorder.__name__ = ["prime","gui","graphics","borders","SolidBorder"];
prime.gui.graphics.borders.SolidBorder.__super__ = prime.gui.graphics.borders.BorderBase;
prime.gui.graphics.borders.SolidBorder.prototype = $extend(prime.gui.graphics.borders.BorderBase.prototype,{
	begin: function(target,bounds) {
		prime.gui.graphics.borders.BorderBase.prototype.begin.call(this,target,bounds);
	}
	,__class__: prime.gui.graphics.borders.SolidBorder
});
if(!prime.gui.graphics.fills) prime.gui.graphics.fills = {}
prime.gui.graphics.fills.BitmapFill = function(assetFactory,asset,matrix,repeat,smooth) {
	if(smooth == null) smooth = false;
	if(repeat == null) repeat = true;
	prime.gui.graphics.GraphicElement.call(this);
	if(assetFactory != this.assetFactory) {
		if(this.assetFactory != null) {
			if(null != this.asset) this.asset = null;
			null;
		}
		this.assetFactory = assetFactory;
		this.invalidate(1);
	}
	assetFactory;
	if(asset != this.asset) this.asset = asset;
	asset;
	if(matrix != this.matrix) {
		this.matrix = matrix;
		this.invalidate(1);
	}
	matrix;
	if(repeat != this.repeat) {
		this.repeat = repeat;
		this.invalidate(1);
	}
	repeat;
	if(smooth != this.smooth) {
		this.smooth = smooth;
		this.invalidate(1);
	}
	smooth;
	this.isFinished = false;
};
prime.gui.graphics.fills.BitmapFill.__name__ = ["prime","gui","graphics","fills","BitmapFill"];
prime.gui.graphics.fills.BitmapFill.__interfaces__ = [prime.gui.graphics.IGraphicProperty];
prime.gui.graphics.fills.BitmapFill.__super__ = prime.gui.graphics.GraphicElement;
prime.gui.graphics.fills.BitmapFill.prototype = $extend(prime.gui.graphics.GraphicElement.prototype,{
	toCode: function(code) {
		code.construct(this,[this.assetFactory,this.asset,this.matrix,this.repeat,this.smooth]);
	}
	,toCSS: function(prefix) {
		if(prefix == null) prefix = "";
		return Std.string(this.asset) + " " + Std.string(this.repeat);
	}
	,toString: function() {
		return "BitmapFill( " + Std.string(this.asset) + ", " + Std.string(this.smooth) + ", " + Std.string(this.repeat) + " )";
	}
	,end: function(target,bounds) {
		this.isFinished = false;
	}
	,begin: function(target,bounds) {
	}
	,dispose: function() {
		if(this.asset != null) this.asset.dispose();
		if(this.matrix != null) {
			if(null != this.matrix) {
				this.matrix = null;
				this.invalidate(1);
			}
			null;
		}
		prime.gui.graphics.GraphicElement.prototype.dispose.call(this);
	}
	,__class__: prime.gui.graphics.fills.BitmapFill
});
prime.gui.graphics.fills.ComposedFill = function() {
	prime.gui.graphics.ComposedGraphicProperty.call(this);
};
prime.gui.graphics.fills.ComposedFill.__name__ = ["prime","gui","graphics","fills","ComposedFill"];
prime.gui.graphics.fills.ComposedFill.__super__ = prime.gui.graphics.ComposedGraphicProperty;
prime.gui.graphics.fills.ComposedFill.prototype = $extend(prime.gui.graphics.ComposedGraphicProperty.prototype,{
	remove: function(property) {
		if(!prime.gui.graphics.ComposedGraphicProperty.prototype.remove.call(this,property)) return false;
		this.invalidate(1);
		return true;
	}
	,add: function(property) {
		if(!prime.gui.graphics.ComposedGraphicProperty.prototype.add.call(this,property)) return false;
		this.invalidate(1);
		return true;
	}
	,__class__: prime.gui.graphics.fills.ComposedFill
});
prime.gui.graphics.fills.GradientFill = function(type,spread,focalPointRatio,rotation) {
	if(rotation == null) rotation = 0;
	if(focalPointRatio == null) focalPointRatio = 0;
	prime.gui.graphics.GraphicElement.call(this);
	this.gradientStops = [];
	this.setType(type == null?prime.gui.graphics.fills.GradientType.linear:type);
	this.setSpread(spread == null?prime.gui.graphics.fills.SpreadMethod.normal:spread);
	if(focalPointRatio != this.focalPointRatio) {
		this.focalPointRatio = focalPointRatio;
		this.invalidate(1);
	}
	focalPointRatio;
	if(rotation != this.rotation) {
		this.lastMatrix = null;
		this.rotation = rotation;
		this.invalidate(1);
	}
	rotation;
	this.isFinished = false;
};
prime.gui.graphics.fills.GradientFill.__name__ = ["prime","gui","graphics","fills","GradientFill"];
prime.gui.graphics.fills.GradientFill.__interfaces__ = [prime.gui.graphics.IGraphicProperty];
prime.gui.graphics.fills.GradientFill.__super__ = prime.gui.graphics.GraphicElement;
prime.gui.graphics.fills.GradientFill.prototype = $extend(prime.gui.graphics.GraphicElement.prototype,{
	toCode: function(code) {
		code.construct(this,[this.type,this.spread,this.focalPointRatio,this.rotation]);
		var _g = 0, _g1 = this.gradientStops;
		while(_g < _g1.length) {
			var stop = _g1[_g];
			++_g;
			code.setAction(this,"add",[stop]);
		}
	}
	,toCSS: function(prefix) {
		if(prefix == null) prefix = "";
		var colorStr = this.gradientStops.join(", ");
		if(this.type == prime.gui.graphics.fills.GradientType.linear) return "linear-gradient( " + this.rotation + "deg, " + colorStr + ", " + Std.string(this.spread) + " )"; else return "radial-gradient( " + this.focalPointRatio + ", " + colorStr + ", " + Std.string(this.spread) + " )";
	}
	,add: function(fill,depth) {
		if(depth == null) depth = -1;
		prime.utils.FastArrayUtil.insertAt(this.gradientStops,fill,depth);
		fill.listeners.add(this);
		this.invalidate(1);
	}
	,end: function(target,bounds) {
		this.isFinished = false;
	}
	,begin: function(target,bounds) {
		this.isFinished = true;
	}
	,setSpread: function(v) {
		if(v != this.spread) {
			this.spread = v;
			this.invalidate(1);
		}
		return v;
	}
	,setType: function(v) {
		if(v != this.type) {
			this.type = v;
			this.invalidate(1);
		}
		return v;
	}
	,dispose: function() {
		var _g = 0, _g1 = this.gradientStops;
		while(_g < _g1.length) {
			var fill = _g1[_g];
			++_g;
			fill.dispose();
		}
		this.gradientStops = null;
		this.lastBounds = null;
		this.lastMatrix = null;
		prime.gui.graphics.GraphicElement.prototype.dispose.call(this);
	}
	,__class__: prime.gui.graphics.fills.GradientFill
});
prime.gui.graphics.fills.GradientStop = function(color,position) {
	prime.gui.graphics.GraphicElement.call(this);
	if(color != this.color) {
		this.color = color;
		this.invalidate(1);
	}
	color;
	if(position != this.position) {
		this.position = position;
		this.invalidate(1);
	}
	position;
};
prime.gui.graphics.fills.GradientStop.__name__ = ["prime","gui","graphics","fills","GradientStop"];
prime.gui.graphics.fills.GradientStop.__super__ = prime.gui.graphics.GraphicElement;
prime.gui.graphics.fills.GradientStop.prototype = $extend(prime.gui.graphics.GraphicElement.prototype,{
	toCode: function(code) {
		code.construct(this,[this.color,this.position]);
	}
	,toCSS: function(prefix) {
		if(prefix == null) prefix = "";
		return (function($this) {
			var $r;
			var v = $this.color;
			$r = "0x" + StringTools.hex((v & -256) >>> 8,6) + StringTools.hex(v & 255,2);
			return $r;
		}(this)) + " " + (function($this) {
			var $r;
			var var1 = $this.position / 255 * 100;
			$r = (var1 < 0?-.5:.5) + var1 | 0;
			return $r;
		}(this)) + "%";
	}
	,setPosition: function(v) {
		if(v != this.position) {
			this.position = v;
			this.invalidate(1);
		}
		return v;
	}
	,__class__: prime.gui.graphics.fills.GradientStop
});
prime.gui.graphics.fills.GradientType = { __ename__ : ["prime","gui","graphics","fills","GradientType"], __constructs__ : ["linear","radial"] }
prime.gui.graphics.fills.GradientType.linear = ["linear",0];
prime.gui.graphics.fills.GradientType.linear.toString = $estr;
prime.gui.graphics.fills.GradientType.linear.__enum__ = prime.gui.graphics.fills.GradientType;
prime.gui.graphics.fills.GradientType.radial = ["radial",1];
prime.gui.graphics.fills.GradientType.radial.toString = $estr;
prime.gui.graphics.fills.GradientType.radial.__enum__ = prime.gui.graphics.fills.GradientType;
prime.gui.graphics.fills.SolidFill = function(color) {
	prime.gui.graphics.GraphicElement.call(this);
	if(this.color != color) {
		this.color = color;
		this.invalidate(1);
	}
	color;
	this.isFinished = false;
};
prime.gui.graphics.fills.SolidFill.__name__ = ["prime","gui","graphics","fills","SolidFill"];
prime.gui.graphics.fills.SolidFill.__interfaces__ = [prime.gui.graphics.IGraphicProperty];
prime.gui.graphics.fills.SolidFill.__super__ = prime.gui.graphics.GraphicElement;
prime.gui.graphics.fills.SolidFill.prototype = $extend(prime.gui.graphics.GraphicElement.prototype,{
	toCode: function(code) {
		code.construct(this,[this.color]);
	}
	,toCSS: function(prefix) {
		if(prefix == null) prefix = "";
		return (function($this) {
			var $r;
			var v = $this.color;
			$r = "0x" + StringTools.hex((v & -256) >>> 8,6) + StringTools.hex(v & 255,2);
			return $r;
		}(this));
	}
	,end: function(target,bounds) {
		this.isFinished = false;
	}
	,begin: function(target,bounds) {
		this.isFinished = true;
	}
	,__class__: prime.gui.graphics.fills.SolidFill
});
prime.gui.graphics.fills.SpreadMethod = { __ename__ : ["prime","gui","graphics","fills","SpreadMethod"], __constructs__ : ["normal","reflect","repeat"] }
prime.gui.graphics.fills.SpreadMethod.normal = ["normal",0];
prime.gui.graphics.fills.SpreadMethod.normal.toString = $estr;
prime.gui.graphics.fills.SpreadMethod.normal.__enum__ = prime.gui.graphics.fills.SpreadMethod;
prime.gui.graphics.fills.SpreadMethod.reflect = ["reflect",1];
prime.gui.graphics.fills.SpreadMethod.reflect.toString = $estr;
prime.gui.graphics.fills.SpreadMethod.reflect.__enum__ = prime.gui.graphics.fills.SpreadMethod;
prime.gui.graphics.fills.SpreadMethod.repeat = ["repeat",2];
prime.gui.graphics.fills.SpreadMethod.repeat.toString = $estr;
prime.gui.graphics.fills.SpreadMethod.repeat.__enum__ = prime.gui.graphics.fills.SpreadMethod;
if(!prime.gui.graphics.shapes) prime.gui.graphics.shapes = {}
prime.gui.graphics.shapes.ShapeBase = function() {
	prime.gui.graphics.GraphicElement.call(this);
};
prime.gui.graphics.shapes.ShapeBase.__name__ = ["prime","gui","graphics","shapes","ShapeBase"];
prime.gui.graphics.shapes.ShapeBase.__super__ = prime.gui.graphics.GraphicElement;
prime.gui.graphics.shapes.ShapeBase.prototype = $extend(prime.gui.graphics.GraphicElement.prototype,{
	toCode: function(code) {
		code.construct(this);
	}
	,__class__: prime.gui.graphics.shapes.ShapeBase
});
prime.gui.graphics.shapes.IGraphicShape = function() { }
prime.gui.graphics.shapes.IGraphicShape.__name__ = ["prime","gui","graphics","shapes","IGraphicShape"];
prime.gui.graphics.shapes.IGraphicShape.__interfaces__ = [prime.gui.graphics.IGraphicElement];
prime.gui.graphics.shapes.IGraphicShape.prototype = {
	__class__: prime.gui.graphics.shapes.IGraphicShape
}
prime.gui.graphics.shapes.Circle = function() {
	prime.gui.graphics.shapes.ShapeBase.call(this);
};
prime.gui.graphics.shapes.Circle.__name__ = ["prime","gui","graphics","shapes","Circle"];
prime.gui.graphics.shapes.Circle.__interfaces__ = [prime.gui.graphics.shapes.IGraphicShape];
prime.gui.graphics.shapes.Circle.__super__ = prime.gui.graphics.shapes.ShapeBase;
prime.gui.graphics.shapes.Circle.prototype = $extend(prime.gui.graphics.shapes.ShapeBase.prototype,{
	toCSS: function(prefix) {
		if(prefix == null) prefix = "";
		return "circle";
	}
	,drawFraction: function(target,bounds,borderRadius,percentage) {
		var radius = (function($this) {
			var $r;
			var var1 = bounds.getWidth() * .5, var2 = bounds.getHeight() * .5;
			$r = var1 < var2?var1:var2;
			return $r;
		}(this));
	}
	,draw: function(target,bounds,borderRadius) {
		var radius = (function($this) {
			var $r;
			var var1 = bounds.getWidth() * .5, var2 = bounds.getHeight() * .5;
			$r = var1 < var2?var1:var2;
			return $r;
		}(this));
	}
	,__class__: prime.gui.graphics.shapes.Circle
});
prime.gui.graphics.shapes.Ellipse = function() {
	prime.gui.graphics.shapes.ShapeBase.call(this);
};
prime.gui.graphics.shapes.Ellipse.__name__ = ["prime","gui","graphics","shapes","Ellipse"];
prime.gui.graphics.shapes.Ellipse.__interfaces__ = [prime.gui.graphics.shapes.IGraphicShape];
prime.gui.graphics.shapes.Ellipse.__super__ = prime.gui.graphics.shapes.ShapeBase;
prime.gui.graphics.shapes.Ellipse.prototype = $extend(prime.gui.graphics.shapes.ShapeBase.prototype,{
	toCSS: function(prefix) {
		if(prefix == null) prefix = "";
		return "ellipse";
	}
	,drawFraction: function(target,bounds,borderRadius,percentage) {
		var radiusX = bounds.getWidth() * .5;
		var radiusY = bounds.getHeight() * .5;
	}
	,draw: function(target,bounds,borderRadius) {
	}
	,__class__: prime.gui.graphics.shapes.Ellipse
});
prime.gui.graphics.shapes.Line = function() {
	prime.gui.graphics.shapes.ShapeBase.call(this);
};
prime.gui.graphics.shapes.Line.__name__ = ["prime","gui","graphics","shapes","Line"];
prime.gui.graphics.shapes.Line.__interfaces__ = [prime.gui.graphics.shapes.IGraphicShape];
prime.gui.graphics.shapes.Line.__super__ = prime.gui.graphics.shapes.ShapeBase;
prime.gui.graphics.shapes.Line.prototype = $extend(prime.gui.graphics.shapes.ShapeBase.prototype,{
	toCSS: function(prefix) {
		if(prefix == null) prefix = "";
		return "line";
	}
	,drawFraction: function(target,bounds,borderRadius,percentage) {
	}
	,draw: function(target,bounds,borderRadius) {
	}
	,__class__: prime.gui.graphics.shapes.Line
});
prime.gui.graphics.shapes.RegularRectangle = function() {
	prime.gui.graphics.shapes.ShapeBase.call(this);
};
prime.gui.graphics.shapes.RegularRectangle.__name__ = ["prime","gui","graphics","shapes","RegularRectangle"];
prime.gui.graphics.shapes.RegularRectangle.__interfaces__ = [prime.gui.graphics.shapes.IGraphicShape];
prime.gui.graphics.shapes.RegularRectangle.__super__ = prime.gui.graphics.shapes.ShapeBase;
prime.gui.graphics.shapes.RegularRectangle.prototype = $extend(prime.gui.graphics.shapes.ShapeBase.prototype,{
	toCSS: function(prefix) {
		if(prefix == null) prefix = "";
		return "rectangle";
	}
	,drawFraction: function(target,bounds,borderRadius,percentage) {
		var b = bounds.clone();
		b.setWidth((function($this) {
			var $r;
			var var1 = b.getWidth() * percentage;
			$r = (var1 < 0?-.5:.5) + var1 | 0;
			return $r;
		}(this)));
		b.setHeight((function($this) {
			var $r;
			var var1 = b.getHeight() * percentage;
			$r = (var1 < 0?-.5:.5) + var1 | 0;
			return $r;
		}(this)));
		this.draw(target,b,borderRadius);
	}
	,draw: function(target,bounds,borderRadius) {
	}
	,__class__: prime.gui.graphics.shapes.RegularRectangle
});
prime.gui.graphics.shapes.Triangle = function(direction) {
	prime.gui.graphics.shapes.ShapeBase.call(this);
	this.setDirection(direction == null?prime.core.geom.space.Position.MiddleLeft:direction);
	this.a = new prime.core.geom.IntPoint();
	this.b = new prime.core.geom.IntPoint();
	this.c = new prime.core.geom.IntPoint();
};
prime.gui.graphics.shapes.Triangle.__name__ = ["prime","gui","graphics","shapes","Triangle"];
prime.gui.graphics.shapes.Triangle.__interfaces__ = [prime.gui.graphics.shapes.IGraphicShape];
prime.gui.graphics.shapes.Triangle.__super__ = prime.gui.graphics.shapes.ShapeBase;
prime.gui.graphics.shapes.Triangle.prototype = $extend(prime.gui.graphics.shapes.ShapeBase.prototype,{
	toCode: function(code) {
		code.construct(this,[this.direction]);
	}
	,toCSS: function(prefix) {
		if(prefix == null) prefix = "";
		return "triangle";
	}
	,setDirection: function(v) {
		if(v != this.direction) {
			this.direction = v;
			this.invalidate(4);
		}
		return v;
	}
	,drawFraction: function(target,bounds,borderRadius,percentage) {
		var b = bounds.clone();
		b.setWidth((function($this) {
			var $r;
			var var1 = b.getWidth() * percentage;
			$r = (var1 < 0?-.5:.5) + var1 | 0;
			return $r;
		}(this)));
		b.setHeight((function($this) {
			var $r;
			var var1 = b.getHeight() * percentage;
			$r = (var1 < 0?-.5:.5) + var1 | 0;
			return $r;
		}(this)));
		this.draw(target,b,borderRadius);
	}
	,draw: function(target,bounds,borderRadius) {
	}
	,dispose: function() {
		this.a = this.b = this.c = null;
		if(null != this.direction) {
			this.direction = null;
			this.invalidate(4);
		}
		null;
		prime.gui.graphics.shapes.ShapeBase.prototype.dispose.call(this);
	}
	,__class__: prime.gui.graphics.shapes.Triangle
});
if(!prime.layout) prime.layout = {}
prime.layout.RelativeLayout = function(top,right,bottom,left,hCenter,vCenter) {
	if(vCenter == null) vCenter = -2147483648;
	if(hCenter == null) hCenter = -2147483648;
	if(left == null) left = -2147483648;
	if(bottom == null) bottom = -2147483648;
	if(right == null) right = -2147483648;
	if(top == null) top = -2147483648;
	this._oid = prime.utils.ID.next++;
	this.enabled = true;
	this.change = new prime.signal.Signal0();
	this.setHCenter(hCenter);
	this.setVCenter(vCenter);
	if(top != -2147483648 && top != null) this.setVCenter(-2147483648);
	if(top != this.top) {
		this.top = top;
		if(this.enabled) this.change.send();
	}
	top;
	if(right != -2147483648 && right != null) this.setHCenter(-2147483648);
	if(right != this.right) {
		this.right = right;
		if(this.enabled) this.change.send();
	}
	right;
	if(bottom != -2147483648 && bottom != null) this.setVCenter(-2147483648);
	if(bottom != this.bottom) {
		this.bottom = bottom;
		if(this.enabled) this.change.send();
	}
	bottom;
	if(left != -2147483648 && left != null) this.setHCenter(-2147483648);
	if(left != this.left) {
		this.left = left;
		if(this.enabled) this.change.send();
	}
	left;
};
prime.layout.RelativeLayout.__name__ = ["prime","gui","layout","RelativeLayout"];
prime.layout.RelativeLayout.__interfaces__ = [prime.tools.generator.ICodeFormattable,prime.tools.generator.ICSSFormattable,prime.core.traits.IDisposable,prime.core.geom.IBox];
prime.layout.RelativeLayout.prototype = {
	toCode: function(code) {
		if(!this.isEmpty()) {
			code.construct(this,[this.top,this.right,this.bottom,this.left,this.hCenter,this.vCenter]);
			if(!this.enabled) code.setProp(this,"enabled",this.enabled);
		}
	}
	,cleanUp: function() {
	}
	,isEmpty: function() {
		return (function($this) {
			var $r;
			var value = $this.top;
			$r = value == -2147483648 || value == null;
			return $r;
		}(this)) && (function($this) {
			var $r;
			var value = $this.right;
			$r = value == -2147483648 || value == null;
			return $r;
		}(this)) && (function($this) {
			var $r;
			var value = $this.bottom;
			$r = value == -2147483648 || value == null;
			return $r;
		}(this)) && (function($this) {
			var $r;
			var value = $this.left;
			$r = value == -2147483648 || value == null;
			return $r;
		}(this)) && (function($this) {
			var $r;
			var value = $this.hCenter;
			$r = value == -2147483648 || value == null;
			return $r;
		}(this)) && (function($this) {
			var $r;
			var value = $this.vCenter;
			$r = value == -2147483648 || value == null;
			return $r;
		}(this));
	}
	,toCSS: function(prefix) {
		if(prefix == null) prefix = "";
		var css = [];
		var str = "";
		if((function($this) {
			var $r;
			var value = $this.top;
			$r = value != -2147483648 && value != null;
			return $r;
		}(this))) css.push(this.top + "px"); else css.push("none");
		if((function($this) {
			var $r;
			var value = $this.right;
			$r = value != -2147483648 && value != null;
			return $r;
		}(this))) css.push(this.right + "px"); else css.push("none");
		if((function($this) {
			var $r;
			var value = $this.bottom;
			$r = value != -2147483648 && value != null;
			return $r;
		}(this))) css.push(this.bottom + "px"); else css.push("none");
		if((function($this) {
			var $r;
			var value = $this.left;
			$r = value != -2147483648 && value != null;
			return $r;
		}(this))) css.push(this.left + "px"); else css.push("none");
		str = css.join(" ");
		css = [];
		if((function($this) {
			var $r;
			var value = $this.hCenter;
			$r = value != -2147483648 && value != null;
			return $r;
		}(this))) css.push(this.hCenter + "px"); else css.push("none");
		if((function($this) {
			var $r;
			var value = $this.vCenter;
			$r = value != -2147483648 && value != null;
			return $r;
		}(this))) css.push(this.vCenter + "px"); else css.push("none");
		if(str != "") str += ", ";
		str += css.join(" ");
		return str;
	}
	,setBottom: function(v) {
		if(v != -2147483648 && v != null) this.setVCenter(-2147483648);
		if(v != this.bottom) {
			this.bottom = v;
			if(this.enabled) this.change.send();
		}
		return v;
	}
	,setTop: function(v) {
		if(v != -2147483648 && v != null) this.setVCenter(-2147483648);
		if(v != this.top) {
			this.top = v;
			if(this.enabled) this.change.send();
		}
		return v;
	}
	,setRight: function(v) {
		if(v != -2147483648 && v != null) this.setHCenter(-2147483648);
		if(v != this.right) {
			this.right = v;
			if(this.enabled) this.change.send();
		}
		return v;
	}
	,setLeft: function(v) {
		if(v != -2147483648 && v != null) this.setHCenter(-2147483648);
		if(v != this.left) {
			this.left = v;
			if(this.enabled) this.change.send();
		}
		return v;
	}
	,setVCenter: function(v) {
		if(v != -2147483648 && v != null) this.setTop((function($this) {
			var $r;
			{
			}
			if(-2147483648 != $this.bottom) {
				$this.bottom = -2147483648;
				if($this.enabled) $this.change.send();
			}
			$r = -2147483648;
			return $r;
		}(this)));
		if(v != this.vCenter) {
			this.vCenter = v;
			if(this.enabled) this.change.send();
		}
		return v;
	}
	,setHCenter: function(v) {
		if(v != -2147483648 && v != null) this.setLeft((function($this) {
			var $r;
			{
			}
			if(-2147483648 != $this.right) {
				$this.right = -2147483648;
				if($this.enabled) $this.change.send();
			}
			$r = -2147483648;
			return $r;
		}(this)));
		if(v != this.hCenter) {
			this.hCenter = v;
			if(this.enabled) this.change.send();
		}
		return v;
	}
	,getBottom: function() {
		return this.bottom;
	}
	,getTop: function() {
		return this.top;
	}
	,getRight: function() {
		return this.right;
	}
	,getLeft: function() {
		return this.left;
	}
	,clone: function() {
		return new prime.layout.RelativeLayout(this.top,this.right,this.bottom,this.left,this.hCenter,this.vCenter);
	}
	,dispose: function() {
		this.change.unbindAll();
		this.change = null;
		this._oid = 0;
	}
	,__class__: prime.layout.RelativeLayout
}
if(!prime.gui.styling) prime.gui.styling = {}
prime.gui.styling.IStyleBlock = function() { }
prime.gui.styling.IStyleBlock.__name__ = ["prime","gui","styling","IStyleBlock"];
prime.gui.styling.IStyleBlock.__interfaces__ = [prime.tools.generator.ICodeFormattable,prime.tools.generator.ICSSFormattable,prime.core.traits.IFlagOwner,prime.core.traits.IInvalidatable];
prime.gui.styling.IStyleBlock.prototype = {
	__class__: prime.gui.styling.IStyleBlock
}
prime.gui.styling.StyleBlockBase = function(filled) {
	if(filled == null) filled = 0;
	prime.core.traits.Invalidatable.call(this);
	this._oid = prime.utils.ID.next++;
	this.filledProperties = filled;
	this.inheritedProperties = 0;
	this.allFilledProperties = filled;
};
prime.gui.styling.StyleBlockBase.__name__ = ["prime","gui","styling","StyleBlockBase"];
prime.gui.styling.StyleBlockBase.__interfaces__ = [prime.gui.styling.IStyleBlock];
prime.gui.styling.StyleBlockBase.__super__ = prime.core.traits.Invalidatable;
prime.gui.styling.StyleBlockBase.prototype = $extend(prime.core.traits.Invalidatable.prototype,{
	toCode: function(code) {
		null;
	}
	,cleanUp: function() {
		null;
	}
	,toCSS: function(prefix) {
		if(prefix == null) prefix = "";
		return "";
	}
	,getPropertiesWithout: function(noExtendedStyle,noSuperStyle) {
		return 0;
	}
	,updateAllFilledPropertiesFlag: function() {
		null;
	}
	,isEmpty: function() {
		return this.filledProperties == 0;
	}
	,owns: function(propFlag) {
		return (this.filledProperties & propFlag) != 0;
	}
	,doesntHave: function(propFlag) {
		return (this.allFilledProperties & propFlag) == 0;
	}
	,has: function(propFlag) {
		return (this.allFilledProperties & propFlag) != 0;
	}
	,markProperty: function(propFlag,isSet) {
		if(isSet) this.filledProperties = (function($this) {
			var $r;
			var bits = $this.filledProperties;
			$r = bits |= propFlag;
			return $r;
		}(this)); else this.filledProperties = (function($this) {
			var $r;
			var bits = $this.filledProperties;
			$r = bits &= -1 ^ propFlag;
			return $r;
		}(this));
		if(isSet) this.allFilledProperties = (function($this) {
			var $r;
			var bits = $this.allFilledProperties;
			$r = bits |= propFlag;
			return $r;
		}(this)); else this.updateAllFilledPropertiesFlag();
	}
	,dispose: function() {
		this._oid = -1;
		this.filledProperties = 0;
		this.inheritedProperties = 0;
		this.allFilledProperties = 0;
		prime.core.traits.Invalidatable.prototype.dispose.call(this);
	}
	,__class__: prime.gui.styling.StyleBlockBase
});
prime.gui.styling.StyleSubBlock = function(filled) {
	prime.gui.styling.StyleBlockBase.call(this,filled);
};
prime.gui.styling.StyleSubBlock.__name__ = ["prime","gui","styling","StyleSubBlock"];
prime.gui.styling.StyleSubBlock.__super__ = prime.gui.styling.StyleBlockBase;
prime.gui.styling.StyleSubBlock.prototype = $extend(prime.gui.styling.StyleBlockBase.prototype,{
	invalidateCall: function(changeFromOther,sender) {
		if(sender == this.owner) {
			if(this.isPropAnStyleReference(changeFromOther)) {
				this.updateOwnerReferences(changeFromOther);
				this.updateAllFilledPropertiesFlag();
			}
		} else prime.gui.styling.StyleBlockBase.prototype.invalidateCall.call(this,changeFromOther,sender);
	}
	,isPropAnStyleReference: function(property) {
		return property == 4 || property == 2;
	}
	,updateOwnerReferences: function(changedReference) {
		null;
	}
	,setOwner: function(v) {
		if(this.owner != v) {
			if(this.owner != null) this.owner.listeners.remove(this);
			this.owner = v;
			this.updateOwnerReferences(15);
			this.updateAllFilledPropertiesFlag();
			if(this.owner != null) this.owner.listeners.add(this);
		}
		return v;
	}
	,dispose: function() {
		this.setOwner(null);
		prime.gui.styling.StyleBlockBase.prototype.dispose.call(this);
	}
	,__class__: prime.gui.styling.StyleSubBlock
});
prime.gui.styling.EffectsStyle = function(filledProps,move,resize,rotate,scale,show,hide) {
	if(filledProps == null) filledProps = 0;
	prime.gui.styling.StyleSubBlock.call(this,filledProps);
	this.setMove(move);
	this.setResize(resize);
	this.setRotate(rotate);
	this.setScale(scale);
	this.setShow(show);
	this.setHide(hide);
};
prime.gui.styling.EffectsStyle.__name__ = ["prime","gui","styling","EffectsStyle"];
prime.gui.styling.EffectsStyle.__super__ = prime.gui.styling.StyleSubBlock;
prime.gui.styling.EffectsStyle.prototype = $extend(prime.gui.styling.StyleSubBlock.prototype,{
	toCode: function(code) {
		if(!this.isEmpty()) code.construct(this,[this.filledProperties,this._move,this._resize,this._rotate,this._scale,this._show,this._hide]);
	}
	,cleanUp: function() {
		if(this._move != null) {
			this._move.cleanUp();
			if(this._move.isEmpty()) {
				this._move.dispose();
				this.setMove(null);
			}
		}
		if(this._resize != null) {
			this._resize.cleanUp();
			if(this._resize.isEmpty()) {
				this._resize.dispose();
				this.setResize(null);
			}
		}
		if(this._rotate != null) {
			this._rotate.cleanUp();
			if(this._rotate.isEmpty()) {
				this._rotate.dispose();
				this.setRotate(null);
			}
		}
		if(this._scale != null) {
			this._scale.cleanUp();
			if(this._scale.isEmpty()) {
				this._scale.dispose();
				this.setScale(null);
			}
		}
		if(this._show != null) {
			this._show.cleanUp();
			if(this._show.isEmpty()) {
				this._show.dispose();
				this.setShow(null);
			}
		}
		if(this._hide != null) {
			this._hide.cleanUp();
			if(this._hide.isEmpty()) {
				this._hide.dispose();
				this.setHide(null);
			}
		}
	}
	,toCSS: function(prefix) {
		if(prefix == null) prefix = "";
		var css = [];
		if(this._move != null) css.push("move-effect: " + this._move.toCSS(prefix));
		if(this._resize != null) css.push("resize-effect: " + this._resize.toCSS(prefix));
		if(this._rotate != null) css.push("rotate-effect: " + this._rotate.toCSS(prefix));
		if(this._scale != null) css.push("scale-effect: " + this._scale.toCSS(prefix));
		if(this._show != null) css.push("show-effect: " + this._show.toCSS(prefix));
		if(this._hide != null) css.push("hide-effect: " + this._hide.toCSS(prefix));
		if(css.length > 0) return "\n\t" + css.join(";\n\t") + ";"; else return "";
	}
	,setHide: function(v) {
		if(v != this._hide) {
			this._hide = v;
			this.markProperty(1024,v != null);
		}
		return v;
	}
	,setShow: function(v) {
		if(v != this._show) {
			this._show = v;
			this.markProperty(512,v != null);
		}
		return v;
	}
	,setScale: function(v) {
		if(v != this._scale) {
			this._scale = v;
			this.markProperty(256,v != null);
		}
		return v;
	}
	,setRotate: function(v) {
		if(v != this._rotate) {
			this._rotate = v;
			this.markProperty(16,v != null);
		}
		return v;
	}
	,setResize: function(v) {
		if(v != this._resize) {
			this._resize = v;
			this.markProperty(64,v != null);
		}
		return v;
	}
	,setMove: function(v) {
		if(v != this._move) {
			this._move = v;
			this.markProperty(32,v != null);
		}
		return v;
	}
	,getHide: function() {
		var v = this._hide;
		if(v == null && this.extendedStyle != null) v = this.extendedStyle.getHide();
		if(v == null && this.superStyle != null) v = this.superStyle.getHide();
		return v;
	}
	,getShow: function() {
		var v = this._show;
		if(v == null && this.extendedStyle != null) v = this.extendedStyle.getShow();
		if(v == null && this.superStyle != null) v = this.superStyle.getShow();
		return v;
	}
	,getScale: function() {
		var v = this._scale;
		if(v == null && this.extendedStyle != null) v = this.extendedStyle.getScale();
		if(v == null && this.superStyle != null) v = this.superStyle.getScale();
		return v;
	}
	,getRotate: function() {
		var v = this._rotate;
		if(v == null && this.extendedStyle != null) v = this.extendedStyle.getRotate();
		if(v == null && this.superStyle != null) v = this.superStyle.getRotate();
		return v;
	}
	,getResize: function() {
		var v = this._resize;
		if(v == null && this.extendedStyle != null) v = this.extendedStyle.getResize();
		if(v == null && this.superStyle != null) v = this.superStyle.getResize();
		return v;
	}
	,getMove: function() {
		var v = this._move;
		if(v == null && this.extendedStyle != null) v = this.extendedStyle.getMove();
		if(v == null && this.superStyle != null) v = this.superStyle.getMove();
		return v;
	}
	,invalidateCall: function(changeFromOther,sender) {
		if(sender == this.owner) return prime.gui.styling.StyleSubBlock.prototype.invalidateCall.call(this,changeFromOther,sender);
		if((this.filledProperties & changeFromOther) != 0) return;
		var propIsInExtended = this.extendedStyle != null && (this.extendedStyle.allFilledProperties & changeFromOther) != 0;
		var propIsInSuper = this.superStyle != null && (this.superStyle.allFilledProperties & changeFromOther) != 0;
		if(sender == this.extendedStyle) {
			if(propIsInExtended) this.allFilledProperties = (function($this) {
				var $r;
				var bits = $this.allFilledProperties;
				$r = bits |= changeFromOther;
				return $r;
			}(this)); else this.allFilledProperties = (function($this) {
				var $r;
				var bits = $this.allFilledProperties;
				$r = bits &= -1 ^ changeFromOther;
				return $r;
			}(this));
			this.invalidate(changeFromOther);
		} else if(sender == this.superStyle && !propIsInExtended) {
			if(propIsInSuper) this.allFilledProperties = (function($this) {
				var $r;
				var bits = $this.allFilledProperties;
				$r = bits |= changeFromOther;
				return $r;
			}(this)); else this.allFilledProperties = (function($this) {
				var $r;
				var bits = $this.allFilledProperties;
				$r = bits &= -1 ^ changeFromOther;
				return $r;
			}(this));
			this.invalidate(changeFromOther);
		}
		return;
	}
	,getPropertiesWithout: function(noExtendedStyle,noSuperStyle) {
		var props = this.filledProperties;
		if(!noExtendedStyle && this.extendedStyle != null) props |= this.extendedStyle.allFilledProperties;
		if(!noSuperStyle && this.superStyle != null) props |= this.superStyle.allFilledProperties;
		return props;
	}
	,updateAllFilledPropertiesFlag: function() {
		this.inheritedProperties = 0;
		if(this.extendedStyle != null) this.inheritedProperties = this.extendedStyle.allFilledProperties;
		if(this.superStyle != null) this.inheritedProperties |= this.superStyle.allFilledProperties;
		this.allFilledProperties = this.filledProperties | this.inheritedProperties;
		this.inheritedProperties = (function($this) {
			var $r;
			var bits = $this.inheritedProperties;
			$r = bits &= -1 ^ $this.filledProperties;
			return $r;
		}(this));
	}
	,updateOwnerReferences: function(changedReference) {
		if((changedReference & 4) != 0) {
			if(this.extendedStyle != null) this.extendedStyle.listeners.remove(this);
			this.extendedStyle = null;
			if(this.owner != null && this.owner.extendedStyle != null) {
				this.extendedStyle = this.owner.extendedStyle.getEffects();
				if(this.extendedStyle != null) this.extendedStyle.listeners.add(this);
			}
		}
		if((changedReference & 2) != 0) {
			if(this.superStyle != null) this.superStyle.listeners.remove(this);
			this.superStyle = null;
			if(this.owner != null && this.owner.superStyle != null) {
				this.superStyle = this.owner.superStyle.getEffects();
				if(this.superStyle != null) this.superStyle.listeners.add(this);
			}
		}
	}
	,dispose: function() {
		this._move = this._resize = this._rotate = this._scale = this._show = this._hide = null;
		this.extendedStyle = this.superStyle = null;
		prime.gui.styling.StyleSubBlock.prototype.dispose.call(this);
	}
	,__class__: prime.gui.styling.EffectsStyle
});
prime.gui.styling.FilterCollectionType = { __ename__ : ["prime","gui","styling","FilterCollectionType"], __constructs__ : ["box","background"] }
prime.gui.styling.FilterCollectionType.box = ["box",0];
prime.gui.styling.FilterCollectionType.box.toString = $estr;
prime.gui.styling.FilterCollectionType.box.__enum__ = prime.gui.styling.FilterCollectionType;
prime.gui.styling.FilterCollectionType.background = ["background",1];
prime.gui.styling.FilterCollectionType.background.toString = $estr;
prime.gui.styling.FilterCollectionType.background.__enum__ = prime.gui.styling.FilterCollectionType;
prime.gui.styling.FiltersStyle = function(filledProps,newType,shadow,bevel,blur,glow,gradientBevel,gradientGlow) {
	if(filledProps == null) filledProps = 0;
	prime.gui.styling.StyleSubBlock.call(this,filledProps);
	this.type = newType;
	this.setShadow(shadow);
	this.setBevel(bevel);
	this.setBlur(blur);
	this.setGlow(glow);
	this.setGradientBevel(gradientBevel);
	this.setGradientGlow(gradientGlow);
};
prime.gui.styling.FiltersStyle.__name__ = ["prime","gui","styling","FiltersStyle"];
prime.gui.styling.FiltersStyle.__super__ = prime.gui.styling.StyleSubBlock;
prime.gui.styling.FiltersStyle.prototype = $extend(prime.gui.styling.StyleSubBlock.prototype,{
	cleanUp: function() {
	}
	,toCode: function(code) {
		if(!this.isEmpty()) code.construct(this,[this.filledProperties,this.type,this._shadow,this._bevel,this._blur,this._glow,this._gradientBevel,this._gradientGlow]);
	}
	,toCSS: function(prefix) {
		if(prefix == null) prefix = "";
		var css = [];
		var propPrefix = this.type == prime.gui.styling.FilterCollectionType.box?"box-":"background-";
		if(this._shadow != null) css.push(propPrefix + "shadow: " + Std.string(this._shadow));
		if(this._bevel != null) css.push(propPrefix + "bevel: " + Std.string(this._bevel));
		if(this._blur != null) css.push(propPrefix + "blur: " + Std.string(this._blur));
		if(this._glow != null) css.push(propPrefix + "glow: " + Std.string(this._glow));
		if(this._gradientBevel != null) css.push(propPrefix + "gradient-bevel: " + Std.string(this._gradientBevel));
		if(this._gradientGlow != null) css.push(propPrefix + "gradient-glow: " + Std.string(this._gradientGlow));
		if(css.length > 0) return "\n\t" + css.join(";\n\t") + ";"; else return "";
	}
	,setGradientGlow: function(v) {
		if(v != this._gradientGlow) {
			this._gradientGlow = v;
			this.markProperty(32,v != null);
		}
		return v;
	}
	,setGradientBevel: function(v) {
		if(v != this._gradientBevel) {
			this._gradientBevel = v;
			this.markProperty(16,v != null);
		}
		return v;
	}
	,setGlow: function(v) {
		if(v != this._glow) {
			this._glow = v;
			this.markProperty(8,v != null);
		}
		return v;
	}
	,setBlur: function(v) {
		if(v != this._blur) {
			this._blur = v;
			this.markProperty(4,v != null);
		}
		return v;
	}
	,setBevel: function(v) {
		if(v != this._bevel) {
			this._bevel = v;
			this.markProperty(2,v != null);
		}
		return v;
	}
	,setShadow: function(v) {
		if(v != this._shadow) {
			this._shadow = v;
			this.markProperty(1,v != null);
		}
		return v;
	}
	,getGradientGlow: function() {
		var v = this._gradientGlow;
		if(v == null && (this.owner != null?this.owner.extendedStyle:null) != null) v = this.extendedStyle.getGradientGlow();
		if(v == null && (this.owner != null?this.owner.superStyle:null) != null) v = this.superStyle.getGradientGlow();
		return v;
	}
	,getGradientBevel: function() {
		var v = this._gradientBevel;
		if(v == null && (this.owner != null?this.owner.extendedStyle:null) != null) v = this.extendedStyle.getGradientBevel();
		if(v == null && (this.owner != null?this.owner.superStyle:null) != null) v = this.superStyle.getGradientBevel();
		return v;
	}
	,getGlow: function() {
		var v = this._glow;
		if(v == null && (this.owner != null?this.owner.extendedStyle:null) != null) v = this.extendedStyle.getGlow();
		if(v == null && (this.owner != null?this.owner.superStyle:null) != null) v = this.superStyle.getGlow();
		return v;
	}
	,getBlur: function() {
		var v = this._blur;
		if(v == null && (this.owner != null?this.owner.extendedStyle:null) != null) v = this.extendedStyle.getBlur();
		if(v == null && (this.owner != null?this.owner.superStyle:null) != null) v = this.superStyle.getBlur();
		return v;
	}
	,getBevel: function() {
		var v = this._bevel;
		if(v == null && (this.owner != null?this.owner.extendedStyle:null) != null) v = this.extendedStyle.getBevel();
		if(v == null && (this.owner != null?this.owner.superStyle:null) != null) v = this.superStyle.getBevel();
		return v;
	}
	,getShadow: function() {
		var v = this._shadow;
		if(v == null && (this.owner != null?this.owner.extendedStyle:null) != null) v = this.extendedStyle.getShadow();
		if(v == null && (this.owner != null?this.owner.superStyle:null) != null) v = this.superStyle.getShadow();
		return v;
	}
	,invalidateCall: function(changeFromOther,sender) {
		if(sender == this.owner) return prime.gui.styling.StyleSubBlock.prototype.invalidateCall.call(this,changeFromOther,sender);
		if((this.filledProperties & changeFromOther) != 0) return;
		var propIsInExtended = this.extendedStyle != null && (this.extendedStyle.allFilledProperties & changeFromOther) != 0;
		var propIsInSuper = this.superStyle != null && (this.superStyle.allFilledProperties & changeFromOther) != 0;
		if(sender == this.extendedStyle) {
			if(propIsInExtended) this.allFilledProperties = (function($this) {
				var $r;
				var bits = $this.allFilledProperties;
				$r = bits |= changeFromOther;
				return $r;
			}(this)); else this.allFilledProperties = (function($this) {
				var $r;
				var bits = $this.allFilledProperties;
				$r = bits &= -1 ^ changeFromOther;
				return $r;
			}(this));
			this.invalidate(changeFromOther);
		} else if(sender == this.superStyle && !propIsInExtended) {
			if(propIsInSuper) this.allFilledProperties = (function($this) {
				var $r;
				var bits = $this.allFilledProperties;
				$r = bits |= changeFromOther;
				return $r;
			}(this)); else this.allFilledProperties = (function($this) {
				var $r;
				var bits = $this.allFilledProperties;
				$r = bits &= -1 ^ changeFromOther;
				return $r;
			}(this));
			this.invalidate(changeFromOther);
		}
		return;
	}
	,getPropertiesWithout: function(noExtendedStyle,noSuperStyle) {
		var props = this.filledProperties;
		if(!noExtendedStyle && this.extendedStyle != null) props |= this.extendedStyle.allFilledProperties;
		if(!noSuperStyle && this.superStyle != null) props |= this.superStyle.allFilledProperties;
		return props;
	}
	,updateAllFilledPropertiesFlag: function() {
		this.inheritedProperties = 0;
		if(this.extendedStyle != null) this.inheritedProperties = this.extendedStyle.allFilledProperties;
		if(this.superStyle != null) this.inheritedProperties |= this.superStyle.allFilledProperties;
		this.allFilledProperties = this.filledProperties | this.inheritedProperties;
		this.inheritedProperties = (function($this) {
			var $r;
			var bits = $this.inheritedProperties;
			$r = bits &= -1 ^ $this.filledProperties;
			return $r;
		}(this));
	}
	,updateOwnerReferences: function(changedReference) {
		if((changedReference & 4) != 0) {
			if(this.extendedStyle != null) this.extendedStyle.listeners.remove(this);
			this.extendedStyle = null;
			if(this.owner != null && this.owner.extendedStyle != null) {
				this.extendedStyle = this.type == prime.gui.styling.FilterCollectionType.box?this.owner.extendedStyle.getBoxFilters():this.owner.extendedStyle.getBgFilters();
				if(this.extendedStyle != null) this.extendedStyle.listeners.add(this);
			}
		}
		if((changedReference & 2) != 0) {
			if(this.superStyle != null) this.superStyle.listeners.remove(this);
			this.superStyle = null;
			if(this.owner != null && this.owner.superStyle != null) {
				this.superStyle = this.type == prime.gui.styling.FilterCollectionType.box?this.owner.superStyle.getBoxFilters():this.owner.superStyle.getBgFilters();
				if(this.superStyle != null) this.superStyle.listeners.add(this);
			}
		}
	}
	,dispose: function() {
		this._shadow = this._bevel = this._blur = this._glow = this._gradientBevel = this._gradientGlow = null;
		prime.gui.styling.StyleSubBlock.prototype.dispose.call(this);
	}
	,__class__: prime.gui.styling.FiltersStyle
});
prime.gui.styling.GraphicsStyle = function(filledProps,background,border,shape,skin,overflow,visible,opacity,icon,iconFill,borderRadius) {
	if(opacity == null) opacity = -2147483648;
	if(filledProps == null) filledProps = 0;
	prime.gui.styling.StyleSubBlock.call(this,filledProps);
	this.setShape(shape);
	this.setBackground(background);
	this.setBorder(border);
	this.setSkin(skin);
	this.setVisible(visible);
	this.setOpacity(opacity != -2147483648?opacity:prime.types.Number.FLOAT_NOT_SET);
	this.setIcon(icon);
	this.setIconFill(iconFill);
	this.setOverflow(overflow);
	this.setBorderRadius(borderRadius);
};
prime.gui.styling.GraphicsStyle.__name__ = ["prime","gui","styling","GraphicsStyle"];
prime.gui.styling.GraphicsStyle.__super__ = prime.gui.styling.StyleSubBlock;
prime.gui.styling.GraphicsStyle.prototype = $extend(prime.gui.styling.StyleSubBlock.prototype,{
	cleanUp: function() {
		if(this._background != null) {
			this._background.cleanUp();
			if(this._background.isEmpty()) {
				this._background.dispose();
				this.setBackground(null);
			}
		}
		if(this._iconFill != null) {
			this._iconFill.cleanUp();
			if(this._iconFill.isEmpty()) {
				this._iconFill.dispose();
				this.setIconFill(null);
			}
		}
		if(this._border != null) {
			this._border.cleanUp();
			if(this._border.isEmpty()) {
				this._border.dispose();
				this.setBorder(null);
			}
		}
	}
	,toCode: function(code) {
		if(!this.isEmpty()) code.construct(this,[this.filledProperties,this._background,this._border,this._shape,this._skin,this._overflow,this._visible,this._opacity,this._icon,this._iconFill,this._borderRadius]);
	}
	,toCSS: function(prefix) {
		if(prefix == null) prefix = "";
		var css = [];
		if(this._skin != null) css.push("skin: " + this._skin.toCSS());
		if(this._shape != null) css.push("shape: " + (function($this) {
			var $r;
			var $e = ($this._shape);
			switch( $e[1] ) {
			case 3:
				var css1 = $e[3], name = $e[2];
				$r = css1 != null?css1:"Class( " + name + " )";
				break;
			case 1:
				var factory = $e[2];
				$r = factory.toCSS();
				break;
			case 2:
				var css1 = $e[4], p = $e[3], name = $e[2];
				$r = css1 != null?css1:name;
				break;
			case 0:
				var css1 = $e[3], name = $e[2];
				$r = css1 != null?css1:"unkown-function";
				break;
			}
			return $r;
		}(this)));
		if(this._background != null) css.push("background: " + this._background.toCSS());
		if(this._border != null) css.push("border: " + this._border.toCSS());
		if(this._visible != null) css.push("visability: " + Std.string(this._visible));
		if((function($this) {
			var $r;
			var value = $this._opacity;
			$r = value != null && value == value;
			return $r;
		}(this))) css.push("opacity: " + this._opacity);
		if(this._icon != null) css.push("icon: " + Std.string(this._icon));
		if(this._iconFill != null) css.push("icon-fill: " + Std.string(this._iconFill));
		if(this._overflow != null) css.push("overflow: " + this._overflow.toCSS());
		if(this._borderRadius != null) css.push("border-radius: " + Std.string(this._borderRadius));
		if(css.length > 0) return "\n\t" + css.join(";\n\t") + ";"; else return "";
	}
	,setBorderRadius: function(v) {
		if(v != this._borderRadius) {
			this._borderRadius = v;
			this.markProperty(256,v != null);
		}
		return v;
	}
	,setOverflow: function(v) {
		if(v != this._overflow) {
			this._overflow = v;
			this.markProperty(128,v != null);
		}
		return v;
	}
	,setIconFill: function(v) {
		if(v != this._iconFill) {
			this._iconFill = v;
			this.markProperty(512,v != null);
		}
		return v;
	}
	,setIcon: function(v) {
		if(v != this._icon) {
			this._icon = v;
			this.markProperty(64,v != null);
		}
		return v;
	}
	,setOpacity: function(v) {
		if(v != this._opacity) {
			this._opacity = v;
			this.markProperty(32,v != null && v == v);
		}
		return v;
	}
	,setVisible: function(v) {
		if(v != this._visible) {
			this._visible = v;
			this.markProperty(16,v != null);
		}
		return v;
	}
	,setBorder: function(v) {
		if(v != this._border) {
			this._border = v;
			this.markProperty(4,v != null);
		}
		return v;
	}
	,setBackground: function(v) {
		if(v != this._background) {
			this._background = v;
			this.markProperty(2,v != null);
		}
		return v;
	}
	,setShape: function(v) {
		if(v != this._shape) {
			this._shape = v;
			this.markProperty(8,v != null);
		}
		return v;
	}
	,setSkin: function(v) {
		if(v != this._skin) {
			this._skin = v;
			this.markProperty(1,v != null);
		}
		return v;
	}
	,getBorderRadius: function() {
		var v = this._borderRadius;
		if(v == null && this.extendedStyle != null) v = this.extendedStyle.getBorderRadius();
		if(v == null && this.superStyle != null) v = this.superStyle.getBorderRadius();
		return v;
	}
	,getOverflow: function() {
		var v = null;
		if((this.filledProperties & 128) != 0) v = this._overflow; else if(this.extendedStyle != null) v = this.extendedStyle.getOverflow(); else if(v == null && this.superStyle != null) v = this.superStyle.getOverflow();
		return v;
	}
	,getIconFill: function() {
		var v = this._iconFill;
		if(v == null && this.extendedStyle != null) v = this.extendedStyle.getIconFill();
		if(v == null && this.superStyle != null) v = this.superStyle.getIconFill();
		return v;
	}
	,getIcon: function() {
		var v = this._icon;
		if(v == null && this.extendedStyle != null) v = this.extendedStyle.getIcon();
		if(v == null && this.superStyle != null) v = this.superStyle.getIcon();
		return v;
	}
	,getOpacity: function() {
		var v = this._opacity;
		if(!(v != null && v == v) && this.extendedStyle != null) v = this.extendedStyle.getOpacity();
		if(!(v != null && v == v) && this.superStyle != null) v = this.superStyle.getOpacity();
		return v;
	}
	,getVisible: function() {
		var v = this._visible;
		if(v == null && this.extendedStyle != null) v = this.extendedStyle.getVisible();
		if(v == null && this.superStyle != null) v = this.superStyle.getVisible();
		return v;
	}
	,getBorder: function() {
		var v = this._border;
		if(v == null && this.extendedStyle != null) v = this.extendedStyle.getBorder();
		if(v == null && this.superStyle != null) v = this.superStyle.getBorder();
		return v;
	}
	,getBackground: function() {
		var v = this._background;
		if(v == null && this.extendedStyle != null) v = this.extendedStyle.getBackground();
		if(v == null && this.superStyle != null) v = this.superStyle.getBackground();
		return v;
	}
	,getShape: function() {
		var v = this._shape;
		if(v == null && this.extendedStyle != null) v = this.extendedStyle.getShape();
		if(v == null && this.superStyle != null) v = this.superStyle.getShape();
		return v;
	}
	,getSkin: function() {
		var v = null;
		if((this.filledProperties & 1) != 0) v = this._skin; else if(this.extendedStyle != null) v = this.extendedStyle.getSkin(); else if(v == null && this.superStyle != null) v = this.superStyle.getSkin();
		return v;
	}
	,invalidateCall: function(changeFromOther,sender) {
		if(sender == this.owner) return prime.gui.styling.StyleSubBlock.prototype.invalidateCall.call(this,changeFromOther,sender);
		if((this.filledProperties & changeFromOther) != 0) return;
		var propIsInExtended = this.extendedStyle != null && (this.extendedStyle.allFilledProperties & changeFromOther) != 0;
		var propIsInSuper = this.superStyle != null && (this.superStyle.allFilledProperties & changeFromOther) != 0;
		if(sender == this.extendedStyle) {
			if(propIsInExtended) this.allFilledProperties = (function($this) {
				var $r;
				var bits = $this.allFilledProperties;
				$r = bits |= changeFromOther;
				return $r;
			}(this)); else this.allFilledProperties = (function($this) {
				var $r;
				var bits = $this.allFilledProperties;
				$r = bits &= -1 ^ changeFromOther;
				return $r;
			}(this));
			this.invalidate(changeFromOther);
		} else if(sender == this.superStyle && !propIsInExtended) {
			if(propIsInSuper) this.allFilledProperties = (function($this) {
				var $r;
				var bits = $this.allFilledProperties;
				$r = bits |= changeFromOther;
				return $r;
			}(this)); else this.allFilledProperties = (function($this) {
				var $r;
				var bits = $this.allFilledProperties;
				$r = bits &= -1 ^ changeFromOther;
				return $r;
			}(this));
			this.invalidate(changeFromOther);
		}
		return;
	}
	,getPropertiesWithout: function(noExtendedStyle,noSuperStyle) {
		var props = this.filledProperties;
		if(!noExtendedStyle && this.extendedStyle != null) props |= this.extendedStyle.allFilledProperties;
		if(!noSuperStyle && this.superStyle != null) props |= this.superStyle.allFilledProperties;
		return props;
	}
	,updateAllFilledPropertiesFlag: function() {
		this.inheritedProperties = 0;
		if(this.extendedStyle != null) this.inheritedProperties = this.extendedStyle.allFilledProperties;
		if(this.superStyle != null) this.inheritedProperties |= this.superStyle.allFilledProperties;
		this.allFilledProperties = this.filledProperties | this.inheritedProperties;
		this.inheritedProperties = (function($this) {
			var $r;
			var bits = $this.inheritedProperties;
			$r = bits &= -1 ^ $this.filledProperties;
			return $r;
		}(this));
	}
	,updateOwnerReferences: function(changedReference) {
		if((changedReference & 4) != 0) {
			if(this.extendedStyle != null) this.extendedStyle.listeners.remove(this);
			this.extendedStyle = null;
			if(this.owner != null && this.owner.extendedStyle != null) {
				this.extendedStyle = this.owner.extendedStyle.getGraphics();
				if(this.extendedStyle != null) this.extendedStyle.listeners.add(this);
			}
		}
		if((changedReference & 2) != 0) {
			if(this.superStyle != null) this.superStyle.listeners.remove(this);
			this.superStyle = null;
			if(this.owner != null && this.owner.superStyle != null) {
				this.superStyle = this.owner.superStyle.getGraphics();
				if(this.superStyle != null) this.superStyle.listeners.add(this);
			}
		}
	}
	,dispose: function() {
		this.extendedStyle = this.superStyle = null;
		if(this._background != null) this._background.dispose();
		if(this._border != null) this._border.dispose();
		if(this._iconFill != null) this._iconFill.dispose();
		if(this.iconAsset != null) this.iconAsset.dispose();
		this._skin = null;
		this._shape = null;
		this._background = null;
		this._border = null;
		this._icon = null;
		this._iconFill = null;
		this._overflow = null;
		this._visible = null;
		this._borderRadius = null;
		this._opacity = prime.types.Number.FLOAT_NOT_SET;
		prime.gui.styling.StyleSubBlock.prototype.dispose.call(this);
	}
	,__class__: prime.gui.styling.GraphicsStyle
});
prime.gui.styling.LayoutStyle = function(filledProps,rel,padding,margin,alg,percentW,percentH,width,height,childWidth,childHeight,rotation,include,maintainAspect,minWidth,maxWidth,minHeight,maxHeight,percentMinWidth,percentMaxWidth,percentMinHeight,percentMaxHeight) {
	if(percentMaxHeight == null) percentMaxHeight = -2147483648;
	if(percentMinHeight == null) percentMinHeight = -2147483648;
	if(percentMaxWidth == null) percentMaxWidth = -2147483648;
	if(percentMinWidth == null) percentMinWidth = -2147483648;
	if(maxHeight == null) maxHeight = -2147483648;
	if(minHeight == null) minHeight = -2147483648;
	if(maxWidth == null) maxWidth = -2147483648;
	if(minWidth == null) minWidth = -2147483648;
	if(rotation == null) rotation = -2147483648;
	if(childHeight == null) childHeight = -2147483648;
	if(childWidth == null) childWidth = -2147483648;
	if(height == null) height = -2147483648;
	if(width == null) width = -2147483648;
	if(percentH == null) percentH = -2147483648;
	if(percentW == null) percentW = -2147483648;
	if(filledProps == null) filledProps = 0;
	prime.gui.styling.StyleSubBlock.call(this,filledProps);
	this.setRelative(rel);
	this.setAlgorithm(alg);
	this.setPadding(padding);
	this.setMargin(margin);
	this.setPercentWidth(percentW == -2147483648?prime.types.Number.FLOAT_NOT_SET:percentW);
	this.setPercentHeight(percentH == -2147483648?prime.types.Number.FLOAT_NOT_SET:percentH);
	this.setWidth(width);
	this.setHeight(height);
	this.setChildWidth(childWidth);
	this.setChildHeight(childHeight);
	this.setRotation(rotation == -2147483648?prime.types.Number.FLOAT_NOT_SET:rotation);
	this.setMaintainAspect(maintainAspect);
	this.setIncludeInLayout(include);
	this.setMinWidth(minWidth);
	this.setMinHeight(minHeight);
	this.setMaxWidth(maxWidth);
	this.setMaxHeight(maxHeight);
	this.setPercentMinWidth(percentMinWidth == -2147483648?prime.types.Number.FLOAT_NOT_SET:percentMinWidth);
	this.setPercentMaxWidth(percentMaxWidth == -2147483648?prime.types.Number.FLOAT_NOT_SET:percentMaxWidth);
	this.setPercentMinHeight(percentMinHeight == -2147483648?prime.types.Number.FLOAT_NOT_SET:percentMinHeight);
	this.setPercentMaxHeight(percentMaxHeight == -2147483648?prime.types.Number.FLOAT_NOT_SET:percentMaxHeight);
};
prime.gui.styling.LayoutStyle.__name__ = ["prime","gui","styling","LayoutStyle"];
prime.gui.styling.LayoutStyle.__super__ = prime.gui.styling.StyleSubBlock;
prime.gui.styling.LayoutStyle.prototype = $extend(prime.gui.styling.StyleSubBlock.prototype,{
	cleanUp: function() {
		if(this._relative != null) {
			this._relative.cleanUp();
			if(this._relative.isEmpty()) {
				this._relative.dispose();
				this.setRelative(null);
			}
		}
		if(this._padding != null) {
			this._padding.cleanUp();
			if(this._padding.isEmpty()) this.setPadding(null);
		}
		if(this._margin != null) {
			this._margin.cleanUp();
			if(this._margin.isEmpty()) this.setMargin(null);
		}
		if(this._algorithm != null) {
			this._algorithm.cleanUp();
			if(this._algorithm.isEmpty()) {
				this._algorithm.dispose();
				this.setAlgorithm(null);
			}
		}
	}
	,toCode: function(code) {
		if(!this.isEmpty()) code.construct(this,[this.filledProperties,this._relative,this._padding,this._margin,this._algorithm,this._percentWidth,this._percentHeight,this._width,this._height,this._childWidth,this._childHeight,this._rotation,this._includeInLayout,this._maintainAspectRatio,this._minWidth,this._maxWidth,this._minHeight,this._maxHeight,this._percentMinWidth,this._percentMaxWidth,this._percentMinHeight,this._percentMaxHeight]);
	}
	,toCSS: function(prefix) {
		if(prefix == null) prefix = "";
		var css = [];
		if(this._padding != null) css.push("padding: " + this._padding.toCSS());
		if(this._margin != null) css.push("margin: " + this._margin.toCSS());
		if(this._relative != null) css.push("relative: " + this._relative.toCSS());
		if((function($this) {
			var $r;
			var value = $this._width;
			$r = value != -2147483648 && value != null;
			return $r;
		}(this))) css.push("width: " + this._width + "px");
		if((function($this) {
			var $r;
			var value = $this._percentWidth;
			$r = value != null && value == value;
			return $r;
		}(this))) {
			if(this._percentWidth == -2147483644) css.push("width: auto"); else css.push("width: " + this._percentWidth * 100 + "%");
		}
		if((function($this) {
			var $r;
			var value = $this._minWidth;
			$r = value != -2147483648 && value != null;
			return $r;
		}(this))) css.push("min-width: " + this._minWidth + "px");
		if((function($this) {
			var $r;
			var value = $this._maxWidth;
			$r = value != -2147483648 && value != null;
			return $r;
		}(this))) css.push("max-width: " + this._maxWidth + "px");
		if((function($this) {
			var $r;
			var value = $this._percentMinWidth;
			$r = value != null && value == value;
			return $r;
		}(this))) css.push("percent-min-width: " + this._percentMinWidth * 100 + "%");
		if((function($this) {
			var $r;
			var value = $this._percentMaxWidth;
			$r = value != null && value == value;
			return $r;
		}(this))) css.push("percent-max-width: " + this._percentMaxWidth * 100 + "%");
		if((function($this) {
			var $r;
			var value = $this._height;
			$r = value != -2147483648 && value != null;
			return $r;
		}(this))) css.push("height: " + this._height + "px");
		if((function($this) {
			var $r;
			var value = $this._percentHeight;
			$r = value != null && value == value;
			return $r;
		}(this))) {
			if(this._percentHeight == -2147483644) css.push("height: auto"); else css.push("hieght: " + this._percentHeight * 100 + "%");
		}
		if((function($this) {
			var $r;
			var value = $this._minHeight;
			$r = value != -2147483648 && value != null;
			return $r;
		}(this))) css.push("min-height: " + this._minHeight + "px");
		if((function($this) {
			var $r;
			var value = $this._maxHeight;
			$r = value != -2147483648 && value != null;
			return $r;
		}(this))) css.push("max-height: " + this._maxHeight + "px");
		if((function($this) {
			var $r;
			var value = $this._percentMinHeight;
			$r = value != null && value == value;
			return $r;
		}(this))) css.push("percent-min-height: " + this._percentMinHeight * 100 + "%");
		if((function($this) {
			var $r;
			var value = $this._percentMaxHeight;
			$r = value != null && value == value;
			return $r;
		}(this))) css.push("percent-max-height: " + this._percentMaxHeight * 100 + "%");
		if((function($this) {
			var $r;
			var value = $this._childWidth;
			$r = value != -2147483648 && value != null;
			return $r;
		}(this))) css.push("child-width: " + this._childWidth + "px");
		if((function($this) {
			var $r;
			var value = $this._childHeight;
			$r = value != -2147483648 && value != null;
			return $r;
		}(this))) css.push("child-height: " + this._childHeight + "px");
		if((function($this) {
			var $r;
			var value = $this._rotation;
			$r = value != null && value == value;
			return $r;
		}(this))) css.push("rotation: " + this._rotation + "degr");
		if(this._includeInLayout != null) css.push("position: " + (this._maintainAspectRatio?"relative":"absolute"));
		if(this._maintainAspectRatio != null) css.push("maintainAspectRatio: " + (this._maintainAspectRatio?"true":"false"));
		if(css.length > 0) return "\n\t" + css.join(";\n\t") + ";"; else return "";
	}
	,setPercentMinWidth: function(v) {
		if(v != this._percentMinWidth) {
			this._percentMinWidth = v;
			this.markProperty(65536,v != null && v == v);
		}
		return v;
	}
	,setPercentMaxWidth: function(v) {
		if(v != this._percentMaxWidth) {
			this._percentMaxWidth = v;
			this.markProperty(131072,v != null && v == v);
		}
		return v;
	}
	,setPercentMinHeight: function(v) {
		if(v != this._percentMinHeight) {
			this._percentMinHeight = v;
			this.markProperty(262144,v != null && v == v);
		}
		return v;
	}
	,setPercentMaxHeight: function(v) {
		if(v != this._percentMaxHeight) {
			this._percentMaxHeight = v;
			this.markProperty(524288,v != null && v == v);
		}
		return v;
	}
	,setMaintainAspect: function(v) {
		if(v != this._maintainAspectRatio) {
			this._maintainAspectRatio = v;
			this.markProperty(1024,v != null);
		}
		return v;
	}
	,setIncludeInLayout: function(v) {
		if(v != this._includeInLayout) {
			this._includeInLayout = v;
			this.markProperty(1048576,v != null);
		}
		return v;
	}
	,setRotation: function(v) {
		if(v != this._rotation) {
			this._rotation = v;
			this.markProperty(2048,v != null && v == v);
		}
		return v;
	}
	,setChildHeight: function(v) {
		if(v != this._childHeight) {
			this._childHeight = v;
			this.markProperty(32768,v != -2147483648 && v != null);
		}
		return v;
	}
	,setChildWidth: function(v) {
		if(v != this._childWidth) {
			this._childWidth = v;
			this.markProperty(16384,v != -2147483648 && v != null);
		}
		return v;
	}
	,setPercentHeight: function(v) {
		if(v != this._percentHeight) {
			this._percentHeight = v;
			this.markProperty(512,v != null && v == v);
		}
		return v;
	}
	,setMinHeight: function(v) {
		if(v != this._minHeight) {
			this._minHeight = v;
			this.markProperty(128,v != -2147483648 && v != null);
		}
		return v;
	}
	,setMaxHeight: function(v) {
		if(v != this._maxHeight) {
			this._maxHeight = v;
			this.markProperty(64,v != -2147483648 && v != null);
		}
		return v;
	}
	,setHeight: function(v) {
		if(v != this._height) {
			this._height = v;
			this.markProperty(2,v != -2147483648 && v != null);
		}
		return v;
	}
	,setPercentWidth: function(v) {
		if(v != this._percentWidth) {
			this._percentWidth = v;
			this.markProperty(256,v != null && v == v);
		}
		return v;
	}
	,setMinWidth: function(v) {
		if(v != this._minWidth) {
			this._minWidth = v;
			this.markProperty(32,v != -2147483648 && v != null);
		}
		return v;
	}
	,setMaxWidth: function(v) {
		if(v != this._maxWidth) {
			this._maxWidth = v;
			this.markProperty(16,v != -2147483648 && v != null);
		}
		return v;
	}
	,setWidth: function(v) {
		if(v != this._width) {
			this._width = v;
			this.markProperty(1,v != -2147483648 && v != null);
		}
		return v;
	}
	,setMargin: function(v) {
		if(v != this._margin) {
			this._margin = v;
			this.markProperty(4096,v != null);
		}
		return v;
	}
	,setPadding: function(v) {
		if(v != this._padding) {
			this._padding = v;
			this.markProperty(8192,v != null);
		}
		return v;
	}
	,setAlgorithm: function(v) {
		if(v != this._algorithm) {
			this._algorithm = v;
			this.markProperty(8,v != null);
		}
		return v;
	}
	,setRelative: function(v) {
		if(v != this._relative) {
			this._relative = v;
			this.markProperty(4,v != null);
		}
		return v;
	}
	,getPercentMaxHeight: function() {
		var v = this._percentMaxHeight;
		if(!(v != null && v == v) && this.extendedStyle != null) v = this.extendedStyle.getPercentMaxHeight();
		if(!(v != null && v == v) && this.superStyle != null) v = this.superStyle.getPercentMaxHeight();
		return v;
	}
	,getPercentMinHeight: function() {
		var v = this._percentMinHeight;
		if(!(v != null && v == v) && this.extendedStyle != null) v = this.extendedStyle.getPercentMinHeight();
		if(!(v != null && v == v) && this.superStyle != null) v = this.superStyle.getPercentMinHeight();
		return v;
	}
	,getPercentMaxWidth: function() {
		var v = this._percentMaxWidth;
		if(!(v != null && v == v) && this.extendedStyle != null) v = this.extendedStyle.getPercentMaxWidth();
		if(!(v != null && v == v) && this.superStyle != null) v = this.superStyle.getPercentMaxWidth();
		return v;
	}
	,getPercentMinWidth: function() {
		var v = this._percentMinWidth;
		if(!(v != null && v == v) && this.extendedStyle != null) v = this.extendedStyle.getPercentMinWidth();
		if(!(v != null && v == v) && this.superStyle != null) v = this.superStyle.getPercentMinWidth();
		return v;
	}
	,getMaintainAspect: function() {
		var v = this._maintainAspectRatio;
		if(v == null && this.extendedStyle != null) v = this.extendedStyle.getMaintainAspect();
		if(v == null && this.superStyle != null) v = this.superStyle.getMaintainAspect();
		return v;
	}
	,getIncludeInLayout: function() {
		var v = this._includeInLayout;
		if(v == null && this.extendedStyle != null) v = this.extendedStyle.getIncludeInLayout();
		if(v == null && this.superStyle != null) v = this.superStyle.getIncludeInLayout();
		return v;
	}
	,getRotation: function() {
		var v = this._rotation;
		if(!(v != null && v == v) && this.extendedStyle != null) v = this.extendedStyle.getRotation();
		if(!(v != null && v == v) && this.superStyle != null) v = this.superStyle.getRotation();
		return v;
	}
	,getChildHeight: function() {
		var v = this._childHeight;
		if((v == -2147483648 || v == null) && this.extendedStyle != null) v = this.extendedStyle.getChildHeight();
		if((v == -2147483648 || v == null) && this.superStyle != null) v = this.superStyle.getChildHeight();
		return v;
	}
	,getChildWidth: function() {
		var v = this._childWidth;
		if((v == -2147483648 || v == null) && this.extendedStyle != null) v = this.extendedStyle.getChildWidth();
		if((v == -2147483648 || v == null) && this.superStyle != null) v = this.superStyle.getChildWidth();
		return v;
	}
	,getPercentHeight: function() {
		var v = this._percentHeight;
		if(!(v != null && v == v) && this.extendedStyle != null) v = this.extendedStyle.getPercentHeight();
		if(!(v != null && v == v) && this.superStyle != null) v = this.superStyle.getPercentHeight();
		return v;
	}
	,getMinHeight: function() {
		var v = this._minHeight;
		if((v == -2147483648 || v == null) && this.extendedStyle != null) v = this.extendedStyle.getMinHeight();
		if((v == -2147483648 || v == null) && this.superStyle != null) v = this.superStyle.getMinHeight();
		return v;
	}
	,getMaxHeight: function() {
		var v = this._maxHeight;
		if((v == -2147483648 || v == null) && this.extendedStyle != null) v = this.extendedStyle.getMaxHeight();
		if((v == -2147483648 || v == null) && this.superStyle != null) v = this.superStyle.getMaxHeight();
		return v;
	}
	,getHeight: function() {
		var v = this._height;
		if((v == -2147483648 || v == null) && this.extendedStyle != null) v = this.extendedStyle.getHeight();
		if((v == -2147483648 || v == null) && this.superStyle != null) v = this.superStyle.getHeight();
		return v;
	}
	,getPercentWidth: function() {
		var v = this._percentWidth;
		if(!(v != null && v == v) && this.extendedStyle != null) v = this.extendedStyle.getPercentWidth();
		if(!(v != null && v == v) && this.superStyle != null) v = this.superStyle.getPercentWidth();
		return v;
	}
	,getMinWidth: function() {
		var v = this._minWidth;
		if((v == -2147483648 || v == null) && this.extendedStyle != null) v = this.extendedStyle.getMinWidth();
		if((v == -2147483648 || v == null) && this.superStyle != null) v = this.superStyle.getMinWidth();
		return v;
	}
	,getMaxWidth: function() {
		var v = this._maxWidth;
		if((v == -2147483648 || v == null) && this.extendedStyle != null) v = this.extendedStyle.getMaxWidth();
		if((v == -2147483648 || v == null) && this.superStyle != null) v = this.superStyle.getMaxWidth();
		return v;
	}
	,getWidth: function() {
		var v = this._width;
		if((v == -2147483648 || v == null) && this.extendedStyle != null) v = this.extendedStyle.getWidth();
		if((v == -2147483648 || v == null) && this.superStyle != null) v = this.superStyle.getWidth();
		return v;
	}
	,getMargin: function() {
		var v = this._margin;
		if(v == null && this.extendedStyle != null) v = this.extendedStyle.getMargin();
		if(v == null && this.superStyle != null) v = this.superStyle.getMargin();
		return v;
	}
	,getPadding: function() {
		var v = this._padding;
		if(v == null && this.extendedStyle != null) v = this.extendedStyle.getPadding();
		if(v == null && this.superStyle != null) v = this.superStyle.getPadding();
		return v;
	}
	,getAlgorithm: function() {
		var v = null;
		if((this.filledProperties & 8) != 0) v = this._algorithm; else if(this.extendedStyle != null) v = this.extendedStyle.getAlgorithm(); else if(v == null && this.superStyle != null) v = this.superStyle.getAlgorithm();
		return v;
	}
	,getRelative: function() {
		var v = this._relative;
		if(v == null && this.extendedStyle != null) v = this.extendedStyle.getRelative();
		if(v == null && this.superStyle != null) v = this.superStyle.getRelative();
		return v;
	}
	,invalidateCall: function(changeFromOther,sender) {
		if(sender == this.owner) return prime.gui.styling.StyleSubBlock.prototype.invalidateCall.call(this,changeFromOther,sender);
		if((this.filledProperties & changeFromOther) != 0) return;
		var propIsInExtended = this.extendedStyle != null && (this.extendedStyle.allFilledProperties & changeFromOther) != 0;
		var propIsInSuper = this.superStyle != null && (this.superStyle.allFilledProperties & changeFromOther) != 0;
		if(sender == this.extendedStyle) {
			if(propIsInExtended) this.allFilledProperties = (function($this) {
				var $r;
				var bits = $this.allFilledProperties;
				$r = bits |= changeFromOther;
				return $r;
			}(this)); else this.allFilledProperties = (function($this) {
				var $r;
				var bits = $this.allFilledProperties;
				$r = bits &= -1 ^ changeFromOther;
				return $r;
			}(this));
			this.invalidate(changeFromOther);
		} else if(sender == this.superStyle && !propIsInExtended) {
			if(propIsInSuper) this.allFilledProperties = (function($this) {
				var $r;
				var bits = $this.allFilledProperties;
				$r = bits |= changeFromOther;
				return $r;
			}(this)); else this.allFilledProperties = (function($this) {
				var $r;
				var bits = $this.allFilledProperties;
				$r = bits &= -1 ^ changeFromOther;
				return $r;
			}(this));
			this.invalidate(changeFromOther);
		}
		return;
	}
	,getPropertiesWithout: function(noExtendedStyle,noSuperStyle) {
		var props = this.filledProperties;
		if(!noExtendedStyle && this.extendedStyle != null) props |= this.extendedStyle.allFilledProperties;
		if(!noSuperStyle && this.superStyle != null) props |= this.superStyle.allFilledProperties;
		return props;
	}
	,updateAllFilledPropertiesFlag: function() {
		this.inheritedProperties = 0;
		if(this.extendedStyle != null) this.inheritedProperties = this.extendedStyle.allFilledProperties;
		if(this.superStyle != null) this.inheritedProperties |= this.superStyle.allFilledProperties;
		this.allFilledProperties = this.filledProperties | this.inheritedProperties;
		this.inheritedProperties = (function($this) {
			var $r;
			var bits = $this.inheritedProperties;
			$r = bits &= -1 ^ $this.filledProperties;
			return $r;
		}(this));
	}
	,updateOwnerReferences: function(changedReference) {
		if((changedReference & 4) != 0) {
			if(this.extendedStyle != null) this.extendedStyle.listeners.remove(this);
			this.extendedStyle = null;
			if(this.owner != null && this.owner.extendedStyle != null) {
				this.extendedStyle = this.owner.extendedStyle.getLayout();
				if(this.extendedStyle != null) this.extendedStyle.listeners.add(this);
			}
		}
		if((changedReference & 2) != 0) {
			if(this.superStyle != null) this.superStyle.listeners.remove(this);
			this.superStyle = null;
			if(this.owner != null && this.owner.superStyle != null) {
				this.superStyle = this.owner.superStyle.getLayout();
				if(this.superStyle != null) this.superStyle.listeners.add(this);
			}
		}
	}
	,dispose: function() {
		if(this._relative != null) this._relative.dispose();
		this._maintainAspectRatio = null;
		this._includeInLayout = null;
		this._relative = null;
		this._algorithm = null;
		this._padding = null;
		this._margin = null;
		this._percentWidth = prime.types.Number.FLOAT_NOT_SET;
		this._percentHeight = prime.types.Number.FLOAT_NOT_SET;
		this._width = -2147483648;
		this._height = -2147483648;
		this._childWidth = -2147483648;
		this._childHeight = -2147483648;
		this._rotation = prime.types.Number.FLOAT_NOT_SET;
		this._minWidth = -2147483648;
		this._minHeight = -2147483648;
		this._maxWidth = -2147483648;
		this._maxHeight = -2147483648;
		this._percentMinWidth = prime.types.Number.FLOAT_NOT_SET;
		this._percentMaxWidth = prime.types.Number.FLOAT_NOT_SET;
		this._percentMinHeight = prime.types.Number.FLOAT_NOT_SET;
		this._percentMaxHeight = prime.types.Number.FLOAT_NOT_SET;
		prime.gui.styling.StyleSubBlock.prototype.dispose.call(this);
	}
	,__class__: prime.gui.styling.LayoutStyle
});
prime.gui.styling.StatesStyle = function(filledProps,states) {
	if(filledProps == null) filledProps = 0;
	prime.gui.styling.StyleSubBlock.call(this,filledProps);
	this.states = states;
	this.updateFilledPropertiesFlag();
	this.updateAllFilledPropertiesFlag();
};
prime.gui.styling.StatesStyle.__name__ = ["prime","gui","styling","StatesStyle"];
prime.gui.styling.StatesStyle.__super__ = prime.gui.styling.StyleSubBlock;
prime.gui.styling.StatesStyle.prototype = $extend(prime.gui.styling.StyleSubBlock.prototype,{
	toCode: function(code) {
		if(!this.isEmpty()) code.construct(this,[this.filledProperties,this.states]);
	}
	,cleanUp: function() {
		if(!this.isEmpty()) {
			this.states.cleanUp();
			this.updateFilledPropertiesFlag();
			this.updateAllFilledPropertiesFlag();
		}
	}
	,toCSS: function(prefix) {
		if(prefix == null) prefix = "";
		var css = [];
		if(!this.isEmpty()) {
			var stateNames = new prime.bindable.collections.iterators.FastArrayForwardIterator(this.states._keys);
			while( stateNames.hasNext() ) {
				var stateName = stateNames.next();
				var state = this.states.get(stateName);
				if(state != null) css.push(state.toCSS(prefix + ":" + prime.gui.styling.StyleStateFlags.stateToString(stateName)));
			}
		}
		if(css.length > 0) return "\n" + css.join("\n"); else return "";
	}
	,keys: function() {
		return this.states != null?new prime.bindable.collections.iterators.FastArrayForwardIterator(this.states._keys):null;
	}
	,get: function(stateName) {
		if((this.allFilledProperties & stateName) == 0) return null;
		var v = null;
		if((this.filledProperties & stateName) != 0) v = this.states.get(stateName);
		if(v == null && this.extendedStyle != null) v = this.extendedStyle.get(stateName);
		if(v == null && this.superStyle != null) v = this.superStyle.get(stateName);
		return v;
	}
	,set: function(stateName,state) {
		if(this.states == null && state == null) return;
		if(this.states == null) this.states = new prime.types.SimpleDictionary();
		if(state == null) this.states.unset(stateName); else this.states.set(stateName,state);
		this.markProperty(stateName,state != null);
	}
	,invalidateCall: function(changeFromOther,sender) {
		if(sender == this.owner) return prime.gui.styling.StyleSubBlock.prototype.invalidateCall.call(this,changeFromOther,sender);
		if((this.filledProperties & changeFromOther) != 0) return;
		var propIsInExtended = this.extendedStyle != null && (this.extendedStyle.allFilledProperties & changeFromOther) != 0;
		var propIsInSuper = this.superStyle != null && (this.superStyle.allFilledProperties & changeFromOther) != 0;
		if(sender == this.extendedStyle) {
			if(propIsInExtended) this.allFilledProperties = (function($this) {
				var $r;
				var bits = $this.allFilledProperties;
				$r = bits |= changeFromOther;
				return $r;
			}(this)); else this.allFilledProperties = (function($this) {
				var $r;
				var bits = $this.allFilledProperties;
				$r = bits &= -1 ^ changeFromOther;
				return $r;
			}(this));
			this.invalidate(changeFromOther);
		} else if(sender == this.superStyle && !propIsInExtended) {
			if(propIsInSuper) this.allFilledProperties = (function($this) {
				var $r;
				var bits = $this.allFilledProperties;
				$r = bits |= changeFromOther;
				return $r;
			}(this)); else this.allFilledProperties = (function($this) {
				var $r;
				var bits = $this.allFilledProperties;
				$r = bits &= -1 ^ changeFromOther;
				return $r;
			}(this));
			this.invalidate(changeFromOther);
		}
		return;
	}
	,getPropertiesWithout: function(noExtendedStyle,noSuperStyle) {
		var props = this.filledProperties;
		if(!noExtendedStyle && this.extendedStyle != null) props |= this.extendedStyle.allFilledProperties;
		if(!noSuperStyle && this.superStyle != null) props |= this.superStyle.allFilledProperties;
		return props;
	}
	,updateAllFilledPropertiesFlag: function() {
		this.inheritedProperties = 0;
		if(this.extendedStyle != null) this.inheritedProperties = this.extendedStyle.allFilledProperties;
		if(this.superStyle != null) this.inheritedProperties |= this.superStyle.allFilledProperties;
		this.allFilledProperties = this.filledProperties | this.inheritedProperties;
		this.inheritedProperties = (function($this) {
			var $r;
			var bits = $this.inheritedProperties;
			$r = bits &= -1 ^ $this.filledProperties;
			return $r;
		}(this));
	}
	,updateFilledPropertiesFlag: function() {
		if(this.states != null) {
			var stateNames = new prime.bindable.collections.iterators.FastArrayForwardIterator(this.states._keys);
			while( stateNames.hasNext() ) {
				var stateName = stateNames.next();
				this.filledProperties = (function($this) {
					var $r;
					var bits = $this.filledProperties;
					$r = bits |= stateName;
					return $r;
				}(this));
			}
		}
	}
	,updateOwnerReferences: function(changedReference) {
		if((changedReference & 4) != 0) {
			if(this.extendedStyle != null) this.extendedStyle.listeners.remove(this);
			this.extendedStyle = null;
			if(this.owner != null && this.owner.extendedStyle != null) {
				this.extendedStyle = this.owner.extendedStyle.getStates();
				if(this.extendedStyle != null) this.extendedStyle.listeners.add(this);
			}
		}
		if((changedReference & 2) != 0) {
			if(this.superStyle != null) this.superStyle.listeners.remove(this);
			this.superStyle = null;
			if(this.owner != null && this.owner.superStyle != null) {
				this.superStyle = this.owner.superStyle.getStates();
				if(this.superStyle != null) this.superStyle.listeners.add(this);
			}
		}
	}
	,dispose: function() {
		if(this.states != null) {
			this.states.dispose();
			this.states = null;
		}
		prime.gui.styling.StyleSubBlock.prototype.dispose.call(this);
	}
	,__class__: prime.gui.styling.StatesStyle
});
prime.gui.styling.StyleBlock = function(filledProps,type,graphics,layout,font,effects,boxFilters,bgFilters,states,idChildren,styleNameChildren,elementChildren,parentStyle,superStyle,nestingStyle,extendedStyle) {
	if(filledProps == null) filledProps = 0;
	prime.gui.styling.StyleBlockBase.call(this,filledProps);
	this.type = type;
	this.setGraphics(graphics);
	this.setLayout(layout);
	this.setFont(font);
	this.setEffects(effects);
	this.setBoxFilters(boxFilters);
	this.setBgFilters(bgFilters);
	this.setStates(states);
	this.setElementChildren(elementChildren);
	this.setStyleNameChildren(styleNameChildren);
	this.setIdChildren(idChildren);
	this.setParentStyle(parentStyle);
	this.setSuperStyle(superStyle);
	this.setNestingInherited(nestingStyle);
	this.setExtendedStyle(extendedStyle);
};
prime.gui.styling.StyleBlock.__name__ = ["prime","gui","styling","StyleBlock"];
prime.gui.styling.StyleBlock.__interfaces__ = [prime.core.traits.IPrioritizable,prime.gui.styling.IStyleBlock];
prime.gui.styling.StyleBlock.__super__ = prime.gui.styling.StyleBlockBase;
prime.gui.styling.StyleBlock.prototype = $extend(prime.gui.styling.StyleBlockBase.prototype,{
	toCode: function(code) {
		if(!this.isEmpty()) {
			if((this.filledProperties & 2032) != 0) code.construct(this,[this.filledProperties,this.type,this._graphics,this._layout,this._font,this._effects,this._boxFilters,this._bgFilters]); else code.construct(this,[this.filledProperties,this.type]);
			if((this.filledProperties & 15) != 0) code.setAction(this,"setInheritedStyles",[this.nestingInherited,this.superStyle,this.extendedStyle,this.parentStyle],true);
			if((this.filledProperties & 14336) != 0) code.setAction(this,"setChildren",[this.getIdChildren(),this.getStyleNameChildren(),this.getElementChildren()],true);
			if((this.filledProperties & 1024) != 0) code.setProp(this,"states",this._states,true);
		}
	}
	,getChildrenOfType: function(type) {
		return (function($this) {
			var $r;
			switch( (type)[1] ) {
			case 2:
				$r = $this._idChildren == null?$this.setIdChildren(new prime.types.SimpleDictionary()):$this._idChildren;
				break;
			case 1:
				$r = $this._styleNameChildren == null?$this.setStyleNameChildren(new prime.types.SimpleDictionary()):$this._styleNameChildren;
				break;
			case 0:
				$r = $this._elementChildren == null?$this.setElementChildren(new prime.types.SimpleDictionary()):$this._elementChildren;
				break;
			default:
				$r = null;
			}
			return $r;
		}(this));
	}
	,isEmpty: function() {
		return this.type == null || (function($this) {
			var $r;
			var bits = $this.filledProperties;
			$r = bits &= -9;
			return $r;
		}(this)) == 0;
	}
	,cleanUp: function() {
		if(this._boxFilters != null) {
			this._boxFilters.cleanUp();
			if(this._boxFilters.isEmpty()) {
				this._boxFilters.dispose();
				this.setBoxFilters(null);
				null;
			}
		}
		if(this._bgFilters != null) {
			this._bgFilters.cleanUp();
			if(this._bgFilters.isEmpty()) {
				this._bgFilters.dispose();
				this.setBgFilters(null);
				null;
			}
		}
		if(this._effects != null) {
			this._effects.cleanUp();
			if(this._effects.isEmpty()) {
				this._effects.dispose();
				this.setEffects(null);
				null;
			}
		}
		if(this._font != null) {
			this._font.cleanUp();
			if(this._font.isEmpty()) {
				this._font.dispose();
				this.setFont(null);
				null;
			}
		}
		if(this._graphics != null) {
			this._graphics.cleanUp();
			if(this._graphics.isEmpty()) {
				this._graphics.dispose();
				this.setGraphics(null);
				null;
			}
		}
		if(this._layout != null) {
			this._layout.cleanUp();
			if(this._layout.isEmpty()) {
				this._layout.dispose();
				this.setLayout(null);
				null;
			}
		}
		if(this._idChildren != null) {
			this._idChildren.cleanUp();
			if(this._idChildren.isEmpty()) {
				this._idChildren.dispose();
				this.setIdChildren(null);
				null;
			}
		}
		if(this._styleNameChildren != null) {
			this._styleNameChildren.cleanUp();
			if(this._styleNameChildren.isEmpty()) {
				this._styleNameChildren.dispose();
				this.setStyleNameChildren(null);
				null;
			}
		}
		if(this._elementChildren != null) {
			this._elementChildren.cleanUp();
			if(this._elementChildren.isEmpty()) {
				this._elementChildren.dispose();
				this.setElementChildren(null);
				null;
			}
		}
		if(this._states != null) {
			this._states.cleanUp();
			if(this._states.isEmpty()) {
				this._states.dispose();
				this.setStates(null);
				null;
			}
		}
	}
	,hashToCSSString: function(namePrefix,hash,keyPrefix) {
		if(keyPrefix == null) keyPrefix = "";
		var css = "";
		var keys = new prime.bindable.collections.iterators.FastArrayForwardIterator(hash._keys);
		while(keys.hasNext()) {
			var key = keys.next();
			var val = hash.get(key);
			var name = StringTools.trim(namePrefix + " " + keyPrefix + key);
			if(!val.isEmpty()) css += "\n" + val.toCSS(name);
		}
		return css;
	}
	,toCSS: function(namePrefix) {
		if(namePrefix == null) namePrefix = "";
		var css = "";
		if(this._graphics != null) css += this._graphics.toCSS();
		if(this._layout != null) css += this._layout.toCSS();
		if(this._font != null) css += this._font.toCSS();
		if(this._effects != null) css += this._effects.toCSS();
		if(this._boxFilters != null) css += this._boxFilters.toCSS();
		if(this._bgFilters != null) css += this._bgFilters.toCSS();
		if(StringTools.trim(css) != "") css = namePrefix + " {" + css + "\n}";
		if(this._states != null) css += "\n" + this._states.toCSS(namePrefix);
		if(this._idChildren != null) css += "\n" + this.hashToCSSString(namePrefix,this._idChildren,"#");
		if(this._styleNameChildren != null) css += "\n" + this.hashToCSSString(namePrefix,this._styleNameChildren,".");
		if(this._elementChildren != null) css += "\n" + this.hashToCSSString(namePrefix,this._elementChildren,"");
		return css;
	}
	,setGraphics: function(v) {
		if(v != this._graphics) {
			if(this._graphics != null) this._graphics.setOwner(null);
			this._graphics = v;
			if(this._graphics != null) this._graphics.setOwner(this);
			this.markProperty(64,v != null);
		}
		return v;
	}
	,setStyleNameChildren: function(v) {
		if(v != this._styleNameChildren) {
			this._styleNameChildren = v;
			this.markProperty(4096,v != null);
		}
		return v;
	}
	,setElementChildren: function(v) {
		if(v != this._elementChildren) {
			this._elementChildren = v;
			this.markProperty(2048,v != null);
		}
		return v;
	}
	,setIdChildren: function(v) {
		if(v != this._idChildren) {
			this._idChildren = v;
			this.markProperty(8192,v != null);
		}
		return v;
	}
	,setStates: function(v) {
		if(v != this._states) {
			if(this._states != null) this._states.setOwner(null);
			this._states = v;
			if(this._states != null) this._states.setOwner(this);
			this.markProperty(1024,v != null);
		}
		return v;
	}
	,setBgFilters: function(v) {
		if(v != this._bgFilters) {
			if(this._bgFilters != null) this._bgFilters.setOwner(null);
			this._bgFilters = v;
			if(this._bgFilters != null) this._bgFilters.setOwner(this);
			this.markProperty(512,v != null);
		}
		return v;
	}
	,setBoxFilters: function(v) {
		if(v != this._boxFilters) {
			if(this._boxFilters != null) this._boxFilters.setOwner(null);
			this._boxFilters = v;
			if(this._boxFilters != null) this._boxFilters.setOwner(this);
			this.markProperty(256,v != null);
		}
		return v;
	}
	,setEffects: function(v) {
		if(v != this._effects) {
			if(this._effects != null) this._effects.setOwner(null);
			this._effects = v;
			if(this._effects != null) this._effects.setOwner(this);
			this.markProperty(128,v != null);
		}
		return v;
	}
	,setFont: function(v) {
		if(v != this._font) {
			if(this._font != null) this._font.setOwner(null);
			this._font = v;
			if(this._font != null) this._font.setOwner(this);
			this.markProperty(32,v != null);
		}
		return v;
	}
	,setLayout: function(v) {
		if(v != this._layout) {
			if(this._layout != null) this._layout.setOwner(null);
			this._layout = v;
			if(this._layout != null) this._layout.setOwner(this);
			this.markProperty(16,v != null);
		}
		return v;
	}
	,setParentStyle: function(v) {
		if(v != this.parentStyle) {
			this.parentStyle = v;
			this.markProperty(8,v != null);
		}
		return v;
	}
	,setExtendedStyle: function(v) {
		if(v != this.extendedStyle) {
			if(this.extendedStyle != null) this.extendedStyle.listeners.remove(this);
			this.extendedStyle = v;
			if(this.extendedStyle != null) this.extendedStyle.listeners.add(this);
			this.updateAllFilledPropertiesFlag();
			this.markProperty(4,v != null);
		}
		return v;
	}
	,setSuperStyle: function(v) {
		if(v != this.superStyle) {
			if(this.superStyle != null) this.superStyle.listeners.remove(this);
			this.superStyle = v;
			if(this.superStyle != null) this.superStyle.listeners.add(this);
			this.updateAllFilledPropertiesFlag();
			this.markProperty(2,v != null);
		}
		return v;
	}
	,setNestingInherited: function(v) {
		if(v != this.nestingInherited) {
			this.nestingInherited = v;
			this.markProperty(1,v != null);
		}
		return v;
	}
	,getStyleNameChildren: function() {
		var v = this._styleNameChildren;
		if(v == null && this.extendedStyle != null) v = this.extendedStyle.getStyleNameChildren();
		if(v == null && this.superStyle != null) v = this.superStyle.getStyleNameChildren();
		return v;
	}
	,getElementChildren: function() {
		var v = this._elementChildren;
		if(v == null && this.extendedStyle != null) v = this.extendedStyle.getElementChildren();
		if(v == null && this.superStyle != null) v = this.superStyle.getElementChildren();
		return v;
	}
	,getIdChildren: function() {
		var v = this._idChildren;
		if(v == null && this.extendedStyle != null) v = this.extendedStyle.getIdChildren();
		if(v == null && this.superStyle != null) v = this.superStyle.getIdChildren();
		return v;
	}
	,getGraphics: function() {
		var v = this._graphics;
		if(v == null && this.extendedStyle != null) v = this.extendedStyle.getGraphics();
		if(v == null && this.superStyle != null) v = this.superStyle.getGraphics();
		return v;
	}
	,getStates: function() {
		var v = this._states;
		if(v == null && this.extendedStyle != null) v = this.extendedStyle.getStates();
		if(v == null && this.superStyle != null) v = this.superStyle.getStates();
		return v;
	}
	,getBgFilters: function() {
		var v = this._bgFilters;
		if(v == null && this.extendedStyle != null) v = this.extendedStyle.getBgFilters();
		if(v == null && this.superStyle != null) v = this.superStyle.getBgFilters();
		return v;
	}
	,getBoxFilters: function() {
		var v = this._boxFilters;
		if(v == null && this.extendedStyle != null) v = this.extendedStyle.getBoxFilters();
		if(v == null && this.superStyle != null) v = this.superStyle.getBoxFilters();
		return v;
	}
	,getEffects: function() {
		var v = this._effects;
		if(v == null && this.extendedStyle != null) v = this.extendedStyle.getEffects();
		if(v == null && this.superStyle != null) v = this.superStyle.getEffects();
		return v;
	}
	,getFont: function() {
		var v = this._font;
		if(v == null && this.extendedStyle != null) v = this.extendedStyle.getFont();
		if(v == null && this.superStyle != null) v = this.superStyle.getFont();
		return v;
	}
	,getLayout: function() {
		var v = this._layout;
		if(v == null && this.extendedStyle != null) v = this.extendedStyle.getLayout();
		if(v == null && this.superStyle != null) v = this.superStyle.getLayout();
		return v;
	}
	,invalidateCall: function(changeFromOther,sender) {
		changeFromOther = changeFromOther & (this.filledProperties | 15);
		if(changeFromOther == 0) return;
		if(sender == this.extendedStyle) {
			if((this.extendedStyle.allFilledProperties & changeFromOther) != 0) this.allFilledProperties = (function($this) {
				var $r;
				var bits = $this.allFilledProperties;
				$r = bits |= changeFromOther;
				return $r;
			}(this)); else this.allFilledProperties = (function($this) {
				var $r;
				var bits = $this.allFilledProperties;
				$r = bits &= -1 ^ changeFromOther;
				return $r;
			}(this));
			this.invalidate(changeFromOther);
		} else if(sender == this.superStyle) {
			if(this.extendedStyle != null) changeFromOther = changeFromOther & this.extendedStyle.allFilledProperties;
			if(changeFromOther == 0) return;
			if((this.superStyle.allFilledProperties & changeFromOther) != 0) this.allFilledProperties = (function($this) {
				var $r;
				var bits = $this.allFilledProperties;
				$r = bits |= changeFromOther;
				return $r;
			}(this)); else this.allFilledProperties = (function($this) {
				var $r;
				var bits = $this.allFilledProperties;
				$r = bits &= -1 ^ changeFromOther;
				return $r;
			}(this));
			this.invalidate(changeFromOther);
		}
	}
	,getPropertiesWithout: function(noExtendedStyle,noSuperStyle) {
		var props = this.filledProperties;
		if(!noExtendedStyle && this.extendedStyle != null) props |= this.extendedStyle.allFilledProperties;
		if(!noSuperStyle && this.superStyle != null) props |= this.superStyle.allFilledProperties;
		return props;
	}
	,updateAllFilledPropertiesFlag: function() {
		this.inheritedProperties = 0;
		if(this.extendedStyle != null) this.inheritedProperties = this.extendedStyle.allFilledProperties;
		if(this.superStyle != null) this.inheritedProperties |= this.superStyle.allFilledProperties;
		this.allFilledProperties = this.filledProperties | this.inheritedProperties;
		this.inheritedProperties = (function($this) {
			var $r;
			var bits = $this.inheritedProperties;
			$r = bits &= -1 ^ ($this.filledProperties | 15);
			return $r;
		}(this));
	}
	,findElementStyle: function(name,exclude) {
		var style = null;
		if((this.filledProperties & 2048) != 0) {
			style = this._elementChildren.get(name);
			if(style == exclude) style = null;
		}
		if(style == null && (this.allFilledProperties & 2048) != 0) {
			if(this.extendedStyle != null) style = this.extendedStyle.findElementStyle(name,exclude);
			if(style == null && this.superStyle != null) style = this.superStyle.findElementStyle(name,exclude);
		}
		if(style == null && this.parentStyle != null) style = this.parentStyle.findElementStyle(name,exclude);
		return style;
	}
	,findStyleNameStyle: function(name,exclude) {
		var style = null;
		if((this.filledProperties & 4096) != 0) {
			style = this._styleNameChildren.get(name);
			if(style == exclude) style = null;
		}
		if(style == null && (this.allFilledProperties & 4096) != 0) {
			if(this.extendedStyle != null) style = this.extendedStyle.findStyleNameStyle(name,exclude);
			if(style == null && this.superStyle != null) style = this.superStyle.findStyleNameStyle(name,exclude);
		}
		if(style == null && this.parentStyle != null) style = this.parentStyle.findStyleNameStyle(name,exclude);
		return style;
	}
	,findIdStyle: function(name,exclude) {
		var style = null;
		if((this.filledProperties & 8192) != 0) {
			style = this._idChildren.get(name);
			if(style == exclude) style = null;
		}
		if(style == null && (this.allFilledProperties & 8192) != 0) {
			if(this.extendedStyle != null) style = this.extendedStyle.findIdStyle(name,exclude);
			if(style == null && this.superStyle != null) style = this.superStyle.findIdStyle(name,exclude);
		}
		if(style == null && this.parentStyle != null) style = this.parentStyle.findIdStyle(name,exclude);
		return style;
	}
	,findChild: function(name,childType,exclude) {
		return (function($this) {
			var $r;
			switch( (childType)[1] ) {
			case 2:
				$r = $this.findIdStyle(name,exclude);
				break;
			case 1:
				$r = $this.findStyleNameStyle(name,exclude);
				break;
			case 0:
				$r = $this.findElementStyle(name,exclude);
				break;
			default:
				$r = (function($this) {
					var $r;
					throw "not implemented";
					return $r;
				}($this));
			}
			return $r;
		}(this));
	}
	,findState: function(stateName,styleName,styleType,exclude,depth) {
		if(depth == null) depth = 0;
		var stateStyle = this.getState(stateName,styleName,styleType,exclude);
		if(stateStyle == null && this.parentStyle != null) stateStyle = this.parentStyle.findState(stateName,styleName,styleType,exclude,++depth);
		return stateStyle;
	}
	,getState: function(stateName,styleName,styleType,exclude) {
		var stateStyle = null;
		var child = (function($this) {
			var $r;
			switch( (styleType)[1] ) {
			case 2:
				$r = $this.findIdStyle(styleName,exclude);
				break;
			case 1:
				$r = $this.findStyleNameStyle(styleName,exclude);
				break;
			case 0:
				$r = $this.findElementStyle(styleName,exclude);
				break;
			default:
				$r = (function($this) {
					var $r;
					throw "not implemented";
					return $r;
				}($this));
			}
			return $r;
		}(this));
		if(child != null && child.getStates() != null && (child.getStates().allFilledProperties & stateName) != 0) stateStyle = child.getStates().get(stateName);
		if(stateStyle == exclude) stateStyle = null;
		return stateStyle;
	}
	,getPriority: function() {
		return this.type[1];
	}
	,dispose: function() {
		this.setNestingInherited(this.setSuperStyle(this.setExtendedStyle(this.setParentStyle(null))));
		if(this._graphics != null) this._graphics.dispose();
		if(this._layout != null) this._layout.dispose();
		if(this._font != null) this._font.dispose();
		if(this._effects != null) this._effects.dispose();
		if(this._boxFilters != null) this._boxFilters.dispose();
		if(this._bgFilters != null) this._bgFilters.dispose();
		if(this._states != null) this._states.dispose();
		if(this._elementChildren != null) this._elementChildren.dispose();
		if(this._styleNameChildren != null) this._styleNameChildren.dispose();
		if(this._idChildren != null) this._idChildren.dispose();
		this.type = null;
		this._graphics = null;
		this._states = null;
		this._layout = null;
		this._font = null;
		this._effects = null;
		this._boxFilters = null;
		this._bgFilters = null;
		this._elementChildren = null;
		this._styleNameChildren = null;
		this._idChildren = null;
		prime.gui.styling.StyleBlockBase.prototype.dispose.call(this);
	}
	,__class__: prime.gui.styling.StyleBlock
});
prime.gui.styling.StyleBlockType = { __ename__ : ["prime","gui","styling","StyleBlockType"], __constructs__ : ["element","styleName","id","specific","elementState","styleNameState","idState"] }
prime.gui.styling.StyleBlockType.element = ["element",0];
prime.gui.styling.StyleBlockType.element.toString = $estr;
prime.gui.styling.StyleBlockType.element.__enum__ = prime.gui.styling.StyleBlockType;
prime.gui.styling.StyleBlockType.styleName = ["styleName",1];
prime.gui.styling.StyleBlockType.styleName.toString = $estr;
prime.gui.styling.StyleBlockType.styleName.__enum__ = prime.gui.styling.StyleBlockType;
prime.gui.styling.StyleBlockType.id = ["id",2];
prime.gui.styling.StyleBlockType.id.toString = $estr;
prime.gui.styling.StyleBlockType.id.__enum__ = prime.gui.styling.StyleBlockType;
prime.gui.styling.StyleBlockType.specific = ["specific",3];
prime.gui.styling.StyleBlockType.specific.toString = $estr;
prime.gui.styling.StyleBlockType.specific.__enum__ = prime.gui.styling.StyleBlockType;
prime.gui.styling.StyleBlockType.elementState = ["elementState",4];
prime.gui.styling.StyleBlockType.elementState.toString = $estr;
prime.gui.styling.StyleBlockType.elementState.__enum__ = prime.gui.styling.StyleBlockType;
prime.gui.styling.StyleBlockType.styleNameState = ["styleNameState",5];
prime.gui.styling.StyleBlockType.styleNameState.toString = $estr;
prime.gui.styling.StyleBlockType.styleNameState.__enum__ = prime.gui.styling.StyleBlockType;
prime.gui.styling.StyleBlockType.idState = ["idState",6];
prime.gui.styling.StyleBlockType.idState.toString = $estr;
prime.gui.styling.StyleBlockType.idState.__enum__ = prime.gui.styling.StyleBlockType;
prime.gui.styling.StyleChildren = function() { }
prime.gui.styling.StyleChildren.__name__ = ["prime","gui","styling","StyleChildren"];
prime.gui.styling.StyleChildren.__interfaces__ = [prime.tools.generator.ICodeFormattable,prime.tools.generator.ICSSFormattable,prime.core.traits.IDisposable];
prime.gui.styling.StyleChildren.prototype = {
	toCode: function(code) {
		if(!this.isEmpty()) code.construct(this,[this.elementSelectors,this.styleNameSelectors,this.idSelectors]);
	}
	,cleanUp: function() {
		if(this.idSelectors != null) {
			this.idSelectors.cleanUp();
			if(this.idSelectors.isEmpty()) {
				this.idSelectors.dispose();
				this.idSelectors = null;
			}
		}
		if(this.styleNameSelectors != null) {
			this.styleNameSelectors.cleanUp();
			if(this.styleNameSelectors.isEmpty()) {
				this.styleNameSelectors.dispose();
				this.styleNameSelectors = null;
			}
		}
		if(this.elementSelectors != null) {
			this.elementSelectors.cleanUp();
			if(this.elementSelectors.isEmpty()) {
				this.elementSelectors.dispose();
				this.elementSelectors = null;
			}
		}
	}
	,hashToCSSString: function(namePrefix,hash,keyPrefix) {
		if(keyPrefix == null) keyPrefix = "";
		var css = "";
		var keys = new prime.bindable.collections.iterators.FastArrayForwardIterator(hash._keys);
		while(keys.hasNext()) {
			var key = keys.next();
			var val = hash.get(key);
			var name = StringTools.trim(namePrefix + " " + keyPrefix + key);
			if(!val.isEmpty()) css += "\n" + val.toCSS(name);
		}
		return css;
	}
	,toCSS: function(namePrefix) {
		if(namePrefix == null) namePrefix = "";
		var css = "";
		if(!this.isEmpty()) {
			if(this.idSelectors != null) css += this.hashToCSSString(namePrefix,this.idSelectors,"#");
			if(this.styleNameSelectors != null) css += this.hashToCSSString(namePrefix,this.styleNameSelectors,".");
			if(this.elementSelectors != null) css += this.hashToCSSString(namePrefix,this.elementSelectors,"");
		}
		return css;
	}
	,isEmpty: function() {
		return (this.idSelectors == null || this.idSelectors.isEmpty()) && (this.styleNameSelectors == null || this.styleNameSelectors.isEmpty()) && (this.elementSelectors == null || this.elementSelectors.isEmpty());
	}
	,dispose: function() {
		this.elementSelectors = this.styleNameSelectors = this.idSelectors = null;
	}
	,__class__: prime.gui.styling.StyleChildren
}
prime.gui.styling.StyleStateFlags = function() { }
prime.gui.styling.StyleStateFlags.__name__ = ["prime","gui","styling","StyleStateFlags"];
prime.gui.styling.StyleStateFlags.stateToString = function(v) {
	return (function($this) {
		var $r;
		switch(v) {
		case 2:
			$r = "hover";
			break;
		case 4:
			$r = "down";
			break;
		case 8:
			$r = "focus";
			break;
		case 16:
			$r = "valid";
			break;
		case 32:
			$r = "invalid";
			break;
		case 64:
			$r = "required";
			break;
		case 128:
			$r = "optional";
			break;
		case 256:
			$r = "disabled";
			break;
		case 512:
			$r = "checked";
			break;
		case 2048:
			$r = "selected";
			break;
		case 4096:
			$r = "progress";
			break;
		case 32768:
			$r = "indeterminate";
			break;
		case 65536:
			$r = "determinate";
			break;
		case 8192:
			$r = "completed";
			break;
		case 16384:
			$r = "error";
			break;
		case 1024:
			$r = "editable";
			break;
		case 131072:
			$r = "drag-over";
			break;
		case 262144:
			$r = "drag-drop";
			break;
		default:
			$r = "unkown ( " + v + " )";
		}
		return $r;
	}(this));
}
prime.gui.styling.TextStyle = function(filledProps,size,family,embeddedFont,color,weight,style,letterSpacing,align,decoration,indent,transform,textWrap,columnCount,columnGap,columnWidth) {
	if(columnWidth == null) columnWidth = -2147483648;
	if(columnGap == null) columnGap = -2147483648;
	if(columnCount == null) columnCount = -2147483648;
	if(indent == null) indent = -2147483648;
	if(letterSpacing == null) letterSpacing = -2147483648;
	if(embeddedFont == null) embeddedFont = false;
	if(size == null) size = -2147483648;
	if(filledProps == null) filledProps = 0;
	prime.gui.styling.StyleSubBlock.call(this,filledProps);
	this.setSize(size);
	this.setFamily(family);
	this.setEmbeddedFont(embeddedFont);
	this.setColor(color);
	this.setWeight(weight);
	this.setStyle(style);
	this.setLetterSpacing(letterSpacing == -2147483648?prime.types.Number.FLOAT_NOT_SET:letterSpacing);
	this.setAlign(align);
	this.setDecoration(decoration);
	this.setIndent(indent == -2147483648?prime.types.Number.FLOAT_NOT_SET:indent);
	this.setTransform(transform);
	this.setTextWrap(textWrap);
	this.setColumnCount(columnCount);
	this.setColumnGap(columnGap);
	this.setColumnWidth(columnWidth);
};
prime.gui.styling.TextStyle.__name__ = ["prime","gui","styling","TextStyle"];
prime.gui.styling.TextStyle.__super__ = prime.gui.styling.StyleSubBlock;
prime.gui.styling.TextStyle.prototype = $extend(prime.gui.styling.StyleSubBlock.prototype,{
	cleanUp: function() {
	}
	,toCode: function(code) {
		if(!this.isEmpty()) code.construct(this,[this.filledProperties,this._size,this._family,this._embeddedFont,this._color,this._weight,this._style,this._letterSpacing,this._align,this._decoration,this._indent,this._transform,this._textWrap,this._columnCount,this._columnGap,this._columnWidth]);
	}
	,toCSS: function(prefix) {
		if(prefix == null) prefix = "";
		var css = [];
		if((function($this) {
			var $r;
			var value = $this._size;
			$r = value != -2147483648 && value != null;
			return $r;
		}(this))) css.push("font-size: " + this._size + "px");
		if(this._family != null) css.push("font-family: " + this._family);
		if(this._color != null) css.push("color: " + (function($this) {
			var $r;
			var v = $this._color;
			$r = "0x" + StringTools.hex((v & -256) >>> 8,6) + StringTools.hex(v & 255,2);
			return $r;
		}(this)));
		if(this._weight != null) css.push("font-weight: " + Std.string(this._weight));
		if(this._style != null) css.push("font-style: " + Std.string(this._style));
		if((function($this) {
			var $r;
			var value = $this._letterSpacing;
			$r = value != null && value == value;
			return $r;
		}(this))) css.push("letter-spacing: " + this._letterSpacing);
		if(this._align != null) css.push("text-align: " + Std.string(this._align));
		if(this._decoration != null) css.push("text-decoration: " + Std.string(this._decoration));
		if((function($this) {
			var $r;
			var value = $this._indent;
			$r = value != null && value == value;
			return $r;
		}(this))) css.push("text-indent: " + this._indent);
		if(this._transform != null) css.push("text-transform: " + Std.string(this._transform));
		if(this._textWrap != null) css.push("text-wrap: " + Std.string(this._textWrap));
		if((function($this) {
			var $r;
			var value = $this._columnCount;
			$r = value != -2147483648 && value != null;
			return $r;
		}(this))) css.push("column-count: " + this._columnCount);
		if((function($this) {
			var $r;
			var value = $this._columnGap;
			$r = value != -2147483648 && value != null;
			return $r;
		}(this))) css.push("column-gap: " + this._columnGap);
		if((function($this) {
			var $r;
			var value = $this._columnWidth;
			$r = value != -2147483648 && value != null;
			return $r;
		}(this))) css.push("column-width: " + this._columnWidth);
		if(css.length > 0) return "\n\t" + css.join(";\n\t") + ";"; else return "";
	}
	,setColumnWidth: function(v) {
		if(v != this._columnWidth) {
			this._columnWidth = v;
			this.markProperty(8192,v != -2147483648 && v != null);
		}
		return v;
	}
	,setColumnGap: function(v) {
		if(v != this._columnGap) {
			this._columnGap = v;
			this.markProperty(4096,v != -2147483648 && v != null);
		}
		return v;
	}
	,setColumnCount: function(v) {
		if(v != this._columnCount) {
			this._columnCount = v;
			this.markProperty(2048,v != -2147483648 && v != null);
		}
		return v;
	}
	,setTextWrap: function(v) {
		if(v != this._textWrap) {
			this._textWrap = v;
			this.markProperty(1024,v != null);
		}
		return v;
	}
	,setTransform: function(v) {
		if(v != this._transform) {
			this._transform = v;
			this.markProperty(512,v != null);
		}
		return v;
	}
	,setIndent: function(v) {
		if(v != this._indent) {
			this._indent = v;
			this.markProperty(256,v != null && v == v);
		}
		return v;
	}
	,setDecoration: function(v) {
		if(v != this._decoration) {
			this._decoration = v;
			this.markProperty(128,v != null);
		}
		return v;
	}
	,setAlign: function(v) {
		if(v != this._align) {
			this._align = v;
			this.markProperty(64,v != null);
		}
		return v;
	}
	,setLetterSpacing: function(v) {
		if(v != this._letterSpacing) {
			this._letterSpacing = v;
			this.markProperty(32,v != null && v == v);
		}
		return v;
	}
	,setStyle: function(v) {
		if(v != this._style) {
			this._style = v;
			this.markProperty(16,v != null);
		}
		return v;
	}
	,setWeight: function(v) {
		if(v != this._weight) {
			this._weight = v;
			this.markProperty(8,v != null);
		}
		return v;
	}
	,setColor: function(v) {
		if(v != null) v = (function($this) {
			var $r;
			var value = (v & -256) >>> 8;
			if(value < 0) value = 0; else if(value > 16777215) value = 16777215;
			$r = value;
			return $r;
		}(this)) << 8 | (function($this) {
			var $r;
			var value = v & 255;
			if(value < 0) value = 0; else if(value > 255) value = 255;
			$r = value;
			return $r;
		}(this));
		if(v != this._color) {
			this._color = v;
			this.markProperty(4,v != null);
		}
		return v;
	}
	,setEmbeddedFont: function(v) {
		if(v != this._embeddedFont) {
			this._embeddedFont = v;
			this.markProperty(16384,this._family != null);
		}
		return v;
	}
	,setFamily: function(v) {
		if(v != this._family) {
			this._family = v;
			this.markProperty(2,v != null);
		}
		return v;
	}
	,setSize: function(v) {
		if(v != this._size) {
			this._size = v;
			this.markProperty(1,v != -2147483648 && v != null);
		}
		return v;
	}
	,getColumnWidth: function() {
		var v = this._columnWidth;
		if((v == -2147483648 || v == null) && this.extendedStyle != null) v = this.extendedStyle.getColumnWidth();
		if((v == -2147483648 || v == null) && this.nestingStyle != null) v = this.nestingStyle.getColumnWidth();
		if((v == -2147483648 || v == null) && this.superStyle != null) v = this.superStyle.getColumnWidth();
		if((v == -2147483648 || v == null) && this.parentStyle != null) v = this.parentStyle.getColumnWidth();
		return v;
	}
	,getColumnGap: function() {
		var v = this._columnGap;
		if((v == -2147483648 || v == null) && this.extendedStyle != null) v = this.extendedStyle.getColumnGap();
		if((v == -2147483648 || v == null) && this.nestingStyle != null) v = this.nestingStyle.getColumnGap();
		if((v == -2147483648 || v == null) && this.superStyle != null) v = this.superStyle.getColumnGap();
		if((v == -2147483648 || v == null) && this.parentStyle != null) v = this.parentStyle.getColumnGap();
		return v;
	}
	,getColumnCount: function() {
		var v = this._columnCount;
		if((v == -2147483648 || v == null) && this.extendedStyle != null) v = this.extendedStyle.getColumnCount();
		if((v == -2147483648 || v == null) && this.nestingStyle != null) v = this.nestingStyle.getColumnCount();
		if((v == -2147483648 || v == null) && this.superStyle != null) v = this.superStyle.getColumnCount();
		if((v == -2147483648 || v == null) && this.parentStyle != null) v = this.parentStyle.getColumnCount();
		return v;
	}
	,getTextWrap: function() {
		var v = this._textWrap;
		if(v == null && this.extendedStyle != null) v = this.extendedStyle.getTextWrap();
		if(v == null && this.nestingStyle != null) v = this.nestingStyle.getTextWrap();
		if(v == null && this.superStyle != null) v = this.superStyle.getTextWrap();
		if(v == null && this.parentStyle != null) v = this.parentStyle.getTextWrap();
		return v;
	}
	,getTransform: function() {
		var v = this._transform;
		if(v == null && this.extendedStyle != null) v = this.extendedStyle.getTransform();
		if(v == null && this.nestingStyle != null) v = this.nestingStyle.getTransform();
		if(v == null && this.superStyle != null) v = this.superStyle.getTransform();
		if(v == null && this.parentStyle != null) v = this.parentStyle.getTransform();
		return v;
	}
	,getIndent: function() {
		var v = this._indent;
		if(!(v != null && v == v) && this.extendedStyle != null) v = this.extendedStyle.getIndent();
		if(!(v != null && v == v) && this.nestingStyle != null) v = this.nestingStyle.getIndent();
		if(!(v != null && v == v) && this.superStyle != null) v = this.superStyle.getIndent();
		if(!(v != null && v == v) && this.parentStyle != null) v = this.parentStyle.getIndent();
		return v;
	}
	,getDecoration: function() {
		var v = this._decoration;
		if(v == null && this.extendedStyle != null) v = this.extendedStyle.getDecoration();
		if(v == null && this.nestingStyle != null) v = this.nestingStyle.getDecoration();
		if(v == null && this.superStyle != null) v = this.superStyle.getDecoration();
		if(v == null && this.parentStyle != null) v = this.parentStyle.getDecoration();
		return v;
	}
	,getLetterSpacing: function() {
		var v = this._letterSpacing;
		if(!(v != null && v == v) && this.extendedStyle != null) v = this.extendedStyle.getLetterSpacing();
		if(!(v != null && v == v) && this.nestingStyle != null) v = this.nestingStyle.getLetterSpacing();
		if(!(v != null && v == v) && this.superStyle != null) v = this.superStyle.getLetterSpacing();
		if(!(v != null && v == v) && this.parentStyle != null) v = this.parentStyle.getLetterSpacing();
		return v;
	}
	,getStyle: function() {
		var v = this._style;
		if(v == null && this.extendedStyle != null) v = this.extendedStyle.getStyle();
		if(v == null && this.nestingStyle != null) v = this.nestingStyle.getStyle();
		if(v == null && this.superStyle != null) v = this.superStyle.getStyle();
		if(v == null && this.parentStyle != null) v = this.parentStyle.getStyle();
		return v;
	}
	,getWeight: function() {
		var v = this._weight;
		if(v == null && this.extendedStyle != null) v = this.extendedStyle.getWeight();
		if(v == null && this.nestingStyle != null) v = this.nestingStyle.getWeight();
		if(v == null && this.superStyle != null) v = this.superStyle.getWeight();
		if(v == null && this.parentStyle != null) v = this.parentStyle.getWeight();
		return v;
	}
	,getAlign: function() {
		var v = this._align;
		if(v == null && this.extendedStyle != null) v = this.extendedStyle.getAlign();
		if(v == null && this.nestingStyle != null) v = this.nestingStyle.getAlign();
		if(v == null && this.superStyle != null) v = this.superStyle.getAlign();
		if(v == null && this.parentStyle != null) v = this.parentStyle.getAlign();
		return v;
	}
	,getColor: function() {
		var v = this._color;
		if(v == null && this.extendedStyle != null) v = this.extendedStyle.getColor();
		if(v == null && this.nestingStyle != null) v = this.nestingStyle.getColor();
		if(v == null && this.superStyle != null) v = this.superStyle.getColor();
		if(v == null && this.parentStyle != null) v = this.parentStyle.getColor();
		return v;
	}
	,getEmbeddedFont: function() {
		var fam = this._family;
		var val = this._embeddedFont;
		if(fam == null && this.extendedStyle != null) {
			fam = this.extendedStyle.getFamily();
			val = this.extendedStyle.getEmbeddedFont();
		}
		if(fam == null && this.nestingStyle != null) {
			fam = this.nestingStyle.getFamily();
			val = this.nestingStyle.getEmbeddedFont();
		}
		if(fam == null && this.superStyle != null) {
			fam = this.superStyle.getFamily();
			val = this.superStyle.getEmbeddedFont();
		}
		if(fam == null && this.parentStyle != null) {
			fam = this.parentStyle.getFamily();
			val = this.parentStyle.getEmbeddedFont();
		}
		return val;
	}
	,getFamily: function() {
		var v = this._family;
		if(v == null && this.extendedStyle != null) v = this.extendedStyle.getFamily();
		if(v == null && this.nestingStyle != null) v = this.nestingStyle.getFamily();
		if(v == null && this.superStyle != null) v = this.superStyle.getFamily();
		if(v == null && this.parentStyle != null) v = this.parentStyle.getFamily();
		return v;
	}
	,getSize: function() {
		var v = this._size;
		if((v == -2147483648 || v == null) && this.extendedStyle != null) v = this.extendedStyle.getSize();
		if((v == -2147483648 || v == null) && this.nestingStyle != null) v = this.nestingStyle.getSize();
		if((v == -2147483648 || v == null) && this.superStyle != null) v = this.superStyle.getSize();
		if((v == -2147483648 || v == null) && this.parentStyle != null) v = this.parentStyle.getSize();
		return v;
	}
	,invalidateCall: function(changeFromOther,sender) {
		if(sender == this.owner) return prime.gui.styling.StyleSubBlock.prototype.invalidateCall.call(this,changeFromOther,sender);
		if((this.filledProperties & changeFromOther) != 0) return;
		var propIsInExtended = this.extendedStyle != null && (this.extendedStyle.allFilledProperties & changeFromOther) != 0;
		var propIsInSuper = this.superStyle != null && (this.superStyle.allFilledProperties & changeFromOther) != 0;
		var propIsInNesting = this.nestingStyle != null && (this.nestingStyle.allFilledProperties & changeFromOther) != 0;
		var propIsInParent = this.parentStyle != null && (this.parentStyle.allFilledProperties & changeFromOther) != 0;
		if(sender == this.extendedStyle) {
			if(propIsInExtended) this.allFilledProperties = (function($this) {
				var $r;
				var bits = $this.allFilledProperties;
				$r = bits |= changeFromOther;
				return $r;
			}(this)); else this.allFilledProperties = (function($this) {
				var $r;
				var bits = $this.allFilledProperties;
				$r = bits &= -1 ^ changeFromOther;
				return $r;
			}(this));
			this.invalidate(changeFromOther);
		} else if(sender == this.nestingStyle && !propIsInExtended) {
			if(propIsInNesting) this.allFilledProperties = (function($this) {
				var $r;
				var bits = $this.allFilledProperties;
				$r = bits |= changeFromOther;
				return $r;
			}(this)); else this.allFilledProperties = (function($this) {
				var $r;
				var bits = $this.allFilledProperties;
				$r = bits &= -1 ^ changeFromOther;
				return $r;
			}(this));
			this.invalidate(changeFromOther);
		} else if(sender == this.superStyle && !propIsInExtended && !propIsInNesting) {
			if(propIsInSuper) this.allFilledProperties = (function($this) {
				var $r;
				var bits = $this.allFilledProperties;
				$r = bits |= changeFromOther;
				return $r;
			}(this)); else this.allFilledProperties = (function($this) {
				var $r;
				var bits = $this.allFilledProperties;
				$r = bits &= -1 ^ changeFromOther;
				return $r;
			}(this));
			this.invalidate(changeFromOther);
		} else if(sender == this.parentStyle && !propIsInExtended && !propIsInNesting && !propIsInSuper) {
			if(propIsInParent) this.allFilledProperties = (function($this) {
				var $r;
				var bits = $this.allFilledProperties;
				$r = bits |= changeFromOther;
				return $r;
			}(this)); else this.allFilledProperties = (function($this) {
				var $r;
				var bits = $this.allFilledProperties;
				$r = bits &= -1 ^ changeFromOther;
				return $r;
			}(this));
			this.invalidate(changeFromOther);
		}
		return;
	}
	,isPropAnStyleReference: function(property) {
		return prime.gui.styling.StyleSubBlock.prototype.isPropAnStyleReference.call(this,property) || property == 1 || property == 8;
	}
	,getPropertiesWithout: function(noExtendedStyle,noSuperStyle) {
		var props = this.filledProperties;
		if(!noExtendedStyle && this.extendedStyle != null) props |= this.extendedStyle.allFilledProperties;
		if(!noSuperStyle && this.superStyle != null) props |= this.superStyle.allFilledProperties;
		return props;
	}
	,updateAllFilledPropertiesFlag: function() {
		this.inheritedProperties = 0;
		if(this.extendedStyle != null) this.inheritedProperties = this.extendedStyle.allFilledProperties;
		if(this.nestingStyle != null) this.inheritedProperties |= this.nestingStyle.allFilledProperties;
		if(this.superStyle != null) this.inheritedProperties |= this.superStyle.allFilledProperties;
		if(this.parentStyle != null) this.inheritedProperties |= this.parentStyle.allFilledProperties;
		this.allFilledProperties = this.filledProperties | this.inheritedProperties;
		this.inheritedProperties = (function($this) {
			var $r;
			var bits = $this.inheritedProperties;
			$r = bits &= -1 ^ $this.filledProperties;
			return $r;
		}(this));
	}
	,updateOwnerReferences: function(changedReference) {
		if((changedReference & 4) != 0) {
			if(this.extendedStyle != null) this.extendedStyle.listeners.remove(this);
			this.extendedStyle = null;
			if(this.owner != null && this.owner.extendedStyle != null) {
				this.extendedStyle = this.owner.extendedStyle.getFont();
				if(this.extendedStyle != null) this.extendedStyle.listeners.add(this);
			}
		}
		if((changedReference & 1) != 0) {
			if(this.nestingStyle != null) this.nestingStyle.listeners.remove(this);
			this.nestingStyle = null;
			if(this.owner != null && this.owner.nestingInherited != null) {
				this.nestingStyle = this.owner.nestingInherited.getFont();
				if(this.nestingStyle != null) this.nestingStyle.listeners.add(this);
			}
		}
		if((changedReference & 2) != 0) {
			if(this.superStyle != null) this.superStyle.listeners.remove(this);
			this.superStyle = null;
			if(this.owner != null && this.owner.superStyle != null) {
				this.superStyle = this.owner.superStyle.getFont();
				if(this.superStyle != null) this.superStyle.listeners.add(this);
			}
		}
		if((changedReference & 8) != 0) {
			if(this.parentStyle != null) this.parentStyle.listeners.remove(this);
			this.parentStyle = null;
			if(this.owner != null && this.owner.parentStyle != null) {
				this.parentStyle = this.owner.parentStyle.getFont();
				if(this.parentStyle != null) this.parentStyle.listeners.add(this);
			}
		}
	}
	,dispose: function() {
		this._family = null;
		this._align = null;
		this._weight = null;
		this._style = null;
		this._decoration = null;
		this._transform = null;
		this._textWrap = null;
		prime.gui.styling.StyleSubBlock.prototype.dispose.call(this);
	}
	,__class__: prime.gui.styling.TextStyle
});
if(!prime.gui.text) prime.gui.text = {}
prime.gui.text.FontStyle = { __ename__ : ["prime","gui","text","FontStyle"], __constructs__ : ["normal","italic","oblique"] }
prime.gui.text.FontStyle.normal = ["normal",0];
prime.gui.text.FontStyle.normal.toString = $estr;
prime.gui.text.FontStyle.normal.__enum__ = prime.gui.text.FontStyle;
prime.gui.text.FontStyle.italic = ["italic",1];
prime.gui.text.FontStyle.italic.toString = $estr;
prime.gui.text.FontStyle.italic.__enum__ = prime.gui.text.FontStyle;
prime.gui.text.FontStyle.oblique = ["oblique",2];
prime.gui.text.FontStyle.oblique.toString = $estr;
prime.gui.text.FontStyle.oblique.__enum__ = prime.gui.text.FontStyle;
prime.gui.text.FontWeight = { __ename__ : ["prime","gui","text","FontWeight"], __constructs__ : ["normal","bold","bolder","lighter"] }
prime.gui.text.FontWeight.normal = ["normal",0];
prime.gui.text.FontWeight.normal.toString = $estr;
prime.gui.text.FontWeight.normal.__enum__ = prime.gui.text.FontWeight;
prime.gui.text.FontWeight.bold = ["bold",1];
prime.gui.text.FontWeight.bold.toString = $estr;
prime.gui.text.FontWeight.bold.__enum__ = prime.gui.text.FontWeight;
prime.gui.text.FontWeight.bolder = ["bolder",2];
prime.gui.text.FontWeight.bolder.toString = $estr;
prime.gui.text.FontWeight.bolder.__enum__ = prime.gui.text.FontWeight;
prime.gui.text.FontWeight.lighter = ["lighter",3];
prime.gui.text.FontWeight.lighter.toString = $estr;
prime.gui.text.FontWeight.lighter.__enum__ = prime.gui.text.FontWeight;
prime.gui.text.TextAlign = { __ename__ : ["prime","gui","text","TextAlign"], __constructs__ : ["LEFT","CENTER","RIGHT","JUSTIFY"] }
prime.gui.text.TextAlign.LEFT = ["LEFT",0];
prime.gui.text.TextAlign.LEFT.toString = $estr;
prime.gui.text.TextAlign.LEFT.__enum__ = prime.gui.text.TextAlign;
prime.gui.text.TextAlign.CENTER = ["CENTER",1];
prime.gui.text.TextAlign.CENTER.toString = $estr;
prime.gui.text.TextAlign.CENTER.__enum__ = prime.gui.text.TextAlign;
prime.gui.text.TextAlign.RIGHT = ["RIGHT",2];
prime.gui.text.TextAlign.RIGHT.toString = $estr;
prime.gui.text.TextAlign.RIGHT.__enum__ = prime.gui.text.TextAlign;
prime.gui.text.TextAlign.JUSTIFY = ["JUSTIFY",3];
prime.gui.text.TextAlign.JUSTIFY.toString = $estr;
prime.gui.text.TextAlign.JUSTIFY.__enum__ = prime.gui.text.TextAlign;
prime.gui.text.TextDecoration = { __ename__ : ["prime","gui","text","TextDecoration"], __constructs__ : ["none","underline"] }
prime.gui.text.TextDecoration.none = ["none",0];
prime.gui.text.TextDecoration.none.toString = $estr;
prime.gui.text.TextDecoration.none.__enum__ = prime.gui.text.TextDecoration;
prime.gui.text.TextDecoration.underline = ["underline",1];
prime.gui.text.TextDecoration.underline.toString = $estr;
prime.gui.text.TextDecoration.underline.__enum__ = prime.gui.text.TextDecoration;
prime.gui.text.TextTransform = { __ename__ : ["prime","gui","text","TextTransform"], __constructs__ : ["none","capitalize","uppercase","lowercase"] }
prime.gui.text.TextTransform.none = ["none",0];
prime.gui.text.TextTransform.none.toString = $estr;
prime.gui.text.TextTransform.none.__enum__ = prime.gui.text.TextTransform;
prime.gui.text.TextTransform.capitalize = ["capitalize",1];
prime.gui.text.TextTransform.capitalize.toString = $estr;
prime.gui.text.TextTransform.capitalize.__enum__ = prime.gui.text.TextTransform;
prime.gui.text.TextTransform.uppercase = ["uppercase",2];
prime.gui.text.TextTransform.uppercase.toString = $estr;
prime.gui.text.TextTransform.uppercase.__enum__ = prime.gui.text.TextTransform;
prime.gui.text.TextTransform.lowercase = ["lowercase",3];
prime.gui.text.TextTransform.lowercase.toString = $estr;
prime.gui.text.TextTransform.lowercase.__enum__ = prime.gui.text.TextTransform;
prime.gui.traits.IDrawable = function() { }
prime.gui.traits.IDrawable.__name__ = ["prime","gui","traits","IDrawable"];
prime.gui.traits.IGraphicsOwner = function() { }
prime.gui.traits.IGraphicsOwner.__name__ = ["prime","gui","traits","IGraphicsOwner"];
if(!prime.neko) prime.neko = {}
if(!prime.neko.traits) prime.neko.traits = {}
prime.neko.traits.IHasTypeParameters = function() { }
prime.neko.traits.IHasTypeParameters.__name__ = ["prime","neko","traits","IHasTypeParameters"];
prime.neko.traits.IHasTypeParameters.__interfaces__ = [prime.tools.generator.ICodeFormattable];
prime.tools.CSSParser = function(styles,manifest) {
	this.timer = new prime.tools.StopWatch();
	this.styles = styles;
	this.manifest = manifest;
	this.styleSheetQueue = new prime.bindable.collections.SimpleList();
	this.blockNameExpr = new EReg("(([.#]?)([a-z][a-z0-9_]+)(:([a-z-]+))?)","i");
	this.blockExpr = new EReg("(^" + ("" + "(([.#]?)([a-z][a-z0-9_]+)(:([a-z-]+))?)" + "(" + "[ \\t]+" + "(([.#]?)([a-z][a-z0-9_]+)(:([a-z-]+))?)" + ")*") + ")" + "[" + "\\s" + "]*{" + "([" + ("\\s" + "a-z0-9%#.,:)(/\"_'-" + ":;") + "]*)" + "[" + "\\s" + "]*}","im");
	this.propExpr = new EReg("[" + "\\s" + "]*([" + "a-z0-9-" + "]+)[" + "\\s" + "]*:" + "[" + "\\s" + "]*([" + ("\\s" + "a-z0-9%#.,:)(/\"_'-") + "]+)[" + "\\s" + "]*;","im");
	this.intValExpr = new EReg("([-]?[0-9]+)","i");
	this.intUnitValExpr = new EReg("((" + "([-]?[0-9]+)" + ("(" + "px|ex|em" + "|" + "in|cm|mm|pt|pc" + ")") + "))","i");
	this.percValExpr = new EReg("((" + "([-]?(([0-9]*[.][0-9]{1,3})|[0-9]+))" + "%))","i");
	this.floatValExpr = new EReg("([-]?(([0-9]*[.][0-9]{1,3})|[0-9]+))","i");
	this.floatUnitValExpr = new EReg("((" + "([-]?(([0-9]*[.][0-9]{1,3})|[0-9]+))" + ("(" + "px|ex|em" + "|" + "in|cm|mm|pt|pc" + ")") + "))","i");
	this.floatUnitGroupValExpr = new EReg("((" + "([-]?(([0-9]*[.][0-9]{1,3})|[0-9]+))" + ("(" + "px|ex|em" + "|" + "in|cm|mm|pt|pc" + ")") + "))" + "(" + "[ \\t]+" + ("((" + "([-]?(([0-9]*[.][0-9]{1,3})|[0-9]+))" + ("(" + "px|ex|em" + "|" + "in|cm|mm|pt|pc" + ")") + "))") + ")?(" + "[ \\t]+" + ("((" + "([-]?(([0-9]*[.][0-9]{1,3})|[0-9]+))" + ("(" + "px|ex|em" + "|" + "in|cm|mm|pt|pc" + ")") + "))") + ")?(" + "[ \\t]+" + ("((" + "([-]?(([0-9]*[.][0-9]{1,3})|[0-9]+))" + ("(" + "px|ex|em" + "|" + "in|cm|mm|pt|pc" + ")") + "))") + ")?","i");
	this.pointExpr = new EReg("((" + "([-]?(([0-9]*[.][0-9]{1,3})|[0-9]+))" + ("(" + "px|ex|em" + "|" + "in|cm|mm|pt|pc" + ")") + "))" + "[ \\t]*" + "," + "[ \\t]*" + ("((" + "([-]?(([0-9]*[.][0-9]{1,3})|[0-9]+))" + ("(" + "px|ex|em" + "|" + "in|cm|mm|pt|pc" + ")") + "))"),"i");
	this.angleExpr = new EReg("([-]?(([0-9]*[.][0-9]{1,3})|[0-9]+))" + "deg","i");
	this.colorValExpr = new EReg("(" + ("(0x|#)([" + "0-9a-f" + "]{8}|[" + "0-9a-f" + "]{6}|[" + "0-9a-f" + "]{3})") + ")|(" + ("(rgba)" + ("[" + "\\s" + "]*") + "[(]((" + ("[" + "\\s" + "]*") + "([0-9]{1,2}|1[0-9]{2}|2[0-4][0-9]|25[0-5])" + ("[" + "\\s" + "]*") + "," + ("[" + "\\s" + "]*") + "){3})((0[.][0-9]+)|0|1)" + ("[" + "\\s" + "]*") + "[)]") + ")","i");
	this.fontFamilyExpr = new EReg("(" + ("(" + "serif|sans[-]serif|monospace|cursive|fantasy" + ")|((embed[(])?(['\"]([a-z0-9+.,+/\\ _-]+)['\"])[)]?)|([a-z]+)") + ")","i");
	this.fontWeightExpr = new EReg("(" + "normal|bolder|bold|lighter|inherit" + ")","i");
	this.fontStyleExpr = new EReg("(" + "normal|italic|oblique|inherit" + ")","i");
	this.linGradientExpr = new EReg("(linear-gradient)" + ("[" + "\\s" + "]*") + "[(]" + ("[" + "\\s" + "]*") + "(" + ("([-]?(([0-9]*[.][0-9]{1,3})|[0-9]+))" + "deg") + ")" + "((" + ("[ \\t]*" + "," + "[ \\t]*") + ("(" + ("(" + ("(0x|#)([" + "0-9a-f" + "]{8}|[" + "0-9a-f" + "]{6}|[" + "0-9a-f" + "]{3})") + ")|(" + ("(rgba)" + ("[" + "\\s" + "]*") + "[(]((" + ("[" + "\\s" + "]*") + "([0-9]{1,2}|1[0-9]{2}|2[0-4][0-9]|25[0-5])" + ("[" + "\\s" + "]*") + "," + ("[" + "\\s" + "]*") + "){3})((0[.][0-9]+)|0|1)" + ("[" + "\\s" + "]*") + "[)]") + ")") + ")(" + "[ \\t]+" + ("([-]?(([0-9]*[.][0-9]{1,3})|[0-9]+))" + "[%a-z]+") + ")?") + "){2,})" + "(" + ("[ \\t]*" + "," + "[ \\t]*") + "(" + "pad|reflect|repeat" + "))?" + ("[" + "\\s" + "]*") + "[)]","im");
	this.radGradientExpr = new EReg("(radial-gradient)" + ("[" + "\\s" + "]*") + "[(]" + ("[" + "\\s" + "]*") + "([-]?(0?[.][0-9]+|0|1))" + "((" + ("[ \\t]*" + "," + "[ \\t]*") + ("(" + ("(" + ("(0x|#)([" + "0-9a-f" + "]{8}|[" + "0-9a-f" + "]{6}|[" + "0-9a-f" + "]{3})") + ")|(" + ("(rgba)" + ("[" + "\\s" + "]*") + "[(]((" + ("[" + "\\s" + "]*") + "([0-9]{1,2}|1[0-9]{2}|2[0-4][0-9]|25[0-5])" + ("[" + "\\s" + "]*") + "," + ("[" + "\\s" + "]*") + "){3})((0[.][0-9]+)|0|1)" + ("[" + "\\s" + "]*") + "[)]") + ")") + ")(" + "[ \\t]+" + ("([-]?(([0-9]*[.][0-9]{1,3})|[0-9]+))" + "[%a-z]+") + ")?") + "){2,})" + "(" + ("[ \\t]*" + "," + "[ \\t]*") + "(" + "pad|reflect|repeat" + "))?" + ("[" + "\\s" + "]*") + "[)]","im");
	this.gradientColorExpr = new EReg("(" + ("(" + ("(0x|#)([" + "0-9a-f" + "]{8}|[" + "0-9a-f" + "]{6}|[" + "0-9a-f" + "]{3})") + ")|(" + ("(rgba)" + ("[" + "\\s" + "]*") + "[(]((" + ("[" + "\\s" + "]*") + "([0-9]{1,2}|1[0-9]{2}|2[0-4][0-9]|25[0-5])" + ("[" + "\\s" + "]*") + "," + ("[" + "\\s" + "]*") + "){3})((0[.][0-9]+)|0|1)" + ("[" + "\\s" + "]*") + "[)]") + ")") + ")(" + "[ \\t]+" + "(" + ("((" + "([-]?(([0-9]*[.][0-9]{1,3})|[0-9]+))" + ("(" + "px|ex|em" + "|" + "in|cm|mm|pt|pc" + ")") + "))") + "|" + ("((" + "([-]?(([0-9]*[.][0-9]{1,3})|[0-9]+))" + "%))") + ")|0)?","i");
	this.imageURIExpr = new EReg("(url)" + "[ \\t]*" + "[(]" + "[ \\t]*" + "['\"]?" + "[ \\t]*" + "(" + "[/a-z0-9/&%.#+=\\;:$@?_-]+" + ")" + "[ \\t]*" + "['\"]?" + "[ \\t]*" + "[)]","i");
	this.imageRepeatExpr = new EReg("(" + "repeat-all|no-repeat" + ")","i");
	this.classRefExpr = new EReg("(Class)" + "[ \\t]*" + "[(]" + "[ \\t]*" + "(" + ("(" + "[a-z]([a-z0-9-]*[a-z0-9])?" + ")([.]" + "[a-z]([a-z0-9-]*[a-z0-9])?" + ")*") + ")" + "[ \\t]*" + "[)]","i");
	var horLayoutEnding = "[ \\t]*" + "([(]" + "[ \\t]*" + "(left|center|right)" + "(" + ("[ \\t]*" + "," + "[ \\t]*") + "(top|center|bottom)" + ")?" + "[ \\t]*" + "[)])?";
	var verLayoutEnding = "[ \\t]*" + "([(]" + "[ \\t]*" + "(top|center|bottom)" + "(" + ("[ \\t]*" + "," + "[ \\t]*") + "(left|center|right)" + ")?" + "[ \\t]*" + "[)])?";
	this.floatHorExpr = new EReg("float-hor" + horLayoutEnding,"i");
	this.floatVerExpr = new EReg("float-ver" + verLayoutEnding,"i");
	this.floatExpr = new EReg("float" + horLayoutEnding,"i");
	this.horCircleExpr = new EReg("hor-circle" + horLayoutEnding,"i");
	this.verCircleExpr = new EReg("ver-circle" + verLayoutEnding,"i");
	this.circleExpr = new EReg("circle" + horLayoutEnding,"i");
	this.horEllipseExpr = new EReg("hor-ellipse" + horLayoutEnding,"i");
	this.verEllipseExpr = new EReg("ver-ellipse" + verLayoutEnding,"i");
	this.ellipseExpr = new EReg("ellipse" + horLayoutEnding,"i");
	this.dynamicTileExpr = new EReg("dynamic-tile" + "(" + "[ \\t]*" + "[(]" + "[ \\t]*" + "(horizontal|vertical)" + "(" + ("[ \\t]*" + "," + "[ \\t]*") + "(left|center|right)" + "(" + ("[ \\t]*" + "," + "[ \\t]*") + "(top|center|bottom)" + ")?" + ")?" + "[ \\t]*" + "[)]" + ")?","i");
	this.fixedTileExpr = new EReg("fixed-tile" + "(" + "[ \\t]*" + "[(]" + "[ \\t]*" + "(horizontal|vertical)" + "(" + ("[ \\t]*" + "," + "[ \\t]*") + "([-]?[0-9]+)" + "(" + ("[ \\t]*" + "," + "[ \\t]*") + "(left|center|right)" + "(" + ("[ \\t]*" + "," + "[ \\t]*") + "(top|center|bottom)" + ")?" + ")?" + ")?" + "[ \\t]*" + "[)]" + ")?","i");
	this.triangleExpr = new EReg("triangle" + "(" + "[ \\t]*" + "[(]" + "[ \\t]*" + ("(top[-]" + "(left|center|right)" + "|middle[-](left|right)|bottom[-]" + "(left|center|right)" + "|(" + ("((" + "([-]?(([0-9]*[.][0-9]{1,3})|[0-9]+))" + ("(" + "px|ex|em" + "|" + "in|cm|mm|pt|pc" + ")") + "))" + "[ \\t]*" + "," + "[ \\t]*" + ("((" + "([-]?(([0-9]*[.][0-9]{1,3})|[0-9]+))" + ("(" + "px|ex|em" + "|" + "in|cm|mm|pt|pc" + ")") + "))")) + "))") + "[ \\t]*" + "[)]" + ")?","i");
	this.customShapeExpr = new EReg("class" + "[ \\t]*" + "[(]" + "[ \\t]*" + "(" + ("(" + "[a-z]([a-z0-9-]*[a-z0-9])?" + ")([.]" + "[a-z]([a-z0-9-]*[a-z0-9])?" + ")*") + ")" + "[ \\t]*" + "[)]","i");
	this.filterBlurExpr = new EReg("((" + "([-]?(([0-9]*[.][0-9]{1,3})|[0-9]+))" + ("(" + "px|ex|em" + "|" + "in|cm|mm|pt|pc" + ")") + "))" + "[ \\t]+" + ("((" + "([-]?(([0-9]*[.][0-9]{1,3})|[0-9]+))" + ("(" + "px|ex|em" + "|" + "in|cm|mm|pt|pc" + ")") + "))"),"i");
	this.filterInnerExpr = new EReg("inner","i");
	this.filterHideExpr = new EReg("hide-object","i");
	this.filterKnockoutExpr = new EReg("knockout","i");
	this.filterQualityExpr = new EReg("(low|medium|high)","i");
	this.filterTypeExpr = new EReg("(inner|outer|full)","i");
	this.easingExpr = new EReg("(back|bounce|circ|cubic|elastic|expo|linear|quad|quart|quint|sine)[-]((in[-]out)|in|out)","i");
	this.timingExpr = new EReg("([1-9][0-9]*)ms","i");
	var effectFloatGroupParams = "(" + "[ \\t]*" + ("(" + ("((" + "([-]?(([0-9]*[.][0-9]{1,3})|[0-9]+))" + ("(" + "px|ex|em" + "|" + "in|cm|mm|pt|pc" + ")") + "))") + "|current)" + "[ \\t]*" + "," + "[ \\t]*" + ("(" + ("((" + "([-]?(([0-9]*[.][0-9]{1,3})|[0-9]+))" + ("(" + "px|ex|em" + "|" + "in|cm|mm|pt|pc" + ")") + "))") + "|current)")) + "[ \\t]+" + ("(" + ("((" + "([-]?(([0-9]*[.][0-9]{1,3})|[0-9]+))" + ("(" + "px|ex|em" + "|" + "in|cm|mm|pt|pc" + ")") + "))") + "|current)" + "[ \\t]*" + "," + "[ \\t]*" + ("(" + ("((" + "([-]?(([0-9]*[.][0-9]{1,3})|[0-9]+))" + ("(" + "px|ex|em" + "|" + "in|cm|mm|pt|pc" + ")") + "))") + "|current)")) + ")|(" + "[ \\t]*" + ("(" + ("((" + "([-]?(([0-9]*[.][0-9]{1,3})|[0-9]+))" + ("(" + "px|ex|em" + "|" + "in|cm|mm|pt|pc" + ")") + "))") + "|current)" + "[ \\t]*" + "," + "[ \\t]*" + ("(" + ("((" + "([-]?(([0-9]*[.][0-9]{1,3})|[0-9]+))" + ("(" + "px|ex|em" + "|" + "in|cm|mm|pt|pc" + ")") + "))") + "|current)")) + ")";
	var fadeParams = "(" + "[ \\t]*" + ("((" + "([-]?(([0-9]*[.][0-9]{1,3})|[0-9]+))" + "%))") + "[ \\t]+" + ("((" + "([-]?(([0-9]*[.][0-9]{1,3})|[0-9]+))" + "%))") + ")|(" + "[ \\t]*" + ("((" + "([-]?(([0-9]*[.][0-9]{1,3})|[0-9]+))" + "%))") + ")";
	var rotateParams = "(" + "[ \\t]*" + "(" + ("([-]?(([0-9]*[.][0-9]{1,3})|[0-9]+))" + "deg") + ")" + "[ \\t]+" + "(" + ("([-]?(([0-9]*[.][0-9]{1,3})|[0-9]+))" + "deg") + ")" + ")|(" + "[ \\t]*" + ("([-]?(([0-9]*[.][0-9]{1,3})|[0-9]+))" + "deg") + ")";
	var scaleParams = "(" + "[ \\t]*" + ("((" + "([-]?(([0-9]*[.][0-9]{1,3})|[0-9]+))" + "%))") + "[ \\t]*" + "," + "[ \\t]*" + ("((" + "([-]?(([0-9]*[.][0-9]{1,3})|[0-9]+))" + "%))") + "[ \\t]+" + ("((" + "([-]?(([0-9]*[.][0-9]{1,3})|[0-9]+))" + "%))") + "[ \\t]*" + "," + "[ \\t]*" + ("((" + "([-]?(([0-9]*[.][0-9]{1,3})|[0-9]+))" + "%))") + ")|(" + "[ \\t]*" + ("((" + "([-]?(([0-9]*[.][0-9]{1,3})|[0-9]+))" + "%))") + "[ \\t]*" + "," + "[ \\t]*" + ("((" + "([-]?(([0-9]*[.][0-9]{1,3})|[0-9]+))" + "%))") + ")";
	this.anchorScaleEffExpr = new EReg("^anchor-scale" + "(" + "[ \\t]+" + ("(top[-]" + "(left|center|right)" + "|middle[-](left|right)|bottom[-]" + "(left|center|right)" + "|(" + ("((" + "([-]?(([0-9]*[.][0-9]{1,3})|[0-9]+))" + ("(" + "px|ex|em" + "|" + "in|cm|mm|pt|pc" + ")") + "))" + "[ \\t]*" + "," + "[ \\t]*" + ("((" + "([-]?(([0-9]*[.][0-9]{1,3})|[0-9]+))" + ("(" + "px|ex|em" + "|" + "in|cm|mm|pt|pc" + ")") + "))")) + "))") + ")?" + "(" + "[ \\t]+" + ("((" + "([-]?(([0-9]*[.][0-9]{1,3})|[0-9]+))" + "%))") + ")?" + "(" + "[ \\t]+" + ("((" + "([-]?(([0-9]*[.][0-9]{1,3})|[0-9]+))" + "%))") + ")?","i");
	this.fadeEffExpr = new EReg("^fade(" + "[ \\t]+" + fadeParams + ")?","i");
	this.moveEffExpr = new EReg("^move(" + "[ \\t]+" + effectFloatGroupParams + ")?","i");
	this.resizeEffExpr = new EReg("^resize(" + "[ \\t]+" + effectFloatGroupParams + ")?","i");
	this.rotateEffExpr = new EReg("^rotate(" + "[ \\t]+" + rotateParams + ")?","i");
	this.scaleEffExpr = new EReg("^scale(" + "[ \\t]+" + scaleParams + ")?","i");
	this.wipeEffExpr = new EReg("^wipe" + "(" + "[ \\t]+" + "(top-to-bottom|bottom-to-top|left-to-right|right-to-left)" + ")?" + "(" + "[ \\t]+" + ("((" + "([-]?(([0-9]*[.][0-9]{1,3})|[0-9]+))" + ("(" + "px|ex|em" + "|" + "in|cm|mm|pt|pc" + ")") + "))") + ")?" + "(" + "[ \\t]+" + ("((" + "([-]?(([0-9]*[.][0-9]{1,3})|[0-9]+))" + ("(" + "px|ex|em" + "|" + "in|cm|mm|pt|pc" + ")") + "))") + ")?","i");
	this.setActionEffExpr = new EReg("^set-action" + "[ \\t]*" + "(" + "(" + "alpha" + "[ \\t]*" + "[(](" + fadeParams + ")" + "[ \\t]*" + "[)]" + ")|(" + "position" + "[ \\t]*" + "[(](" + effectFloatGroupParams + ")" + "[ \\t]*" + "[)]" + ")|(" + "rotation" + "[ \\t]*" + "[(](" + rotateParams + ")" + "[ \\t]*" + "[)]" + ")|(" + "size" + "[ \\t]*" + "[(](" + effectFloatGroupParams + ")" + "[ \\t]*" + "[)]" + ")|(" + "scale" + "[ \\t]*" + "[(](" + scaleParams + ")" + "[ \\t]*" + "[)]" + ")|(" + "any" + "[ \\t]*" + "[(]" + "[ \\t]*" + "([a-z][a-z0-9_+.-]*)" + "[ \\t]*" + "," + "[ \\t]*" + "([a-z0-9_+.-]+)(" + "[ \\t]*" + "," + "[ \\t]*" + "([a-z0-9_+.-]+))?" + "[ \\t]*" + "[)]" + ")" + ")?","i");
	this.sequenceEffExpr = new EReg("^sequence([^(]*)[(](.+)[)]","i");
	this.parallelEffExpr = new EReg("^parallel([^(]*)[(]([^)]+)[)]","i");
	this.effectChildrenExpr = new EReg("([a-z0-9 \\t_+%#.-]+([(]([^)]*)[)])?)(" + "[ \\t]*" + "[,]" + "[ \\t]*" + ")?","i");
};
prime.tools.CSSParser.__name__ = ["prime","tools","CSSParser"];
prime.tools.CSSParser.prototype = {
	parseAndSetHideTransition: function(v) {
		if(this.isEffect(v)) {
			if(this.currentBlock.getEffects() == null) this.currentBlock.setEffects(new prime.gui.styling.EffectsStyle());
			this.currentBlock.getEffects();
			var eff = this.currentBlock.getEffects();
			eff.setHide(v == "show"?eff.getShow():this.parseEffect(v));
		}
	}
	,parseAndSetShowTransition: function(v) {
		if(this.isEffect(v)) {
			if(this.currentBlock.getEffects() == null) this.currentBlock.setEffects(new prime.gui.styling.EffectsStyle());
			this.currentBlock.getEffects();
			var eff = this.currentBlock.getEffects();
			this.currentBlock.getEffects().setShow(v == "hide"?eff.getHide():this.parseEffect(v));
		}
	}
	,parseAndSetScaleTransition: function(v) {
		if(this.isEffect(v)) {
			if(this.currentBlock.getEffects() == null) this.currentBlock.setEffects(new prime.gui.styling.EffectsStyle());
			this.currentBlock.getEffects();
			this.currentBlock.getEffects().setScale(this.parseEffect(v));
		}
	}
	,parseAndSetRotateTransition: function(v) {
		if(this.isEffect(v)) {
			if(this.currentBlock.getEffects() == null) this.currentBlock.setEffects(new prime.gui.styling.EffectsStyle());
			this.currentBlock.getEffects();
			this.currentBlock.getEffects().setRotate(this.parseEffect(v));
		}
	}
	,parseAndSetResizeTransition: function(v) {
		if(this.isEffect(v)) {
			if(this.currentBlock.getEffects() == null) this.currentBlock.setEffects(new prime.gui.styling.EffectsStyle());
			this.currentBlock.getEffects();
			this.currentBlock.getEffects().setResize(this.parseEffect(v));
		}
	}
	,parseAndSetMoveTransition: function(v) {
		if(this.isEffect(v)) {
			if(this.currentBlock.getEffects() == null) this.currentBlock.setEffects(new prime.gui.styling.EffectsStyle());
			this.currentBlock.getEffects();
			this.currentBlock.getEffects().setMove(this.parseEffect(v));
		}
	}
	,parseEffectProperties: function(v) {
		if(!this.setActionEffExpr.match(v)) return null;
		var props = null;
		if(this.setActionEffExpr.matched(2) != null) {
			var start = this.setActionEffExpr.matched(4) != null?this.parsePercentage(this.setActionEffExpr.matched(5)):prime.types.Number.FLOAT_NOT_SET;
			var end = this.setActionEffExpr.matched(4) != null?this.parsePercentage(this.setActionEffExpr.matched(10)):this.parsePercentage(this.setActionEffExpr.matched(15));
			if(start != null && start == start || end != null && end == end) props = prime.gui.effects.EffectProperties.alpha(start,end);
		}
		if(this.setActionEffExpr.matched(21) != null) {
			var startX = this.setActionEffExpr.matched(23) != null?this.parseUnitFloat(this.setActionEffExpr.matched(24)):prime.types.Number.FLOAT_NOT_SET;
			var startY = this.setActionEffExpr.matched(23) != null?this.parseUnitFloat(this.setActionEffExpr.matched(30)):prime.types.Number.FLOAT_NOT_SET;
			var endX = this.setActionEffExpr.matched(23) != null?this.parseUnitFloat(this.setActionEffExpr.matched(36)):this.parseUnitFloat(this.setActionEffExpr.matched(49));
			var endY = this.setActionEffExpr.matched(23) != null?this.parseUnitFloat(this.setActionEffExpr.matched(42)):this.parseUnitFloat(this.setActionEffExpr.matched(55));
			if(startX != null && startX == startX || startY != null && startY == startY || endX != null && endX == endX || endY != null && endY == endY) props = prime.gui.effects.EffectProperties.position(startX,startY,endX,endY);
		}
		if(this.setActionEffExpr.matched(61) != null) {
			var start = this.setActionEffExpr.matched(63) != null?this.parseAngle(this.setActionEffExpr.matched(64)):prime.types.Number.FLOAT_NOT_SET;
			var end = this.setActionEffExpr.matched(63) != null?this.parseAngle(this.setActionEffExpr.matched(68)):this.parseAngle(this.setActionEffExpr.matched(72));
			if(start != null && start == start || end != null && end == end) props = prime.gui.effects.EffectProperties.rotation(start,end);
		}
		if(this.setActionEffExpr.matched(76) != null) {
			var startW = this.setActionEffExpr.matched(78) != null?this.parseUnitFloat(this.setActionEffExpr.matched(79)):prime.types.Number.FLOAT_NOT_SET;
			var startH = this.setActionEffExpr.matched(78) != null?this.parseUnitFloat(this.setActionEffExpr.matched(85)):prime.types.Number.FLOAT_NOT_SET;
			var endW = this.setActionEffExpr.matched(78) != null?this.parseUnitFloat(this.setActionEffExpr.matched(91)):this.parseUnitFloat(this.setActionEffExpr.matched(104));
			var endH = this.setActionEffExpr.matched(78) != null?this.parseUnitFloat(this.setActionEffExpr.matched(97)):this.parseUnitFloat(this.setActionEffExpr.matched(110));
			if(startW != null && startW == startW || startH != null && startH == startH || endW != null && endW == endW || endH != null && endH == endH) props = prime.gui.effects.EffectProperties.size(startW,startH,endW,endH);
		}
		if(this.setActionEffExpr.matched(116) != null) {
			var startX = this.setActionEffExpr.matched(118) != null?this.parsePercentage(this.setActionEffExpr.matched(119)):prime.types.Number.FLOAT_NOT_SET;
			var startY = this.setActionEffExpr.matched(118) != null?this.parsePercentage(this.setActionEffExpr.matched(124)):prime.types.Number.FLOAT_NOT_SET;
			var endX = this.setActionEffExpr.matched(118) != null?this.parsePercentage(this.setActionEffExpr.matched(129)):this.parsePercentage(this.setActionEffExpr.matched(140));
			var endY = this.setActionEffExpr.matched(118) != null?this.parsePercentage(this.setActionEffExpr.matched(134)):this.parsePercentage(this.setActionEffExpr.matched(145));
			if(startX != null && startX == startX || startY != null && startY == startY || endX != null && endX == endX || endY != null && endY == endY) props = prime.gui.effects.EffectProperties.scale(startX,startY,endX,endY);
		}
		if(this.setActionEffExpr.matched(150) != null) {
			var prop = StringTools.trim(this.setActionEffExpr.matched(151));
			var startV = this.setActionEffExpr.matched(153) != null?this.setActionEffExpr.matched(152):null;
			var endV = this.setActionEffExpr.matched(153) != null?this.setActionEffExpr.matched(154):this.setActionEffExpr.matched(152);
			if(prop != null && endV != null) props = prime.gui.effects.EffectProperties.any(prop,startV,endV);
		}
		return props;
	}
	,parseEffect: function(v) {
		var effect = null;
		if(v == "" || v == null) return effect;
		if(this.parallelEffExpr.match(v)) {
			var tmpEffect = this.parseEffectChildren(this.parallelEffExpr.matched(2),new prime.gui.effects.ParallelEffect());
			if(tmpEffect.effects.list.length > 0) effect = tmpEffect;
			this.parallelEffExpr.match(v);
			v = this.parallelEffExpr.matched(1);
			this.lastUsedEffectExpr = this.parallelEffExpr;
		} else if(this.sequenceEffExpr.match(v)) {
			var tmpEffect = this.parseEffectChildren(this.sequenceEffExpr.matched(2),new prime.gui.effects.SequenceEffect());
			if(tmpEffect.effects.list.length > 0) effect = tmpEffect;
			this.sequenceEffExpr.match(v);
			v = this.sequenceEffExpr.matched(1);
			this.lastUsedEffectExpr = this.sequenceEffExpr;
		}
		var duration = -2147483648;
		var delay = -2147483648;
		var easing = this.parseEasing(v);
		var reversed = false;
		if(easing != null) v = prime.utils.ERegUtil.removeMatch(this.easingExpr,v);
		if(v.toLowerCase().indexOf("reversed") > -1) {
			reversed = true;
			v = StringTools.replace(v,"reversed","");
		}
		if(this.timingExpr.match(v)) {
			duration = this.getInt(this.timingExpr.matched(1));
			v = prime.utils.ERegUtil.removeMatch(this.timingExpr,v);
		}
		if(this.timingExpr.match(v)) {
			delay = this.getInt(this.timingExpr.matched(1));
			v = prime.utils.ERegUtil.removeMatch(this.timingExpr,v);
		}
		if(effect != null) {
			if(easing != null) {
				if(effect.easing != easing) {
					effect.easing = easing;
					effect.invalidate(1);
				}
				easing;
			}
			if(duration != -2147483648 && duration != null) {
				if(effect.duration != duration) {
					effect.duration = duration;
					effect.invalidate(4);
				}
				duration;
			}
			if(delay != -2147483648 && delay != null) {
				if(effect.delay != delay) {
					effect.delay = delay;
					effect.invalidate(2);
				}
				delay;
			}
		} else if(this.anchorScaleEffExpr.match(v)) {
			var start = this.parsePercentage(this.anchorScaleEffExpr.matched(20));
			var end = this.parsePercentage(this.anchorScaleEffExpr.matched(25));
			effect = new prime.gui.effects.AnchorScaleEffect(duration,delay,easing,reversed,this.parsePosition(this.anchorScaleEffExpr.matched(2)),start,end);
			this.lastUsedEffectExpr = this.anchorScaleEffExpr;
		} else if(this.fadeEffExpr.match(v)) {
			var start = this.fadeEffExpr.matched(2) != null?this.parsePercentage(this.fadeEffExpr.matched(3)):prime.types.Number.FLOAT_NOT_SET;
			var end = this.fadeEffExpr.matched(2) != null?this.parsePercentage(this.fadeEffExpr.matched(8)):this.parsePercentage(this.fadeEffExpr.matched(13));
			effect = new prime.gui.effects.FadeEffect(duration,delay,easing,reversed,start,end);
			this.lastUsedEffectExpr = this.fadeEffExpr;
		} else if(this.moveEffExpr.match(v)) {
			var startX = this.moveEffExpr.matched(2) != null?this.parseUnitFloat(this.moveEffExpr.matched(4)):prime.types.Number.FLOAT_NOT_SET;
			var startY = this.moveEffExpr.matched(2) != null?this.parseUnitFloat(this.moveEffExpr.matched(11)):prime.types.Number.FLOAT_NOT_SET;
			var endX = this.moveEffExpr.matched(2) != null?this.parseUnitFloat(this.moveEffExpr.matched(18)):this.parseUnitFloat(this.moveEffExpr.matched(33));
			var endY = this.moveEffExpr.matched(2) != null?this.parseUnitFloat(this.moveEffExpr.matched(24)):this.parseUnitFloat(this.moveEffExpr.matched(40));
			effect = new prime.gui.effects.MoveEffect(duration,delay,easing,reversed,startX,startY,endX,endY);
			this.lastUsedEffectExpr = this.moveEffExpr;
		} else if(this.resizeEffExpr.match(v)) {
			var startW = this.resizeEffExpr.matched(2) != null?this.parseUnitFloat(this.resizeEffExpr.matched(3)):prime.types.Number.FLOAT_NOT_SET;
			var startH = this.resizeEffExpr.matched(2) != null?this.parseUnitFloat(this.resizeEffExpr.matched(9)):prime.types.Number.FLOAT_NOT_SET;
			var endW = this.resizeEffExpr.matched(2) != null?this.parseUnitFloat(this.resizeEffExpr.matched(15)):this.parseUnitFloat(this.resizeEffExpr.matched(28));
			var endH = this.resizeEffExpr.matched(2) != null?this.parseUnitFloat(this.resizeEffExpr.matched(21)):this.parseUnitFloat(this.resizeEffExpr.matched(34));
			effect = new prime.gui.effects.ResizeEffect(duration,delay,easing,reversed,startW,startH,endW,endH);
			this.lastUsedEffectExpr = this.resizeEffExpr;
		} else if(this.rotateEffExpr.match(v)) {
			var start = this.rotateEffExpr.matched(2) != null?this.parseAngle(this.rotateEffExpr.matched(3)):prime.types.Number.FLOAT_NOT_SET;
			var end = this.rotateEffExpr.matched(2) != null?this.parseAngle(this.rotateEffExpr.matched(7)):this.parseAngle(this.rotateEffExpr.matched(11));
			effect = new prime.gui.effects.RotateEffect(duration,delay,easing,reversed,start,end);
			this.lastUsedEffectExpr = this.rotateEffExpr;
		} else if(this.scaleEffExpr.match(v)) {
			var startX = this.scaleEffExpr.matched(2) != null?this.parsePercentage(this.scaleEffExpr.matched(3)):prime.types.Number.FLOAT_NOT_SET;
			var startY = this.scaleEffExpr.matched(2) != null?this.parsePercentage(this.scaleEffExpr.matched(8)):prime.types.Number.FLOAT_NOT_SET;
			var endX = this.scaleEffExpr.matched(2) != null?this.parsePercentage(this.scaleEffExpr.matched(13)):this.parsePercentage(this.scaleEffExpr.matched(24));
			var endY = this.scaleEffExpr.matched(2) != null?this.parsePercentage(this.scaleEffExpr.matched(18)):this.parsePercentage(this.scaleEffExpr.matched(29));
			effect = new prime.gui.effects.ScaleEffect(duration,delay,easing,reversed,startX,startY,endX,endY);
			this.lastUsedEffectExpr = this.scaleEffExpr;
		} else if(this.wipeEffExpr.match(v)) {
			var direction = this.parseMoveDirection(this.wipeEffExpr.matched(1));
			var start = this.wipeEffExpr.matched(10) != null?this.parseUnitFloat(this.wipeEffExpr.matched(4)):prime.types.Number.FLOAT_NOT_SET;
			var end = this.wipeEffExpr.matched(10) != null?this.parseUnitFloat(this.wipeEffExpr.matched(11)):this.parseUnitFloat(this.wipeEffExpr.matched(4));
			effect = new prime.gui.effects.WipeEffect(duration,delay,easing,reversed,direction,start,end);
			this.lastUsedEffectExpr = this.wipeEffExpr;
		} else if(this.setActionEffExpr.match(v)) {
			var props = this.parseEffectProperties(v);
			effect = new prime.gui.effects.SetAction(duration,delay,easing,reversed,props);
			this.lastUsedEffectExpr = this.setActionEffExpr;
		}
		return effect;
	}
	,parseEffectChildren: function(params,effect) {
		while(true) {
			if(!this.effectChildrenExpr.match(params)) break;
			params = prime.utils.ERegUtil.removeMatch(this.effectChildrenExpr,params);
			var cEffect = this.parseEffect(StringTools.trim(this.effectChildrenExpr.matched(1)));
			if(cEffect != null) effect.add(cEffect);
		}
		return effect;
	}
	,parseEasing: function(v) {
		var easing = null;
		if(this.easingExpr.match(v)) {
			var method = (function($this) {
				var $r;
				switch($this.easingExpr.matched(1).toLowerCase()) {
				case "back":
					$r = "feffects.easing.Back";
					break;
				case "bounce":
					$r = "feffects.easing.Bounce";
					break;
				case "circ":
					$r = "feffects.easing.Circ";
					break;
				case "cubic":
					$r = "feffects.easing.Cubic";
					break;
				case "elastic":
					$r = "feffects.easing.Elastic";
					break;
				case "expo":
					$r = "feffects.easing.Expo";
					break;
				case "linear":
					$r = "feffects.easing.Linear";
					break;
				case "quad":
					$r = "feffects.easing.Quad";
					break;
				case "quart":
					$r = "feffects.easing.Quart";
					break;
				case "quint":
					$r = "feffects.easing.Quint";
					break;
				case "sine":
					$r = "feffects.easing.Sine";
					break;
				default:
					$r = null;
				}
				return $r;
			}(this));
			if(method != null) method += (function($this) {
				var $r;
				switch($this.easingExpr.matched(2).toLowerCase()) {
				case "in":
					$r = ".easeIn";
					break;
				case "out":
					$r = ".easeOut";
					break;
				default:
					$r = ".easeInOut";
				}
				return $r;
			}(this));
			if(method != null) easing = prime.types.Reference.func(method,this.easingExpr.matched(0));
		}
		return easing;
	}
	,isEffect: function(v) {
		return v == "show" || v == "hide" || this.anchorScaleEffExpr.match(v) || this.fadeEffExpr.match(v) || this.moveEffExpr.match(v) || this.resizeEffExpr.match(v) || this.rotateEffExpr.match(v) || this.scaleEffExpr.match(v) || this.wipeEffExpr.match(v) || this.parallelEffExpr.match(v) || this.sequenceEffExpr.match(v);
	}
	,parseAndSetOverflow: function(v) {
		var setFlag = false, className = null;
		switch(StringTools.trim(v).toLowerCase()) {
		case "hidden":
			className = "prime.gui.behaviours.layout.ClippedLayoutBehaviour";
			break;
		case "scroll-mouse-move":
			className = "prime.gui.behaviours.scroll.MouseMoveScrollBehaviour";
			break;
		case "drag-scroll":
			className = "prime.gui.behaviours.scroll.DragScrollBehaviour";
			break;
		case "corner-scroll":
			className = "prime.gui.behaviours.scroll.CornerScrollBehaviour";
			break;
		case "scrollbars":
			className = "prime.gui.behaviours.scroll.ShowScrollbarsBehaviour";
			break;
		case "visible":
			setFlag = true;
			break;
		default:
			throw "unkown overflow";
		}
		if(className != null) ((function($this) {
			var $r;
			if($this.currentBlock.getGraphics() == null) $this.currentBlock.setGraphics(new prime.gui.styling.GraphicsStyle());
			$r = $this.currentBlock.getGraphics();
			return $r;
		}(this))).setOverflow(new prime.types.Factory(className,[],["a"],StringTools.trim(v))); else if(setFlag) ((function($this) {
			var $r;
			if($this.currentBlock.getGraphics() == null) $this.currentBlock.setGraphics(new prime.gui.styling.GraphicsStyle());
			$r = $this.currentBlock.getGraphics();
			return $r;
		}(this))).markProperty(128,true);
	}
	,parseAndSetIconFill: function(v) {
		if(StringTools.trim(v).toLowerCase() != "inherit" && this.colorValExpr.match(v)) ((function($this) {
			var $r;
			if($this.currentBlock.getGraphics() == null) $this.currentBlock.setGraphics(new prime.gui.styling.GraphicsStyle());
			$r = $this.currentBlock.getGraphics();
			return $r;
		}(this))).setIconFill(new prime.gui.graphics.fills.SolidFill(this.parseColor(v))); else if(StringTools.trim(v).toLowerCase() == "none") ((function($this) {
			var $r;
			if($this.currentBlock.getGraphics() == null) $this.currentBlock.setGraphics(new prime.gui.styling.GraphicsStyle());
			$r = $this.currentBlock.getGraphics();
			return $r;
		}(this))).markProperty(512,true);
	}
	,parseAndSetIcon: function(v) {
		var bmp = this.parseAsset(v);
		if(bmp != null) ((function($this) {
			var $r;
			if($this.currentBlock.getGraphics() == null) $this.currentBlock.setGraphics(new prime.gui.styling.GraphicsStyle());
			$r = $this.currentBlock.getGraphics();
			return $r;
		}(this))).setIcon(bmp);
	}
	,parseAndSetOpacity: function(v) {
		if(this.floatValExpr.match(v)) ((function($this) {
			var $r;
			if($this.currentBlock.getGraphics() == null) $this.currentBlock.setGraphics(new prime.gui.styling.GraphicsStyle());
			$r = $this.currentBlock.getGraphics();
			return $r;
		}(this))).setOpacity(this.parseFloat(v));
	}
	,parseAndSetVisibility: function(v) {
		((function($this) {
			var $r;
			if($this.currentBlock.getGraphics() == null) $this.currentBlock.setGraphics(new prime.gui.styling.GraphicsStyle());
			$r = $this.currentBlock.getGraphics();
			return $r;
		}(this))).setVisible((function($this) {
			var $r;
			switch(StringTools.trim(v).toLowerCase()) {
			case "visible":
				$r = true;
				break;
			case "hidden":
				$r = false;
				break;
			default:
				$r = null;
			}
			return $r;
		}(this)));
	}
	,parseAndSetSkin: function(v) {
		if(v != null && this.classRefExpr.match(v)) ((function($this) {
			var $r;
			if($this.currentBlock.getGraphics() == null) $this.currentBlock.setGraphics(new prime.gui.styling.GraphicsStyle());
			$r = $this.currentBlock.getGraphics();
			return $r;
		}(this))).setSkin(v != null && this.classRefExpr.match(v)?new prime.types.Factory(this.classRefExpr.matched(2),null,null,v):null); else if(StringTools.trim(v).toLowerCase() == "none") ((function($this) {
			var $r;
			if($this.currentBlock.getGraphics() == null) $this.currentBlock.setGraphics(new prime.gui.styling.GraphicsStyle());
			$r = $this.currentBlock.getGraphics();
			return $r;
		}(this))).markProperty(1,true);
	}
	,parseAndSetBackgroundGradientGlow: function(v) {
		var filter = this.parseGradientGlowFilter(v);
		if(filter != null) {
			if(this.currentBlock.getBgFilters() == null) this.currentBlock.setBgFilters(new prime.gui.styling.FiltersStyle(null,prime.gui.styling.FilterCollectionType.background));
			this.currentBlock.getBgFilters();
			this.currentBlock.getBgFilters().setGradientGlow(filter);
		}
	}
	,parseAndSetBackgroundGradientBevel: function(v) {
		var filter = this.parseGradientBevelFilter(v);
		if(filter != null) {
			if(this.currentBlock.getBgFilters() == null) this.currentBlock.setBgFilters(new prime.gui.styling.FiltersStyle(null,prime.gui.styling.FilterCollectionType.background));
			this.currentBlock.getBgFilters();
			this.currentBlock.getBgFilters().setGradientBevel(filter);
		}
	}
	,parseAndSetBackgroundGlow: function(v) {
		var filter = this.parseGlowFilter(v);
		if(filter != null) {
			if(this.currentBlock.getBgFilters() == null) this.currentBlock.setBgFilters(new prime.gui.styling.FiltersStyle(null,prime.gui.styling.FilterCollectionType.background));
			this.currentBlock.getBgFilters();
			this.currentBlock.getBgFilters().setGlow(filter);
		}
	}
	,parseAndSetBackgroundShadow: function(v) {
		var filter = this.parseShadowFilter(v);
		if(filter != null) {
			if(this.currentBlock.getBgFilters() == null) this.currentBlock.setBgFilters(new prime.gui.styling.FiltersStyle(null,prime.gui.styling.FilterCollectionType.background));
			this.currentBlock.getBgFilters();
			this.currentBlock.getBgFilters().setShadow(filter);
		}
	}
	,parseAndSetBackgroundBlur: function(v) {
		var filter = this.parseBlurFilter(v);
		if(filter != null) {
			if(this.currentBlock.getBgFilters() == null) this.currentBlock.setBgFilters(new prime.gui.styling.FiltersStyle(null,prime.gui.styling.FilterCollectionType.background));
			this.currentBlock.getBgFilters();
			this.currentBlock.getBgFilters().setBlur(filter);
		}
	}
	,parseAndSetBackgroundBevel: function(v) {
		var filter = this.parseBevelFilter(v);
		if(filter != null) {
			if(this.currentBlock.getBgFilters() == null) this.currentBlock.setBgFilters(new prime.gui.styling.FiltersStyle(null,prime.gui.styling.FilterCollectionType.background));
			this.currentBlock.getBgFilters();
			this.currentBlock.getBgFilters().setBevel(filter);
		}
	}
	,parseAndSetBoxGradientGlow: function(v) {
		var filter = this.parseGradientGlowFilter(v);
		if(filter != null) {
			if(this.currentBlock.getBoxFilters() == null) this.currentBlock.setBoxFilters(new prime.gui.styling.FiltersStyle(null,prime.gui.styling.FilterCollectionType.box));
			this.currentBlock.getBoxFilters();
			this.currentBlock.getBoxFilters().setGradientGlow(filter);
		}
	}
	,parseAndSetBoxGradientBevel: function(v) {
		var filter = this.parseGradientBevelFilter(v);
		if(filter != null) {
			if(this.currentBlock.getBoxFilters() == null) this.currentBlock.setBoxFilters(new prime.gui.styling.FiltersStyle(null,prime.gui.styling.FilterCollectionType.box));
			this.currentBlock.getBoxFilters();
			this.currentBlock.getBoxFilters().setGradientBevel(filter);
		}
	}
	,parseAndSetBoxGlow: function(v) {
		var filter = this.parseGlowFilter(v);
		if(filter != null) {
			if(this.currentBlock.getBoxFilters() == null) this.currentBlock.setBoxFilters(new prime.gui.styling.FiltersStyle(null,prime.gui.styling.FilterCollectionType.box));
			this.currentBlock.getBoxFilters();
			this.currentBlock.getBoxFilters().setGlow(filter);
		}
	}
	,parseAndSetBoxShadow: function(v) {
		var filter = this.parseShadowFilter(v);
		if(filter != null) {
			if(this.currentBlock.getBoxFilters() == null) this.currentBlock.setBoxFilters(new prime.gui.styling.FiltersStyle(null,prime.gui.styling.FilterCollectionType.box));
			this.currentBlock.getBoxFilters();
			this.currentBlock.getBoxFilters().setShadow(filter);
		}
	}
	,parseAndSetBoxBlur: function(v) {
		var filter = this.parseBlurFilter(v);
		if(filter != null) {
			if(this.currentBlock.getBoxFilters() == null) this.currentBlock.setBoxFilters(new prime.gui.styling.FiltersStyle(null,prime.gui.styling.FilterCollectionType.box));
			this.currentBlock.getBoxFilters();
			this.currentBlock.getBoxFilters().setBlur(filter);
		}
	}
	,parseAndSetBoxBevel: function(v) {
		var filter = this.parseBevelFilter(v);
		if(filter != null) {
			if(this.currentBlock.getBoxFilters() == null) this.currentBlock.setBoxFilters(new prime.gui.styling.FiltersStyle(null,prime.gui.styling.FilterCollectionType.box));
			this.currentBlock.getBoxFilters();
			this.currentBlock.getBoxFilters().setBevel(filter);
		}
	}
	,parseGradientGlowFilter: function(v) {
		return this.parseGradientBevelFilter(v,new prime.gui.filters.GradientGlowFilter());
	}
	,parseGradientBevelFilter: function(v,f) {
		if(f == null) f = new prime.gui.filters.GradientBevelFilter();
		var isValid = false;
		if(this.angleExpr.match(v)) {
			f.angle = this.parseAngle(v);
			isValid = true;
			v = prime.utils.ERegUtil.removeMatch(this.angleExpr,v);
		}
		while(true) {
			if(!this.gradientColorExpr.match(v)) break;
			var pos = -1;
			if(this.gradientColorExpr.matched(16) != null) pos = this.getInt(this.gradientColorExpr.matched(16)); else if(this.gradientColorExpr.matched(20) != null) {
				var a = this.getFloat(this.gradientColorExpr.matched(21));
				pos = (function($this) {
					var $r;
					var var1 = a / 100 * 255;
					$r = (var1 < 0?-.5:.5) + var1 | 0;
					return $r;
				}(this));
			}
			var c = (function($this) {
				var $r;
				var v1 = $this.gradientColorExpr.matched(4);
				if(v1.length == 3) v1 = v1.charAt(0) + v1.charAt(0) + v1.charAt(1) + v1.charAt(1) + v1.charAt(2) + v1.charAt(2);
				if(v1.length == 6) v1 += "FF";
				$r = (function($this) {
					var $r;
					var v2 = Std.parseInt("0x" + v1);
					$r = (function($this) {
						var $r;
						var value = (v2 & -256) >>> 8;
						if(value < 0) value = 0; else if(value > 16777215) value = 16777215;
						$r = value;
						return $r;
					}($this)) << 8 | (function($this) {
						var $r;
						var value = v2 & 255;
						if(value < 0) value = 0; else if(value > 255) value = 255;
						$r = value;
						return $r;
					}($this));
					return $r;
				}($this));
				return $r;
			}(this));
			f.colors.push((c & -256) >>> 8);
			f.alphas.push((c & 255) / 255);
			f.ratios.push(pos);
			v = prime.utils.ERegUtil.removeMatch(this.colorValExpr,v);
		}
		if(f.colors.length > 0) {
			var stepSize = 255 / (f.ratios.length - 1);
			var _g1 = 0, _g = f.ratios.length;
			while(_g1 < _g) {
				var i = _g1++;
				if(f.ratios[i] == -1) f.ratios[i] = (function($this) {
					var $r;
					var var1 = stepSize * i;
					$r = (var1 < 0?-.5:.5) + var1 | 0;
					return $r;
				}(this));
			}
		}
		isValid = f.colors.length > 1;
		if(isValid && (this.floatUnitValExpr.match(v) && this.floatUnitValExpr.matched(1) != null)) {
			f.distance = this.parseUnitFloat(v);
			v = prime.utils.ERegUtil.removeMatch(this.floatUnitValExpr,v);
		}
		if(isValid && this.filterBlurExpr.match(v)) {
			f.blurX = this.getFloat(this.filterBlurExpr.matched(3));
			f.blurY = this.getFloat(this.filterBlurExpr.matched(10));
			v = prime.utils.ERegUtil.removeMatch(this.filterBlurExpr,v);
		}
		if(isValid && this.floatValExpr.match(v)) {
			f.strength = this.parseFloat(v);
			v = prime.utils.ERegUtil.removeMatch(this.floatValExpr,v);
		}
		if(isValid) {
			if(this.filterTypeExpr.match(v)) {
				var tStr = this.filterTypeExpr.matched(1);
				f.type = this.parseFilterType(tStr);
				v = prime.utils.ERegUtil.removeMatch(this.filterTypeExpr,v);
			} else f.type = prime.gui.filters.BitmapFilterType.OUTER;
		}
		if(isValid && this.filterKnockoutExpr.match(v)) {
			f.knockout = true;
			v = prime.utils.ERegUtil.removeMatch(this.filterKnockoutExpr,v);
		}
		if(isValid && this.filterQualityExpr.match(v)) {
			var qStr = this.filterQualityExpr.matched(1);
			f.quality = (function($this) {
				var $r;
				switch(qStr.toLowerCase()) {
				case "low":
					$r = 1;
					break;
				case "medium":
					$r = 2;
					break;
				case "high":
					$r = 3;
					break;
				default:
					$r = 1;
				}
				return $r;
			}(this));
			v = prime.utils.ERegUtil.removeMatch(this.filterQualityExpr,v);
		}
		return isValid?f:null;
	}
	,parseGlowFilter: function(v) {
		var f = new prime.gui.filters.GlowFilter();
		var isValid = false;
		if(StringTools.trim(v).toLowerCase() != "inherit" && this.colorValExpr.match(v)) {
			var c = this.parseColor(v);
			f.color = (c & -256) >>> 8;
			f.alpha = (c & 255) / 255;
			isValid = true;
			v = prime.utils.ERegUtil.removeMatch(this.colorValExpr,v);
		}
		if(this.filterBlurExpr.match(v)) {
			f.blurX = this.getFloat(this.filterBlurExpr.matched(3));
			f.blurY = this.getFloat(this.filterBlurExpr.matched(10));
			isValid = true;
			v = prime.utils.ERegUtil.removeMatch(this.filterBlurExpr,v);
		}
		if(this.floatValExpr.match(v)) {
			f.strength = this.parseFloat(v);
			isValid = true;
			v = prime.utils.ERegUtil.removeMatch(this.floatValExpr,v);
		}
		if(this.filterInnerExpr.match(v)) {
			f.inner = true;
			isValid = true;
			v = prime.utils.ERegUtil.removeMatch(this.filterInnerExpr,v);
		}
		if(this.filterKnockoutExpr.match(v)) {
			f.knockout = true;
			isValid = true;
			v = prime.utils.ERegUtil.removeMatch(this.filterKnockoutExpr,v);
		}
		if(this.filterQualityExpr.match(v)) {
			var qStr = this.filterQualityExpr.matched(1);
			isValid = true;
			f.quality = (function($this) {
				var $r;
				switch(qStr.toLowerCase()) {
				case "low":
					$r = 1;
					break;
				case "medium":
					$r = 2;
					break;
				case "high":
					$r = 3;
					break;
				default:
					$r = 1;
				}
				return $r;
			}(this));
			v = prime.utils.ERegUtil.removeMatch(this.filterQualityExpr,v);
		}
		return isValid?f:null;
	}
	,parseShadowFilter: function(v) {
		var f = new prime.gui.filters.DropShadowFilter();
		var isValid = false;
		if(this.angleExpr.match(v)) {
			f.angle = this.parseAngle(v);
			isValid = true;
			v = prime.utils.ERegUtil.removeMatch(this.angleExpr,v);
		}
		if(StringTools.trim(v).toLowerCase() != "inherit" && this.colorValExpr.match(v)) {
			var c = this.parseColor(v);
			f.color = (c & -256) >>> 8;
			f.alpha = (c & 255) / 255;
			isValid = true;
			v = prime.utils.ERegUtil.removeMatch(this.colorValExpr,v);
		}
		if(this.floatUnitValExpr.match(v) && this.floatUnitValExpr.matched(1) != null) {
			f.distance = this.parseUnitFloat(v);
			isValid = true;
			v = prime.utils.ERegUtil.removeMatch(this.floatUnitValExpr,v);
		}
		if(this.filterBlurExpr.match(v)) {
			f.blurX = this.getFloat(this.filterBlurExpr.matched(3));
			f.blurY = this.getFloat(this.filterBlurExpr.matched(10));
			isValid = true;
			v = prime.utils.ERegUtil.removeMatch(this.filterBlurExpr,v);
		}
		if(this.floatValExpr.match(v)) {
			f.strength = this.parseFloat(v);
			isValid = true;
			v = prime.utils.ERegUtil.removeMatch(this.floatValExpr,v);
		}
		if(this.filterInnerExpr.match(v)) {
			f.inner = true;
			isValid = true;
			v = prime.utils.ERegUtil.removeMatch(this.filterInnerExpr,v);
		}
		if(this.filterHideExpr.match(v)) {
			f.hideObject = true;
			isValid = true;
			v = prime.utils.ERegUtil.removeMatch(this.filterHideExpr,v);
		}
		if(this.filterKnockoutExpr.match(v)) {
			f.knockout = true;
			isValid = true;
			v = prime.utils.ERegUtil.removeMatch(this.filterKnockoutExpr,v);
		}
		if(this.filterQualityExpr.match(v)) {
			var qStr = this.filterQualityExpr.matched(1);
			isValid = true;
			f.quality = (function($this) {
				var $r;
				switch(qStr.toLowerCase()) {
				case "low":
					$r = 1;
					break;
				case "medium":
					$r = 2;
					break;
				case "high":
					$r = 3;
					break;
				default:
					$r = 1;
				}
				return $r;
			}(this));
			v = prime.utils.ERegUtil.removeMatch(this.filterQualityExpr,v);
		}
		return isValid?f:null;
	}
	,parseBlurFilter: function(v) {
		var f = new prime.gui.filters.BlurFilter();
		var isValid = false;
		if(this.filterBlurExpr.match(v)) {
			f.blurX = this.getFloat(this.filterBlurExpr.matched(3));
			f.blurY = this.getFloat(this.filterBlurExpr.matched(10));
			isValid = true;
			v = prime.utils.ERegUtil.removeMatch(this.filterBlurExpr,v);
		}
		if(this.filterQualityExpr.match(v)) {
			var qStr = this.filterQualityExpr.matched(1);
			isValid = true;
			f.quality = (function($this) {
				var $r;
				switch(qStr.toLowerCase()) {
				case "low":
					$r = 1;
					break;
				case "medium":
					$r = 2;
					break;
				case "high":
					$r = 3;
					break;
				default:
					$r = 1;
				}
				return $r;
			}(this));
			v = prime.utils.ERegUtil.removeMatch(this.filterQualityExpr,v);
		}
		return isValid?f:null;
	}
	,parseBevelFilter: function(v) {
		var f = new prime.gui.filters.BevelFilter();
		var isValid = false;
		if(this.angleExpr.match(v)) {
			f.angle = this.parseAngle(v);
			isValid = true;
			v = prime.utils.ERegUtil.removeMatch(this.angleExpr,v);
		}
		if(StringTools.trim(v).toLowerCase() != "inherit" && this.colorValExpr.match(v)) {
			var c = this.parseColor(v);
			f.highlightColor = (c & -256) >>> 8;
			f.highlightAlpha = (c & 255) / 255;
			isValid = true;
			v = prime.utils.ERegUtil.removeMatch(this.colorValExpr,v);
		}
		if(StringTools.trim(v).toLowerCase() != "inherit" && this.colorValExpr.match(v)) {
			var c = this.parseColor(v);
			f.shadowColor = (c & -256) >>> 8;
			f.shadowAlpha = (c & 255) / 255;
			isValid = true;
			v = prime.utils.ERegUtil.removeMatch(this.colorValExpr,v);
		}
		if(this.floatUnitValExpr.match(v) && this.floatUnitValExpr.matched(1) != null) {
			f.distance = this.parseUnitFloat(v);
			isValid = true;
			v = prime.utils.ERegUtil.removeMatch(this.floatUnitValExpr,v);
		}
		if(this.filterBlurExpr.match(v)) {
			f.blurX = this.getFloat(this.filterBlurExpr.matched(3));
			f.blurY = this.getFloat(this.filterBlurExpr.matched(10));
			isValid = true;
			v = prime.utils.ERegUtil.removeMatch(this.filterBlurExpr,v);
		}
		if(this.intValExpr.match(v)) {
			f.strength = this.parseInt(v);
			isValid = true;
			v = prime.utils.ERegUtil.removeMatch(this.intValExpr,v);
		}
		if(this.filterTypeExpr.match(v)) {
			var tStr = this.filterTypeExpr.matched(1);
			f.type = this.parseFilterType(tStr);
			isValid = true;
			v = prime.utils.ERegUtil.removeMatch(this.filterTypeExpr,v);
		}
		if(this.filterKnockoutExpr.match(v)) {
			f.knockout = true;
			isValid = true;
			v = prime.utils.ERegUtil.removeMatch(this.filterKnockoutExpr,v);
		}
		if(this.filterQualityExpr.match(v)) {
			var qStr = this.filterQualityExpr.matched(1);
			isValid = true;
			f.quality = (function($this) {
				var $r;
				switch(qStr.toLowerCase()) {
				case "low":
					$r = 1;
					break;
				case "medium":
					$r = 2;
					break;
				case "high":
					$r = 3;
					break;
				default:
					$r = 1;
				}
				return $r;
			}(this));
			v = prime.utils.ERegUtil.removeMatch(this.filterQualityExpr,v);
		}
		return isValid?f:null;
	}
	,parseFilterType: function(v) {
		return (function($this) {
			var $r;
			switch(v.toLowerCase()) {
			case "inner":
				$r = prime.gui.filters.BitmapFilterType.INNER;
				break;
			case "outer":
				$r = prime.gui.filters.BitmapFilterType.OUTER;
				break;
			case "full":
				$r = prime.gui.filters.BitmapFilterType.FULL;
				break;
			default:
				$r = prime.gui.filters.BitmapFilterType.INNER;
			}
			return $r;
		}(this));
	}
	,parseAndSetLayoutAlgorithm: function(v) {
		var info = new prime.types.Factory();
		var v1 = StringTools.trim(v).toLowerCase();
		var setFlag = false;
		if(v1 == "relative") info.classRef = this.algorithmToClass(prime.tools._CSSParser.Algorithms.relative); else if(v1 == "none") {
			info.classRef = null;
			setFlag = true;
		} else if(v1 == "inherit") info.classRef = null; else if(v1 == "tile") info.classRef = this.algorithmToClass(prime.tools._CSSParser.Algorithms.simpleTile); else if(this.floatHorExpr.match(v1)) {
			info.classRef = this.algorithmToClass(prime.tools._CSSParser.Algorithms.floatHor);
			info.params = [this.parseHorDirection(this.floatHorExpr.matched(2)),this.parseVerDirection(this.floatHorExpr.matched(4))];
		} else if(this.floatVerExpr.match(v1)) {
			info.classRef = this.algorithmToClass(prime.tools._CSSParser.Algorithms.floatVer);
			info.params = [this.parseVerDirection(this.floatVerExpr.matched(2)),this.parseHorDirection(this.floatVerExpr.matched(4))];
		} else if(this.floatExpr.match(v1)) {
			info.classRef = this.algorithmToClass(prime.tools._CSSParser.Algorithms.dynamicLayout);
			info.params = [new prime.types.Factory(this.algorithmToClass(prime.tools._CSSParser.Algorithms.floatHor),[this.parseHorDirection(this.floatExpr.matched(2))]),new prime.types.Factory(this.algorithmToClass(prime.tools._CSSParser.Algorithms.floatVer),[this.parseVerDirection(this.floatExpr.matched(4))])];
		} else if(this.horCircleExpr.match(v1)) {
			info.classRef = this.algorithmToClass(prime.tools._CSSParser.Algorithms.circleHor);
			info.params = [this.parseHorDirection(this.horCircleExpr.matched(2)),this.parseVerDirection(this.horCircleExpr.matched(4)),false];
		} else if(this.verCircleExpr.match(v1)) {
			info.classRef = this.algorithmToClass(prime.tools._CSSParser.Algorithms.circleVer);
			info.params = [this.parseVerDirection(this.verCircleExpr.matched(2)),this.parseHorDirection(this.verCircleExpr.matched(4)),false];
		} else if(this.circleExpr.match(v1)) {
			info.classRef = this.algorithmToClass(prime.tools._CSSParser.Algorithms.dynamicLayout);
			info.params = [new prime.types.Factory(this.algorithmToClass(prime.tools._CSSParser.Algorithms.circleHor),[this.parseHorDirection(this.circleExpr.matched(2)),null,false]),new prime.types.Factory(this.algorithmToClass(prime.tools._CSSParser.Algorithms.circleVer),[this.parseVerDirection(this.circleExpr.matched(4)),null,false])];
		} else if(this.horEllipseExpr.match(v1)) {
			info.classRef = this.algorithmToClass(prime.tools._CSSParser.Algorithms.circleHor);
			info.params = [this.parseHorDirection(this.horEllipseExpr.matched(2)),this.parseVerDirection(this.horEllipseExpr.matched(4))];
		} else if(this.verEllipseExpr.match(v1)) {
			info.classRef = this.algorithmToClass(prime.tools._CSSParser.Algorithms.circleVer);
			info.params = [this.parseVerDirection(this.verEllipseExpr.matched(2)),this.parseHorDirection(this.verEllipseExpr.matched(4))];
		} else if(this.ellipseExpr.match(v1)) {
			info.classRef = this.algorithmToClass(prime.tools._CSSParser.Algorithms.dynamicLayout);
			info.params = [new prime.types.Factory(this.algorithmToClass(prime.tools._CSSParser.Algorithms.circleHor),[this.parseHorDirection(this.horEllipseExpr.matched(2))]),new prime.types.Factory(this.algorithmToClass(prime.tools._CSSParser.Algorithms.circleVer),[this.parseVerDirection(this.horEllipseExpr.matched(4))])];
		} else if(this.dynamicTileExpr.match(v1)) {
			if(this.dynamicTileExpr.matched(1) == null) info.classRef = this.algorithmToClass(prime.tools._CSSParser.Algorithms.dynamicTile); else {
				info.classRef = this.algorithmToClass(prime.tools._CSSParser.Algorithms.dynamicTile);
				info.params.push(this.parseDirection(this.dynamicTileExpr.matched(3)));
				info.params.push(this.dynamicTileExpr.matched(5) != null?this.parseHorDirection(this.dynamicTileExpr.matched(5)):null);
				info.params.push(this.dynamicTileExpr.matched(7) != null?this.parseVerDirection(this.dynamicTileExpr.matched(7)):null);
			}
		} else if(this.fixedTileExpr.match(v1)) {
			if(this.fixedTileExpr.matched(1) == null) info.classRef = this.algorithmToClass(prime.tools._CSSParser.Algorithms.fixedTile); else {
				info.classRef = this.algorithmToClass(prime.tools._CSSParser.Algorithms.fixedTile);
				info.params.push(this.parseDirection(this.fixedTileExpr.matched(2)));
				info.params.push(this.fixedTileExpr.matched(4) != null?this.getInt(this.fixedTileExpr.matched(4)):-2147483648);
				info.params.push(this.fixedTileExpr.matched(6) != null?this.parseHorDirection(this.fixedTileExpr.matched(6)):null);
				info.params.push(this.fixedTileExpr.matched(8) != null?this.parseVerDirection(this.fixedTileExpr.matched(8)):null);
			}
		}
		if(info != null && !info.isEmpty()) {
			if(this.currentBlock.getLayout() == null) this.currentBlock.setLayout(new prime.gui.styling.LayoutStyle());
			this.currentBlock.getLayout();
			this.currentBlock.getLayout().setAlgorithm(info);
		}
		if(setFlag) {
			if(this.currentBlock.getLayout() == null) this.currentBlock.setLayout(new prime.gui.styling.LayoutStyle());
			this.currentBlock.getLayout();
			this.currentBlock.getLayout().markProperty(8,true);
		}
	}
	,algorithmToClass: function(alg) {
		return (function($this) {
			var $r;
			switch( (alg)[1] ) {
			case 2:
				$r = "prime.layout.algorithms.circle.HorizontalCircleAlgorithm";
				break;
			case 3:
				$r = "prime.layout.algorithms.circle.VerticalCircleAlgorithm";
				break;
			case 0:
				$r = "prime.layout.algorithms.float.HorizontalFloatAlgorithm";
				break;
			case 1:
				$r = "prime.layout.algorithms.float.VerticalFloatAlgorithm";
				break;
			case 4:
				$r = "prime.layout.algorithms.tile.DynamicTileAlgorithm";
				break;
			case 5:
				$r = "prime.layout.algorithms.tile.FixedTileAlgorithm";
				break;
			case 6:
				$r = "prime.layout.algorithms.tile.SimpleTileAlgorithm";
				break;
			case 7:
				$r = "prime.layout.algorithms.DynamicLayoutAlgorithm";
				break;
			case 8:
				$r = "prime.layout.algorithms.RelativeAlgorithm";
				break;
			}
			return $r;
		}(this));
	}
	,parseAndSetPosition: function(v) {
		v = StringTools.trim(v).toLowerCase();
		if(v == "absolute" || v == "relative") {
			if(this.currentBlock.getLayout() == null) this.currentBlock.setLayout(new prime.gui.styling.LayoutStyle());
			this.currentBlock.getLayout();
			this.currentBlock.getLayout().setIncludeInLayout(v == "relative");
		}
	}
	,parseAndSetRelativeProperties: function(v) {
		var expr = this.floatUnitGroupValExpr;
		if(expr.match(v)) {
			if(this.currentBlock.getLayout() == null) this.currentBlock.setLayout(new prime.gui.styling.LayoutStyle());
			this.currentBlock.getLayout();
			var top = this.getInt(expr.matched(3));
			var right = expr.matched(8) != null?this.getInt(expr.matched(10)):-2147483648;
			var bottom = expr.matched(15) != null?this.getInt(expr.matched(17)):-2147483648;
			var left = expr.matched(22) != null?this.getInt(expr.matched(24)):-2147483648;
			if(this.currentBlock.getLayout().getRelative() == null) this.currentBlock.getLayout().setRelative(new prime.layout.RelativeLayout(top,right,bottom,left)); else {
				var r = this.currentBlock.getLayout().getRelative();
				if(top != -2147483648 && top != null) r.setVCenter(-2147483648);
				if(top != r.top) {
					r.top = top;
					if(r.enabled) r.change.send();
				}
				top;
				if(right != -2147483648 && right != null) r.setHCenter(-2147483648);
				if(right != r.right) {
					r.right = right;
					if(r.enabled) r.change.send();
				}
				right;
				if(bottom != -2147483648 && bottom != null) r.setVCenter(-2147483648);
				if(bottom != r.bottom) {
					r.bottom = bottom;
					if(r.enabled) r.change.send();
				}
				bottom;
				if(left != -2147483648 && left != null) r.setHCenter(-2147483648);
				if(left != r.left) {
					r.left = left;
					if(r.enabled) r.change.send();
				}
				left;
			}
		}
	}
	,parseAndSetMargin: function(v) {
		var expr = this.floatUnitGroupValExpr;
		if(expr.match(v)) {
			if(this.currentBlock.getLayout() == null) this.currentBlock.setLayout(new prime.gui.styling.LayoutStyle());
			this.currentBlock.getLayout();
			var top = this.getInt(expr.matched(3));
			var right = expr.matched(8) != null?this.getInt(expr.matched(10)):top;
			var bottom = expr.matched(15) != null?this.getInt(expr.matched(17)):top;
			var left = expr.matched(22) != null?this.getInt(expr.matched(24)):right;
			if(this.currentBlock.getLayout().getMargin() == null) this.currentBlock.getLayout().setMargin(new prime.core.geom.Box(top,right,bottom,left)); else {
				var p = this.currentBlock.getLayout().getMargin();
				p.top = top;
				p.right = right;
				p.bottom = bottom;
				p.left = left;
			}
		}
	}
	,parseAndSetPadding: function(v) {
		var expr = this.floatUnitGroupValExpr;
		if(expr.match(v)) {
			if(this.currentBlock.getLayout() == null) this.currentBlock.setLayout(new prime.gui.styling.LayoutStyle());
			this.currentBlock.getLayout();
			var top = this.getInt(expr.matched(3));
			var right = expr.matched(8) != null?this.getInt(expr.matched(10)):top;
			var bottom = expr.matched(15) != null?this.getInt(expr.matched(17)):top;
			var left = expr.matched(22) != null?this.getInt(expr.matched(24)):right;
			if(this.currentBlock.getLayout().getPadding() == null) this.currentBlock.getLayout().setPadding(new prime.core.geom.Box(top,right,bottom,left)); else {
				var p = this.currentBlock.getLayout().getPadding();
				p.top = top;
				p.right = right;
				p.bottom = bottom;
				p.left = left;
			}
		}
	}
	,parseAndSetHeight: function(v) {
		if(this.currentBlock.getLayout() == null) this.currentBlock.setLayout(new prime.gui.styling.LayoutStyle());
		this.currentBlock.getLayout();
		if(StringTools.trim(v).toLowerCase() == "none") {
			this.currentBlock.getLayout().setHeight(-2147483640);
			this.currentBlock.getLayout().setPercentHeight(-2147483640);
		} else {
			var h = this.parseUnitInt(v);
			if(h != -2147483648 && h != null) this.currentBlock.getLayout().setHeight(h); else {
				var ph = this.isAutoSize(v)?-2147483644:v != null && this.percValExpr.match(v)?this.getFloat(this.percValExpr.matched(3)) / 100:prime.types.Number.FLOAT_NOT_SET;
				this.currentBlock.getLayout().setPercentHeight(ph);
			}
		}
	}
	,parseAndSetWidth: function(v) {
		var w = this.parseUnitInt(v);
		if(this.currentBlock.getLayout() == null) this.currentBlock.setLayout(new prime.gui.styling.LayoutStyle());
		this.currentBlock.getLayout();
		if(StringTools.trim(v).toLowerCase() == "none") {
			this.currentBlock.getLayout().setWidth(-2147483640);
			this.currentBlock.getLayout().setPercentWidth(-2147483640);
		}
		if(w != -2147483648 && w != null) this.currentBlock.getLayout().setWidth(w); else {
			var pw = this.isAutoSize(v)?-2147483644:v != null && this.percValExpr.match(v)?this.getFloat(this.percValExpr.matched(3)) / 100:prime.types.Number.FLOAT_NOT_SET;
			if(pw != null && pw == pw) this.currentBlock.getLayout().setPercentWidth(pw);
		}
	}
	,isAutoSize: function(v) {
		return StringTools.trim(v).toLowerCase() == "auto";
	}
	,getBorderRadius: function() {
		var g = (function($this) {
			var $r;
			if($this.currentBlock.getGraphics() == null) $this.currentBlock.setGraphics(new prime.gui.styling.GraphicsStyle());
			$r = $this.currentBlock.getGraphics();
			return $r;
		}(this));
		if(g.getBorderRadius() == null) g.setBorderRadius(new prime.core.geom.Corners());
		return g.getBorderRadius();
	}
	,setBorderBottomRightRadius: function(v) {
		this.getBorderRadius().bottomRight = v;
	}
	,setBorderBottomLeftRadius: function(v) {
		this.getBorderRadius().bottomLeft = v;
	}
	,setBorderTopRightRadius: function(v) {
		this.getBorderRadius().topRight = v;
	}
	,setBorderTopLeftRadius: function(v) {
		this.getBorderRadius().topLeft = v;
	}
	,parseAndSetBorderRadius: function(v) {
		var expr = this.floatUnitGroupValExpr;
		if(!expr.match(v)) return;
		var g = (function($this) {
			var $r;
			if($this.currentBlock.getGraphics() == null) $this.currentBlock.setGraphics(new prime.gui.styling.GraphicsStyle());
			$r = $this.currentBlock.getGraphics();
			return $r;
		}(this));
		var topLeft = this.getFloat(expr.matched(3));
		var topRight = expr.matched(8) != null?this.getFloat(expr.matched(10)):topLeft;
		var bottomRight = expr.matched(15) != null?this.getFloat(expr.matched(17)):topLeft;
		var bottomLeft = expr.matched(22) != null?this.getFloat(expr.matched(24)):topRight;
		g.setBorderRadius(new prime.core.geom.Corners(topLeft,topRight,bottomRight,bottomLeft));
	}
	,parseBorderInside: function(v) {
		var pos = v.indexOf("inside");
		var result = pos > -1;
		if(result) this.lastParsedString = HxOverrides.substr(v,pos + 6,null); else {
			pos = v.indexOf("outside");
			if(pos > -1) this.lastParsedString = HxOverrides.substr(v,pos + 7,null);
		}
		return result;
	}
	,createBorderForFill: function(fill,weight,inside) {
		if(inside == null) inside = false;
		if(weight == null) weight = 1;
		var border = null;
		if(js.Boot.__instanceof(fill,prime.gui.graphics.fills.SolidFill)) border = new prime.gui.graphics.borders.SolidBorder(fill,weight,inside); else if(js.Boot.__instanceof(fill,prime.gui.graphics.fills.GradientFill)) border = new prime.gui.graphics.borders.GradientBorder(fill,weight,inside); else if(js.Boot.__instanceof(fill,prime.gui.graphics.fills.BitmapFill)) border = new prime.gui.graphics.borders.BitmapBorder(fill,weight,inside);
		return border;
	}
	,parseAndSetBorder: function(v) {
		var g = (function($this) {
			var $r;
			if($this.currentBlock.getGraphics() == null) $this.currentBlock.setGraphics(new prime.gui.styling.GraphicsStyle());
			$r = $this.currentBlock.getGraphics();
			return $r;
		}(this));
		if(StringTools.trim(v).toLowerCase() == "none") g.setBorder(new prime.gui.graphics.borders.EmptyBorder()); else {
			var borders = new prime.gui.graphics.borders.ComposedBorder();
			var parsingBorders = true;
			while(parsingBorders) {
				var fill = null;
				if(fill == null) fill = this.parseImage(v);
				if(fill == null) fill = this.parseColorFill(v);
				if(fill == null) {
					parsingBorders = false;
					break;
				}
				v = this.lastParsedString;
				var weight = this.parseUnitFloat(v);
				v = prime.utils.ERegUtil.removeMatch(this.floatUnitValExpr,v);
				var inside = this.parseBorderInside(v);
				v = this.lastParsedString;
				borders.add(this.createBorderForFill(fill,weight,inside));
			}
			var border = null;
			if(borders.length > 1) border = borders;
			if(borders.length == 1) border = borders.next();
			if(border != null) {
				if(g.getBorder() != null && js.Boot.__instanceof(g.getBorder(),prime.gui.graphics.borders.ComposedBorder) && js.Boot.__instanceof(border,prime.gui.graphics.borders.ComposedBorder)) g.getBorder().merge(border); else g.setBorder(border);
			}
		}
	}
	,parseAndSetShape: function(v) {
		var strippedV = StringTools.trim(v).toLowerCase();
		var p = null;
		var cName = (function($this) {
			var $r;
			switch(strippedV) {
			case "line":
				$r = Type.getClassName(prime.gui.graphics.shapes.Line);
				break;
			case "circle":
				$r = Type.getClassName(prime.gui.graphics.shapes.Circle);
				break;
			case "ellipse":
				$r = Type.getClassName(prime.gui.graphics.shapes.Ellipse);
				break;
			case "rectangle":
				$r = Type.getClassName(prime.gui.graphics.shapes.RegularRectangle);
				break;
			default:
				$r = null;
			}
			return $r;
		}(this));
		if(cName == null && this.triangleExpr.match(v)) {
			cName = Type.getClassName(prime.gui.graphics.shapes.Triangle);
			p = [this.parsePosition(this.triangleExpr.matched(2))];
		} else if(this.customShapeExpr.match(v)) cName = this.customShapeExpr.matched(1);
		if(cName != null) ((function($this) {
			var $r;
			if($this.currentBlock.getGraphics() == null) $this.currentBlock.setGraphics(new prime.gui.styling.GraphicsStyle());
			$r = $this.currentBlock.getGraphics();
			return $r;
		}(this))).setShape(prime.types.Reference.classInstance(cName,p,v));
	}
	,parseRepeatImage: function(v) {
		var repeatStr = "";
		if(v != null && this.imageRepeatExpr.match(v)) repeatStr = this.imageRepeatExpr.matched(1);
		this.lastParsedString = prime.utils.ERegUtil.removeMatch(this.imageRepeatExpr,v);
		return (function($this) {
			var $r;
			switch(StringTools.trim(repeatStr).toLowerCase()) {
			case "no-repeat":
				$r = false;
				break;
			default:
				$r = true;
			}
			return $r;
		}(this));
	}
	,parseImage: function(v) {
		var fill = null;
		var bmp = this.parseAsset(v);
		if(bmp != null) {
			v = this.lastParsedString;
			fill = new prime.gui.graphics.fills.BitmapFill(bmp,null,null,this.parseRepeatImage(v),false);
			v = this.lastParsedString;
		}
		return fill;
	}
	,parseImages: function(v) {
		var fills = new prime.gui.graphics.fills.ComposedFill();
		var fill = null;
		while(null != (fill = this.parseImage(v))) {
			fills.add(fill);
			v = this.lastParsedString;
		}
		if(fills.length > 1) return fills;
		if(fills.length == 1) return fills.next();
		return null;
	}
	,parseAsset: function(v) {
		var factory = null;
		if(this.imageURIExpr.match(v)) {
			factory = new prime.types.Factory("prime.types.URI",[StringTools.replace(this.styleSheetBasePath + "/" + this.imageURIExpr.matched(2),"//","/")]);
			this.lastParsedString = prime.utils.ERegUtil.removeMatch(this.imageURIExpr,v);
		} else if(v != null && this.classRefExpr.match(v)) {
			factory = v != null && this.classRefExpr.match(v)?new prime.types.Factory(this.classRefExpr.matched(2),null,null,v):null;
			this.lastParsedString = prime.utils.ERegUtil.removeMatch(this.classRefExpr,v);
		}
		return factory;
	}
	,parseColorFill: function(v) {
		var fill = null;
		var isLinearGr = this.linGradientExpr.match(v);
		var isRadialGr = !isLinearGr && this.radGradientExpr.match(v);
		if(isLinearGr || isRadialGr) {
			var gradientExpr = isLinearGr?this.linGradientExpr:this.radGradientExpr;
			var type = isLinearGr?prime.gui.graphics.fills.GradientType.linear:prime.gui.graphics.fills.GradientType.radial;
			var colorsStr = isLinearGr?gradientExpr.matched(6):gradientExpr.matched(4);
			var focalPoint = isLinearGr?0:this.getInt(gradientExpr.matched(2));
			var degr = isRadialGr?0:this.getInt(gradientExpr.matched(3));
			var method = isLinearGr?(function($this) {
				var $r;
				switch(gradientExpr.matched(24)) {
				case "pad":
					$r = prime.gui.graphics.fills.SpreadMethod.normal;
					break;
				case "reflect":
					$r = prime.gui.graphics.fills.SpreadMethod.reflect;
					break;
				case "repeat":
					$r = prime.gui.graphics.fills.SpreadMethod.repeat;
					break;
				}
				return $r;
			}(this)):(function($this) {
				var $r;
				switch(gradientExpr.matched(22)) {
				case "pad":
					$r = prime.gui.graphics.fills.SpreadMethod.normal;
					break;
				case "reflect":
					$r = prime.gui.graphics.fills.SpreadMethod.reflect;
					break;
				case "repeat":
					$r = prime.gui.graphics.fills.SpreadMethod.repeat;
					break;
				}
				return $r;
			}(this));
			var gr = new prime.gui.graphics.fills.GradientFill(type,method,focalPoint,degr);
			if(colorsStr != null) {
				while(true) {
					if(!this.gradientColorExpr.match(colorsStr)) break;
					var pos = -1;
					if(this.gradientColorExpr.matched(16) != null) pos = this.getInt(this.gradientColorExpr.matched(16)); else if(this.gradientColorExpr.matched(20) != null) {
						var a = this.getFloat(this.gradientColorExpr.matched(21));
						pos = (function($this) {
							var $r;
							var var1 = a / 100 * 255;
							$r = (var1 < 0?-.5:.5) + var1 | 0;
							return $r;
						}(this));
					}
					gr.add(new prime.gui.graphics.fills.GradientStop((function($this) {
						var $r;
						var v1 = $this.gradientColorExpr.matched(4);
						if(v1.length == 3) v1 = v1.charAt(0) + v1.charAt(0) + v1.charAt(1) + v1.charAt(1) + v1.charAt(2) + v1.charAt(2);
						if(v1.length == 6) v1 += "FF";
						$r = (function($this) {
							var $r;
							var v2 = Std.parseInt("0x" + v1);
							$r = (function($this) {
								var $r;
								var value = (v2 & -256) >>> 8;
								if(value < 0) value = 0; else if(value > 16777215) value = 16777215;
								$r = value;
								return $r;
							}($this)) << 8 | (function($this) {
								var $r;
								var value = v2 & 255;
								if(value < 0) value = 0; else if(value > 255) value = 255;
								$r = value;
								return $r;
							}($this));
							return $r;
						}($this));
						return $r;
					}(this)),pos));
					colorsStr = this.gradientColorExpr.matchedRight();
				}
				var i = 0;
				var stepPos = 255 / (gr.gradientStops.length - 1);
				var _g = 0, _g1 = gr.gradientStops;
				while(_g < _g1.length) {
					var stop = _g1[_g];
					++_g;
					if(stop.position == -1) stop.setPosition((function($this) {
						var $r;
						var var1 = stepPos * i;
						$r = (var1 < 0?-.5:.5) + var1 | 0;
						return $r;
					}(this)));
					i++;
				}
				fill = gr;
			}
			v = prime.utils.ERegUtil.removeMatch(gradientExpr,v);
		}
		if(fill == null && (StringTools.trim(v).toLowerCase() != "inherit" && this.colorValExpr.match(v))) {
			fill = new prime.gui.graphics.fills.SolidFill(this.parseColor(v));
			v = prime.utils.ERegUtil.removeMatch(this.colorValExpr,v);
		}
		this.lastParsedString = v;
		return fill;
	}
	,parseColorFills: function(v) {
		var fills = new prime.gui.graphics.fills.ComposedFill();
		var isLooping = true;
		while(isLooping) {
			var fill = this.parseColorFill(v);
			if(fill == null) {
				isLooping = false;
				break;
			}
			fills.add(fill);
			v = this.lastParsedString;
		}
		this.lastParsedString = v;
		if(fills.length > 1) return fills;
		if(fills.length == 1) return fills.next();
		return null;
	}
	,parseAndSetBackground: function(v) {
		var g = (function($this) {
			var $r;
			if($this.currentBlock.getGraphics() == null) $this.currentBlock.setGraphics(new prime.gui.styling.GraphicsStyle());
			$r = $this.currentBlock.getGraphics();
			return $r;
		}(this));
		if(StringTools.trim(v).toLowerCase() == "none") g.setBackground(new prime.gui.graphics.EmptyGraphicProperty()); else {
			this.setBackground(this.parseColorFills(v));
			this.setBackground(this.parseImages(v));
		}
	}
	,setBackground: function(newFill) {
		if(newFill != null) {
			var g = (function($this) {
				var $r;
				if($this.currentBlock.getGraphics() == null) $this.currentBlock.setGraphics(new prime.gui.styling.GraphicsStyle());
				$r = $this.currentBlock.getGraphics();
				return $r;
			}(this));
			if(g.getBackground() != null && js.Boot.__instanceof(g.getBackground(),prime.gui.graphics.fills.ComposedFill)) {
				if(js.Boot.__instanceof(newFill,prime.gui.graphics.fills.ComposedFill)) g.getBackground().merge(newFill); else g.getBackground().add(newFill);
			}
			if(g.getBackground() == null || js.Boot.__instanceof(g.getBackground(),Type.getClass(newFill))) g.setBackground(newFill); else if(!js.Boot.__instanceof(g.getBackground(),prime.gui.graphics.fills.ComposedFill) && !js.Boot.__instanceof(newFill,prime.gui.graphics.fills.ComposedFill)) {
				var bg = new prime.gui.graphics.fills.ComposedFill();
				bg.add(g.getBackground());
				bg.add(newFill);
				g.setBackground(bg);
			}
		}
	}
	,parseAndSetTextStyle: function(v) {
		if(this.fontStyleExpr.match(v)) {
			if(this.currentBlock.getFont() == null) this.currentBlock.setFont(new prime.gui.styling.TextStyle());
			this.currentBlock.getFont();
			this.currentBlock.getFont().setStyle((function($this) {
				var $r;
				switch($this.fontStyleExpr.matched(1).toLowerCase()) {
				case "italic":
					$r = prime.gui.text.FontStyle.italic;
					break;
				case "oblique":
					$r = prime.gui.text.FontStyle.oblique;
					break;
				case "inherit":
					$r = null;
					break;
				default:
					$r = prime.gui.text.FontStyle.normal;
				}
				return $r;
			}(this)));
			v = prime.utils.ERegUtil.removeMatch(this.fontStyleExpr,v);
		}
		return v;
	}
	,parseAndSetFontColor: function(v) {
		if(StringTools.trim(v).toLowerCase() != "inherit" && this.colorValExpr.match(v)) {
			if(this.currentBlock.getFont() == null) this.currentBlock.setFont(new prime.gui.styling.TextStyle());
			this.currentBlock.getFont();
			this.currentBlock.getFont().setColor(this.parseColor(v));
			v = prime.utils.ERegUtil.removeMatch(this.colorValExpr,v);
		}
		return v;
	}
	,parseAndSetFontWeight: function(v) {
		if(this.fontWeightExpr.match(v)) {
			if(this.currentBlock.getFont() == null) this.currentBlock.setFont(new prime.gui.styling.TextStyle());
			this.currentBlock.getFont();
			this.currentBlock.getFont().setWeight((function($this) {
				var $r;
				switch($this.fontWeightExpr.matched(1).toLowerCase()) {
				case "bold":
					$r = prime.gui.text.FontWeight.bold;
					break;
				case "bolder":
					$r = prime.gui.text.FontWeight.bolder;
					break;
				case "lighter":
					$r = prime.gui.text.FontWeight.lighter;
					break;
				case "inherit":
					$r = null;
					break;
				default:
					$r = prime.gui.text.FontWeight.normal;
				}
				return $r;
			}(this)));
			v = prime.utils.ERegUtil.removeMatch(this.fontWeightExpr,v);
		}
		return v;
	}
	,parseAndSetFontFamily: function(val) {
		var isFam = this.fontFamilyExpr.match(val);
		var isEmbedded = true;
		var family = "";
		if(isFam) {
			family = this.fontFamilyExpr.matched(6) != null?this.fontFamilyExpr.matched(6):this.fontFamilyExpr.matched(1);
			isFam = !this.fontWeightExpr.match(family) && !this.fontStyleExpr.match(family);
			isEmbedded = this.fontFamilyExpr.matched(4) != null;
		}
		if(isFam) {
			if(this.currentBlock.getFont() == null) this.currentBlock.setFont(new prime.gui.styling.TextStyle());
			this.currentBlock.getFont();
			this.currentBlock.getFont().setFamily(family);
			this.currentBlock.getFont().setEmbeddedFont(isEmbedded);
			val = StringTools.replace(val,family,"");
		}
		return val;
	}
	,parseAndSetFontSize: function(val) {
		var v = this.parseUnitInt(val);
		if(v != -2147483648 && v != null) {
			if(this.currentBlock.getFont() == null) this.currentBlock.setFont(new prime.gui.styling.TextStyle());
			this.currentBlock.getFont();
			this.currentBlock.getFont().setSize(v);
			val = this.floatUnitValExpr.replace(val,"");
		}
		return val;
	}
	,parseAndSetFont: function(v) {
		v = this.parseAndSetTextStyle(v);
		v = this.parseAndSetFontWeight(v);
		v = this.parseAndSetFontSize(v);
		v = this.parseAndSetFontFamily(v);
		v = this.parseAndSetFontColor(v);
	}
	,parseMoveDirection: function(v) {
		return v == null?null:(function($this) {
			var $r;
			switch(StringTools.trim(v).toLowerCase()) {
			case "top-to-bottom":
				$r = prime.core.geom.space.MoveDirection.TopToBottom;
				break;
			case "bottom-to-top":
				$r = prime.core.geom.space.MoveDirection.BottomToTop;
				break;
			case "left-to-right":
				$r = prime.core.geom.space.MoveDirection.LeftToRight;
				break;
			case "right-to-left":
				$r = prime.core.geom.space.MoveDirection.RightToLeft;
				break;
			default:
				$r = prime.core.geom.space.MoveDirection.TopToBottom;
			}
			return $r;
		}(this));
	}
	,parsePosition: function(v) {
		return v == null?null:(function($this) {
			var $r;
			switch(StringTools.trim(v).toLowerCase()) {
			case "top-left":
				$r = prime.core.geom.space.Position.TopLeft;
				break;
			case "top-center":
				$r = prime.core.geom.space.Position.TopCenter;
				break;
			case "top-right":
				$r = prime.core.geom.space.Position.TopRight;
				break;
			case "middle-left":
				$r = prime.core.geom.space.Position.MiddleLeft;
				break;
			case "middle-center":
				$r = prime.core.geom.space.Position.MiddleCenter;
				break;
			case "middle-right":
				$r = prime.core.geom.space.Position.MiddleRight;
				break;
			case "bottom-left":
				$r = prime.core.geom.space.Position.BottomLeft;
				break;
			case "bottom-center":
				$r = prime.core.geom.space.Position.BottomCenter;
				break;
			case "bottom-right":
				$r = prime.core.geom.space.Position.BottomRight;
				break;
			default:
				$r = prime.core.geom.space.Position.Custom($this.parseIntPoint(v));
			}
			return $r;
		}(this));
	}
	,parseVerDirection: function(v) {
		return v == null?null:(function($this) {
			var $r;
			switch(StringTools.trim(v).toLowerCase()) {
			case "center":
				$r = prime.core.geom.space.Vertical.center;
				break;
			case "bottom":
				$r = prime.core.geom.space.Vertical.bottom;
				break;
			default:
				$r = prime.core.geom.space.Vertical.top;
			}
			return $r;
		}(this));
	}
	,parseHorDirection: function(v) {
		return v == null?null:(function($this) {
			var $r;
			switch(StringTools.trim(v).toLowerCase()) {
			case "center":
				$r = prime.core.geom.space.Horizontal.center;
				break;
			case "right":
				$r = prime.core.geom.space.Horizontal.right;
				break;
			default:
				$r = prime.core.geom.space.Horizontal.left;
			}
			return $r;
		}(this));
	}
	,parseDirection: function(v) {
		return v == null?null:(function($this) {
			var $r;
			switch(StringTools.trim(v).toLowerCase()) {
			case "vertical":
				$r = prime.core.geom.space.Direction.vertical;
				break;
			default:
				$r = prime.core.geom.space.Direction.horizontal;
			}
			return $r;
		}(this));
	}
	,parseColor: function(v) {
		var clr = null;
		v = StringTools.trim(v).toLowerCase();
		if(v != "inherit" && this.colorValExpr.match(v)) {
			if(this.colorValExpr.matched(3) != null) clr = (function($this) {
				var $r;
				var v1 = $this.colorValExpr.matched(3);
				if(v1.length == 3) v1 = v1.charAt(0) + v1.charAt(0) + v1.charAt(1) + v1.charAt(1) + v1.charAt(2) + v1.charAt(2);
				if(v1.length == 6) v1 += "FF";
				$r = (function($this) {
					var $r;
					var v2 = Std.parseInt("0x" + v1);
					$r = (function($this) {
						var $r;
						var value = (v2 & -256) >>> 8;
						if(value < 0) value = 0; else if(value > 16777215) value = 16777215;
						$r = value;
						return $r;
					}($this)) << 8 | (function($this) {
						var $r;
						var value = v2 & 255;
						if(value < 0) value = 0; else if(value > 255) value = 255;
						$r = value;
						return $r;
					}($this));
					return $r;
				}($this));
				return $r;
			}(this)); else if(this.colorValExpr.matched(4) != null) {
				var colors = this.colorValExpr.matched(6).split(",");
				var alpha = (function($this) {
					var $r;
					var value = $this.getFloat($this.colorValExpr.matched(9)) * 255 | 0;
					if(value < 0) value = 0; else if(value > 255) value = 255;
					$r = value;
					return $r;
				}(this));
				clr = (function($this) {
					var $r;
					var v1 = $this.getInt(colors[0]) << 24 | $this.getInt(colors[1]) << 16 | $this.getInt(colors[2]) << 8 | alpha;
					$r = (function($this) {
						var $r;
						var value = (v1 & -256) >>> 8;
						if(value < 0) value = 0; else if(value > 16777215) value = 16777215;
						$r = value;
						return $r;
					}($this)) << 8 | (function($this) {
						var $r;
						var value = v1 & 255;
						if(value < 0) value = 0; else if(value > 255) value = 255;
						$r = value;
						return $r;
					}($this));
					return $r;
				}(this));
			}
		}
		return clr;
	}
	,parseAngle: function(v) {
		var n = prime.types.Number.FLOAT_NOT_SET;
		if(v != null && this.angleExpr.match(v)) n = this.getFloat(this.angleExpr.matched(1));
		return n;
	}
	,parseIntPoint: function(v) {
		var p = null;
		if(v != null && this.pointExpr.match(v)) p = new prime.core.geom.IntPoint(this.getInt(this.pointExpr.matched(3)),this.getInt(this.pointExpr.matched(10)));
		return p;
	}
	,parsePercentage: function(v) {
		return v != null && this.percValExpr.match(v)?this.getFloat(this.percValExpr.matched(3)) / 100:prime.types.Number.FLOAT_NOT_SET;
	}
	,parseUnitFloat: function(v) {
		var n = prime.types.Number.FLOAT_NOT_SET;
		if(v != null && (this.floatUnitValExpr.match(v) && this.floatUnitValExpr.matched(1) != null)) n = this.getFloat(this.floatUnitValExpr.matched(3));
		return n;
	}
	,parseUnitInt: function(v) {
		var n = -2147483648;
		if(v != null && (this.floatUnitValExpr.match(v) && this.floatUnitValExpr.matched(1) != null)) n = this.getInt(this.floatUnitValExpr.matched(3)); else if(StringTools.trim(v).toLowerCase() == "none") n = -2147483640;
		return n;
	}
	,parseFloat: function(v) {
		if(v == null || !this.floatValExpr.match(v)) return prime.types.Number.FLOAT_NOT_SET; else return this.getFloat(this.floatValExpr.matched(1));
	}
	,parseInt: function(v) {
		if(v == null || !this.intValExpr.match(v)) return -2147483648; else return this.getInt(this.intValExpr.matched(1));
	}
	,getInt: function(match) {
		return match == null?0:Std.parseInt(match);
	}
	,getFloat: function(match) {
		return match == null?0.0:Std.parseFloat(match);
	}
	,handleMatchedProperty: function(expr) {
		var name = StringTools.trim(expr.matched(1));
		var val = StringTools.trim(expr.matched(2));
		switch(name) {
		case "font":
			this.parseAndSetFont(val);
			break;
		case "font-size":
			this.parseAndSetFontSize(val);
			break;
		case "font-family":
			this.parseAndSetFontFamily(val);
			break;
		case "color":
			this.parseAndSetFontColor(val);
			break;
		case "font-weight":
			this.parseAndSetFontWeight(val);
			break;
		case "font-style":
			this.parseAndSetTextStyle(val);
			break;
		case "letter-spacing":
			if(this.currentBlock.getFont() == null) this.currentBlock.setFont(new prime.gui.styling.TextStyle());
			this.currentBlock.getFont();
			this.currentBlock.getFont().setLetterSpacing(this.parseUnitFloat(val));
			break;
		case "text-align":
			if(this.currentBlock.getFont() == null) this.currentBlock.setFont(new prime.gui.styling.TextStyle());
			this.currentBlock.getFont();
			this.currentBlock.getFont().setAlign((function($this) {
				var $r;
				switch(StringTools.trim(val).toLowerCase()) {
				case "center":
					$r = prime.gui.text.TextAlign.CENTER;
					break;
				case "right":
					$r = prime.gui.text.TextAlign.RIGHT;
					break;
				case "jusitfy":
					$r = prime.gui.text.TextAlign.JUSTIFY;
					break;
				case "inherit":
					$r = null;
					break;
				default:
					$r = prime.gui.text.TextAlign.LEFT;
				}
				return $r;
			}(this)));
			break;
		case "text-decoration":
			if(this.currentBlock.getFont() == null) this.currentBlock.setFont(new prime.gui.styling.TextStyle());
			this.currentBlock.getFont();
			this.currentBlock.getFont().setDecoration((function($this) {
				var $r;
				switch(StringTools.trim(val).toLowerCase()) {
				case "underline":
					$r = prime.gui.text.TextDecoration.underline;
					break;
				case "inherit":
					$r = null;
					break;
				default:
					$r = prime.gui.text.TextDecoration.none;
				}
				return $r;
			}(this)));
			break;
		case "text-indent":
			if(this.currentBlock.getFont() == null) this.currentBlock.setFont(new prime.gui.styling.TextStyle());
			this.currentBlock.getFont();
			this.currentBlock.getFont().setIndent(this.parseUnitFloat(val));
			break;
		case "text-transform":
			if(this.currentBlock.getFont() == null) this.currentBlock.setFont(new prime.gui.styling.TextStyle());
			this.currentBlock.getFont();
			this.currentBlock.getFont().setTransform((function($this) {
				var $r;
				switch(StringTools.trim(val).toLowerCase()) {
				case "capitalize":
					$r = prime.gui.text.TextTransform.capitalize;
					break;
				case "uppercase":
					$r = prime.gui.text.TextTransform.uppercase;
					break;
				case "lowercase":
					$r = prime.gui.text.TextTransform.lowercase;
					break;
				case "inherit":
					$r = null;
					break;
				default:
					$r = prime.gui.text.TextTransform.none;
				}
				return $r;
			}(this)));
			break;
		case "background":
			this.parseAndSetBackground(val);
			break;
		case "background-color":
			this.setBackground(this.parseColorFills(val));
			break;
		case "background-image":
			this.setBackground(this.parseImages(val));
			break;
		case "border":
			this.parseAndSetBorder(val);
			break;
		case "border-radius":
			this.parseAndSetBorderRadius(val);
			break;
		case "border-top-left-radius":
			this.setBorderTopLeftRadius(this.parseUnitFloat(val));
			break;
		case "border-top-right-radius":
			this.setBorderTopRightRadius(this.parseUnitFloat(val));
			break;
		case "border-bottom-left-radius":
			this.setBorderBottomLeftRadius(this.parseUnitFloat(val));
			break;
		case "border-bottom-right-radius":
			this.setBorderBottomRightRadius(this.parseUnitFloat(val));
			break;
		case "shape":
			this.parseAndSetShape(val);
			break;
		case "skin":
			this.parseAndSetSkin(val);
			break;
		case "visibility":
			this.parseAndSetVisibility(val);
			break;
		case "opacity":
			this.parseAndSetOpacity(val);
			break;
		case "overflow":
			this.parseAndSetOverflow(val);
			break;
		case "overflow-wrap":
			if(this.currentBlock.getFont() == null) this.currentBlock.setFont(new prime.gui.styling.TextStyle());
			this.currentBlock.getFont();
			this.currentBlock.getFont().setTextWrap((function($this) {
				var $r;
				switch(StringTools.trim(val).toLowerCase()) {
				case "normal":
					$r = false;
					break;
				case "break-word":
					$r = true;
					break;
				case "hyphenate":
					$r = true;
					break;
				default:
					$r = null;
				}
				return $r;
			}(this)));
			break;
		case "column-count":
			if(this.intValExpr.match(val)) {
				if(this.currentBlock.getFont() == null) this.currentBlock.setFont(new prime.gui.styling.TextStyle());
				this.currentBlock.getFont();
				this.currentBlock.getFont().setColumnCount(this.parseInt(val));
			}
			break;
		case "column-gap":
			if(this.floatUnitValExpr.match(val) && this.floatUnitValExpr.matched(1) != null) {
				if(this.currentBlock.getFont() == null) this.currentBlock.setFont(new prime.gui.styling.TextStyle());
				this.currentBlock.getFont();
				this.currentBlock.getFont().setColumnGap(this.parseUnitInt(val));
			}
			break;
		case "column-width":
			if(this.floatUnitValExpr.match(val) && this.floatUnitValExpr.matched(1) != null) {
				if(this.currentBlock.getFont() == null) this.currentBlock.setFont(new prime.gui.styling.TextStyle());
				this.currentBlock.getFont();
				this.currentBlock.getFont().setColumnWidth(this.parseUnitInt(val));
			}
			break;
		case "icon":
			this.parseAndSetIcon(val);
			break;
		case "icon-fill":
			this.parseAndSetIconFill(val);
			break;
		case "width":
			this.parseAndSetWidth(val);
			break;
		case "height":
			this.parseAndSetHeight(val);
			break;
		case "min-width":
			if(this.currentBlock.getLayout() == null) this.currentBlock.setLayout(new prime.gui.styling.LayoutStyle());
			this.currentBlock.getLayout();
			this.currentBlock.getLayout().setMinWidth(this.parseUnitInt(val));
			this.currentBlock.getLayout().setPercentMinWidth(val != null && this.percValExpr.match(val)?this.getFloat(this.percValExpr.matched(3)) / 100:prime.types.Number.FLOAT_NOT_SET);
			break;
		case "min-height":
			if(this.currentBlock.getLayout() == null) this.currentBlock.setLayout(new prime.gui.styling.LayoutStyle());
			this.currentBlock.getLayout();
			this.currentBlock.getLayout().setMinHeight(this.parseUnitInt(val));
			this.currentBlock.getLayout().setPercentMinHeight(val != null && this.percValExpr.match(val)?this.getFloat(this.percValExpr.matched(3)) / 100:prime.types.Number.FLOAT_NOT_SET);
			break;
		case "max-width":
			if(this.currentBlock.getLayout() == null) this.currentBlock.setLayout(new prime.gui.styling.LayoutStyle());
			this.currentBlock.getLayout();
			this.currentBlock.getLayout().setMaxWidth(this.parseUnitInt(val));
			this.currentBlock.getLayout().setPercentMaxWidth(val != null && this.percValExpr.match(val)?this.getFloat(this.percValExpr.matched(3)) / 100:prime.types.Number.FLOAT_NOT_SET);
			break;
		case "max-height":
			if(this.currentBlock.getLayout() == null) this.currentBlock.setLayout(new prime.gui.styling.LayoutStyle());
			this.currentBlock.getLayout();
			this.currentBlock.getLayout().setMaxHeight(this.parseUnitInt(val));
			this.currentBlock.getLayout().setPercentMaxHeight(val != null && this.percValExpr.match(val)?this.getFloat(this.percValExpr.matched(3)) / 100:prime.types.Number.FLOAT_NOT_SET);
			break;
		case "child-width":
			if(this.floatUnitValExpr.match(val) && this.floatUnitValExpr.matched(1) != null) {
				if(this.currentBlock.getLayout() == null) this.currentBlock.setLayout(new prime.gui.styling.LayoutStyle());
				this.currentBlock.getLayout();
				this.currentBlock.getLayout().setChildWidth(this.parseUnitInt(val));
			}
			break;
		case "child-height":
			if(this.floatUnitValExpr.match(val) && this.floatUnitValExpr.matched(1) != null) {
				if(this.currentBlock.getLayout() == null) this.currentBlock.setLayout(new prime.gui.styling.LayoutStyle());
				this.currentBlock.getLayout();
				this.currentBlock.getLayout().setChildHeight(this.parseUnitInt(val));
			}
			break;
		case "relative":
			this.parseAndSetRelativeProperties(val);
			break;
		case "left":
			if(this.floatUnitValExpr.match(val) && this.floatUnitValExpr.matched(1) != null) {
				if(this.currentBlock.getLayout() == null) this.currentBlock.setLayout(new prime.gui.styling.LayoutStyle());
				this.currentBlock.getLayout();
				if(this.currentBlock.getLayout().getRelative() == null) this.currentBlock.getLayout().setRelative(new prime.layout.RelativeLayout());
				this.currentBlock.getLayout().getRelative();
				this.currentBlock.getLayout().getRelative().setLeft(this.parseUnitInt(val));
			}
			break;
		case "right":
			if(this.floatUnitValExpr.match(val) && this.floatUnitValExpr.matched(1) != null) {
				if(this.currentBlock.getLayout() == null) this.currentBlock.setLayout(new prime.gui.styling.LayoutStyle());
				this.currentBlock.getLayout();
				if(this.currentBlock.getLayout().getRelative() == null) this.currentBlock.getLayout().setRelative(new prime.layout.RelativeLayout());
				this.currentBlock.getLayout().getRelative();
				this.currentBlock.getLayout().getRelative().setRight(this.parseUnitInt(val));
			}
			break;
		case "top":
			if(this.floatUnitValExpr.match(val) && this.floatUnitValExpr.matched(1) != null) {
				if(this.currentBlock.getLayout() == null) this.currentBlock.setLayout(new prime.gui.styling.LayoutStyle());
				this.currentBlock.getLayout();
				if(this.currentBlock.getLayout().getRelative() == null) this.currentBlock.getLayout().setRelative(new prime.layout.RelativeLayout());
				this.currentBlock.getLayout().getRelative();
				this.currentBlock.getLayout().getRelative().setTop(this.parseUnitInt(val));
			}
			break;
		case "bottom":
			if(this.floatUnitValExpr.match(val) && this.floatUnitValExpr.matched(1) != null) {
				if(this.currentBlock.getLayout() == null) this.currentBlock.setLayout(new prime.gui.styling.LayoutStyle());
				this.currentBlock.getLayout();
				if(this.currentBlock.getLayout().getRelative() == null) this.currentBlock.getLayout().setRelative(new prime.layout.RelativeLayout());
				this.currentBlock.getLayout().getRelative();
				this.currentBlock.getLayout().getRelative().setBottom(this.parseUnitInt(val));
			}
			break;
		case "h-center":
			if(this.floatUnitValExpr.match(val) && this.floatUnitValExpr.matched(1) != null) {
				if(this.currentBlock.getLayout() == null) this.currentBlock.setLayout(new prime.gui.styling.LayoutStyle());
				this.currentBlock.getLayout();
				if(this.currentBlock.getLayout().getRelative() == null) this.currentBlock.getLayout().setRelative(new prime.layout.RelativeLayout());
				this.currentBlock.getLayout().getRelative();
				this.currentBlock.getLayout().getRelative().setHCenter(this.parseUnitInt(val));
			}
			break;
		case "v-center":
			if(this.floatUnitValExpr.match(val) && this.floatUnitValExpr.matched(1) != null) {
				if(this.currentBlock.getLayout() == null) this.currentBlock.setLayout(new prime.gui.styling.LayoutStyle());
				this.currentBlock.getLayout();
				if(this.currentBlock.getLayout().getRelative() == null) this.currentBlock.getLayout().setRelative(new prime.layout.RelativeLayout());
				this.currentBlock.getLayout().getRelative();
				this.currentBlock.getLayout().getRelative().setVCenter(this.parseUnitInt(val));
			}
			break;
		case "position":
			this.parseAndSetPosition(val);
			break;
		case "algorithm":
			this.parseAndSetLayoutAlgorithm(val);
			break;
		case "padding":
			this.parseAndSetPadding(val);
			break;
		case "padding-top":
			if(this.floatUnitValExpr.match(val) && this.floatUnitValExpr.matched(1) != null) {
				if(this.currentBlock.getLayout() == null) this.currentBlock.setLayout(new prime.gui.styling.LayoutStyle());
				this.currentBlock.getLayout();
				if(this.currentBlock.getLayout().getPadding() == null) this.currentBlock.getLayout().setPadding(new prime.core.geom.Box());
				this.currentBlock.getLayout().getPadding();
				this.currentBlock.getLayout().getPadding().top = this.parseUnitInt(val);
			}
			break;
		case "padding-bottom":
			if(this.floatUnitValExpr.match(val) && this.floatUnitValExpr.matched(1) != null) {
				if(this.currentBlock.getLayout() == null) this.currentBlock.setLayout(new prime.gui.styling.LayoutStyle());
				this.currentBlock.getLayout();
				if(this.currentBlock.getLayout().getPadding() == null) this.currentBlock.getLayout().setPadding(new prime.core.geom.Box());
				this.currentBlock.getLayout().getPadding();
				this.currentBlock.getLayout().getPadding().bottom = this.parseUnitInt(val);
			}
			break;
		case "padding-right":
			if(this.floatUnitValExpr.match(val) && this.floatUnitValExpr.matched(1) != null) {
				if(this.currentBlock.getLayout() == null) this.currentBlock.setLayout(new prime.gui.styling.LayoutStyle());
				this.currentBlock.getLayout();
				if(this.currentBlock.getLayout().getPadding() == null) this.currentBlock.getLayout().setPadding(new prime.core.geom.Box());
				this.currentBlock.getLayout().getPadding();
				this.currentBlock.getLayout().getPadding().right = this.parseUnitInt(val);
			}
			break;
		case "padding-left":
			if(this.floatUnitValExpr.match(val) && this.floatUnitValExpr.matched(1) != null) {
				if(this.currentBlock.getLayout() == null) this.currentBlock.setLayout(new prime.gui.styling.LayoutStyle());
				this.currentBlock.getLayout();
				if(this.currentBlock.getLayout().getPadding() == null) this.currentBlock.getLayout().setPadding(new prime.core.geom.Box());
				this.currentBlock.getLayout().getPadding();
				this.currentBlock.getLayout().getPadding().left = this.parseUnitInt(val);
			}
			break;
		case "margin":
			this.parseAndSetMargin(val);
			break;
		case "margin-top":
			if(this.floatUnitValExpr.match(val) && this.floatUnitValExpr.matched(1) != null) {
				if(this.currentBlock.getLayout() == null) this.currentBlock.setLayout(new prime.gui.styling.LayoutStyle());
				this.currentBlock.getLayout();
				if(this.currentBlock.getLayout().getMargin() == null) this.currentBlock.getLayout().setMargin(new prime.core.geom.Box());
				this.currentBlock.getLayout().getMargin();
				this.currentBlock.getLayout().getMargin().top = this.parseUnitInt(val);
			}
			break;
		case "margin-bottom":
			if(this.floatUnitValExpr.match(val) && this.floatUnitValExpr.matched(1) != null) {
				if(this.currentBlock.getLayout() == null) this.currentBlock.setLayout(new prime.gui.styling.LayoutStyle());
				this.currentBlock.getLayout();
				if(this.currentBlock.getLayout().getMargin() == null) this.currentBlock.getLayout().setMargin(new prime.core.geom.Box());
				this.currentBlock.getLayout().getMargin();
				this.currentBlock.getLayout().getMargin().bottom = this.parseUnitInt(val);
			}
			break;
		case "margin-right":
			if(this.floatUnitValExpr.match(val) && this.floatUnitValExpr.matched(1) != null) {
				if(this.currentBlock.getLayout() == null) this.currentBlock.setLayout(new prime.gui.styling.LayoutStyle());
				this.currentBlock.getLayout();
				if(this.currentBlock.getLayout().getMargin() == null) this.currentBlock.getLayout().setMargin(new prime.core.geom.Box());
				this.currentBlock.getLayout().getMargin();
				this.currentBlock.getLayout().getMargin().right = this.parseUnitInt(val);
			}
			break;
		case "margin-left":
			if(this.floatUnitValExpr.match(val) && this.floatUnitValExpr.matched(1) != null) {
				if(this.currentBlock.getLayout() == null) this.currentBlock.setLayout(new prime.gui.styling.LayoutStyle());
				this.currentBlock.getLayout();
				if(this.currentBlock.getLayout().getMargin() == null) this.currentBlock.getLayout().setMargin(new prime.core.geom.Box());
				this.currentBlock.getLayout().getMargin();
				this.currentBlock.getLayout().getMargin().left = this.parseUnitInt(val);
			}
			break;
		case "move-transition":
			this.parseAndSetMoveTransition(val);
			break;
		case "resize-transition":
			this.parseAndSetResizeTransition(val);
			break;
		case "rotate-transition":
			this.parseAndSetRotateTransition(val);
			break;
		case "scale-transition":
			this.parseAndSetScaleTransition(val);
			break;
		case "show-transition":
			this.parseAndSetShowTransition(val);
			break;
		case "hide-transition":
			this.parseAndSetHideTransition(val);
			break;
		case "box-bevel":
			this.parseAndSetBoxBevel(val);
			break;
		case "box-blur":
			this.parseAndSetBoxBlur(val);
			break;
		case "box-shadow":
			this.parseAndSetBoxShadow(val);
			break;
		case "box-glow":
			this.parseAndSetBoxGlow(val);
			break;
		case "box-gradient-bevel":
			this.parseAndSetBoxGradientBevel(val);
			break;
		case "box-gradient-glow":
			this.parseAndSetBoxGradientGlow(val);
			break;
		case "background-bevel":
			this.parseAndSetBackgroundBevel(val);
			break;
		case "background-blur":
			this.parseAndSetBackgroundBlur(val);
			break;
		case "background-shadow":
			this.parseAndSetBackgroundShadow(val);
			break;
		case "background-glow":
			this.parseAndSetBackgroundGlow(val);
			break;
		case "background-gradient-bevel":
			this.parseAndSetBackgroundGradientBevel(val);
			break;
		case "background-gradient-glow":
			this.parseAndSetBackgroundGradientGlow(val);
			break;
		case "font-variant":case "text-shadow":case "line-height":case "word-spacing":case "vertical-align":case "white-space":case "list-style":case "list-style-image":case "list-style-position":case "list-style-type":case "background-clip":case "background-origin":case "background-attachment":case "background-position":case "background-size":case "background-repeat":case "corner-shaping":case "corner-clipping":case "border-top":case "border-bottom":case "border-left":case "border-right":case "border-image-slice":case "border-image-width":case "border-image-outset":case "border-image-repeat":case "outline":case "outline-style":case "outline-color":case "outline-width":case "transition-property":case "transition-duration":case "transition-timing-function":case "transition-delay":case "animation-iteration-count":case "animation-play-state":case "box-sizing":case "z-index":case "float":case "clear":case "display":
			null;
			break;
		}
	}
	,parseBlock: function(content) {
		prime.utils.ERegUtil.matchAll(this.propExpr,content,$bind(this,this.handleMatchedProperty));
	}
	,setStateContentBlock: function(stateName) {
		if(stateName <= 0 || this.currentBlock == null) return;
		var stateList = this.currentBlock.getStates();
		if(stateList == null) {
			stateList = new prime.gui.styling.StatesStyle();
			this.currentBlock.setStates(stateList);
		}
		var stateType = (function($this) {
			var $r;
			switch( ($this.currentBlock.type)[1] ) {
			case 0:
				$r = prime.gui.styling.StyleBlockType.elementState;
				break;
			case 1:
				$r = prime.gui.styling.StyleBlockType.styleNameState;
				break;
			case 2:
				$r = prime.gui.styling.StyleBlockType.idState;
				break;
			default:
				$r = $this.currentBlock.type;
			}
			return $r;
		}(this));
		var stateBlock = stateList.get(stateName);
		if(stateBlock == null) {
			stateBlock = new prime.gui.styling.StyleBlock(null,stateType);
			this.currentBlock.getStates().set(stateName,stateBlock);
			stateBlock.setParentStyle(this.currentBlock);
		}
		this.currentBlock = stateBlock;
	}
	,addStyleBlock: function(childName,childType,parentStyle) {
		var children = parentStyle.getChildrenOfType(childType);
		var childBlock = new prime.gui.styling.StyleBlock(null,childType);
		childBlock.setParentStyle(parentStyle);
		children.set(childName,childBlock);
		return childBlock;
	}
	,setContentBlock: function(names) {
		var styleGroup = this.styles;
		var type;
		var depth = 0;
		var expr = this.blockNameExpr;
		this.currentBlock = null;
		var stateName = null;
		while(true) {
			if(!expr.match(names)) break;
			if(this.currentBlock != null) styleGroup = this.currentBlock;
			var name = expr.matched(3);
			if(expr.matched(2) == "#") type = prime.gui.styling.StyleBlockType.id; else if(expr.matched(2) == ".") type = prime.gui.styling.StyleBlockType.styleName; else type = prime.gui.styling.StyleBlockType.element;
			var children = styleGroup.getChildrenOfType(type);
			this.currentBlock = children.get(name);
			if(this.currentBlock == null) this.currentBlock = this.addStyleBlock(name,type,styleGroup);
			if(expr.matched(4) != null) {
				var stateName1 = (function($this) {
					var $r;
					switch(StringTools.trim(expr.matched(5).toLowerCase())) {
					case "hover":
						$r = 2;
						break;
					case "down":
						$r = 4;
						break;
					case "focus":
						$r = 8;
						break;
					case "valid":
						$r = 16;
						break;
					case "invalid":
						$r = 32;
						break;
					case "required":
						$r = 64;
						break;
					case "optional":
						$r = 128;
						break;
					case "disabled":
						$r = 256;
						break;
					case "checked":
						$r = 512;
						break;
					case "selected":
						$r = 2048;
						break;
					case "progress":
						$r = 4096;
						break;
					case "indeterminate":
						$r = 32768;
						break;
					case "determinate":
						$r = 65536;
						break;
					case "completed":
						$r = 8192;
						break;
					case "error":
						$r = 16384;
						break;
					case "editable":
						$r = 1024;
						break;
					case "drag-over":
						$r = 131072;
						break;
					case "drag-drop":
						$r = 262144;
						break;
					default:
						$r = 0;
					}
					return $r;
				}(this));
				this.setStateContentBlock(stateName1);
			}
			names = StringTools.trim(expr.matchedRight());
			depth++;
		}
	}
	,handleMatchedBlock: function(expr) {
		this.setContentBlock(expr.matched(1));
		var content = StringTools.trim(expr.matched(13));
		if(content != "") this.parseBlock(StringTools.trim(content));
	}
	,removeComments: function(style) {
		var commentExpr = new EReg("(" + "/[*]" + "([^*]|[\r\n]|([*]+([^*/]|[\r\n])))*" + "[*]+/" + ")","im");
		return prime.utils.ERegUtil.removeAll(commentExpr,style);
	}
	,removeAllWhiteSpace: function(style) {
		var s = Std.string(style);
		s = StringTools.replace(s,"\r","");
		s = StringTools.replace(s,"\t","");
		return style = s;
	}
	,setSuperState: function(stateName,state,styleName,style) {
		if(state == null) return;
		state.setSuperStyle(style.findState(stateName,styleName,prime.gui.styling.StyleBlockType.element,state));
	}
	,findSuperStatesForStyle: function(styleName,style) {
		if(!((style.filledProperties & 1024) != 0)) return;
		var states = style.getStates();
		var keys = states.keys();
		if(keys != null) {
			while( keys.hasNext() ) {
				var stateName = keys.next();
				var state = states.get(stateName);
				var superName = this.manifest.getFullSuperClassName(styleName);
				while(state.superStyle == null && superName != null && superName != "") {
					this.setSuperState(stateName,state,superName,style);
					superName = this.manifest.getFullSuperClassName(superName);
				}
			}
		}
	}
	,setExtendedState: function(stateName,state,styleName,style) {
		if(state == null || style == null) return;
		state.setExtendedStyle(style.findState(stateName,styleName,style.type,state));
	}
	,findExtendedStatesForStyle: function(styleName,style) {
		if(!((style.filledProperties & 1024) != 0)) return;
		var states = style.getStates();
		var keys = states.keys();
		if(keys != null) {
			while( keys.hasNext() ) {
				var stateName = keys.next();
				var state = states.get(stateName);
				this.setExtendedState(stateName,state,styleName,style);
				this.createStyleStructure(state);
			}
		}
	}
	,setSuperStyle: function(name,style) {
		if(style == null || style.parentStyle == null || style.extendedStyle != null) return;
		var superName = this.manifest.getFullSuperClassName(name);
		while(superName != null && superName != "") {
			style.setSuperStyle(style.parentStyle.findChild(superName,prime.gui.styling.StyleBlockType.element,style));
			if(style.superStyle != null) break;
			superName = this.manifest.getFullSuperClassName(superName);
		}
	}
	,setExtendedStyle: function(name,style) {
		if(style == null || style.parentStyle == null || style.extendedStyle != null) return;
		style.setExtendedStyle(style.parentStyle.findChild(name,style.type,style));
	}
	,createEmptySuperClassesForList: function(list) {
		if(list == null) return;
		var elementNames = new prime.bindable.collections.iterators.FastArrayForwardIterator(list._keys);
		while( elementNames.hasNext() ) {
			var elementName = elementNames.next();
			var elementStyle = list.get(elementName);
			if(elementStyle.isEmpty() || elementStyle.parentStyle == this.styles || !this.manifest.hasSubClasses(elementName)) {
				console.log("INFO: Omitting " + elementName);
				continue;
			}
			var subClasses = this.manifest.subClassMap.get(elementName);
			var _g = 0;
			while(_g < subClasses.length) {
				var subClassName = subClasses[_g];
				++_g;
				var childStyle = elementStyle.parentStyle.findChild(subClassName,prime.gui.styling.StyleBlockType.element,elementStyle);
				if(childStyle == null || childStyle.parentStyle == elementStyle.parentStyle || childStyle.isEmpty()) continue;
				this.addStyleBlock(subClassName,prime.gui.styling.StyleBlockType.element,elementStyle.parentStyle);
			}
		}
	}
	,findSuperClassesInList: function(list) {
		if(list == null) return;
		var keys = new prime.bindable.collections.iterators.FastArrayForwardIterator(list._keys);
		while( keys.hasNext() ) {
			var name = keys.next();
			var style = list.get(name);
			this.setSuperStyle(name,style);
			if((style.filledProperties & 1024) != 0) this.findSuperStatesForStyle(name,style);
		}
	}
	,findExtendedClassesInList: function(list) {
		if(list == null) return;
		var keys = new prime.bindable.collections.iterators.FastArrayForwardIterator(list._keys);
		while( keys.hasNext() ) {
			var name = keys.next();
			var style = list.get(name);
			this.setExtendedStyle(name,style);
			this.createStyleStructure(style);
			if((style.filledProperties & 1024) != 0) this.findExtendedStatesForStyle(name,style);
		}
	}
	,createStyleStructure: function(style) {
		style.cleanUp();
		if((style.allFilledProperties & 8192) != 0) this.findExtendedClassesInList(style.getIdChildren());
		if((style.allFilledProperties & 4096) != 0) this.findExtendedClassesInList(style.getStyleNameChildren());
		if((style.allFilledProperties & 2048) != 0) {
			this.findSuperClassesInList(style.getElementChildren());
			this.findExtendedClassesInList(style.getElementChildren());
			this.createEmptySuperClassesForList(style.getElementChildren());
		}
	}
	,setManifestNamesInList: function(list,areElements) {
		if(areElements == null) areElements = false;
		if(list == null) return;
		var names = list._keys;
		var styles = list._values;
		var _g1 = 0, _g = names.length;
		while(_g1 < _g) {
			var i = _g1++;
			var style = styles[i];
			if(areElements && style.type == prime.gui.styling.StyleBlockType.element) names[i] = this.manifest.getFullName(names[i]);
			this.setManifestNames(style);
		}
	}
	,setManifestNames: function(style) {
		this.setManifestNamesInList(style.getIdChildren(),false);
		this.setManifestNamesInList(style.getStyleNameChildren(),false);
		this.setManifestNamesInList(style.getElementChildren(),true);
		if((style.filledProperties & 1024) != 0) {
			var states = style.getStates().states;
			var $it0 = new prime.bindable.collections.iterators.FastArrayForwardIterator(states._values);
			while( $it0.hasNext() ) {
				var stateStyle = $it0.next();
				this.setManifestNames(stateStyle);
			}
		}
	}
	,importStyleSheet: function(expr) {
		var url = expr.matched(3) != null?expr.matched(2):this.styleSheetBasePath + "/" + expr.matched(2);
		this.addStyleSheet(url);
		return "";
	}
	,importStyleSheets: function(styleContent) {
		var importExpr = new EReg("@import" + ("[ \\t]+" + "(url" + "[ \\t]*" + "[(])?['\"]" + "[ \\t]*" + "(" + ("([a-z]:/)?((" + ("(" + "[a-z][a-z0-9+%_, -]*" + ")|([.]{1,2})") + ")/)*((" + ("[a-z][a-z0-9+%_, -]*" + "[.][a-z0-9]+") + ")|(" + ("(" + "[a-z][a-z0-9+%_, -]*" + ")|([.]{1,2})") + ")/?)") + ")" + "[ \\t]*" + "['\"]" + "[ \\t]*" + "[)]?;"),"i");
		return importExpr.customReplace(styleContent,$bind(this,this.importStyleSheet));
	}
	,importManifest: function(expr) {
		this.manifest.addFile(this.styleSheetBasePath + "/" + expr.matched(2));
		return "";
	}
	,importManifests: function(styleContent) {
		var importExpr = new EReg("@manifest" + ("[ \\t]+" + "(url" + "[ \\t]*" + "[(])?['\"]" + "[ \\t]*" + "(" + ("([a-z]:/)?((" + ("(" + "[a-z][a-z0-9+%_, -]*" + ")|([.]{1,2})") + ")/)*((" + ("[a-z][a-z0-9+%_, -]*" + "[.][a-z0-9]+") + ")|(" + ("(" + "[a-z][a-z0-9+%_, -]*" + ")|([.]{1,2})") + ")/?)") + ")" + "[ \\t]*" + "['\"]" + "[ \\t]*" + "[)]?;"),"i");
		return importExpr.customReplace(styleContent,$bind(this,this.importManifest));
	}
	,parseStyleSheet: function(item) {
		this.timer.start();
		this.styleSheetBasePath = item.path;
		item.content = this.importManifests(item.content);
		prime.utils.ERegUtil.matchAll(this.blockExpr,item.content,$bind(this,this.handleMatchedBlock));
		this.timer.stop();
		console.log("\t" + Std.string(new Date()) + " - " + this.timer.runnedTime + " ms - " + ("parsed " + item.filename));
		this.timer.runnedTime = 0;
		return item;
	}
	,addStyleSheet: function(file) {
		var content = (function($this) {
			var $r;
			try {
				$r = js.Node.fs.readFileSync(file);
			} catch( e ) {
				$r = (function($this) {
					var $r;
					console.log("\n=============ERROR IMPORTING STYLESHEET=============\n");
					console.log("file: " + file);
					console.log("error: " + Std.string(e));
					$r = "";
					return $r;
				}($this));
			}
			return $r;
		}(this));
		if(content != "") {
			var origBase = this.styleSheetBasePath;
			var pathEndPos = file.lastIndexOf("/");
			var path = "";
			if(pathEndPos > -1) path = HxOverrides.substr(file,0,pathEndPos);
			var name = HxOverrides.substr(file,pathEndPos,null);
			this.styleSheetBasePath = path;
			var item = new prime.tools.StyleQueueItem(path,name);
			content = this.removeAllWhiteSpace(content);
			content = this.removeComments(content);
			content = this.importStyleSheets(content);
			item.content = content;
			this.styleSheetBasePath = origBase;
			this.styleSheetQueue.add(item);
		} else throw "Exiting...";
	}
	,parse: function(styleSheet,swfBasePath) {
		if(swfBasePath == null) swfBasePath = ".";
		this.swfBasePath = swfBasePath;
		this.addStyleSheet(styleSheet);
		while(!(this.styleSheetQueue._length == 0)) {
			var s = this.styleSheetQueue.remove(this.styleSheetQueue.getItemAt(0),0);
			this.parseStyleSheet(s);
		}
		this.timer.start();
		this.setManifestNames(this.styles);
		this.timer.stop();
		console.log("\t" + Std.string(new Date()) + " - " + this.timer.runnedTime + " ms - " + "injected packages from manifest");
		this.timer.runnedTime = 0;
		this.timer.start();
		this.createStyleStructure(this.styles);
		this.timer.stop();
		console.log("\t" + Std.string(new Date()) + " - " + this.timer.runnedTime + " ms - " + "created inheritance references");
		this.timer.runnedTime = 0;
	}
	,__class__: prime.tools.CSSParser
}
prime.tools.StyleQueueItem = function(path,filename,content) {
	if(content == null) content = "";
	if(path == null) path = "";
	this.path = path;
	this.content = content;
	this.filename = filename;
};
prime.tools.StyleQueueItem.__name__ = ["prime","tools","StyleQueueItem"];
prime.tools.StyleQueueItem.__interfaces__ = [prime.core.traits.IDisposable];
prime.tools.StyleQueueItem.prototype = {
	dispose: function() {
		this.path = this.content = this.filename = null;
	}
	,__class__: prime.tools.StyleQueueItem
}
if(!prime.tools._CSSParser) prime.tools._CSSParser = {}
prime.tools._CSSParser.Algorithms = { __ename__ : ["prime","tools","_CSSParser","Algorithms"], __constructs__ : ["floatHor","floatVer","circleHor","circleVer","dynamicTile","fixedTile","simpleTile","dynamicLayout","relative"] }
prime.tools._CSSParser.Algorithms.floatHor = ["floatHor",0];
prime.tools._CSSParser.Algorithms.floatHor.toString = $estr;
prime.tools._CSSParser.Algorithms.floatHor.__enum__ = prime.tools._CSSParser.Algorithms;
prime.tools._CSSParser.Algorithms.floatVer = ["floatVer",1];
prime.tools._CSSParser.Algorithms.floatVer.toString = $estr;
prime.tools._CSSParser.Algorithms.floatVer.__enum__ = prime.tools._CSSParser.Algorithms;
prime.tools._CSSParser.Algorithms.circleHor = ["circleHor",2];
prime.tools._CSSParser.Algorithms.circleHor.toString = $estr;
prime.tools._CSSParser.Algorithms.circleHor.__enum__ = prime.tools._CSSParser.Algorithms;
prime.tools._CSSParser.Algorithms.circleVer = ["circleVer",3];
prime.tools._CSSParser.Algorithms.circleVer.toString = $estr;
prime.tools._CSSParser.Algorithms.circleVer.__enum__ = prime.tools._CSSParser.Algorithms;
prime.tools._CSSParser.Algorithms.dynamicTile = ["dynamicTile",4];
prime.tools._CSSParser.Algorithms.dynamicTile.toString = $estr;
prime.tools._CSSParser.Algorithms.dynamicTile.__enum__ = prime.tools._CSSParser.Algorithms;
prime.tools._CSSParser.Algorithms.fixedTile = ["fixedTile",5];
prime.tools._CSSParser.Algorithms.fixedTile.toString = $estr;
prime.tools._CSSParser.Algorithms.fixedTile.__enum__ = prime.tools._CSSParser.Algorithms;
prime.tools._CSSParser.Algorithms.simpleTile = ["simpleTile",6];
prime.tools._CSSParser.Algorithms.simpleTile.toString = $estr;
prime.tools._CSSParser.Algorithms.simpleTile.__enum__ = prime.tools._CSSParser.Algorithms;
prime.tools._CSSParser.Algorithms.dynamicLayout = ["dynamicLayout",7];
prime.tools._CSSParser.Algorithms.dynamicLayout.toString = $estr;
prime.tools._CSSParser.Algorithms.dynamicLayout.__enum__ = prime.tools._CSSParser.Algorithms;
prime.tools._CSSParser.Algorithms.relative = ["relative",8];
prime.tools._CSSParser.Algorithms.relative.toString = $estr;
prime.tools._CSSParser.Algorithms.relative.__enum__ = prime.tools._CSSParser.Algorithms;
prime.tools.CSSParserMain = function(skin,primeDir) {
	this.skinFolder = skin;
	this.timer = new prime.tools.StopWatch();
	this.styles = new prime.gui.styling.StyleBlock(null);
	this.manifest = new prime.tools.Manifest();
	this.parser = new prime.tools.CSSParser(this.styles,this.manifest);
	this.generator = new prime.tools.generator.CodeGenerator();
	this.generator.instanceIgnoreList.set(this.styles._oid,this.styles);
	var tplName = primeDir + "/tools/StyleSheet.tpl.hx";
	if(!js.Node.fs.existsSync(tplName)) throw "Template does not exist! " + tplName;
	this.template = Std.string(js.Node.fs.readFileSync(tplName));
};
prime.tools.CSSParserMain.__name__ = ["prime","tools","CSSParserMain"];
prime.tools.CSSParserMain.main = function() {
	var args = js.Node.process.argv;
	args.shift();
	args.shift();
	if(args.length == 0) throw "Skin folder location is needed to run this script.";
	var timer = new prime.tools.StopWatch().start();
	var primeDir = "src/prime";
	if(args.length == 2) primeDir = args[1] + "/" + primeDir;
	var css = new prime.tools.CSSParserMain(args[0],primeDir);
	css.parse();
	css.generateCode();
	css.flush();
	console.log("\t" + Std.string(new Date()) + " - " + (function($this) {
		var $r;
		timer.runnedTime += haxe.Timer.stamp() * 1000 - timer.startTime;
		timer.timesList.push(timer.runnedTime);
		$r = timer.runnedTime;
		return $r;
	}(this)) + " ms - Done!");
}
prime.tools.CSSParserMain.prototype = {
	generateSelectorCode: function(selectorHash,name) {
		this.timer.start();
		var i = 0;
		var $it0 = selectorHash.keys();
		while( $it0.hasNext() ) {
			var key = $it0.next();
			var val = selectorHash.get(key);
			if(!val.isEmpty()) {
				this.generator.setSelfAction(name + ".set",[key,val]);
				i++;
			}
		}
		this.timer.stop();
		console.log("\t" + Std.string(new Date()) + " - " + this.timer.runnedTime + " ms - " + ("generate " + name + " (" + i + ")"));
		this.timer.runnedTime = 0;
	}
	,flush: function() {
		this.timer.start();
		js.Node.fs.writeFileSync(this.skinFolder + "/StyleSheet.hx",this.template);
		this.timer.stop();
		console.log("\t" + Std.string(new Date()) + " - " + this.timer.runnedTime + " ms - " + (" Writing code to " + this.skinFolder + "/StyleSheet.hx"));
		this.timer.runnedTime = 0;
	}
	,setTemplateVar: function(varName,replacement) {
		this.timer.start();
		varName = "//" + varName;
		var pos = this.template.indexOf(varName);
		if(pos == -1) return;
		var begin = HxOverrides.substr(this.template,0,pos);
		pos += varName.length;
		var end = HxOverrides.substr(this.template,pos,null);
		this.template = begin + replacement.b + end;
		this.timer.stop();
		console.log("\t" + Std.string(new Date()) + " - " + this.timer.runnedTime + " ms - " + ("write " + varName));
		this.timer.runnedTime = 0;
	}
	,generateCode: function() {
		this.generator.start();
		if((this.styles.allFilledProperties & 2048) != 0) this.generateSelectorCode(this.styles.getElementChildren(),"elementChildren");
		if((this.styles.allFilledProperties & 4096) != 0) this.generateSelectorCode(this.styles.getStyleNameChildren(),"styleNameChildren");
		if((this.styles.allFilledProperties & 8192) != 0) this.generateSelectorCode(this.styles.getIdChildren(),"idChildren");
		this.setTemplateVar("imports",prime.tools.generator.output.HaxeOutputUtil.writeImports(this.generator.imports));
		this.setTemplateVar("selectors",prime.tools.generator.output.HaxeOutputUtil.writeValues(this.generator.values));
		this.generator.flush();
	}
	,parse: function() {
		this.timer.start();
		this.parser.parse(this.skinFolder + "/Style.css","..");
		this.timer.stop();
		console.log("\t" + Std.string(new Date()) + " - " + this.timer.runnedTime + " ms - " + ("Parsing: " + this.skinFolder + "/Style.css"));
		this.timer.runnedTime = 0;
	}
	,__class__: prime.tools.CSSParserMain
}
prime.tools.Manifest = function(file) {
	this.classPackageMap = new prime.types.SimpleDictionary();
	this.superClassMap = new prime.types.SimpleDictionary();
	this.subClassMap = new prime.types.SimpleDictionary();
	if(file != null) this.addFile(file);
};
prime.tools.Manifest.__name__ = ["prime","tools","Manifest"];
prime.tools.Manifest.__interfaces__ = [prime.core.traits.IDisposable];
prime.tools.Manifest.prototype = {
	getFullSuperClassName: function(className) {
		return this.getFullName(this.getSuperClassName(className));
	}
	,hasSubClasses: function(fullClassName) {
		return this.subClassMap.get(fullClassName) != null && this.subClassMap.get(fullClassName).length > 0;
	}
	,getSuperClassName: function(fullClassName) {
		if(prime.utils.FastArrayUtil.indexOf(this.superClassMap._keys,fullClassName,null) > -1) return this.superClassMap.get(fullClassName);
		return null;
	}
	,getFullName: function(className) {
		if(className == null) return null;
		if(prime.utils.FastArrayUtil.indexOf(this.classPackageMap._keys,className,null) > -1) return this.classPackageMap.get(className);
		return className;
	}
	,addFile: function(file) {
		var c = Std.string(js.Node.fs.readFileSync(file));
		var content = new haxe.xml.Fast(Xml.parse(c).firstElement());
		var $it0 = content.nodes.resolve("component").iterator();
		while( $it0.hasNext() ) {
			var item = $it0.next();
			try {
				this.classPackageMap.set(item.att.resolve("id"),item.att.resolve("fullname"));
				this.superClassMap.set(item.att.resolve("fullname"),item.att.resolve("superClass"));
				if(!(prime.utils.FastArrayUtil.indexOf(this.subClassMap._keys,item.att.resolve("fullname"),null) > -1)) this.subClassMap.set(item.att.resolve("fullname"),[]);
			} catch( e ) {
				null;
			}
		}
		var classNames = new prime.bindable.collections.iterators.FastArrayForwardIterator(this.superClassMap._keys);
		while( classNames.hasNext() ) {
			var className = classNames.next();
			var superClassName = this.getFullName(this.getSuperClassName(className));
			while(superClassName != null && superClassName != "") {
				var list = this.subClassMap.get(superClassName);
				if(list == null) list = this.subClassMap.set(superClassName,[]);
				if(prime.utils.FastArrayUtil.indexOf(list,className,null) == -1) list.push(className);
				superClassName = this.getFullName(this.getSuperClassName(superClassName));
			}
		}
	}
	,dispose: function() {
		this.classPackageMap.dispose();
		this.superClassMap.dispose();
		this.subClassMap.dispose();
		this.classPackageMap = null;
		this.superClassMap = null;
		this.subClassMap = null;
	}
	,__class__: prime.tools.Manifest
}
prime.tools.StopWatch = function() {
	this.timesList = [];
	this.runnedTime = 0;
};
prime.tools.StopWatch.__name__ = ["prime","tools","StopWatch"];
prime.tools.StopWatch.prototype = {
	stop: function() {
		this.runnedTime += haxe.Timer.stamp() * 1000 - this.startTime;
		this.timesList.push(this.runnedTime);
		return this.runnedTime;
	}
	,start: function() {
		this.runnedTime = 0;
		this.startTime = haxe.Timer.stamp() * 1000;
		return this;
	}
	,__class__: prime.tools.StopWatch
}
prime.tools.generator.ICodeGenerator = function() { }
prime.tools.generator.ICodeGenerator.__name__ = ["prime","tools","generator","ICodeGenerator"];
prime.tools.generator.ICodeGenerator.prototype = {
	__class__: prime.tools.generator.ICodeGenerator
}
prime.tools.generator.CodeGenerator = function() {
	this.instanceIgnoreList = new IntHash();
};
prime.tools.generator.CodeGenerator.__name__ = ["prime","tools","generator","CodeGenerator"];
prime.tools.generator.CodeGenerator.__interfaces__ = [prime.tools.generator.ICodeGenerator];
prime.tools.generator.CodeGenerator.prototype = {
	convertType: function(t,value) {
		var type = null;
		var $e = (t);
		switch( $e[1] ) {
		case 6:
			var c = $e[2];
			type = this.createClassNameConstructor(Type.getClassName(c),null);
			break;
		case 0:
			type = prime.tools.generator.ValueType.tEmpty(prime.tools.generator.EmptyType.eNull);
			break;
		case 2:
			type = prime.tools.generator.ValueType.tFloat(value);
			break;
		case 1:
			type = prime.tools.generator.ValueType.tInt(value);
			break;
		case 3:
			type = prime.tools.generator.ValueType.tBool(value);
			break;
		case 5:
			type = prime.tools.generator.ValueType.tFunction(value);
			break;
		case 4:
			type = this.createClassNameConstructor(Type.getClassName(Type.getClass(value)),null);
			break;
		case 7:
			var e = $e[2];
			type = this.convertEnum(e);
			break;
		case 8:
			type = prime.tools.generator.ValueType.tEmpty(prime.tools.generator.EmptyType.eNull);
			break;
		}
		return type;
	}
	,convertEnum: function(obj) {
		var name = this.addImportFor(Type.getEnumName(Type.getEnum(obj))) + "." + obj[0];
		var eParams = obj.slice(2);
		var tParams = [];
		if(eParams.length > 0) {
			var _g = 0;
			while(_g < eParams.length) {
				var eParam = eParams[_g];
				++_g;
				var tParam = this.convertType(Type["typeof"](eParam),eParam);
				if(tParam != null) tParams.push(tParam);
			}
		}
		if(tParams.length == 0) tParams = null;
		return prime.tools.generator.ValueType.tEnum(name,tParams);
	}
	,useObject: function(v) {
		var $e = (v);
		switch( $e[1] ) {
		case 8:
			var i = $e[2];
			i.count++;
			return v;
		default:
			return v;
		}
	}
	,getArray: function(arr) {
		if(prime.utils.FastArrayUtil.indexOf(this.arrInstances._keys,arr,null) > -1) return this.useObject(this.arrInstances.get(arr));
		var type = prime.tools.generator.ValueType.tObject(new prime.tools.generator.Instance("Array",prime.tools.generator.InstanceType.array,this.formatParams(arr)));
		this.arrInstances.set(arr,type);
		this.values.push(type);
		return type;
	}
	,getObject: function(obj) {
		if(this.objInstances.exists(obj._oid)) return this.useObject(this.objInstances.get(obj._oid));
		if(this.instanceIgnoreList.exists(obj._oid)) return prime.tools.generator.ValueType.tEmpty(prime.tools.generator.EmptyType.eNull);
		obj.cleanUp();
		obj.toCode(this);
		return this.objInstances.get(obj._oid);
	}
	,hasArray: function(arr) {
		return prime.utils.FastArrayUtil.indexOf(this.arrInstances._keys,arr,null) > -1;
	}
	,hasObject: function(obj) {
		return this.objInstances.exists(obj._oid);
	}
	,formatValue: function(v) {
		var type = v != null && (Reflect.hasField(v,"color") && Reflect.hasField(v,"a"))?prime.tools.generator.ValueType.tColor(v.color,v.a):js.Boot.__instanceof(v,prime.tools.generator.ICodeFormattable)?this.getObject(v):js.Boot.__instanceof(v,prime.types.Reference)?(function($this) {
			var $r;
			var $e = (js.Boot.__cast(v , prime.types.Reference));
			switch( $e[1] ) {
			case 3:
				var css = $e[3], name = $e[2];
				$r = prime.tools.generator.ValueType.tClass(name);
				break;
			case 1:
				var factory = $e[2];
				$r = $this.getObject(factory);
				break;
			case 2:
				var css = $e[4], p = $e[3], name = $e[2];
				$r = $this.createClassNameConstructor(name,p);
				break;
			case 0:
				var css = $e[3], name = $e[2];
				$r = prime.tools.generator.ValueType.tFunction(name);
				break;
			default:
				$r = null;
			}
			return $r;
		}(this)):js.Boot.__instanceof(v,Float) && !(v != null && v == v)?prime.tools.generator.ValueType.tEmpty(prime.tools.generator.EmptyType.eFloat):js.Boot.__instanceof(v,Int) && (v == -2147483648 || v == null)?prime.tools.generator.ValueType.tEmpty(prime.tools.generator.EmptyType.eInt):v == null?prime.tools.generator.ValueType.tEmpty(prime.tools.generator.EmptyType.eNull):js.Boot.__instanceof(v,String)?prime.tools.generator.ValueType.tString(v):js.Boot.__instanceof(v,Array)?this.getArray(v):js.Boot.__instanceof(v,Int)?v > 255?prime.tools.generator.ValueType.tUInt(v):prime.tools.generator.ValueType.tInt(v):js.Boot.__instanceof(v,Float)?prime.tools.generator.ValueType.tFloat(v):js.Boot.__instanceof(v,Bool)?prime.tools.generator.ValueType.tBool(v):null != Type.getEnum(v)?this.convertEnum(v):v.__name__ != null?prime.tools.generator.ValueType.tClass(this.addImportFor(Type.getClassName(v))):null != Type.getClass(v)?this.createClassNameConstructor(v.getClass().getClassName(),null):null;
		if(type == null) type = this.convertType(Type["typeof"](v),v);
		return type;
	}
	,formatParams: function(args) {
		if(args == null || args.length == 0) return [];
		var newArgs = new Array();
		var _g1 = 0, _g = args.length;
		while(_g1 < _g) {
			var i = _g1++;
			newArgs[i] = this.formatValue(args[i]);
		}
		var i = newArgs.length;
		try {
			while(i-- > 0) {
				var $e = (newArgs[i]);
				switch( $e[1] ) {
				case 0:
					var v = $e[2];
					newArgs.pop();
					break;
				default:
					throw "__break__";
				}
			}
		} catch( e ) { if( e != "__break__" ) throw e; }
		return newArgs;
	}
	,addImportFor: function(fullName) {
		var i = fullName.lastIndexOf(".");
		if(i == -1) return fullName;
		var name = HxOverrides.substr(fullName,i + 1,null);
		if(this.imports.exists(name)) return this.imports.get(name) == fullName?name:fullName;
		this.imports.set(name,fullName);
		return name;
	}
	,setProp: function(obj,name,value,ignoreIfEmpty) {
		if(ignoreIfEmpty == null) ignoreIfEmpty = false;
		var v = this.formatValue(value);
		if(ignoreIfEmpty && (function($this) {
			var $r;
			var $e = (v);
			switch( $e[1] ) {
			case 0:
				var v1 = $e[2];
				$r = true;
				break;
			default:
				$r = false;
			}
			return $r;
		}(this))) v = null;
		if(v != null) this.values.push(prime.tools.generator.ValueType.tSetProperty(this.getObject(obj),name,v));
	}
	,setAction: function(obj,name,params,onlyWithParams) {
		if(onlyWithParams == null) onlyWithParams = false;
		var p = this.formatParams(params);
		if(!onlyWithParams || p.length > 0) this.values.push(prime.tools.generator.ValueType.tCallMethod(this.getObject(obj),name,p));
	}
	,constructFromFactory: function(obj,factoryMethod,params) {
		var type = prime.tools.generator.ValueType.tCallStatic(this.addImportFor(Type.getClassName(Type.getClass(obj))),factoryMethod,this.formatParams(params));
		this.objInstances.set(obj._oid,type);
		return type;
	}
	,createFactory: function(obj,classRef,params,arguments) {
		obj.cleanUp();
		var type = prime.tools.generator.ValueType.tObject(new prime.tools.generator.Instance(null,prime.tools.generator.InstanceType.objFactory(new prime.tools.generator.Instance(this.addImportFor(classRef),prime.tools.generator.InstanceType.object,this.formatParams(params)),arguments),null));
		this.objInstances.set(obj._oid,type);
		return type;
	}
	,createClassNameConstructor: function(cFullName,params) {
		return prime.tools.generator.ValueType.tObject(new prime.tools.generator.Instance(this.addImportFor(cFullName),prime.tools.generator.InstanceType.object,this.formatParams(params)));
	}
	,construct: function(obj,params,alternativeType) {
		obj.cleanUp();
		var classRef = alternativeType == null?Type.getClass(obj):alternativeType;
		var cFullName = Type.getClassName(classRef);
		var type = obj.isEmpty()?prime.tools.generator.ValueType.tEmpty(prime.tools.generator.EmptyType.eNull):prime.tools.generator.ValueType.tObject(new prime.tools.generator.Instance(this.addImportFor(cFullName),prime.tools.generator.InstanceType.object,this.formatParams(params)));
		this.objInstances.set(obj._oid,type);
		return type;
	}
	,setSelfAction: function(name,params) {
		this.values.push(prime.tools.generator.ValueType.tCallMethod(null,name,this.formatParams(params)));
	}
	,flush: function() {
		if(!this.isStarted) return;
		this.arrInstances.dispose();
		this.values = null;
		this.objInstances = null;
		this.arrInstances = null;
		this.imports = null;
	}
	,start: function() {
		if(!this.isStarted) {
			this.values = new Array();
			this.objInstances = new IntHash();
			this.arrInstances = new prime.types.SimpleDictionary();
			this.imports = new Hash();
			this.isStarted = true;
		}
	}
	,__class__: prime.tools.generator.CodeGenerator
}
prime.tools.generator.Instance = function(className,type,params) {
	this.count = 1;
	this.instName = null;
	this.instantiated = false;
	this.className = className;
	this.params = params;
	this.type = type;
};
prime.tools.generator.Instance.__name__ = ["prime","tools","generator","Instance"];
prime.tools.generator.Instance.prototype = {
	__class__: prime.tools.generator.Instance
}
prime.tools.generator.InstanceType = { __ename__ : ["prime","tools","generator","InstanceType"], __constructs__ : ["object","array","objFactory","arrayFactory"] }
prime.tools.generator.InstanceType.object = ["object",0];
prime.tools.generator.InstanceType.object.toString = $estr;
prime.tools.generator.InstanceType.object.__enum__ = prime.tools.generator.InstanceType;
prime.tools.generator.InstanceType.array = ["array",1];
prime.tools.generator.InstanceType.array.toString = $estr;
prime.tools.generator.InstanceType.array.__enum__ = prime.tools.generator.InstanceType;
prime.tools.generator.InstanceType.objFactory = function(target,args) { var $x = ["objFactory",2,target,args]; $x.__enum__ = prime.tools.generator.InstanceType; $x.toString = $estr; return $x; }
prime.tools.generator.InstanceType.arrayFactory = function(target,args) { var $x = ["arrayFactory",3,target,args]; $x.__enum__ = prime.tools.generator.InstanceType; $x.toString = $estr; return $x; }
prime.tools.generator.ValueType = { __ename__ : ["prime","tools","generator","ValueType"], __constructs__ : ["tEmpty","tString","tInt","tUInt","tFloat","tBool","tEnum","tClass","tObject","tColor","tFunction","tCallStatic","tCallMethod","tSetProperty"] }
prime.tools.generator.ValueType.tEmpty = function(value) { var $x = ["tEmpty",0,value]; $x.__enum__ = prime.tools.generator.ValueType; $x.toString = $estr; return $x; }
prime.tools.generator.ValueType.tString = function(value) { var $x = ["tString",1,value]; $x.__enum__ = prime.tools.generator.ValueType; $x.toString = $estr; return $x; }
prime.tools.generator.ValueType.tInt = function(value) { var $x = ["tInt",2,value]; $x.__enum__ = prime.tools.generator.ValueType; $x.toString = $estr; return $x; }
prime.tools.generator.ValueType.tUInt = function(value) { var $x = ["tUInt",3,value]; $x.__enum__ = prime.tools.generator.ValueType; $x.toString = $estr; return $x; }
prime.tools.generator.ValueType.tFloat = function(value) { var $x = ["tFloat",4,value]; $x.__enum__ = prime.tools.generator.ValueType; $x.toString = $estr; return $x; }
prime.tools.generator.ValueType.tBool = function(value) { var $x = ["tBool",5,value]; $x.__enum__ = prime.tools.generator.ValueType; $x.toString = $estr; return $x; }
prime.tools.generator.ValueType.tEnum = function(value,params) { var $x = ["tEnum",6,value,params]; $x.__enum__ = prime.tools.generator.ValueType; $x.toString = $estr; return $x; }
prime.tools.generator.ValueType.tClass = function(value) { var $x = ["tClass",7,value]; $x.__enum__ = prime.tools.generator.ValueType; $x.toString = $estr; return $x; }
prime.tools.generator.ValueType.tObject = function(value) { var $x = ["tObject",8,value]; $x.__enum__ = prime.tools.generator.ValueType; $x.toString = $estr; return $x; }
prime.tools.generator.ValueType.tColor = function(rgb,alpha) { var $x = ["tColor",9,rgb,alpha]; $x.__enum__ = prime.tools.generator.ValueType; $x.toString = $estr; return $x; }
prime.tools.generator.ValueType.tFunction = function(value) { var $x = ["tFunction",10,value]; $x.__enum__ = prime.tools.generator.ValueType; $x.toString = $estr; return $x; }
prime.tools.generator.ValueType.tCallStatic = function(className,method,params) { var $x = ["tCallStatic",11,className,method,params]; $x.__enum__ = prime.tools.generator.ValueType; $x.toString = $estr; return $x; }
prime.tools.generator.ValueType.tCallMethod = function(on,method,params) { var $x = ["tCallMethod",12,on,method,params]; $x.__enum__ = prime.tools.generator.ValueType; $x.toString = $estr; return $x; }
prime.tools.generator.ValueType.tSetProperty = function(on,prop,value) { var $x = ["tSetProperty",13,on,prop,value]; $x.__enum__ = prime.tools.generator.ValueType; $x.toString = $estr; return $x; }
prime.tools.generator.EmptyType = { __ename__ : ["prime","tools","generator","EmptyType"], __constructs__ : ["eNull","eString","eInt","eFloat"] }
prime.tools.generator.EmptyType.eNull = ["eNull",0];
prime.tools.generator.EmptyType.eNull.toString = $estr;
prime.tools.generator.EmptyType.eNull.__enum__ = prime.tools.generator.EmptyType;
prime.tools.generator.EmptyType.eString = ["eString",1];
prime.tools.generator.EmptyType.eString.toString = $estr;
prime.tools.generator.EmptyType.eString.__enum__ = prime.tools.generator.EmptyType;
prime.tools.generator.EmptyType.eInt = ["eInt",2];
prime.tools.generator.EmptyType.eInt.toString = $estr;
prime.tools.generator.EmptyType.eInt.__enum__ = prime.tools.generator.EmptyType;
prime.tools.generator.EmptyType.eFloat = ["eFloat",3];
prime.tools.generator.EmptyType.eFloat.toString = $estr;
prime.tools.generator.EmptyType.eFloat.__enum__ = prime.tools.generator.EmptyType;
if(!prime.tools.generator.output) prime.tools.generator.output = {}
prime.tools.generator.output.HaxeOutputUtil = function() { }
prime.tools.generator.output.HaxeOutputUtil.__name__ = ["prime","tools","generator","output","HaxeOutputUtil"];
prime.tools.generator.output.HaxeOutputUtil.writeValues = function(values) {
	var doc = new StringBuf();
	var _g = 0;
	while(_g < values.length) {
		var value = values[_g];
		++_g;
		prime.tools.generator.output.HaxeOutputUtil.addLine(doc,prime.tools.generator.output.HaxeOutputUtil.write(doc,value));
	}
	return doc;
}
prime.tools.generator.output.HaxeOutputUtil.writeImports = function(list) {
	var output = new StringBuf();
	var arr = new Array();
	var $it0 = list.iterator();
	while( $it0.hasNext() ) {
		var importable = $it0.next();
		arr.push(importable);
	}
	arr.sort(function(a,b) {
		return Reflect.compare(a.toLowerCase(),b.toLowerCase());
	});
	var _g = 0;
	while(_g < arr.length) {
		var file = arr[_g];
		++_g;
		output.b += Std.string(" import " + file + ";\n");
	}
	return output;
}
prime.tools.generator.output.HaxeOutputUtil.addLine = function(buf,v) {
	if(v != null) buf.b += Std.string("\n\t\t" + v + ";");
	return buf;
}
prime.tools.generator.output.HaxeOutputUtil.write = function(doc,content) {
	var $e = (content);
	switch( $e[1] ) {
	case 1:
		var v = $e[2];
		return "'" + v + "'";
	case 5:
		var v = $e[2];
		return v == true?"true":"false";
	case 8:
		var v = $e[2];
		return prime.tools.generator.output.HaxeOutputUtil.writeObj(doc,v);
	case 9:
		var a = $e[3], rgb = $e[2];
		return "0x" + StringTools.hex(rgb,6) + "" + StringTools.hex(a,2);
	case 3:
		var v = $e[2];
		return "0x" + StringTools.hex(v | 0,6);
	case 10:
		var v = $e[2];
		return v;
	case 6:
		var p = $e[3], v = $e[2];
		return v + (p == null?"":"(" + prime.tools.generator.output.HaxeOutputUtil.format(p,doc) + ")");
	case 7:
		var v = $e[2];
		return v;
	case 4:
		var v = $e[2];
		return Std.string(v);
	case 0:
		var v = $e[2];
		switch( (v)[1] ) {
		case 0:
			return "null";
		case 2:
			return "Number.INT_NOT_SET";
		case 3:
			return "Number.FLOAT_NOT_SET";
		case 1:
			return "''";
		}
		break;
	case 2:
		var v = $e[2];
		if(v == -2147483644) return "LayoutStyleFlags.FILL"; else if(v == -2147483640) return "Number.EMPTY"; else return Std.string(v);
		break;
	case 11:
		var p = $e[4], m = $e[3], o = $e[2];
		return o + "." + m + "(" + prime.tools.generator.output.HaxeOutputUtil.format(p,doc) + ")";
	case 12:
		var p = $e[4], m = $e[3], o = $e[2];
		return (o != null?prime.tools.generator.output.HaxeOutputUtil.write(doc,o):"this") + "." + m + "(" + prime.tools.generator.output.HaxeOutputUtil.format(p,doc) + ")";
	case 13:
		var v = $e[4], n = $e[3], o = $e[2];
		return (o != null?prime.tools.generator.output.HaxeOutputUtil.write(doc,o):"this") + "." + n + " = " + prime.tools.generator.output.HaxeOutputUtil.write(doc,v);
	}
}
prime.tools.generator.output.HaxeOutputUtil.writeObj = function(doc,v) {
	if(v.count == 0) return null;
	if(v.instantiated) return v.instName;
	var value = new StringBuf();
	var a = function(s) {
		value.b += Std.string(s);
	};
	v.instantiated = true;
	var $e = (v.type);
	switch( $e[1] ) {
	case 0:
		value.b += Std.string("new ");
		value.b += Std.string(v.className);
		value.b += Std.string("(");
		value.b += Std.string(prime.tools.generator.output.HaxeOutputUtil.format(v.params,doc,null));
		value.b += Std.string(")");
		break;
	case 1:
		prime.tools.generator.output.HaxeOutputUtil.writeInstantiateArray(value,doc,v,null);
		break;
	case 2:
		var a2 = $e[3], f = $e[2];
		var args = prime.tools.generator.output.HaxeOutputUtil.writeArgs(a2);
		a("function (");
		a(args);
		a(") { return ");
		value.b += Std.string("new ");
		value.b += Std.string(f.className);
		value.b += Std.string("(");
		value.b += Std.string(prime.tools.generator.output.HaxeOutputUtil.format(f.params,doc,args));
		value.b += Std.string(")");
		a("; }");
		break;
	case 3:
		var a2 = $e[3], f = $e[2];
		var args = prime.tools.generator.output.HaxeOutputUtil.writeArgs(a2);
		a("function (");
		a(args);
		a(") { return ");
		prime.tools.generator.output.HaxeOutputUtil.writeInstantiateArray(value,doc,f,args);
		a("; }");
		break;
	}
	if(v.count > 1) return (function($this) {
		var $r;
		v.instName = prime.tools.generator.output.HaxeOutputUtil.toVarName(v.className);
		prime.tools.generator.output.HaxeOutputUtil.addLine(doc,"var " + v.instName + " = " + value.b);
		$r = v.instName;
		return $r;
	}(this)); else return value.b;
}
prime.tools.generator.output.HaxeOutputUtil.format = function(params,doc,extraParams) {
	var output = [];
	var _g = 0;
	while(_g < params.length) {
		var param = params[_g];
		++_g;
		output.push(prime.tools.generator.output.HaxeOutputUtil.write(doc,param));
	}
	if(extraParams == "") extraParams = null;
	var p = output.join(", ");
	if(p != "" && extraParams != null) p += ", " + extraParams; else if(extraParams != null) p = extraParams;
	return p;
}
prime.tools.generator.output.HaxeOutputUtil.writeArgs = function(args) {
	return args == null?"":args.join(", ");
}
prime.tools.generator.output.HaxeOutputUtil.writeInstantiateArray = function(line,doc,v,extraParams) {
	var p = prime.tools.generator.output.HaxeOutputUtil.format(v.params,doc);
	if(p != "" && extraParams != null) p += ", " + extraParams; else if(extraParams != null) p = extraParams;
	line.b += Std.string("[");
	line.b += Std.string(prime.tools.generator.output.HaxeOutputUtil.format(v.params,doc,extraParams));
	line.b += Std.string("]");
}
prime.tools.generator.output.HaxeOutputUtil.toVarName = function(className) {
	var index, name = className;
	while(-1 != (index = name.indexOf("."))) name = HxOverrides.substr(name,index + 1,null);
	name = HxOverrides.substr(name,0,1).toLowerCase() + HxOverrides.substr(name,1,null);
	name += prime.tools.generator.output.HaxeOutputUtil.instances++;
	return name;
}
if(!prime.types) prime.types = {}
prime.types.Asset = function() { }
prime.types.Asset.__name__ = ["prime","types","Asset"];
prime.types.Asset.__interfaces__ = [prime.tools.generator.ICodeFormattable,prime.core.traits.IValueObject,prime.core.traits.IDisposable];
prime.types.Asset.prototype = {
	toCode: function(code) {
		var method = null;
		if(js.Boot.__instanceof(this.source,prime.types.URI)) method = "fromURI"; else if(js.Boot.__instanceof(this.source,prime.types.Factory)) method = "fromFactory"; else if(js.Boot.__instanceof(this.source,prime.core.net.ICommunicator)) method = "fromLoader"; else if(js.Boot.__instanceof(this.source,String)) method = "fromString"; else method = "fromUnkown";
		code.constructFromFactory(this,method,[this.source]);
	}
	,cleanUp: function() {
	}
	,isEmpty: function() {
		return this.source == null;
	}
	,close: function() {
		null;
	}
	,unsetData: function() {
		if(this.state.current == prime.types.AssetStates.empty) return;
		this.close();
		if(this.state != null) this.state.setCurrent(prime.types.AssetStates.empty);
		if(this.bitmapData != null) {
			this.bitmapData.dispose();
			this.bitmapData = null;
		}
		this.width = -2147483648;
		this.height = -2147483648;
	}
	,dispose: function() {
		this.unsetData();
		this.state.dispose();
		this.state = null;
		this.source = null;
		this._oid = 0;
	}
	,__class__: prime.types.Asset
}
prime.types.AssetStates = { __ename__ : ["prime","types","AssetStates"], __constructs__ : ["empty","loadable","loading","ready"] }
prime.types.AssetStates.empty = ["empty",0];
prime.types.AssetStates.empty.toString = $estr;
prime.types.AssetStates.empty.__enum__ = prime.types.AssetStates;
prime.types.AssetStates.loadable = ["loadable",1];
prime.types.AssetStates.loadable.toString = $estr;
prime.types.AssetStates.loadable.__enum__ = prime.types.AssetStates;
prime.types.AssetStates.loading = ["loading",2];
prime.types.AssetStates.loading.toString = $estr;
prime.types.AssetStates.loading.__enum__ = prime.types.AssetStates;
prime.types.AssetStates.ready = ["ready",3];
prime.types.AssetStates.ready.toString = $estr;
prime.types.AssetStates.ready.__enum__ = prime.types.AssetStates;
prime.types.Factory = function(classRef,params,args,cssValue) {
	this._oid = prime.utils.ID.next++;
	if(params == null) params = [];
	this.classRef = classRef;
	this.params = params;
	this.arguments = args;
	this.cssValue = cssValue;
};
prime.types.Factory.__name__ = ["prime","types","Factory"];
prime.types.Factory.__interfaces__ = [prime.neko.traits.IHasTypeParameters,prime.tools.generator.ICodeFormattable,prime.tools.generator.ICSSFormattable,prime.core.traits.IDisposable];
prime.types.Factory.prototype = {
	cleanUp: function() {
		if(this.params == null) return;
		var emptyCounter = 0;
		var _g = 0, _g1 = this.params;
		while(_g < _g1.length) {
			var item = _g1[_g];
			++_g;
			if(item == null) emptyCounter++;
		}
		if(emptyCounter == this.params.length) this.params = null;
	}
	,toCode: function(code) {
		code.createFactory(this,this.classRef,this.params == null?prime.types.Factory.EMPTY_ARRAY:this.params,this.arguments);
	}
	,isEmpty: function() {
		return this.classRef == null;
	}
	,toCSS: function(prefix) {
		if(prefix == null) prefix = "";
		return this.cssValue == null?this.classRef:this.cssValue;
	}
	,dispose: function() {
		this._oid = 0;
		this.classRef = null;
		this.params = null;
		this.arguments = null;
	}
	,__class__: prime.types.Factory
}
prime.types.Number = function() { }
prime.types.Number.__name__ = ["prime","types","Number"];
prime.types.Reference = { __ename__ : ["prime","types","Reference"], __constructs__ : ["func","objInstance","classInstance","className"] }
prime.types.Reference.func = function(name,cssValue) { var $x = ["func",0,name,cssValue]; $x.__enum__ = prime.types.Reference; $x.toString = $estr; return $x; }
prime.types.Reference.objInstance = function(obj) { var $x = ["objInstance",1,obj]; $x.__enum__ = prime.types.Reference; $x.toString = $estr; return $x; }
prime.types.Reference.classInstance = function(name,p,cssValue) { var $x = ["classInstance",2,name,p,cssValue]; $x.__enum__ = prime.types.Reference; $x.toString = $estr; return $x; }
prime.types.Reference.className = function(name,cssValue) { var $x = ["className",3,name,cssValue]; $x.__enum__ = prime.types.Reference; $x.toString = $estr; return $x; }
prime.types.ReferenceUtil = function() { }
prime.types.ReferenceUtil.__name__ = ["prime","types","ReferenceUtil"];
prime.types.SimpleDictionary = function(size,fixed) {
	if(fixed == null) fixed = false;
	if(size == null) size = 0;
	this._oid = prime.utils.ID.next++;
	this._keys = size == 0?[]:Array(size);
	this._values = size == 0?[]:Array(size);
};
prime.types.SimpleDictionary.__name__ = ["prime","types","SimpleDictionary"];
prime.types.SimpleDictionary.__interfaces__ = [prime.tools.generator.ICodeFormattable,prime.core.traits.IClonable,prime.core.traits.IDisposable];
prime.types.SimpleDictionary.prototype = {
	toCode: function(code) {
		if(!this.isEmpty()) {
			var type = null;
			if(this._values.length > 0) {
				var key0 = this._keys[0];
				if(js.Boot.__instanceof(key0,Int)) type = IntHash; else if(js.Boot.__instanceof(key0,String)) type = Hash;
			}
			if(type == null) code.construct(this,[this._values.length]); else code.construct(this,null,type);
			var _g1 = 0, _g = this._values.length;
			while(_g1 < _g) {
				var i = _g1++;
				code.setAction(this,"set",[this._keys[i],this._values[i]]);
			}
		}
	}
	,cleanUp: function() {
		var keysToRemove = [];
		var _g1 = 0, _g = this._values.length;
		while(_g1 < _g) {
			var i = _g1++;
			if(!js.Boot.__instanceof(this._values[i],prime.tools.generator.ICodeFormattable)) continue;
			var item = this._values[i];
			item.cleanUp();
			if(item.isEmpty()) keysToRemove.push(this._keys[i]);
		}
		var _g = 0;
		while(_g < keysToRemove.length) {
			var key = keysToRemove[_g];
			++_g;
			this.unset(key);
		}
	}
	,keys: function() {
		return new prime.bindable.collections.iterators.FastArrayForwardIterator(this._keys);
	}
	,isEmpty: function() {
		return this._values.length == 0;
	}
	,iterator: function() {
		return new prime.bindable.collections.iterators.FastArrayForwardIterator(this._values);
	}
	,removeAt: function(index) {
		prime.utils.FastArrayUtil.removeAt(this._values,index);
		prime.utils.FastArrayUtil.removeAt(this._keys,index);
	}
	,unset: function(key) {
		var index = prime.utils.FastArrayUtil.indexOf(this._keys,key,null);
		if(index > -1) this.removeAt(index);
	}
	,get: function(key) {
		var index = prime.utils.FastArrayUtil.indexOf(this._keys,key,null);
		return index > -1?this._values[index]:null;
	}
	,set: function(key,val) {
		var index = prime.utils.FastArrayUtil.indexOf(this._keys,key,null);
		if(index == -1) {
			this._keys.push(key);
			this._values.push(val);
		} else this._values[index] = val;
		return val;
	}
	,removeAll: function() {
		prime.utils.FastArrayUtil.removeAll(this._keys);
		prime.utils.FastArrayUtil.removeAll(this._values);
	}
	,clone: function() {
		var inst = new prime.types.SimpleDictionary();
		var _g1 = 0, _g = this._values.length;
		while(_g1 < _g) {
			var i = _g1++;
			inst.set(this._keys[i],this._values[i]);
		}
		return inst;
	}
	,dispose: function() {
		this.removeAll();
		this._keys = null;
		this._values = null;
	}
	,__class__: prime.types.SimpleDictionary
}
prime.types.URI = function(str) {
	this._oid = prime.utils.ID.next++;
	this.string = null;
	this.port = -1;
	this.parse(str);
};
prime.types.URI.__name__ = ["prime","types","URI"];
prime.types.URI.__interfaces__ = [prime.tools.generator.ICodeFormattable];
prime.types.URI.prototype = {
	toCode: function(code) {
		code.construct(this,[this.getString()]);
	}
	,cleanUp: function() {
	}
	,parse: function(str) {
		if(!str) return this;
		{
			this.port = -1;
			this.scheme = null;
			this.userinfo = this.host = this.path = this.query = this.fragment = this.string = null;
		}
		var pos = 0;
		var scheme_pos = str.indexOf(":");
		if(scheme_pos != -1) {
			var has2slashes = HxOverrides.cca(str,scheme_pos + 1) + HxOverrides.cca(str,scheme_pos + 2) == 94;
			var scheme_str = HxOverrides.substr(str,0,scheme_pos);
			var us = this.scheme = Reflect.field(prime.types.URIScheme,scheme_str);
			if(us == null) {
				if(has2slashes) {
					this.scheme = prime.types.URIScheme.Scheme(scheme_str);
					pos = scheme_pos + 3;
				} else {
				}
			} else {
				switch( (us)[1] ) {
				case 3:
					this.string = str;
					return this;
				default:
					pos = scheme_pos + 1;
					if(has2slashes) pos += 2;
				}
			}
		}
		var user_pos = str.indexOf("@",pos);
		if(user_pos != -1) {
			this.userinfo = HxOverrides.substr(str,pos,user_pos - pos);
			pos = user_pos + 1;
		}
		var port_pos = str.indexOf(":",pos);
		var path_pos = str.indexOf("/",pos);
		var query_pos = str.indexOf("?",path_pos == -1?pos:path_pos);
		var frag_pos = str.indexOf("#",query_pos == -1?pos:query_pos);
		if(port_pos > path_pos) port_pos = -1;
		if(port_pos != -1) {
			var port_end = path_pos;
			if(port_end == -1) {
				port_end = query_pos;
				if(port_end == -1) {
					port_end = frag_pos;
					if(port_end == -1) port_end = str.length;
				}
			}
			this.host = HxOverrides.substr(str,pos,port_pos - pos);
			this.port = Std.parseInt(HxOverrides.substr(str,port_pos + 1,port_end - port_pos));
			pos = port_end;
		} else if(this.scheme) {
			var host_end = path_pos;
			if(host_end == -1) {
				host_end = query_pos;
				if(host_end == -1) {
					host_end = frag_pos;
					if(host_end == -1) host_end = str.length;
				}
			}
			this.host = HxOverrides.substr(str,pos,host_end - pos);
			pos = host_end;
		}
		if(query_pos != -1) {
			var query_end = frag_pos;
			if(query_end == -1) query_end = str.length;
			this.path = HxOverrides.substr(str,pos,query_pos - pos);
			this.query = HxOverrides.substr(str,query_pos + 1,query_end - pos);
		} else if(frag_pos != -1) {
			this.path = HxOverrides.substr(str,pos,frag_pos - pos);
			this.fragment = HxOverrides.substr(str,frag_pos + 1,null);
		} else this.path = HxOverrides.substr(str,pos,null);
		if(this.path == "") this.path = null;
		this.string = str;
		return this;
	}
	,getString: function() {
		if(this.string) return this.string;
		if((this.scheme == null || this.host == null) && this.path == null) return null;
		var s = new StringBuf();
		if(this.scheme) {
			var $e = (this.scheme);
			switch( $e[1] ) {
			case 2:
				s.b += Std.string("mailto:");
				break;
			case 4:
				var x = $e[2];
				s.b += Std.string(x);
				s.b += Std.string("://");
				break;
			default:
				s.b += Std.string(Std.string(this.scheme));
				s.b += Std.string("://");
			}
		}
		if(this.userinfo) {
			s.b += Std.string(this.userinfo);
			s.b += String.fromCharCode(64);
		}
		if(this.host) s.b += Std.string(this.host);
		if(this.port != -1) {
			s.b += String.fromCharCode(58);
			s.b += Std.string(Std.string(this.port));
		}
		if(this.path) s.b += Std.string(this.path);
		if(this.query) {
			s.b += String.fromCharCode(63);
			s.b += Std.string(this.query);
		}
		if(this.fragment) {
			s.b += String.fromCharCode(35);
			s.b += Std.string(this.fragment);
		}
		return this.string = s.b;
	}
	,isEmpty: function() {
		return (this.scheme == null || this.host == null) && this.path == null;
	}
	,getIsSet: function() {
		return this.getString() && this.getString().length || this.host && this.host.length || this.path && this.path.length;
	}
	,__class__: prime.types.URI
}
prime.types.URIScheme = { __ename__ : ["prime","types","URIScheme"], __constructs__ : ["http","https","mailto","javascript","Scheme"] }
prime.types.URIScheme.http = ["http",0];
prime.types.URIScheme.http.toString = $estr;
prime.types.URIScheme.http.__enum__ = prime.types.URIScheme;
prime.types.URIScheme.https = ["https",1];
prime.types.URIScheme.https.toString = $estr;
prime.types.URIScheme.https.__enum__ = prime.types.URIScheme;
prime.types.URIScheme.mailto = ["mailto",2];
prime.types.URIScheme.mailto.toString = $estr;
prime.types.URIScheme.mailto.__enum__ = prime.types.URIScheme;
prime.types.URIScheme.javascript = ["javascript",3];
prime.types.URIScheme.javascript.toString = $estr;
prime.types.URIScheme.javascript.__enum__ = prime.types.URIScheme;
prime.types.URIScheme.Scheme = function(p) { var $x = ["Scheme",4,p]; $x.__enum__ = prime.types.URIScheme; $x.toString = $estr; return $x; }
if(!prime.utils) prime.utils = {}
prime.utils.DuplicateUtil = function() { }
prime.utils.DuplicateUtil.__name__ = ["prime","utils","DuplicateUtil"];
prime.utils.DuplicateUtil.duplicateItem = function(item) {
	return js.Boot.__instanceof(item,prime.core.traits.IDuplicatable)?item.duplicate():item;
}
prime.utils.ERegUtil = function() { }
prime.utils.ERegUtil.__name__ = ["prime","utils","ERegUtil"];
prime.utils.ERegUtil.matchAll = function(expr,str,f) {
	while(true) {
		if(!expr.match(str)) break;
		f(expr);
		str = expr.matchedRight();
	}
}
prime.utils.ERegUtil.removeAll = function(expr,str) {
	var buf = new StringBuf();
	try {
		while(true) {
			if(!expr.match(str)) break;
			buf.b += Std.string(expr.matchedLeft());
			str = expr.matchedRight();
		}
		buf.b += Std.string(str);
	} catch( e ) {
		null;
	}
	return buf.b;
}
prime.utils.ERegUtil.removeMatch = function(expr,str) {
	try {
		if(expr.match(str)) str = expr.matchedLeft() + expr.matchedRight();
	} catch( e ) {
		null;
	}
	return str;
}
prime.utils.FastArrayUtil = function() { }
prime.utils.FastArrayUtil.__name__ = ["prime","utils","FastArrayUtil"];
prime.utils.FastArrayUtil.indexOf = function(list,item,startPos) {
	if(startPos == null) startPos = 0;
	var pos = -1;
	var l = list.length;
	var _g = startPos;
	while(_g < l) {
		var i = _g++;
		if(list[i] == item) {
			pos = i;
			break;
		}
	}
	return pos;
}
prime.utils.FastArrayUtil.insertAt = function(list,item,pos) {
	var newPos = 0;
	var len = list.length | 0;
	if(pos < 0 || pos == len) newPos = list.push(item) - 1; else {
		if(pos > len) pos = len;
		var i = len;
		while(i > pos) {
			list[i] = list[i - 1];
			i--;
		}
		list[pos] = item;
		newPos = pos;
	}
	return newPos;
}
prime.utils.FastArrayUtil.validateNewIndex = function(list,pos) {
	return pos < 0 || pos > (list.length | 0)?list.length:pos;
}
prime.utils.FastArrayUtil.move = function(list,item,newPos,curPos) {
	if(curPos == null) curPos = -1;
	if(curPos == -1) curPos = prime.utils.FastArrayUtil.indexOf(list,item,null);
	var len = list.length | 0;
	if(newPos > len) newPos = len;
	if(curPos != newPos) {
		if(curPos > newPos) {
			var i = curPos;
			while(i > newPos) list[i] = list[--i];
			list[newPos] = item;
		} else {
			var _g = curPos;
			while(_g < newPos) {
				var i = _g++;
				list[i] = list[i + 1];
			}
			list[newPos] = item;
		}
	}
	return curPos != newPos;
}
prime.utils.FastArrayUtil.removeAt = function(list,pos) {
	if(pos == 0) list.shift(); else if(pos == list.length - 1) list.pop(); else if(pos > 0) list.splice(pos,1);
	return pos >= 0;
}
prime.utils.FastArrayUtil.removeAll = function(list) {
	list.length = 0;
	return list;
}
prime.utils.FastArrayUtil.duplicate = function(arr) {
	var n = [];
	var l = arr.length;
	var _g = 0;
	while(_g < l) {
		var i = _g++;
		n.push(prime.utils.DuplicateUtil.duplicateItem(arr[i]));
	}
	return n;
}
prime.utils.FileUtil = function() { }
prime.utils.FileUtil.__name__ = ["prime","utils","FileUtil"];
prime.utils.FileUtil.getExtension = function(fileName) {
	if(!fileName) return ""; else {
		var idx = fileName.lastIndexOf(".");
		var ext = idx <= 1?"":HxOverrides.substr(fileName,idx + 1,null).toLowerCase();
		return (ext == "jpg"?"jpeg":ext).toUpperCase();
	}
}
prime.utils.FileUtil.setExtension = function(fileName,ext) {
	var idx = fileName.lastIndexOf(".");
	fileName = idx <= 1?fileName + "." + ext:HxOverrides.substr(fileName,0,fileName.lastIndexOf(".")) + "." + ext;
	return fileName;
}
prime.utils.ID = function() { }
prime.utils.ID.__name__ = ["prime","utils","ID"];
prime.utils.MacroUtils = function() { }
prime.utils.MacroUtils.__name__ = ["prime","utils","MacroUtils"];
var $_;
function $bind(o,m) { var f = function(){ return f.method.apply(f.scope, arguments); }; f.scope = o; f.method = m; return f; };
if(Array.prototype.indexOf) HxOverrides.remove = function(a,o) {
	var i = a.indexOf(o);
	if(i == -1) return false;
	a.splice(i,1);
	return true;
}; else null;
Math.__name__ = ["Math"];
Math.NaN = Number.NaN;
Math.NEGATIVE_INFINITY = Number.NEGATIVE_INFINITY;
Math.POSITIVE_INFINITY = Number.POSITIVE_INFINITY;
Math.isFinite = function(i) {
	return isFinite(i);
};
Math.isNaN = function(i) {
	return isNaN(i);
};
String.prototype.__class__ = String;
String.__name__ = ["String"];
Array.prototype.__class__ = Array;
Array.__name__ = ["Array"];
Date.prototype.__class__ = Date;
Date.__name__ = ["Date"];
var Int = { __name__ : ["Int"]};
var Dynamic = { __name__ : ["Dynamic"]};
var Float = Number;
Float.__name__ = ["Float"];
var Bool = Boolean;
Bool.__ename__ = ["Bool"];
var Class = { __name__ : ["Class"]};
var Enum = { };
Xml.Element = "element";
Xml.PCData = "pcdata";
Xml.CData = "cdata";
Xml.Comment = "comment";
Xml.DocType = "doctype";
Xml.Prolog = "prolog";
Xml.Document = "document";
js.Node.__filename = __filename;
js.Node.__dirname = __dirname;
js.Node.setTimeout = setTimeout;
js.Node.clearTimeout = clearTimeout;
js.Node.setInterval = setInterval;
js.Node.clearInterval = clearInterval;
js.Node.global = global;
js.Node.process = process;
js.Node.require = require;
js.Node.console = console;
js.Node.module = module;
js.Node.stringify = JSON.stringify;
js.Node.parse = JSON.parse;
js.Node.util = js.Node.require("util");
js.Node.fs = js.Node.require("fs");
js.Node.net = js.Node.require("net");
js.Node.http = js.Node.require("http");
js.Node.https = js.Node.require("https");
js.Node.path = js.Node.require("path");
js.Node.url = js.Node.require("url");
js.Node.os = js.Node.require("os");
js.Node.crypto = js.Node.require("crypto");
js.Node.dns = js.Node.require("dns");
js.Node.queryString = js.Node.require("querystring");
js.Node.assert = js.Node.require("assert");
js.Node.childProcess = js.Node.require("child_process");
js.Node.vm = js.Node.require("vm");
js.Node.tls = js.Node.require("tls");
js.Node.dgram = js.Node.require("dgram");
js.Node.assert = js.Node.require("assert");
js.Node.repl = js.Node.require("repl");
js.Node.cluster = js.Node.require("cluster");
prime.signal.Wire.freeCount = 0;
prime.core.events.CommunicationSignals.__meta__ = { fields : { enable : { __auto : null}, disable : { __auto : null}, unbind : { __auto : null}, unbindAll : { __auto : null}, dispose : { __auto : null}}};
prime.core.events.LoaderSignals.__meta__ = { fields : { enable : { __auto : null}, disable : { __auto : null}, unbind : { __auto : null}, unbindAll : { __auto : null}, dispose : { __auto : null}}};
prime.tools.generator.output.HaxeOutputUtil.instances = 0;
prime.types.Factory.EMPTY_ARRAY = [];
prime.types.Number.FLOAT_NOT_SET = Math.NaN;
prime.utils.ID.next = 0;
prime.tools.CSSParserMain.main();
