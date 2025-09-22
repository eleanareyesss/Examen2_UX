import axios from "axios";
import Cookies from "js-cookie";

const instance = axios.create({
  baseURL: "http://localhost:3001/api/",
});

export const getTours = async (limit = 10, offset = 0) => {
  const {data} = await instance.get(`/tours`, { params: { limit, offset } });
  return data;
};

export const getAvailability = async () => {
  const {data} = await instance.get(`/tours/availability`);
  return data;
};

export const reserveTour = async ({ personName, scheduleTime, tourId, seats = 1 }) => {
  const {data} = await instance.put(`/tours/reserve`, null, {params: { personName, scheduleTime, tourId, seats }, });
  return data;
};

export default instance;