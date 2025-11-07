// Cấu hình Axios để giao tiếp với JSON Server
import axios from "axios";

const carAPI = axios.create({
  baseURL: "http://localhost:3001", // URL cơ sở của JSON Server
  timeout: 5000,
  headers: { "Content-Type": "application/json" },
});

export default carAPI;
