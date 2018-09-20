const OUTOFBOUNDS = -1;

function HexGrid(columns, rows) { //object definition
  this.gridModel = [];
  this.rules = {};
  this.infinityMode = true;


  for (let i = 0; i < columns; i++) {
    let stagger = !(i % 2);
    this.gridModel[i] = [];
    for (let j = 0; j < rows; j++) {
      if (stagger && (j == (rows - 1))) { //odd rows will 
        this.gridModel[i][j] =  OUTOFBOUNDS;  
      } else {
        this.gridModel[i][j] = 0;
      }
    }
  }

  this.getNeighborState = function(column, row, neighborIndex) {
    let coords = getNeighborCoords(column, row, neighborIndex);
    return (this.getState(coords[0], coords[1]));
  }

  this.getNeighborhood = function(column, row) {
    let result = []
    for (let i = 0; i < 12; i++) {
      result.push(this.getNeighborState(column, row, i));
    }
    result.push(this.getState(column, row));
    return result;
  }

  this.getState = function(column, row){
    if (this.infinityMode) {
      return this.gridModel[((column % columns) + columns) % columns][((row % rows) + rows) % rows];
    } else 
    if (!this.isInBounds(column, row)) {
      return OUTOFBOUNDS;
    } else {
      return this.gridModel[column][row];
    }
  }

  this.setState = function(column, row, newState) {
    if (this.infinityMode && this.getState(column, row) != OUTOFBOUNDS) {
      this.gridModel[((column % columns) + columns) % columns][((row % rows) + rows) % rows] = newState;
    } else if (this.getState(column, row) != OUTOFBOUNDS) {
      this.gridModel[column][row] = newState;
    } 
  }

  this.massSetState = function(coordsAndStates) {
    for (var i = 0; i < coordsAndStates.length; i++) {
      this.setState(coordsAndStates[i][0], coordsAndStates[i][1], coordsAndStates[i][2]);
    }      
  }

  this.isInBounds = function(column, row) {
    return (((column >= 0) && (column < this.gridModel.length)) 
        && ((row >= 0) && (row < this.gridModel[0].length)))
  }

  this.newRule = function(neighborhood, nextState) {
    this.rules[neighborhood] = nextState;
  }

  this.getRule = function(neighborhood) {
    if (!(neighborhood in this.rules)) {
      return 0;
    } else {
      return this.rules[neighborhood];  
    }
  }

  this.step = function() {
    let nextGen = []; 
    for (let i = 0; i < this.gridModel.length; i++) {
      nextGen[i] = [];
      for (let j = 0; j < this.gridModel[i].length; j++) {
        nextGen[i][j] = this.getRule(this.getNeighborhood(i, j));
      }
    }
    this.gridModel = nextGen;
  }

}


// 12 total neighbors, neighbor directly above is 0 
// and then the indices are enumerated clockwise
function getNeighborCoords(column, row, neighborIndex) {
  let stagger = !(column % 2);
  switch(neighborIndex) {
    case 0:
      return [column, row - 1]
      break;
    case 1:
      return [column + 1, stagger + row - 2]
      break;
    case 2:
      return [column + 1, stagger + row - 1]      
      break;
    case 3:
      return [column + 2, row]
      break;
    case 4:
      return [column + 1, stagger + row]
      break;
    case 5:
      return [column + 1, stagger + row + 1]
      break;
    case 6:
      return [column, row + 1]
      break;
    case 7:
      return [column - 1, stagger + row + 1]
      break;
    case 8:
      return [column - 1, stagger + row]
      break;
    case 9:
      return [column - 2, row]
      break;
    case 10:
      return [column - 1, stagger + row - 1]
      break;
    case 11:
      return [column - 1, stagger + row - 2]
      break;
  }
}

