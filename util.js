function sleep(ms) { return new Promise(resolve => setTimeout(resolve, ms)); }

// Given a rc index, highlight all of its neighbors
// for debugging
function lightUpTheNeighborhood(column, row) {
  // console.log("lighting up");
  var nbs = [];
  for (let i = 0; i < 12; i++) {
    nbs.push(grid.getNeighborCoordsWithWrap(column, row, i));
  }
  
  for (var i = 0; i < nbs.length; i++) {
    let column = nbs[i][0];
    let row = nbs[i][1];

    column = column % grid.columns;
    row = row % grid.rows;
    
    let xy = gridView.getXY(column, row);
    drawHexagon(xy[0], xy[1], RADIUS, 200, i + ' : (' + [row, column] + ')');
    textSize(FONTSIZE_SMALL);
  }
}

// Requires a 10x5 hex grid, trims the grid into the shape required for
// rule-maker ui
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

// Draws a hexagon with the given position, radius, color, and label
function drawHexagon(x, y, radius, color, display_text) {
  fill(color);
  stroke(50);
  strokeWeight(2);
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
    strokeWeight(2);
    textSize(FONTSIZE_SMALL);
    text(display_text, x, y);
  }
}

// Draw an arrow starting from start_x,start_y and ending at end_x,end_y
function drawArrow(start_x, start_y, end_x, end_y) {
  stroke(100);
  strokeWeight(4);
  line(start_x, start_y, end_x, end_y);
  triangle(end_x, end_y, end_x - 4, end_y + 4, end_x - 4, end_y - 4);
  noStroke();
}

// Generate a Jammer keyboard grid with the harmonic table layout
// counting down from the max note which is in the top left
function harmonicTableMidiLayout(max_note) {
  let first_column_first_row_midi = max_note - 4;
  let second_column_first_row_midi = max_note; //119
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

// 12 total neighbors, neighbor directly above is 0 
// and then the indices are enumerated clockwise
function getNeighborCoords(column, row, neighborIndex) {
  let stagger = !(column % 2);
  switch(neighborIndex) {
    case 0:
      return [column, row - 1];
      break;
    case 1:
      return [column + 1, stagger + row - 2];
      break;
    case 2:
      return [column + 1, stagger + row - 1];
      break;
    case 3:
      return [column + 2, row];
      break;
    case 4:
      return [column + 1, stagger + row];
      break;
    case 5:
      return [column + 1, stagger + row + 1];
      break;
    case 6:
      return [column, row + 1];
      break;
    case 7:
      return [column - 1, stagger + row + 1];
      break;
    case 8:
      return [column - 1, stagger + row];
      break;
    case 9:
      return [column - 2, row];
      break;
    case 10:
      return [column - 1, stagger + row - 1];
      break;
    case 11:
      return [column - 1, stagger + row - 2];
      break;
  }
}
