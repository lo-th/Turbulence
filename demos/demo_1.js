tell('basic formula class');

var v3d = new V3D.View();
var v = v3d;
// add basic grid
v.addGrid(200, 20);

var fs = [];
renderLoop();

// basic class 
var formula = function(pz, r, label){
    label = label || false;
    this.mul = 10;
    this.pz = pz || 0;
    // init formula class
    this.f = new Turbulence.Formula();
    // the start rotation
    this.f.rotation = r || 0;
    this.labels = [];
    this.o = new V3D.Particle(v);
    // add each formula point to 3d view
    for(var i = 0; i<this.f.pNames.length; i++){
        this.o.addV(0,0,0);
        if(label){ 
            this.labels[i] = v.addLabel(this.f.pNames[i]);
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
            this.o.geometry.vertices[i].x = p.x*this.mul;
            this.o.geometry.vertices[i].y = p.y*this.mul;
            this.o.geometry.vertices[i].z = this.pz;
            if(this.labels.length>0){
                this.labels[i].position.set(p.x*this.mul, p.y*this.mul, this.pz)
            }
        }
        this.o.geometry.verticesNeedUpdate = true;
    }
}

// add 200 formule test
for(var i = 0; i<200; i++){
    if(i==0)fs[i] = new formula(30-(i*10), i*0.104, true);
    else fs[i] = new formula(30-(i*10), i*0.05);
}

function renderLoop(){
    for(var i = 0; i<fs.length; i++){
        fs[i].run();
    }
    v.render();
    requestAnimationFrame( renderLoop );
}