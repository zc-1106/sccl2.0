import { t } from '../i18n';

export default function GenerateBtn({ lang, theme, onClick, isLoading, hasRecipe }) {
  const isCartoon = theme === 'magazine';

  return (
    <button
      onClick={onClick}
      disabled={isLoading}
      className={`w-full text-sm sm:text-base font-semibold transition-all ${
        isCartoon
          ? 'py-3.5 rounded-btn border-2'
          : 'py-3 rounded-btn border'
      } ${isLoading ? 'opacity-70 cursor-wait' : 'cursor-pointer'}`}
      style={{
        // --- Cartoon ---
        ...(isCartoon && {
          background: 'linear-gradient(135deg, #FF8FAB 0%, #FFB347 100%)',
          color: '#fff',
          border: '2.5px solid #333',
          borderRadius: '30px',
          fontWeight: 700,
          boxShadow: isLoading ? 'none' : '3px 3px 0px rgba(0,0,0,0.25)',
          transform: isLoading ? 'none' : 'translateY(0)',
          transition: 'var(--transition-base)',
          fontSize: '1rem',
        }),
        // --- Apple ---
        ...(!isCartoon && {
          backgroundColor: 'var(--color-primary)',
          color: '#fff',
          border: 'none',
          borderRadius: '12px',
          fontWeight: 500,
          boxShadow: 'none',
          transition: 'background var(--transition-fast)',
          fontSize: '0.9rem',
        }),
      }}
      onMouseEnter={(e) => {
        if (!isCartoon && !isLoading) {
          e.target.style.backgroundColor = 'var(--color-primary-hover)';
        }
        if (isCartoon && !isLoading) {
          e.target.style.transform = 'translateY(-4px) scale(1.02)';
          e.target.style.boxShadow = '5px 5px 0px rgba(0,0,0,0.2)';
        }
      }}
      onMouseLeave={(e) => {
        if (!isCartoon && !isLoading) {
          e.target.style.backgroundColor = 'var(--color-primary)';
        }
        if (isCartoon && !isLoading) {
          e.target.style.transform = 'translateY(0) scale(1)';
          e.target.style.boxShadow = '3px 3px 0px rgba(0,0,0,0.25)';
        }
      }}
      onMouseDown={(e) => {
        if (isCartoon && !isLoading) {
          e.target.style.transform = 'translateY(0) scale(0.97)';
          e.target.style.boxShadow = '1px 1px 0px rgba(0,0,0,0.2)';
        }
      }}
      onMouseUp={(e) => {
        if (isCartoon && !isLoading) {
          e.target.style.transform = 'translateY(-4px) scale(1.02)';
          e.target.style.boxShadow = '5px 5px 0px rgba(0,0,0,0.2)';
        }
      }}
    >
      {isLoading ? (
        <span className="flex items-center justify-center gap-2">
          <span
            className="inline-block w-4 h-4 border-2 border-t-transparent rounded-full animate-spin"
            style={{ borderColor: isCartoon ? 'rgba(255,255,255,0.5)' : 'rgba(255,255,255,0.4)', borderTopColor: 'transparent' }}
          />
          {t(lang, 'generating')}
        </span>
      ) : (
        <span className="flex items-center justify-center gap-2">
          {hasRecipe ? '🔄' : isCartoon ? '✨' : '→'} {hasRecipe ? t(lang, 'regenerate') : t(lang, 'generate')}
        </span>
      )}
    </button>
  );
}
