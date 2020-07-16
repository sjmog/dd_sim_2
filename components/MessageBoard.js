import React, { useState, useEffect } from 'react';

export default function MessageBoard(props) {
  const [width, setWidth] = useState('auto')

  useEffect(() => setWidth((window.innerWidth - props.gridColumns * props.tileSize) / 2))

  return (
    <div className="message-board" style={ { width: width } }>
      Message
    </div>
  )
};