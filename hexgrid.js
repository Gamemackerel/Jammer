function HexGrid(columns, rows) { //object definition
	this.model = []

	for (var i = 0; i < columns; i++) {
		this.model[i] = []
		for (var j = 0; j < rows; j++) {
			this.model[i][j] = 0;
		}
	}

	this.getNeighborState = function(column, row, neighborIndex) {
		var c, r = getNeighborCoords(column, row, neighborIndex);
		return (this.model[c][r]);
	}

	this.getNeighborHood = function(column, row) {
		var result = []
		for (var i = 0; i < 12; i++) {
			result.push(this.getNeighborState(column, row, i));
		}
		return result;
	}

	this.getState = function(column, row){
		return this.model[column][row];
	}
}



// 12 total neighbors, neighbor directly above is 0 
// and then the indices are enumerated around clockwise
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

