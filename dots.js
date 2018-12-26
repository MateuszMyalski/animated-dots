let dots = [];
let rot = 0;

function generateDot(){
	return new dot(random(-width/2+50,width/2-50),random(-height/2+50,height/2-50));
}

function setup() {
  createCanvas(windowWidth, windowHeight);
	dots.push(generateDot());
	dots.push(generateDot());

}

function draw() {
  background(240);
	smooth();
	translate(width/2,height/2);
	rotate(sin(rot));

	for(let i = 0; i < dots.length; i++)
		dots[i].update(color('rgba(0,0,0,'+dots[i].old+')'));

	//connected dots stay connected
	for(let i = 0; i < dots.length-2; i++)
		dots[i].lineTo(dots[i+1].x,dots[i+1].y,color('rgba(0,0,0,'+ dots[i+1].old +')'),0);

	//animate connection between two last dots
	if(dots[dots.length-2].lineTo(dots[dots.length-1].x,dots[dots.length-1].y,0))
		dots.push(generateDot());

	//delete old units ;_;
	if(dots[0].old <= 0.01)
		dots.splice(0,1);

	rot += PI/1000;

}

function dot(x,y){
	this.size = 30;
	this.x = x;
	this.y = y;
	this.old = 1;

	let dXi = 0;
	let dYi = 0;

	this.borderSize = this.size + 15;

	this.update = function(col = 0){
		push();
		stroke(col);
		strokeWeight(this.size);
		point(this.x,this.y);
		noFill()
		strokeWeight(3);
		ellipseMode(CENTER);
		arc(this.x,this.y, this.borderSize, this.borderSize, map(this.old,1,0,0,1)*TWO_PI, TWO_PI);
		pop();

		this.old -= 0.001;
		this.size -= 0.04;
		this.borderSize -=0.05;
	}

	this.lineTo = function(x,y,col = 0,animate = 1){

		let dZ = dist(this.x,this.y,x,y);
		let dX = this.x - x;
		let dY = this.y - y;

		let growRate = dZ/230;

		push();
		strokeWeight(2);
		stroke(col);

		if(animate){
			if(dist(this.x+dXi,0,x,0) > 1)
				dXi += -(dX/dZ)*growRate;

			if(dist(0,this.y+dYi,0,y) > 1)
				dYi += -(dY/dZ)*growRate;

			line(this.x,this.y,this.x+dXi,this.y+dYi);

			if(!(dist(this.x+dXi,0,x,0) > 1 && dist(0,this.y+dYi,0,y) > 1))
				return true;

		}else{
			line(this.x,this.y,x,y);
		}
		pop();

	}


}
