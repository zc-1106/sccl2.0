import { t } from '../i18n';
import QuickTags from './QuickTags';
import VoiceInput from './VoiceInput';

export default function IngredientInput({ lang, theme, value, onChange, onVoiceResult, inputRef }) {
  const isCartoon = theme === 'magazine';

  const handleTagClick = (tag) => {
    const current = value.trim();
    const newVal = current ? `${current}，${tag}` : tag;
    onChange(newVal);
  };

  const handleVoiceResult = (transcript) => {
    const cleaned = transcript
      .replace(/[，,、\s]+/g, '，')
      .replace(/[。！？!?]/g, '')
      .trim();
    const current = value.trim();
    const newVal = current ? `${current}，${cleaned}` : cleaned;
    onChange(newVal);
  };

  return (
    <div className="space-y-2">
      {/* Text input */}
      <input
        ref={inputRef}
        type="text"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={t(lang, 'inputPlaceholder')}
        className="theme-input text-sm sm:text-base"
        style={
          isCartoon
            ? {
                border: '3px solid #333',
                borderRadius: 'var(--radius-input)',
                padding: '12px 18px',
                fontWeight: 500,
              }
            : {
                border: '1px solid var(--color-border)',
                borderRadius: 'var(--radius-input)',
                padding: '12px 16px',
                backgroundColor: '#fff',
              }
        }
      />

      {/* Quick tags & voice row */}
      <div className="flex flex-wrap items-start gap-2">
        <span
          className="text-xs pt-1 flex-shrink-0"
          style={{
            color: 'var(--color-text-muted)',
            fontWeight: isCartoon ? 600 : 400,
          }}
        >
          {t(lang, 'quickTags')}
        </span>
        <div className="flex-1 min-w-0">
          <QuickTags lang={lang} onTagClick={handleTagClick} theme={theme} />
        </div>
        <VoiceInput lang={lang} theme={theme} onResult={handleVoiceResult} />
      </div>
    </div>
  );
}
