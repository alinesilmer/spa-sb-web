import axios from 'axios';
import API_BASE_URL from '../config/api';

export async function getAllServices() {
  const response = await axios.get(
    `${API_BASE_URL}/services`, 
  );
  //console.log("getAllServices. RESPONSE: " + JSON.stringify(response.data));
  
  return response.data;
};

export async function getProfessionalServices(authToken) {
  const response = await axios.get(
    `${API_BASE_URL}/services/getBy`, 
    { headers: { Authorization: `Bearer ${authToken}` } }
  );
  //console.log("getAllServices. RESPONSE: " + JSON.stringify(response.data));
  
  return response.data;
};

export async function getActiveServices() {
  const response = await axios.get(
    `${API_BASE_URL}/services?state=true`, 
  );
  //console.log("getActiveServices. RESPONSE: " + JSON.stringify(response.data));
  
  return response.data;
};

export const updateService = async (authToken, serviceId, serviceData) => {
  const response = await axios.put(
    `${API_BASE_URL}/services/${serviceId}`, 
    serviceData, 
    { headers: { Authorization: `Bearer ${authToken}` } }
  );
  //console.log("updateService: " + JSON.stringify(serviceData) + ". RESPONSE: " + JSON.stringify(response.data));

  return response.data;
};

export const newService = async (authToken, serviceData) => {
  const response = await axios.post(
    `${API_BASE_URL}/services/`, 
    serviceData,
    { headers: { Authorization: `Bearer ${authToken}` } }
  );
  //console.log("newService: " + JSON.stringify(serviceData) + ". RESPONSE: " + JSON.stringify(response.data));

  return response.data;
};


export const deleteService = async (authToken, serviceId) => {
  const response = await axios.put(
    `${API_BASE_URL}/services/deleted/${serviceId}`, 
    {}, 
    { headers: { Authorization: `Bearer ${authToken}` } }
  );
  //console.log("deleteService: " + serviceId + ". RESPONSE: " + JSON.stringify(response.data));

  return response.data;
};
