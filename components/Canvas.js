import React, { useEffect, useRef, useState } from 'react';
import { drawSquare } from '../utils';
import { Grid, Pixel, Character } from '../src';

export default function Canvas(props) {
  const TILE_SIZE = 36;
  const COLUMNS = 30;
  const ROWS = 20;

  const CANVAS_WIDTH = TILE_SIZE * COLUMNS;
  const CANVAS_HEIGHT = TILE_SIZE * ROWS;

  const canvasRef = useRef(null);
  const [context, setContext] = useState(null);

  const CHARACTER = new Character(2, 2);

  const GRID = new Grid(ROWS, COLUMNS);

  const drawPixel = (pixel) => {
    const x = TILE_SIZE * (pixel.column - 1);
    const y = TILE_SIZE * (pixel.row - 1);

    drawSquare(context, x, y, TILE_SIZE, pixel.color())
  }

  const drawGrid = () => {
    for(let i = 0; i < GRID.length; i++) {
      for(let j = 0; j < GRID[i].length; j++) {
        drawPixel(GRID[i][j]);
      }
    }
  }

  const drawCharacter = () => {
    drawPixel(CHARACTER, TILE_SIZE, 'red');
  }

  const distanceBetween = (pixelA, pixelB) => {
    return Math.sqrt(Math.pow(Math.abs(pixelA.column - pixelB.column), 2) + Math.pow(Math.abs(pixelA.row - pixelB.row), 2))
  }

  const plotMovement = (target, head = { row: CHARACTER.row, columns: CHARACTER.column }, tilesTravelled = 1) => {
    if(target.row === head.row && target.column === head.column) return;

    // check the tiles around
    const tilesAround = [
                          GRID[head.row - 1][head.column],
                          GRID[head.row - 1][head.column + 1],
                          GRID[head.row][head.column + 1],
                          GRID[head.row + 1][head.column + 1],
                          GRID[head.row + 1][head.column],
                          GRID[head.row + 1][head.column - 1],
                          GRID[head.row][head.column - 1],
                          GRID[head.row - 1][head.column - 1],
                        ]
    // for each, see if they are closer to the target
    const distances = tilesAround.map((pixel) => distanceBetween(pixel, target))

    // if so, choose that path
    const nextTile = tilesAround[distances.indexOf(Math.min(...distances))]
    nextTile.setPathData({ reachable: tilesTravelled <= CHARACTER.speed })

    CHARACTER.target(nextTile);

    plotMovement(target, nextTile, tilesTravelled + 1)
  }

  useEffect(() => {
    const canvas = canvasRef.current;
    setContext(canvas.getContext("2d"));

    if(context === undefined || context === null) return;

    canvas.onmousemove = function(e) {
      const rect = this.getBoundingClientRect(),
            x = e.clientX - rect.left,
            y = e.clientY - rect.top

      if(x < 0 || y < 0 || x > canvas.width - TILE_SIZE - 1 || y > canvas.height - TILE_SIZE) return;

      GRID.forEach((row) => row.forEach((pixel) => pixel.setHover(false)))
      const hoveredPixel = GRID[Math.floor(y / TILE_SIZE) + 1][Math.floor(x / TILE_SIZE) + 1];
      hoveredPixel.setHover(true);
    }

    canvas.oncontextmenu = function(e) {
      e.preventDefault();

      const rect = this.getBoundingClientRect(),
            x = e.clientX - rect.left,
            y = e.clientY - rect.top

      if(x < 0 || y < 0 || x > canvas.width - TILE_SIZE - 1 || y > canvas.height) return;

      const column = Math.floor(x / TILE_SIZE) + 1;
      const row = Math.floor(y / TILE_SIZE) + 1;
      const target = GRID[row][column];

      if(column === CHARACTER.targetColumn && row === CHARACTER.targetRow) {
        CHARACTER.move(target);
        GRID.forEach((row) => row.forEach((pixel) => pixel.setPathData(null)))
        return;
      }

      GRID.forEach((row) => row.forEach((pixel) => pixel.setTarget(false)))
      target.setTarget(true);

      if(target.row === CHARACTER.row && target.column === CHARACTER.column) return;

      GRID.forEach((row) => row.forEach((pixel) => pixel.setPathData(null)))

      plotMovement(target, CHARACTER);
    }

   let animationFrameId = requestAnimationFrame(renderFrame);

   function renderFrame() {
     animationFrameId = requestAnimationFrame(renderFrame);
     drawGrid();
     drawCharacter();
   }

    return () => cancelAnimationFrame(animationFrameId);
  })

  return(
    <div>
      <canvas ref={canvasRef} width={CANVAS_WIDTH} height={CANVAS_HEIGHT} />
    </div>
  );
}