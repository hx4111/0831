(function (lib, img, cjs, ss) {

var p; // shortcut to reference prototypes

// library properties:
lib.properties = {
	width: 540,
	height: 860,
	fps: 24,
	color: "#FFFFFF",
	manifest: [
		{src:"images/intro.jpg", id:"intro"}
	]
};



// symbols:



(lib.intro = function() {
	this.initialize(img.intro);
}).prototype = p = new cjs.Bitmap();
p.nominalBounds = new cjs.Rectangle(0,0,540,860);


(lib.btn = function(mode,startPosition,loop) {
	this.initialize(mode,startPosition,loop,{});

	// Layer 1
	this.shape = new cjs.Shape();
	this.shape.graphics.f().s("rgba(0,0,0,0)").ss(1,1,1).p("AsywxIZlAAMAAAAhjI5lAAg");
	this.shape.setTransform(82,107.5);

	this.shape_1 = new cjs.Shape();
	this.shape_1.graphics.f("#000000").s().p("AsyQyMAAAghjIZlAAMAAAAhjg");
	this.shape_1.setTransform(82,107.5);

	this.timeline.addTween(cjs.Tween.get({}).to({state:[]}).to({state:[{t:this.shape_1},{t:this.shape}]},3).wait(1));

}).prototype = p = new cjs.MovieClip();
p.nominalBounds = null;


// stage content:
(lib.select = function(mode,startPosition,loop) {
	this.initialize(mode,startPosition,loop,{});

	// timeline functions:
	this.frame_0 = function() {
		/* Click to Go to Web Page
		Clicking on the specified symbol instance loads the URL in a new browser window.
		
		Instructions:
		1. Replace http://www.adobe.com with the desired URL address.
		   Keep the quotation marks ("").
		*/
		
		this.btn1.addEventListener("click", fl_ClickToGoToWebPage1);
		this.btn2.addEventListener("click", fl_ClickToGoToWebPage2);
		this.btn3.addEventListener("click", fl_ClickToGoToWebPage3);
		
		function fl_ClickToGoToWebPage1() {
			location.href=("adventure.html");
		}
		
		function fl_ClickToGoToWebPage2() {
			location.href=("adventure.html");
		}
		
		function fl_ClickToGoToWebPage3() {
			location.href=("adventure.html");
		}
	}

	// actions tween:
	this.timeline.addTween(cjs.Tween.get(this).call(this.frame_0).wait(1));

	// Layer 1
	this.btn3 = new lib.btn();
	this.btn3.setTransform(463.5,712.5,0.934,1,0,0,0,82,107.5);
	new cjs.ButtonHelper(this.btn3, 0, 1, 2, false, new lib.btn(), 3);

	this.btn2 = new lib.btn();
	this.btn2.setTransform(279.5,706.5,1.311,1,0,0,0,82,107.5);
	new cjs.ButtonHelper(this.btn2, 0, 1, 2, false, new lib.btn(), 3);

	this.btn1 = new lib.btn();
	this.btn1.setTransform(85.4,711.5,0.933,1,0,0,0,81.9,107.5);
	new cjs.ButtonHelper(this.btn1, 0, 1, 2, false, new lib.btn(), 3);

	this.timeline.addTween(cjs.Tween.get({}).to({state:[{t:this.btn1},{t:this.btn2},{t:this.btn3}]}).wait(1));

	// intro.jpg
	this.instance = new lib.intro();

	this.timeline.addTween(cjs.Tween.get(this.instance).wait(1));

}).prototype = p = new cjs.MovieClip();
p.nominalBounds = new cjs.Rectangle(270,480,541,960);

})(lib = lib||{}, images = images||{}, createjs = createjs||{}, ss = ss||{});
var lib, images, createjs, ss;