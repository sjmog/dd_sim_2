import React, { useState, useEffect } from 'react';
import Message from './Message';
import { CSSTransitionGroup } from 'react-transition-group';

export default function MessageBoard(props) {
  const [width, setWidth] = useState('auto')

  useEffect(() => setWidth((window.innerWidth - props.gridColumns * props.tileSize) / 2))

  const messages = () => {
    return props.messages.map((message, index) => <Message key={ index } tileSize={ props.tileSize } { ...message } />);
  }

  return (
    <div className="message-board" style={ { width: width } }>
      <CSSTransitionGroup
        transitionName="message"
        transitionEnterTimeout={300}
        transitionLeaveTimeout={300}>
        { messages() }
      </CSSTransitionGroup>

      <style jsx>{`
        .message-board {
          position: relative;
          display: flex;
          flex-direction: column;
          justify-content: flex-end;
          align-items: left;
          padding: 0 1rem;
          height: ${ props.gridRows * props.tileSize }px;
          overflow: hidden;
        }
      `}</style>
    </div>
  )
};