tell('basic formula');

var v3d = new V3D.View();

var ToRad = Math.PI / 180;
var ToDeg = 180 / Math.PI;
var inFormulEnable = false;
var rotation = new THREE.Euler(0,0,0);

var v = v3d;
v.initLight();

// test particle
var ppmax = Math.round((2*Math.PI)/0.03);
var ppn = 0;
var pp = new V3D.Particle(v.scene, ppmax);

//pp.addV(100,100, 0)
//pp.addV(150,100, 0)
// formule points
var points = ['a1','a2','b1','b2','b3','y1','y2','y3','y4','o1','o2'];
var meshs = {};
var labels = {};
var links = {};
var scale = [];

renderLoop();

function renderLoop(){
    if(inFormulEnable){
        rotation.z+=0.03;
        runFormule();
    }
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
    //tell(pool.getList());
    var m, l, t, name;
    for(var i=0; i<points.length; i++){
        // init basic mesh point
        name = points[i];
        if(name=='a1') m = new THREE.Mesh( pool.geo('basic_point0'), v.mats.c6 );
        else if(name=='y1') m = new THREE.Mesh( pool.geo('basic_point2'), v.mats.c6 );
        else if(name=='b3' || name=='o2' ) m = new THREE.Mesh( pool.geo('basic_point3'), v.mats.c6 );
        else if(name=='y4') m = new THREE.Mesh( pool.geo('basic_point1'), v.mats.c6 );
        else if(name=='a2') m = new THREE.Mesh( pool.geo('basic_point4'), v.mats.c6 );
        else m = new THREE.Mesh( pool.geo('basic_point'), v.mats.c6 );
        v.scene.add(m);
        // add label 
        t = v.addLabel(name);
        v.scene.add(t);
        // add Link
        if(name=='y2' || name=='y3' || name=='y4') l = new THREE.Mesh( pool.geo('basic_joint'), v.mats.c4 );
        else{ 
            l = new THREE.Mesh( pool.geo('basic_joint1'), v.mats.c4 );
        }
        v.scene.add(l);

        if(name=='a1' || name=='a2'){
             var c = new THREE.Mesh( pool.geo('basic_origin'), v.mats.c5 );
             t.add(c);
        }

        labels[name] = t;
        meshs[name] = m;
        links[name] = l;
    }

    // add two extra link
    for(i=0; i<2; i++){
        name = 'bx'+ i;
        l = new THREE.Mesh( pool.geo('basic_joint1'), v.mats.c4 );
        //var l = new THREE.Mesh( v.geos.box, v.mats.c3 );
        //l.scale.set(1,4,4);
        v.scene.add(l);
        links[name] = l;
    }

    runFormule();
}

