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
	var unselect = '-o-user-select:none; -ms-user-select:none; -khtml-user-select:none; -webkit-user-select:none; -moz-user-select: none;';
	c.style.cssText = 'position:absolute; bottom:10px; right:10px; width:60px; height:60px;'+unselect;
	c.id = 'clock';
	var s = document.createElement( 'div' );
	s.style.cssText = 'position:absolute; bottom:5px; right:30px; width:1px; height:25px; margin-bottom:25px; background:#F964A7; transform-origin:50% 100%; transform:rotate(20deg);'+unselect;
	
    c.appendChild(s);
	//b.textContent = name;
	//b.onclick = fun;
	document.body.appendChild(c);
	this.c = c;
	this.s = s;
	this.t = 0;

	//this.play();
	//var _this = this
	//setInterval(this.play, 1000/60, _this);
}
UI.Clock.prototype = {
    constructor: UI.Clock,
    set:function(r){
    	this.t = r;
    	this.s.style.transform = "rotate("+this.t+"deg)";
    },
    text:function(t){
    	//this.b.textContent = t;
    }
}