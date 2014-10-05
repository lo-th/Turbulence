tell('basic 3d view');

var v3d = new V3D.View();

var v = v3d;
v.initLight();
renderLoop();

function renderLoop(){
    v.render();
    requestAnimationFrame( renderLoop );
}

// add basic grid
v.addGrid(200, 20);

// import object pack
var pool = new SEA3D.Pool();
pool.load( ['../models/basic.sea'], initObject );

function initObject(){
    // trace object imported list
    tell(pool.getList());

    // create new mesh with loaded geometry
    var a = new THREE.Mesh(pool.geo('basic_point'), v.mats.c1);
    v.scene.add(a);

    /**/

    var b2 = new THREE.Mesh(pool.edit('basic_pivot', 20), v.mats.c3);
    v.scene.add(b2);
    b2.position.set(0,0,-100);

    var b = new THREE.Mesh(pool.geo('basic_pivot'), v.mats.c3);
    v.scene.add(b);
    b.position.set(0,0,-50);

    var c = new THREE.Mesh(pool.geo('basic_origin'), v.mats.c5);
    v.scene.add(c);

}