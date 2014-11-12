var v3d = new V3D.View(110,60,200);
var v = v3d;
renderLoop();


var pool = new SEA3D.Pool();
pool.load( ['../models/bb.sea'], initObject, 'auto' );

function initObject(){
	var size = 1;
	var mat = new V3D.SphericalShader({env:v.img, color:0xFF0000, skinning:true });
	var body = pool.getMesh('bb_blob').clone();
	body.material = mat;
	body.scale.set(size,size,-size);
	body.animations[0].play(0);
	v.scene.add(body);

}

function renderLoop(){
    TWEEN.update();
    var delta = v3d.clock.getDelta();
    THREE.AnimationHandler.update( delta );
    v3d.render();
    requestAnimationFrame( renderLoop );
}