import React, { useState } from 'react';

export default function Menu(props) {
  const [thing, setThing] = useState(null);

  const handleClick = (item) => {
    if(item.constructor.name == 'Thing') {
      setThing(item);
    };

    props.onClick(item, thing)
  }

  const panesOrNothing = () => {
    const panes = props.menu.panes;

    if(panes === undefined) return;

    return(
      panes.map(pane => {
        return(
          <div key={pane.title} className="menu__pane">
            <p className="pane__title">{ pane.title }</p>

            { pane.items.map(item => <div key={pane.items.indexOf(item)} className="menu__item" onClick={ (e) => { handleClick(item, e) } }>{item.name}</div>) }
          </div>
        )
      })
    )
  }

  return(
    <div className="menu" style={ { top: props.menu.top, left: props.menu.left } }>
      { panesOrNothing() }
      <style jsx>{`
        .menu {
          position: absolute;
          padding: 0 0.5rem;
          display: flex;
          flex-direction: column;
          justify-content: center;
          align-items: center;
        }

        * {
          padding: 0.5rem 1rem;
          background: white;
          border: 1px solid #dfdfdf;
          cursor: pointer;
        }

        *:hover {
          background: #fafafa;
        }
      `}</style>
    </div>
  )
}