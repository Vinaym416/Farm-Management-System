import React, { useState } from 'react';
import { sendMessage } from '../services/websocket';

const MessageInput = ({ recipientId }) => {
    const [message, setMessage] = useState('');

    const handleSendMessage = (e) => {
        e.preventDefault();
        if (message.trim() && recipientId) {
            sendMessage({ recipientId, message });
            setMessage('');
        }
    };

    return (
        <form onSubmit={handleSendMessage} className="message-input">
            <input
                type="text"
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                placeholder="Type your message..."
                required
            />
            <button type="submit">Send</button>
        </form>
    );
};

export default MessageInput;