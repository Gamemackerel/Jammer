const WIDTH = 1920;
const HEIGHT = 1080;
const RADIUS = 100;

var grid;
var gridView;
var pause = true;

var ruleGrid;
var ruleGridView;
var rulemaker = false;


function setup() {
    createCanvas(WIDTH,HEIGHT);
    grid = new HexGrid(12, 5);
    gridView = new HexView(grid, 30, 60, RADIUS);
}

function draw() {
  clear();
  gridView.display();
  if (pause) {
    if (rulemaker) {
      drawRuleGui();
    }
  } else {
    // grid.step();
    // displayHexGrid(grid, RADIUS);  
  }
}


function drawHexagon(x, y, radius, color) {
  fill(color);
  let angle = TWO_PI / 6;
  beginShape();
  for (let a = 0; a < TWO_PI; a += angle) {
    let sx = x + cos(a) * radius;
    let sy = y + sin(a) * radius;
    vertex(sx, sy);
  }
  endShape(CLOSE);  
  noFill();
}

// TODO factor out seedmaker and rulemaker behavoir into functions
function mousePressed() {
  if (pause && !rulemaker) {
    let gridIndex = gridView.getCR(mouseX, mouseY);
    if (grid.isInBounds(gridIndex[0], gridIndex[1])) {
      let newState = grid.getState(gridIndex[0], gridIndex[1]) ? 0 : 1;
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
        break;
    case 27: //esc
        if (rulemaker) {
          rulemaker = false;
        }
        break;
  }
  return 0;
}

//TODO delete some hexes from rulegrid with setSTate outofbounds
function startRuleGui() {
  rulemaker = true;
  ruleGrid = new HexGrid(5,4);
  ruleGridView = new HexView(ruleGrid, WIDTH / 4, 30, RADIUS * 5/4)// horrible magic numbers
  // ruleGrid.setState
}

// TODO add instruction text
function drawRuleGui() {
  drawOverlay();
  ruleGridView.display();
}

// TODO make overlay fade in
function drawOverlay() {
  fill(200, 200, 200, 220);
  rect(0, 0, WIDTH, HEIGHT);
}