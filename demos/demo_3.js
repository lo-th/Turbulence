tell('The beetles');

var v3d = new V3D.View(110,60,400);
var v = v3d;


// add basic grid
v.addGrid(200, 20, [0,-60,0], [0,0,0]);

var fs = [];
var geos = {};
var centerShader;

var beetles = [];
var wings = [];
var parts = [];
var bChassis = [];

var tweens = [];
var anims  = ['idle', 'idle'];

var b1set = { idle:1, walk:0, fly:0, w1:180, w2:0 };
var b2set = { idle:1, walk:0, fly:0, w1:180, w2:0 };

var b1 = new UI.Button('idle', switchAnim1, 110);
var b2 = new UI.Button('idle', switchAnim2);

renderLoop();

/* three.js render loop */
function renderLoop(){
    TWEEN.update();
    var delta = v3d.clock.getDelta();
    THREE.AnimationHandler.update( delta );
	if(b1set.fly==1){fs[0].run();fs[1].run();}
	if(b2set.fly==1){fs[2].run();fs[3].run();}
    v3d.render();
    requestAnimationFrame( renderLoop );
}

// import object pack
var pool = new SEA3D.Pool();
pool.loadImages(['../images/beetle_a.jpg', '../images/beetle_b.jpg', '../images/body.jpg', '../images/center.jpg'], loadObject);

function loadObject(){
	pool.load( ['../models/basic_op.sea','../models/beetle.sea'], initObject, 'auto' );
}

function initObject(){

	//----- formule

	centerShader = new V3D.SphericalShader({ env:v.img, mapLight:pool.getTexture('center', true) });

    geos['p0'] = pool.geo('basic_op_point0');
    geos['p1'] = pool.geo('basic_op_point1');
    geos['p2'] = pool.geo('basic_op_point2');
    geos['p3'] = pool.geo('basic_op_point3');
    geos['p4'] = pool.geo('basic_op_point4');
    geos['p5'] = pool.geo('basic_op_point5');
    geos['p6'] = pool.geo('basic_op_point6');
    geos['p7'] = pool.geo('basic_op_point7');
    geos['p8'] = pool.geo('basic_op_point8');
    geos['j0'] = pool.geo('basic_op_joint');
    geos['j1'] = pool.geo('basic_op_joint_1');
    geos['c1'] = pool.getMesh('basic_op_center_high').geometry;
    geos['c2'] = pool.getMesh('basic_op_center_low').geometry;

    //----- beetles

	var size = 0.25;

	// define shader
	var matC1 = new V3D.SphericalShader({env:v.img, map:pool.getTexture('beetle_b', true) });
	var matC2 = new V3D.SphericalShader({env:v.img, map:pool.getTexture('beetle_a', true) });
	var matBody1 = new V3D.SphericalShader({env:v.img, map:pool.getTexture('body', true), skinning:true });
	var matBody2 = new V3D.SphericalShader({env:v.img, map:pool.getTexture('body', true), skinning:true, morphTargets:true });
	var matBody3 = new V3D.SphericalShader({env:v.img, map:pool.getTexture('body', true) });
	var matEye = new V3D.SphericalShader({env:v.img, color:0x333333});
	var matPalm = new V3D.SphericalShader({env:v.img, color:0x606060});
	var matcc = new V3D.SphericalShader({env:v.img, color:0x059BB5});

	for(var i=0;i<2;i++){

		var beetle = new THREE.Group();
		var body = pool.getMesh('beetle_body').clone();
		var foot = pool.getMesh('beetle_foot').clone();
		foot.material = matBody2;
		body.material = matBody1;
		foot.position.set(0,0,0);
		body.position.set(0,0,0);

		foot.scale.set(size,size,-size);
		body.scale.set(size,size,-size);

		beetle.add(body);
		beetle.add(foot);

		foot.animations[0].play(0);
		foot.animations[1].play(0);
		foot.animations[2].play(0);
		foot.animations[0].weight = 1;
		foot.animations[1].weight = 0;
		foot.animations[2].weight = 0;
		foot.animations[2].loop = false;
		
		body.animations[0].play(0);
		body.animations[1].play(0);
		body.animations[2].play(0);
		body.animations[0].weight = 1;
		body.animations[1].weight = 0;
		body.animations[2].weight = 0;
		body.animations[2].loop = false;

		var head, eye, palm, pelvis, chassis, center;
		chassis = pool.getMesh('beetle_chassis').clone();
		chassis.material = matcc;

        center = new THREE.Group();
        center.scale.set(1,1,-1)

		v.scene.add(beetle);

		if(i==0){
		    beetle.position.set(100,0,0);
		    head = pool.getMesh('beetle_b_head').clone();
		    eye = pool.getMesh('beetle_b_eye').clone();
		    palm = pool.getMesh('beetle_b_palm').clone();

		    pelvis = pool.getMesh('beetle_b_pelvis').clone();

		    head.material = matC1;
			pelvis.children[0].material = matC1;
		    pelvis.children[1].material = matC1;
		    wings[i] = [pelvis.children[1], pelvis.children[0]];
		}
		else {
			beetle.position.set(-100,0,0);
			head = pool.getMesh('beetle_a_head').clone();
			eye = pool.getMesh('beetle_a_eye').clone();
		    palm = pool.getMesh('beetle_a_palm').clone();

		    pelvis = pool.getMesh('beetle_a_pelvis').clone();

			head.material = matC2;
			pelvis.children[0].material = matC2;
		    pelvis.children[1].material = matC2;

			foot.setWeight("big", 1);
			wings[i] = [pelvis.children[0], pelvis.children[1]];
		}

		eye.material = matEye;
		palm.material = matBody3;

		head.position.set(0,0,0);
		head.rotation.set(0,0,0);

		eye.position.set(0,0,0);
		eye.rotation.set(0,0,0);

		palm.position.set(0,0,0);
		palm.rotation.set(0,0,0);

		pelvis.position.set(0,0,0);
		pelvis.rotation.set(0,0,0);

		chassis.position.set(0,0,0);
		chassis.rotation.set(0,0,0);

		for(var j=0; j<body.skeleton.bones.length; j++){
		    	var bone = body.skeleton.bones[j]
				var name = bone.name;
				if(name =='BeetleHead2' ){ 
					bone.add(head);
					bone.add(eye);
					bone.add(palm);
				}
				if(name=='BeetlePelvis'){
                    bone.add(center);
					bone.add(pelvis);
					bone.add(chassis);
				}
			}
		beetles[i] = beetle;
		parts[i] = [body, foot];
		bChassis[i] = center;
	}

	for(var i = 0; i<4; i++){
        if(i<2)fs[i] = new formula(bChassis[0], 0, true, false, i);
        else fs[i] = new formula(bChassis[1], 0, true, false, i);
        //fs[i].showFormule(false);
    }
}

