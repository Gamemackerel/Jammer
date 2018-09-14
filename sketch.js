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
    gridView = new HexGridView(grid, WIDTH / 2, HEIGHT / 2, RADIUS);
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
  strokeWeight(4);
  let angle = TWO_PI / 6;
  beginShape();
  for (let a = 0; a < TWO_PI; a += angle) {
    let sx = x + cos(a) * radius;
    let sy = y + sin(a) * radius;
    vertex(sx, sy);
  }
  endShape(CLOSE);
  noFill();
  // showing circles for (debug)?
  strokeWeight(1);
  ellipse(x,y,radius * 2);
  ellipse(x,y,(sqrt(3) / 2) * radius * 2);
}

function mousePressed() {
  if (pause) {
    if (rulemaker) {
      ruleMakerMouseEvent();
    } else {
      seedMakerMouseEvent();  
    }
  }
  return false;
}

function seedMakerMouseEvent() {
  let gridIndex = gridView.getCR(mouseX, mouseY);
    if (grid.isInBounds(gridIndex[0], gridIndex[1])) {
      let newState = grid.getState(gridIndex[0], gridIndex[1]) ? 0 : 1;
      grid.setState(gridIndex[0], gridIndex[1], newState);
    }
}

function ruleMakerMouseEvent() {
  let gridIndex = ruleGridView.getCR(mouseX, mouseY);
    if (ruleGrid.isInBounds(gridIndex[0], gridIndex[1])) {
      let newState = ruleGrid.getState(gridIndex[0], gridIndex[1]) ? 0 : 1;
      ruleGrid.setState(gridIndex[0], gridIndex[1], newState);
    }
}

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

function startRuleGui() {
  rulemaker = true;
  ruleGrid = new HexGrid(5,4);

  ruleGridView = new HexGridView(ruleGrid, WIDTH / 2, (HEIGHT / 2) - (sqrt(3) / 4) * RADIUS, RADIUS * 5/4);

  // Trim grid down to a single neighborhood
  ruleGrid.massSetState([
      [0,0,-1],
      [2,0,-1],
      [4,0,-1],
      [0,1,-1],
      [4,1,-1],
      [0,3,-1],
      [4,3,-1]
  ]);
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