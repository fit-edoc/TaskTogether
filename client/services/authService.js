// services/authService.js
import api from "@/lib/api";

export const registerUser = async (data) => {
  const res = await api.post("/auth/register", data);
  return res.data;
};

export const loginUser = async (data) => {
  const res = await api.post("/auth/login", data);
  return res.data;
};

export const getAllUsers = async () => {
  const res = await api.get("/auth/users");
  return res.data;
};