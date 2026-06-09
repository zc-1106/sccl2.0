import { useCallback } from 'react';
import { useLocalStorage } from './useLocalStorage';

/**
 * Hook for ingredient inventory (pantry)
 */
export function useInventory() {
  const [inventory, setInventory] = useLocalStorage('leftover_inventory', []);

  const addItem = useCallback((item) => {
    const normalized = item.trim();
    if (!normalized) return;
    setInventory((prev) => {
      if (prev.includes(normalized)) return prev;
      return [...prev, normalized];
    });
  }, [setInventory]);

  const removeItem = useCallback((item) => {
    setInventory((prev) => prev.filter((i) => i !== item));
  }, [setInventory]);

  const clearInventory = useCallback(() => {
    setInventory([]);
  }, [setInventory]);

  return { inventory, addItem, removeItem, clearInventory };
}
