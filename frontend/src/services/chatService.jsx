export const chatService = {
  getMessages: (senderId, receiverId) => {
    const chats = JSON.parse(localStorage.getItem('chats')) || [];
    return chats.filter(
      (chat) =>
        (chat.sender_id === senderId && chat.receiver_id === receiverId) ||
        (chat.sender_id === receiverId && chat.receiver_id === senderId)
    );
  },

  sendMessage: (message) => {
    const chats = JSON.parse(localStorage.getItem('chats')) || [];
    chats.push({ ...message, id: Date.now() }); // Add unique ID
    localStorage.setItem('chats', JSON.stringify(chats));
  },

  deleteMessage: (id) => {
    const chats = JSON.parse(localStorage.getItem('chats')) || [];
    const updatedChats = chats.filter((chat) => chat.id !== id);
    localStorage.setItem('chats', JSON.stringify(updatedChats));
  },
};