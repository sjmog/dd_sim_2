import React from 'react';

export default function Message(props) {
  return (
    <div className="message">
      { props.text }

      <style jsx>{`
        .message {
          line-height: ${props.tileSize}px;
        }

        .message-enter {
          opacity: 0.01;
          transform: translateY(1rem);

          transition: all 300ms ease-in-out;
        }

        .message-enter.message-enter-active {
          opacity: 1;
          transform: translateY(0);
        }

        .message-leave {
          opacity: 1;
          transform: translateY(0);
        }

        .message-leave.message-leave-active {
          opacity: 0.01;
        }
      `}</style>
    </div>
  )
}