import { createContext, useState, useCallback } from 'react';
import { getUserProfile, selectNiche as selectNicheApi, getNiches, getBadges } from '../services/authService';
import { getUserStats, allocateStatPoints as allocateApi } from '../services/statsService';

export const UserContext = createContext(null);

export const UserProvider = ({ children }) => {
  const [profile, setProfile] = useState(null);
  const [stats, setStats] = useState(null);
  const [niches, setNiches] = useState([]);
  const [badges, setBadges] = useState([]);
  const [loading, setLoading] = useState(false);

  const fetchProfile = useCallback(async () => {
    try {
      setLoading(true);
      const data = await getUserProfile();
      setProfile(data);
      return data;
    } catch (err) {
      console.error('Failed to load profile:', err);
    } finally {
      setLoading(false);
    }
  }, []);

  const fetchStats = useCallback(async () => {
    try {
      const data = await getUserStats();
      setStats(data);
      return data;
    } catch (err) {
      console.error('Failed to load stats:', err);
    }
  }, []);

  const fetchNiches = useCallback(async () => {
    try {
      const data = await getNiches();
      setNiches(data);
      return data;
    } catch (err) {
      console.error('Failed to load niches:', err);
    }
  }, []);

  const fetchBadges = useCallback(async () => {
    try {
      const data = await getBadges();
      setBadges(data.badges || data || []);
      return data;
    } catch (err) {
      console.error('Failed to load badges:', err);
    }
  }, []);

  const selectNiche = useCallback(async (nicheId) => {
    const data = await selectNicheApi(nicheId);
    await fetchProfile();
    return data;
  }, [fetchProfile]);

  const allocateStatPoints = useCallback(async (strength, intelligence, agility) => {
    const data = await allocateApi(strength, intelligence, agility);
    setStats(data);
    return data;
  }, []);

  return (
    <UserContext.Provider value={{
      profile, stats, niches, badges, loading,
      fetchProfile, fetchStats, fetchNiches, fetchBadges,
      selectNiche, allocateStatPoints, setProfile,
      // Backward-compat aliases
      loadProfile: fetchProfile, loadStats: fetchStats, loadNiches: fetchNiches,
    }}>
      {children}
    </UserContext.Provider>
  );
};
