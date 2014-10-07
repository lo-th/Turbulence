var Turbulence = {};

Turbulence.ToRad = Math.PI / 180;
Turbulence.ToDeg = 180 / Math.PI;
Turbulence.Pi = Math.PI;
Turbulence.R360 = Math.PI * 2;
Turbulence.R90 = Math.PI / 2;

Turbulence.Formula = function(){
	// in radian
	this.rotation = 0;

	this.points = {};
	this.sizes = {};
	this.angles = {};

	// point definition
	var names = ['a1','a2','b1','b2','b3','y1','y2','y3','y4','o1','o2'];
	for(var i=0; i<names.length; i++){
		this.points[names[i]] = new Turbulence.V3()
	};
	// size definition   static : sizes.length - 4
	names = ['a1b1','a1a2','b1y1','b2o1','b3o2','a2y1','y1y2','y2y3','y3y4','a2o1','y2o2','b2y2','b3y3','a1o1','a2b1','y2o1','y3o2'];
	for(var i=0; i<names.length; i++){
		this.sizes[names[i]] = 0;
	};
	// angle definition in radian
	names = ['a1a2b1','a1a2b1','y1a2b1','y1a2o1','b1y1y2','y2y1o1','b2y2o1','y1y2o1','y2b2o1','y1y2o2','b2y2y3','y3y2o2','b3y3o2','y2y3o2','y3b3o2','b3y3y4'];
	for(var i=0; i<names.length; i++){
		this.angles[names[i]] = 0;
	};

	var A = 1.0;
	var s = this.sizes;
	// static size
	s.a1b1 = A * 0.5;
	s.a2o1 = s.a2y1 = s.b1y1 = A;
	s.a1o1 = (A - s.a1b1);
	s.a1a2 = Math.sqrt(Math.pow(s.a1o1,2) + Math.pow(s.a2o1,2));
	var B = (Math.pow(s.a2y1,2) + Math.pow(s.a2o1,2));
	s.y1o1 = s.b2y2 = Math.sqrt(B);
	var C = B;
	s.y2o2 = s.b3y3 = Math.sqrt(C);
	s.y1y2 = s.b2o1 = s.y2y3 = s.b3o2 = s.y3y4 = C + Math.sqrt(C);
}

