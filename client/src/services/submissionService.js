import api from './api';

export const submitCode = async (questId, code, language = 'javascript') => {
  const { data } = await api.post('/submissions/submit', { questId, code, language });
  return data;
};

export const runCode = async (code, language = 'javascript', stdin = '') => {
  const { data } = await api.post('/submissions/run', { code, language, stdin });
  return data;
};

export const getSubmissionHistory = async () => {
  const { data } = await api.get('/submissions/history');
  return data;
};

export const getQuestSubmissions = async (questId) => {
  const { data } = await api.get(`/submissions/quest/${questId}`);
  return data;
};

export const getFitnessQuests = async () => {
  const { data } = await api.get('/submissions/fitness');
  return data;
};

export const completeFitnessQuest = async (questId, duration) => {
  const { data } = await api.post('/submissions/fitness/complete', { questId, duration });
  return data;
};
