import axiosClient from './axiosClient';

export const createReview = async (eventId, vendorId, rating, comment) => {
  const response = await axiosClient.post('/api/reviews', {
    eventId,
    vendorId,
    rating,
    comment
  });
  return response.data; // returns { success, message, data: review }
};

export const getReviewsByVendor = async (vendorId) => {
  const response = await axiosClient.get(`/api/vendors/${vendorId}/reviews`);
  return response.data; // returns { success, message, data: [reviews] }
};
