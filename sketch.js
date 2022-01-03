'use strict';

// TODO add a gui menu from which user can interact
// with ruleset as json, tempo can be changed, infinity
// mode can be toggled, and midi data can be downloaded

//options (TODO make at least some of these dynamically generated based on window size)
const WIDTH = window.innerWidth;
const HEIGHT = window.innerHeight;
const RADIUS = window.innerHeight / 18;
const TEMPO = 2; //bps
const FONTSIZE = window.innerHeight / 30;
const FONTSIZE_SMALL = FONTSIZE / 2;

// representation
var grid;
var gridView;
var ruleGrid;
var ruleGridView;
var defaultToast;
var notes;
var stepTimer;
var font;

// state of application
var isPaused = true;
var isRuleMaker = false;
var isloaded = false;
var isToasting = false;
var isFreePlay = false;

// load fonts and plugins before setup
function preload() {
  // Ensure the .ttf or .otf font stored in the assets directory
  // is loaded before setup() and draw() are called
  font = loadFont('./assets/ABeeZee/ABeeZee-Regular.otf');

  // load the midi soundfont
  MIDI.loadPlugin({
    soundfontUrl: "./soundfont/",
    instrument: "acoustic_grand_piano",
    onsuccess: function() {
      isloaded = true;
      }
  });
}

// Initialize canvas and application state
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
  notes = new NoteMap(harmonicTableMidiLayout(95))
}

function draw() {
  clear();
  // Display the current state of the hex grid
  gridView.display();

  // Show different UI elements depending on the 
  // state of the application
  if (isPaused) {
    if (isRuleMaker) {
      drawRuleMakerOverlay();
      ruleGridView.display(); 
    } else {
      drawPauseOverlay();
    }
  }
  toaster(defaultToast);
}

function pause() {
  isPaused = true;
  window.clearInterval(stepTimer);
}

function unpause() {
  isPaused = false;
  stepTimer = window.setInterval(timerUp, 1000 / TEMPO);
}

function startFreePlay() {
  grid = new HexGrid(14, 8);  
  isFreePlay = true;
}

function timerUp() {
  grid.step();
  notes.playNotes(grid);
}

function startRuleGui() {
  // Generate state for this new rule definition grid
  ruleGrid = new HexGrid(10,5);
  ruleGridView = new HexGridView(ruleGrid, WIDTH / 2, (HEIGHT / 2), RADIUS * 6/5);

  // Trims grid down to a single neighborhood and a next state cell
  shapeRuleGrid(ruleGrid);

  // Causes draw to start rule definition mode
  isRuleMaker = true;
}

function saveRule() {
  let neighborhood = ruleGrid.getNeighborhoodStates(3, 2);
  let nextState = ruleGrid.getState(9, 2);
  grid.newRule(neighborhood, nextState);
}

// Grey out the current hex grid and overlay some instructions for
// how to use the rule maker gui
// TODO display all existing rules in minimap
function drawRuleMakerOverlay() {
  // grey background
  fill(200, 200, 200, 220);
  noStroke();
  rect(0, 0, WIDTH, HEIGHT);

  // title and instructions of rule maker gui
  fill(65);
  stroke(100)
  strokeWeight(1)
  textSize(FONTSIZE)
  text("New Transition Rule", WIDTH / 2, HEIGHT / 16);
  textSize(FONTSIZE_SMALL)
  text("The complex on the left is the pattern which incites state transition, and the hex on the right represents the state to transition to.", WIDTH / 2, HEIGHT / 16 + 60);
  text("Click to toggle tile states     -     Press Enter to save a new transition rule     -     Press Esc to exit the rule maker", WIDTH / 2, HEIGHT - HEIGHT / 16);

  // nice little arrow showing transition direction between 
  // the current neighborhood and the next state
  drawArrow(WIDTH * 18/32, HEIGHT / 2 - RADIUS / 2, WIDTH * 21/32, HEIGHT / 2 - RADIUS / 2);
}

// TODO make header clickable and plays one time crazy chord, or randomizes seed
// Draw the Jammer Logo at the top of page
function drawHeader() {
  stroke(0);
  fill(255);
  strokeWeight(3);
  textSize(FONTSIZE * 2)
  text("JAMMER", WIDTH / 2, HEIGHT / 16);
}

// Draw the "paused" notifcation and control instructions
function drawPauseOverlay() {
  stroke(100);
  fill(100);
  strokeWeight(1);
  textSize(FONTSIZE);
  text("Paused", WIDTH / 2, HEIGHT / 2);
  textSize(FONTSIZE_SMALL);
  text("Click to toggle tile states     -     Press R to define transition rules     -     Press Space to pause/unpause     -     Press P to enter free play mode", WIDTH / 2, HEIGHT - HEIGHT / 16);
}
