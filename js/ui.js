'use strict';
var UI = {};
UI.Button = function(name, fun){
	var b = document.createElement( 'div' );
	var unselect = '-o-user-select:none; -ms-user-select:none; -khtml-user-select:none; -webkit-user-select:none; -moz-user-select: none;';
	b.style.cssText = 'position:absolute; bottom:10px; left:10px; width:70px; padding:6px; cursor:pointer; text-align:center;'+unselect;
	b.id = 'button'
	b.textContent = name;
	b.onclick = fun;
	document.body.appendChild(b);
	this.b = b;
}
UI.Button.prototype = {
    constructor: UI.Button,
    text:function(t){
    	this.b.textContent = t;
    }
}

//---------------------------

UI.Clock = function(name, fun){
	var c = document.createElement( 'div' );
	var unselect = '-o-user-select:none; -ms-user-select:none; -khtml-user-select:none; -webkit-user-select:none; -moz-user-select: none; pointer-events:none;';
	c.style.cssText = 'position:absolute; bottom:10px; right:10px; width:60px; height:60px;'+unselect;
	c.id = 'clock';
	var s = document.createElement( 'div' );
	s.style.cssText = 'position:absolute; bottom:5px; right:30px; width:1px; height:25px; margin-bottom:25px; background:#F964A7; transform-origin:50% 100%; transform:rotate(20deg);'+unselect;
	var d0 = document.createElement( 'div' );
    d0.style.cssText = 'position:absolute; bottom:2px; right:30px; width:1px; height:4px;'+unselect;
	d0.id = 'deco';
	var d1 = document.createElement( 'div' );
    d1.style.cssText = 'position:absolute; top:2px; right:30px; width:1px; height:4px;'+unselect;
	d1.id = 'deco';
	var d2 = document.createElement( 'div' );
    d2.style.cssText = 'position:absolute; bottom:30px; right:2px; width:4px; height:1px;'+unselect;
	d2.id = 'deco';
	var d3 = document.createElement( 'div' );
    d3.style.cssText = 'position:absolute; bottom:30px; left:2px; width:4px; height:1px;'+unselect;
    d3.id = 'deco';

    var t = document.createElement( 'div' );
    t.id = 'clock';
    t.style.cssText = 'position:absolute; bottom:70px; right:10px; width:60px; height:20px; text-align:center; border:none;'+unselect;
    

	
	c.appendChild(d0);
	c.appendChild(d1);
	c.appendChild(d2);
	c.appendChild(d3);
    c.appendChild(s);
	document.body.appendChild(c);
	document.body.appendChild(t);
	this.c = c;
	this.s = s;
	this.t = t;
}
UI.Clock.prototype = {
    constructor: UI.Clock,
    set:function(r){
    	this.s.style.transform = "rotate("+r+"deg)";
    	this.t.textContent = r+'°';
    },
    text:function(t){
    	//this.b.textContent = t;
    }
}