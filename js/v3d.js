
'use strict';
var THREE;
var V3D = {};
V3D.ToRad = Math.PI/180;
V3D.ToDeg = 180 / Math.PI;

V3D.View = function(h,v,d, revers){
	var n = navigator.userAgent;
	this.isMobile = false;
    if (n.match(/Android/i) || n.match(/webOS/i) || n.match(/iPhone/i) || n.match(/iPad/i) || n.match(/iPod/i) || n.match(/BlackBerry/i) || n.match(/Windows Phone/i)) this.isMobile = true;      

	this.w = window.innerWidth;
	this.h = window.innerHeight;
	this.id = 'container';

	this.debugColor = 0xB0B0B0;
	this.debugColor2 = 0x909090;
	this.debugColor3 = 0x404040;
	this.debugColor4 = 0x606060;
	this.grid = null;

	this.init(h,v,d, revers);
	this.initBasic();
	this.initMaterial();
	//this.initBackground();
}

V3D.View.prototype = {
    constructor: V3D.View,
    init:function(h,v,d, revers){
    	this.clock = new THREE.Clock();

    	this.renderer = new THREE.WebGLRenderer({precision: "mediump", antialias:true, stencil:false });
    	this.renderer.setSize( this.w, this.h );
    	this.renderer.autoClear = false;
    	//this.renderer.setClearColor( 0x1d1f20, 1 );
    	//this.renderer.gammaInput = true;
		//this.renderer.gammaOutput = true;
    	this.camera = new THREE.PerspectiveCamera( 60, this.w/this.h, 0.1, 4000 );
    	this.scene = new THREE.Scene();
    	
    	
        this.container = document.getElementById(this.id)
        this.container.appendChild( this.renderer.domElement );

        this.nav = new V3D.Navigation(this);
        this.nav.initCamera( h,v,d, revers );

       // this.miniMap = null;
       // this.player = null;

        //this.projector = new THREE.Projector();
    	//this.raycaster = new THREE.Raycaster();
    },
    render : function(){
    	this.renderer.render( this.scene, this.camera );
    },

    initBasic:function(){
    	var geos = {};
		geos['sph'] = new THREE.BufferGeometry();
		geos['box'] = new THREE.BufferGeometry();
		geos['cyl'] = new THREE.BufferGeometry();
	    geos['sph'].fromGeometry( new THREE.SphereGeometry(1,12,10)); 
	    geos['cyl'].fromGeometry( new THREE.CylinderGeometry(0.5,0.5,1,12,1));  
	    geos['box'].fromGeometry( new THREE.BoxGeometry(1,1,1));
	    geos['plane'] = new THREE.PlaneBufferGeometry(1,1);
	    geos['plane'].applyMatrix(new THREE.Matrix4().makeRotationX(-90*V3D.ToRad));

	    this.geos = geos;
    },
    initBasicMaterial:function(mats){
    	mats['bg'] = new THREE.MeshBasicMaterial( { side:THREE.BackSide, depthWrite: false, fog:false }  );
    	mats['debug'] = new THREE.MeshBasicMaterial( { color:this.debugColor, wireframe:true, transparent:true, opacity:0, fog:false, depthTest:false, depthWrite:false});
    	mats['joint']  = new THREE.LineBasicMaterial( { color:0x00ff00 } );
    	mats['point']  = new THREE.LineBasicMaterial( { color:0xF964A7 } );
    },
    initMaterial:function(){
    	//var img = THREE.ImageUtils.loadTexture( '../images/e_plastic_r.jpg' );
    	var img = THREE.ImageUtils.loadTexture( '../images/e_metal.jpg' );
	    var mats = {};
	    this.initBasicMaterial(mats);
	    mats['c0'] = new V3D.SphericalShader({env:img, color:0x00FF00});
	    mats['c1'] = new V3D.SphericalShader({env:img, color:0xF964A7});
	    mats['c2'] = new V3D.SphericalShader({env:img, color:0xFF0073});
	    mats['c3'] = new V3D.SphericalShader({env:img, color:0x43B8CC});
	    mats['c4'] = new V3D.SphericalShader({env:img, color:0x059BB5});
	    mats['c5'] = new V3D.SphericalShader({env:img, color:0xD4D1BE});
	    mats['c6'] = new V3D.SphericalShader({env:img, color:0xFFFFFF, map:this.doubleTexture()});
	    mats['c7'] = new V3D.SphericalShader({env:img, color:0xFFFFFF, map:this.doubleTexture('#07DAFF', '#059BB5')});

	    this.img = img;
	    this.mats = mats;
    },
    
    addLabel:function(text, size, color){
    	if(!color) color = "#F964A7";
		if(!size) size = 10;

		var canvas = document.createElement("canvas");

		//if(n==24)canvas.width = 116*3;
		canvas.width = 20*3;
		canvas.height = 20*3;
		var ctx = canvas.getContext("2d");
		ctx.font = 'normal 36pt Consolas';
		ctx.textAlign = "center";
		ctx.textBaseline = "middle";
		ctx.fillStyle = color;
		ctx.fillText(text,canvas.width*0.5, canvas.height*0.5);

		var texture = new THREE.Texture(canvas);
		texture.needsUpdate = true;

		var mat = new THREE.MeshBasicMaterial( { map:texture, transparent:true, depthWrite:false  } );
		var p = new THREE.Mesh(new THREE.PlaneBufferGeometry(size, size), mat);
		p.geometry.applyMatrix(new THREE.Matrix4().makeTranslation(0,size,Math.random()));
		return p;
    },
    addGrid:function(size, div, pos, rot){
    	size = size || 200;
    	div = div || 10;
    	pos = pos || [0,0,0];
    	rot = rot || [90,0,0]
    	var helper = new THREE.GridHelper( size, div );
		helper.setColors( this.debugColor2, this.debugColor );
		helper.position.set(pos[0],pos[1],pos[2]);
		helper.rotation.set(rot[0]* V3D.ToRad,rot[1]* V3D.ToRad,rot[2]* V3D.ToRad);
		//helper.rotation.x = 90 * V3D.ToRad;
		//helper.position.z = -7;
		this.scene.add( helper );
		this.grid = helper;
    },
    add:function(obj, target){
    	var type = obj.type || 'box';
    	var size = obj.size || [10,10,10];
    	var pos = obj.pos || [0,0,0];
    	var rot = obj.rot || [0,0,0];
    	var move = obj.move || false;
    	if(obj.flat){ type = 'plane'; pos[1]+=size[1]*0.5; }
    	
    	if(type.substring(0,5) === 'joint'){//_____________ Joint
    		var joint;
    		var pos1 = obj.pos1 || [0,0,0];
    		var pos2 = obj.pos2 || [0,0,0];
			var geo = new THREE.Geometry();
			geo.vertices.push( new THREE.Vector3( pos1[0], pos1[1], pos1[2] ) );
			geo.vertices.push( new THREE.Vector3( pos2[0], pos2[1], pos2[2] ) );
			joint = new THREE.Line( geo, this.mats.joint, THREE.LinePieces );
			if(target) target.add( mesh );
			else this.scene.add( joint );
			return joint;
    	} else {//_____________ Object
    		var mesh;
    		if(type=='box' && move) mesh = new THREE.Mesh( this.geos.box, this.mats.box );
	    	if(type=='box' && !move) mesh = new THREE.Mesh( this.geos.box, this.mats.static);
	    	if(type=='plane' && !move) mesh = new THREE.Mesh( this.geos.plane, this.mats.static2);
	    	if(type=='sphere' && move) mesh = new THREE.Mesh( this.geos.sph, this.mats.sph );
	    	if(type=='sphere' && !move) mesh = new THREE.Mesh( this.geos.sph, this.mats.static);
	    	if(type=='cylinder' && move) mesh = new THREE.Mesh( this.geos.cyl, this.mats.cyl );
	    	if(type=='cylinder' && !move) mesh = new THREE.Mesh( this.geos.cyl, this.mats.static);
	    	mesh.scale.set( size[0], size[1], size[2] );
	        mesh.position.set( pos[0], pos[1], pos[2] );
	        mesh.rotation.set( rot[0]*V3D.ToRad, rot[1]*V3D.ToRad, rot[2]*V3D.ToRad );
	        if(target)target.add( mesh );
	        else this.scene.add( mesh );
	        return mesh;
    	}
    	
    },
    moveLink:function(line, p1, p2){
    	line.geometry.vertices[0].copy( p1 );
        line.geometry.vertices[1].copy( p2 );
        line.geometry.verticesNeedUpdate = true;
    },
    initKeyboard:function(){
    	this.nav.bindKeys();
    },


    customShader:function(shader){
    	var material = new THREE.ShaderMaterial({
			uniforms: shader.uniforms,
			attributes: shader.attributes,
			vertexShader: shader.vs,
			fragmentShader: shader.fs
		});
		return material;
    },

    newgradTexture : function(c, n) {
    	if(this.back){
    	    this.scene.remove(this.back);
    	    this.back.material.dispose();
    	    this.back.geometry.dispose();
    	}

        var t = new THREE.Texture(c);
        //t.wrapS = t.wrapT = THREE.RepeatWrapping;
        //t.repeat = new THREE.Vector2( 2, 2);
        t.needsUpdate = true;
        var mat = new THREE.MeshBasicMaterial( {map:t, side:THREE.BackSide, depthWrite: false, fog:false }  );
        //var buffgeoBack = new THREE.BufferGeometry().fromGeometry( new THREE.IcosahedronGeometry(1000,1) );
        var buffgeoBack = new THREE.BufferGeometry().fromGeometry( new THREE.SphereGeometry(3000,12,10) );
        this.back = new THREE.Mesh( buffgeoBack, mat);
        //this.back.geometry.applyMatrix(new THREE.Matrix4().makeRotationZ(90*V3D.ToRad));
        this.scene.add( this.back );
        this.renderer.autoClear = false;

        if(this.grid){
        	if(n==0) this.grid.setColors(this.debugColor2, this.debugColor);
        	else this.grid.setColors(this.debugColor4, this.debugColor3);
        };
    },

    gradTexture : function(color) {
        var c = document.createElement("canvas");
        var ct = c.getContext("2d");
        c.width = 16; c.height = 128;
        var gradient = ct.createLinearGradient(0,0,0,128);
        var i = color[0].length;
        while(i--){ gradient.addColorStop(color[0][i],color[1][i]); }
        ct.fillStyle = gradient;
        ct.fillRect(0,0,16,128);
        var tx = new THREE.Texture(c);
        tx.needsUpdate = true;
        return tx;
    },
    doubleTexture : function(c1, c2){
    	c1 = c1 || '#F964A7';
    	c2 = c2 || '#059BB5';
    	
    	var canvas = document.createElement( 'canvas' );
        canvas.width = canvas.height = 128;
        var ctx = canvas.getContext( '2d' );
        ctx.fillStyle = c1;
        ctx.fillRect(0, 0, 128, 128);
        ctx.fillStyle = c2;
        ctx.fillRect(0, 0, 64, 128);
        var tx = new THREE.Texture(canvas);
        tx.wrapS = tx.wrapT = THREE.RepeatWrapping;
        tx.repeat = new THREE.Vector2(1,1);
        tx.needsUpdate = true;
        return tx;
    },
    basicTexture : function (n, r){
        var canvas = document.createElement( 'canvas' );
        canvas.width = canvas.height = 64;
        var ctx = canvas.getContext( '2d' );
        var color;
        if(n===0) color = "#58C3FF";// sphere
        if(n===1) color = "#3580AA";// sphere sleep
        if(n===2) color = "#FFAA58";// box
        if(n===3) color = "#AA8038";// box sleep
        if(n===4) color = "#1d1f20";// static
        if(n===5) color = "#58FFAA";// cyl
        if(n===6) color = "#38AA80";// cyl sleep
        ctx.fillStyle = color;
        ctx.fillRect(0, 0, 64, 64);
        ctx.fillStyle = "rgba(0,0,0,0.1);";//colors[1];
        ctx.fillRect(0, 0, 32, 32);
        ctx.fillRect(32, 32, 32, 32);
        var tx = new THREE.Texture(canvas);
        tx.wrapS = tx.wrapT = THREE.RepeatWrapping;
        tx.repeat = new THREE.Vector2( r || 1, r || 1);
        tx.needsUpdate = true;
        return tx;
    },
    unwrapDegrees : function (r) {
		r = r % 360;
		if (r > 180) r -= 360;
		if (r < -180) r += 360;
		return r;
	},
    unDegrees : function (r) {
    	r = (r*V3D.ToDeg).toFixed(0)*1;
		r = r % 360;
		if (r > 360) r -= 360;
		return r;
	}

}

