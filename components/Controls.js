import React from 'react';

export default function Controls(props) {
  return(
    <div className="controls">
      <button onClick={props.nextTurn}>Next Turn</button>
    </div>
  )
}