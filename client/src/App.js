import React, { useState, useEffect } from 'react';
import io from 'socket.io-client';

const Chat_DE_Namoro_para_Otaku = () => {
  const [messages, setMessages] = useState([]);
  const [messageInput, setMessageInput] = useState('');

  useEffect(() => {
    const socket = io('http://localhost:5000');

    socket.on('message', (message) => {
      setMessages((prevMessages) => [...prevMessages, message]);
    });

    return () => {
      socket.disconnect();
    };
  }, []);

  const handleSendMessage = () => {
    if (messageInput.trim() !== '') {
      const message = {
        text: messageInput,
        user: 'Usuário(a)',
      };

      setMessages([...messages, message]);
      setMessageInput('');

      // Envia a mensagem para o servidor via WebSocket
      io('http://localhost:5000').emit('message', message);
    }
  };

  return (
    <div>
      <div>
        {messages.map((message, index) => (
          <p  class ='user' key={index}>
            <strong >{message.user}:</strong> {message.text}
          </p>
        ))}
      </div>
      <div>
        <input
         placeholder='Mensagem'
          type="text"
          value={messageInput}
          onChange={(e) => setMessageInput(e.target.value)}
        />
        <button onClick={handleSendMessage}><i class="bi bi-check-circle-fill"></i></button>
      </div>
    </div>
  );
};

export default Chat_DE_Namoro_para_Otaku;
