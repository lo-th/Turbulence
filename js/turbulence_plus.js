var Turbulence = {};

Turbulence.ToRad = Math.PI / 180;
Turbulence.ToDeg = 180 / Math.PI;
Turbulence.Pi = Math.PI;
Turbulence.R360 = Math.PI * 2;
Turbulence.R90 = Math.PI / 2;

Turbulence.Formula = function(){
	// in radian
	this.rotation = 0;

    this.endQuaternion = new Turbulence.Quat();
    this.endQuaternion2 = new Turbulence.Quat();
    //this.endRotation = new Turbulence.Euler();

	this.points = {};
	this.angles = {};
	this.sizes = {};
    this.rot = {};
    this.ta = {};
   // this.pNames = ['a1','a2','b1','b2','b3','y1','y2','y3','y4','y4a','o1','o2','o3','o4','b4','y5'];
    this.pNames = ['a1','a2','b1','b2','b3','y1','y2','y3','y4','o1','o2','o3','o4','b4','y5'];


   // this.ya1 = new Turbulence.V3();
	this.w1 = new Turbulence.V3();

	this.looking = 'base';
	//this.target = new Turbulence.V3();

	
	// point definition
	var names = this.pNames;
	for(var i=0; i<names.length; i++){
		this.points[names[i]] = new Turbulence.V3();
	};
	// angle definition in radian
	names = ['a1a2b1','a1a2b1','y1a2b1','y1a2o1','b1y1y2','y2y1o1','b2y2o1','y1y2o1','y2b2o1','y1y2o2','b2y2y3','y3y2o2','b3y3o2','y2y3o2','y3b3o2','b3y3y4',
    'y2y3o3', 'y4y3o3', 'b4y4o3', 'y3y4o3', 'y4b4o3', 'y3y4o4', 'b4y4y5', 'y3y4w1'
    ];
	for(var i=0; i<names.length; i++){
		this.angles[names[i]] = 0;
	};
	// size definition   static : sizes.length - 4
	names = ['a1b1','a1a2','b1y1','b2o1','b3o2','a2y1','y1y2','y2y3','y3y4','a2o1','y2o2','y3o3','y4o4', 'b4o3', 'y4y5',
    'b2y2','b3y3', 'a1o1', 'a2b1','y2o1','y3o2', 'y4o3', 'b4y4'
    ];
	for(var i=0; i<names.length; i++){
		this.sizes[names[i]] = 0;
	};
    // final rotation list
    names = ['a','b','c','d','e','f'];
    for(var i=0; i<names.length; i++){
        this.rot[names[i]] = 0;
    };
    // final target list
    names = ['a','b','c'];
    for(var i=0; i<names.length; i++){
        this.ta[names[i]] = new Turbulence.V3();
    };

    // extra links rotation
    this.exr = [0,0,0];

	
	this.init();
	//this.init(0.01, 2, 270);
	//this.init(0.01, 2, 130);
}

