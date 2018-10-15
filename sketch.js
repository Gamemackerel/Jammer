'use strict';

//options (TODO make at least some of these dynamically generated based on window size)
const WIDTH = 1920;
const HEIGHT = 1080;
const RADIUS = 70;
const MUSIC_GRID = harmoicTableMidiLayout();
const TEMPO = 500;

// representation
var grid;
var gridView;
var ruleGrid;
var ruleGridView;

// application ui state
var isPaused = true;
var isRuleMaker = false;
var loaded = false;

var stepTimer;

var font,
  fontsize = 40

function preload() {
  // Ensure the .ttf or .otf font stored in the assets directory
  // is loaded before setup() and draw() are called
  font = loadFont('assets/ABeeZee/ABeeZee-Regular.otf');

  grid = new HexGrid(14, 8);
  gridView = new HexGridView(grid, WIDTH / 2, HEIGHT / 2, RADIUS);
}

// TODO add a gui menu from which user can interact
// with ruleset as json, tempo can be changed, infinity
// mode can be toggled, and midi data can be downloaded?

function setup() {
    // Create canvas and main grid
    createCanvas(WIDTH,HEIGHT);
    


    // Set text characteristics
    textFont(font);
    textSize(fontsize);
    textAlign(CENTER, CENTER);

    MIDI.loadPlugin({
      soundfontUrl: "./soundfont/",
      instrument: "acoustic_grand_piano", // or multiple instruments
      onsuccess: function() {
        loaded = true;
        }
    });
}

function draw() {
  clear();
  gridView.display();
  if (isPaused) {
    if (isRuleMaker) {
      drawRuleMakerGui(); 
    } else {
      stroke(100);
      strokeWeight(2);
      text("Paused", WIDTH / 2, HEIGHT / 2);
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

  // Can use composition of these circles to better map hexagon clicking
  // strokeWeight(1);
  // ellipse(x,y,radius * 2);
  // ellipse(x,y,(sqrt(3) / 2) * radius * 2);

  if (!(typeof display_text === "undefined")) {
    strokeWeight(4);
    text(display_text, x, y);
  }
}

function mousePressed() {
  if (isPaused) {
    if (isRuleMaker) {
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

    if (grid.getState(gridIndex[0], gridIndex[1]) == 1) {
      playNote(gridIndex[0], gridIndex[1]);
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
          isRuleMaker = false;
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
  stepTimer = window.setInterval(timerGo, TEMPO);
}

function timerGo() {
  grid.step();
  playNotes();
}

function startRuleGui() {
  isRuleMaker = true;
  ruleGrid = new HexGrid(10,5);

  ruleGridView = new HexGridView(ruleGrid, WIDTH / 2, (HEIGHT / 2), RADIUS * 6/5);

  // Trim grid down to a single neighborhood
  // and the next generation state
  shapeRuleGrid(ruleGrid);
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

  // title of rule maker gui
  text("New Transition Rule", WIDTH / 2, HEIGHT / 16);

  // nice little arrow showing transition direction. Uses lots of magic numbers so with size change this part will need adjustment
  // TODO create arrow function, move arrow up a little bit
  stroke(100);
  strokeWeight(8);
  line(WIDTH * 19/32, HEIGHT / 2, WIDTH * 23/32, HEIGHT / 2);
  triangle(WIDTH * 23/32, HEIGHT / 2, WIDTH * 23/32 - 4, HEIGHT / 2 + 4, WIDTH * 23/32 - 4, HEIGHT / 2 - 4)
  noStroke();
}
//TODO move rulemaker methods into a seperate file
function saveRule() {
  let neighborhood = ruleGrid.getNeighborhood(3, 2);
  let nextState = ruleGrid.getState(9, 2);
  grid.newRule(neighborhood, nextState);
}

// TODO make overlay fade in
function drawOverlay() {
  fill(200, 200, 200, 220);
  rect(0, 0, WIDTH, HEIGHT);
}

// TODO find a way to play midi notes that doesnt sound like trash
function playNote(column, row) {
  MIDI.setVolume(0, 127);
  MIDI.noteOn(0,MUSIC_GRID[column][row], 70, 0,);
  MIDI.noteOff(0,MUSIC_GRID[column][row], 0.2);
}

// TODO fix this method so that chords can be played
function playNotes() {
  let notes = [];
  for (let column = 0; column < grid.columns; column++) {
    for (let row = 0; row < grid.rows; row++) {
      if (grid.getState(column, row) == 1) {
        notes.push(MUSIC_GRID[column][row]);
      }
    }
  }
  MIDI.setVolume(0, 127);
  MIDI.chordOn(0, notes, 70, 0);
  MIDI.chordOff(0, notes, 0.2);
}

// to debug incorrect neighbor mapping
function lightUpTheNeighborhood(column, row) {
  console.log("lighting up");
  var nbs = []
  for (let i = 0; i < 12; i++) {
    nbs.push(getNeighborCoords(column, row, i));
  }
  for (var i = 0; i < nbs.length; i++) {
    let xy = gridView.getXY(nbs[i][0], nbs[i][1]);
    drawHexagon(xy[0], xy[1], RADIUS, 200);
    text(i, xy[0], xy[1]);
  }
}

function harmoicTableMidiLayout() {
  let first_column_first_row_midi = 115;
  let second_column_first_row_midi = 119;
  let grid = [];
  for (let column = 0; column < 14; column++) {
    grid[column] = [];
    let midi_column_start;
    if (!(column % 2)) {
      midi_column_start = first_column_first_row_midi - Math.floor(column/2);
    } else {
      midi_column_start = second_column_first_row_midi - Math.floor(column/2);
    }
    for (let row = 0; row < 8; row++) {
      grid[column][row] = midi_column_start - 7 * row;
    }
  }
  return grid;
}