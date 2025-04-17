// This file would handle booking-related functions
import axios from 'axios';
import API_BASE_URL from '../config/api';

export async function getBookings(authToken, userid) {
  const response = await axios.get(
    `${API_BASE_URL}/appointments/allAppt`, 
    { headers: { Authorization: `Bearer ${authToken}` } }
  );
  
  const data = response.data;
  const bookings = [];
  
  if (data) {
    for (let i = 0; i < data.length; i++) {
      const item = data[i];
      const booking = {
        id: item.id,
        userId: userid,
        serviceId: item.serviceId.id,
        serviceName: item.serviceId.name,
        professionalId: item.serviceId.professionalId,
        professionalName: item.serviceId.professionalLastname,
        clientId: item.serviceId.clientId,
        clientName: item.serviceId.clientLastname,
        date: item.date,
        time: item.hour,
        duration: item.serviceId.durationMin,
        price: item.serviceId.price,
        status: item.state,
        paymentStatus: item.serviceId.paymentStatus,
        paymentMethod: "mercadopago",
        createdAt: "2025-05-01T14:30:00Z",      
      };
      bookings.push(booking);
    } 
  }
  //console.log("getBookings " + userid + ". RESPONSE: " + JSON.stringify(bookings));
  
  return bookings;
};

/*export async function getAvailable (authToken, serviceId, date) {
  const response = await axios.get(
    `${API_BASE_URL}/${serviceId}/available`, 
    date,
    { headers: { Authorization: `Bearer ${authToken}` }}
  );

  const data = response.data;
  const availableDates = [];

  return availableDates;
};*/

export const createBooking = async (authToken, apptData) => {
  const response = await axios.post(
    `${API_BASE_URL}/appointments`, 
    apptData, 
    { headers: { Authorization: `Bearer ${authToken}` } }
  );
  return response.data;
};

export const updateBooking = async (authToken, apptId, apptData) => {
  const response = await axios.put(
    `${API_BASE_URL}/appointments/${apptId}`, 
    apptData, 
    { headers: { Authorization: `Bearer ${authToken}` } }
  );
  return response.data;
};

export const cancelBooking = async (authToken, apptId) => {  
  const response = await axios.put(
    `${API_BASE_URL}/appointments/cancel/${apptId}`, 
    {},
    { headers: { Authorization: `Bearer ${authToken}` }, }
  );
  console.log("cancelBooking: " + apptId + ". RESPONSE: " + JSON.stringify(response.data));
  
  return response.data;
};

export const confirmBooking = async (authToken, apptId) => {
  console.log("CONFIRMAR TURNO");
  
  const response = await axios.put(
    `${API_BASE_URL}/appointments/confirm/${apptId}`, 
    {},
    { headers: { Authorization: `Bearer ${authToken}` }, }
  );
  console.log("confirmBooking: " + apptId + ". RESPONSE: " + JSON.stringify(response.data));

  return response.data;
};