function runFormule(){
    var factor = 20;
    
    var R = 180;
    var A = 1.0;

    var a1b1 = A * 0.5;

    var a2o1 = A;
    var a2y1 = A;
    var b1y1 = A;

    var a1o1 = (A - a1b1);
    var a1a2 = Math.sqrt(Math.pow(a1o1,2) + Math.pow(a2o1,2));

    var B = (Math.pow(a2y1,2) + Math.pow(a2o1,2));

    var y1o1 = Math.sqrt(B);
    var b2y2 = Math.sqrt(B);

    var C = B;

    var y2o2 = Math.sqrt(C);
    var b3y3 = Math.sqrt(C);
    var y1y2 = C + Math.sqrt(C);
    var b2o1 = C + Math.sqrt(C);
    var y2y3 = C + Math.sqrt(C);
    var b3o2 = C + Math.sqrt(C);
    var y3y4 = C + Math.sqrt(C);
    
    scale = [a1b1, a1a2,  b1y1, b2o1, b3o2, a2y1, y1y2, y2y3, y3y4, a2o1, y2o2, b2y2, b3y3 ];


    var rad_a2a1b1 = Math.PI- Math.atan(a2o1/a1o1)-rotation.z;
    var a2b1 = Math.sqrt((Math.pow(a1a2,2)) - 2*a1a2*a1b1*Math.cos(rad_a2a1b1) + (Math.pow(a1b1,2)));

    // a2 //
    var a2 = new THREE.Vector3(0.0, 0.0, 0.0);
    meshs.a2.position.set(0.0, 0.0, 0.0);

    // a1 //
    var a1 = new THREE.Vector3(a1a2, 0.0, 0.0);
    meshs.a1.position.set(a1.x*factor, 0.0, 0.0);

    // b1 //
    var rad_a1a2b1 = Math.asin(a1b1*Math.sin(rad_a2a1b1) / a2b1);
    var b1 = new THREE.Vector3((a1a2 - a1b1*Math.cos(rad_a2a1b1)), (a1b1*Math.sin(rad_a2a1b1)), 0.0);
    meshs.b1.position.set(b1.x*factor, b1.y*factor, -14);

    // y1 //
    var rad_y1a2b1 = Math.acos((Math.pow(a2b1,2) + Math.pow(a2y1,2) - Math.pow(b1y1,2)) / (2*a2b1*a2y1));
    var a2y1_X = (Math.cos(rad_y1a2b1)*(b1.x - a2.x) - Math.sin(rad_y1a2b1)*(b1.y - a2.x) ) * a2y1 / a2b1 + a2.x;
    var a2y1_Y = (Math.sin(rad_y1a2b1)*(b1.x - a2.x) + Math.cos(rad_y1a2b1)*(b1.y - a2.x) ) * a2y1 / a2b1 + a2.x;

    var y1 = new THREE.Vector3(a2y1_X, a2y1_Y, 0.0);
    meshs.y1.position.set(y1.x*factor, y1.y*factor, 0.0);

    // for object rotation
    var rad_a1a2y1 = rad_y1a2b1 + rad_a1a2b1;
    var rad_a2y1b1 = Math.acos( ((a2.x - y1.x)*(b1.x - y1.x) + (a2.y - y1.y)*(b1.y - y1.y)) / (Math.sqrt(Math.pow((a2.x - y1.x),2) + Math.pow((a2.y - y1.y),2)) * Math.sqrt(Math.pow((b1.x - y1.x),2) + Math.pow((b1.y - y1.y),2)) ) );

    // o1 //
    var rad_y1a2o1 = Math.PI / 2;// 90
    var a2o1_X = (Math.cos(-rad_y1a2o1)*y1.x - Math.sin(-rad_y1a2o1)*y1.y) * a2o1 / a2y1;
    var a2o1_Y = (Math.sin(-rad_y1a2o1)*y1.x + Math.cos(-rad_y1a2o1)*y1.y) * a2o1 / a2y1;

    var o1 = new THREE.Vector3(a2o1_X, a2o1_Y, 0.0);
    meshs.o1.position.set(o1.x*factor, o1.y*factor, 0.0);

    // y2 //
    var rad_b1y1y2 = 135*ToRad;
    var y1y2_X = (Math.cos(-rad_b1y1y2)*(b1.x - y1.x) - Math.sin(-rad_b1y1y2)*(b1.y - y1.y)) * y1y2 / b1y1 + y1.x;
    var y1y2_Y = (Math.sin(-rad_b1y1y2)*(b1.x - y1.x) + Math.cos(-rad_b1y1y2)*(b1.y - y1.y)) * y1y2 / b1y1 + y1.y;

    var y2 = new THREE.Vector3(y1y2_X, y1y2_Y, 0.0);
    meshs.y2.position.set(y2.x*factor, y2.y*factor, 0.0);

    // b2 //
    var rad_y2y1o1 = Math.acos(((y2.x - y1.x)*(o1.x - y1.x) + (y2.y - y1.y)*(o1.y - y1.y))/(y1y2 * y1o1));
    var y2o1 = Math.sqrt((Math.pow(y1y2,2)) - 2*y1y2*y1o1*Math.cos(rad_y2y1o1) + (Math.pow(y1o1,2)));
    var rad_b2y2o1 = Math.acos((Math.pow(y2o1,2) + Math.pow(b2y2,2) - Math.pow(b2o1,2)) / (2*y2o1*b2y2));

    var b2y2_X = (Math.cos(-rad_b2y2o1)*(o1.x - y2.x) - Math.sin(-rad_b2y2o1)*(o1.y - y2.y) ) * b2y2 / y2o1  + y2.x;
    var b2y2_Y = (Math.sin(-rad_b2y2o1)*(o1.x - y2.x) + Math.cos(-rad_b2y2o1)*(o1.y - y2.y) ) * b2y2 / y2o1  + y2.y;

    var b2 = new THREE.Vector3(b2y2_X, b2y2_Y, 0.0);
    meshs.b2.position.set(b2.x*factor, b2.y*factor, 0.0);

    // for object rotation
    var rad_y1y2o1 = Math.acos( ((y1.x - y2.x)*(o1.x - y2.x) + (y1.y - y2.y)*(o1.y - y2.y)) / (Math.sqrt(Math.pow((y1.x - y2.x),2) + Math.pow((y1.y - y2.y),2)) * Math.sqrt(Math.pow((o1.x - y2.x),2) + Math.pow((o1.y - y2.y),2)) ) );
    var rad_y2b2o1 = Math.acos( ((y2.x - b2.x)*(o1.x - b2.x) + (y2.y - b2.y)*(o1.y - b2.y)) / (Math.sqrt(Math.pow((y2.x - b2.x),2) + Math.pow((y2.y - b2.y),2)) * Math.sqrt(Math.pow((o1.x - b2.x),2) + Math.pow((o1.y - b2.y),2)) ) );

    // o2 //
    var rad_y1y2o2 = Math.PI;// 180
    var y2o2_X = (Math.cos(-rad_y1y2o2)*(y1.x - y2.x) - Math.sin(-rad_y1y2o2)*(y1.y - y2.y)) * y2o2 / y1y2 + y2.x;
    var y2o2_Y = (Math.sin(-rad_y1y2o2)*(y1.x - y2.x) + Math.cos(-rad_y1y2o2)*(y1.y - y2.y)) * y2o2 / y1y2 + y2.y;

    var o2 = new THREE.Vector3(y2o2_X, y2o2_Y, 0.0);
    meshs.o2.position.set(o2.x*factor, o2.y*factor, 0.0);

    // y3 //
    var rad_b2y2y3 = Math.PI;
    var y2y3_X = (Math.cos(-rad_b2y2y3)*(b2.x - y2.x) - Math.sin(-rad_b2y2y3)*(b2.y - y2.y)) * y2y3 / b2y2 + y2.x;
    var y2y3_Y = (Math.sin(-rad_b2y2y3)*(b2.x - y2.x) + Math.cos(-rad_b2y2y3)*(b2.y - y2.y)) * y2y3 / b2y2 + y2.y;

    var y3 = new THREE.Vector3(y2y3_X, y2y3_Y, 0.0);
    meshs.y3.position.set(y3.x*factor, y3.y*factor, 0.0);
            
    // b3 //
    var rad_y3y2o2 = Math.acos(((y3.x - y2.x)*(o2.x - y2.x) + (y3.y - y2.y)*(o2.y - y2.y))/(y2y3 * y2o2));
    var y3o2 = Math.sqrt((Math.pow(y2y3,2)) - 2*y2y3*y2o2*Math.cos(rad_y3y2o2) + (Math.pow(y2o2,2)));
    var rad_b3y3o2 = Math.acos((Math.pow(y3o2,2) + Math.pow(b3y3,2) - Math.pow(b3o2,2)) / (2*y3o2*b3y3));
    var b3y3_X = (Math.cos(rad_b3y3o2)*(o2.x - y3.x) - Math.sin(rad_b3y3o2)*(o2.y - y3.y) ) * b3y3 / y3o2  + y3.x;
    var b3y3_Y = (Math.sin(rad_b3y3o2)*(o2.x - y3.x) + Math.cos(rad_b3y3o2)*(o2.y - y3.y) ) * b3y3 / y3o2  + y3.y;

    var b3 = new THREE.Vector3(b3y3_X, b3y3_Y, 0.0);
    meshs.b3.position.set(b3.x*factor, b3.y*factor, 0.0);    

    // for object rotation
    var rad_y2y3o2 = Math.acos( ((y2.x - y3.x)*(o2.x - y3.x) + (y2.y - y3.y)*(o2.y - y3.y)) / (Math.sqrt(Math.pow((y2.x - y3.x),2) + Math.pow((y2.y - y3.y),2)) * Math.sqrt(Math.pow((o2.x - y3.x),2) + Math.pow((o2.y - y3.y),2)) ) );
    var rad_y3b3o2 = Math.acos( ((y3.x - b3.x)*(o2.x - b3.x) + (y3.y - b3.y)*(o2.y - b3.y)) / (Math.sqrt(Math.pow((y3.x - b3.x),2) + Math.pow((y3.y - b3.y),2)) * Math.sqrt(Math.pow((o2.x - b3.x),2) + Math.pow((o2.y - b3.y),2)) ) );

    // y4 //
    var rad_b3y3y4 = R*ToRad;

    var y3y4_X = (Math.cos(-rad_b3y3y4)*(b3.x - y3.x) - Math.sin(-rad_b3y3y4)*(b3.y - y3.y)) * y3y4 / b3y3 + y3.x;
    var y3y4_Y = (Math.sin(-rad_b3y3y4)*(b3.x - y3.x) + Math.cos(-rad_b3y3y4)*(b3.y - y3.y)) * y3y4 / b3y3 + y3.y;

    var y4 = new THREE.Vector3(y3y4_X, y3y4_Y, 0.0);
    meshs.y4.position.set(y4.x*factor, y4.y*factor, 0.0);


    // ROTATION
    meshs.a1.rotation.z = Math.PI-rad_a2a1b1;

    meshs.b1.rotation.z = (rad_a2y1b1+rad_a1a2y1);
    meshs.b2.rotation.z = (-Math.PI+rad_a2y1b1+rad_a1a2y1-rad_b1y1y2-rad_y1y2o1-rad_b2y2o1-rad_y2b2o1)
    meshs.b3.rotation.z = (rad_a2y1b1+rad_a1a2y1-rad_b1y1y2-rad_y1y2o1-rad_b2y2o1-rad_b2y2y3-rad_y2y3o2+rad_b3y3o2+rad_y3b3o2)

    meshs.o1.rotation.z = (-rad_y1a2o1+rad_a1a2y1)+Math.PI;
    meshs.o2.rotation.z = (rad_a2y1b1+rad_a1a2y1-rad_b1y1y2+rad_y1y2o2)+Math.PI;

    meshs.y1.rotation.z = rad_a1a2y1+Math.PI;
    meshs.y2.rotation.z = (rad_a2y1b1+rad_a1a2y1-rad_b1y1y2);
    meshs.y3.rotation.z = (-Math.PI+rad_a2y1b1+rad_a1a2y1-rad_b1y1y2-rad_y1y2o1-rad_b2y2o1+rad_b2y2y3)
    meshs.y4.rotation.z = (rad_a2y1b1+rad_a1a2y1-rad_b1y1y2-rad_y1y2o1-rad_b2y2o1-rad_b2y2y3-rad_y2y3o2+rad_b3y3o2-rad_b3y3y4);


    // apply new position to each label
    var i = points.length, name;
    while(i--){
        name = points[i];
        labels[name].position.copy(meshs[name].position);
        if(name == 'a1' || name == 'a2') labels[name].position.z = -28;
        //if(name == 'b1') labels[name].position.z = -14;
    }

    // apply new position to each link
    var i = points.length, name;
    while(i--){
        name = points[i];
        links[name].position.copy(meshs[name].position);
        links[name].rotation.copy(meshs[name].rotation);
        links[name].translateX((scale[i]*factor)*0.5);
        //if(name == 'a1' || name == 'y1' || name == 'o1'|| name == 'b3') links[name].translateZ(-4);
        if(name == 'y3'|| name == 'o1' || name == 'y1') links[name].translateZ(-7);
        if( name == 'b3' ) links[name].translateZ(-14);
        if(name == 'a1') links[name].translateZ(-21);
        if(name == 'a2') links[name].translateZ(-28);
        links[name].scale.x = (scale[i]*factor);
    }
    // extra link
    links.bx0.position.copy(meshs.y2.position);
    links.bx0.rotation.copy(meshs.y3.rotation);
    links.bx0.translateX((scale[11]*factor)*0.5);
    links.bx0.translateZ(-7);
    links.bx0.scale.x = scale[11]*factor;


    //links.bx1.position.copy(meshs.y3.position);
    links.bx1.position.copy(meshs.b3.position);
    links.bx1.rotation.z = meshs.b3.rotation.z - rad_y3y2o2;//-Math.PI;
    //links.bx1.rotation.copy(meshs.y4.rotation);
    links.bx1.translateX(((scale[12]*factor)*0.5));
    //links.bx1.translateZ(-10);
    links.bx1.scale.x = scale[12]*factor;

    pp.move(ppn, meshs.y4.position.x, meshs.y4.position.y, -7);
    ppn++;
    if(ppn==ppmax) ppn = 0;
    //if(rotation.z<(2*Math.PI))
        //if(pp)pp.addV(Math.round(meshs.y4.position.x),Math.round(meshs.y4.position.y),0);


    inFormulEnable=true;
}