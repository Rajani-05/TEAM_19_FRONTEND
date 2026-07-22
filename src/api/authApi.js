import axiosClient from './axiosClient';

export const login = async (email, password) => {
  const response = await axiosClient.post('/api/auth/login', { email, password });
  return response.data; // Wrapper shape: { success, message, data: { token, user } }
};

export const register = async (name, email, password, role, phoneNo, gender) => {
  const response = await axiosClient.post('/api/auth/register', { 
    name, 
    email, 
    password, 
    role, 
    phoneNo, 
    gender 
  });
  return response.data; // Wrapper shape: { success, message, data: { token, user } }
};

export const sendOtp = async (email) => {
  const response = await axiosClient.post('/api/auth/send-otp', { email });
  return response.data;
};

export const verifyOtp = async (email, otp) => {
  const response = await axiosClient.post('/api/auth/verify-otp', { email, otp });
  return response.data;
};
