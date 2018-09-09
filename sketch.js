const WIDTH = 1920;
const HEIGHT = 1080;
const RADIUS = 100;
const COLORMAP = {0: 255, 1: 51};

var grid;
var pause = true;


function setup() {
    createCanvas(WIDTH,HEIGHT);
    grid = new HexGrid(10, 5);
}

function draw() {
  if (pause) {
    // open controls for changing seed
  } else {
    // grid.step();
    // displayHexGrid(grid, RADIUS);  
  }
  displayHexGrid(grid, RADIUS);
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
  var inner_radius = innerHexRadius(radius);
  var x = (column * radius * 3/2) + radius;
  var y = (row * inner_radius * 2) + inner_radius;
  if (column % 2) { //stagger hexagons on odd rows
    y += inner_radius;
  }
  return [x, y];
}

function getCR(x, y, radius) {
  var inner_radius = innerHexRadius(radius);
  var column = Math.round((2/3)*(x/radius - 1))
  if (column % 2) { //stagger hexagons on odd rows
    y -= inner_radius;
  }
  var row = Math.round((y - inner_radius) / (inner_radius * 2))
  var result = [column, row];
  return result;
}

function innerHexRadius(radius) {
  return (sqrt(3) / 2) * radius;
}

function drawHexagon(x, y, radius, color) {
  fill(color);
  var angle = TWO_PI / 6;
  beginShape();
  for (var a = 0; a < TWO_PI; a += angle) {
    var sx = x + cos(a) * radius;
    var sy = y + sin(a) * radius;
    vertex(sx, sy);
  }
  endShape(CLOSE);  
  noFill();
}

function mousePressed() {
  if (pause) {
    var gridIndex = getCR(mouseX, mouseY, RADIUS);
    if (grid.isInBounds(gridIndex[0], gridIndex[1], RADIUS)) {
      var newState = grid.getState(gridIndex[0], gridIndex[1]) ? 0 : 1;
      grid.setState(gridIndex[0], gridIndex[1], newState);
    }
  }
  return false;
}

function keyPressed() {
  if(keyCode == 32) {
      pause = !pause;
  }
  return 0;
}