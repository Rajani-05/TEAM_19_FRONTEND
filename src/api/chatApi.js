import axiosClient from './axiosClient';

export const getMessages = async (eventId) => {
  const response = await axiosClient.get(`/api/chat/${eventId}/messages`);
  return response.data; // returns { success, message, data: [messages] }
};

export const sendMessage = async (eventId, receiverId, content, aiGenerated = false) => {
  const response = await axiosClient.post(`/api/chat/${eventId}/messages`, {
    receiverId,
    content,
    aiGenerated
  });
  return response.data; // returns { success, message, data: message }
};

export const draftNegotiationMessage = async (eventId, vendorId, goal) => {
  const response = await axiosClient.post('/api/ai/draft-message', {
    eventId,
    vendorId,
    goal
  });
  return response.data; // returns { success, message, data: textString }
};
