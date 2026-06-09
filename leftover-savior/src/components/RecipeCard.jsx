import { t } from '../i18n';

/**
 * Build Bilibili search URL based on recipe name and language
 */
function buildVideoUrl(recipeName, lang) {
  const suffixes = {
    zh: ' 做法',
    en: ' recipe',
    jp: ' レシピ',
  };
  const suffix = suffixes[lang] || suffixes.zh;
  const keyword = encodeURIComponent(recipeName + suffix);
  return `https://search.bilibili.com/all?keyword=${keyword}`;
}

/**
 * Handle video button click — open Bilibili search in new tab
 */
function handleWatchVideo(recipeName, lang, playSoundFn, theme) {
  const url = buildVideoUrl(recipeName, lang);
  window.open(url, '_blank', 'noopener,noreferrer');
  if (playSoundFn) playSoundFn(theme, 'click');
}

export default function RecipeCard({ lang, theme, recipe, isStreaming, onAddToShopping, onPlaySound, className }) {
  const isCartoon = theme === 'magazine';

  // Empty state
  if (!recipe && !isStreaming) {
    return (
      <div
        className="p-10 sm:p-14 text-center animate-fade-in"
        style={{
          backgroundColor: isCartoon ? '#fff' : 'var(--color-bg-card)',
          border: isCartoon ? '2.5px dashed #333' : '1px solid var(--color-border)',
          borderRadius: 'var(--radius-card)',
        }}
      >
        {isCartoon && (
          <div className="flex justify-center gap-3 mb-4">
            <span className="animate-float text-4xl" style={{ animationDelay: '0s' }}>🍳</span>
            <span className="animate-float text-4xl" style={{ animationDelay: '0.5s' }}>🥕</span>
            <span className="animate-float text-4xl" style={{ animationDelay: '1s' }}>🍅</span>
            <span className="animate-float text-4xl" style={{ animationDelay: '1.5s' }}>✨</span>
          </div>
        )}
        {!isCartoon && (
          <div className="mb-4">
            <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="#d2d2d7" strokeWidth="1" style={{ margin: '0 auto' }}>
              <path d="M18 8h1a4 4 0 0 1 0 8h-1" /><path d="M2 8h16v9a4 4 0 0 1-4 4H6a4 4 0 0 1-4-4V8z" /><line x1="6" y1="1" x2="6" y2="4" /><line x1="10" y1="1" x2="10" y2="4" /><line x1="14" y1="1" x2="14" y2="4" />
            </svg>
          </div>
        )}
        <p style={{ color: 'var(--color-text-muted)', fontSize: isCartoon ? '0.95rem' : '0.85rem', fontWeight: isCartoon ? 600 : 400 }}>
          {t(lang, 'noRecipe')}
        </p>
        {isCartoon && (
          <p className="mt-1" style={{ color: 'var(--color-text-muted)', fontSize: '0.75rem' }}>
            (◕ᴗ◕✿)
          </p>
        )}
      </div>
    );
  }

  // Streaming state
  if (isStreaming && !recipe) {
    return (
      <div
        className="p-6 sm:p-8 animate-fade-in"
        style={{
          backgroundColor: 'var(--color-bg-card)',
          border: isCartoon ? '2.5px solid #333' : '1px solid var(--color-border)',
          borderRadius: 'var(--radius-card)',
        }}
      >
        <div className="flex items-center gap-3 mb-3">
          <span
            className="inline-block w-5 h-5 border-2 rounded-full animate-spin"
            style={{
              borderColor: isCartoon ? '#FF8FAB' : 'var(--color-primary)',
              borderTopColor: 'transparent',
            }}
          />
          <span
            className="streaming-cursor text-sm"
            style={{ color: 'var(--color-text-muted)', fontWeight: isCartoon ? 600 : 400 }}
          >
            {t(lang, 'generating')}
          </span>
        </div>
        {recipe?.streamText && (
          <div
            className="text-xs sm:text-sm whitespace-pre-wrap p-3 rounded overflow-y-auto"
            style={{
              backgroundColor: 'var(--color-bg-input)',
              color: 'var(--color-text-muted)',
              fontFamily: 'monospace',
              maxHeight: '200px',
              border: isCartoon ? '2px solid #ddd' : '1px solid var(--color-border)',
              borderRadius: isCartoon ? '12px' : '8px',
            }}
          >
            {recipe.streamText}
          </div>
        )}
      </div>
    );
  }

  if (!recipe?.name) return null;

  const diffKey = `diff${recipe.difficulty === '地狱' ? 'Hell' : recipe.difficulty === '困难' ? 'Hard' : recipe.difficulty === '中等' ? 'Medium' : 'Easy'}`;

  return (
    <div
      className={`animate-bounce-in relative ${
        isCartoon ? 'cartoon-stripe-bg' : ''
      } ${className || ''}`}
      style={{
        backgroundColor: 'var(--color-bg-card)',
        border: isCartoon ? '3px solid #333' : '1px solid var(--color-border)',
        borderRadius: 'var(--radius-card)',
        boxShadow: isCartoon ? '4px 4px 0px #E5A07B' : 'none',
        overflow: 'visible',
        position: 'relative',
      }}
    >
      {/* Cartoon badge */}
      {isCartoon && (
        <div className="cartoon-badge">
          ⭐ {t(lang, 'recipeName')}
        </div>
      )}

      {/* Header section */}
      <div
        className="p-5 sm:p-6"
        style={{
          background: isCartoon
            ? 'linear-gradient(135deg, #FF8FAB 0%, #FFD166 100%)'
            : 'transparent',
          borderRadius: isCartoon
            ? 'var(--radius-card) var(--radius-card) 0 0'
            : 'var(--radius-card) var(--radius-card) 0 0',
          borderBottom: isCartoon ? '3px solid #333' : '1px solid var(--color-border)',
          paddingTop: isCartoon ? '28px' : undefined,
        }}
      >
        <div className="flex items-start justify-between">
          <div>
            <h2
              className={`text-lg sm:text-xl font-bold mb-1 ${
                isCartoon ? 'cartoon-text' : ''
              }`}
              style={{
                fontFamily: isCartoon ? 'var(--font-display)' : 'var(--font-sans)',
                fontWeight: isCartoon ? 700 : 600,
                color: isCartoon ? '#fff' : 'var(--color-text)',
                letterSpacing: isCartoon ? '0.02em' : '-0.01em',
                textShadow: isCartoon ? '2px 2px 0px rgba(0,0,0,0.2)' : 'none',
              }}
            >
              {recipe.name}
            </h2>
            <div
              className="flex items-center gap-3 text-xs sm:text-sm"
              style={{
                color: isCartoon ? 'rgba(255,255,255,0.9)' : 'var(--color-text-muted)',
                fontWeight: 500,
              }}
            >
              <span>⏱ {recipe.time}</span>
              <span style={!isCartoon ? { color: 'var(--color-text-muted)' } : {}}>
                · {t(lang, diffKey)}
              </span>
            </div>
          </div>
          <span className="text-2xl sm:text-3xl">
            {recipe.difficulty === '地狱' ? '💀' : recipe.difficulty === '困难' ? '🔥' : recipe.difficulty === '中等' ? '👨‍🍳' : '😴'}
          </span>
        </div>
      </div>

      {/* Body */}
      <div className="p-5 sm:p-6 space-y-4">
        {/* Steps */}
        <div>
          <h3
            className="text-sm font-bold mb-2.5"
            style={{
              color: 'var(--color-text)',
              fontFamily: isCartoon ? 'var(--font-display)' : 'var(--font-sans)',
              fontWeight: 700,
            }}
          >
            📝 {t(lang, 'steps')}
          </h3>
          <ol className="space-y-2">
            {recipe.steps?.map((step, i) => (
              <li key={i} className="flex gap-2.5 text-xs sm:text-sm items-start">
                {isCartoon ? (
                  <span className="cartoon-step-dot">{i + 1}</span>
                ) : (
                  <span
                    className="flex-shrink-0 w-5 h-5 rounded-full flex items-center justify-center text-xs font-medium"
                    style={{
                      backgroundColor: 'var(--color-bg-card)',
                      color: 'var(--color-text-muted)',
                      border: '1px solid var(--color-border)',
                    }}
                  >
                    {i + 1}
                  </span>
                )}
                <span
                  className="pt-0.5"
                  style={{
                    color: 'var(--color-text)',
                    lineHeight: 'var(--line-height)',
                  }}
                >
                  {step}
                </span>
              </li>
            ))}
          </ol>
        </div>

        {/* ─── Watch Video Button ─── */}
        <button
          onClick={() => handleWatchVideo(recipe.name, lang, onPlaySound, theme)}
          className={`w-full text-sm font-bold transition-all ${
            isCartoon
              ? 'py-3 rounded-btn border-[3px] border-[#333]'
              : 'py-2.5 rounded-btn border'
          }`}
          style={
            isCartoon
              ? {
                  background: 'linear-gradient(135deg, #FFD166 0%, #FFB347 100%)',
                  color: '#333',
                  border: '3px solid #333',
                  borderRadius: 'var(--radius-btn)',
                  fontWeight: 700,
                  boxShadow: '3px 3px 0px rgba(0,0,0,0.25)',
                  cursor: 'pointer',
                  transition: 'var(--transition-base)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: '8px',
                  fontSize: '0.9rem',
                }
              : {
                  backgroundColor: '#e8e8ed',
                  color: '#1d1d1f',
                  border: '1px solid #d2d2d7',
                  borderRadius: '12px',
                  fontWeight: 500,
                  boxShadow: 'none',
                  cursor: 'pointer',
                  transition: 'background var(--transition-fast)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: '6px',
                  fontSize: '0.8rem',
                }
          }
          onMouseEnter={(e) => {
            if (isCartoon) {
              e.target.style.transform = 'translateY(-4px) scale(1.02)';
              e.target.style.boxShadow = '5px 5px 0px rgba(0,0,0,0.2)';
            } else {
              e.target.style.backgroundColor = '#d2d2d7';
            }
          }}
          onMouseLeave={(e) => {
            if (isCartoon) {
              e.target.style.transform = 'translateY(0) scale(1)';
              e.target.style.boxShadow = '3px 3px 0px rgba(0,0,0,0.25)';
            } else {
              e.target.style.backgroundColor = '#e8e8ed';
            }
          }}
          onMouseDown={(e) => {
            if (isCartoon) {
              e.target.style.transform = 'translateY(0) scale(0.97)';
              e.target.style.boxShadow = '1px 1px 0px rgba(0,0,0,0.2)';
            }
          }}
          onMouseUp={(e) => {
            if (isCartoon) {
              e.target.style.transform = 'translateY(-4px) scale(1.02)';
              e.target.style.boxShadow = '5px 5px 0px rgba(0,0,0,0.2)';
            }
          }}
        >
          {isCartoon ? (
            <>
              <span className="text-lg">📺</span>
              {t(lang, 'watchVideo')}
            </>
          ) : (
            <>
              {/* Thin play icon SVG for Apple mode */}
              <svg width="14" height="14" viewBox="0 0 24 24" fill="#1d1d1f" stroke="none">
                <path d="M8 5v14l11-7z" />
              </svg>
              {t(lang, 'watchVideoApple')}
            </>
          )}
        </button>

        {/* Missing seasonings */}
        {recipe.missingSeasonings?.length > 0 && (
          <div>
            <h3
              className="text-sm font-bold mb-1.5"
              style={{
                color: 'var(--color-warning)',
                fontFamily: isCartoon ? 'var(--font-display)' : 'var(--font-sans)',
              }}
            >
              ⚠️ {t(lang, 'missingSeasonings')}
            </h3>
            <div className="flex flex-wrap gap-1.5">
              {recipe.missingSeasonings.map((item, i) => (
                <span
                  key={i}
                  className="inline-flex items-center gap-1 px-2.5 py-1 text-xs font-medium cursor-pointer transition-all hover:opacity-80"
                  style={{
                    backgroundColor: isCartoon ? '#FFD166' : 'var(--color-warning)',
                    color: isCartoon ? '#333' : '#fff',
                    borderRadius: isCartoon ? 'var(--radius-tag)' : '20px',
                    border: isCartoon ? '2px solid #333' : 'none',
                    fontWeight: 600,
                  }}
                  onClick={() => onAddToShopping(item)}
                  title={t(lang, 'addToShopping')}
                >
                  🛒 {item}
                </span>
              ))}
            </div>
          </div>
        )}

        {/* AI Roast */}
        {recipe.roast && (
          <div className={isCartoon ? 'cartoon-speech-bubble' : ''}>
            <div
              className="p-3 rounded-lg text-xs sm:text-sm"
              style={
                isCartoon
                  ? {}
                  : {
                      backgroundColor: 'var(--color-bg-input)',
                      borderLeft: '2px solid var(--color-primary)',
                      borderRadius: '8px',
                    }
              }
            >
              <span
                className="font-bold"
                style={{ color: isCartoon ? '#FF8FAB' : 'var(--color-primary)' }}
              >
                🤖 {t(lang, 'aiRoast')}：
              </span>
              <span style={{ color: 'var(--color-text-muted)' }}>{recipe.roast}</span>
            </div>
          </div>
        )}

        {/* Add all to shopping */}
        {recipe.missingSeasonings?.length > 0 && (
          <button
            onClick={() => recipe.missingSeasonings.forEach(onAddToShopping)}
            className="w-full py-2.5 text-sm font-medium transition-all hover:opacity-80"
            style={{
              backgroundColor: 'var(--color-bg-input)',
              color: isCartoon ? '#FF8FAB' : 'var(--color-primary)',
              border: isCartoon ? '2px dashed #FF8FAB' : '1px solid var(--color-border)',
              borderRadius: 'var(--radius-btn)',
              fontWeight: isCartoon ? 700 : 500,
              transition: 'var(--transition-base)',
              cursor: 'pointer',
            }}
          >
            🛒 {t(lang, 'addToShopping')} ({recipe.missingSeasonings.length})
          </button>
        )}
      </div>
    </div>
  );
}
