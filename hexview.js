const COLORMAP = {0: 255, 1: 51};

function HexView(hexGrid, offsetX, offsetY, radius) { //object definition

  this.innerRadius = (sqrt(3) / 2) * radius;

  this.display = function() {
    for (let column = 0; column < hexGrid.model.length; column++) {
      for (let row = 0; row < hexGrid.model[column].length; row++) {
        if (hexGrid.getState(column, row) != OUTOFBOUNDS) {
          let coords = this.getXY(column, row, radius);
          let color = COLORMAP[hexGrid.getState(column, row)];
          drawHexagon(coords[0], coords[1], radius, color);
        }
      }
    }
  }

  // TODO fix these methods to work with offset hexagon grid. 
  // Perhaps I should make a hexgridview object which stores radius, offsets
  // and controls the model
  this.getXY = function(column, row) {
    let x = (column * radius * 3/2) + radius;
    let y = (row * this.innerRadius * 2) + this.innerRadius;
    if (column % 2) { //stagger hexagons on odd rows
      y += this.innerRadius;
    }
    return [x + offsetX, y + offsetY];
  }

  this.getCR = function(x, y) {
    x -= offsetX;
    y -= offsetY;
    let column = Math.round((2/3)*(x/radius - 1))
    if (column % 2) { //stagger hexagons on odd rows
      y -= this.innerRadius;
    }
    let row = Math.round((y - this.innerRadius) / (this.innerRadius * 2))
    let result = [column, row];
    return result;
  }
}
