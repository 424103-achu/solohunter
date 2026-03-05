import api from './api';

export const getSkillTree = async () => {
  const { data } = await api.get('/skills/tree');
  return data;
};

export const unlockSkill = async (skillId) => {
  const { data } = await api.post('/skills/unlock', { skillId });
  return data;
};
