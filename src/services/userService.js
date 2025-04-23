import axios from 'axios';
import API_BASE_URL from '../config/api';

export async function getUsers() {
  const response = await axios.get(`${API_BASE_URL}/users/`,);
  //console.log("getUsers RESPONSE: " + JSON. stringify(response));

  return response.data;
};

export async function getClients(authToken) {
  const response = await axios.get(
    `${API_BASE_URL}/users/clients`,
    { headers: { Authorization: `Bearer ${authToken}` }, }
  );
  //console.log("getClients RESPONSE: " + JSON. stringify(response));

  return response.data;
};

export async function getSpecificUser(userType, state) {
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
  //console.log("updateUser: " + JSON.stringify(userData) + ". RESPONSE: " + JSON. stringify(response));
  
  return response.data;
};

export const updateUserById = async (authToken, userId, userData) => {
  const response = await axios.put(
    `${API_BASE_URL}/users/${userId}`,
    userData,
    { headers: { Authorization: `Bearer ${authToken}` }, }
  );
  //console.log("updateUserBYID: " + JSON.stringify(userData) + ". RESPONSE: " + JSON. stringify(response));
  
  return response.data;
};

export const approveUser = async (authToken, userId) => { 
  const response = await axios.put(
    `${API_BASE_URL}/users/approveUser/${userId}`,
    {},
    { headers: { Authorization: `Bearer ${authToken}` }, }
  );
  //console.log("aproveUser: " + userId + ". RESPONSE: " + JSON. stringify(response));
  
  return response.data;
};

export const deleteUser = async (authToken, userId) => { 
  const response = await axios.put(
    `${API_BASE_URL}/users/delete/${userId}`,
    {},
    { headers: { Authorization: `Bearer ${authToken}` }, }
  );
  //console.log("deleteUser: " + userId + ". RESPONSE: " + JSON. stringify(response.data));
  
  return response.data;
};

export const realDeleteUser = async (authToken, userId) => { 
  const response = await axios.delete(
    `${API_BASE_URL}/users/${userId}`,
    { headers: { Authorization: `Bearer ${authToken}` }, }
  );
  //console.log("realDeleteUser: " + userId + ". RESPONSE: " + JSON. stringify(response.data));
  
  return response.data;
};

export async function getAvailable (authToken, serviceId, date) {
  const response = await axios.get(
    `${API_BASE_URL}/appointments/${serviceId}/available?date=${date}`, 
    { headers: { Authorization: `Bearer ${authToken}` }}
  );
  //console.log("getAvailable: " + serviceId + ". RESPONSE: " + JSON. stringify(response.data));

  return response.data;
};

export const setSchedule = async (authToken, userId, scheduleData) => {
  const response = await axios.post(
    `${API_BASE_URL}/users/${userId}/setDates`, 
    scheduleData, 
    { headers: { Authorization: `Bearer ${authToken}` } }
  );
  return response.data;
};