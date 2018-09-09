function HexGrid(columns, rows) { //object definition
	this.model = []

	for (var i = 0; i < columns; i++) {
		this.model[i] = []
		for (var j = 0; j < rows; j++) {
			this.model[i][j] = 0;
		}
	}

	// todo, make function which gets xy from coll,row and have display use
	// that instead of calculating locations itself
	this.display = function(radius) {
		var inner_radius = (sqrt(3) / 2) * radius;
		for (var coll = this.model.length - 1; coll >= 0; coll--) {
			for (var row = this.model[coll].length - 1; row >= 0; row--) {
				var x = (coll * radius * 3/2) + radius;
				var y = (row * inner_radius * 2) + inner_radius;
				if (coll % 2) { //stagger hexagons on odd rows
					y += inner_radius;
				}
				hexagon(x, y, radius);
			}
		}
	}

	this.getNeighborState = function(column, row, neighborIndex) {
		var c, r = getNeighborCoords(column, row, neighborIndex);
		return (this.model[c][r]);
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

function hexagon(x, y, radius) {
  var angle = TWO_PI / 6;
  beginShape();
  for (var a = 0; a < TWO_PI; a += angle) {
    var sx = x + cos(a) * radius;
    var sy = y + sin(a) * radius;
    vertex(sx, sy);
  }
  endShape(CLOSE);	
}