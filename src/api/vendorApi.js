import axiosClient from './axiosClient';

export const getVendors = async (category = '', search = '') => {
  const response = await axiosClient.get(`/api/vendors?category=${category}&search=${search}`);
  return response.data; // returns { success, message, data: [vendors] }
};

export const getVendorById = async (id) => {
  const response = await axiosClient.get(`/api/vendors/${id}`);
  return response.data; // returns { success, message, data: vendor }
};

export const createVendorProfile = async (profileData) => {
  const response = await axiosClient.post('/api/vendors', profileData);
  return response.data;
};

export const updateVendorProfile = async (id, profileData) => {
  const response = await axiosClient.patch(`/api/vendors/${id}`, profileData);
  return response.data;
};
