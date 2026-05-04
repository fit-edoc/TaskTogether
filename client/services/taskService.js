// services/taskService.js
import api from "@/lib/api";

export const getTasks = async (projectId) => {
  const res = await api.get("/tasks/get-task", { params: { projectId } });
  return res.data;
};

export const createTask = async (data) => {
  const res = await api.post("/tasks/createTask", data);
  return res.data;
};

export const updateTask = async (id, data) => {
  const res = await api.patch(`/tasks/update-task/${id}`, data);
  return res.data;
};

export const deleteTask = async (id, projectId) => {
  const res = await api.delete(`/tasks/delete-task/${id}`, { data: { projectId } });
  return res.data;
};

export const getDashboardStats = async (projectId) => {
  const res = await api.get("/dashboard", { params: { projectId } });
  return res.data;
};