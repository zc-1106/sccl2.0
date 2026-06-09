import { useState, useEffect, useRef } from 'react';
import { t } from '../i18n';

const TASTE_OPTIONS = [
  { key: 'spicy', icon: '🌶️' },
  { key: 'sweet', icon: '🍬' },
  { key: 'sour', icon: '🍋' },
  { key: 'salty', icon: '🧂' },
  { key: 'light', icon: '🍃' },
  { key: 'rich', icon: '🧈' },
];

const TOOL_OPTIONS = [
  { key: 'microwave', icon: '📡' },
  { key: 'oven', icon: '🔥' },
  { key: 'airFryer', icon: '💨' },
  { key: 'riceCooker', icon: '🍚' },
  { key: 'wok', icon: '🍳' },
  { key: 'pot', icon: '🫕' },
];

export default function PreferencesPanel({ lang, theme, prefs, addDietary, removeDietary, setTaste, addTool, removeTool, setServings, closeAllKey = 0 }) {
  const [isOpen, setIsOpen] = useState(false);
  const _closeRef = useRef(closeAllKey);
  useEffect(() => {
    if (closeAllKey !== _closeRef.current) {
      setIsOpen(false);
      _closeRef.current = closeAllKey;
    }
  }, [closeAllKey]);
  const [dietaryInput, setDietaryInput] = useState('');
  const [toolInput, setToolInput] = useState('');
  const isCartoon = theme === 'magazine';

  const handleDietaryKeyDown = (e) => {
    if (e.key === 'Enter' && dietaryInput.trim()) {
      addDietary(dietaryInput.trim());
      setDietaryInput('');
    }
  };

  const handleToolKeyDown = (e) => {
    if (e.key === 'Enter' && toolInput.trim()) {
      addTool(toolInput.trim());
      setToolInput('');
    }
  };

  const panelClasses = isCartoon
    ? 'bg-white border-[2.5px] border-[#333] rounded-card shadow-[3px_3px_0px_rgba(0,0,0,0.15)]'
    : 'apple-card';

  const labelStyle = {
    fontSize: isCartoon ? '0.8rem' : '0.75rem',
    fontWeight: isCartoon ? 700 : 600,
    color: 'var(--color-text)',
    fontFamily: isCartoon ? 'var(--font-display)' : 'var(--font-sans)',
    textTransform: isCartoon ? 'none' : 'none',
    letterSpacing: isCartoon ? '0.02em' : '-0.01em',
  };

  const inputStyle = {
    ...(isCartoon
      ? {
          border: '2.5px solid #333',
          borderRadius: 'var(--radius-input)',
          backgroundColor: '#fff',
          color: '#333',
          fontWeight: 500,
        }
      : {
          border: '1px solid var(--color-border)',
          borderRadius: 'var(--radius-input)',
          backgroundColor: '#fff',
          color: 'var(--color-text)',
        }
    ),
  };

  return (
    <div className="mt-2">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="theme-panel-toggle"
      >
        <span className={`transition-transform ${isOpen ? 'rotate-90' : ''}`}>▶</span>
        ⚙️ {t(lang, 'preferences')}
      </button>

      {isOpen && (
        <div
          className={`mt-2 p-4 sm:p-5 animate-slide-up space-y-4 ${panelClasses}`}
        >
          {/* Dietary restrictions */}
          <div>
            <label className="block mb-1.5" style={labelStyle}>
              🚫 {t(lang, 'dietaryRestrictions')}
            </label>
            <div className="flex flex-wrap gap-1.5 mb-1.5">
              {prefs.dietary.map((item) => (
                <span
                  key={item}
                  className="inline-flex items-center gap-1 px-2.5 py-1 text-xs font-medium cursor-pointer"
                  style={{
                    backgroundColor: isCartoon ? '#FF8FAB' : 'var(--color-bg-hover, #f5f5f7)',
                    color: isCartoon ? '#fff' : 'var(--color-text)',
                    borderRadius: 'var(--radius-tag)',
                    border: isCartoon ? '2px solid #333' : 'none',
                    fontWeight: isCartoon ? 600 : 500,
                  }}
                  onClick={() => removeDietary(item)}
                >
                  {item} ×
                </span>
              ))}
            </div>
            <input
              type="text"
              value={dietaryInput}
              onChange={(e) => setDietaryInput(e.target.value)}
              onKeyDown={handleDietaryKeyDown}
              placeholder={t(lang, 'dietaryPlaceholder')}
              className="w-full px-3 py-1.5 text-xs sm:text-sm"
              style={inputStyle}
            />
          </div>

          {/* Taste */}
          <div>
            <label className="block mb-1.5" style={labelStyle}>
              👅 {t(lang, 'taste')}
            </label>
            <div className="flex flex-wrap gap-1.5">
              {TASTE_OPTIONS.map((opt) => {
                const isActive = prefs.taste === opt.key;
                return (
                  <button
                    key={opt.key}
                    onClick={() => setTaste(isActive ? '' : opt.key)}
                    className="px-2.5 py-1.5 text-xs transition-all"
                    style={{
                      backgroundColor: isActive
                        ? (isCartoon ? '#FFD166' : 'var(--color-primary)')
                        : (isCartoon ? '#fff' : 'var(--color-bg-input)'),
                      color: isActive
                        ? (isCartoon ? '#333' : '#fff')
                        : 'var(--color-text)',
                      borderRadius: 'var(--radius-tag)',
                      border: isCartoon
                        ? `2.5px solid ${isActive ? '#333' : '#ddd'}`
                        : isActive ? 'none' : '1px solid var(--color-border)',
                      fontWeight: isActive ? 700 : 500,
                      cursor: 'pointer',
                      transition: 'var(--transition-base)',
                      transform: isActive && isCartoon ? 'scale(1.08)' : 'scale(1)',
                    }}
                  >
                    {opt.icon} {t(lang, `taste${opt.key.charAt(0).toUpperCase() + opt.key.slice(1)}`)}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Tools */}
          <div>
            <label className="block mb-1.5" style={labelStyle}>
              🛠️ {t(lang, 'tools')}
            </label>
            <div className="flex flex-wrap gap-1.5 mb-1.5">
              {prefs.tools.map((item) => (
                <span
                  key={item}
                  className="inline-flex items-center gap-1 px-2.5 py-1 text-xs font-medium cursor-pointer"
                  style={{
                    backgroundColor: isCartoon ? '#7EC8E3' : 'var(--color-bg-hover, #f5f5f7)',
                    color: isCartoon ? '#fff' : 'var(--color-text)',
                    borderRadius: 'var(--radius-tag)',
                    border: isCartoon ? '2px solid #333' : 'none',
                    fontWeight: isCartoon ? 600 : 500,
                  }}
                  onClick={() => removeTool(item)}
                >
                  {item} ×
                </span>
              ))}
            </div>
            <div className="flex flex-wrap gap-1.5 mb-1.5">
              {TOOL_OPTIONS.map((opt) => {
                const label = t(lang, `tool${opt.key.charAt(0).toUpperCase() + opt.key.slice(1)}`);
                const isActive = prefs.tools.includes(label);
                return (
                  <button
                    key={opt.key}
                    onClick={() => isActive ? removeTool(label) : addTool(label)}
                    className="px-2.5 py-1.5 text-xs transition-all"
                    style={{
                      backgroundColor: isActive
                        ? (isCartoon ? '#7EC8E3' : 'var(--color-bg-hover, #f5f5f7)')
                        : (isCartoon ? '#fff' : 'var(--color-bg-input)'),
                      color: 'var(--color-text)',
                      borderRadius: 'var(--radius-tag)',
                      border: isCartoon
                        ? `2.5px solid ${isActive ? '#333' : '#ddd'}`
                        : '1px solid var(--color-border)',
                      fontWeight: isActive ? 700 : 500,
                      cursor: 'pointer',
                      transition: 'var(--transition-base)',
                    }}
                  >
                    {opt.icon} {label}
                  </button>
                );
              })}
            </div>
            <input
              type="text"
              value={toolInput}
              onChange={(e) => setToolInput(e.target.value)}
              onKeyDown={handleToolKeyDown}
              placeholder={t(lang, 'toolsPlaceholder')}
              className="w-full px-3 py-1.5 text-xs sm:text-sm"
              style={inputStyle}
            />
          </div>

          {/* Servings */}
          <div>
            <label className="block mb-1.5" style={labelStyle}>
              👥 {t(lang, 'servings')}
            </label>
            <div className="flex items-center gap-3">
              <input
                type="range"
                min="1"
                max="6"
                value={prefs.servings}
                onChange={(e) => setServings(Number(e.target.value))}
                className="flex-1"
                style={{ accentColor: isCartoon ? '#FF8FAB' : 'var(--color-primary)' }}
              />
              <span
                className="px-3 py-1 text-sm font-bold"
                style={{
                  backgroundColor: isCartoon ? '#FFD166' : 'var(--color-primary)',
                  color: isCartoon ? '#333' : '#fff',
                  borderRadius: 'var(--radius-tag)',
                  border: isCartoon ? '2px solid #333' : 'none',
                }}
              >
                {prefs.servings} {t(lang, 'servingUnit')}
              </span>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
