import React, { useEffect } from 'react';
import World from './World';
import { Grid, Pixel, Character, Entity } from '../src';

export default function Game(props) {
  const TILE_SIZE = 36;
  const COLUMNS = 20;
  const ROWS = 15;

  const CHARACTER = new Character(2, 2);
  const ENTITIES = [CHARACTER, new Entity('Goblin', { ac: 11, hp: 8, column: 8, row: 9 })];
  const GRID = new Grid(ROWS, COLUMNS);

  const setupMap = (grid) => {
    // add an impassable tile (testing)
    grid.pixel(4, 4).setImpassable(true);
  }

  setupMap(GRID);

  return(
    <World
      rows={ROWS}
      columns={COLUMNS}
      grid={GRID}
      entities={ENTITIES}
      character={CHARACTER}
      tileSize={TILE_SIZE} />
  );
};