import axiosClient from './axiosClient';

export const getUsers = async () => {
  const response = await axiosClient.get('/api/admin/users');
  return response.data; // returns { success, message, data: [users] }
};

export const getPendingVendors = async () => {
  const response = await axiosClient.get('/api/admin/vendors/pending');
  return response.data; // returns { success, message, data: [pendingVendors] }
};

export const updateVendorStatus = async (id, status) => {
  const response = await axiosClient.patch(`/api/admin/vendors/${id}/status`, { status });
  return response.data; // returns { success, message, data: updatedVendor }
};

export const deleteUser = async (id) => {
  const response = await axiosClient.delete(`/api/admin/users/${id}`);
  return response.data;
};
