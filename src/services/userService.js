import axios from 'axios';
import API_BASE_URL from '../config/api';

export async function getUsers() {
  const response = await axios.get(`${API_BASE_URL}/users/`,);
  //console.log("getUsers RESPONSE: " + JSON. stringify(response));

  return response.data;
};

export async function getPendingProf(userType, state) {
  const response = await axios.get(`${API_BASE_URL}/users?userType=${userType}&state=${state}`,);
  //console.log("getPendingProf RESPONSE: " + JSON. stringify(response));
  return response.data;
};

export const updateUser = async (authToken, userData) => {
  const response = await axios.put(
    `${API_BASE_URL}/users`,
    userData,
    { headers: { Authorization: `Bearer ${authToken}` }, }
  );
  console.log("updateUser: " + JSON.stringify(userData) + ". RESPONSE: " + JSON. stringify(response));
  
  return response.data;
};

export const approveUser = async (authToken, userId) => { 
  const response = await axios.put(
    `${API_BASE_URL}/users/approveUser/${userId}`,
    {},
    { headers: { Authorization: `Bearer ${authToken}` }, }
  );
  console.log("aproveUser: " + userId + ". RESPONSE: " + JSON. stringify(response));
  
  return response.data;
};

export const deleteUser = async (authToken, userId) => {
  console.log(userId);
  
  const response = await axios.delete(
    `${API_BASE_URL}/users/${userId}`,
    { headers: { Authorization: `Bearer ${authToken}` }, }
  );
  console.log("deleteUser: " + userId + ". RESPONSE: " + JSON. stringify(response));
  
  return response.data;
};