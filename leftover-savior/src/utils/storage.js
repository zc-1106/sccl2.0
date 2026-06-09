/**
 * Safe localStorage wrapper with JSON serialization
 */

export function getItem(key, defaultValue = null) {
  try {
    const raw = localStorage.getItem(key);
    if (raw === null) return defaultValue;
    return JSON.parse(raw);
  } catch (e) {
    return defaultValue;
  }
}

export function setItem(key, value) {
  try {
    localStorage.setItem(key, JSON.stringify(value));
  } catch (e) {
    console.warn('Failed to write to localStorage:', e);
  }
}

export function removeItem(key) {
  try {
    localStorage.removeItem(key);
  } catch (e) {
    // ignore
  }
}

// ---- Typed helpers ----

export function getString(key, defaultValue = '') {
  return getItem(key, defaultValue);
}

export function getNumber(key, defaultValue = 0) {
  return Number(getItem(key, defaultValue)) || defaultValue;
}

export function getBool(key, defaultValue = false) {
  return Boolean(getItem(key, defaultValue));
}

export function getArray(key, defaultValue = []) {
  const val = getItem(key);
  return Array.isArray(val) ? val : defaultValue;
}

export function getObject(key, defaultValue = {}) {
  const val = getItem(key);
  return (val !== null && typeof val === 'object' && !Array.isArray(val)) ? val : defaultValue;
}
