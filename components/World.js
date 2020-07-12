import React, { useState, useEffect } from 'react';
import Canvas from '../components/Canvas';

export default function World(props) {
  const [turn, setTurn] = useState(1);

  const handleRightClick = (target) => {
    // move if a confirmatory click
    if(target === props.character.target) {
      return props.character.move();
    }

    if(target.impassable) { return; }

    // set the target for the character
    props.character.setTarget(target);

    // ignore the click if the character is already at the target
    if(target.row === props.character.row && target.column === props.character.column) return;

    // clear the previous target and set the new one
    props.grid.all((pixel) => pixel.setTarget(false));
    target.setTarget(true);

    // clear the previous character path and grid pathdata
    props.character.setPath([]);
    props.grid.all((pixel) => pixel.setPathData(null));

    // recursively pathfind
    plotPath(target, props.character);
  }

  useEffect(() => {
    window.document.onkeyup = function(e) {
      e.preventDefault();

      if(e.keyCode == 32) { nextTurn(); }
    }
  })

  const plotPath = (target, head = { row: props.character.row, column: props.character.column }, tilesTravelled = 1) => {
    if(target.row === head.row && target.column === head.column) return;

    const nextPixel = props.grid.nextPixel(head, target)
    nextPixel.setPathData({ reachable: tilesTravelled <= props.character.movementRemaining })

    props.character.setPath([...props.character.path, nextPixel]);

    plotPath(target, nextPixel, tilesTravelled + 1)
  }

  const nextTurn = () => {
    props.character.movementRemaining = props.character.speed;

    setTurn(turn + 1);
  }

  return(
    <div>
      <Canvas 
        rows={props.rows} 
        columns={props.columns} 
        grid={props.grid} 
        character={props.character} 
        tileSize={props.tileSize} 
        onRightClick={handleRightClick}
        turn={turn} />
        <p className="help">Press Spacebar to end turn.</p>
    </div>
  )
}