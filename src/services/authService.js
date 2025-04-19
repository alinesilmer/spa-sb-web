// This file would handle authentication-related functions
import axios from 'axios';
import API_BASE_URL from '../config/api';

export const loginUser = async (email,password) => {
  const response = await axios.post(
    `${API_BASE_URL}/auth/login`, {
      email,
      password
    });
  return response.data;
};

export const registerUser = async (userData) => {
  const response = await axios.post(
    `${API_BASE_URL}/auth/register`, 
    userData
  );
  return response.data;
}

export const forgotPass = async (email) => {
  const response = await axios.post(
    `${API_BASE_URL}/auth/resetPassword`, 
    { email }
  );
  return response.data;
};
