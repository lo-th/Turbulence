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

//--------------------------- IK

UI.IK = function(name, fun, v, pos){
    pos = pos || 10;
    var i = document.createElement( 'div' );
    i.style.cssText =  UI.Unselect+'position:absolute; top:'+pos+'px; right:10px; width:60px; height:50px;';//' background:#ff0000';
    i.id = 'ik';
    var t = document.createElement( 'div' );
    t.style.cssText = 'position:absolute; top:0px; left:0px; width:60px; height:20px; text-align:center; '+UI.Unselect;
    t.textContent = name;
    i.appendChild(t);

    var t2 = document.createElement( 'input' );
    t2.style.cssText =  'position:absolute; top:40px; left:10px; width:40px; height:20px; text-align:center; pointer-events:auto;';
    //t2.contenteditable = 'true';
    t2.id = 'iksel';
    
    t2.value = v;

    t2.onchange = function(){
    	this.blur();
    	fun(t2.value);
    }

    i.appendChild(t2);

    document.body.appendChild(i);
}

//--------------------------- ITERATIONS

UI.Iterations = function(name, fun, v, pos){
    pos = pos || 10;
    var r = document.createElement( 'div' );
    r.style.cssText =  UI.Unselect+'position:absolute; top:'+pos+'px; right:10px; width:60px; height:50px;';//' background:#ff0000';
    r.id = 'iterations';
    var t = document.createElement( 'div' );
    t.style.cssText = 'position:absolute; top:0px; left:0px; width:60px; height:20px; text-align:center; '+UI.Unselect;
    t.textContent = name;
    r.appendChild(t);

    var t2 = document.createElement( 'input' );
    t2.style.cssText =  'position:absolute; top:40px; left:10px; width:40px; height:20px; text-align:center; pointer-events:auto;';
    //t2.contenteditable = 'true';
    t2.id = 'iterationssel';
    
    t2.value = v;

    t2.onchange = function(){
    	this.blur();
    	fun(t2.value);
    }

    r.appendChild(t2);

    document.body.appendChild(r);
}

//--------------------------- LENGTH

UI.Length = function(name, fun, v, pos){
    pos = pos || 10;
    var l = document.createElement( 'div' );
    l.style.cssText =  UI.Unselect+'position:absolute; top:'+pos+'px; right:10px; width:60px; height:50px;';//' background:#ff0000';
    l.id = 'length';
    var t = document.createElement( 'div' );
    t.style.cssText = 'position:absolute; top:0px; left:0px; width:60px; height:20px; text-align:center; '+UI.Unselect;
    t.textContent = name;
    l.appendChild(t);

    var t2 = document.createElement( 'input' );
    t2.style.cssText =  'position:absolute; top:40px; left:10px; width:40px; height:20px; text-align:center; pointer-events:auto;';
    //t2.contenteditable = 'true';
    t2.id = 'lengthsel';
    
    t2.value = v;

    t2.onchange = function(){
    	this.blur();
    	fun(t2.value);
    }

    l.appendChild(t2);

    document.body.appendChild(l);
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

//--------------------------- SLIDE

UI.Slide = function(target, name, endFunction, value, set , max, min, type, num){
	this.colors = ['rgba(220,220,220,1)', 'rgba(0,0,0,0.2)', 'rgba(0,0,0,0.6)', 'rgba(200,200,200,0.6)', 'rgba(200,200,200,1)'];
	this.radius = "-moz-border-radius: 16px; -webkit-border-radius: 16px; border-radius: 16px;";
	this.num = num || 0;
	this.min = min || 0;
	this.max = max || 100;
	this.name = name || "slider";
	this.type = type || '%';
	this.valueRange = this.max - this.min;
	this.set = set || [20,100,180,20];
	this.endFunction = endFunction || null; 
	this.w = this.set[2]-10;
	this.value = value || 0;
	this.add(target);
};

UI.Slide.prototype = {
    constructor: UI.Slide,
	add:function(target, name){
	    var _this = this;
	    var txt = document.createElement( 'div' );
	    var bg = document.createElement( 'div' );
	    var sel = document.createElement( 'div' );
	    bg.style.cssText = this.radius+'position:absolute; left:'+this.set[0]+'px; top:'+this.set[1]+'px; padding:0; cursor:w-resize; pointer-events:auto; width:'+this.set[2]+'px; height:'+this.set[3]+'px; background-color:'+ this.colors[1]+';';
	    txt.style.cssText ='position:absolute; left:0px; top:-18px; pointer-events:none; width:'+this.set[2]+'px; height:20px; font-size:12px; color:'+this.colors[0]+'; text-align:center;';
	    sel.style.cssText = this.radius+'position:absolute; pointer-events:none; margin:5px; width:100px; height:10px; background-color:'+this.colors[3]+';';
	    
	    bg.appendChild( sel );
	    bg.appendChild( txt );
	    bg.name = this.name;
	    bg.id = this.name;

	    target.appendChild( bg );
	    bg.className = "up";
	    bg.addEventListener( 'mouseout',  function(e){ e.preventDefault(); this.className = "up"; this.style.backgroundColor = _this.colors[1]; this.childNodes[0].style.backgroundColor = _this.colors[3]; }, false );
	    bg.addEventListener( 'mouseover', function(e){ e.preventDefault(); this.style.backgroundColor = _this.colors[2]; this.childNodes[0].style.backgroundColor = _this.colors[4];}, false );
	    bg.addEventListener( 'mouseup',   function(e){ e.preventDefault(); this.className = "up"; }, false );
	    bg.addEventListener( 'mousedown', function(e){ e.preventDefault(); this.className = "down"; _this.drag(this, e.clientX); }, false );
	    bg.addEventListener( 'mousemove', function(e){ e.preventDefault(); _this.drag(this, e.clientX); } , false );

	    this.sel = sel;
	    this.txt = txt;
	    this.updatePosition();
	},

	updatePosition:function(){
	    this.sel.style.width = (this.w * ((this.value-this.min)/this.valueRange))+'px';
	    this.txt.innerHTML = this.name+" "+this.value+this.type;
	},

	drag:function(t, x){
	    if(t.className == "down"){
	        var rect = t.getBoundingClientRect();
	        this.value = ((((x-rect.left)/this.w)*this.valueRange+this.min).toFixed(this.num))/1;
	        if(this.value<this.min) this.value = this.min;
	        if(this.value>this.max) this.value = this.max;
	        this.updatePosition();
	        if(this.endFunction!==null)this.endFunction(this.value);
	    }
	}
};
