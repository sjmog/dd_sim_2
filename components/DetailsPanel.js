// temporary object to push the messageboard over
// have a think about this and if you want it when you come to it!

import React, { useState, useEffect } from 'react';

export default function DetailsPanel(props) {
  const [width, setWidth] = useState('auto')

  useEffect(() => setWidth((window.innerWidth - props.gridColumns * props.tileSize) / 2))
  
  return(
    <div className="details-panel" style={ { width: width } }>
    </div>
  )
}