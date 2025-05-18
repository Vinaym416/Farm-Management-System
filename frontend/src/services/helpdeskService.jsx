class HelpdeskService {
  constructor() {
    this.STORAGE_KEY = 'helpdesk_messages';
    this.ADMINS_KEY = 'helpdesk_admins';
    
    // Initialize storage if empty
    if (!localStorage.getItem(this.STORAGE_KEY)) {
      localStorage.setItem(this.STORAGE_KEY, JSON.stringify([]));
    }
    if (!localStorage.getItem(this.ADMINS_KEY)) {
      localStorage.setItem(this.ADMINS_KEY, JSON.stringify([]));
    }
  }

  getMessages() {
    const messages = localStorage.getItem(this.STORAGE_KEY);
    const parsedMessages = messages ? JSON.parse(messages) : [];
    return parsedMessages.sort((a, b) => 
      new Date(a.createdAt) - new Date(b.createdAt)
    );
  }

  getMessagesByAdmin(adminName) {
    const messages = this.getMessages();
    return messages.filter(msg => msg.adminName === adminName);
  }

  getAdmins() {
    const admins = localStorage.getItem(this.ADMINS_KEY);
    return admins ? JSON.parse(admins) : [];
  }

  addMessage(message) {
    try {
      const messages = this.getMessages();
      const newMessage = {
        ...message,
        id: Date.now(),
        timestamp: new Date().toLocaleString(), // Add formatted timestamp
        createdAt: new Date().toISOString()
      };
      messages.push(newMessage);
      localStorage.setItem(this.STORAGE_KEY, JSON.stringify(messages));
      return newMessage;
    } catch (error) {
      console.error('Error adding message:', error);
      throw error;
    }
  }

  deleteMessage(messageId) {
    try {
      const messages = this.getMessages();
      const updatedMessages = messages.filter(msg => msg.id !== messageId);
      localStorage.setItem(this.STORAGE_KEY, JSON.stringify(updatedMessages));
      return true;
    } catch (error) {
      console.error('Error deleting message:', error);
      throw error;
    }
  }

  replyToMessage(messageId, replyData) {
    try {
      const messages = this.getMessages();
      const updatedMessages = messages.map(msg => {
        if (msg.id === messageId) {
          return {
            ...msg,
            replies: [...(msg.replies || []), {
              id: Date.now(),
              ...replyData,
              createdAt: new Date().toISOString()
            }]
          };
        }
        return msg;
      });
      localStorage.setItem(this.STORAGE_KEY, JSON.stringify(updatedMessages));
      return updatedMessages.find(msg => msg.id === messageId);
    } catch (error) {
      console.error('Error replying to message:', error);
      throw error;
    }
  }

  setAdmins(admins) {
    try {
      localStorage.setItem(this.ADMINS_KEY, JSON.stringify(admins));
    } catch (error) {
      console.error('Error setting admins:', error);
      throw error;
    }
  }
}

export const helpdeskService = new HelpdeskService();