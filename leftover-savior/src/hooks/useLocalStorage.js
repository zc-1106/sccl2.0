import { useState, useCallback } from 'react';
import { getItem, setItem } from '../utils/storage';

/**
 * React hook wrapping localStorage with reactive state
 */
export function useLocalStorage(key, defaultValue) {
  const [value, setValue] = useState(() => getItem(key, defaultValue));

  const update = useCallback((newValue) => {
    setValue((prev) => {
      const next = typeof newValue === 'function' ? newValue(prev) : newValue;
      setItem(key, next);
      return next;
    });
  }, [key]);

  const remove = useCallback(() => {
    setValue(defaultValue);
    setItem(key, defaultValue);
  }, [key, defaultValue]);

  return [value, update, remove];
}
