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