var WIDTH = 640;
var HEIGHT = 480;
var grid;

function setup() {
  createCanvas(WIDTH,HEIGHT);
  grid = new HexGrid(10, 5);
  grid.display(40);
}

function draw() {
  // hexagon(mouseX, mouseY, 80);
}

