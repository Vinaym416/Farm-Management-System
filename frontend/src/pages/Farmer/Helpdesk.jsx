import React, { useState, useEffect } from "react";
import axios from "axios";


const FarmerHelpdesk = () => {
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState("");
  const [admins, setAdmins] = useState([]);
  const [selectedAdmin, setSelectedAdmin] = useState(null);
  const [loading, setLoading] = useState(false);
  const [replyingTo, setReplyingTo] = useState(null);

  useEffect(() => {
    const fetchAdmins = async () => {
      try {
        const response = await axios.get(
          "http://localhost:3000/api/helpdesk/names"
        );
        setAdmins(response.data);
      } catch (error) {
        console.error("Error fetching admins:", error);
      }
    };

    fetchAdmins();
  }, []);

  useEffect(() => {
    const fetchMessages = async () => {
      if (selectedAdmin) {
        try {
          setLoading(true);
          const response = await axios.get(
            "http://localhost:3000/api/helpdesk/messages"
          );
          
          // Filter messages for the selected admin
          const filteredMessages = response.data.filter(
            msg => msg.admin_name === selectedAdmin
          );

          setMessages(
            filteredMessages.map((msg) => ({
              id: msg.message_id,
              sender: msg.sender_name,
              text: msg.message_text,
              recipient: msg.admin_name,
              timestamp: new Date(msg.created_at).toLocaleString(),
              isFromAdmin: msg.sender_name === msg.admin_name, // Changed this line
              replyToId: msg.reply_to_id,
              repliedToText: msg.replied_to_text,
              repliedToSender: msg.replied_to_sender
            }))
          );
        } catch (error) {
          console.error("Error fetching messages:", error);
        } finally {
          setLoading(false);
        }
      }
    };

    fetchMessages();
  }, [selectedAdmin]);

  const handleSendMessage = async () => {
    if (input.trim() && selectedAdmin) {
      try {
        const messageData = {
          senderName: "Farmer",
          adminName: selectedAdmin,
          messageText: input,
          replyToId: replyingTo ? replyingTo.id : null  // Add this line
        };

        const response = await axios.post(
          "http://localhost:3000/api/helpdesk/messages",
          messageData
        );

        // Use the message ID returned from the server
        const newMessage = {
          id: response.data.messageId,
          sender: "Farmer",
          text: input,
          recipient: selectedAdmin,
          timestamp: new Date().toLocaleString(),
          isFromAdmin: false,
          replyToId: replyingTo ? replyingTo.id : null,  // Add this line
          repliedToText: replyingTo ? replyingTo.text : null,  // Add this line
          repliedToSender: replyingTo ? replyingTo.sender : null  // Add this line
        };

        setMessages([...messages, newMessage]);
        setInput("");
        setReplyingTo(null);  // Reset replyingTo after sending
      } catch (error) {
        console.error("Error sending message:", error);
        alert("Failed to send message");
      }
    }
  };

  const handleDeleteMessage = async (messageId) => {
    try {
      const response = await axios.delete(
        `http://localhost:3000/api/helpdesk/messages/${messageId}`
      );
      
      if (response.data.success){
        setMessages(messages.filter((msg) => msg.id !== messageId));
      } else {
        throw new Error(response.data.error || 'Failed to delete message');
      }
    } catch (error) {
      console.error("Error deleting message:", error);
      alert(error.message || "Failed to delete message");
    }
  };

  const handleRefresh = async () => {
    if (selectedAdmin) {
      try {
        setLoading(true);
        const response = await axios.get(
          "http://localhost:3000/api/helpdesk/messages"
        );
        
        // Filter messages for the selected admin
        const filteredMessages = response.data.filter(
          msg => msg.admin_name === selectedAdmin
        );

        setMessages(
          filteredMessages.map((msg) => ({
            id: msg.message_id,
            sender: msg.sender_name,
            text: msg.message_text,
            recipient: msg.admin_name,
            timestamp: new Date(msg.created_at).toLocaleString(),
            isFromAdmin: msg.sender_name === msg.admin_name, // Changed this line
            replyToId: msg.reply_to_id,
            repliedToText: msg.replied_to_text,
            repliedToSender: msg.replied_to_sender
          }))
        );
      } catch (error) {
        console.error("Error refreshing messages:", error);
        alert("Failed to refresh messages");
      } finally {
        setLoading(false);
      }
    }
  };

  // Add this new function in the FarmerHelpdesk component
  const handleReply = (message) => {
    setReplyingTo(message);
    setInput(`Replying to: ${message.text.substring(0, 30)}... \n`);
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
                    key={admin.id}
                    onClick={() => setSelectedAdmin(admin.name)}
                    className={`w-full text-left px-4 py-2 rounded-lg border ${
                      selectedAdmin === admin.name
                        ? "bg-emerald-500 text-white"
                        : "bg-gray-100"
                    }`}
                  >
                    {admin.name}
                  </button>
                ))
              ) : (
                <p className="text-gray-500">Loading admins...</p>
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
                  onClick={handleRefresh}
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
                              {msg.sender === "Farmer" ? "You" : msg.sender}
                            </span>
                            {msg.sender === "Farmer" && (
                              <button
                                onClick={() => handleDeleteMessage(msg.id)}
                                className="ml-2 text-xs opacity-75 hover:opacity-100 text-white"
                              >
                                ×
                              </button>
                            )}
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
