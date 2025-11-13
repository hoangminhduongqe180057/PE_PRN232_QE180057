import axios from "axios";

export const api = axios.create({
  baseURL: "https://pe-prn232-be-v9k4.onrender.com/api", // URL backend Render
});