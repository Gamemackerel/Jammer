const WIDTH = 1920;
const HEIGHT = 1080;
const RADIUS = 80;

var grid;
var gridView;
var pause = true;

var ruleGrid;
var ruleGridView;
var rulemaker = false;

var font,
  fontsize = 40

function preload() {
  // Ensure the .ttf or .otf font stored in the assets directory
  // is loaded before setup() and draw() are called
  font = loadFont('assets/ABeeZee/ABeeZee-Regular.otf');
}



function setup() {
    // Create canvas and main grid
    createCanvas(WIDTH,HEIGHT);
    grid = new HexGrid(14, 7);
    gridView = new HexGridView(grid, WIDTH / 2, HEIGHT / 2, RADIUS);

    // Set text characteristics
    textFont(font);
    textSize(fontsize);
    textAlign(CENTER, CENTER);
}

function draw() {
  clear();
  gridView.display();
  if (pause) {
    if (rulemaker) {
      drawRuleMakerGui();      
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
  ruleGrid = new HexGrid(9,4);

  ruleGridView = new HexGridView(ruleGrid, WIDTH / 2, (HEIGHT / 2) - (sqrt(3) / 4) * RADIUS, RADIUS * 6/5);

  // Trim grid down to a single neighborhood

  trimMask = [
      [0,0,-1],
      [2,0,-1],
      [4,0,-1],
      [0,1,-1],
      [4,1,-1],
      [0,3,-1],
      [4,3,-1]
  ];

  for (var i = 0; i < 5; i++) {
    trimMask.push([5, i, -1]);
    trimMask.push([6, i, -1]);
    trimMask.push([7, i, -1]);
    if (i != 2) {
      trimMask.push([8, i, -1]);
    }
  }

  ruleGrid.massSetState(trimMask);
}

function drawRuleMakerGui() {
  drawOverlay();
  ruleGridView.display();
  fill(65);

  // title of rule maker gui
  text("New Transition Rule", WIDTH / 2, HEIGHT / 16);

  // nice little arrow showing transition direction. Uses lots of magic numbers so with size change this part will need adjustment
  stroke(100);
  strokeWeight(8);
  line(WIDTH * 19/32, HEIGHT / 2 + 8, WIDTH * 23/32, HEIGHT / 2 + 8);
  triangle(WIDTH * 23/32, HEIGHT / 2 + 8, WIDTH * 23/32 - 4, HEIGHT / 2 + 4, WIDTH * 23/32 - 4, HEIGHT / 2 + 12)
}

function drawButton(text, fn) {

}

// TODO make overlay fade in
function drawOverlay() {
  fill(200, 200, 200, 220);
  rect(0, 0, WIDTH, HEIGHT);
}