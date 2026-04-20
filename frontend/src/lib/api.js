import axios from "axios";

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || "http://localhost:5000/api",
});

api.interceptors.request.use((config) => {
  const token = localStorage.getItem("token");
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});

export async function login(email, password) {
  const { data } = await api.post("/auth/login", { email, password });
  return data;
}

export async function register(name, email, password) {
  const { data } = await api.post("/auth/register", { name, email, password });
  return data;
}

export async function logout() {
  try {
    await api.post("/auth/logout");
  } finally {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
  }
}

export async function me() {
  const { data } = await api.get("/auth/me");
  return data;
}

export async function listPosts(page = 1, limit = 10) {
  const { data } = await api.get("/posts", { params: { page, limit } });
  return data;
}

export async function getPost(slug) {
  const { data } = await api.get(`/posts/${slug}`);
  return data;
}

export async function listComments(slug) {
  const { data } = await api.get(`/posts/${slug}/comments`);
  return data;
}

export async function addComment(slug, content) {
  const { data } = await api.post(`/posts/${slug}/comments`, { content });
  return data;
}

export async function deleteComment(id) {
  const { data } = await api.delete(`/posts/comments/${id}`);
  return data;
}

export async function likePost(slug) {
  const { data } = await api.post(`/posts/${slug}/like`);
  return data;
}

export async function unlikePost(slug) {
  const { data } = await api.delete(`/posts/${slug}/like`);
  return data;
}

export async function myPosts() {
  const { data } = await api.get("/posts/mine");
  return data;
}

export async function getPostById(id) {
  const { data } = await api.get(`/posts/id/${id}`);
  return data;
}

export async function adminPosts() {
  const { data } = await api.get("/posts/admin");
  return data;
}

export async function createPost(payload) {
  const { data } = await api.post("/posts", payload);
  return data;
}

export async function updatePost(id, payload) {
  const { data } = await api.put(`/posts/${id}`, payload);
  return data;
}

export async function deletePost(id) {
  const { data } = await api.delete(`/posts/${id}`);
  return data;
}

export async function adminUsers() {
  const { data } = await api.get("/users");
  return data;
}

export async function setUserRole(id, role) {
  const { data } = await api.patch(`/users/${id}/role`, { role });
  return data;
}

export async function deleteUser(id) {
  const { data } = await api.delete(`/users/${id}`);
  return data;
}

export async function listPublicUsers(q = "", limit = 20) {
  const { data } = await api.get("/users/public", { params: { q, limit } });
  return data;
}

export async function getUserById(id) {
  const { data } = await api.get(`/users/${id}`);
  return data;
}

export async function followUser(id) {
  const { data } = await api.post(`/users/${id}/follow`);
  return data;
}

export async function unfollowUser(id) {
  const { data } = await api.delete(`/users/${id}/follow`);
  return data;
}

export { api };

