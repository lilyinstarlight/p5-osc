let x = 50, y = 50;

function setup() {
	createCanvas(400, 400);

	setupOsc(12000, 4560);
	registerOsc('/coord', updateCoord);

	sendOsc('/ready');
}

function draw() {
	background(255, 255, 255);

	fill(255, 48, 146);
	stroke(255, 48, 146);
	strokeWeight(1);
	textSize(24);
	text("π", x-6, y+6);

	noFill();
	stroke(95, 95, 95);
	strokeWeight(3);
	curve(x-20, y-20, x+12, y-12, x+12, y+12, x-20, y+20);
	curve(x-20, y-23, x+20, y-14, x+20, y+14, x-20, y+23);
	curve(x-20, y-26, x+28, y-16, x+28, y+16, x-20, y+26);
}

function updateCoord(nx, ny) {
	x = nx;
	y = ny;
}
