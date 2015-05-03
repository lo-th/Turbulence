

var v3d = new V3D.View();
v3d.tell('The formula with a divine joint');

var ToRad = Math.PI / 180;
var ToDeg = 180 / Math.PI;
var inFormulEnable = false;
var rotation = new THREE.Euler(0,0,0);

var v = v3d;


// three particle
var ppmax = Math.round((2*Math.PI)/0.03);
var ppn = 0;
var particules = new THREE.Group();
var pp = new V3D.Particle(particules, ppmax);
v.scene.add(particules)
particules.position.z = -30;
// formule points
var points = ['a1','a2', 'b1','b2','b3','y1','y2','y3','y4','o1','o2', 'o3','o4','b4','y5','a3','b0'];
var meshs = {};
var labels = {};
var links = {};
var scale = [];
var pivot = null;
var target = null;

var hidePoints = ['a1', 'b1', 'b2', 'y1'];
var extraPoints = ['o3','o4','b4','y5'];
var angles = [180,180];

var type = 0;
var formule = 1;

var b1 = new UI.Button('type 0', setType);
var b2 = new UI.Button('simple', setFormule, 110);

var a1 = new UI.Angular('y2', setY2, 180);
var a2 = new UI.Angular('y3', setY3, 180, 60);
// add clock
var c = new UI.Clock();

renderLoop();

function renderLoop(){
    if(inFormulEnable){
        rotation.z-=0.03;
        c.set(v.unDegrees(-rotation.z));
        runFormule();
    }
    v.render();
    requestAnimationFrame( renderLoop );
}

// add basic grid
v.addGrid(200, 20, [0,0,-30]);

// import object pack
var objName = "basic";
//var objName = "basic_op"; // version optimiser
var pool = new SEA3D.Pool();
pool.load( ['./models/'+objName+'.sea'], initObject, 'buffer' );


function initObject(){
    // trace object imported list
    //tell(pool.getList());
    var m, l, t, name;
    for(var i=0; i<points.length; i++){
        // init basic mesh point
        name = points[i];
        if(name=='a1') m = new THREE.Mesh( pool.geo(objName+'_point0'), v.mats.c6 );
	else if(name=='a3') m = new THREE.Mesh( pool.geo(objName+'_point0'), v.mats.c6 );
        else if(name=='y1'|| name=='y2') m = new THREE.Mesh( pool.geo(objName+'_point2'), v.mats.c6 );
        else if(name=='o2'|| name=='b2') m = new THREE.Mesh( pool.geo(objName+'_point3'), v.mats.c6 );
        else if(name=='o4' || name=='y5')m = new THREE.Mesh( pool.geo(objName+'_point6'), v.mats.c6 ); 
        else if(name=='y3') m = new THREE.Mesh( pool.geo(objName+'_point7'), v.mats.c6 );
        else if(name=='b3') m = new THREE.Mesh( pool.geo(objName+'_point8'), v.mats.c6 );
        else if(name=='y4') m = new THREE.Mesh( pool.geo(objName+'_point1'), v.mats.c6 );
        else if(name=='a2' ) m = new THREE.Mesh( pool.geo(objName+'_point8'), v.mats.c6 );
        else m = new THREE.Mesh( pool.geo(objName+'_point5'), v.mats.c6 );
        v.scene.add(m);

        // add label
        t = v.addLabel(name);
        v.scene.add(t);
        // add Link
        if(name=='a3') m = new THREE.Mesh( pool.geo(objName+'_joint_1'), v.mats.c5);
        else if(name=='y2' || name=='y3' || name=='y4') l = new THREE.Mesh( pool.geo(objName+'_joint'), v.mats.c7 );
        else l = new THREE.Mesh( pool.geo(objName+'_joint_1'), v.mats.c4 );
        
        v.scene.add(l);

        if(name=='a1' || name=='a3'){
            var c = new THREE.Mesh( pool.geo(objName+'_origin'), v.mats.c5 );
            t.add(c);
        }

        labels[name] = t;
        meshs[name] = m;
        links[name] = l;

    }

    // add tree extra link
    for(i=0; i<3; i++){
        name = 'bx'+ i;
        l = new THREE.Mesh( pool.geo(objName+'_joint_1'), v.mats.c4 );
        v.scene.add(l);
        links[name] = l;
    }
    // add extra pivot
    pivot = new THREE.Mesh( pool.geo(objName+'_pivot'), v.mats.c6 );
    v.scene.add(pivot);
    // add extra target
    target = new THREE.Mesh( pool.geo(objName+'_point_end'), v.mats.c1 );
    v.scene.add(target);

    setFormule();
    runFormule();
}

