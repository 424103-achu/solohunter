import api from './api';

export const getUserStats = async () => {
  const { data } = await api.get('/user/stats');
  return data;
};

export const allocateStatPoints = async (strength, intelligence, agility) => {
  const { data } = await api.post('/user/stats/allocate', { strength, intelligence, agility });
  return data;
};

export const getFullStats = async () => {
  const { data } = await api.get('/stats');
  return data;
};

export const getLeaderboard = async (sort = 'xp', limit = 50) => {
  const { data } = await api.get(`/leaderboard?sort=${sort}&limit=${limit}`);
  return data;
};
