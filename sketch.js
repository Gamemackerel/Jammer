const WIDTH = 1920;
const HEIGHT = 1080;
const RADIUS = 100;
const COLORMAP = {0: 255, 1: 51};

var grid;
var pause = true;

var ruleGrid;
var rulemaker = false;


function setup() {
    createCanvas(WIDTH,HEIGHT);
    grid = new HexGrid(12, 5);
}

function draw() {
  displayHexGrid(grid, RADIUS, 30, 60);
  if (pause) {
    if (rulemaker) {
      drawRuleGui();
    }
  } else {
    // grid.step();
    // displayHexGrid(grid, RADIUS);  
  }
}

function displayHexGrid(grid, radius, positionX, positionY) {
  for (var column = 0; column < grid.model.length; column++) {
    for (var row = 0; row < grid.model[column].length; row++) {
      if (grid.getState(column, row) != OUTOFBOUNDS) {
        var coords = getXY(column, row, radius);
        var color = COLORMAP[grid.getState(column, row)];
        drawHexagon(coords[0] + positionX, coords[1] + positionY, radius, color);
      }
    }
  }
}

// TODO fix these methods to work with offset hexagon grid. 
// Perhaps I should make a hexgridview object which stores radius, offsets
// and controls the model
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

// TODO factor out seedmaker and rulemaker behavoir into functions
function mousePressed() {
  if (pause && !rulemaker) {
    var gridIndex = getCR(mouseX, mouseY, RADIUS);
    if (grid.isInBounds(gridIndex[0], gridIndex[1], RADIUS)) {
      var newState = grid.getState(gridIndex[0], gridIndex[1]) ? 0 : 1;
      grid.setState(gridIndex[0], gridIndex[1], newState);
    }
  }
  return false;
}

// TODO esc to exit rulemaker mode
function keyPressed() {
  switch(keyCode) {
    case 32: // space
        if (!rulemaker) {
          pause = !pause;
        }
        break;
    case 82: // r
        if (pause) {
          startRuleGui();
        }
        break
  }
  return 0;
}

//TODO delete some hexes from rulegrid with setSTate outofbounds
function startRuleGui() {
  rulemaker = true;
  seedmaker = false;
  ruleGrid = new HexGrid(5,4);

}

// TODO add instruction text
function drawRuleGui() {
  drawOverlay();
  displayHexGrid(ruleGrid, RADIUS * 5/4, WIDTH / 4, 30);
}

// TODO make overlay fade in
function drawOverlay() {
  fill(200, 200, 200, 220);
  rect(0, 0, WIDTH, HEIGHT);
}