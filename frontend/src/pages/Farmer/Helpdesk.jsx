import React, { useState, useEffect } from "react";
import axios from "axios";

const FarmerHelpdesk = () => {
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState("");
  const [admins, setAdmins] = useState([]);
  const [selectedAdmin, setSelectedAdmin] = useState(null);

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
          const response = await axios.get(
            `http://localhost:3000/api/helpdesk/messages/${selectedAdmin}`
          );
          setMessages(
            response.data.map((msg) => ({
              sender: msg.sender_name,
              text: msg.message_text,
              recipient: msg.admin_name,
            }))
          );
        } catch (error) {
          console.error("Error fetching messages:", error);
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
        };

        await axios.post(
          "http://localhost:3000/api/helpdesk/messages",
          messageData
        );

        const newMessage = {
          sender: "Farmer",
          text: input,
          recipient: selectedAdmin,
        };

        setMessages([...messages, newMessage]);
        setInput("");
      } catch (error) {
        console.error("Error sending message:", error);
        alert("Failed to send message");
      }
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
              <h2 className="text-xl font-semibold text-gray-700 mb-4">
                Chat with {selectedAdmin}
              </h2>
              <div className="relative">
                <div className="flex-1 overflow-y-auto border-b mb-4 h-64">
                  {messages.map((msg, index) => (
                    <div
                      key={index}
                      className={`mb-2 ${
                        msg.sender === "Farmer" ? "text-right" : "text-left"
                      }`}
                    >
                      <span className="font-bold">{msg.sender}:</span>{" "}
                      {msg.text}
                    </div>
                  ))}
                </div>
                <input
                  type="text"
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  placeholder="Type your message..."
                  className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-emerald-500 focus:border-transparent transition-all duration-300 outline-none"
                />
                <button
                  onClick={handleSendMessage}
                  className="mt-4 w-full bg-emerald-500 text-white py-3 rounded-lg hover:bg-emerald-600 transition-all duration-300"
                >
                  Send
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default FarmerHelpdesk;
