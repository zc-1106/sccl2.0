import { useState, useEffect, useRef } from 'react';
import { t } from '../i18n';

export default function Leaderboard({ lang, theme, entries, addEntry, removeEntry, clearAll, closeAllKey = 0 }) {
  const [isOpen, setIsOpen] = useState(false);
  const _closeRef = useRef(closeAllKey);
  useEffect(() => {
    if (closeAllKey !== _closeRef.current) {
      setIsOpen(false);
      _closeRef.current = closeAllKey;
    }
  }, [closeAllKey]);
  const [ratingRecipe, setRatingRecipe] = useState(null);
  const [ratingValue, setRatingValue] = useState(3);
  const isCartoon = theme === 'magazine';

  const openRating = (recipe, ingredients, mode) => {
    if (mode !== 'hell') return;
    setRatingRecipe({ ...recipe, ingredients });
    setRatingValue(3);
  };

  const submitRating = () => {
    if (ratingRecipe) {
      addEntry(ratingRecipe, ratingValue);
      setRatingRecipe(null);
    }
  };

  // Expose to window for external access
  if (typeof window !== 'undefined') {
    window.__leaderboardOpenRating = openRating;
  }

  const panelStyle = isCartoon
    ? {
        backgroundColor: '#fff',
        border: '2.5px solid #333',
        borderRadius: 'var(--radius-card)',
        boxShadow: '3px 3px 0px rgba(0,0,0,0.15)',
        padding: '14px',
        maxHeight: '320px',
        overflowY: 'auto',
      }
    : {
        backgroundColor: '#fff',
        border: '1px solid var(--color-border)',
        borderRadius: 'var(--radius-card)',
        padding: '14px',
        maxHeight: '320px',
        overflowY: 'auto',
      };

  const modalBg = isCartoon
    ? { backgroundColor: '#fff', border: '3px solid #333', borderRadius: 'var(--radius-card)', boxShadow: '4px 4px 0px rgba(0,0,0,0.2)' }
    : { backgroundColor: '#fff', border: '1px solid var(--color-border)', borderRadius: 'var(--radius-card)', boxShadow: '0 8px 30px rgba(0,0,0,0.12)' };

  return (
    <div className="mt-3">
      <button onClick={() => setIsOpen(!isOpen)} className="theme-panel-toggle">
        <span className={`transition-transform ${isOpen ? 'rotate-90' : ''}`}>▶</span>
        ☠️ {t(lang, 'leaderboard')}
        {entries.length > 0 && (
          <span
            className="theme-badge"
            style={{ backgroundColor: isCartoon ? '#FF8FAB' : 'var(--color-bg-hover, #f5f5f7)', color: isCartoon ? '#fff' : 'var(--color-text)' }}
          >
            {entries.length}
          </span>
        )}
      </button>

      {/* Rating modal */}
      {ratingRecipe && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4" style={{ backgroundColor: 'rgba(0,0,0,0.35)' }}>
          <div className="w-full max-w-sm p-5 animate-pop-in" style={modalBg}>
            <h3
              className="text-sm font-bold mb-1"
              style={{ fontFamily: isCartoon ? 'var(--font-display)' : 'var(--font-sans)', color: 'var(--color-text)' }}
            >
              ☠️ {t(lang, 'rateIt')}: {ratingRecipe.name}
            </h3>
            <p className="text-xs mb-3" style={{ color: 'var(--color-text-muted)' }}>
              {t(lang, 'poisonLevel')}: {ratingValue} / 5
            </p>
            <input
              type="range"
              min="1"
              max="5"
              value={ratingValue}
              onChange={(e) => setRatingValue(Number(e.target.value))}
              className="w-full mb-3"
              style={{ accentColor: isCartoon ? '#FF8FAB' : 'var(--color-primary)' }}
            />
            <div className="flex justify-center gap-1 text-2xl mb-3">
              {[1, 2, 3, 4, 5].map((n) => (
                <span key={n} className="cursor-pointer transition-transform hover:scale-125" onClick={() => setRatingValue(n)}>
                  {n <= ratingValue ? '🧪' : '⚗️'}
                </span>
              ))}
            </div>
            <div className="flex gap-2">
              <button
                onClick={() => setRatingRecipe(null)}
                className="flex-1 py-1.5 text-xs font-medium"
                style={{
                  backgroundColor: isCartoon ? '#fff' : 'var(--color-bg-input)',
                  color: 'var(--color-text)',
                  border: isCartoon ? '2px solid #333' : '1px solid var(--color-border)',
                  borderRadius: 'var(--radius-btn)',
                  fontWeight: isCartoon ? 600 : 500,
                  cursor: 'pointer',
                }}
              >
                {t(lang, 'cancel')}
              </button>
              <button
                onClick={submitRating}
                className="flex-1 py-1.5 text-xs font-medium"
                style={{
                  backgroundColor: isCartoon ? '#FF8FAB' : 'var(--color-primary)',
                  color: '#fff',
                  border: isCartoon ? '2px solid #333' : 'none',
                  borderRadius: 'var(--radius-btn)',
                  fontWeight: isCartoon ? 700 : 500,
                  cursor: 'pointer',
                }}
              >
                {t(lang, 'confirm')}
              </button>
            </div>
          </div>
        </div>
      )}

      {isOpen && (
        <div className="mt-2 animate-slide-up" style={panelStyle}>
          {entries.length === 0 ? (
            <p className="text-xs text-center py-3" style={{ color: 'var(--color-text-muted)' }}>
              {t(lang, 'leaderboardEmpty')}
            </p>
          ) : (
            <>
              <div className="space-y-1.5 mb-2.5">
                {entries.map((entry, idx) => (
                  <div
                    key={entry.id}
                    className="flex items-center justify-between px-3 py-2 rounded-lg text-xs"
                    style={{
                      backgroundColor: isCartoon ? '#FFF9EC' : 'var(--color-bg-input)',
                      border: isCartoon ? '1.5px solid #ddd' : 'none',
                      borderRadius: isCartoon ? '10px' : '8px',
                    }}
                  >
                    <div className="flex items-center gap-2 min-w-0">
                      <span
                        className="font-bold text-sm flex-shrink-0"
                        style={{ color: isCartoon ? '#FF8FAB' : 'var(--color-primary)' }}
                      >
                        #{idx + 1}
                      </span>
                      <div className="min-w-0">
                        <div className="font-semibold truncate">{entry.name}</div>
                        <div style={{ color: 'var(--color-text-muted)', fontSize: '0.65rem' }}>
                          {entry.ingredients?.slice(0, 25)}...
                        </div>
                      </div>
                    </div>
                    <div className="flex items-center gap-1.5 flex-shrink-0">
                      <span className="text-xs">{'🧪'.repeat(entry.rating)}{'⚗️'.repeat(5 - entry.rating)}</span>
                      <button
                        onClick={() => removeEntry(entry.id)}
                        className="text-sm font-bold hover:opacity-70"
                        style={{ color: 'var(--color-text-muted)' }}
                      >
                        ×
                      </button>
                    </div>
                  </div>
                ))}
              </div>
              <button
                onClick={clearAll}
                className="w-full py-1.5 text-xs font-medium transition-all hover:opacity-80"
                style={{
                  backgroundColor: isCartoon ? '#fff' : 'var(--color-bg-input)',
                  color: isCartoon ? '#FF8FAB' : 'var(--color-danger)',
                  border: isCartoon ? '2px solid #FF8FAB' : '1px solid var(--color-border)',
                  borderRadius: 'var(--radius-btn)',
                  fontWeight: isCartoon ? 700 : 500,
                  transition: 'var(--transition-base)',
                  cursor: 'pointer',
                }}
              >
                {t(lang, 'clear')}
              </button>
            </>
          )}
        </div>
      )}
    </div>
  );
}

export function openLeaderboardRating(recipe, ingredients, mode) {
  if (typeof window !== 'undefined' && window.__leaderboardOpenRating) {
    window.__leaderboardOpenRating(recipe, ingredients, mode);
  }
}
