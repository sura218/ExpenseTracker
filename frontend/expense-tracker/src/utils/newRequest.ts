import axios from "axios";

const newRequest = axios.create({
  baseURL: import.meta.env.DEV
    ? "http://localhost:5500/api" // local backend
    : "/api",                     // production backend on Vercel
  withCredentials: true,
});

export default newRequest;
