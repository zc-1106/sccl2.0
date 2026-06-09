import { useCallback } from 'react';
import { useLocalStorage } from './useLocalStorage';

/**
 * Hook for shopping list (global dedup, localStorage)
 */
export function useShoppingList() {
  const [items, setItems] = useLocalStorage('leftover_shopping_list', []);

  const addItem = useCallback((item) => {
    setItems((prev) => {
      const normalized = item.trim();
      if (!normalized || prev.includes(normalized)) return prev;
      return [...prev, normalized];
    });
  }, [setItems]);

  const removeItem = useCallback((item) => {
    setItems((prev) => prev.filter((i) => i !== item));
  }, [setItems]);

  const clearItems = useCallback(() => {
    setItems([]);
  }, [setItems]);

  const hasItem = useCallback((item) => {
    return items.includes(item.trim());
  }, [items]);

  return { items, addItem, removeItem, clearItems, hasItem };
}
