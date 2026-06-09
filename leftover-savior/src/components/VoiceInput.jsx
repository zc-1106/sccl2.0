import { useState, useRef, useCallback, useEffect } from 'react';
import { t } from '../i18n';
import { playSound } from '../utils/sound';

export default function VoiceInput({ lang, theme, onResult }) {
  const [isListening, setIsListening] = useState(false);
  const [isSupported, setIsSupported] = useState(true);
  const [error, setError] = useState('');
  const recognitionRef = useRef(null);
  const isPressedRef = useRef(false);
  const isCartoon = theme === 'magazine';

  const langMap = { zh: 'zh-CN', en: 'en-US', jp: 'ja-JP' };

  useEffect(() => {
    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    if (!SpeechRecognition) {
      setIsSupported(false);
      return;
    }

    recognitionRef.current = new SpeechRecognition();
    recognitionRef.current.continuous = false;
    recognitionRef.current.interimResults = false;
    recognitionRef.current.lang = langMap[lang] || 'zh-CN';

    recognitionRef.current.onresult = (event) => {
      const transcript = event.results[0][0].transcript;
      onResult(transcript);
      setIsListening(false);
      playSound(theme, 'voice-end');
    };

    recognitionRef.current.onerror = (event) => {
      if (event.error === 'not-allowed' || event.error === 'permission-denied') {
        setError(t(lang, 'voicePermissionDenied'));
      }
      setIsListening(false);
    };

    recognitionRef.current.onend = () => {
      setIsListening(false);
    };

    return () => {
      if (recognitionRef.current) recognitionRef.current.abort();
    };
  }, [lang, theme, onResult]);

  useEffect(() => {
    if (recognitionRef.current) {
      recognitionRef.current.lang = langMap[lang] || 'zh-CN';
    }
  }, [lang]);

  const startListening = useCallback(() => {
    if (!recognitionRef.current) return;
    setError('');
    try {
      recognitionRef.current.start();
      setIsListening(true);
      isPressedRef.current = true;
      playSound(theme, 'voice-start');
    } catch (e) { /* already started */ }
  }, [theme]);

  const stopListening = useCallback(() => {
    if (recognitionRef.current && isPressedRef.current) {
      recognitionRef.current.stop();
      isPressedRef.current = false;
      setIsListening(false);
    }
  }, []);

  const handlePointerDown = (e) => { e.preventDefault(); startListening(); };
  const handlePointerUp = (e) => { e.preventDefault(); stopListening(); };
  const handlePointerLeave = () => { if (isPressedRef.current) stopListening(); };

  if (!isSupported) {
    return (
      <div
        className={`text-xs px-3 py-1.5 ${isCartoon ? 'rounded-tag border-2' : 'rounded-tag'}`}
        style={{
          color: 'var(--color-text-muted)',
          borderColor: isCartoon ? '#333' : 'var(--color-border)',
          borderWidth: isCartoon ? '2px' : '1px',
          borderStyle: 'solid',
        }}
      >
        🎤 {t(lang, 'voiceNotSupported')}
      </div>
    );
  }

  return (
    <div className="relative">
      <button
        onMouseDown={handlePointerDown}
        onMouseUp={handlePointerUp}
        onMouseLeave={handlePointerLeave}
        onTouchStart={handlePointerDown}
        onTouchEnd={handlePointerUp}
        className={`flex items-center gap-2 px-4 py-2.5 text-sm font-medium select-none ${
          isCartoon
            ? 'rounded-btn border-2 transition-all'
            : 'rounded-btn transition-colors'
        } ${isListening && isCartoon ? 'animate-ripple' : ''}`}
        style={{
          // --- Cartoon mode ---
          ...(isCartoon && {
            backgroundColor: isListening ? '#FF8FAB' : '#fff',
            color: isListening ? '#fff' : '#333',
            border: isListening ? '3px solid #FF6B8A' : '2.5px solid #333',
            borderRadius: '30px',
            fontWeight: 600,
            transition: 'var(--transition-base)',
          }),
          // --- Apple mode ---
          ...(!isCartoon && {
            backgroundColor: isListening ? '#f5f5f7' : 'transparent',
            color: isListening ? 'var(--color-primary)' : 'var(--color-text-muted)',
            border: isListening ? '1px solid var(--color-primary)' : '1px solid transparent',
            borderRadius: '12px',
            fontWeight: 400,
            transition: 'all var(--transition-fast)',
          }),
          touchAction: 'none',
          userSelect: 'none',
          cursor: 'pointer',
        }}
      >
        {isListening ? (
          <div className="flex items-center gap-0.5 h-5">
            {[1, 2, 3, 4, 5].map((i) => (
              <div
                key={i}
                className="voice-wave-bar w-1 rounded-full"
                style={{
                  backgroundColor: isCartoon ? '#fff' : 'var(--color-primary)',
                  height: isCartoon ? '100%' : '60%',
                  minHeight: isCartoon ? '4px' : '3px',
                }}
              />
            ))}
          </div>
        ) : (
          <span className="text-lg">
            {/* Apple mode: simple mic SVG icon; Cartoon: emoji */}
            {isCartoon ? '🎤' : (
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                <path d="M12 1a3 3 0 0 0-3 3v8a3 3 0 0 0 6 0V4a3 3 0 0 0-3-3z" />
                <path d="M19 10v2a7 7 0 0 1-14 0v-2" />
                <line x1="12" y1="19" x2="12" y2="23" />
                <line x1="8" y1="23" x2="16" y2="23" />
              </svg>
            )}
          </span>
        )}
        <span className="text-xs sm:text-sm">
          {isListening ? t(lang, 'voiceListening') : t(lang, 'voiceHold')}
        </span>
      </button>

      {error && (
        <div
          className="absolute top-full mt-1 left-0 text-xs px-2 py-1 rounded z-10"
          style={{
            color: isCartoon ? '#fff' : 'var(--color-danger)',
            backgroundColor: isCartoon ? '#FF8FAB' : 'var(--color-bg-card)',
            border: isCartoon ? '2px solid #333' : '1px solid var(--color-border)',
          }}
        >
          {error}
        </div>
      )}
    </div>
  );
}
