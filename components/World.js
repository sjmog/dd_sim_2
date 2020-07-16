import React, { useState, useEffect } from 'react';
import Canvas from './Canvas';
import Menu from './Menu';

export default function World(props) {
  const ENTER = 32
  const A = 65
  const M = 77

  const [turn, setTurn] = useState(1);
  const [mode, setMode] = useState("movement");
  const [menu, setMenu] = useState({ panes: [] });

  const handleMovement = (target) => {
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

  const handleAction = (target, event) => {
    // set the target for the character
    props.character.setTarget(target);

    // clear the previous target and set the new one
    props.grid.all((pixel) => pixel.setTarget(false));
    target.setTarget(true);

    // add some text to the menu
    setMenu({ 
      panes: [
        { title: "Things", items: target.things }
      ], 
      top: event.clientY, 
      left: event.clientX 
    })
    // render that text to the canvas somehow

    // make the pixels containing that text respond to a left-click by activating that action
  }

  const handleRightClick = (target, event) => {
    if(mode === "movement") handleMovement(target);
    if(mode === "action") handleAction(target, event);
  }

  const handleMenuClick = (item, thing) => {
    console.log('clicked menu item', item);
    if(item.name === "Attack") {
      props.character.attack(thing);
      return setMenu({ panes: [] });
    }

    setMenu({ panes: [...menu.panes, {title: "Actions", items: [{ name: "Attack" }]}], top: menu.top, left: menu.left });
  }

  useEffect(() => {
    window.document.onkeyup = function(e) {
      e.preventDefault();

      if(e.keyCode == ENTER) { nextTurn(); }
      if(e.keyCode == A) { setMode("action"); }
      if(e.keyCode == M) { setMode("movement"); }
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
    for(let i = 0; i < props.entities.length; i++) {
      const entity = props.entities[i];

      if(entity.target) { plotPath(entity.target, entity) }
    }

    // this will also force a rerender
    setTurn(turn + 1);
    setMode("movement")
  }

  return(
    <div>
      <Canvas
        rows={props.rows} 
        columns={props.columns} 
        grid={props.grid} 
        entities={props.entities}
        character={props.character} 
        tileSize={props.tileSize} 
        onRightClick={handleRightClick}
        turn={turn} />
        <p className="help">Press Spacebar to end turn.</p>
        <p className="help">Current Mode: {mode}</p>

      <Menu menu={menu} onClick={handleMenuClick} />
    </div>
  )
}