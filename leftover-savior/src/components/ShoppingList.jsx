import { useState, useEffect, useRef } from 'react';
import { t } from '../i18n';

export default function ShoppingList({ lang, theme, items, removeItem, clearItems, closeAllKey = 0 }) {
  const [isOpen, setIsOpen] = useState(false);
  const _closeRef = useRef(closeAllKey);
  useEffect(() => {
    if (closeAllKey !== _closeRef.current) {
      setIsOpen(false);
      _closeRef.current = closeAllKey;
    }
  }, [closeAllKey]);
  const isCartoon = theme === 'magazine';

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
        🛒 {t(lang, 'shoppingList')}
        {items.length > 0 && (
          <span
            className="theme-badge"
            style={{
              backgroundColor: isCartoon ? '#FF8FAB' : 'var(--color-primary)',
              color: '#fff',
            }}
          >
            {items.length}
          </span>
        )}
      </button>

      {isOpen && (
        <div className="mt-2 animate-slide-up" style={panelStyle}>
          {items.length === 0 ? (
            <p className="text-xs text-center py-3" style={{ color: 'var(--color-text-muted)' }}>
              {t(lang, 'shoppingEmpty')}
            </p>
          ) : (
            <>
              <ul className="space-y-1.5 mb-2.5">
                {items.map((item) => (
                  <li
                    key={item}
                    className="flex items-center justify-between px-3 py-2 text-xs sm:text-sm rounded-lg"
                    style={{
                      backgroundColor: isCartoon ? '#FFF9EC' : 'var(--color-bg-input)',
                      border: isCartoon ? '1.5px solid #ddd' : 'none',
                      borderRadius: isCartoon ? '10px' : '8px',
                    }}
                  >
                    <span className="flex items-center gap-2">
                      <input
                        type="checkbox"
                        className="cursor-pointer"
                        style={{ accentColor: isCartoon ? '#B5E5CF' : 'var(--color-success)' }}
                        onChange={() => removeItem(item)}
                      />
                      <span style={{ fontWeight: isCartoon ? 600 : 400 }}>{item}</span>
                    </span>
                    <button
                      onClick={() => removeItem(item)}
                      className="text-sm hover:opacity-70 font-bold"
                      style={{ color: 'var(--color-text-muted)' }}
                    >
                      ×
                    </button>
                  </li>
                ))}
              </ul>
              <button
                onClick={clearItems}
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
                {t(lang, 'clearShopping')}
              </button>
            </>
          )}
        </div>
      )}
    </div>
  );
}