function runFormule(){
    var factor = 20;
    
    var R = 180;
    var A = 1.0;
    if(type == 1) A = 0.01;

    var a1b0 = A * 0.5;
    
    var a1b1 = A * 0.5;
    var a2a3 = A * 0.5;

    var a2o1 = A;
    var a2y1 = A;
    var b1y1 = A;

    var a1o1 = (A - a1b1);
    var a1a2 = Math.sqrt(Math.pow(a1o1,2) + Math.pow(a2o1,2));

    var a1a3 = a1a2 + a2a3;

    var B = (Math.pow(a2y1,2) + Math.pow(a2o1,2));

    var y1o1 = Math.sqrt(B);
    var b2y2 = Math.sqrt(B);

    var C = B;
    if(type == 1) C = 2;

    var y2o2 = Math.sqrt(C);
    var b3y3 = Math.sqrt(C);

    var y3o3 = Math.sqrt(C);
    var b4y4 = Math.sqrt(C);
    var y4o4 = Math.sqrt(C);

    var y1y2 = C + Math.sqrt(C);
    var b2o1 = C + Math.sqrt(C);
    var y2y3 = C + Math.sqrt(C);
    var b3o2 = C + Math.sqrt(C);
    var y3y4 = C + Math.sqrt(C);
    
    var b4o3 = C + Math.sqrt(C);
    var y4y5 = Math.sqrt(C);
    
//          ['a1','a2' ,'b1' ,'b2' ,'b3' ,'y1' ,'y2' ,'y3' ,'y4' ,'o1' ,'o2' ,    'o3' ,'o4' ,'b4' ,'y5' ];
    scale = [a1b1, a2a3, b1y1, b2o1, b3o2, a2y1, y1y2, y2y3, y3y4, a2o1, y2o2,    y3o3, y4o4, b4o3, y4y5, a2a3 ];

    // a3 //
    var a3 = new THREE.Vector3(0.0, 0.0, 0.0);
    
    // a0a3a2
    var rad_a0a3a2 = -30 *ToRad;

    // a2 //
    var a2 = new THREE.Vector3(a2a3*Math.cos(rad_a0a3a2), a2a3*Math.sin(rad_a0a3a2), 0.0);

    // a3a2a1
    var rad_a3a2a1 = 60 *ToRad + rad_a0a3a2;
    
    // a1 //
    var a1 = new THREE.Vector3(a2.x + (a1a2*Math.cos(rad_a3a2a1)), a2.y + (a1a2*Math.sin(rad_a3a2a1)), 0.0);

//  default of a2a1b1 is 116.5650512 degree
    var rad_a2a1b1 = Math.PI - Math.atan(a2o1/a1o1);

    var a2b1 = Math.sqrt(Math.pow(a1a2,2) - 2*a1a2*a1b1*Math.cos(rad_a2a1b1) + Math.pow(a1b1,2));

//  a2a1b0 rotate 360 degree
    var rad_a2a1b0 = Math.PI- Math.atan(a2o1/a1o1) + rad_a0a3a2 -rotation.z;

    var a2b0 = Math.sqrt(Math.pow(a1a2,2) - 2*a1a2*a1b0*Math.cos(rad_a2a1b0) + Math.pow(a1b0,2));

//  b0a1b1
    var rad_b0a1b1 = (rad_a2a1b0 - rad_a2a1b1);
    var b0b1 = Math.sqrt(Math.pow(a1b0,2) - 2*a1b0*a1b1*Math.cos(rad_b0a1b1) + Math.pow(a1b1,2));
    
    var rad_a1a2b0 = Math.asin(a1b0*Math.sin(rad_a2a1b0) / a2b0);

//  b0 //
    var b0 = new THREE.Vector3(a1.x - (a1b0*Math.cos(rad_a2a1b0)), (a1b0*Math.sin(rad_a2a1b0)) + a1.y, 0.0);

    var rad_a1a2b1 = Math.asin(a1b1*Math.sin(rad_a2a1b1) / a2b1);
 
    // b1 //
    var a1b1_X = (Math.cos(-rad_a2a1b1)*(a2.x - a1.x) - Math.sin(-rad_a2a1b1)*(a2.y - a1.y) ) * a1b1 / a1a2 + a1.x;
    var a1b1_Y = (Math.sin(-rad_a2a1b1)*(a2.x - a1.x) + Math.cos(-rad_a2a1b1)*(a2.y - a1.y) ) * a1b1 / a1a2 + a1.y;

    var b1 = new THREE.Vector3(a1b1_X, a1b1_Y, 0.0);
   
    // y1 //
    var rad_y1a2b1 = Math.acos((Math.pow(a2b1,2) + Math.pow(a2y1,2) - Math.pow(b1y1,2)) / (2*a2b1*a2y1));
    var a2y1_X = (Math.cos(rad_y1a2b1)*(b1.x - a2.x) - Math.sin(rad_y1a2b1)*(b1.y - a2.y) ) * a2y1 / a2b1 + a2.x;
    var a2y1_Y = (Math.sin(rad_y1a2b1)*(b1.x - a2.x) + Math.cos(rad_y1a2b1)*(b1.y - a2.y) ) * a2y1 / a2b1 + a2.y;

    var y1 = new THREE.Vector3(a2y1_X, a2y1_Y, 0.0);
    var rad_a1a2y1 = rad_y1a2b1 + rad_a1a2b1;

    // for object rotation
    var rad_a2y1b1 = Math.acos( ((a2.x - y1.x)*(b1.x - y1.x) + (a2.y - y1.y)*(b1.y - y1.y)) / (Math.sqrt(Math.pow((a2.x - y1.x),2) + Math.pow((a2.y - y1.y),2)) * Math.sqrt(Math.pow((b1.x - y1.x),2) + Math.pow((b1.y - y1.y),2)) ) );

    var rad_b1a2b0 = 0;
    var rad_b1a3b0 = 0;

    var rad_allb1y1b0 = 0;
    var rad_allb1a2b0 = 0;
    var rad_allb1a3b0 = 0;

    var rad_b1y1y1 = 0;
    var rad_b0y1y1 = 0;
	
    var rad_b1y1b0 = 0;
	
    var y1b0_X = 0;
    var y1b0_Y = 0;

    var rad_b1a2a2 = 0;
    var rad_b0a2a2 = 0;

    var rad_allb1a2b0 = 0;
    var rad_b1a2b0 = 0;

    var a2b0_X = 0;
    var a2b0_Y = 0;
    
    var rad_b1a3a3 = 0;
    var rad_b0a3a3 = 0;
    var a3b0_X = 0;
    var a3b0_Y = 0;

    //------------------------- IK
    // IK chain = a3 - a2 - y1 - b1
    // Effecter = b0
	
    // y1b1->b0 start
    // step.1 : calculate rad_b1y1b0, rotate vector y1b1 -> y1b0

    rad_b1y1y1 = Math.atan((b1.y - y1.y)/(b1.x - y1.x));
    rad_b0y1y1 = Math.atan((b0.y - y1.y)/(b0.x - y1.x));

    rad_allb1y1b0 = rad_allb1y1b0 + (+rad_b1y1y1 -rad_b0y1y1);
    rad_b1y1b0 = (+rad_b1y1y1 -rad_b0y1y1);

    y1b0_X = (Math.cos(-rad_b1y1b0)*(b1.x - y1.x) - Math.sin(-rad_b1y1b0)*(b1.y - y1.y)) + y1.x;
    y1b0_Y = (Math.sin(-rad_b1y1b0)*(b1.x - y1.x) + Math.cos(-rad_b1y1b0)*(b1.y - y1.y)) + y1.y;

    b1 = new THREE.Vector3(y1b0_X, y1b0_Y, 0.0);

    // a2b1->b0 start
    // step.2 : calculate rad_b1a2b0, rotate vector a2b1 -> a2b0

    rad_b1a2a2 = Math.atan((b1.y - a2.y)/(b1.x - a2.x));
    rad_b0a2a2 = Math.atan((b0.y - a2.y)/(b0.x - a2.x));
            
    rad_allb1a2b0 = rad_allb1a2b0 + (+rad_b1a2a2 -rad_b0a2a2);
    rad_b1a2b0 = (+rad_b1a2a2 -rad_b0a2a2);

    //b1
    a2b0_X = (Math.cos(-rad_b1a2b0)*(b1.x - a2.x) - Math.sin(-rad_b1a2b0)*(b1.y - a2.y)) + a2.x;
    a2b0_Y = (Math.sin(-rad_b1a2b0)*(b1.x - a2.x) + Math.cos(-rad_b1a2b0)*(b1.y - a2.y)) + a2.y;

    b1.x = a2b0_X;
    b1.y = a2b0_Y;

    //y1
    a2b0_X = (Math.cos(-rad_b1a2b0)*(y1.x - a2.x) - Math.sin(-rad_b1a2b0)*(y1.y - a2.y)) + a2.x;
    a2b0_Y = (Math.sin(-rad_b1a2b0)*(y1.x - a2.x) + Math.cos(-rad_b1a2b0)*(y1.y - a2.y)) + a2.y;

    y1.x = a2b0_X;
    y1.y = a2b0_Y;
    
    // a3b1->b0 start
    // step.3 : calculate rad_b1a3b0, rotate vector a3b1 -> a3b0
    
    rad_b1a3a3 = Math.atan((b1.y - a3.y)/(b1.x - a3.x));
    rad_b0a3a3 = Math.atan((b0.y - a3.y)/(b0.x - a3.x));
            
    rad_allb1a3b0 = rad_allb1a3b0 + (+rad_b1a3a3 -rad_b0a3a3);
    rad_b1a3b0 = (+rad_b1a3a3 -rad_b0a3a3);


    // b1
    a3b0_X = (Math.cos(-rad_b1a3b0)*(b1.x - a3.x) - Math.sin(-rad_b1a3b0)*(b1.y - a3.y)) + a3.x;
    a3b0_Y = (Math.sin(-rad_b1a3b0)*(b1.x - a3.x) + Math.cos(-rad_b1a3b0)*(b1.y - a3.y)) + a3.y;

    b1.x = a3b0_X;
    b1.y = a3b0_Y;
        
    // y1
    a3b0_X = (Math.cos(-rad_b1a3b0)*(y1.x - a3.x) - Math.sin(-rad_b1a3b0)*(y1.y - a3.y)) + a3.x;
    a3b0_Y = (Math.sin(-rad_b1a3b0)*(y1.x - a3.x) + Math.cos(-rad_b1a3b0)*(y1.y - a3.y)) + a3.y;

    y1.x = a3b0_X;
    y1.y = a3b0_Y;
        
    // a2
    a3b0_X = (Math.cos(-rad_b1a3b0)*(a2.x - a3.x) - Math.sin(-rad_b1a3b0)*(a2.y - a3.y)) + a3.x;
	a3b0_Y = (Math.sin(-rad_b1a3b0)*(a2.x - a3.x) + Math.cos(-rad_b1a3b0)*(a2.y - a3.y)) + a3.y;

    a2.x = a3b0_X;
    a2.y = a3b0_Y;
    //------------------------- IK
    
    // o1 //
    var rad_y1a2o1 = Math.PI / 2;// 90
    var a2o1_X = (Math.cos(-rad_y1a2o1)*(y1.x - a2.x) - Math.sin(-rad_y1a2o1)*(y1.y - a2.y) ) * a2o1 / a2y1 + a2.x;
    var a2o1_Y = (Math.sin(-rad_y1a2o1)*(y1.x - a2.x) + Math.cos(-rad_y1a2o1)*(y1.y - a2.y) ) * a2o1 / a2y1 + a2.y;

    var o1 = new THREE.Vector3(a2o1_X, a2o1_Y, 0.0);

    // y2 //
    var rad_b1y1y2 = 135*ToRad;
    var y1y2_X = (Math.cos(-rad_b1y1y2)*(b1.x - y1.x) - Math.sin(-rad_b1y1y2)*(b1.y - y1.y)) * y1y2 / b1y1 + y1.x;
    var y1y2_Y = (Math.sin(-rad_b1y1y2)*(b1.x - y1.x) + Math.cos(-rad_b1y1y2)*(b1.y - y1.y)) * y1y2 / b1y1 + y1.y;

    var y2 = new THREE.Vector3(y1y2_X, y1y2_Y, 0.0);

    // b2 //
    var rad_y2y1o1 = Math.acos(((y2.x - y1.x)*(o1.x - y1.x) + (y2.y - y1.y)*(o1.y - y1.y))/(y1y2 * y1o1));
    var y2o1 = Math.sqrt((Math.pow(y1y2,2)) - 2*y1y2*y1o1*Math.cos(rad_y2y1o1) + (Math.pow(y1o1,2)));
    var rad_b2y2o1 = Math.acos((Math.pow(y2o1,2) + Math.pow(b2y2,2) - Math.pow(b2o1,2)) / (2*y2o1*b2y2));

    var b2y2_X = (Math.cos(-rad_b2y2o1)*(o1.x - y2.x) - Math.sin(-rad_b2y2o1)*(o1.y - y2.y) ) * b2y2 / y2o1  + y2.x;
    var b2y2_Y = (Math.sin(-rad_b2y2o1)*(o1.x - y2.x) + Math.cos(-rad_b2y2o1)*(o1.y - y2.y) ) * b2y2 / y2o1  + y2.y;

    var b2 = new THREE.Vector3(b2y2_X, b2y2_Y, 0.0);

    // for object rotation
    var rad_y1y2o1 = Math.acos( ((y1.x - y2.x)*(o1.x - y2.x) + (y1.y - y2.y)*(o1.y - y2.y)) / (Math.sqrt(Math.pow((y1.x - y2.x),2) + Math.pow((y1.y - y2.y),2)) * Math.sqrt(Math.pow((o1.x - y2.x),2) + Math.pow((o1.y - y2.y),2)) ) );
    var rad_y2b2o1 = Math.acos( ((y2.x - b2.x)*(o1.x - b2.x) + (y2.y - b2.y)*(o1.y - b2.y)) / (Math.sqrt(Math.pow((y2.x - b2.x),2) + Math.pow((y2.y - b2.y),2)) * Math.sqrt(Math.pow((o1.x - b2.x),2) + Math.pow((o1.y - b2.y),2)) ) );

    // o2 //
    var rad_y1y2o2 = Math.PI;// 180
    var y2o2_X = (Math.cos(-rad_y1y2o2)*(y1.x - y2.x) - Math.sin(-rad_y1y2o2)*(y1.y - y2.y)) * y2o2 / y1y2 + y2.x;
    var y2o2_Y = (Math.sin(-rad_y1y2o2)*(y1.x - y2.x) + Math.cos(-rad_y1y2o2)*(y1.y - y2.y)) * y2o2 / y1y2 + y2.y;

    var o2 = new THREE.Vector3(y2o2_X, y2o2_Y, 0.0);

    // y3 //
    var rad_b2y2y3 = angles[0]*ToRad;// + Math.PI//*190/180;//Math.PI;
    var y2y3_X = (Math.cos(-rad_b2y2y3)*(b2.x - y2.x) - Math.sin(-rad_b2y2y3)*(b2.y - y2.y)) * y2y3 / b2y2 + y2.x;
    var y2y3_Y = (Math.sin(-rad_b2y2y3)*(b2.x - y2.x) + Math.cos(-rad_b2y2y3)*(b2.y - y2.y)) * y2y3 / b2y2 + y2.y;

    var y3 = new THREE.Vector3(y2y3_X, y2y3_Y, 0.0);
            
    // b3 //
    var rad_y3y2o2 = Math.acos(((y3.x - y2.x)*(o2.x - y2.x) + (y3.y - y2.y)*(o2.y - y2.y))/(y2y3 * y2o2));
    var y3o2 = Math.sqrt((Math.pow(y2y3,2)) - 2*y2y3*y2o2*Math.cos(rad_y3y2o2) + (Math.pow(y2o2,2)));
    var rad_b3y3o2 = Math.acos((Math.pow(y3o2,2) + Math.pow(b3y3,2) - Math.pow(b3o2,2)) / (2*y3o2*b3y3));
    var b3y3_X = (Math.cos(rad_b3y3o2)*(o2.x - y3.x) - Math.sin(rad_b3y3o2)*(o2.y - y3.y) ) * b3y3 / y3o2  + y3.x;
    var b3y3_Y = (Math.sin(rad_b3y3o2)*(o2.x - y3.x) + Math.cos(rad_b3y3o2)*(o2.y - y3.y) ) * b3y3 / y3o2  + y3.y;

    var b3 = new THREE.Vector3(b3y3_X, b3y3_Y, 0.0);   

    // for object rotation
    var rad_y2y3o2 = Math.acos( ((y2.x - y3.x)*(o2.x - y3.x) + (y2.y - y3.y)*(o2.y - y3.y)) / (Math.sqrt(Math.pow((y2.x - y3.x),2) + Math.pow((y2.y - y3.y),2)) * Math.sqrt(Math.pow((o2.x - y3.x),2) + Math.pow((o2.y - y3.y),2)) ) );
    var rad_y3b3o2 = Math.acos( ((y3.x - b3.x)*(o2.x - b3.x) + (y3.y - b3.y)*(o2.y - b3.y)) / (Math.sqrt(Math.pow((y3.x - b3.x),2) + Math.pow((y3.y - b3.y),2)) * Math.sqrt(Math.pow((o2.x - b3.x),2) + Math.pow((o2.y - b3.y),2)) ) );

    // y4 //
    var rad_b3y3y4 = (angles[1]*ToRad);// + R*ToRad;//*150/180//R*ToRad;

    var y3y4_X = (Math.cos(-rad_b3y3y4)*(b3.x - y3.x) - Math.sin(-rad_b3y3y4)*(b3.y - y3.y)) * y3y4 / b3y3 + y3.x;
    var y3y4_Y = (Math.sin(-rad_b3y3y4)*(b3.x - y3.x) + Math.cos(-rad_b3y3y4)*(b3.y - y3.y)) * y3y4 / b3y3 + y3.y;

    var y4 = new THREE.Vector3(y3y4_X, y3y4_Y, 0.0);

    //------------------------- new joint extend

    // o3 //
    var rad_y2y3o3 = Math.PI;//180
    var y3o3_X = (Math.cos(-rad_y2y3o3)*(y2.x - y3.x) - Math.sin(-rad_y2y3o3)*(y2.y - y3.y)) * y3o3 / y2y3 + y3.x;
    var y3o3_Y = (Math.sin(-rad_y2y3o3)*(y2.x - y3.x) + Math.cos(-rad_y2y3o3)*(y2.y - y3.y)) * y3o3 / y2y3 + y3.y;
    var o3 = new THREE.Vector3(y3o3_X, y3o3_Y, 0.0);

    // b4 //
    var rad_y4y3o3 = Math.acos(((y4.x - y3.x)*(o3.x - y3.x) + (y4.y - y3.y)*(o3.y - y3.y))/(y3y4 * y3o3));
    //var deg_y4y3o3 = rad_y4y3o3*180/Math.PI;
  
    var y4o3 = Math.sqrt((Math.pow(y3y4,2)) - 2*y3y4*y3o3*Math.cos(rad_y4y3o3) + (Math.pow(y3o3,2)));

    var rad_b4y4o3 = Math.acos((Math.pow(y4o3,2) + Math.pow(b4y4,2) - Math.pow(b4o3,2)) / (2*y4o3*b4y4));
    //var deg_b4y4o3 = rad_b4y4o3*180/Math.PI;
        
    var b4y4_X = (Math.cos(-rad_b4y4o3)*(o3.x - y4.x) - Math.sin(-rad_b4y4o3)*(o3.y - y4.y) ) * b4y4 / y4o3  + y4.x;
    var b4y4_Y = (Math.sin(-rad_b4y4o3)*(o3.x - y4.x) + Math.cos(-rad_b4y4o3)*(o3.y - y4.y) ) * b4y4 / y4o3  + y4.y;
       
    var b4 = new THREE.Vector3(b4y4_X, b4y4_Y, 0.0);

    // object rotation
    var rad_y3y4o3 = Math.acos( ((y3.x - y4.x)*(o3.x - y4.x) + (y3.y - y4.y)*(o3.y - y4.y)) / (Math.sqrt(Math.pow((y3.x - y4.x),2) + Math.pow((y3.y - y4.y),2)) * Math.sqrt(Math.pow((o3.x - y4.x),2) + Math.pow((o3.y - y4.y),2))) );
    var rad_y4b4o3 = Math.acos( ((y4.x - b4.x)*(o3.x - b4.x) + (y4.y - b4.y)*(o3.y - b4.y)) / (Math.sqrt(Math.pow((y4.x - b4.x),2) + Math.pow((y4.y - b4.y),2)) * Math.sqrt(Math.pow((o3.x - b4.x),2) + Math.pow((o3.y - b4.y),2))) );

    // o4 //
    var rad_y3y4o4 = Math.PI;//155 * Math.PI / 180//180

    var y4o4_X = (Math.cos(-rad_y3y4o4)*(y3.x - y4.x) - Math.sin(-rad_y3y4o4)*(y3.y - y4.y)) * y4o4 / y3y4 + y4.x;
    var y4o4_Y = (Math.sin(-rad_y3y4o4)*(y3.x - y4.x) + Math.cos(-rad_y3y4o4)*(y3.y - y4.y)) * y4o4 / y3y4 + y4.y;

    var o4 = new THREE.Vector3(y4o4_X, y4o4_Y, 0.0);
        
    // y5 //
    var deg_b4y4y5 = 105;
    var rad_b4y4y5 = deg_b4y4y5/180*Math.PI;

    var y4y5_X = (Math.cos(-rad_b4y4y5)*(b4.x - y4.x) - Math.sin(-rad_b4y4y5)*(b4.y - y4.y)) * y4y5 / b4y4 + y4.x;
    var y4y5_Y = (Math.sin(-rad_b4y4y5)*(b4.x - y4.x) + Math.cos(-rad_b4y4y5)*(b4.y - y4.y)) * y4y5 / b4y4 + y4.y;

    var y5 = new THREE.Vector3(y4y5_X, y4y5_Y, 0.0);

    //-------------------------



    // w1 // target
    var w1 = new THREE.Vector3(y4.x, y4.y, -1.5);

    target.position.set(w1.x*factor, w1.y*factor, w1.z*factor);

    //target.position.set(y4.x*factor, y4.y*factor, -1.5*factor);
 
//    hide for test of rotation b4-y4-w1 (16.nov.2014)
//    // two target vectors :: a-> is y4y3, b-> is y4w1
//    var a = new THREE.Vector3((y3.x-y4.x), (y3.y-y4.y), (y3.z-y4.z));
//    //var b = new THREE.Vector3(0, 0, -1.5);
//    var b = new THREE.Vector3((w1.x-y4.x), (w1.y-y4.y), (w1.z-y4.z));

//    // start of the inner product (the calculation of the angle of rotation)
//    // calculation by ourselves (for analysis)
//    var rad_y3y4w1 = Math.acos( (a.x*b.x + a.y*b.y + a.z*b.z) / (Math.sqrt( Math.pow(a.x,2) + Math.pow(a.y,2) + Math.pow(a.z,2) ) * Math.sqrt( Math.pow(b.x,2) + Math.pow(b.y,2) + Math.pow(b.z,2) )) );
//    // var rad_y3y4w1 = Math.acos(a.dot(b)); // / (up.length() * normalAxis.length());

//    // start of the cross vectors (the calculation of the normal vector or axis of rotation)
//    // calculation by ourselves (for analysis)
//    var nor_y3y4w1 = new THREE.Vector3((a.y*b.z - b.y*a.z), (a.z*b.x - b.z*a.x), (a.x*b.y - b.x*a.y)).normalize();
//    // var nor_y3y4w1 = new THREE.Vector3().crossVectors(a, b).normalize();

//    var q = new THREE.Quaternion().setFromAxisAngle(nor_y3y4w1, rad_y3y4w1);

    // for b4-y4-w1…
    // two target vectors :: a-> is y4b4, b-> is y4w1
    var a = new THREE.Vector3((b4.x-y4.x), (b4.y-y4.y), (b4.z-y4.z));
    var b = new THREE.Vector3((w1.x-y4.x), (w1.y-y4.y), (w1.z-y4.z));

    // start of the inner product (the calculation of the angle of rotation)
    // calculation by ourselves (for analysis)
    var rad_b4y4w1 = Math.acos( (a.x*b.x + a.y*b.y + a.z*b.z) / (Math.sqrt( Math.pow(a.x,2) + Math.pow(a.y,2) + Math.pow(a.z,2) ) * Math.sqrt( Math.pow(b.x,2) + Math.pow(b.y,2) + Math.pow(b.z,2) )) );

    // another method with a help of class of Three.js (same result)
    // var rad_b4y4w1 = Math.acos(a.dot(b)); // / (up.length() * normalAxis.length());

    // start of the cross vectors (the calculation of the normal vector or axis of rotation)

    // calculation by ourselves (for analysis)
    var nor_b4y4w1 = new THREE.Vector3((a.y*b.z - b.y*a.z), (a.z*b.x - b.z*a.x), (a.x*b.y - b.x*a.y)).normalize();

    // another method with a help of class of Three.js (same result)
    // var nor_b4y4w1 = new THREE.Vector3().crossVectors(a, b).normalize();

    var q = new THREE.Quaternion().setFromAxisAngle(nor_b4y4w1, rad_b4y4w1);

    //meshs.y4.rotation.setFromQuaternion(q);
    meshs.y4.quaternion.copy(q);


    // _____ POSITION _____
    
    meshs.a1.position.set(a1.x*factor, a1.y*factor, 7);
    meshs.a2.position.set(a2.x*factor, a2.y*factor, -7);

    meshs.b0.position.set(b0.x*factor, b0.y*factor, -7);
    
    meshs.b1.position.set(b1.x*factor, b1.y*factor, -7);
    meshs.b2.position.set(b2.x*factor, b2.y*factor, 7);
    meshs.b3.position.set(b3.x*factor, b3.y*factor, 7);
    meshs.b4.position.set(b4.x*factor, b4.y*factor, 0.0);

    meshs.y1.position.set(y1.x*factor, y1.y*factor, 7);
    meshs.y2.position.set(y2.x*factor, y2.y*factor, 7);
    meshs.y3.position.set(y3.x*factor, y3.y*factor, 7);
    meshs.y4.position.set(y4.x*factor, y4.y*factor, 7);
    meshs.y5.position.set(y5.x*factor, y5.y*factor, 0.0);

    meshs.o1.position.set(o1.x*factor, o1.y*factor, 7);
    meshs.o2.position.set(o2.x*factor, o2.y*factor, 7);
    meshs.o3.position.set(o3.x*factor, o3.y*factor, 0.0);
    meshs.o4.position.set(o4.x*factor, o4.y*factor, -7);

    // _____ ROTATION _____

    var angle_A = rad_a3a2a1-rad_allb1a3b0-rad_allb1a2b0-rad_allb1y1b0+rad_a2y1b1+rad_a1a2y1;
    var angle_B = angle_A-rad_b1y1y2;
    var angle_C = angle_B-rad_y1y2o1-rad_b2y2o1;
    var angle_D = -rad_b2y2y3-rad_y2y3o2+rad_b3y3o2;
    var angle_E = -rad_b3y3y4+rad_y3y4o3-rad_b4y4o3;
    var angle_F = angle_C+angle_D-rad_b3y3y4;

    //meshs.a1.rotation.z = Math.PI-rad_a2a1b1;
    meshs.a1.rotation.z = -rad_a2a1b0 + Math.PI;
    meshs.a2.rotation.z = -rad_allb1a3b0 + rad_a0a3a2 + Math.PI;
    
    meshs.b1.rotation.z = angle_A;
    meshs.b2.rotation.z = angle_C-rad_y2b2o1-Math.PI;
    meshs.b3.rotation.z = angle_C+angle_D+rad_y3b3o2;   
    meshs.b4.rotation.z = angle_C+angle_D+angle_E-rad_y4b4o3-Math.PI;

    meshs.o1.rotation.z = rad_a3a2a1-rad_allb1a3b0-rad_allb1a2b0-rad_y1a2o1+rad_a1a2y1+Math.PI;
    meshs.o2.rotation.z = angle_B-rad_y1y2o2+Math.PI;
    meshs.o3.rotation.z = angle_C-rad_b2y2y3-rad_y2y3o3;
    meshs.o4.rotation.z = angle_C+angle_D-rad_y3y4o4;//+Math.PI;

    meshs.y1.rotation.z = rad_a3a2a1-rad_allb1a3b0-rad_allb1a2b0+rad_a1a2y1+Math.PI;
    meshs.y2.rotation.z = angle_B;
    meshs.y3.rotation.z = angle_C-rad_b2y2y3-Math.PI;

//for test of rotation b4-y4-w1 (line 308-325)
//    meshs.y4.rotation.z += angle_F;
    meshs.y4.rotation.z += angle_C+angle_D+angle_E;

    meshs.y5.rotation.z = angle_C+angle_D+angle_E-rad_b4y4y5-Math.PI;


    // apply new position to each label
    var i = points.length, name;
    while(i--){
        name = points[i];
        labels[name].position.copy(meshs[name].position);
	if(name == 'a1' || name == 'a3') labels[name].position.z = -28;
	else if(name == 'a2') labels[name].position.z = -21;
    }

    // apply new position to each link
    var i = points.length, name;
    while(i--){
        name = points[i];

        if(name !== 'y4'){
            links[name].position.copy(meshs[name].position);
            links[name].rotation.copy(meshs[name].rotation);
        }else{
        	links.y4.position.copy(meshs.y4.position);
			links.y4.rotation.z = angle_F;
        }
        if(name == 'y3'|| name == 'o1' || name == 'y1'||  name == 'b4') links[name].translateZ(-7);
        if(name == 'b3' ) links[name].translateZ(-14);
        if(name == 'a1') links[name].translateZ(-21);
        if(name == 'a2') links[name].translateZ(-14);
        links[name].scale.x = (scale[i]*factor);
    }
    // y4 pivot position
    pivot.position.copy(meshs.y4.position);
    pivot.rotation.z = links.y4.rotation.z;

    // extra link b2y2
    var b2y2_scale = b2y2*factor;
    links.bx0.position.copy(meshs.b2.position);
    links.bx0.rotation.z = angle_C+Math.PI;
    links.bx0.translateZ(-14);
    links.bx0.scale.x = b2y2_scale;

    // extra link b3y3
    var b3y3_scale = b3y3*factor;
    links.bx1.position.copy(meshs.b3.position);
    links.bx1.rotation.z = angle_C+angle_D;
    links.bx1.translateZ(7);
    links.bx1.scale.x = b3y3_scale;

    // extra link b4y4
    var b4y4_scale = b4y4*factor;
    links.bx2.position.copy(meshs.b4.position);
    links.bx2.rotation.z = meshs.b4.rotation.z+rad_y4b4o3;
    links.bx2.scale.x = b4y4_scale;

    // particle points
    pp.move(ppn, target.position.x, target.position.y, target.position.z+30);
    pp.update();
    ppn++;
    if(ppn==ppmax) ppn = 0;


    inFormulEnable=true;
}

