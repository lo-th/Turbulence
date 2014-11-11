tell('The serpent');

var fs = [];
var geos = {};
var v3d = new V3D.View(110,60,500);
var v = v3d;

// add basic grid
v.addGrid(400, 20, [0,0,0], [0,0,0]);

// ui add clock
var c = new UI.Clock();
var snakeType = 0;
var tween;
var snake = {u:0};
var b1 = new UI.Button('normal', setType);

renderLoop();

function renderLoop(){
    TWEEN.update();
    for(var i = 0; i<fs.length; i++){
        if(i==0) c.set(v.unDegrees(fs[i].f.rotation));
        fs[i].run();
    }
    v.render();
    requestAnimationFrame( renderLoop );
}

function setType(){
    if(snakeType == 0) snakeType = 1;
    else snakeType = 0;
    if(snakeType == 1 ){
        b1.text('rat');
        tween = new TWEEN.Tween( snake )
            .to( {u:1}, 200 )
            .easing( TWEEN.Easing.Linear.None )
            .onUpdate( function () { for(var i = 0; i<48; i++){fs[i].setMorph(snake.u);}  } )
            .start();
    }else{
        b1.text('normal');
        tween = new TWEEN.Tween( snake )
            .to( {u:0}, 200 )
            .easing( TWEEN.Easing.Linear.None )
            .onUpdate( function () { for(var i = 0; i<48; i++){fs[i].setMorph(snake.u);}  } )
            .start();
    }
}

// import image

var objName = "basic_op"; // version optimiser
var headShader, centerShader, centerMorphShader;
var pool = new SEA3D.Pool();
pool.loadImages(['../images/serpent.jpg','../images/center.jpg'], initImages);

function initImages(){
    headShader = new V3D.SphericalShader({ env:v.img, mapLight:pool.getTexture('serpent', true) });
    centerShader = new V3D.SphericalShader({ env:v.img, mapLight:pool.getTexture('center', true) });
    centerMorphShader = new V3D.SphericalShader({ env:v.img, mapLight:pool.getTexture('center', true), morphTargets:true });
    pool.load( ['../models/'+objName+'.sea', '../models/serpent.sea'], initObject, 'buffer' );
}
//
// import sea3D object pack
function initObject(){

    geos['p0'] = pool.geo(objName+'_point0');
    geos['p1'] = pool.geo(objName+'_point1');
    geos['p2'] = pool.geo(objName+'_point2');
    geos['p3'] = pool.geo(objName+'_point3');
    geos['p4'] = pool.geo(objName+'_point4');
    geos['p5'] = pool.geo(objName+'_point5');
    geos['p6'] = pool.geo(objName+'_point6');
    geos['p7'] = pool.geo(objName+'_point7');
    geos['p8'] = pool.geo(objName+'_point8');
    geos['j0'] = pool.geo(objName+'_joint');
    geos['j1'] = pool.geo(objName+'_joint_1');

    //----- serpent

    geos['c1'] = pool.getMesh('serpent_center_high').geometry;
    geos['c2'] = pool.getMesh('serpent_center_low').geometry;
    geos['h1'] = pool.getMesh('serpent_high_norm').geometry;
    geos['h2'] = pool.getMesh('serpent_low_norm').geometry;
    geos['head'] = pool.geo('serpent_head');
    geos['end'] = pool.getMesh('serpent_end').geometry;
    //geos['tongue'] = pool.geo('serpent_tongue');

    //----

    // add 48 formule
    for(var i = 0; i<48; i++){
        fs[i] = new formula(240-(i*20), i*(10*V3D.ToRad), true, false, i);
    }

}

// -------------------------------------------------

