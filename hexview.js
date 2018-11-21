const COLORMAP = {0: 255, 1: 0};

function HexGridView(hexGrid, positionX, positionY, radius) { //object definition

  this.innerRadius = (sqrt(3) / 2) * radius;
  this.naturalOffsetY = -((hexGrid.rows(0)) * this.innerRadius) - .5 * this.innerRadius;
  this.naturalOffsetX = -((hexGrid.columns) * radius * 3/4) - .25 * radius;


  // TODO optimize this method since it gets run every frame
  this.display = function() {
    for (let column = 0; column < hexGrid.columns; column++) {
      for (let row = 0; row < hexGrid.rows(column); row++) {
        if (hexGrid.getState(column, row) != OUTOFBOUNDS) {
          let coords = this.getXY(column, row, radius);
          let color = COLORMAP[hexGrid.getState(column, row)];
          drawHexagon(coords[0], coords[1], radius, color);
        }
      }
    }
  }
  
  this.getXY = function(column, row) {
    let x = (column * radius * 3/2) + radius;
    let y = (row * this.innerRadius * 2) + this.innerRadius;
    if (!(column % 2)) { //stagger hexagons on odd columns
      y += this.innerRadius;
    }
    return [x + positionX + this.naturalOffsetX, y + positionY + this.naturalOffsetY];
  }

  // This function could be improved to better map the hexagon either by
  // using vertexes or a clever composition of inner and outer circles
  this.getCR = function(x, y) {
    x -= positionX + this.naturalOffsetX;
    y -= positionY + this.naturalOffsetY;
    let column = Math.round((2/3)*(x/radius - 1))
    if (!(column % 2)) { //stagger hexagons on odd columns
      y -= this.innerRadius;
    }
    let row = Math.round((y - this.innerRadius) / (this.innerRadius * 2))
    let result = [column, row];
    return result;
  }
}

// Draws a hexagon with the given position, radius, color, and label
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





