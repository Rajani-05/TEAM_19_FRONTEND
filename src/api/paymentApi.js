import axiosClient from './axiosClient';

export const initiatePayment = async (eventId, amount, type = 'CLIENT_TO_PLATFORM') => {
  const response = await axiosClient.post('/api/payments/initiate', { eventId, amount, type });
  return response.data; // returns { success, message, data: { orderId, amount, currency, razorpayKeyId } }
};

export const verifyPayment = async (orderId, paymentId, signature) => {
  const response = await axiosClient.post('/api/payments/verify', { orderId, paymentId, signature });
  return response.data;
};

export const getPaymentHistory = async (eventId) => {
  const response = await axiosClient.get(`/api/payments/event/${eventId}`);
  return response.data;
};
