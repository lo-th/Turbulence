
var v3d = new V3D.View();
var v = v3d;
renderLoop();

var beetles = [];
var wings = [];
var parts = [];

var tweens = [];
var anims  = ['idle', 'idle'];

var b1set = { idle:1, walk:0, fly:0, w1:180, w2:0 };
var b2set = { idle:1, walk:0, fly:0, w1:180, w2:0 };

var b1 = new UI.Button('idle', switchAnim1, 110);
var b2 = new UI.Button('idle', switchAnim2);

// import object pack
var pool = new SEA3D.Pool();
pool.loadImages(['../images/beetle_a.jpg', '../images/beetle_b.jpg', '../images/body.jpg'], loadObject);

function loadObject(){
	pool.load( ['../models/beetle.sea'], initObject );
}

function initObject(){
	//tell(pool.getList());

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

		var beetle = new THREE.Object3D();
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

		var head, eye, palm, pelvis, chassis;
		chassis = pool.getMesh('beetle_chassis').clone();
		chassis.material = matcc;

		v3d.scene.add(beetle);

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
					bone.add(pelvis);
					bone.add(chassis);
				}
			}
		beetles[i] = beetle;
		parts[i] = [body, foot];
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

/* three.js render loop */
function renderLoop(){
    TWEEN.update();
    var delta = v3d.clock.getDelta();
    THREE.AnimationHandler.update( delta );
    v3d.render();
    requestAnimationFrame( renderLoop );
}