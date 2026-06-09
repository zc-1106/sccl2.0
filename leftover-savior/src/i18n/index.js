import zh from './zh';
import en from './en';
import jp from './jp';

const translations = { zh, en, jp };

const langNames = {
  zh: '中文',
  en: 'English',
  jp: '日本語',
};

const langFonts = {
  zh: "'Noto Sans SC', system-ui, sans-serif",
  en: "'Inter', system-ui, sans-serif",
  jp: "'Noto Sans JP', system-ui, sans-serif",
};

/**
 * Translate a key for the given language
 * @param {string} lang - 'zh' | 'en' | 'jp'
 * @param {string} key - translation key
 * @param {Record<string, string>} [vars] - optional variable replacements
 * @returns {string}
 */
export function t(lang, key, vars = {}) {
  let text = translations[lang]?.[key] || translations['zh']?.[key] || key;
  for (const [k, v] of Object.entries(vars)) {
    text = text.replace(`{${k}}`, v);
  }
  return text;
}

/**
 * Get human-readable language name
 */
export function getLangName(lang) {
  return langNames[lang] || lang;
}

/**
 * Get suitable font for a language
 */
export function getLangFont(lang) {
  return langFonts[lang] || langFonts['en'];
}

/**
 * List of supported languages
 */
export const supportedLangs = Object.keys(translations);

export default translations;
