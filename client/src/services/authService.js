import api from './api';

export const login = async (email, password) => {
  const { data } = await api.post('/auth/login', { email, password });
  return data;
};

export const register = async (username, email, password) => {
  const { data } = await api.post('/auth/register', { username, email, password });
  return data;
};

export const getCurrentUser = async () => {
  const { data } = await api.get('/user/me');
  return data;
};

export const getUserProfile = async () => {
  const { data } = await api.get('/user/profile');
  return data;
};

export const updateProfile = async (profileData) => {
  const { data } = await api.put('/user/profile', profileData);
  return data;
};

export const selectNiche = async (nicheId) => {
  const { data } = await api.post('/user/niche', { nicheId });
  return data;
};

export const getNiches = async () => {
  const { data } = await api.get('/user/niches');
  return data;
};

export const getBadges = async () => {
  const { data } = await api.get('/user/badges');
  return data;
};
