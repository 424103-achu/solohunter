import { useState, useCallback } from 'react';
import { allocateStatPoints } from '../services/statsService';

export const useSkillPoints = () => {
  const [allocating, setAllocating] = useState(false);
  const [error, setError] = useState(null);

  const allocate = useCallback(async (strength, intelligence, agility) => {
    try {
      setAllocating(true);
      setError(null);
      const result = await allocateStatPoints(strength, intelligence, agility);
      return result;
    } catch (err) {
      const msg = err.response?.data?.message || 'Failed to allocate points';
      setError(msg);
      throw new Error(msg);
    } finally {
      setAllocating(false);
    }
  }, []);

  return { allocate, allocating, error };
};