Turbulence.Formula.prototype = {
    constructor: Turbulence.Formula,
    init:function(A,C,R){

    	this.R = R*Turbulence.ToRad || Turbulence.Pi;// default 180
		this.A = A || 1.0;
		var s = this.sizes;
		// static size
		s.a1b1 = this.A * 0.5;
		s.a2o1 = s.a2y1 = s.b1y1 = this.A;
		s.a1o1 = (this.A - s.a1b1);
		s.a1a2 = Math.sqrt(Math.pow(s.a1o1,2) + Math.pow(s.a2o1,2));
		this.B = (Math.pow(s.a2y1,2) + Math.pow(s.a2o1,2));
		s.y1o1 = s.b2y2 = Math.sqrt(this.B);
		this.C = C || this.B;
		s.y2o2 = s.b3y3 = s.y3o3 = s.y4o4 = s.y4y5 = s.b4y4 = Math.sqrt(this.C);
		s.y1y2 = s.b2o1 = s.y2y3 = s.b3o2 = s.y3y4 = s.b4o3 = this.C + Math.sqrt(this.C);

        this.sizer = [s.a1b1,s.a1a2,s.b1y1,s.b2o1,s.b3o2,s.a2y1,s.y1y2,s.y2y3,s.y3y4,s.a2o1,s.y2o2,s.y3o3,s.y4o4,s.b4o3,s.y4y5,
                      s.b2y2, s.b3y3, s.b4y4];
        this.angleDeg = {
        	b1y1y2 : 135,
        	y3y4o4 : 180,
        	b4y4y5 : 105
        }

    },
    setW1:function(v){
    	this.w1.set(v.x, v.y, v.z);
    	this.looking = 'advanced';
    },
    run:function(){

        var pi = Turbulence.Pi;

    	var p = this.points;
    	var s = this.sizes;
    	var r = this.angles;
        var a = this.rot;
        var w = this.ta;

    	r.a2a1b1 = Math.PI- Math.atan(s.a2o1/s.a1o1) - this.rotation;
    	s.a2b1 = Math.sqrt((Math.pow(s.a1a2,2)) - 2*s.a1a2*s.a1b1*Math.cos(r.a2a1b1) + (Math.pow(s.a1b1,2)));

        var tmp = new Turbulence.Cross();

    	// a2
    	// all to zero

    	// a1
    	p.a1.x = s.a1a2;

    	// b1
    	r.a1a2b1 = Math.asin(s.a1b1*Math.sin(r.a2a1b1) / s.a2b1);
    	p.b1.x = (s.a1a2 - s.a1b1*Math.cos(r.a2a1b1));
    	p.b1.y = (s.a1b1*Math.sin(r.a2a1b1));

    	// y1
    	r.y1a2b1 = Math.acos((Math.pow(s.a2b1,2) + Math.pow(s.a2y1,2) - Math.pow(s.b1y1,2)) / (2*s.a2b1*s.a2y1));

    	//p.y1.x = (Math.cos(r.y1a2b1)*( p.b1.x - p.a2.x ) - Math.sin(r.y1a2b1)*( p.b1.y - p.a2.x ) ) * s.a2y1 / s.a2b1 +  p.a2.x;
    	//p.y1.y = (Math.sin(r.y1a2b1)*( p.b1.x - p.a2.x ) + Math.cos(r.y1a2b1)*( p.b1.y - p.a2.x ) ) * s.a2y1 / s.a2b1 +  p.a2.x;
        tmp.set( p.b1 , p.a2 );
        p.y1.x = (Math.cos(r.y1a2b1) * tmp.x - Math.sin(r.y1a2b1) * tmp.y ) * s.a2y1 / s.a2b1 +  p.a2.x;
        p.y1.y = (Math.sin(r.y1a2b1) * tmp.x + Math.cos(r.y1a2b1) * tmp.y ) * s.a2y1 / s.a2b1 +  p.a2.x;

    	// --- for object rotation
    	r.a1a2y1 = r.y1a2b1 + r.a1a2b1;
    	r.a2y1b1 = Math.acos( ((p.a2.x - p.y1.x)*(p.b1.x - p.y1.x) + (p.a2.y - p.y1.y)*(p.b1.y - p.y1.y)) / (Math.sqrt(Math.pow((p.a2.x - p.y1.x),2) + Math.pow((p.a2.y - p.y1.y),2)) * Math.sqrt(Math.pow((p.b1.x - p.y1.x),2) + Math.pow((p.b1.y - p.y1.y),2)) ) );

    	// o1
    	r.y1a2o1 = Turbulence.R90;// 90
    	p.o1.x = (Math.cos(-r.y1a2o1)*p.y1.x - Math.sin(-r.y1a2o1)*p.y1.y) * s.a2o1 / s.a2y1;
    	p.o1.y = (Math.sin(-r.y1a2o1)*p.y1.x + Math.cos(-r.y1a2o1)*p.y1.y) * s.a2o1 / s.a2y1;

    	// y2
    	r.b1y1y2 = this.angleDeg.b1y1y2*Turbulence.ToRad;
    	//p.y2.x = (Math.cos(-r.b1y1y2)*( p.b1.x - p.y1.x ) - Math.sin(-r.b1y1y2)*(p.b1.y - p.y1.y )) * s.y1y2 / s.b1y1 + p.y1.x;
    	//p.y2.y = (Math.sin(-r.b1y1y2)*( p.b1.x - p.y1.x ) + Math.cos(-r.b1y1y2)*(p.b1.y - p.y1.y )) * s.y1y2 / s.b1y1 + p.y1.y;
        tmp.set( p.b1 , p.y1 );
        p.y2.x = (Math.cos(-r.b1y1y2) * tmp.x - Math.sin(-r.b1y1y2) * tmp.y ) * s.y1y2 / s.b1y1 + p.y1.x;
        p.y2.y = (Math.sin(-r.b1y1y2) * tmp.x + Math.cos(-r.b1y1y2) * tmp.y ) * s.y1y2 / s.b1y1 + p.y1.y;

    	// b2
    	r.y2y1o1 = Math.acos(((p.y2.x - p.y1.x)*(p.o1.x - p.y1.x) + (p.y2.y - p.y1.y)*(p.o1.y - p.y1.y))/(s.y1y2 * s.y1o1));
    	s.y2o1 = Math.sqrt((Math.pow(s.y1y2,2)) - 2*s.y1y2*s.y1o1*Math.cos(r.y2y1o1) + (Math.pow(s.y1o1,2)));
    	r.b2y2o1 = Math.acos((Math.pow(s.y2o1,2) + Math.pow(s.b2y2,2) - Math.pow(s.b2o1,2)) / (2*s.y2o1*s.b2y2));

    	//p.b2.x = (Math.cos(-r.b2y2o1)*(p.o1.x - p.y2.x) - Math.sin(-r.b2y2o1)*(p.o1.y - p.y2.y) ) * s.b2y2 / s.y2o1  + p.y2.x;
    	//p.b2.y = (Math.sin(-r.b2y2o1)*(p.o1.x - p.y2.x) + Math.cos(-r.b2y2o1)*(p.o1.y - p.y2.y) ) * s.b2y2 / s.y2o1  + p.y2.y;
        tmp.set( p.o1 , p.y2 );
        p.b2.x = (Math.cos(-r.b2y2o1) * tmp.x - Math.sin(-r.b2y2o1) * tmp.y ) * s.b2y2 / s.y2o1  + p.y2.x;
        p.b2.y = (Math.sin(-r.b2y2o1) * tmp.x + Math.cos(-r.b2y2o1) * tmp.y ) * s.b2y2 / s.y2o1  + p.y2.y;

    	// --- for object rotation
    	//r.y1y2o1 = Math.acos( ((p.y1.x - p.y2.x)*(p.o1.x - p.y2.x) + (p.y1.y - p.y2.y)*(p.o1.y - p.y2.y)) / (Math.sqrt(Math.pow((p.y1.x - p.y2.x),2) + Math.pow((p.y1.y - p.y2.y),2)) * Math.sqrt(Math.pow((p.o1.x - p.y2.x),2) + Math.pow((p.o1.y - p.y2.y),2)) ) );
    	r.y1y2o1 = Math.acos( ((p.y1.x - p.y2.x)*tmp.x + (p.y1.y - p.y2.y)*tmp.y ) / (Math.sqrt(Math.pow((p.y1.x - p.y2.x),2) + Math.pow((p.y1.y - p.y2.y),2)) * Math.sqrt(Math.pow(tmp.x,2) + Math.pow(tmp.y,2)) ) );
        r.y2b2o1 = Math.acos( ((p.y2.x - p.b2.x)*(p.o1.x - p.b2.x) + (p.y2.y - p.b2.y)*(p.o1.y - p.b2.y)) / (Math.sqrt(Math.pow((p.y2.x - p.b2.x),2) + Math.pow((p.y2.y - p.b2.y),2)) * Math.sqrt(Math.pow((p.o1.x - p.b2.x),2) + Math.pow((p.o1.y - p.b2.y),2)) ) );


    	// o2
    	r.y1y2o2 = pi;// 180
    	//p.o2.x = (Math.cos(-r.y1y2o2)*(p.y1.x - p.y2.x) - Math.sin(-r.y1y2o2)*(p.y1.y - p.y2.y)) * s.y2o2 / s.y1y2 + p.y2.x;
    	//p.o2.y = (Math.sin(-r.y1y2o2)*(p.y1.x - p.y2.x) + Math.cos(-r.y1y2o2)*(p.y1.y - p.y2.y)) * s.y2o2 / s.y1y2 + p.y2.y;
        tmp.set( p.y1 , p.y2 );
        p.o2.x = (Math.cos(-r.y1y2o2) * tmp.x - Math.sin(-r.y1y2o2) * tmp.y ) * s.y2o2 / s.y1y2 + p.y2.x;
        p.o2.y = (Math.sin(-r.y1y2o2) * tmp.x + Math.cos(-r.y1y2o2) * tmp.y ) * s.y2o2 / s.y1y2 + p.y2.y;

    	// y3
    	r.b2y2y3 = pi;// 180
    	//p.y3.x = (Math.cos(-r.b2y2y3)*(p.b2.x - p.y2.x) - Math.sin(-r.b2y2y3)*(p.b2.y - p.y2.y)) * s.y2y3 / s.b2y2 + p.y2.x;
    	//p.y3.y = (Math.sin(-r.b2y2y3)*(p.b2.x - p.y2.x) + Math.cos(-r.b2y2y3)*(p.b2.y - p.y2.y)) * s.y2y3 / s.b2y2 + p.y2.y;
        tmp.set( p.b2 , p.y2 );
        p.y3.x = (Math.cos(-r.b2y2y3) * tmp.x - Math.sin(-r.b2y2y3) * tmp.y) * s.y2y3 / s.b2y2 + p.y2.x;
        p.y3.y = (Math.sin(-r.b2y2y3) * tmp.x + Math.cos(-r.b2y2y3) * tmp.y) * s.y2y3 / s.b2y2 + p.y2.y;

    	// b3
    	r.y3y2o2 = Math.acos(((p.y3.x - p.y2.x)*(p.o2.x - p.y2.x) + (p.y3.y - p.y2.y)*(p.o2.y - p.y2.y))/(s.y2y3 * s.y2o2));
    	s.y3o2 = Math.sqrt((Math.pow(s.y2y3,2)) - 2*s.y2y3*s.y2o2*Math.cos(r.y3y2o2) + (Math.pow(s.y2o2,2)));
    	r.b3y3o2 = Math.acos((Math.pow(s.y3o2,2) + Math.pow(s.b3y3,2) - Math.pow(s.b3o2,2)) / (2*s.y3o2*s.b3y3));

    	//p.b3.x = (Math.cos(r.b3y3o2)*(p.o2.x - p.y3.x) - Math.sin(r.b3y3o2)*(p.o2.y - p.y3.y) ) * s.b3y3 / s.y3o2  + p.y3.x;
    	//p.b3.y = (Math.sin(r.b3y3o2)*(p.o2.x - p.y3.x) + Math.cos(r.b3y3o2)*(p.o2.y - p.y3.y) ) * s.b3y3 / s.y3o2  + p.y3.y;
        tmp.set( p.o2 , p.y3 );
        p.b3.x = (Math.cos(r.b3y3o2) * tmp.x - Math.sin(r.b3y3o2) * tmp.y ) * s.b3y3 / s.y3o2  + p.y3.x;
        p.b3.y = (Math.sin(r.b3y3o2) * tmp.x + Math.cos(r.b3y3o2) * tmp.y ) * s.b3y3 / s.y3o2  + p.y3.y;

    	// --- for object rotation
    	//r.y2y3o2 = Math.acos( ((p.y2.x - p.y3.x)*(p.o2.x - p.y3.x) + (p.y2.y - p.y3.y)*(p.o2.y - p.y3.y)) / (Math.sqrt(Math.pow((p.y2.x - p.y3.x),2) + Math.pow((p.y2.y - p.y3.y),2)) * Math.sqrt(Math.pow((p.o2.x - p.y3.x),2) + Math.pow((p.o2.y - p.y3.y),2)) ) );
        r.y2y3o2 = Math.acos( ((p.y2.x - p.y3.x)*tmp.x + (p.y2.y - p.y3.y)*tmp.y) / (Math.sqrt(Math.pow((p.y2.x - p.y3.x),2) + Math.pow((p.y2.y - p.y3.y),2)) * Math.sqrt(Math.pow(tmp.x,2) + Math.pow(tmp.y,2)) ) );
    	r.y3b3o2 = Math.acos( ((p.y3.x - p.b3.x)*(p.o2.x - p.b3.x) + (p.y3.y - p.b3.y)*(p.o2.y - p.b3.y)) / (Math.sqrt(Math.pow((p.y3.x - p.b3.x),2) + Math.pow((p.y3.y - p.b3.y),2)) * Math.sqrt(Math.pow((p.o2.x - p.b3.x),2) + Math.pow((p.o2.y - p.b3.y),2)) ) );

    	// y4
    	r.b3y3y4 = this.R; 
    	//p.y4.x = (Math.cos(-r.b3y3y4)*(p.b3.x - p.y3.x) - Math.sin(-r.b3y3y4)*(p.b3.y - p.y3.y)) * s.y3y4 / s.b3y3 + p.y3.x;
    	//p.y4.y = (Math.sin(-r.b3y3y4)*(p.b3.x - p.y3.x) + Math.cos(-r.b3y3y4)*(p.b3.y - p.y3.y)) * s.y3y4 / s.b3y3 + p.y3.y;
        tmp.set( p.b3 , p.y3 );
        p.y4.x = (Math.cos(-r.b3y3y4) * tmp.x - Math.sin(-r.b3y3y4) * tmp.y ) * s.y3y4 / s.b3y3 + p.y3.x;
        p.y4.y = (Math.sin(-r.b3y3y4) * tmp.x + Math.cos(-r.b3y3y4) * tmp.y ) * s.y3y4 / s.b3y3 + p.y3.y;

        //----------------------------------------

        // o3
        r.y2y3o3 = pi;// 180
        //p.o3.x = (Math.cos(-r.y2y3o3)*(p.y2.x - p.y3.x) - Math.sin(-r.y2y3o3)*(p.y2.y - p.y3.y)) * s.y3o3 / s.y2y3 + p.y3.x;
        //p.o3.y = (Math.sin(-r.y2y3o3)*(p.y2.x - p.y3.x) + Math.cos(-r.y2y3o3)*(p.y2.y - p.y3.y)) * s.y3o3 / s.y2y3 + p.y3.y;
        tmp.set( p.y2 , p.y3 );
        p.o3.x = (Math.cos(-r.y2y3o3) * tmp.x - Math.sin(-r.y2y3o3) * tmp.y ) * s.y3o3 / s.y2y3 + p.y3.x;
        p.o3.y = (Math.sin(-r.y2y3o3) * tmp.x + Math.cos(-r.y2y3o3) * tmp.y ) * s.y3o3 / s.y2y3 + p.y3.y;

        // b4
        r.y4y3o3 = Math.acos(((p.y4.x - p.y3.x)*(p.o3.x - p.y3.x) + (p.y4.y - p.y3.y)*(p.o3.y - p.y3.y))/(s.y3y4 * s.y3o3));
        s.y4o3 = Math.sqrt((Math.pow(s.y3y4,2)) - 2*s.y3y4*s.y3o3*Math.cos(r.y4y3o3) + (Math.pow(s.y3o3,2)));
        r.b4y4o3 = Math.acos((Math.pow(s.y4o3,2) + Math.pow(s.b4y4,2) - Math.pow(s.b4o3,2)) / (2*s.y4o3*s.b4y4));

        //p.b4.x = (Math.cos(-r.b4y4o3)*(p.o3.x - p.y4.x) - Math.sin(-r.b4y4o3)*(p.o3.y - p.y4.y) ) * s.b4y4 / s.y4o3  + p.y4.x;
        //p.b4.y = (Math.sin(-r.b4y4o3)*(p.o3.x - p.y4.x) + Math.cos(-r.b4y4o3)*(p.o3.y - p.y4.y) ) * s.b4y4 / s.y4o3  + p.y4.y;
        tmp.set( p.o3 , p.y4 );
        p.b4.x = (Math.cos(-r.b4y4o3) * tmp.x - Math.sin(-r.b4y4o3) * tmp.y ) * s.b4y4 / s.y4o3  + p.y4.x;
        p.b4.y = (Math.sin(-r.b4y4o3) * tmp.x + Math.cos(-r.b4y4o3) * tmp.y ) * s.b4y4 / s.y4o3  + p.y4.y;

        // --- for object rotation
        //r.y3y4o3 = Math.acos( ((p.y3.x - p.y4.x)*(p.o3.x - p.y4.x) + (p.y3.y - p.y4.y)*(p.o3.y - p.y4.y)) / (Math.sqrt(Math.pow((p.y3.x - p.y4.x),2) + Math.pow((p.y3.y - p.y4.y),2)) * Math.sqrt(Math.pow((p.o3.x - p.y4.x),2) + Math.pow((p.o3.y - p.y4.y),2))) );
        //r.y4b4o3 = Math.acos( ((p.y4.x - p.b4.x)*(p.o3.x - p.b4.x) + (p.y4.y - p.b4.y)*(p.o3.y - p.b4.y)) / (Math.sqrt(Math.pow((p.y4.x - p.b4.x),2) + Math.pow((p.y4.y - p.b4.y),2)) * Math.sqrt(Math.pow((p.o3.x - p.b4.x),2) + Math.pow((p.o3.y - p.b4.y),2))) );

	r.y3y4o3 = Math.acos( ((p.y3.x - p.y4.x)*tmp.x + (p.y3.y - p.y4.y)*tmp.y) / (Math.sqrt(Math.pow((p.y3.x - p.y4.x),2) + Math.pow((p.y3.y - p.y4.y),2)) * Math.sqrt(Math.pow(tmp.x,2) + Math.pow(tmp.y,2))) );
	r.y4b4o3 = Math.acos( ((p.y4.x - p.b4.x)*tmp.x + (p.y4.y - p.b4.y)*tmp.y) / (Math.sqrt(Math.pow((p.y4.x - p.b4.x),2) + Math.pow((p.y4.y - p.b4.y),2)) * Math.sqrt(Math.pow(tmp.x,2) + Math.pow(tmp.y,2))) );
	
        // o4
        r.y3y4o4 = this.angleDeg.y3y4o4*Turbulence.ToRad;

        //p.o4.x = (Math.cos(-r.y3y4o4)*(p.y3.x - p.y4.x) - Math.sin(-r.y3y4o4)*(p.y3.y - p.y4.y)) * s.y4o4 / s.y3y4 + p.y4.x;
        //p.o4.y = (Math.sin(-r.y3y4o4)*(p.y3.x - p.y4.x) + Math.cos(-r.y3y4o4)*(p.y3.y - p.y4.y)) * s.y4o4 / s.y3y4 + p.y4.y;
        tmp.set( p.y3 , p.y4 );
        p.o4.x = (Math.cos(-r.y3y4o4) * tmp.x - Math.sin(-r.y3y4o4)* tmp.y ) * s.y4o4 / s.y3y4 + p.y4.x;
        p.o4.y = (Math.sin(-r.y3y4o4) * tmp.x + Math.cos(-r.y3y4o4)* tmp.y ) * s.y4o4 / s.y3y4 + p.y4.y;
        
        // y5
        r.b4y4y5 = this.angleDeg.b4y4y5*Turbulence.ToRad;

        //p.y5.x = (Math.cos(-r.b4y4y5)*(p.b4.x - p.y4.x) - Math.sin(-r.b4y4y5)*(p.b4.y - p.y4.y)) * s.y4y5 / s.b4y4 + p.y4.x;
        //p.y5.y = (Math.sin(-r.b4y4y5)*(p.b4.x - p.y4.x) + Math.cos(-r.b4y4y5)*(p.b4.y - p.y4.y)) * s.y4y5 / s.b4y4 + p.y4.y;
        tmp.set( p.b4 , p.y4 );
        p.y5.x = (Math.cos(-r.b4y4y5) * tmp.x - Math.sin(-r.b4y4y5) * tmp.y ) * s.y4y5 / s.b4y4 + p.y4.x;
        p.y5.y = (Math.sin(-r.b4y4y5) * tmp.x + Math.cos(-r.b4y4y5) * tmp.y ) * s.y4y5 / s.b4y4 + p.y4.y;

	// extra rotation 2 (y5y4w1)-------------------

        if(this.looking == 'base')this.w1.set(p.y4.x, p.y4.y, -1.5);

        w.a.set( p.y5.x-p.y4.x, p.y5.y-p.y4.y, p.y5.z-p.y4.z );
        w.b.set( this.w1.x-p.y4.x, this.w1.y-p.y4.y, this.w1.z-p.y4.z );

        r.y5y4w1 = Math.acos( (w.a.x*w.b.x + w.a.y*w.b.y + w.a.z*w.b.z) / (Math.sqrt( Math.pow(w.a.x,2) + Math.pow(w.a.y,2) + Math.pow(w.a.z,2) ) * Math.sqrt( Math.pow(w.b.x,2) + Math.pow(w.b.y,2) + Math.pow(w.b.z,2) )) );
        w.c.set( w.a.y*w.b.z - w.b.y*w.a.z ,  w.a.z*w.b.x - w.b.z*w.a.x , w.a.x*w.b.y - w.b.x*w.a.y );

        this.endQuaternion2.setFromAxisAngle(w.c.normalize(), r.y5y4w1);
        //this.endRotation.setFromQuaternion(this.endQuaternion);
        //p.y4.r = rr.z;


        // extra rotation --------------------

//        if(this.looking == 'base')this.w1.set(p.y4.x, p.y4.y, -1.5);

        w.a.set( p.y3.x-p.y4.x, p.y3.y-p.y4.y, p.y3.z-p.y4.z );
        w.b.set( this.w1.x-p.y4.x, this.w1.y-p.y4.y, this.w1.z-p.y4.z );

        r.y3y4w1 = Math.acos( (w.a.x*w.b.x + w.a.y*w.b.y + w.a.z*w.b.z) / (Math.sqrt( Math.pow(w.a.x,2) + Math.pow(w.a.y,2) + Math.pow(w.a.z,2) ) * Math.sqrt( Math.pow(w.b.x,2) + Math.pow(w.b.y,2) + Math.pow(w.b.z,2) )) );
        w.c.set( w.a.y*w.b.z - w.b.y*w.a.z ,  w.a.z*w.b.x - w.b.z*w.a.x , w.a.x*w.b.y - w.b.x*w.a.y );

        this.endQuaternion.setFromAxisAngle(w.c.normalize(), r.y3y4w1);
        //this.endRotation.setFromQuaternion(this.endQuaternion);
        //p.y4.r = rr.z;

	
        // final rotation -------------------

        a.a = r.a2y1b1 + r.a1a2y1;
        a.b = a.a - r.b1y1y2;
        a.c = a.b - r.y1y2o1-r.b2y2o1;
        a.d = -r.b2y2y3 - r.y2y3o2 + r.b3y3o2;
        a.e = -r.b3y3y4 + r.y3y4o3 - r.b4y4o3;
        a.f = a.c + a.d - r.b3y3y4;

        // apply rotation
        p.a1.r = -r.a2a1b1 + pi;
        p.b1.r = a.a;
        p.b2.r = a.c - r.y2b2o1 - pi;
        p.b3.r = a.c + a.d + r.y3b3o2;   
        p.b4.r = a.c + a.d + a.e - r.y4b4o3 - pi;
        p.o1.r = -r.y1a2o1 + r.a1a2y1 + pi;
        p.o2.r = a.b - r.y1y2o2 + pi;
        p.o3.r = a.c - r.b2y2y3 - r.y2y3o3;
        p.o4.r = a.c + a.d - r.y3y4o4;//a.f + r.y3y4o4 + pi;
        p.y1.r = r.a1a2y1 + pi;
        p.y2.r = a.b;
        p.y3.r = a.c - r.b2y2y3 - pi;
        p.y4.r = a.f;
        p.y4.r2 = a.c + a.d + a.e;
	//p.y4a.r = a.c + a.d + a.e;
        p.y5.r = a.c + a.d + a.e - r.b4y4y5 - pi;

        // extra rotation
        this.exr[0] = a.c+ pi;
        this.exr[1] = a.c + a.d;
        this.exr[2] = p.b4.r + r.y4b4o3;

        // extra decal Z
        p.b4.z = p.o3.z = p.y5.z = -0.35;
        p.b1.z = p.o4.z = -0.7;
    
    }
}