Turbulence.Formula.prototype = {
    constructor: Turbulence.Formula,
    run:function(){
    	var p = this.points;
    	var s = this.sizes;
    	var r = this.angles;

	    r.a2a1b1 = Math.PI- Math.atan(s.a2o1/s.a1o1)- this.rotation;
	    s.a2b1 = Math.sqrt((Math.pow(s.a1a2,2)) - 2*s.a1a2*s.a1b1*Math.cos(r.a2a1b1) + (Math.pow(s.a1b1,2)));

	    // a2
	    // all to zero

	    // a1
	    p.a1.x = s.a1a2

	    // b1
	    r.a1a2b1 = Math.asin(s.a1b1*Math.sin(r.a2a1b1) / s.a2b1);
	    p.b1.x = (a1a2 - a1b1*Math.cos(r.a2a1b1));
	    p.b1.y = (a1b1*Math.sin(r.a2a1b1));

	    // y1
	    r.y1a2b1 = Math.acos((Math.pow(s.a2b1,2) + Math.pow(s.a2y1,2) - Math.pow(s.b1y1,2)) / (2*s.a2b1*s.a2y1));
	    p.y1.x = (Math.cos(r.y1a2b1)*( p.b1.x - p.a2.x ) - Math.sin(r.y1a2b1)*( p.b1.y -  p.a2.x ) ) * s.a2y1 / s.a2b1 +  p.a2.x;
	    p.y1.y = (Math.sin(r.y1a2b1)*( p.b1.x - p.a2.x ) + Math.cos(r.y1a2b1)*( p.b1.y -  p.a2.x ) ) * s.a2y1 / s.a2b1 +  p.a2.x;

	    // for object rotation
	    r.a1a2y1 = r.y1a2b1 + r.a1a2b1;
	    r.a2y1b1 = Math.acos( ((p.a2.x - p.y1.x)*(p.b1.x - p.y1.x) + (p.a2.y - p.y1.y)*(p.b1.y - p.y1.y)) / (Math.sqrt(Math.pow((p.a2.x - p.y1.x),2) + Math.pow((p.a2.y - p.y1.y),2)) * Math.sqrt(Math.pow((p.b1.x - p.y1.x),2) + Math.pow((p.b1.y - p.y1.y),2)) ) );

	    // o1
	    r.y1a2o1 = Turbulence.R90;// 90
	    p.o1.x = (Math.cos(-r.y1a2o1)*p.y1.x - Math.sin(-r.y1a2o1)*p.y1.y) * s.a2o1 / s.a2y1;
	    p.o1.y = (Math.sin(-r.y1a2o1)*p.y1.x + Math.cos(-r.y1a2o1)*p.y1.y) * s.a2o1 / s.a2y1;

	    // y2
	    r.b1y1y2 = 135*Turbulence.ToRad;
	    p.y2.x = (Math.cos(-r.b1y1y2)*( p.b1.x - p.y1.x) - Math.sin(-r.b1y1y2)*(p.b1.y - p.y1.y)) * s.y1y2 / s.b1y1 + p.y1.x;
	    p.y2.y = (Math.sin(-r.b1y1y2)*( p.b1.x - p.y1.x) + Math.cos(-r.b1y1y2)*(p.b1.y - p.y1.y)) * s.y1y2 / s.b1y1 + p.y1.y;

	    // b2
	    r.y2y1o1 = Math.acos(((p.y2.x - p.y1.x)*(p.o1.x - p.y1.x) + (p.y2.y - p.y1.y)*(p.o1.y - p.y1.y))/(s.y1y2 * s.y1o1));   
	    s.y2o1 = Math.sqrt((Math.pow(s.y1y2,2)) - 2*s.y1y2*s.y1o1*Math.cos(r.y2y1o1) + (Math.pow(s.y1o1,2)));
	    r.b2y2o1 = Math.acos((Math.pow(s.y2o1,2) + Math.pow(s.b2y2,2) - Math.pow(s.b2o1,2)) / (2*s.y2o1*s.b2y2));

	    p.b2.x = (Math.cos(-r.b2y2o1)*(p.o1.x - p.y2.x) - Math.sin(-r.b2y2o1)*(p.o1.y - p.y2.y) ) * s.b2y2 / s.y2o1  + p.y2.x;
	    p.b2.y = (Math.sin(-r.b2y2o1)*(p.o1.x - p.y2.x) + Math.cos(-r.b2y2o1)*(p.o1.y - p.y2.y) ) * s.b2y2 / s.y2o1  + p.y2.y;

	    // for object rotation
	    r.y1y2o1 = Math.acos( ((p.y1.x - p.y2.x)*(p.o1.x - p.y2.x) + (p.y1.y - p.y2.y)*(p.o1.y - p.y2.y)) / (Math.sqrt(Math.pow((p.y1.x - p.y2.x),2) + Math.pow((p.y1.y - p.y2.y),2)) * Math.sqrt(Math.pow((p.o1.x - p.y2.x),2) + Math.pow((p.o1.y - p.y2.y),2)) ) );
	    r.y2b2o1 = Math.acos( ((p.y2.x - p.b2.x)*(p.o1.x - p.b2.x) + (p.y2.y - p.b2.y)*(p.o1.y - p.b2.y)) / (Math.sqrt(Math.pow((p.y2.x - p.b2.x),2) + Math.pow((p.y2.y - p.b2.y),2)) * Math.sqrt(Math.pow((p.o1.x - p.b2.x),2) + Math.pow((p.o1.y - p.b2.y),2)) ) );

	    // o2
	    r.y1y2o2 = Turbulence.Pi;// 180
	    p.o2.x = (Math.cos(-r.y1y2o2)*(p.y1.x - p.y2.x) - Math.sin(-r.y1y2o2)*(p.y1.y - p.y2.y)) * s.y2o2 / s.y1y2 + p.y2.x;
	    p.o2.y = (Math.sin(-r.y1y2o2)*(p.y1.x - p.y2.x) + Math.cos(-r.y1y2o2)*(p.y1.y - p.y2.y)) * s.y2o2 / s.y1y2 + p.y2.y;

	    // y3
	    r.b2y2y3 = Turbulence.Pi;// 180
	    p.y3.x = (Math.cos(-r.b2y2y3)*(p.b2.x - p.y2.x) - Math.sin(-r.b2y2y3)*(p.b2.y - p.y2.y)) * s.y2y3 / s.b2y2 + p.y2.x;
	    p.y3.y = (Math.sin(-r.b2y2y3)*(p.b2.x - p.y2.x) + Math.cos(-r.b2y2y3)*(p.b2.y - p.y2.y)) * s.y2y3 / s.b2y2 + p.y2.y;
	    
	    // b3
	    r.y3y2o2 = Math.acos(((p.y3.x - p.y2.x)*(p.o2.x - p.y2.x) + (p.y3.y - p.y2.y)*(p.o2.y - p.y2.y))/(s.y2y3 * s.y2o2));
	    s.y3o2 = Math.sqrt((Math.pow(s.y2y3,2)) - 2*s.y2y3*s.y2o2*Math.cos(r.y3y2o2) + (Math.pow(s.y2o2,2)));
	    r.b3y3o2 = Math.acos((Math.pow(s.y3o2,2) + Math.pow(s.b3y3,2) - Math.pow(s.b3o2,2)) / (2*s.y3o2*s.b3y3));

	    p.b3.x = (Math.cos(r.b3y3o2)*(p.o2.x - p.y3.x) - Math.sin(r.b3y3o2)*(p.o2.y - p.y3.y) ) * s.b3y3 / s.y3o2  + p.y3.x;
	    p.b3.y = (Math.sin(r.b3y3o2)*(p.o2.x - p.y3.x) + Math.cos(r.b3y3o2)*(p.o2.y - p.y3.y) ) * s.b3y3 / s.y3o2  + p.y3.y;

	    // for object rotation
	    r.y2y3o2 = Math.acos( ((p.y2.x - p.y3.x)*(p.o2.x - p.y3.x) + (p.y2.y - p.y3.y)*(p.o2.y - p.y3.y)) / (Math.sqrt(Math.pow((p.y2.x - p.y3.x),2) + Math.pow((p.y2.y - p.y3.y),2)) * Math.sqrt(Math.pow((p.o2.x - p.y3.x),2) + Math.pow((p.o2.y - p.y3.y),2)) ) );
	    r.y3b3o2 = Math.acos( ((p.y3.x - p.b3.x)*(p.o2.x - p.b3.x) + (p.y3.y - p.b3.y)*(p.o2.y - p.b3.y)) / (Math.sqrt(Math.pow((p.y3.x - p.b3.x),2) + Math.pow((p.y3.y - p.b3.y),2)) * Math.sqrt(Math.pow((p.o2.x - p.b3.x),2) + Math.pow((p.o2.y - p.b3.y),2)) ) );

	    // y4
	    r.b3y3y4 = Turbulence.Pi;// 180;
	    p.y4.x = (Math.cos(-r.b3y3y4)*(p.b3.x - p.y3.x) - Math.sin(-r.b3y3y4)*(p.b3.y - p.y3.y)) * s.y3y4 / s.b3y3 + p.y3.x;
	    p.y4.y = (Math.sin(-r.b3y3y4)*(p.b3.x - p.y3.x) + Math.cos(-r.b3y3y4)*(p.b3.y - p.y3.y)) * s.y3y4 / s.b3y3 + p.y3.y;
    }
}

// simple Vector 3d
Turbulence.V3 = function(x,y,z){
	this.x = x || 0;
	this.y = y || 0;
	this.z = z || 0;
}
Turbulence.V3.prototype = {
    constructor: Turbulence.V3,
    set:function(x,y,z){
    	this.x = x || 0;
    	this.y = y || 0;
    	this.z = z || 0;
    }
}