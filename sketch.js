var WIDTH = 640;
var HEIGHT = 480;
var RADIUS = 40;
var COLORMAP = {0: 255, 1: 0};
var grid;


function setup() {
  	createCanvas(WIDTH,HEIGHT);
  	grid = new HexGrid(10, 5);
  	displayHexGrid(grid, 40); // WHY CAN I NOT USE CLASS CONSTANTS
}

function draw() {
	// grid.step();
	// displayHexGrid(grid, RADIUS);
}

function displayHexGrid(grid, radius) {
	for (var column = 0; column < grid.model.length; column++) {
		for (var row = 0; row < grid.model[row].length; row++) {
			var coords = getXY(column, row, radius);
			var color = COLORMAP[grid.getState(column, row)];
			drawHexagon(coords[0], coords[1], radius, color);
		}
	}
}

function getXY(column, row, radius) {
	var inner_radius = (sqrt(3) / 2) * radius;
	var x = (column * radius * 3/2) + radius;
	var y = (row * inner_radius * 2) + inner_radius;
	if (column % 2) { //stagger hexagons on odd rows
		y += inner_radius;
	}
	var result = [x, y];
	return result;
}

function drawHexagon(x, y, radius, color) {
	console.log("drawing hexagon at " + x + "," + y);
	var angle = TWO_PI / 6;
	beginShape();
	for (var a = 0; a < TWO_PI; a += angle) {
	var sx = x + cos(a) * radius;
	var sy = y + sin(a) * radius;
	vertex(sx, sy);
	}
	endShape(CLOSE);	
}