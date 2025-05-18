import React, { useState, useEffect } from 'react';
import { helpdeskService } from "../../services/helpdeskService";
import { toast } from "react-toastify";
import io from 'socket.io-client';
import axios from 'axios';

const socket = io('http://localhost:3000');
const ADMIN_ID = 2;
const FARMER_ID = 1;

const AdminHelpdesk = () => {
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState('');
  const [adminName, setAdminName] = useState('');
  const [loading, setLoading] = useState(false);
  const [replyingTo, setReplyingTo] = useState(null);

  useEffect(() => {
    const firstName = localStorage.getItem('firstName');
    const lastName = localStorage.getItem('lastName');
    const fullName = `${firstName} ${lastName}`.trim();
    setAdminName(fullName);

    // Fetch initial messages using socket/axios
    const fetchInitialMessages = async () => {
      try {
        setLoading(true);
        const response = await axios.get(`http://localhost:3000/messages/${ADMIN_ID}/${FARMER_ID}`);
        const formattedMessages = response.data.map(msg => ({
          id: msg.id || Date.now(),
          text: msg.message,
          senderName: msg.sender_id === ADMIN_ID ? adminName : 'Farmer',
          isFromAdmin: msg.sender_id === ADMIN_ID,
          timestamp: new Date(msg.timestamp || Date.now()).toLocaleTimeString()
        }));
        setMessages(formattedMessages);
      } catch (error) {
        console.error('Error fetching messages:', error);
        toast.error("Failed to fetch messages");
      } finally {
        setLoading(false);
      }
    };

    fetchInitialMessages();

    // Socket listener for new messages
    socket.on('receiveMessage', (data) => {
      if ((data.sender_id === ADMIN_ID && data.receiver_id === FARMER_ID) ||
          (data.sender_id === FARMER_ID && data.receiver_id === ADMIN_ID)) {
        const newMessage = {
          id: Date.now(),
          text: data.message,
          senderName: data.sender_id === ADMIN_ID ? adminName : 'Farmer',
          isFromAdmin: data.sender_id === ADMIN_ID,
          timestamp: new Date().toLocaleTimeString()
        };
        setMessages(prev => [...prev, newMessage]);
      }
    });

    return () => socket.off('receiveMessage');
  }, [adminName]);

  const handleReply = (messageId) => {
    const messageToReply = messages.find(msg => msg.id === messageId);
    if (messageToReply) {
      setReplyingTo(messageToReply);
      setInput(`@${messageToReply.senderName} `);
    }
  };

  const handleSendMessage = async () => {
    if (input.trim() && adminName) {
      try {
        // Emit message through socket
        socket.emit('sendMessage', {
          sender_id: ADMIN_ID,
          receiver_id: FARMER_ID,
          message: input
        });

        // Add message to local state
        const newMessage = {
          id: Date.now(),
          text: input,
          senderName: adminName,
          isFromAdmin: true,
          timestamp: new Date().toLocaleTimeString(),
          replyToId: replyingTo?.id || null,
          repliedToText: replyingTo?.text || null,
          repliedToSender: replyingTo?.senderName || null
        };

        setMessages(prev => [...prev, newMessage]);
        setInput('');
        setReplyingTo(null);
        toast.success("Message sent successfully!");
      } catch (error) {
        console.error('Error sending message:', error);
        toast.error("Failed to send message");
      }
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 p-6">
      <div className="max-w-screen-md mx-auto">
        <div className="bg-white rounded-2xl shadow-xl p-8">
          <div className="flex justify-between items-center mb-6">
            <h1 className="text-2xl font-bold text-gray-800">Message Board</h1>
            <button
              onClick={() => {
                setLoading(true);
                setMessages([]);
              }}
              className="px-4 py-2 bg-indigo-500 text-white rounded-lg hover:bg-indigo-600"
            >
              Refresh
            </button>
          </div>

          <div className="h-[500px] overflow-y-auto border rounded-lg p-4 mb-4 bg-gray-50">
            {loading ? (
              <div className="text-center text-gray-500">Loading messages...</div>
            ) : messages.length > 0 ? (
              messages.map((message) => (
                <div
                  key={message.id}
                  className={`mb-4 ${message.isFromAdmin ? 'text-right' : 'text-left'}`}
                >
                  <div
                    className={`inline-block max-w-[80%] p-4 rounded-lg ${
                      message.isFromAdmin
                        ? 'bg-indigo-500 text-white'
                        : 'bg-gray-200'
                    }`}
                  >
                    <p className="font-semibold text-sm mb-1">
                      {message.senderName}
                    </p>
                    <p className="text-base">{message.text}</p>
                    <p className="text-xs mt-2 opacity-75">
                      {message.timestamp}
                    </p>
                    {!message.isFromAdmin && (
                      <button
                        onClick={() => handleReply(message.id)}
                        className="text-xs mt-2 underline hover:opacity-75"
                      >
                        Reply
                      </button>
                    )}
                  </div>
                </div>
              ))
            ) : (
              <p className="text-center text-gray-500">No messages yet</p>
            )}
          </div>

          <div className="flex flex-col gap-2">
            {replyingTo && (
              <div className="text-sm text-gray-500 ml-2">
                Replying to {replyingTo.senderName}
                <button
                  onClick={() => {
                    setReplyingTo(null);
                    setInput('');
                  }}
                  className="ml-2 text-red-500 hover:text-red-600"
                >
                  ×
                </button>
              </div>
            )}
            <div className="flex gap-2">
              <input
                type="text"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyPress={(e) => e.key === 'Enter' && handleSendMessage()}
                placeholder="Type your message..."
                className="flex-1 p-3 border rounded-lg focus:ring-2 focus:ring-indigo-500 outline-none"
              />
              <button
                onClick={handleSendMessage}
                className="px-6 py-3 bg-indigo-500 text-white rounded-lg hover:bg-indigo-600"
              >
                Send
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminHelpdesk;