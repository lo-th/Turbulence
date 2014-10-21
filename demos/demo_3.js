
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
	var mat0 = new THREE.MeshLambertMaterial( { color:0xff3333 } );

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

		var head, eye, palm, pelvis;

		v3d.scene.add(beetle);



		
		if(i==0){
			//console.log(body.geometry.bones.length);

		    beetle.position.set(100,0,0);
		    head = pool.getMesh('beetle_b_head').clone();
		    eye = pool.getMesh('beetle_b_eye').clone();
		    palm = pool.getMesh('beetle_b_palm').clone();

		    pelvis = pool.getMesh('beetle_b_pelvis').clone();

		    head.material = mat0;
		    eye.material = mat0;
			palm.material = mat0;
		}
		else {
			beetle.position.set(-100,0,0);
			head = pool.getMesh('beetle_a_head').clone();
			eye = pool.getMesh('beetle_a_eye').clone();
		    palm = pool.getMesh('beetle_a_palm').clone();

		    pelvis = pool.getMesh('beetle_a_pelvis').clone();

			head.material = mat0;
			eye.material = mat0;
			palm.material = mat0;

			foot.setWeight("big", 1);
		}

		head.position.set(0,0,0);
		head.rotation.set(0,0,0);

		eye.position.set(0,0,0);
		eye.rotation.set(0,0,0);

		palm.position.set(0,0,0);
		palm.rotation.set(0,0,0);

		pelvis.position.set(0,0,0);
		pelvis.rotation.set(0,0,0);

		for(var k = 0; k< pelvis.children.length; k++){
			//pelvis.children[k].rotation.set(0,20*v3d.ToRad,0);
			pelvis.children[k].material = mat0;
		}

		for(var j=0; j<body.skeleton.bones.length; j++){
		    	var bone = body.skeleton.bones[j]
				var name = bone.name;
				//console.log(name);
				if(name =='BeetleHead2' ){ 
					bone.add(head);
					bone.add(eye);
					bone.add(palm);
				}
				if(name=='BeetlePelvis'){
					bone.add(pelvis);
				}
			}
		//head.scale.set(size,size,-size);
		//beetle.add(head);
		beetles[i] = beetle;

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