function switchAnim1(){
	if(anims[0] == 'idle'){
		b1.text('walk');
		anims[0] = 'walk';
		easing(0, b1set, { idle:0, walk:1, fly:0, w1:180, w2:0 })
	}else if(anims[0] == 'walk'){
		b1.text('fly');
		anims[0] = 'fly';
		easing(0, b1set, { idle:0, walk:0, fly:1, w1:290, w2:-110 })
	}else{
		b1.text('idle');
		anims[0] = 'idle';
		easing(0, b1set, { idle:1, walk:0, fly:0, w1:180, w2:0 })
	}
}

function switchAnim2(){
	if(anims[1] == 'idle'){
		b2.text('walk');
		anims[1] = 'walk';
		easing(1, b2set, { idle:0, walk:1, fly:0, w1:180, w2:0 })
	}else if(anims[1] == 'walk'){
		b2.text('fly');
		anims[1] = 'fly';
		easing(1, b2set, { idle:0, walk:0, fly:1, w1:290, w2:-110 })
	}else{
		b2.text('idle');
		anims[1] = 'idle';
		easing(1, b2set, { idle:1, walk:0, fly:0, w1:180, w2:0 })
	}
}

function easing (n, base, newW){
    tweens[n] = new TWEEN.Tween( base )
            .to( newW, 200 )
            .easing( TWEEN.Easing.Linear.None )
            .onUpdate( function () { weightAnim(n, base) } )
            .start();
}

function weightAnim (n, base){
	if(anims[n]=='fly'){
		parts[n][0].animations[2].timeScale = 1;
		parts[n][1].animations[2].timeScale = 1;
		parts[n][0].animations[2].play(0);
		parts[n][1].animations[2].play(0);
	} else if(anims[n]=='idle'){
		parts[n][0].animations[2].timeScale = -1;
		parts[n][1].animations[2].timeScale = -1;
		parts[n][0].animations[2].play( parts[n][0].animations[2].currentTime );
		parts[n][1].animations[2].play( parts[n][1].animations[2].currentTime );
	}

	parts[n][0].animations[0].weight = base.idle;
	parts[n][0].animations[1].weight = base.walk;
	parts[n][0].animations[2].weight = base.fly;

	parts[n][1].animations[0].weight = base.idle;
	parts[n][1].animations[1].weight = base.walk;
	parts[n][1].animations[2].weight = base.fly;

	wings[n][0].rotation.x = base.w1*V3D.ToRad;
	wings[n][1].rotation.x = base.w2*V3D.ToRad;
}