// basic class 
var formula = function(pz, r, link, label, num){

    label = label || false;
    this.mul = 10;
    this.scalar = 0.2;
    this.pz = pz || 0;

    this.mesh = new THREE.Group();
    v.scene.add(this.mesh);
    this.mesh.rotation.z = 125*V3D.ToRad;
    this.mesh.position.y = 100;
    this.mesh.position.z = pz;
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
    this.snakeLink = [];
    this.head = null;
    this.morphs = [];

    // extra scale snake
    var ex = (num/100);
    if (num==0) ex = (num/100)+0.25;
    if (num==1) ex = (num/100)+0.20;
    if (num==2) ex = (num/100)+0.15;
    if (num==3) ex = (num/100)+0.10;
    if (num==4) ex = (num/100)+0.05;

    // add each formula point to 3d view
    var name;
    for(var i = 0; i<this.nLength; i++){

        name = this.f.pNames[i];

        // decal Z
        this.pointsDecal[i] = 0;
        this.linksDecal[i] = 0;
        if(name == 'b1'|| name == 'o4')this.pointsDecal[i] = -14*this.scalar;
        if(name == 'y5'|| name == 'o3')this.pointsDecal[i] = -7*this.scalar;
        if(name == 'b4'){  this.linksDecal[i] =(-14*this.scalar); }
        if(name == 'y3'|| name == 'o1' || name == 'y1') this.linksDecal[i] =(-7*this.scalar);
        if(name == 'b3' ) this.linksDecal[i] =(-14*this.scalar);
        if(name == 'a1') this.linksDecal[i] =(-21*this.scalar);
        if(name == 'a2') this.linksDecal[i] =(-28*this.scalar);
        if(name != 'y4' && name != 'o4' && name != 'y5')this.points[i] = this.createPoint(name);
        
        if(link){ 
        	if(name == 'y4'){
                this.links[i] = this.createLink(name, this.f.sizer[i], (this.f.sizer[i]/5)-(ex-0.2));
            }
            else if(name!='y5' && name!='o4') this.links[i] = this.createLink(name, this.f.sizer[i]);
            else this.links[i]=0
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

    var n = 0;
    if(num==0) n=1;
    else if(num == 47) n=2;

    //this.snakeLink[0] = this.createSnakeLink('high_rat', n);
    //this.snakeLink[1] = this.createSnakeLink('low_rat', n);

    this.snakeLink[0] = this.createSnakeLink('high_norm', n, 1-ex);
    this.snakeLink[1] = this.createSnakeLink('low_norm', n, 1-ex);
}

formula.prototype = {
    run:function(){
        this.f.rotation += 0.03;
        this.f.run();
        var p, name;
        for(var i = 0; i<this.nLength; i++){
        	name = this.f.pNames[i]
            p = this.f.points[name];//|| name!='o4' || name!='y5'
            if(name=='y4'){
                this.snakeLink[0].position.set(p.x*this.mul, p.y*this.mul,this.pointsDecal[i]);
                this.snakeLink[0].rotation.z = p.r-(Math.PI/2); 
                this.snakeLink[1].position.set(p.x*this.mul, p.y*this.mul,this.pointsDecal[i]);
                if(this.head!=null){
                    this.head.position.set(p.x*this.mul, p.y*this.mul,this.pointsDecal[i]);
                    this.head.rotation.z = -(p.r+(Math.PI/2))/2-(20*V3D.ToRad);
                }
            }else if(name=='y5'){
                this.snakeLink[1].rotation.z = p.r-(75*V3D.ToRad)
            }else if(name!='o4'){
                this.points[i].position.set(p.x*this.mul, p.y*this.mul,this.pointsDecal[i]);
                this.points[i].rotation.z = p.r;
            }
            if(this.links.length>0){
                if(name!='y5' && name!='o4'){
                    this.links[i].position.set(p.x*this.mul, p.y*this.mul,this.pointsDecal[i]+this.linksDecal[i]);
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
        else if(name=='o4' || name=='y5')m = new THREE.Mesh( geos['p6'], v.mats.c6 ); 
        else if(name=='y3') m = new THREE.Mesh( geos['p7'], v.mats.c6 );
        else if(name=='b3') m = new THREE.Mesh( geos['p8'], v.mats.c6 );
        else if(name=='y4') m = new THREE.Mesh( geos['p1'], v.mats.c6 );
        else if(name=='a2' ) m = new THREE.Mesh( geos['p4'], v.mats.c6 );
        else m = new THREE.Mesh( geos['p5'], v.mats.c6 );
        this.mesh.add(m);
        m.scale.x *= this.scalar;
        m.scale.y *= this.scalar;
        m.scale.z *= this.scalar;
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
        
        return m;
    },
    createSnakeLink:function(type, n, s){
        var t = 0;
        var m = new THREE.Group();
    	var m1, m2, m3, m4;
        if(type=='high_norm'){
            t = 1;
            m1 = new THREE.Mesh(geos['c1'], centerShader);
            m2 = new THREE.Mesh(geos['h1'], centerMorphShader);
        } else if(type=='low_norm'){
            t = 2;
            m1 = new THREE.Mesh(geos['c2'], centerShader);
            m2 = new THREE.Mesh(geos['h2'], centerMorphShader);
            
        }
        n = n || 0;
        if(n==1 && t==1){
            //m4 = new THREE.Mesh(geos['tongue'], v.mats.c1);
            m3 = new THREE.Mesh(geos['head'], headShader);
            m3.rotation.y = Math.PI;
            //m3.rotation.z = 25*V3D.ToRad;
            this.head = m3;
            //m3.add(m4);
            this.mesh.add(m3);
        }else if(n==2 && t==2){
            m3 = new THREE.Mesh(geos['end'], v.mats.c1);
            m3.rotation.y = Math.PI;
            m.add(m3);
        }
        m.add(m1);
        m1.add(m2);
        this.morphs.push(m2);
        this.mesh.add(m);
        m1.rotation.y = Math.PI;
        m.scale.set(s,s,-s);
    	return m;
    },
    setMorph:function(n){
        var i = this.morphs.length;
        while(i--){
            this.morphs[i].setWeight("rat", n);
        }
    }
}