//----------------------------------
//  NAVIGATION
//----------------------------------

V3D.Navigation = function(root){
	this.parent = root;
	this.camPos = { h:90, v:90, distance:400, automove:false, vmax:179.99, vmin:0.01  };
	this.mouse = { x:0, y:0, ox:0, oy:0, h:0, v:0, mx:0, my:0, down:false, over:false, moving:true, button:0 };
	this.vsize = { w:this.parent.w, h:this.parent.h};
	this.center = { x:0, y:0, z:0 };
	this.oldcenter = { x:0, y:0, z:0 };
	this.key = [0,0,0,0,0,0,0];
	this.rayTest = null;

	this.initEvents();
}
V3D.Navigation.prototype = {
    constructor: V3D.Navigation,
	initCamera : function (h,v,d, revers) {
	    this.camPos.h = h || 90;
	    this.camPos.v = v || 90;
	    this.camPos.distance = d || 400;
        this.isRevers = revers || false;
        if(this.isRevers) this.parent.camera.scale.x = -1;
	    this.moveCamera();
	},
	moveCamera : function () {
	    this.parent.camera.position.copy(this.Orbit(this.center, this.camPos.h, this.camPos.v, this.camPos.distance));
	    this.parent.camera.lookAt(this.center);
	},
	Orbit : function (origine, h, v, distance) {
	    origine = origine || new THREE.Vector3();
	    var p = new THREE.Vector3();
	    var phi = v*V3D.ToRad;
	    var theta = h*V3D.ToRad;
	    p.x = (distance * Math.sin(phi) * Math.cos(theta)) + origine.x;
	    p.z = (distance * Math.sin(phi) * Math.sin(theta)) + origine.z;
	    p.y = (distance * Math.cos(phi)) + origine.y;
	    return p;
	},
	unwrapDegrees:function(r){
		r = r % 360;
		if (r > 180) r -= 360;
		if (r < -180) r += 360;
		return r;
	},
	initEvents : function (){
		var _this = this;
		// disable context menu
        document.addEventListener("contextmenu", function(e){ e.preventDefault(); }, false);

	    this.parent.container.addEventListener( 'mousemove', function(e) {_this.onMouseMove(e)}, false );
	    this.parent.container.addEventListener( 'mousedown', function(e) {_this.onMouseDown(e)}, false );
	    this.parent.container.addEventListener( 'mouseout',  function(e) {_this.onMouseUp(e)}, false );
	    this.parent.container.addEventListener( 'mouseup', function(e) {_this.onMouseUp(e)}, false );

	    if (typeof window.ontouchstart !== 'undefined') {
		    this.parent.container.addEventListener( 'touchstart', function(e) {_this.onMouseDown(e)}, false );
		    this.parent.container.addEventListener( 'touchend', function(e) {_this.onMouseUp(e)}, false );
		    this.parent.container.addEventListener( 'touchmove', function(e) {_this.onMouseMove(e)}, false );
		}

	    this.parent.container.addEventListener( 'mousewheel', function(e) {_this.onMouseWheel(e)}, false );
	    this.parent.container.addEventListener( 'DOMMouseScroll', function(e) {_this.onMouseWheel(e)}, false );
	    window.addEventListener( 'resize', function(e) {_this.onWindowResize(e)}, false );
	},
	onMouseRay : function(x,y){
	    this.mouse.mx = ( this.mouse.x / this.vsize.w ) * 2 - 1;
	    this.mouse.my = - ( this.mouse.y / this.vsize.h ) * 2 + 1;
	    this.rayTest();
	},
	onMouseMove : function(e){
	    e.preventDefault();
	    var px, py;
	    if(e.touches){
	        this.mouse.x = e.clientX || e.touches[ 0 ].pageX;
	        this.mouse.y = e.clientY || e.touches[ 0 ].pageY;
	    } else {
	        this.mouse.x = e.clientX;
	        this.mouse.y = e.clientY;
	    }
	    if(this.rayTest !== null) this.onMouseRay();
	    if (this.mouse.down ) {
	        document.body.style.cursor = 'move';
	        if(this.mouse.button==0 || this.mouse.button==1){
		        if(this.isRevers) this.camPos.h = (-(this.mouse.x - this.mouse.ox) * 0.3) + this.mouse.h;
	            else this.camPos.h = ((this.mouse.x - this.mouse.ox) * 0.3) + this.mouse.h;
	            this.camPos.v = (-(this.mouse.y - this.mouse.oy) * 0.3) + this.mouse.v;
	            if(this.camPos.v<this.camPos.vmin) this.camPos.v = this.camPos.vmin;
	            if(this.camPos.v>this.camPos.vmax) this.camPos.v = this.camPos.vmax;
	        } else if(this.mouse.button==3){
	        	var r = -this.camPos.h * V3D.ToRad;
	        	var g = this.camPos.v * V3D.ToRad;
	        	var vx = (this.mouse.x - this.mouse.ox)/3;
	        	var vy = (this.mouse.y - this.mouse.oy)/3;
	        	this.center.x = this.oldcenter.x + (Math.sin(r) * vx + Math.cos(r) * vy);
	        	this.center.z = this.oldcenter.z + (Math.cos(r) * vx - Math.sin(r) * vy);
	        	//this.center.y = this.oldcenter.y + ( Math.cos(r) * vy);
	        }
            this.moveCamera();
	    }
	},
	onMouseDown : function(e){
	    e.preventDefault();
	    var px, py;
	    if(e.touches){
	        px = e.clientX || e.touches[ 0 ].pageX;
	        py = e.clientY || e.touches[ 0 ].pageY;
	    } else {
	        px = e.clientX;
	        py = e.clientY;
	        // 0: default  1: left  2: middle  3: right
	        this.mouse.button = e.which;
	    }
	    this.mouse.ox = px;
	    this.mouse.oy = py;
	    this.oldcenter.x = this.center.x;
	    this.oldcenter.y = this.center.y;
	    this.oldcenter.z = this.center.z;
	    this.mouse.h = this.camPos.h;
	    this.mouse.v = this.camPos.v;
	    this.mouse.down = true;
	    if(this.rayTest !== null) this.onMouseRay(px,py);
        clearFocus();
	},
	onMouseUp : function(e){
	    this.mouse.down = false;
	    document.body.style.cursor = 'auto';
	},
	onMouseWheel : function (e) {
	    var delta = 0;
	    if(e.wheelDeltaY){delta=e.wheelDeltaY*0.01;}
	    else if(e.wheelDelta){delta=e.wheelDelta*0.05;}
	    else if(e.detail){delta=-e.detail*1.0;}
	    this.camPos.distance-=(delta*10);
	    this.moveCamera();   
	},
	onWindowResize : function () {
	    this.vsize.w = window.innerWidth;
	    this.vsize.h = window.innerHeight;
	    this.parent.camera.aspect = this.vsize.w / this.vsize.h;
	    this.parent.camera.updateProjectionMatrix();
	    this.parent.renderer.setSize( this.vsize.w, this.vsize.h );
	},
	// ACTIVE KEYBOARD
	bindKeys:function(){
		var _this = this;
		document.onkeydown = function(e) {
		    e = e || window.event;
			switch ( e.keyCode ) {
			    case 38: case 87: case 90: _this.key[0] = 1; break; // up, W, Z
				case 40: case 83:          _this.key[1] = 1; break; // down, S
				case 37: case 65: case 81: _this.key[2] = 1; break; // left, A, Q
				case 39: case 68:          _this.key[3] = 1; break; // right, D
				case 17: case 67:          _this.key[4] = 1; break; // ctrl, C
				case 69:                   _this.key[5] = 1; break; // E
				case 32:                   _this.key[6] = 1; break; // space
				case 16:                   _this.key[7] = 1; break; // shift
			}
		}
		document.onkeyup = function(e) {
		    e = e || window.event;
			switch( e.keyCode ) {
				case 38: case 87: case 90: _this.key[0] = 0; break; // up, W, Z
				case 40: case 83:          _this.key[1] = 0; break; // down, S
				case 37: case 65: case 81: _this.key[2] = 0; break; // left, A, Q
				case 39: case 68:          _this.key[3] = 0; break; // right, D
				case 17: case 67:          _this.key[4] = 0; break; // ctrl, C
				case 69:                   _this.key[5] = 0; break; // E
				case 32:                   _this.key[6] = 0; break; // space
				case 16:                   _this.key[7] = 0; break; // shift
			}
		}
	    //self.focus();
	}
}

