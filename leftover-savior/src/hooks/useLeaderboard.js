import { useCallback } from 'react';
import { useLocalStorage } from './useLocalStorage';

/**
 * Hook for dark cuisine leaderboard (Hell mode results)
 */
export function useLeaderboard() {
  const [entries, setEntries] = useLocalStorage('leftover_leaderboard', []);

  const addEntry = useCallback((recipe, rating) => {
    setEntries((prev) => {
      const newEntry = {
        id: Date.now(),
        name: recipe.name,
        ingredients: recipe.ingredients || '',
        roast: recipe.roast || '',
        rating: Math.min(5, Math.max(1, rating)),
        timestamp: new Date().toISOString(),
      };
      const next = [...prev, newEntry];
      // Sort by rating descending
      next.sort((a, b) => b.rating - a.rating);
      return next.slice(0, 100); // keep top 100
    });
  }, [setEntries]);

  const removeEntry = useCallback((id) => {
    setEntries((prev) => prev.filter((e) => e.id !== id));
  }, [setEntries]);

  const clearAll = useCallback(() => {
    setEntries([]);
  }, [setEntries]);

  return { entries, addEntry, removeEntry, clearAll };
}
