'use strict';

// TODO add a gui menu from which user can interact
// with ruleset as json, tempo can be changed, infinity
// mode can be toggled, and midi data can be downloaded

//options (TODO make at least some of these dynamically generated based on window size)
const WIDTH = window.innerWidth;
const HEIGHT = window.innerHeight;
const RADIUS = 70;
const TEMPO = 2; //bps
const FONTSIZE = 40
const FONTSIZE_SMALL = 25

// representation
var grid;
var gridView;
var ruleGrid;
var ruleGridView;
var notes;
var stepTimer;
var font;

// state of application ui
var isPaused = true;
var isRuleMaker = false;
var isloaded = false;



function preload() {
  // Ensure the .ttf or .otf font stored in the assets directory
  // is loaded before setup() and draw() are called
  font = loadFont('assets/ABeeZee/ABeeZee-Regular.otf');

  // load the midi soundfont
  MIDI.loadPlugin({
    soundfontUrl: "./soundfont/",
    instrument: "acoustic_grand_piano", // or multiple instruments
    onsuccess: function() {
      isloaded = true;
      }
  });
}

function setup() {
  // Create canvas and main grid
  createCanvas(WIDTH,HEIGHT);
  
  // Set text characteristics
  textFont(font);
  textSize(FONTSIZE);
  textAlign(CENTER, CENTER);

  // initialize Jammer state
  grid = new HexGrid(14, 8);
  gridView = new HexGridView(grid, WIDTH / 2, HEIGHT / 2, RADIUS);
  notes = new NoteMap(95)
}

function draw() {
  clear();

  if (!isRuleMaker) {
    // display header unless rulemaking mode is active
    stroke(100);
    fill(255);
    strokeWeight(5);
    textSize(FONTSIZE * 3)
    text("JAMMER", WIDTH / 2, HEIGHT / 16);
  }
  gridView.display();
  if (isPaused) {
    if (isRuleMaker) {
      drawRuleMakerGui(); 
    } else {
      stroke(100);
      fill(100);
      strokeWeight(1);
      textSize(FONTSIZE)
      text("Paused", WIDTH / 2, HEIGHT / 2);
      textSize(FONTSIZE_SMALL)
      text("Click to toggle tile states     -     Press R to define transition rules     -     Press Space to pause/unpause", WIDTH / 2, HEIGHT - HEIGHT / 16);
      noStroke();
    }
  }
}

function drawHexagon(x, y, radius, color, display_text) {
  fill(color);
  stroke(50)
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

  if (!(typeof display_text === "undefined")) {
    strokeWeight(4);
    text(display_text, x, y);
  }
}

function mousePressed() {
  if (isRuleMaker) {
    ruleMakerMouseEvent();
  } else {
    seedMakerMouseEvent();  
  }
  return false;
}

function seedMakerMouseEvent() {
  let gridIndex = gridView.getCR(mouseX, mouseY);
    if (grid.isInBounds(gridIndex[0], gridIndex[1])) {
      let newState = grid.getState(gridIndex[0], gridIndex[1]) ? 0 : 1;
      grid.setState(gridIndex[0], gridIndex[1], newState);
    }

    if (grid.getState(gridIndex[0], gridIndex[1]) == 1) {
      notes.playNote(gridIndex[0], gridIndex[1]);
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
      if (!isRuleMaker) {
        if (isPaused) {
          unpause();
        } else {
          pause();
        }
      }
        break;
    case 82: // r
      if (isPaused) {
        startRuleGui();
      }
      break;
    case 27: //esc
      if (isRuleMaker) {
        isRuleMaker = false;
      }
      break;
    case 13: //enter
      if (isRuleMaker) {
        saveRule();
        startRuleGui();
      }
      break;
  }
  return 0;
}

function pause() {
  isPaused = true;
  window.clearInterval(stepTimer);
}

function unpause() {
  isPaused = false;
  stepTimer = window.setInterval(timerUp, 1000 / TEMPO);
}

function timerUp() {
  grid.step();
  notes.playNotes(grid);
}

function startRuleGui() {
  // Generate state for this new rule definition grid
  ruleGrid = new HexGrid(10,5);
  ruleGridView = new HexGridView(ruleGrid, WIDTH / 2, (HEIGHT / 2), RADIUS * 3/2);

  // Trims grid down to a single neighborhood and a next state cell
  shapeRuleGrid(ruleGrid);

  // Causes draw to start rule definition mode
  isRuleMaker = true;
}

function saveRule() {
  let neighborhood = ruleGrid.getNeighborhood(3, 2);
  let nextState = ruleGrid.getState(9, 2);
  grid.newRule(neighborhood, nextState);
}

function shapeRuleGrid(ruleGrid) {
  let center_of_attention = [3, 2];
  let keepMask = {};
  for (let i = 0; i < 12; i++) {
    keepMask[(getNeighborCoords(center_of_attention[0], center_of_attention[1], i))] = true;
  }

  keepMask[center_of_attention] = true;
  keepMask[[9,2]] = true;

  
  let trimMask = [];
  for (let i = 0; i < 10; i++) {
    for (let j = 0; j < 5; j++) {
      if (!keepMask.hasOwnProperty([i,j])) {
        trimMask.push([i,j,-1]);
      }
    }
  }
  ruleGrid.massSetState(trimMask);
}

function drawRuleMakerGui() {
  drawOverlay();
  ruleGridView.display();
  fill(65);

  stroke(100)
  strokeWeight(1)
  // title of rule maker gui
  textSize(FONTSIZE)
  text("New Transition Rule", WIDTH / 2, HEIGHT / 16);

  textSize(FONTSIZE_SMALL)
  text("The hex on the right is the desired transition state and the complex on the left is the pattern to incite transition", WIDTH / 2, HEIGHT / 16 + 2 * FONTSIZE);
  text("Click to toggle tile states     -     Press Enter to save a new transition rule     -     Press Esc to exit the rule maker", WIDTH / 2, HEIGHT - HEIGHT / 16);

  // nice little arrow showing transition direction. 
  drawArrow(WIDTH * 19/32, HEIGHT / 2 + RADIUS / 2, WIDTH * 21/32, HEIGHT / 2 + RADIUS / 2);
}

function drawOverlay() {
  fill(200, 200, 200, 220);
  rect(0, 0, WIDTH, HEIGHT);
}

function drawArrow(start_x, start_y, end_x, end_y) {
  stroke(100);
  strokeWeight(8);
  line(start_x, start_y, end_x, end_y);
  triangle(end_x, end_y, end_x - 4, end_y + 4, end_x - 4, end_y - 4)
  noStroke();
}

// for debug incorrect neighbor mapping
function lightUpTheNeighborhood(column, row) {
  // console.log("lighting up");
  var nbs = []
  for (let i = 0; i < 12; i++) {
    nbs.push(getNeighborCoords(column, row, i));
  }
  
  for (var i = 0; i < nbs.length; i++) {
    let column = nbs[i][0]
    let row = nbs[i][1]
    if (row < 0) {
      column -= 1;
      row += grid.rows(column)
    } else if (row > grid.rows(column)) {
      row -= 2 * (column % 2);
      column += 1;
    }

    column = column % grid.columns
    row = row % grid.rows(column)
    
    let xy = gridView.getXY(column, row);
    drawHexagon(xy[0], xy[1], RADIUS, 200);
    text(i, xy[0], xy[1]);
    // console.log()
  }
}

