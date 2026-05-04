// services/projectService.js
import api from "@/lib/api";

export const getProjects = async () => {
  const res = await api.get("/projects");
  return res.data;
};

export const createProject = async (data) => {
  const res = await api.post("/projects/create-project", data);
  return res.data;
};

export const addMember = async (projectId, userId) => {
  const res = await api.post(`/projects/${projectId}/add-member`, { userId });
  return res.data;
};

export const removeMember = async (projectId, userId) => {
  const res = await api.delete(`/projects/${projectId}/remove-member/${userId}`);
  return res.data;
};