import { useCallback } from 'react';
import { useLocalStorage } from './useLocalStorage';

const DEFAULT_PREFS = {
  dietary: [],     // string[]
  taste: '',       // spicy|sweet|sour|salty|light|rich
  tools: [],       // string[]
  servings: 1,     // 1-6
};

/**
 * Hook for user cooking preferences
 */
export function usePreferences() {
  const [prefs, setPrefs] = useLocalStorage('leftover_preferences', DEFAULT_PREFS);

  const setDietary = useCallback((dietary) => {
    setPrefs((p) => ({ ...p, dietary }));
  }, [setPrefs]);

  const addDietary = useCallback((item) => {
    setPrefs((p) => ({
      ...p,
      dietary: p.dietary.includes(item) ? p.dietary : [...p.dietary, item],
    }));
  }, [setPrefs]);

  const removeDietary = useCallback((item) => {
    setPrefs((p) => ({
      ...p,
      dietary: p.dietary.filter((d) => d !== item),
    }));
  }, [setPrefs]);

  const setTaste = useCallback((taste) => {
    setPrefs((p) => ({ ...p, taste }));
  }, [setPrefs]);

  const setTools = useCallback((tools) => {
    setPrefs((p) => ({ ...p, tools }));
  }, [setPrefs]);

  const addTool = useCallback((tool) => {
    setPrefs((p) => ({
      ...p,
      tools: p.tools.includes(tool) ? p.tools : [...p.tools, tool],
    }));
  }, [setPrefs]);

  const removeTool = useCallback((tool) => {
    setPrefs((p) => ({
      ...p,
      tools: p.tools.filter((t) => t !== tool),
    }));
  }, [setPrefs]);

  const setServings = useCallback((servings) => {
    setPrefs((p) => ({ ...p, servings }));
  }, [setPrefs]);

  return {
    prefs,
    setDietary,
    addDietary,
    removeDietary,
    setTaste,
    addTool,
    removeTool,
    setTools,
    setServings,
  };
}
