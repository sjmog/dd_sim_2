import React, { useEffect, useRef, useState } from 'react';
import { drawSquare } from '../utils';

export default function Canvas(props) {
  const CANVAS_WIDTH = props.tileSize * props.columns;
  const CANVAS_HEIGHT = props.tileSize * props.rows;

  const canvasRef = useRef(null);
  const [context, setContext] = useState(null);

  const drawPixel = (pixel) => {
    const x = props.tileSize * (pixel.column - 1);
    const y = props.tileSize * (pixel.row - 1);
    const color = pixel.color();

    drawSquare(context, x, y, props.tileSize, color)
  }

  const drawGrid = () => {
    for(let i = 1; i <= props.rows; i++) {
      for(let j = 1; j <= props.columns; j++) {
        drawPixel(props.grid.pixel(i, j));
      }
    }
  }

  const drawCharacter = () => {
    drawPixel(props.character, props.tileSize, 'red');
  }

  const drawEntity = (entity) => {
    drawPixel(entity, props.tileSize, entity.color());
  }

  useEffect(() => {
    const canvas = canvasRef.current;
    setContext(canvas.getContext("2d"));

    if(context === undefined || context === null) return;

    canvas.onmousemove = function(e) {
      const rect = this.getBoundingClientRect(),
            x = e.clientX - rect.left,
            y = e.clientY - rect.top

      if(x < 0 || y < 0 || x > props.columns * props.tileSize || y > props.rows * props.tileSize) return;

      // unset all previous hovers
      props.grid.all((pixel) => pixel.setHover(false));

      // set the pixel to hover
      props.grid.pixel(Math.floor(y / props.tileSize) + 1, Math.floor(x / props.tileSize) + 1).setHover(true);
    }

    canvas.oncontextmenu = function(e) {
      e.preventDefault();

      const rect = this.getBoundingClientRect(),
            x = e.clientX - rect.left,
            y = e.clientY - rect.top

      if(x < 0 || y < 0 || x > canvas.width - props.tileSize - 1 || y > canvas.height) return;

      const column = Math.floor(x / props.tileSize) + 1;
      const row = Math.floor(y / props.tileSize) + 1;
      const target = props.grid.pixel(row, column);

      props.onRightClick(target);
    }

   let animationFrameId = requestAnimationFrame(renderFrame);

   function renderFrame() {
     animationFrameId = requestAnimationFrame(renderFrame);
     drawGrid();
     drawCharacter();

     for(let i = 0; i < props.entities.length; i++) {
      drawEntity(props.entities[i]);
     }
   }

    return () => cancelAnimationFrame(animationFrameId);
  })

  return(
    <div>
      <canvas ref={canvasRef} width={CANVAS_WIDTH} height={CANVAS_HEIGHT} />
    </div>
  );
}