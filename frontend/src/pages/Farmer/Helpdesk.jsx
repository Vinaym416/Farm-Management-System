import React, { useState, useEffect } from 'react';
import { chatService } from '../../services/chatService';

const FarmerHelpdesk = () => {
  const [admins, setAdmins] = useState([
    { id: 'admin', name: 'Admin' },
  ]);
  const [selectedAdmin, setSelectedAdmin] = useState(null);
  const [messages, setMessages] = useState([]);
  const [message, setMessage] = useState('');

  useEffect(() => {
    if (selectedAdmin) {
      const fetchedMessages = chatService.getMessages('farmer', selectedAdmin.id);
      setMessages(fetchedMessages);
    }
  }, [selectedAdmin]);

  const sendMessage = () => {
    if (message.trim() && selectedAdmin) {
      const newMessage = {
        sender_id: 'farmer',
        receiver_id: selectedAdmin.id,
        message,
        timestamp: new Date().toISOString(),
      };
      chatService.sendMessage(newMessage);
      setMessages((prev) => [...prev, newMessage]);
      setMessage('');
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 p-6">
      <div className="max-w-screen-md mx-auto">
        <div className="bg-white rounded-2xl shadow-xl p-8">
          <h1 className="text-3xl font-bold text-gray-800 mb-6">Farmer Helpdesk</h1>
          <div className="flex gap-6">
            <div className="w-1/3">
              <h2 className="text-xl font-semibold text-gray-700 mb-4">Admins</h2>
              <ul className="space-y-2">
                {admins.map((admin) => (
                  <li
                    key={admin.id}
                    className={`p-3 rounded-lg cursor-pointer ${
                      selectedAdmin?.id === admin.id
                        ? 'bg-emerald-100 text-emerald-700'
                        : 'bg-gray-100 text-gray-700'
                    }`}
                    onClick={() => setSelectedAdmin(admin)}
                  >
                    {admin.name}
                  </li>
                ))}
              </ul>
            </div>
            <div className="w-2/3">
              {selectedAdmin ? (
                <>
                  <h2 className="text-xl font-semibold text-gray-700 mb-4">
                    Chat with {selectedAdmin.name}
                  </h2>
                  <div className="h-64 bg-gray-50 border border-gray-200 rounded-lg overflow-y-auto p-4 mb-4">
                    {messages.map((msg, index) => (
                      <div
                        key={index}
                        className={`mb-2 p-2 rounded-lg ${
                          msg.sender_id === 'farmer'
                            ? 'bg-emerald-100 text-emerald-700 self-end'
                            : 'bg-gray-100 text-gray-700 self-start'
                        }`}
                      >
                        <strong>{msg.sender_id === 'farmer' ? 'You' : msg.sender_id}:</strong>{' '}
                        {msg.message}
                      </div>
                    ))}
                  </div>
                  <div className="flex gap-2">
                    <input
                      type="text"
                      value={message}
                      onChange={(e) => setMessage(e.target.value)}
                      placeholder="Type your message..."
                      className="flex-grow px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:outline-none"
                    />
                    <button
                      onClick={sendMessage}
                      className="bg-emerald-500 text-white px-4 py-2 rounded-lg hover:bg-emerald-600 transition"
                    >
                      Send
                    </button>
                  </div>
                </>
              ) : (
                <p className="text-gray-500">Select an admin to start chatting.</p>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default FarmerHelpdesk;