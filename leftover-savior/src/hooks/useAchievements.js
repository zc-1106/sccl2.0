import { useState, useCallback, useEffect, useRef } from 'react';
import { getNumber, setItem } from '../utils/storage';

const ACHIEVEMENTS = [
  { key: 'newbie', threshold: 5, nameKey: 'achievementNewbie', descKey: 'achievementNewbieDesc', icon: '🍳' },
  { key: 'cook', threshold: 10, nameKey: 'achievementCook', descKey: 'achievementCookDesc', icon: '👨‍🍳' },
  { key: 'master', threshold: 50, nameKey: 'achievementMaster', descKey: 'achievementMasterDesc', icon: '👑' },
];

const COUNT_KEY = 'leftover_generation_count';
const UNLOCKED_KEY = 'leftover_unlocked_achievements';

/**
 * Hook for achievement system
 * Returns any newly unlocked achievement so caller can trigger confetti
 */
export function useAchievements() {
  const [generationCount, setGenerationCount] = useState(() => getNumber(COUNT_KEY, 0));
  const [unlocked, setUnlocked] = useState(() => {
    try {
      return JSON.parse(localStorage.getItem(UNLOCKED_KEY)) || [];
    } catch { return []; }
  });
  const [newAchievement, setNewAchievement] = useState(null);
  const lastCount = useRef(generationCount);

  const incrementCount = useCallback(() => {
    const next = generationCount + 1;
    setGenerationCount(next);
    setItem(COUNT_KEY, next);

    // Check for newly unlocked achievements
    for (const ach of ACHIEVEMENTS) {
      if (next >= ach.threshold && !unlocked.includes(ach.key)) {
        const newUnlocked = [...unlocked, ach.key];
        setUnlocked(newUnlocked);
        setItem(UNLOCKED_KEY, newUnlocked);
        setNewAchievement(ach);
        break; // only trigger one at a time
      }
    }
  }, [generationCount, unlocked]);

  // Clear new achievement notification after it's been shown
  const clearNewAchievement = useCallback(() => {
    setNewAchievement(null);
  }, []);

  // Track changes
  useEffect(() => {
    lastCount.current = generationCount;
  }, [generationCount]);

  return {
    generationCount,
    unlocked,
    achievements: ACHIEVEMENTS,
    newAchievement,
    incrementCount,
    clearNewAchievement,
  };
}
