import React, { useState, useEffect, useRef } from 'react';
import './App.css';

import socket from 'socket.io-client';
const io = socket.connect('http://localhost:1000');

const App = () => {
  const [messages, changeMessages] = useState([]);

  const scrollRef = useRef(null);

  useEffect(() => {
    io.on('serverMessage', (message) => {
      changeMessages((oldMessages) => [...oldMessages, message]);
    });
  }, []);

  const scrollToBottom = () => {
    scrollRef.current.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(scrollToBottom, [messages]);

  return (
    <div className="App">
      <div className="Content">
        {messages.map((message, index) => (
          <div className="Message" key={message.displayName + message.date}>
            <div
              style={{
                width: '100%',
                display: 'flex',
                flexDirection: 'row',
                alignItems: 'center',
                justifyContent: 'flex-start',
              }}>
              <h1>{message.displayName}</h1>
              {message.isBroad ? (
                <img
                  alt="Boradcaster"
                  style={{ width: 20, height: 20 }}
                  src={'https://img.icons8.com/cotton/2x/record.png'}
                />
              ) : null}
              {message.isMod ? (
                <img
                  alt="Moderator"
                  style={{ width: 20, height: 20 }}
                  src={
                    'https://cdn.iconscout.com/icon/free/png-256/sword-1777408-1512000.png'
                  }
                />
              ) : null}
            </div>
            <p>{message.message}</p>
            <p>{message.date}</p>
          </div>
        ))}
        <div ref={scrollRef} />
      </div>
    </div>
  );
};

export default App;
