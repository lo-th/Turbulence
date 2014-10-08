tell('physics spider');

var v3d = new V3D.View(90,90,200);
var v = v3d;
// add basic grid
v.addGrid(120, 20);

// create oimo world contains all rigidBodys and joint.
var world = new OIMO.World();
world.gravity = new OIMO.Vec3(0, -9.8, 0);

//add static ground
var ground  = new OIMO.Body({size:[400, 40, 390], pos:[0,-20,0], world:world});

var fs = [];
renderLoop();

// i create the main object
var obj = {type:'sphere', size:[10, 10, 10], pos:[0,0,0], move:true, world:world}
var spider = v.add(obj);//new THREE.Object3D();
v.scene.add(spider);
var meshs = [];


// basic class 
var formula = function(pz, r, label){
    this.mesh = new THREE.Object3D();
    spider.add(this.mesh);
    label = label || false;
    this.mul = 1//10;
    this.pz = pz || 0;
    // init formula class
    this.f = new Turbulence.Formula();
    // the start rotation
    this.f.rotation = r || 0;
    this.labels = [];
    this.o = new V3D.Particle(this.mesh, this.f.pNames.length);
    // add each formula point to 3d view
    for(var i = 0; i<this.f.pNames.length; i++){
        //this.o.addV(0,0,0);
        if(label){ 
            this.labels[i] = v.addLabel(this.f.pNames[i], 5);
            v.scene.add(this.labels[i]);
        }
    }
}

formula.prototype = {
    run:function(){
        this.f.rotation += 0.03;
        this.f.run();
        var p;
        for(var i = 0; i<this.f.pNames.length; i++){
            p = this.f.points[this.f.pNames[i]];
            this.o.move(i, p.x*this.mul, p.y*this.mul, this.pz);
            if(this.labels.length>0){
                this.labels[i].position.set(p.x*this.mul, p.y*this.mul, this.pz)
            }
        }
        this.o.update();
    },
    getEndPoint:function(){
        var m = this.mesh.matrixWorld.clone();
        var m2 = new THREE.Matrix4();
        m2.makeTranslation(this.f.points.y4.x,this.f.points.y4.y,0); 
        m.multiply( m2 );
        var p = new THREE.Vector3().setFromMatrixPosition( m );
        return p;
    }
}

// add 200 formule test
for(var i = 0; i<8; i++){
    if(i==0 || i==2 || i==4 || i==6)fs[i] = new formula(0, Math.PI);
    else fs[i] = new formula(0, 0);
    fs[i].mesh.rotation.set(0,(45*i)*V3D.ToRad,75*V3D.ToRad);

    var obj = {type:'sphere', size:[6, 6, 6], pos:[0,0,0], move:true, world:world}
    meshs[i] = v.add(obj);
}

function renderLoop(){
    for(var i = 0; i<fs.length; i++){
        fs[i].run();
        meshs[i].position.copy(fs[i].getEndPoint())
    }
    v.render();
    requestAnimationFrame( renderLoop );
}