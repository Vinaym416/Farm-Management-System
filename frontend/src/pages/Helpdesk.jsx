import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { chatService } from '../services/chatService';

const Helpdesk = () => {
  const location = useLocation();
  const navigate = useNavigate();

  const { user } = location.state || { user: null };

  useEffect(() => {
    if (!user) {
      navigate('/'); // Redirect to home or login page
    }
  }, [user, navigate]);

  const [participants, setParticipants] = useState([]);
  const [selectedParticipant, setSelectedParticipant] = useState(null);
  const [messages, setMessages] = useState([]);
  const [message, setMessage] = useState('');
  const [replyingTo, setReplyingTo] = useState(null);

  useEffect(() => {
    if (user?.role === 'admin') {
      setParticipants([
        { id: 'farmer1', name: 'Farmer 1' },
        { id: 'farmer2', name: 'Farmer 2' },
      ]);
    } else if (user?.role === 'farmer') {
      setParticipants([{ id: 'admin', name: 'Admin' }]);
    }
  }, [user]);

  useEffect(() => {
    if (selectedParticipant) {
      const fetchedMessages = chatService.getMessages(user.id, selectedParticipant.id);
      setMessages(fetchedMessages);
    }
  }, [selectedParticipant, user?.id]);

  const sendMessage = () => {
    if (message.trim() && selectedParticipant) {
      const newMessage = {
        sender_id: user.id,
        receiver_id: selectedParticipant.id,
        message,
        reply_to: replyingTo ? replyingTo.id : null,
        timestamp: new Date().toISOString(),
      };
      chatService.sendMessage(newMessage);
      setMessages((prev) => [...prev, newMessage]);
      setMessage('');
      setReplyingTo(null);
    }
  };

  const deleteMessage = (id) => {
    const updatedMessages = messages.filter((msg) => msg.id !== id);
    setMessages(updatedMessages);
    chatService.deleteMessage(id); // Add this method in `chatService`
  };

  const handleReply = (msg) => {
    setReplyingTo(msg);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 p-6">
      <div className="max-w-screen-md mx-auto">
        <div className="bg-white rounded-2xl shadow-xl p-8">
          <h1 className="text-3xl font-bold text-gray-800 mb-6">
            {user?.role === 'admin' ? 'Admin Helpdesk' : 'Farmer Helpdesk'}
          </h1>
          <div className="flex gap-6">
            <div className="w-1/3">
              <h2 className="text-xl font-semibold text-gray-700 mb-4">
                {user?.role === 'admin' ? 'Farmers' : 'Admins'}
              </h2>
              <ul className="space-y-2">
                {participants.map((participant) => (
                  <li
                    key={participant.id}
                    className={`p-3 rounded-lg cursor-pointer ${
                      selectedParticipant?.id === participant.id
                        ? 'bg-emerald-100 text-emerald-700'
                        : 'bg-gray-100 text-gray-700'
                    }`}
                    onClick={() => setSelectedParticipant(participant)}
                  >
                    {participant.name}
                  </li>
                ))}
              </ul>
            </div>
            <div className="w-2/3">
              {selectedParticipant ? (
                <>
                  <h2 className="text-xl font-semibold text-gray-700 mb-4">
                    Chat with {selectedParticipant.name}
                  </h2>
                  <div className="h-64 bg-gray-50 border border-gray-200 rounded-lg overflow-y-auto p-4 mb-4">
                    {messages.map((msg, index) => (
                      <div
                        key={index}
                        className={`mb-2 p-2 rounded-lg ${
                          msg.sender_id === user.id
                            ? 'bg-emerald-100 text-emerald-700 self-end'
                            : 'bg-gray-100 text-gray-700 self-start'
                        }`}
                      >
                        {msg.reply_to && (
                          <div className="text-sm text-gray-500 mb-1">
                            Replying to: {messages.find((m) => m.id === msg.reply_to)?.message}
                          </div>
                        )}
                        <div className="flex justify-between items-center">
                          <strong>
                            {msg.sender_id === user.id ? 'You' : msg.sender_id}:
                          </strong>
                          <div className="flex gap-2">
                            <button
                              onClick={() => handleReply(msg)}
                              className="text-blue-500 text-sm"
                            >
                              Reply
                            </button>
                            <button
                              onClick={() => deleteMessage(msg.id)}
                              className="text-red-500 text-sm"
                            >
                              Delete
                            </button>
                          </div>
                        </div>
                        <p>{msg.message}</p>
                      </div>
                    ))}
                  </div>
                  {replyingTo && (
                    <div className="mb-2 p-2 bg-gray-100 rounded-lg">
                      Replying to: <strong>{replyingTo.message}</strong>
                      <button
                        onClick={() => setReplyingTo(null)}
                        className="ml-2 text-red-500 text-sm"
                      >
                        Cancel
                      </button>
                    </div>
                  )}
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
                <p className="text-gray-500">Select a participant to start chatting.</p>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Helpdesk;