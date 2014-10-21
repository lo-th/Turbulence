
var v3d = new V3D.View();
v3d.initLight();
var beetles = [];

// import object pack
var pool = new SEA3D.Pool();
pool.load( ['../models/beetle.sea'], initObject );

function initObject(){
	tell(pool.getList());

	var size = 0.25;
	
	var mat = new THREE.MeshLambertMaterial( { color:0xffffff, skinning:true,morphTargets:true } );
	var mat2 = new THREE.MeshLambertMaterial( { color:0xff33ff, skinning:true } );

	for(var i=0;i<2;i++){

		var beetle = new THREE.Object3D();
		var body = pool.getMesh('beetle_body').clone();
		var foot = pool.getMesh('beetle_foot').clone();
		foot.material = mat;
		body.material = mat2;
		foot.position.set(0,0,0);
		body.position.set(0,0,0);

		foot.scale.set(size,size,-size);
		body.scale.set(size,size,-size);

		beetle.add(body);
		beetle.add(foot);

		foot.animations[0].weight = 0;
		foot.animations[2].weight = 0;
		body.animations[0].weight = 0;
		body.animations[2].weight = 0;

		foot.animations[1].play( 0, 'idle' );
		foot.animations[1].weight = 1;

		body.animations[1].play( 0, 'idle' );
		body.animations[1].weight = 1;

		v3d.scene.add(beetle);

		beetles[i] = beetle;
		if(i==0) beetles[i].position.set(100,0,0);
		else {
			beetles[i].position.set(-100,0,0);
			foot.setWeight("big", 1);
		}

	};













	renderLoop();
}

/* three.js render loop */
function renderLoop()
{
    requestAnimationFrame( renderLoop );
    var delta = v3d.clock.getDelta();
    THREE.AnimationHandler.update( delta );
    v3d.render();
}