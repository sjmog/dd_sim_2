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

  const handleRightClick = (target) => {
    // move if a confirmatory click
    if(target === CHARACTER.target) {
      return CHARACTER.move();
    }

    // set the target for the character
    CHARACTER.setTarget(target);

    // ignore the click if the character is already at the target
    if(target.row === CHARACTER.row && target.column === CHARACTER.column) return;

    // clear the previous target and set the new one
    GRID.forEach((row) => row.forEach((pixel) => pixel.setTarget(false)));
    target.setTarget(true);

    // clear the previous character path and grid pathdata
    CHARACTER.setPath([]);
    GRID.forEach((row) => row.forEach((pixel) => pixel.setPathData(null)))

    // recursively pathfind
    plotPath(target, CHARACTER);
  }

  const distanceBetween = (pixelA, pixelB) => {
    return Math.sqrt(Math.pow(Math.abs(pixelA.column - pixelB.column), 2) + Math.pow(Math.abs(pixelA.row - pixelB.row), 2))
  }

  const plotPath = (target, head = { row: CHARACTER.row, column: CHARACTER.column }, tilesTravelled = 1) => {
    if(target.row === head.row && target.column === head.column) return;

    // check the tiles around
    const topExists = head.row - 1 > 0;
    const rightExists = head.column + 1 < COLUMNS;
    const bottomExists = head.row + 1 < ROWS;
    const leftExists = head.column - 1 > 0;

    const tilesAround = [];

    if(topExists) {
      tilesAround.push(GRID[head.row - 1][head.column]);
    }

    if(topExists && rightExists) {
      tilesAround.push(GRID[head.row - 1][head.column + 1]);
    }

    if(rightExists) {
      tilesAround.push(GRID[head.row][head.column + 1]);
    }

    if(rightExists && bottomExists) {
      tilesAround.push(GRID[head.row + 1][head.column + 1]);
    }

    if(bottomExists) {
      tilesAround.push(GRID[head.row + 1][head.column]);
    }

    if(bottomExists && leftExists) {
      tilesAround.push(GRID[head.row + 1][head.column - 1]);
    }

    if(leftExists) {
      tilesAround.push(GRID[head.row][head.column - 1]);
    }

    if(leftExists && topExists) {
      tilesAround.push(GRID[head.row - 1][head.column - 1]);
    }

    // for each, see if they are closer to the target
    const distances = tilesAround.map((pixel) => distanceBetween(pixel, target))

    // if so, choose that path
    const nextTile = tilesAround[distances.indexOf(Math.min(...distances))]
    nextTile.setPathData({ reachable: tilesTravelled <= CHARACTER.movementRemaining })

    CHARACTER.setPath([...CHARACTER.path, nextTile]);

    plotPath(target, nextTile, tilesTravelled + 1)
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