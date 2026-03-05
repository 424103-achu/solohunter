import { useContext } from 'react';
import { QuestContext } from '../context/QuestContext';

export const useQuest = () => {
  const context = useContext(QuestContext);
  if (!context) {
    throw new Error('useQuest must be used within QuestProvider');
  }
  return context;
};
