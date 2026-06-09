import { t } from '../i18n';

export default function Header({ lang, theme, onThemeToggle, onLangChange }) {
  const isCartoon = theme === 'magazine';

  return (
    <header
      className={`flex items-center justify-between px-5 py-4 sm:px-8 sm:py-5 ${
        isCartoon ? '' : ''
      }`}
      style={{
        maxWidth: isCartoon ? '100%' : '800px',
        margin: isCartoon ? '0' : '0 auto',
      }}
    >
      {/* Logo & Title */}
      <div className="flex items-center gap-3">
        {/* Cartoon: wiggling fridge emoji; Apple: clean SF Symbol-style icon */}
        <span
          className={`text-3xl sm:text-4xl select-none ${
            isCartoon ? 'animate-wiggle cursor-default' : ''
          }`}
          role="img"
          aria-label="fridge"
          style={isCartoon ? {} : { fontSize: '2rem', filter: 'none' }}
        >
          {isCartoon ? '🧊' : '❄️'}
        </span>
        <div>
          <h1
            className={`text-xl sm:text-2xl font-bold tracking-tight ${
              isCartoon ? 'cartoon-text' : ''
            }`}
            style={{
              fontFamily: isCartoon ? 'var(--font-display)' : 'var(--font-sans)',
              fontWeight: isCartoon ? 700 : 600,
              color: 'var(--color-text)',
              letterSpacing: isCartoon ? '0.02em' : '-0.02em',
            }}
          >
            {t(lang, 'appTitle')}
          </h1>
          <p
            className="text-xs sm:text-sm"
            style={{
              color: 'var(--color-text-muted)',
              fontWeight: 400,
            }}
          >
            {t(lang, 'appSubtitle')}
          </p>
        </div>
      </div>

      {/* Controls */}
      <div className="flex items-center gap-2">
        {/* Theme toggle */}
        <button
          onClick={onThemeToggle}
          className={`px-3 py-1.5 text-sm font-medium transition-colors ${
            isCartoon
              ? 'rounded-btn border-2 hover:scale-105 active:scale-95'
              : 'rounded-btn border-0'
          }`}
          style={{
            backgroundColor: isCartoon ? 'var(--color-bg-card)' : 'transparent',
            color: 'var(--color-text)',
            border: isCartoon ? 'var(--cartoon-outline)' : '1px solid var(--color-border)',
            transition: 'var(--transition-base)',
            fontSize: '0.8rem',
            fontWeight: 500,
          }}
          title={t(lang, theme === 'magazine' ? 'themeCartoon' : 'themeMagazine')}
        >
          {isCartoon ? '🍎 简约' : '🎨 卡通'}
        </button>

        {/* Language selector */}
        <select
          value={lang}
          onChange={(e) => onLangChange(e.target.value)}
          className={`px-2 py-1.5 text-sm font-medium cursor-pointer ${
            isCartoon ? 'rounded-btn border-2' : 'rounded-btn border'
          }`}
          style={{
            backgroundColor: isCartoon ? 'var(--color-bg-card)' : 'transparent',
            color: 'var(--color-text)',
            border: isCartoon ? 'var(--cartoon-outline)' : '1px solid var(--color-border)',
            transition: 'var(--transition-base)',
            fontSize: '0.8rem',
            fontWeight: 500,
            appearance: 'auto',
          }}
        >
          <option value="zh">中文</option>
          <option value="en">EN</option>
          <option value="jp">日本語</option>
        </select>
      </div>
    </header>
  );
}