V3D.Particle = function(obj, n){
	this.geometry = new THREE.Geometry();
	this.material = new THREE.PointCloudMaterial( { size:4, sizeAttenuation: true, map:this.makeSprite(), transparent: true} )
	this.particles = new THREE.PointCloud( this.geometry, this.material );
	this.particles.sortParticles = true;
	n=n||0;
	for(var i=0; i<n; i++){
		this.addV();
	}
	obj.add( this.particles );
}
V3D.Particle.prototype = {
    constructor: V3D.Particle,
    makeSprite:function(){
    	var canvas = document.createElement('canvas');
    	canvas.width=canvas.height=32;

	    var context = canvas.getContext('2d');
	    var centerX = canvas.width / 2;
	    var centerY = canvas.height / 2;
	    var radius = 16;

	    var grd=context.createRadialGradient(centerX-6,centerY-3,1,centerX,centerY,radius);
	    grd.addColorStop(0,"#F9B0D1");
	    grd.addColorStop(1,"#F964A7");

	    context.beginPath();
	    context.arc(centerX, centerY, radius, 0, 2 * Math.PI, false);
	    context.fillStyle = grd;//'#F964A7';
	    context.fill();
	    /*context.lineWidth = 1;
	    context.strokeStyle = '#003300';
	    context.stroke();*/
	    var tx = new THREE.Texture(canvas);
        //tx.wrapS = tx.wrapT = THREE.RepeatWrapping;
        //tx.repeat = new THREE.Vector2( 1, 1);
        tx.needsUpdate = true;
        return tx;
    },
	addV : function (x,y,z) {
		//console.log(x,y,z)
		var v = new THREE.Vector3(x||0,y||0,z||0);
		//var l = this.particles.geometry.vertices.length;
		//var v = new THREE.vertices;
		this.particles.geometry.vertices.push( v );
		//this.particles.geometry.colors.push( 0x000000 );
		//this.particles.material = this.material ;
		//this.particles.geometry.dynamic = true;
		//this.particles.geometry.verticesNeedUpdate = true;
		//this.particles.geometry.elementsNeedUpdate = true;
		//this.particles.geometry.mergeVertices()
		//console.log(this.particles.geometry.vertices.length)
	},
	move : function(n, x, y, z){
		if(this.geometry.vertices[n]){
			this.geometry.vertices[n].x = x || 0;
			this.geometry.vertices[n].y = y || 0;
			this.geometry.vertices[n].z = z || 0;
		}
	},
	update : function(){
		this.geometry.verticesNeedUpdate = true;
	}
}

