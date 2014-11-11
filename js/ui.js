'use strict';
var UI = {};
UI.Unselect = '-o-user-select:none; -ms-user-select:none; -khtml-user-select:none; -webkit-user-select:none; -moz-user-select: none; pointer-events:none;';

//--------------------------- BUTTON

UI.Button = function(name, fun, pos, w){
	pos = pos || 10;
	w = w || 70;
	var b = document.createElement( 'div' );
	b.style.cssText = UI.Unselect + 'position:absolute; bottom:10px; left:'+pos+'px; width:'+w+'px; padding:6px; cursor:pointer; text-align:center; pointer-events:auto;';
	b.id = 'button';
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

//--------------------------- ANGULAR

UI.Angular = function(name, fun, v, pos){
	pos = pos || 10;
	var a = document.createElement( 'div' );
	a.style.cssText =  UI.Unselect+'position:absolute; top:'+pos+'px; right:10px; width:60px; height:50px;';//' background:#ff0000';
	a.id = 'angular';
	var t = document.createElement( 'div' );
    t.style.cssText = 'position:absolute; top:0px; left:0px; width:60px; height:20px; text-align:center; '+UI.Unselect;
    t.textContent = name + '°';
    a.appendChild(t);

    var t2 = document.createElement( 'input' );
    t2.style.cssText =  'position:absolute; top:20px; left:10px; width:40px; height:20px; text-align:center; pointer-events:auto;';
    //t2.contenteditable = 'true';
    t2.id = 'angularsel';
    
    t2.value = v;

    t2.onchange = function(){
    	this.blur();
    	fun(t2.value);
    }

    a.appendChild(t2);

	document.body.appendChild(a);
}


//--------------------------- CLOCK

UI.Clock = function(name, fun){
	var c = document.createElement( 'div' );
	c.style.cssText = 'position:absolute; bottom:10px; right:10px; width:60px; height:60px;'+UI.Unselect;
	c.id = 'clock';
	var s = document.createElement( 'div' );
	s.style.cssText = 'position:absolute; bottom:5px; right:30px; width:1px; height:25px; margin-bottom:25px; background:#F964A7; transform-origin:50% 100%; transform:rotate(20deg);'+UI.Unselect;
	var d0 = document.createElement( 'div' );
    d0.style.cssText = 'position:absolute; bottom:2px; right:30px; width:1px; height:4px;'+UI.Unselect;
	d0.id = 'deco';
	var d1 = document.createElement( 'div' );
    d1.style.cssText = 'position:absolute; top:2px; right:30px; width:1px; height:4px;'+UI.Unselect;
	d1.id = 'deco';
	var d2 = document.createElement( 'div' );
    d2.style.cssText = 'position:absolute; bottom:30px; right:2px; width:4px; height:1px;'+UI.Unselect;
	d2.id = 'deco';
	var d3 = document.createElement( 'div' );
    d3.style.cssText = 'position:absolute; bottom:30px; left:2px; width:4px; height:1px;'+UI.Unselect;
    d3.id = 'deco';

    var t = document.createElement( 'div' );
    t.id = 'clock';
    t.style.cssText = 'position:absolute; bottom:70px; right:10px; width:60px; height:20px; text-align:center; border:none;'+UI.Unselect;
    
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