// options

function setY2(value){
    angles[0] = value;
}
function setY3(value){
    angles[1] = value;
}

function setType(){
    if(type == 0) type = 1;
    else type = 0;
    var i = hidePoints.length, name;
    if(type == 1 ){
        b1.text('type 1');
        while(i--){
            name = hidePoints[i];
            meshs[name].visible = false;
            labels[name].visible = false;
            links[name].visible = false;
        }
        links.a2.visible = false;
        links.o1.visible = false;
        links.bx0.visible = false;
    }else{
        b1.text('type 0');
        while(i--){
            name = hidePoints[i];
            meshs[name].visible = true;
            labels[name].visible = true;
            links[name].visible = true;
        }
        links.a2.visible = true;
        links.o1.visible = true;
        links.bx0.visible = true;
    }
}

function setFormule(){
    if(formule == 0) formule = 1;
    else formule = 0;
    var i = extraPoints.length, name;
    if(formule == 1 ){
        b2.text('Advanced');
        while(i--){
            name = extraPoints[i];
            meshs[name].visible = true;
            labels[name].visible = true;
            links[name].visible = true;
        }
        links.bx2.visible = true;
    } else {
        b2.text('Simple');
        while(i--){
            name = extraPoints[i];
            meshs[name].visible = false;
            labels[name].visible = false;
            links[name].visible = false;
        }
        links.bx2.visible = false;
    }
}