//----------------------------------
//  SHADER
//----------------------------------

V3D.SphericalShader =  function(o){
    o = o || {};
    var shader = V3D.Spherical;
    var uniforms = THREE.UniformsUtils.merge([
        shader.uniforms,
        THREE.UniformsLib[ "common" ],
        THREE.UniformsLib[ "fog" ]
    ]);
    var material = new THREE.ShaderMaterial({
        uniforms: uniforms,
        vertexShader: shader.vs,
        fragmentShader: shader.fs,
        shading: THREE.SmoothShading,

        skinning : o.skinning || false,
        morphTargets : o.morphTargets || false,
        transparent: o.transparent || false,
        depthTest: o.depthTest || true,
        depthWrite: o.depthWrite || true,
        side: o.side || THREE.FrontSide,//DoubleSide,
        fog: o.fog || false
    });

    if(o.mapLight){
        material.uniforms.mapLight.value = o.mapLight;
        material.uniforms.useLightMap.value = 1.0;
    }

    if(o.map){
        material.uniforms.map.value = o.map;
        material.uniforms.useMap.value = 1.0;
    }
    material.uniforms.env.value = o.env || null;
    material.uniforms.reflect.value = o.reflect || 1;
    material.uniforms.combine.value = o.combine || 0;
    material.uniforms.diffuse.value = new THREE.Color( o.color || 0xFFFFFF );
    material.uniforms.opacity.value = o.opacity || 1;
    return material;
}


