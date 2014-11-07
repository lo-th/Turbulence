tell('formula class');

var v3d = new V3D.View(90,90,200);
var v = v3d;
// add basic grid
v.addGrid(120, 20);


var l = new THREE.PlaneBufferGeometry(1,1);
l.applyMatrix(new THREE.Matrix4().makeTranslation(0.5,0,0));
var firstLinkMat = new THREE.MeshBasicMaterial({color:0x43B8CC});
var baseLinkMat = new THREE.MeshBasicMaterial({color:0x059BB5, transparent:true, opacity:0.5});
var extraLinkMat = new THREE.MeshBasicMaterial({color:0x059BB5, transparent:true, opacity:0.25});

// add clock
var c = new UI.Clock();

var fs = [];
renderLoop();

// basic class 
var formula = function(pz, r,link,label){
    this.mesh = new THREE.Group();
    v.scene.add(this.mesh);
    this.mesh.rotation.z = 90*V3D.ToRad;
    label = label || false;
    this.mul = 10;
    this.pz = pz || 0;
    // init formula class
    this.f = new Turbulence.Formula();
    // the start rotation
    this.f.rotation = r || 0;
    this.labels = [];
    this.links = [];
    this.o = new V3D.Particle(this.mesh, this.f.pNames.length);
    //console.log(this.f.pNames.length)
    // add each formula point to 3d view
    this.nLength = this.f.pNames.length;
    var name;
    for(var i = 0; i<this.nLength; i++){
    	name = this.f.pNames[i];
        if(link){ 
        	this.links[i] = this.createLink(name, this.f.sizer[i]);
        }
        if(label){ 
            this.labels[i] = v.addLabel(name, 5);
            this.mesh.add(this.labels[i]);
        }
    }
    // extra link
    if(link){
    	this.links.push(this.createLink('',this.f.sizer[this.nLength+0]));
    	this.links.push(this.createLink('',this.f.sizer[this.nLength+1]));
    	this.links.push(this.createLink('',this.f.sizer[this.nLength+2]));
    }



}

formula.prototype = {
    run:function(){
        this.f.rotation += 0.03;
        this.f.run();
        var p, name;
        for(var i = 0; i<this.nLength; i++){
        	name = this.f.pNames[i]
            p = this.f.points[name];
            this.o.move(i, p.x*this.mul, p.y*this.mul,this.pz)//, (p.z*this.mul)+this.pz);
            if(this.links.length>0){
                this.links[i].position.set(p.x*this.mul, p.y*this.mul,this.pz)//, (p.z*this.mul)+this.pz)
                this.links[i].rotation.z = p.r;
                if(name=='b2'){
                	this.links[this.nLength+0].position.set(p.x*this.mul, p.y*this.mul,this.pz);
                	this.links[this.nLength+0].rotation.z = this.f.exr[0];
                }
                if(name=='b3'){
                	this.links[this.nLength+1].position.set(p.x*this.mul, p.y*this.mul,this.pz);
                	this.links[this.nLength+1].rotation.z = this.f.exr[1];
                }
                if(name=='b4'){
                	this.links[this.nLength+2].position.set(p.x*this.mul, p.y*this.mul,this.pz);
                	this.links[this.nLength+2].rotation.z = this.f.exr[2];
                }
            }
            if(this.labels.length>0){
                this.labels[i].position.set(p.x*this.mul, p.y*this.mul,this.pz)// (p.z*this.mul)+this.pz)
            }
        }
        this.o.update();
    },
    createLink:function(name, s){
    	var m;
    	if(name=='y2' || name=='y3' || name=='y4') m = new THREE.Mesh(l, firstLinkMat);
    	else if (name=='') m = new THREE.Mesh(l, extraLinkMat);
    	else m = new THREE.Mesh(l, baseLinkMat);
    	this.mesh.add(m);
    	m.scale.x = s*this.mul;
    	return m;
    }
}

// add 200 formule test
for(var i = 0; i<48; i++){
    if(i==0)fs[i] = new formula(30-(i*10), i*0.104, true, true);
    else fs[i] = new formula(30-(i*10), i*(10*V3D.ToRad), true);
}

function renderLoop(){
    for(var i = 0; i<fs.length; i++){
        if(i==0) c.set(v.unDegrees(fs[i].f.rotation));
        fs[i].run();
    }
    v.render();
    requestAnimationFrame( renderLoop );
}