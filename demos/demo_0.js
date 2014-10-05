// basic vue 3d 
var v3d = new V3D.View();
var v = v3d;
v.initLight();
renderLoop();

function renderLoop(){
    v.render();
    requestAnimationFrame( renderLoop );
}

v.addGrid(200, 20);
tell('basic 3d view');