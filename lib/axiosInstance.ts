import axios from 'axios';

export const axiosInstance = axios.create({
  baseURL:
    typeof window === 'undefined'
      ? 'http://localhost:3000/'
      : window.location.origin,
  withCredentials: true,
});