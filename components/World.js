import React, { useState, useEffect } from 'react';
import Canvas from './Canvas';
import MessageBoard from './MessageBoard';
import DetailsPanel from './DetailsPanel';
import Menu from './Menu';

export default function World(props) {
  const ENTER = 32
  const A = 65
  const M = 77

  const [mode, setMode] = useState("movement");
  const [menu, setMenu] = useState({ panes: [] });
  const [turnCount, setTurnCount] = useState(1);
  const [messages, setMessages] = useState([]);

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
        { title: "Entities", items: [...target.entities, ...props.entities.filter(entity => entity.row === target.row && entity.column === target.column)] }
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
      if(e.keyCode == A) { changeMode("action"); }
      if(e.keyCode == M) { changeMode("movement"); }
    }
  })

  const plotPath = (target, head = { row: props.character.row, column: props.character.column }, tilesTravelled = 1) => {
    if(target.row === head.row && target.column === head.column) return;

    const nextPixel = props.grid.nextPixel(head, target)
    nextPixel.setPathData({ reachable: tilesTravelled <= props.character.movementRemaining })

    props.character.setPath([...props.character.path, nextPixel]);

    plotPath(target, nextPixel, tilesTravelled + 1)
  }

  const changeMode = (mode) => {
    addMessage({ type: 'info', text: `Changed mode to ${ mode }.` });
    setMode(mode);
  }

  const nextTurn = () => {
    props.character.movementRemaining = props.character.speed;

    for(let i = 0; i < props.entities.length; i++) {
      const entity = props.entities[i];

      if(entity.target) { plotPath(entity.target, entity) }
    }

    // this will also force a rerender
    setTurnCount(turnCount + 1);
    setMode("movement")
  }

  const addMessage = (message) => {
    setMessages([...messages, message]);
  }

  return(
    <div>
      <div className="ui">
        <DetailsPanel gridColumns={props.columns} tileSize={props.tileSize} />
        <Canvas
          rows={props.rows} 
          columns={props.columns} 
          grid={props.grid} 
          entities={props.entities}
          character={props.character} 
          tileSize={props.tileSize} 
          onRightClick={handleRightClick}
          turnCount={turnCount} />
        <MessageBoard gridRows={props.rows} gridColumns={props.columns} tileSize={props.tileSize} messages={messages} />
      </div>

      <div className="hints">
        <p className="help">Press Spacebar to end turn.</p>
        <p className="help">Current Mode: {mode}</p>
      </div>

      <Menu menu={menu} onClick={handleMenuClick} />

      <style jsx>{`
        .ui {
          width: 100vw;
          display: flex;
          flex-direction: row;
          justify-content: center;
          align-items: center;
        }
      `}</style>
    </div>
  )
}