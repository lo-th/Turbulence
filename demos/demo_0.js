tell('basic 3d view');

var v3d = new V3D.View();
var v = v3d;
renderLoop();

function renderLoop(){
    v.render();
    requestAnimationFrame( renderLoop );
}

v.addGrid(200, 20);