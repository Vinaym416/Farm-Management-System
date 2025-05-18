import React, { useState, useEffect } from "react";
import { helpdeskService } from "../../services/helpdeskService";
import { toast } from "react-toastify";
import io from 'socket.io-client';

const socket = io('http://localhost:3000');
const FARMER_ID = 1;
const ADMIN_ID = 2;

const FarmerHelpdesk = () => {
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState("");
  const [admins, setAdmins] = useState([]);
  const [selectedAdmin, setSelectedAdmin] = useState(null);
  const [loading, setLoading] = useState(false);
  const [replyingTo, setReplyingTo] = useState(null);

  useEffect(() => {
    // Fetch initial messages using socket connection
    socket.on('receiveMessage', (data) => {
      if ((data.sender_id === FARMER_ID && data.receiver_id === ADMIN_ID) ||
          (data.sender_id === ADMIN_ID && data.receiver_id === FARMER_ID)) {
        setMessages(prev => [...prev, {
          id: Date.now(),
          text: data.message,
          isFromAdmin: data.sender_id === ADMIN_ID,
          senderName: data.sender_id === ADMIN_ID ? 'Admin' : 'You',
          timestamp: new Date().toLocaleTimeString()
        }]);
      }
    });

    const fetchInitialMessages = async () => {
      try {
        const response = await fetch(`http://localhost:3000/messages/${FARMER_ID}/${ADMIN_ID}`);
        const data = await response.json();
        const formattedMessages = data.map(msg => ({
          id: msg.id || Date.now(),
          text: msg.message,
          isFromAdmin: msg.sender_id === ADMIN_ID,
          senderName: msg.sender_id === ADMIN_ID ? 'Admin' : 'You',
          timestamp: new Date(msg.timestamp || Date.now()).toLocaleTimeString()
        }));
        setMessages(formattedMessages);
      } catch (error) {
        console.error("Error fetching messages:", error);
        toast.error("Failed to fetch messages");
      }
    };

    fetchInitialMessages();
    return () => socket.off('receiveMessage');
  }, []);

  useEffect(() => {
    const fetchAdmins = async () => {
      try {
        const response = await fetch('/api/helpdesk/names');
        if (!response.ok) {
          throw new Error('Failed to fetch admins');
        }
        const adminData = await response.json();
        setAdmins(adminData);
      } catch (error) {
        console.error("Error fetching admins:", error);
        toast.error("Failed to fetch admins");
      }
    };

    fetchAdmins();
  }, []);

  const handleSendMessage = () => {
    if (input.trim() === '') return;
    
    // Emit message through socket
    socket.emit('sendMessage', {
      sender_id: FARMER_ID,
      receiver_id: ADMIN_ID,
      message: input
    });

    // Add message to local state
    const newMessage = {
      id: Date.now(),
      text: input,
      isFromAdmin: false,
      senderName: 'You',
      timestamp: new Date().toLocaleTimeString(),
      replyToId: replyingTo?.id || null,
      repliedToText: replyingTo?.text || null,
      repliedToSender: replyingTo?.senderName || null
    };

    setMessages(prev => [...prev, newMessage]);
    setInput("");
    setReplyingTo(null);
    toast.success("Message sent successfully!");
  };

  const handleReply = (message) => {
    setReplyingTo(message);
    setInput(`@${message.senderName} `);
  };

  const handleDeleteMessage = async (messageId) => {
    try {
      await helpdeskService.deleteMessage(messageId);
      setMessages(prevMessages => 
        prevMessages.filter(msg => msg.id !== messageId)
      );
      toast.success("Message deleted successfully!");
    } catch (error) {
      console.error("Error deleting message:", error);
      toast.error("Failed to delete message");
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 to-emerald-100 p-6">
      <div className="max-w-screen-md mx-auto">
        <div className="bg-white rounded-2xl shadow-xl p-8">
          <h1 className="text-3xl font-bold text-gray-800 mb-6">
            Farmer Helpdesk
          </h1>

          <div className="mb-6">
            <h2 className="text-xl font-semibold text-gray-700 mb-4">
              Select Admin
            </h2>
            <div className="space-y-4">
              {Array.isArray(admins) && admins.length > 0 ? (
                admins.map((admin) => (
                  <button
                    key={admin._id}
                    onClick={() => setSelectedAdmin(admin.name)}
                    className={`w-full text-left px-4 py-2 rounded-lg border ${
                      selectedAdmin === admin.name
                        ? "bg-emerald-500 text-white"
                        : "bg-gray-100 hover:bg-gray-200"
                    }`}
                  >
                    {admin.name}
                    <span className="text-sm text-gray-500 ml-2">
                      (Admin)
                    </span>
                  </button>
                ))
              ) : (
                <div className="text-center py-4">
                  <div className="animate-spin inline-block w-6 h-6 border-2 border-emerald-500 border-t-transparent rounded-full"></div>
                  <p className="text-gray-500 mt-2">Loading admins...</p>
                </div>
              )}
            </div>
          </div>

          {selectedAdmin && (
            <div className="space-y-6">
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-xl font-semibold text-gray-700">
                  Chat with {selectedAdmin}
                </h2>
                <button
                  onClick={() => {
                    setLoading(true);
                    setTimeout(() => setLoading(false), 1000);
                  }}
                  disabled={loading}
                  className={`p-2 rounded-full hover:bg-gray-100 transition-colors
                    ${loading ? 'opacity-50 cursor-not-allowed' : ''}`}
                  title="Refresh messages"
                >
                  <svg
                    className={`w-5 h-5 ${loading ? 'animate-spin' : ''}`}
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"
                    />
                  </svg>
                </button>
              </div>
              <div className="relative">
                <div className="flex-1 overflow-y-auto border rounded-lg p-4 mb-4 h-[400px] bg-gray-50">
                  {loading ? (
                    <div className="text-center text-gray-500">
                      Loading messages...
                    </div>
                  ) : messages.length > 0 ? (
                    messages.map((msg) => (
                      <div
                        key={msg.id}
                        className={`mb-4 ${
                          msg.isFromAdmin ? "text-left" : "text-right"
                        }`}
                      >
                        <div
                          className={`inline-block max-w-[80%] p-4 rounded-lg ${
                            msg.isFromAdmin
                              ? "bg-gray-200 text-gray-800"
                              : "bg-emerald-500 text-white"
                          }`}
                        >
                          <div className="flex justify-between items-start mb-2">
                            <span className="font-semibold text-sm">
                              {msg.isFromAdmin ? msg.senderName : 'You'}
                            </span>
                          </div>
                          {msg.replyToId && (
                            <div className={`text-xs mb-2 p-2 rounded ${
                              msg.sender === "Farmer" 
                                ? "bg-emerald-600/50" 
                                : "bg-gray-300/50"
                            }`}>
                              <p className="font-semibold">Replying to {msg.repliedToSender}:</p>
                              <p className="italic">{msg.repliedToText}</p>
                            </div>
                          )}
                          <p className="text-base break-words">{msg.text}</p>
                          <p className="text-xs mt-2 opacity-75">
                            {msg.timestamp}
                          </p>
                        </div>
                        <button
                          onClick={() => handleDeleteMessage(msg.id)}
                          className="text-red-500 text-xs mt-2"
                        >
                          Delete
                        </button>
                      </div>
                    ))
                  ) : (
                    <p className="text-center text-gray-500">
                      Start a conversation with {selectedAdmin}
                    </p>
                  )}
                </div>
                <div className="flex gap-2">
                  <input
                    type="text"
                    value={input}
                    onChange={(e) => setInput(e.target.value)}
                    onKeyPress={(e) =>
                      e.key === "Enter" && handleSendMessage()
                    }
                    placeholder="Type your message..."
                    className="flex-1 p-3 border rounded-lg focus:ring-2 focus:ring-emerald-500 outline-none"
                  />
                  <button
                    onClick={handleSendMessage}
                    className="px-6 py-3 bg-emerald-500 text-white rounded-lg hover:bg-emerald-600"
                  >
                    Send
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default FarmerHelpdesk;
