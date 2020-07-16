const Grid = function(rows, columns) {
  const pixels = [...Array(rows).keys()].map(rowIndex => {
        return [...Array(columns).keys()].map(columnIndex => {
          return new Pixel(columnIndex + 1, rowIndex + 1);
        })
      })
  // pixels.push.apply(pixels, arguments);
  pixels.__proto__ = Grid.prototype;
  return pixels;
}

Grid.prototype.__proto__ = Array.prototype;

Grid.prototype.pixel = function(column, row) {
  if(column < 1 || column > this.length || row < 1 || row > this[0].length) return null;

  return this[column - 1][row - 1];
}

Grid.prototype.all = function(cb) {
  for (let i = 0; i < this.length; i++) {
    for(let j = 0; j < this[i].length; j++) {
      cb(this[i][j])
    }
  }
}

const distanceBetween = (pixelA, pixelB) => {
  return Math.sqrt(Math.pow(Math.abs(pixelA.column - pixelB.column), 2) + Math.pow(Math.abs(pixelA.row - pixelB.row), 2))
}

// Could extract to a PathFinder service
// Or possibly just a Path object that takes a grid and two points and returns the path?
Grid.prototype.nextPixel = function(pixel, target) {
  const pixelsAround = this
                        .flat()
                        .filter((possiblePixel) => {
                          if(possiblePixel.impassable) return false;
                          const distance = distanceBetween(pixel, possiblePixel);
                          return distance <= Math.sqrt(2); // or distance === 1 || distance === Math.sqrt(2); (but in a single check)
                        });

  const distances = pixelsAround.map((pixel) => distanceBetween(pixel, target))
  return pixelsAround[distances.indexOf(Math.min(...distances))]
}

const Pixel = function(column, row) {
  const TILE_SIZE = 36;
  this.DEFAULT_COLOR = '#fff';
  const IMPASSABLE_COLOR = '#000';
  const HOVER_COLOR = 'yellow';
  const REACHABLE_PATH_COLOR = 'green';
  const PATH_COLOR = 'gray';
  const TARGET_COLOR = 'orange';

  // presentational data
  this.column = column;
  this.row = row;

  this.color = () => {
    if(this.impassable) return IMPASSABLE_COLOR;
    if(this.pathData) {
      if(this.pathData.reachable) return REACHABLE_PATH_COLOR;
      return PATH_COLOR;
    }
    if(this.isHoveredOver) return HOVER_COLOR;
    if(this.isTarget) return TARGET_COLOR;
    return this.DEFAULT_COLOR;
  }

  //stateful data
  this.things = [new Thing('ground', { ac: 0, hp: Infinity })];

  this.impassable = false;
  this.isHoveredOver = false;
  this.isTarget = false;
  this.isOnPath = false;

  this.setImpassable = (boolean) => {
    this.impassable = boolean;
  }

  this.setHover = (boolean) => {
    this.isHoveredOver = boolean;
  }

  this.setTarget = (boolean) => {
    this.isTarget = boolean;
  }

  this.setPathData = (data) => {
    this.pathData = data;
  }

  this.addThing = (thing) => {
    this.things = [...this.things, thing];
  }
}

const Thing = function(name, properties) {
  this.name = name;
  this.text = name; // hmmmmm

  this.properties = properties;
}

const Entity = function(column, row, name) {
  // presentational data
  this.column = column;
  this.row = row;
  this.name = name;

  this.color = () => 'blue'
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

  this.setTarget = (target) => {
    this.target = target;
  }

  this.attack = (thing) => {
    console.log('character attacking', thing)

    const d20 = Math.floor(Math.random() * 20) + 1;

    if(d20 > thing.properties.ac) {
      console.log('character hits with a roll of', d20)

      const d8 = Math.floor(Math.random() * 8) + 1;

      thing.properties.hp -= d8

      console.log(`character deals ${d8} damage. ${thing.name} has ${thing.properties.hp} hit points remaining.`)
    }
  }
}

Character.prototype.__proto__ = Entity.prototype;

module.exports = { Grid, Pixel, Entity, Character };