import { useState, useEffect, useRef } from "react";
import { t } from '../i18n';

export default function AchievementPanel({ lang, theme, achievements, unlocked, newAchievement, clearNewAchievement, generationCount, closeAllKey = 0 }) {
  const [isOpen, setIsOpen] = useState(false);
  const _closeRef = useRef(closeAllKey);
  useEffect(() => {
    if (closeAllKey !== _closeRef.current) {
      setIsOpen(false);
      _closeRef.current = closeAllKey;
    }
  }, [closeAllKey]);
  const [showNotification, setShowNotification] = useState(false);
  const isCartoon = theme === 'magazine';

  useEffect(() => {
    if (newAchievement) {
      setShowNotification(true);
      const timer = setTimeout(() => {
        setShowNotification(false);
        clearNewAchievement();
      }, 4000);
      return () => clearTimeout(timer);
    }
  }, [newAchievement, clearNewAchievement]);

  const panelStyle = isCartoon
    ? {
        backgroundColor: '#fff',
        border: '2.5px solid #333',
        borderRadius: 'var(--radius-card)',
        boxShadow: '3px 3px 0px rgba(0,0,0,0.15)',
        padding: '14px',
      }
    : {
        backgroundColor: '#fff',
        border: '1px solid var(--color-border)',
        borderRadius: 'var(--radius-card)',
        padding: '14px',
      };

  return (
    <div className="mt-3">
      <button onClick={() => setIsOpen(!isOpen)} className="theme-panel-toggle">
        <span className={`transition-transform ${isOpen ? 'rotate-90' : ''}`}>▶</span>
        🏆 {t(lang, 'achievements')}
        <span
          className="theme-badge"
          style={{
            backgroundColor: isCartoon ? '#FFD166' : 'var(--color-bg-hover, #f5f5f7)',
            color: isCartoon ? '#333' : 'var(--color-text)',
          }}
        >
          {unlocked.length}/{achievements.length}
        </span>
      </button>

      {/* Achievement unlock toast */}
      {showNotification && newAchievement && (
        <div
          className={`mt-2 p-4 text-center ${
            isCartoon ? 'animate-pop-in' : 'animate-slide-down'
          }`}
          style={{
            backgroundColor: isCartoon ? '#FFD166' : 'var(--color-bg-card)',
            color: 'var(--color-text)',
            border: isCartoon ? '3px solid #333' : '1px solid var(--color-primary)',
            borderRadius: 'var(--radius-card)',
          }}
        >
          <div className={`text-2xl mb-1 ${isCartoon ? 'animate-wiggle' : ''}`}>
            {newAchievement.icon}
          </div>
          <div className="text-sm font-bold">
            {isCartoon ? '🎉 ' : ''}{t(lang, 'achievementUnlocked')}{isCartoon ? ' 🎉' : ''}
          </div>
          <div className="text-xs" style={{ color: 'var(--color-text-muted)' }}>
            {t(lang, newAchievement.nameKey)}
          </div>
        </div>
      )}

      {isOpen && (
        <div className="mt-2 animate-slide-up" style={panelStyle}>
          <div
            className="text-xs mb-2.5"
            style={{
              color: 'var(--color-text-muted)',
              fontWeight: isCartoon ? 600 : 400,
            }}
          >
            {t(lang, 'achievements')}: {generationCount} / 50
          </div>
          <div className="space-y-2">
            {achievements.map((ach) => {
              const isUnlocked = unlocked.includes(ach.key);
              const progress = Math.min(100, Math.round((generationCount / ach.threshold) * 100));
              return (
                <div
                  key={ach.key}
                  className="p-2.5 rounded-lg"
                  style={{
                    backgroundColor: isCartoon ? '#FFF9EC' : 'var(--color-bg-input)',
                    border: isUnlocked
                      ? (isCartoon ? '2px solid #B5E5CF' : '1px solid var(--color-success)')
                      : (isCartoon ? '2px solid #ddd' : '1px solid var(--color-border)'),
                    borderRadius: isCartoon ? '12px' : '8px',
                    opacity: isUnlocked ? 1 : 0.6,
                  }}
                >
                  <div className="flex items-center gap-2 mb-1.5">
                    <span className="text-xl">{ach.icon}</span>
                    <div className="min-w-0">
                      <div
                        className="text-xs font-semibold"
                        style={{ fontFamily: isCartoon ? 'var(--font-display)' : 'var(--font-sans)' }}
                      >
                        {t(lang, ach.nameKey)}
                      </div>
                      <div className="text-[10px]" style={{ color: 'var(--color-text-muted)' }}>
                        {t(lang, ach.descKey)}
                      </div>
                    </div>
                    {isUnlocked && <span className="ml-auto text-sm">{isCartoon ? '⭐' : '✓'}</span>}
                  </div>
                  {/* Progress bar */}
                  <div
                    className="h-1.5 rounded-full overflow-hidden"
                    style={{ backgroundColor: isCartoon ? '#eee' : 'var(--color-border)' }}
                  >
                    <div
                      className="h-full rounded-full transition-all duration-500"
                      style={{
                        width: `${progress}%`,
                        backgroundColor: isCartoon
                          ? (isUnlocked ? '#B5E5CF' : '#FFD166')
                          : (isUnlocked ? 'var(--color-success)' : 'var(--color-primary)'),
                      }}
                    />
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
}