// -------------------------------------------------  formula class


var formula = function(target, r, link, label, num){
	this.revers = false;
	if(num==1 || num==3) this.revers = true;

    var ex = 0.3;
    label = label || false;
    this.mul = 10;
    this.scalar = 0.34;
    this.pz =  -200;
    //if(num>4)this.pz = -ex*20*100

    this.mesh = new THREE.Group();
    target.add(this.mesh);
    this.mesh.rotation.x = -90*V3D.ToRad;
    this.mesh.rotation.z = -78*V3D.ToRad;
	this.mesh.position.x = -63.3
    if(this.revers)this.mesh.position.y = -128;
    else this.mesh.position.y = 128;
	
    this.mesh.position.z = 205.6;
    this.mesh.scale.set(2.8,2.8,2.8);
    // init formula class
    this.f = new Turbulence.Formula();
    this.nLength = this.f.pNames.length;
    // the start rotation
    this.f.rotation = r || 0;
    this.labels = [];
    this.links = [];
    this.linksDecal = [];
    this.pointsDecal = [];
    this.points = [];
    this.centralLink = [];
    this.head = null;
    this.morphs = [];
    this.formuleMesh = [];

    

    // add each formula point to 3d view
    var name;
    for(var i = 0; i<this.nLength; i++){

        name = this.f.pNames[i];

        // decal Z
        this.pointsDecal[i] = 0;
        this.linksDecal[i] = 0;
        if(name == 'b1'|| name == 'o4') this.pointsDecal[i] = -14*this.scalar;
        if(name == 'y5'|| name == 'o3') this.pointsDecal[i] = -7*this.scalar;
        if(name == 'b4') this.linksDecal[i] =(-14*this.scalar);
        if(name == 'y3'|| name == 'o1' || name == 'y1') this.linksDecal[i] =(-7*this.scalar);
        if(name == 'b3') this.linksDecal[i] = -14*this.scalar;
        if(name == 'a1') this.linksDecal[i] = -21*this.scalar;
        if(name == 'a2') this.linksDecal[i] = -28*this.scalar;
		
        if(name != 'y4' && name != 'o4' && name != 'y5') this.points[i] = this.createPoint(name);
        
        if(link){ 
        	if(name == 'y4') this.links[i] = this.createLink(name, this.f.sizer[i], (this.f.sizer[i]/5)-(ex-0.2));
            else if(name!='y5' && name!='o4') this.links[i] = this.createLink(name, this.f.sizer[i]);
            else this.links[i]=0;
        }
        if(label){ 
            this.labels[i] = v.addLabel(name, 5);
            this.mesh.add(this.labels[i]);
        }
    }
    // extra link
    if(link){
    	this.links.push(this.createLink('',this.f.sizer[this.nLength+0]));
        this.linksDecal.push(-14*this.scalar);
    	this.links.push(this.createLink('',this.f.sizer[this.nLength+1]));
        this.linksDecal.push(7*this.scalar);
    	this.links.push(this.createLink('',(this.f.sizer[this.nLength+2]/3)+(ex+0.2)));
        this.linksDecal.push(0*this.scalar);
    }
	
	if(this.revers){
		var j = this.pointsDecal.length;
		while(j--)this.pointsDecal[j] = Math.abs(this.pointsDecal[j]);
		j = this.linksDecal.length;
		while(j--)this.linksDecal[j] = Math.abs(this.linksDecal[j]);
		this.linksDecal[this.nLength+1] = -7*this.scalar
	}

    var n = 0;

    this.centralLink[0] = this.createCentralLink('high_norm', n, 1-ex);
    this.centralLink[1] = this.createCentralLink('low_norm', n, 1-ex);

    this.run();
}

