import axiosClient from './axiosClient';

export const createEvent = async (title, targetBudget, clientEmail) => {
  const response = await axiosClient.post('/api/events', { title, targetBudget, clientEmail });
  return response.data; // returns { success, message, data: event }
};

export const getEventById = async (id) => {
  const response = await axiosClient.get(`/api/events/${id}`);
  return response.data; // returns { success, message, data: event }
};

export const updateEventVendors = async (id, action, vendorId, replaceVendorId = null) => {
  const body = { action, vendorId };
  if (replaceVendorId) {
    body.replaceVendorId = replaceVendorId;
  }
  const response = await axiosClient.patch(`/api/events/${id}/vendors`, body);
  return response.data; // returns { success, message, data: event }
};

export const submitEventForApproval = async (id) => {
  const response = await axiosClient.post(`/api/events/${id}/submit-for-approval`);
  return response.data; // returns { success, message, data: { clientLinkToken } }
};

// Public client-view routes (unauthenticated)
export const getClientEventView = async (clientLinkToken) => {
  // Use default axios (or axiosClient without auth token if interceptor doesn't add it when token is null)
  // Since we set setAuthToken(null) or no token is active, axiosClient works fine.
  const response = await axiosClient.get(`/api/events/client-view/${clientLinkToken}`);
  return response.data;
};

export const approveClientEventView = async (clientLinkToken) => {
  const response = await axiosClient.post(`/api/events/client-view/${clientLinkToken}/approve`);
  return response.data;
};
