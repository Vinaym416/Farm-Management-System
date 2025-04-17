import React, { useState, useEffect } from 'react';
import axios from 'axios';

const AdminHelpdesk = () => {
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState('');
  const [adminName, setAdminName] = useState('');
  const [loading, setLoading] = useState(false);
  const [replyingTo, setReplyingTo] = useState(null);

  const fetchMessages = async () => {
    try {
      setLoading(true);
      const loggedInAdmin = `${localStorage.getItem('firstName')} ${localStorage.getItem('lastName')}`;
      
      const response = await axios.get('http://localhost:3000/api/helpdesk/messages');
      
      if (response.data && Array.isArray(response.data)) {
        const formattedMessages = response.data
          .map(msg => ({
            id: msg.message_id,
            senderName: msg.sender_name,
            adminName: msg.admin_name,
            text: msg.message_text,
            timestamp: new Date(msg.created_at).toLocaleString(),
            isFromAdmin: msg.sender_name === loggedInAdmin
          }))
          .sort((a, b) => new Date(a.timestamp) - new Date(b.timestamp));
        
        setMessages(formattedMessages);
      }
    } catch (error) {
      console.error('Error fetching messages:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const firstName = localStorage.getItem('firstName');
    const lastName = localStorage.getItem('lastName');
    const fullName = `${firstName} ${lastName}`.trim();
    setAdminName(fullName);
    fetchMessages();
  }, []);

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
        const messageData = {
          senderName: adminName,
          adminName: adminName,
          messageText: input,
          replyToId: replyingTo?.id || null  // Changed from replyToMessageId to replyToId
        };

        await axios.post('http://localhost:3000/api/helpdesk/messages', messageData);
        
        setInput('');
        setReplyingTo(null);
        fetchMessages();
      } catch (error) {
        console.error('Error sending message:', error);
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
              onClick={fetchMessages}
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