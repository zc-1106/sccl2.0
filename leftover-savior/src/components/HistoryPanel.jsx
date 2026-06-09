import { useState, useEffect, useRef } from 'react';
import { t } from '../i18n';

export default function HistoryPanel({ lang, theme, history, clearHistory, removeEntry, closeAllKey = 0 }) {
  const [isOpen, setIsOpen] = useState(false);
  const _closeRef = useRef(closeAllKey);
  useEffect(() => {
    if (closeAllKey !== _closeRef.current) {
      setIsOpen(false);
      _closeRef.current = closeAllKey;
    }
  }, [closeAllKey]);
  const isCartoon = theme === 'magazine';

  const formatDate = (isoStr) => {
    try {
      const d = new Date(isoStr);
      return d.toLocaleString(
        lang === 'jp' ? 'ja-JP' : lang === 'en' ? 'en-US' : 'zh-CN',
        { month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' }
      );
    } catch { return isoStr; }
  };

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

  return (
    <div className="mt-3">
      <button onClick={() => setIsOpen(!isOpen)} className="theme-panel-toggle">
        <span className={`transition-transform ${isOpen ? 'rotate-90' : ''}`}>▶</span>
        📜 {t(lang, 'history')}
        {history.length > 0 && (
          <span
            className="theme-badge"
            style={{
              backgroundColor: isCartoon ? '#7EC8E3' : 'var(--color-secondary, #e8e8ed)',
              color: isCartoon ? '#fff' : 'var(--color-text)',
            }}
          >
            {history.length}
          </span>
        )}
      </button>

      {isOpen && (
        <div className="mt-2 animate-slide-up" style={panelStyle}>
          {history.length === 0 ? (
            <p className="text-xs text-center py-3" style={{ color: 'var(--color-text-muted)' }}>
              {t(lang, 'historyEmpty')}
            </p>
          ) : (
            <>
              <div className="space-y-1.5 mb-2.5">
                {history.map((entry) => (
                  <div
                    key={entry.id}
                    className="flex items-start justify-between px-3 py-2 rounded-lg text-xs"
                    style={{
                      backgroundColor: isCartoon ? '#FFF9EC' : 'var(--color-bg-input)',
                      border: isCartoon ? '1.5px solid #ddd' : 'none',
                      borderRadius: isCartoon ? '10px' : '8px',
                    }}
                  >
                    <div className="min-w-0">
                      <span className="font-semibold block truncate">
                        {entry.recipe?.name || '???'}
                      </span>
                      <span style={{ color: 'var(--color-text-muted)', fontSize: '0.7rem' }}>
                        {entry.mode === 'hell' ? '💀' : entry.mode === 'hardcore' ? '🔥' : '😴'}
                        {' '}{formatDate(entry.timestamp)}
                      </span>
                    </div>
                    <button
                      onClick={() => removeEntry(entry.id)}
                      className="text-sm hover:opacity-70 flex-shrink-0 ml-2 font-bold"
                      style={{ color: 'var(--color-text-muted)' }}
                    >
                      ×
                    </button>
                  </div>
                ))}
              </div>
              <button
                onClick={clearHistory}
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
                {t(lang, 'clearHistory')}
              </button>
            </>
          )}
        </div>
      )}
    </div>
  );
}
