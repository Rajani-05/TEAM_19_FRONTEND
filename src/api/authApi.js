import axiosClient from './axiosClient';

export const login = async (email, password) => {
  const response = await axiosClient.post('/api/auth/login', { email, password });
  return response.data; // Wrapper shape: { success, message, data: { token, user } }
};

export const register = async (name, email, password, role) => {
  const response = await axiosClient.post('/api/auth/register', { name, email, password, role });
  return response.data; // Wrapper shape: { success, message, data: { token, user } }
};
