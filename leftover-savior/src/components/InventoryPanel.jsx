import { useState, useEffect, useRef } from 'react';
import { t } from '../i18n';

export default function InventoryPanel({ lang, theme, inventory, addItem, removeItem, onItemClick, closeAllKey = 0 }) {
  const [isOpen, setIsOpen] = useState(false);
  const _closeRef = useRef(closeAllKey);
  useEffect(() => {
    if (closeAllKey !== _closeRef.current) {
      setIsOpen(false);
      _closeRef.current = closeAllKey;
    }
  }, [closeAllKey]);
  const [input, setInput] = useState('');
  const isCartoon = theme === 'magazine';

  const handleAdd = () => {
    if (input.trim()) {
      addItem(input.trim());
      setInput('');
    }
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Enter') handleAdd();
  };

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

  const inputStyle = isCartoon
    ? { border: '2.5px solid #333', borderRadius: 'var(--radius-input)', backgroundColor: '#fff', color: '#333', fontWeight: 500 }
    : { border: '1px solid var(--color-border)', borderRadius: 'var(--radius-input)', backgroundColor: '#fff', color: 'var(--color-text)' };

  const btnStyle = isCartoon
    ? { backgroundColor: '#7EC8E3', color: '#fff', border: '2px solid #333', borderRadius: 'var(--radius-btn)', fontWeight: 700 }
    : { backgroundColor: 'var(--color-primary)', color: '#fff', border: 'none', borderRadius: 'var(--radius-btn)', fontWeight: 500 };

  return (
    <div className="mt-3">
      <button onClick={() => setIsOpen(!isOpen)} className="theme-panel-toggle">
        <span className={`transition-transform ${isOpen ? 'rotate-90' : ''}`}>▶</span>
        🧊 {t(lang, 'inventory')}
        {inventory.length > 0 && (
          <span
            className="theme-badge"
            style={{
              backgroundColor: isCartoon ? '#B5E5CF' : 'var(--color-bg-hover, #f5f5f7)',
              color: isCartoon ? '#333' : 'var(--color-text)',
            }}
          >
            {inventory.length}
          </span>
        )}
      </button>

      {isOpen && (
        <div className="mt-2 animate-slide-up" style={panelStyle}>
          <div className="flex gap-2 mb-2.5">
            <input
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={handleKeyDown}
              placeholder={t(lang, 'inventoryPlaceholder')}
              className="flex-1 px-3 py-1.5 text-xs"
              style={inputStyle}
            />
            <button
              onClick={handleAdd}
              className="px-3 py-1.5 text-xs transition-all hover:opacity-80"
              style={{ ...btnStyle, cursor: 'pointer', transition: 'var(--transition-base)' }}
            >
              + {t(lang, 'inventoryAdd')}
            </button>
          </div>

          {inventory.length === 0 ? (
            <p className="text-xs text-center py-3" style={{ color: 'var(--color-text-muted)' }}>
              {t(lang, 'inventoryEmpty')}
            </p>
          ) : (
            <div className="flex flex-wrap gap-1.5 max-h-40 overflow-y-auto">
              {inventory.map((item) => (
                <span
                  key={item}
                  className="inline-flex items-center gap-1 px-3 py-1.5 text-xs cursor-pointer transition-all"
                  style={{
                    backgroundColor: isCartoon ? '#fff' : 'var(--color-bg-input)',
                    color: 'var(--color-text)',
                    border: isCartoon ? '2px solid #333' : '1px solid var(--color-border)',
                    borderRadius: 'var(--radius-tag)',
                    fontWeight: isCartoon ? 600 : 500,
                    transition: 'var(--transition-base)',
                  }}
                  onClick={() => onItemClick(item)}
                  onMouseEnter={(e) => {
                    if (isCartoon) {
                      e.target.style.transform = 'rotate(-2deg) scale(1.08)';
                      e.target.style.backgroundColor = '#FFF9EC';
                    }
                  }}
                  onMouseLeave={(e) => {
                    if (isCartoon) {
                      e.target.style.transform = 'rotate(0deg) scale(1)';
                      e.target.style.backgroundColor = '#fff';
                    }
                  }}
                >
                  <span>{item}</span>
                  <button
                    onClick={(e) => { e.stopPropagation(); removeItem(item); }}
                    className="text-sm hover:opacity-70 ml-0.5 font-bold"
                    style={{ color: isCartoon ? '#FF8FAB' : 'var(--color-danger)' }}
                  >
                    ×
                  </button>
                </span>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
}
