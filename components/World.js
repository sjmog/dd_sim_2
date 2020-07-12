import React, { useEffect } from 'react';
import Canvas from '../components/Canvas';
import Controls from '../components/Controls';
import { Grid, Pixel, Character } from '../src';

export default function World(props) {
  const TILE_SIZE = 36;
  const COLUMNS = 20;
  const ROWS = 15;

  const CHARACTER = new Character(2, 2);
  const GRID = new Grid(ROWS, COLUMNS);

  const setupMap = (grid) => {
    // add an impassable tile (testing)

    grid.pixel(4, 4).setImpassable(true);
  }

  setupMap(GRID);

  const handleRightClick = (target) => {
    // move if a confirmatory click
    if(target === CHARACTER.target) {
      return CHARACTER.move();
    }

    // ignore the click if the character is already at the target
    if(target.row === CHARACTER.row && target.column === CHARACTER.column) return;

    // clear the previous target and set the new one
    GRID.all((pixel) => pixel.setTarget(false));
    target.setTarget(true);

    // clear the previous character path and grid pathdata
    CHARACTER.setPath([]);
    GRID.all((pixel) => pixel.setPathData(null));

    // recursively pathfind
    plotPath(target, CHARACTER);
  }

  const distanceBetween = (pixelA, pixelB) => {
    return Math.sqrt(Math.pow(Math.abs(pixelA.column - pixelB.column), 2) + Math.pow(Math.abs(pixelA.row - pixelB.row), 2))
  }

  const plotPath = (target, head = { row: CHARACTER.row, column: CHARACTER.column }, tilesTravelled = 1) => {
    if(target.row === head.row && target.column === head.column) return;

    const nextPixel = GRID.nextPixel(head, target)
    nextPixel.setPathData({ reachable: tilesTravelled <= CHARACTER.movementRemaining })

    CHARACTER.setPath([...CHARACTER.path, nextPixel]);

    plotPath(target, nextPixel, tilesTravelled + 1)
  }

  const nextTurn = () => {
    CHARACTER.movementRemaining = CHARACTER.speed;
  }

  return(
    <div>
      <Canvas 
        rows={ROWS} 
        columns={COLUMNS} 
        grid={GRID} 
        character={CHARACTER} 
        tileSize={TILE_SIZE} 
        onRightClick={handleRightClick} />
      <Controls character={CHARACTER} nextTurn={nextTurn} />
    </div>
  )
}