Turbulence.Cross =function(){
    this.x = 0;
    this.y = 0;
}
Turbulence.Cross.prototype = {
    constructor: Turbulence.Cross,
    set:function(p1, p2){
        this.x = p1.x - p2.x;
        this.y = p1.y - p2.y;
    }
}



// simple Vector 3d
Turbulence.V3 = function(x,y,z,r,r2){
	this.x = x || 0;
	this.y = y || 0;
	this.z = z || 0;
    // extra rotation
    this.r = r || 0;
    this.r2 = r2 || 0;
}
Turbulence.V3.prototype = {
    constructor: Turbulence.V3,
    set:function(x,y,z,r,r2){
    	this.x = x || 0;
    	this.y = y || 0;
    	this.z = z || 0;
        // extra rotation
        this.r = r || 0;
        this.r2 = r2 || 0;
    },
    normalize:function(){
        var scalar = Math.sqrt( this.x * this.x + this.y * this.y + this.z * this.z );

        if ( scalar !== 0 ) {
            var invScalar = 1 / scalar;
            this.x *= invScalar;
            this.y *= invScalar;
            this.z *= invScalar;
        } else {
            this.x = 0;
            this.y = 0;
            this.z = 0;
        }
        return this;
    }
}


// simple quaternion
Turbulence.Quat = function ( x, y, z, w ) {
    this.x = x || 0;
    this.y = y || 0;
    this.z = z || 0;
    this.w = ( w !== undefined ) ? w : 1;
};
Turbulence.Quat.prototype = {
    constructor: Turbulence.Quat,
    setFromAxisAngle: function ( axis, angle ) {
        var halfAngle = angle / 2, s = Math.sin( halfAngle );
        this.x = axis.x * s;
        this.y = axis.y * s;
        this.z = axis.z * s;
        this.w = Math.cos( halfAngle );
    }
}

// simple rotation
/*Turbulence.Euler = function ( x, y, z ) {
    this.x = x || 0;
    this.y = y || 0;
    this.z = z || 0;
};
Turbulence.Euler.prototype = {
    constructor: Turbulence.Euler,
    setFromQuaternion: function ( q ) {
        var sqx = q.x * q.x;
        var sqy = q.y * q.y;
        var sqz = q.z * q.z;
        var sqw = q.w * q.w;

        this.x = Math.atan2( 2 * ( q.x * q.w - q.y * q.z ), ( sqw - sqx - sqy + sqz ) );
        this.y = Math.asin(  this.clamp( 2 * ( q.x * q.z + q.y * q.w ), - 1, 1 ) );
        this.z = Math.atan2( 2 * ( q.z * q.w - q.x * q.y ), ( sqw + sqx - sqy - sqz ) );
        return this;
    },
    clamp: function ( x, a, b ) {
        return ( x < a ) ? a : ( ( x > b ) ? b : x );
    }
}*/
