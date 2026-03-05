// Skill Controller
import { getSkillTreeForUser, unlockSkill } from '../services/skillEngineService.js';

export const fetchSkillTree = async (req, res) => {
  try {
    const result = await getSkillTreeForUser(req.user.id);
    res.json(result);
  } catch (err) {
    console.error('FETCH SKILL TREE ERROR:', err);
    res.status(500).json({ message: 'Server error' });
  }
};

export const unlockUserSkill = async (req, res) => {
  try {
    const { skillId } = req.body;
    if (!skillId) {
      return res.status(400).json({ message: 'Skill ID required' });
    }

    const result = await unlockSkill(req.user.id, skillId);
    res.json(result);
  } catch (err) {
    console.error('UNLOCK SKILL ERROR:', err);
    res.status(400).json({ message: err.message });
  }
};