V3D.Spherical = {
    attributes:{},
    uniforms:{ 
        env: {type: 't', value: null},
        //map: {type: 't', value: null},
        mapLight: {type: 't', value: null},
        color: {type: 'c', value: null},
        useMap: {type: 'f', value: 0},
        useLightMap: {type: 'f', value: 0},
        //opacity: {type: 'f', value: 0.3},
        useRim: {type: 'f', value: 0.3},
        rimPower: {type: 'f', value: 1.4},
        useExtraRim: {type: 'i', value: 0},

        reflect: {type: 'f', value: 1.0},
        //specularStrength: {type: 'f', value: 1.0},
        combine: {type: 'i', value: 0},
    },
    fs:[
        'uniform vec3 diffuse;',
        'uniform float opacity;',
        'uniform float useMap;',
        'uniform sampler2D mapLight;',
        'uniform float useLightMap;',
        'uniform float useRim;',
        'uniform float rimPower;',
        'uniform int useExtraRim;',
        'uniform sampler2D env;',
        'uniform sampler2D map;',

        'uniform float reflect;',
        //'uniform float specularStrength;',
        'uniform int combine;',
	
        //'uniform vec3 color;',
        'varying vec2 vN;',
        'varying vec2 vU;',
        //'varying vec2 vUv2;',
        //'varying vec3 vEye;',
        'varying vec3 vNormal;',

        'varying vec3 vPos;',
        //'varying float specularStrength;',


        //THREE.ShaderChunk[ "color_pars_fragment" ],
        //THREE.ShaderChunk[ "map_pars_fragment" ],
        //THREE.ShaderChunk[ "alphamap_pars_fragment" ],
        //THREE.ShaderChunk[ "lightmap_pars_fragment" ],
        //THREE.ShaderChunk[ "envmap_pars_fragment" ],
        THREE.ShaderChunk[ "fog_pars_fragment" ],
        //THREE.ShaderChunk[ "shadowmap_pars_fragment" ],
        //THREE.ShaderChunk[ "specularmap_pars_fragment" ],
        THREE.ShaderChunk[ "logdepthbuf_pars_fragment" ],


        'void main() {',
            'float specularStrength = 1.0;',
            'vec3 base = diffuse;',
            'float alpha = opacity;',

            'if(useMap == 1.){',
                'vec3 mapping = texture2D( map, vU ).rgb;',
                //'specularStrength = mapping.r;',
                "alpha *= texture2D( map, vU ).a;",
                'base *= mapping;',
            '}',

            'if( useRim > 0. ) {',
                'float f = rimPower * abs( dot( vNormal, vPos ) );',
                'f = useRim * ( 1. - smoothstep( 0.0, 1., f ) );',
                'base += vec3( f );',
            '}',
            'if( useExtraRim == 1 ) {',
                'float rim = max( 0., abs( dot( vNormal, vPos ) ) );',
                'float r = smoothstep( .25, .75, 1. - rim );',
                'r -= smoothstep( .5, 1., 1. - rim );',
                'vec3 c = vec3( 55. / 255., 55. / 255., 55. / 255. );',
                'base *= c;',
            '}',


            'gl_FragColor = vec4( base, alpha );',

            // environment
            'vec3 reflectMap = texture2D( env, vN ).rgb;',
            'vec4 reflectif = vec4( reflectMap, reflect );',
            'gl_FragColor.xyz = mix( gl_FragColor.xyz, gl_FragColor.xyz * reflectMap.xyz, reflect );',
            //'gl_FragColor = gl_FragColor * reflectif;',
            //'base *= texture2D( env, vN ).rgb;',

            //'if ( combine == 1 ) {',
			//	'gl_FragColor.xyz = mix( gl_FragColor.xyz, reflect.xyz, specularStrength * reflectivity );',
			//'} else if ( combine == 2 ) {',
			//	'gl_FragColor.xyz += reflect.xyz * specularStrength * reflectivity;',
			//'} else {',
			//	'gl_FragColor.xyz = mix( gl_FragColor.xyz, gl_FragColor.xyz * reflect.xyz, specularStrength * reflectivity );',
			//'}',
            
            //'gl_FragColor = vec4( base, alpha );',

            'if(useLightMap == 1.){',
	            'gl_FragColor = gl_FragColor * texture2D( mapLight, vU );',
            '}',



            THREE.ShaderChunk[ "logdepthbuf_fragment" ],
            //THREE.ShaderChunk[ "map_fragment" ],
            //THREE.ShaderChunk[ "alphamap_fragment" ],
            //THREE.ShaderChunk[ "alphatest_fragment" ],
            //THREE.ShaderChunk[ "specularmap_fragment" ],
            //THREE.ShaderChunk[ "lightmap_fragment" ],
            //THREE.ShaderChunk[ "color_fragment" ],
            //THREE.ShaderChunk[ "envmap_fragment" ],
            //THREE.ShaderChunk[ "shadowmap_fragment" ],

            THREE.ShaderChunk[ "linear_to_gamma_fragment" ],

            THREE.ShaderChunk[ "fog_fragment" ],
        '}'
    ].join("\n"),
    vs:[
        //THREE.ShaderChunk[ "map_pars_vertex" ],
        //THREE.ShaderChunk[ "lightmap_pars_vertex" ],
        //THREE.ShaderChunk[ "envmap_pars_vertex" ],
        //THREE.ShaderChunk[ "color_pars_vertex" ],
        THREE.ShaderChunk[ "morphtarget_pars_vertex" ],
        THREE.ShaderChunk[ "skinning_pars_vertex" ],
        //THREE.ShaderChunk[ "shadowmap_pars_vertex" ],
        THREE.ShaderChunk[ "logdepthbuf_pars_vertex" ],

        'varying vec2 vN;',
        'varying vec2 vU;',
        //'varying vec2 vUv2;',
        //'varying vec3 vEye;',
        'varying vec3 vNormal;',
        'varying vec3 vPos;',

        'void main() {',
            //THREE.ShaderChunk[ "map_vertex" ],
            //THREE.ShaderChunk[ "lightmap_vertex" ],
            //THREE.ShaderChunk[ "color_vertex" ],
            THREE.ShaderChunk[ "skinbase_vertex" ],

            //"#ifdef USE_ENVMAP",

            //THREE.ShaderChunk[ "morphnormal_vertex" ],
            //THREE.ShaderChunk[ "skinnormal_vertex" ],
            //THREE.ShaderChunk[ "defaultnormal_vertex" ],

            //"#endif",

            THREE.ShaderChunk[ "morphtarget_vertex" ],
            THREE.ShaderChunk[ "skinning_vertex" ],
            THREE.ShaderChunk[ "default_vertex" ],
            THREE.ShaderChunk[ "logdepthbuf_vertex" ],
           
            THREE.ShaderChunk[ "worldpos_vertex" ],
            //THREE.ShaderChunk[ "envmap_vertex" ],
            //THREE.ShaderChunk[ "shadowmap_vertex" ],

            //'vec3 e = normalize( vec3( modelViewMatrix * vec4( position, 1.0 ) ) );',
            'vPos = normalize( vec3( mvPosition ) );',
            'vNormal = normalize( normalMatrix * normal );',
            'vec3 r = reflect( vPos, vNormal );',
            'float m = 2. * sqrt( pow( r.x, 2. ) + pow( r.y, 2. ) + pow( r.z + 1., 2. ) );',
            'vN = r.xy / m + .5;',
            'vU = uv;',
            //'vUv2 = uv2;',
            //'vEye = ( modelViewMatrix * vec4( position, 1.0 ) ).xyz;',
            //'gl_Position = projectionMatrix * modelViewMatrix * vec4( position, 1. );',
            'gl_Position = projectionMatrix * mvPosition;',
        '}'
    ].join("\n")
};