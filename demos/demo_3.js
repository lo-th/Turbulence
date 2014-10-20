
var v3d = new V3D.View();
v3d.initLight();
var beetles = [];

// import object pack
var pool = new SEA3D.Pool();
pool.load( ['../models/beetle.sea'], initObject );

function initObject(){
	tell(pool.getList());
	beetles[0] = new THREE.Object3D();
	var mat = new THREE.MeshLambertMaterial( { color:0xffffff, skinning:true,morphTargets:true } )
	var mat2 = new THREE.MeshLambertMaterial( { color:0xff33ff, skinning:true } )
	var body = pool.getMesh('beetle_body')//new THREE.SkinnedMesh(pool.geo('beetle_body'), mat);
	var foot = pool.getMesh('beetle_foot')//new THREE.SkinnedMesh(pool.geo('beetle_foot'), mat2);
	foot.material = mat;
	body.material = mat2;
	foot.position.set(0,0,0);
	body.position.set(0,0,0);

	foot.scale.set(1,1,-1);
	body.scale.set(1,1,-1);

	beetles[0].add(body);
	beetles[0].add(foot);

	foot.animations[0].weight = 0;
	foot.animations[2].weight = 0;
	body.animations[0].weight = 0;
	body.animations[2].weight = 0;

	foot.animations[1].play( 0, 'idle' );
	foot.animations[1].weight = 1;

	body.animations[1].play( 0, 'idle' );
	body.animations[1].weight = 1;

	v3d.scene.add(beetles[0]);

	console.log(body.animations.length)













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