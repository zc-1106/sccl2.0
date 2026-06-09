import { t } from '../i18n';

const MODES = [
  { key: 'lazy', icon: '😴', emojiAlt: '💤', nameKey: 'modeLazy', descKey: 'modeLazyDesc' },
  { key: 'hardcore', icon: '🔥', emojiAlt: '👨‍🍳', nameKey: 'modeHardcore', descKey: 'modeHardcoreDesc' },
  { key: 'hell', icon: '💀', emojiAlt: '☠️', nameKey: 'modeHell', descKey: 'modeHellDesc' },
];

export default function ModeSwitch({ mode, onChange, lang, theme }) {
  const isCartoon = theme === 'magazine';

  return (
    <div className={`flex gap-2 ${isCartoon ? 'gap-3' : ''}`}>
      {MODES.map((m) => {
        const isActive = mode === m.key;
        return (
          <button
            key={m.key}
            onClick={() => onChange(m.key)}
            className={`flex-1 text-center transition-all ${
              isCartoon
                ? 'p-3 rounded-card border-2'
                : 'py-2.5 px-2 rounded-card border'
            }`}
            style={{
              backgroundColor: isActive
                ? (isCartoon ? 'var(--color-bg-card)' : 'var(--color-primary)')
                : (isCartoon ? 'var(--color-bg-card)' : 'var(--color-bg-card)'),
              color: isActive
                ? (isCartoon ? 'var(--color-text)' : '#fff')
                : 'var(--color-text)',
              borderColor: isActive
                ? (isCartoon ? '#333' : 'var(--color-primary)')
                : (isCartoon ? '#333' : 'var(--color-border)'),
              borderWidth: isCartoon ? '2.5px' : '1px',
              boxShadow: isActive && isCartoon ? '3px 3px 0px rgba(0,0,0,0.2)' : 'none',
              transform: isActive && isCartoon ? 'scale(1.05)' : 'scale(1)',
              transition: 'var(--transition-base)',
              cursor: 'pointer',
              fontWeight: isActive ? 600 : 400,
            }}
          >
            <div
              className={`text-xl sm:text-2xl mb-0.5 ${
                isCartoon && isActive ? 'animate-wiggle' : ''
              }`}
            >
              {isCartoon ? m.icon : m.emojiAlt}
            </div>
            <div className="text-xs sm:text-sm font-semibold">
              {t(lang, m.nameKey)}
            </div>
            <div
              className="text-[10px] sm:text-xs mt-0.5"
              style={{
                color: isActive
                  ? (isCartoon ? 'var(--color-text-muted)' : 'rgba(255,255,255,0.85)')
                  : 'var(--color-text-muted)',
              }}
            >
              {t(lang, m.descKey)}
            </div>
          </button>
        );
      })}
    </div>
  );
}
