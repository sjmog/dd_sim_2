const Grid = function(rows, columns) {
  return [...Array(rows).keys()].map(row => {
        return [...Array(columns).keys()].map(column => {
          return new Pixel(column, row);
        })
      })
}

const Pixel = function(column, row) {
  const TILE_SIZE = 36;
  this.DEFAULT_COLOR = '#fff';
  const HOVER_COLOR = 'yellow';
  const REACHABLE_PATH_COLOR = 'green';
  const PATH_COLOR = 'gray';
  const TARGET_COLOR = 'orange';

  // presentational data
  this.column = column;
  this.row = row;

  this.color = () => {
    if(this.isHoveredOver) return HOVER_COLOR;
    if(this.pathData) {
      if(this.pathData.reachable) return REACHABLE_PATH_COLOR;
      return PATH_COLOR;
    }
    if(this.isTarget) return TARGET_COLOR;
    return this.DEFAULT_COLOR;
  }

  //stateful data
  this.isHoveredOver = false;
  this.isTarget = false;
  this.isOnPath = false;

  this.setHover = (boolean) => {
    this.isHoveredOver = boolean;
  }

  this.setTarget = (boolean) => {
    this.isTarget = boolean;
  }

  this.setPathData = (data) => {
    this.pathData = data;
  }

  this.setReachable = (boolean) => {

  }
}

const Character = function(column, row) {
  // presentational data
  this.column = column;
  this.row = row;
  this.speed = 30 / 5; // 30 feet over 5-foot squares
  this.movementRemaining = this.speed; // default to fresh movement

  this.color = () => 'red';

  // stateful data
  this.path = [];

  this.move = () => {
    if(this.path.length === 0) return;

    for(let i = 0; this.movementRemaining > 0; i++) {
      const nextPixel = this.path[i];

      if(nextPixel === undefined) return;

      this.column = nextPixel.column;
      this.row = nextPixel.row;

      nextPixel.setPathData(null);

      this.movementRemaining--;
    }
  }

  this.setPath = (pixels) => {
    this.path = pixels;
  }

  this.setTarget = (pixel) => {
    this.target = pixel;
  }
}

module.exports = { Grid, Pixel, Character };