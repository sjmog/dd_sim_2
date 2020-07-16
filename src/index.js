import { d } from '../utils';

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
  this.entities = [new Entity('ground', { ac: 0, hp: Infinity, column: column, row: row })];

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

  this.addEntity = (entity) => {
    this.entities = [...this.entities, thing];
  }
}

const Entity = function(name, properties) {
  // presentational data
  this.column = properties.column;
  this.row = properties.row;
  this.name = name;
  this.properties = properties;

  this.damage = (amount) => {
    this.properties.hp -= amount;

    if(this.properties.hp < 0) { this.properties.hp = 0; this.die() }
  }

  this.die = () => {
    console.log(`${ name } died!`)
  }

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

    const attackRoll = d(20);

    if(attackRoll < thing.properties.ac) {
      console.log('character misses with a roll of', attackRoll)
    } else {
      console.log('character hits with a roll of', attackRoll)

      const damageRoll = d(8);

      thing.damage(damageRoll)

      console.log(`character deals ${damageRoll} damage. ${thing.name} has ${thing.properties.hp} hit points remaining.`)
    }
  }
}

module.exports = { Grid, Pixel, Entity, Character };