formula.prototype = {
    run:function(){
        this.f.rotation += 0.03;
        this.f.run();
        var p, name, decal, pdecal;
        for(var i = 0; i<this.nLength; i++){
        	name = this.f.pNames[i]
            p = this.f.points[name];
			pdecal = this.pointsDecal[i];
            if(name=='y4'){
                this.centralLink[0].position.set(p.x*this.mul, p.y*this.mul,pdecal);
                this.centralLink[0].rotation.z = p.r-(Math.PI/2); 
                this.centralLink[1].position.set(p.x*this.mul, p.y*this.mul,pdecal);
                if(this.head!=null){
                    this.head.position.set(p.x*this.mul, p.y*this.mul,pdecal);
                    this.head.rotation.z = -(p.r+(Math.PI/2))/2-(20*V3D.ToRad);
                }
            }else if(name=='y5'){
                this.centralLink[1].rotation.z = p.r-(75*V3D.ToRad)
            }else if(name!='o4'){
                this.points[i].position.set(p.x*this.mul, p.y*this.mul,pdecal);
                this.points[i].rotation.z = p.r;
            }
            if(this.links.length>0){
                if(name!='y5' && name!='o4'){
					decal = this.pointsDecal[i]+this.linksDecal[i];
                    this.links[i].position.set(p.x*this.mul, p.y*this.mul,decal);
                    this.links[i].rotation.z = p.r;
                }
                if(name=='b2'){
                	this.links[this.nLength+0].position.set(p.x*this.mul, p.y*this.mul,this.linksDecal[this.nLength+0]);
                	this.links[this.nLength+0].rotation.z = this.f.exr[0];
                }
                if(name=='b3'){
                	this.links[this.nLength+1].position.set(p.x*this.mul, p.y*this.mul,this.linksDecal[this.nLength+1]);
                	this.links[this.nLength+1].rotation.z = this.f.exr[1];
                }
                if(name=='b4'){
                	this.links[this.nLength+2].position.set(p.x*this.mul, p.y*this.mul,this.linksDecal[this.nLength+2]);
                	this.links[this.nLength+2].rotation.z = this.f.exr[2];
                }

            }
            if(this.labels.length>0){
                this.labels[i].position.set(p.x*this.mul, p.y*this.mul,this.pz);
            }
        }
        //this.o.update();
    },
    createPoint:function(name, s){
        var m;
        if(name=='a1') m = new THREE.Mesh( geos['p0'], v.mats.c6 );
        else if(name=='y1'|| name=='y2') m = new THREE.Mesh( geos['p2'], v.mats.c6 );
        else if(name=='o2'|| name=='b2'|| name=='b4') m = new THREE.Mesh( geos['p3'], v.mats.c6 );
        else if(name=='o4' || name=='y5') m = new THREE.Mesh( geos['p6'], v.mats.c6 ); 
        else if(name=='y3') m = new THREE.Mesh( geos['p7'], v.mats.c6 );
        else if(name=='b3') m = new THREE.Mesh( geos['p8'], v.mats.c6 );
        else if(name=='y4') m = new THREE.Mesh( geos['p1'], v.mats.c6 );
        else if(name=='a2' ) m = new THREE.Mesh( geos['p4'], v.mats.c6 );
        else m = new THREE.Mesh( geos['p5'], v.mats.c6 );
        m.scale.x *= this.scalar;
        m.scale.y *= this.scalar;
        m.scale.z *= this.scalar;
        this.mesh.add(m);
        this.formuleMesh.push(m);
		if(this.revers)m.rotation.y = Math.PI;
        return m;
    },
    createLink:function(name, s, decal){
        decal = decal || 0;
        
        var m, m1;
        if(name=='a2') m1 = new THREE.Mesh(geos['j1'], v.mats.c1);
        else if(name=='y2' || name=='y3' || name=='y4') m1 = new THREE.Mesh(geos['j0'], v.mats.c7);
        else m1 = new THREE.Mesh(geos['j1'], v.mats.c4);
        
        m1.scale.x = (s*this.mul)-(decal*this.mul);
        m1.scale.y *= this.scalar;
        m1.scale.z *= this.scalar;
        m1.translateX(decal*this.mul);

        if(decal!=0){
            m = new THREE.Group();
            m.add(m1);
        } else {
            m = m1;
        }
        this.mesh.add(m);
        this.formuleMesh.push(m);
        return m;
    },
    createCentralLink:function(type, n, s){
        var t = 0;
        var m = new THREE.Group();
    	var m1, m2, m3, m4;
        if(type=='high_norm'){
            m1 = new THREE.Mesh(geos['c1'], centerShader);
        } else if(type=='low_norm'){
            m1 = new THREE.Mesh(geos['c2'], centerShader);
        }

        m.add(m1);
        //m1.add(m2);
        //this.morphs.push(m2);
        this.mesh.add(m);
        m1.rotation.y = Math.PI;
        m.scale.set(s,s,-s);
    	return m;
    },
    showFormule:function(n){
        var i = this.formuleMesh.length;
        while(i--){
            this.formuleMesh[i].visible = n;
        }
    }

}