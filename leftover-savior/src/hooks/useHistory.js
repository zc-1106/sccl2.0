import { useCallback } from 'react';
import { useLocalStorage } from './useLocalStorage';

const MAX_HISTORY = 50;

/**
 * Hook for recipe generation history
 */
export function useHistory() {
  const [history, setHistory] = useLocalStorage('leftover_history', []);

  const addEntry = useCallback((entry) => {
    setHistory((prev) => {
      const newEntry = {
        ...entry,
        id: Date.now(),
        timestamp: new Date().toISOString(),
      };
      const next = [newEntry, ...prev];
      return next.slice(0, MAX_HISTORY);
    });
  }, [setHistory]);

  const clearHistory = useCallback(() => {
    setHistory([]);
  }, [setHistory]);

  const removeEntry = useCallback((id) => {
    setHistory((prev) => prev.filter((e) => e.id !== id));
  }, [setHistory]);

  return { history, addEntry, clearHistory, removeEntry };
}
