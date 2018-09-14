const OUTOFBOUNDS = -1;

function HexGrid(columns, rows) { //object definition
  this.gridModel = []

  this.rules = {}

  for (let i = 0; i < columns; i++) {
    this.gridModel[i] = []
    for (let j = 0; j < rows; j++) {
      this.gridModel[i][j] = 0;
    }
  }

  this.getNeighborState = function(column, row, neighborIndex) {
    let coords = getNeighborCoords(column, row, neighborIndex);
    return (this.getState(coords[0], coords[1]));
  }

  this.getNeighborHood = function(column, row) {
    let result = []
    for (let i = 0; i < 12; i++) {
      result.push(this.getNeighborState(column, row, i));
    }
    result.push(this.getState(column, row));
    return result;
  }

  this.getState = function(column, row){
    if (!this.isInBounds(column, row)) {
      return OUTOFBOUNDS;
    } else {
      return this.gridModel[column][row];
    }
  }

  this.setState = function(column, row, newState) {
    if (this.getState(column, row) != OUTOFBOUNDS) {
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
}


// 12 total neighbors, neighbor directly above is 0 
// and then the indices are enumerated clockwise
function getNeighborCoords(column, row, neighborIndex) {
  switch(neighborIndex) {
    case 0:
      return [column, row + 1]
      break;
    case 1:
      return [column + 1, row + 2]
      break;
    case 2:
      return [column + 1, row + 1]      
      break;
    case 3:
      return [column + 2, row]
      break;
    case 4:
      return [column + 1, row]
      break;
    case 5:
      return [column + 1, row - 1]
      break;
    case 6:
      return [column, row - 1]
      break;
    case 7:
      return [column - 1, row - 1]
      break;
    case 8:
      return [column - 1, row]
      break;
    case 9:
      return [column - 2, row]
      break;
    case 10:
      return [column - 1, row + 1]
      break;
    case 11:
      return [column - 1, row + 2]
      break;
  }
}

