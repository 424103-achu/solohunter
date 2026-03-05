import api from './api';

export const getAllQuests = async () => {
  const { data } = await api.get('/quests');
  return data;
};

export const getQuestById = async (id) => {
  const { data } = await api.get(`/quests/${id}`);
  return data;
};

export const getAvailableQuests = async () => {
  const { data } = await api.get('/quests/available');
  return data;
};

export const getDailyQuests = async () => {
  const { data } = await api.get('/quests/daily');
  return data;
};

export const getBossQuests = async () => {
  const { data } = await api.get('/quests/boss');
  return data;
};

export const getQuestsByType = async (type) => {
  const { data } = await api.get(`/quests/type/${type}`);
  return data;
};
