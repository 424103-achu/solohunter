import { createContext, useState, useCallback } from 'react';
import { getAllQuests, getAvailableQuests, getDailyQuests, getBossQuests, getQuestById } from '../services/questService';

export const QuestContext = createContext(null);

export const QuestProvider = ({ children }) => {
  const [quests, setQuests] = useState([]);
  const [availableQuests, setAvailableQuests] = useState([]);
  const [dailyQuests, setDailyQuests] = useState([]);
  const [bossQuests, setBossQuests] = useState([]);
  const [selectedQuest, setSelectedQuest] = useState(null);
  const [loading, setLoading] = useState(false);

  const fetchAllQuests = useCallback(async () => {
    try {
      setLoading(true);
      const data = await getAllQuests();
      setQuests(data.quests || data || []);
      return data;
    } catch (err) {
      console.error('Failed to load quests:', err);
    } finally {
      setLoading(false);
    }
  }, []);

  const fetchAvailableQuests = useCallback(async () => {
    try {
      setLoading(true);
      const data = await getAvailableQuests();
      setAvailableQuests(data.quests || data || []);
      return data;
    } catch (err) {
      console.error('Failed to load available quests:', err);
    } finally {
      setLoading(false);
    }
  }, []);

  const fetchDailyQuests = useCallback(async () => {
    try {
      const data = await getDailyQuests();
      setDailyQuests(data.quests || data || []);
      return data;
    } catch (err) {
      console.error('Failed to load daily quests:', err);
    }
  }, []);

  const fetchBossQuests = useCallback(async () => {
    try {
      const data = await getBossQuests();
      setBossQuests(data.quests || data || []);
      return data;
    } catch (err) {
      console.error('Failed to load boss quests:', err);
    }
  }, []);

  const fetchQuestById = useCallback(async (id) => {
    try {
      setLoading(true);
      const data = await getQuestById(id);
      setSelectedQuest(data.quest || data);
      return data;
    } catch (err) {
      console.error('Failed to load quest:', err);
    } finally {
      setLoading(false);
    }
  }, []);

  return (
    <QuestContext.Provider value={{
      quests, availableQuests, dailyQuests, bossQuests, selectedQuest, loading,
      fetchAllQuests, fetchAvailableQuests, fetchDailyQuests, fetchBossQuests, fetchQuestById,
      setSelectedQuest,
      // Backward-compat aliases
      loadAllQuests: fetchAllQuests, loadAvailableQuests: fetchAvailableQuests,
      loadDailyQuests: fetchDailyQuests, loadQuest: fetchQuestById,
      currentQuest: selectedQuest, setCurrentQuest: setSelectedQuest,
    }}>
      {children}
    </QuestContext.Provider>
  );
};
