import { useState, useCallback, useRef, useEffect } from 'react';
import Header from './components/Header';
import IngredientInput from './components/IngredientInput';
import ModeSwitch from './components/ModeSwitch';
import GenerateBtn from './components/GenerateBtn';
import RecipeCard from './components/RecipeCard';
import PreferencesPanel from './components/PreferencesPanel';
import ShoppingList from './components/ShoppingList';
import HistoryPanel from './components/HistoryPanel';
import AchievementPanel from './components/AchievementPanel';
import InventoryPanel from './components/InventoryPanel';
import Leaderboard, { openLeaderboardRating } from './components/Leaderboard';
import { t } from './i18n';
import { streamRecipe, parseRecipeJSON } from './api';
import { useLocalStorage } from './hooks/useLocalStorage';
import { usePreferences } from './hooks/usePreferences';
import { useAchievements } from './hooks/useAchievements';
import { useShoppingList } from './hooks/useShoppingList';
import { useHistory } from './hooks/useHistory';
import { useInventory } from './hooks/useInventory';
import { useLeaderboard } from './hooks/useLeaderboard';
import { playSound, resumeAudio } from './utils/sound';
import { fireConfetti } from './utils/confetti';

// ---------- helpers ----------

function getIsDesktop() {
  return typeof window !== 'undefined' && window.matchMedia('(min-width: 768px)').matches;
}

// ---------- App ----------

export default function App() {
  // Theme & language
  const [theme, setTheme] = useLocalStorage('leftover_theme', 'magazine');
  const [lang, setLang] = useLocalStorage('leftover_lang', 'zh');

  // Core state
  const [ingredients, setIngredients] = useState('');
  const [mode, setMode] = useState('lazy');
  const [recipes, setRecipes] = useState([]);          // accumulated recipes
  const [isLoading, setIsLoading] = useState(false);
  const [streamText, setStreamText] = useState('');
  const abortRef = useRef(null);
  const inputRef = useRef(null);

  // Desktop detection (Apple mode two-column)
  const [isDesktop, setIsDesktop] = useState(getIsDesktop);

  // Panel close-all trigger (incremented on Esc)
  const [closeAllKey, setCloseAllKey] = useState(0);

  // Keyboard hint (first visit)
  const [showHint, setShowHint] = useState(() => {
    try { return !localStorage.getItem('leftover_keyboard_hint_shown'); }
    catch { return false; }
  });

  const isCartoon = theme === 'magazine';
  const currentRecipe = recipes[0] || null;

  // Hooks
  const { prefs, addDietary, removeDietary, setTaste, addTool, removeTool, setServings } = usePreferences();
  const { unlocked, achievements, newAchievement, incrementCount, clearNewAchievement, generationCount } = useAchievements();
  const { items: shoppingItems, addItem: addShopping, removeItem: removeShopping, clearItems: clearShopping } = useShoppingList();
  const { history, addEntry: addHistory, clearHistory, removeEntry: removeHistory } = useHistory();
  const { inventory, addItem: addInventory, removeItem: removeInventory } = useInventory();
  const { entries: leaderboardEntries, addEntry: addLeaderboard, removeEntry: removeLeaderboard, clearAll: clearLeaderboard } = useLeaderboard();

  // Apply theme & lang
  useEffect(() => {
    document.documentElement.setAttribute('data-theme', theme);
    document.documentElement.lang = lang === 'jp' ? 'ja' : lang === 'en' ? 'en' : 'zh-CN';
  }, [theme, lang]);

  // Desktop media query listener
  useEffect(() => {
    const mq = window.matchMedia('(min-width: 768px)');
    const handler = (e) => setIsDesktop(e.matches);
    mq.addEventListener('change', handler);
    return () => mq.removeEventListener('change', handler);
  }, []);

  // Keyboard hint auto-dismiss
  useEffect(() => {
    if (showHint) {
      const t = setTimeout(() => {
        setShowHint(false);
        try { localStorage.setItem('leftover_keyboard_hint_shown', '1'); } catch {}
      }, 3500);
      return () => clearTimeout(t);
    }
  }, [showHint]);

  // ---------- Keyboard shortcuts ----------
  useEffect(() => {
    const handler = (e) => {
      const isAppleDesktop = theme === 'cartoon' && isDesktop;
      if (!isAppleDesktop) return;

      // Ctrl/Cmd + K → focus input
      if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
        e.preventDefault();
        inputRef.current?.focus();
        return;
      }

      // Don't capture when focus is in input/textarea/select
      const tag = document.activeElement?.tagName?.toLowerCase();
      const isInput = tag === 'input' || tag === 'textarea' || tag === 'select' || document.activeElement?.isContentEditable;

      // Enter → generate (only when not in input)
      if (e.key === 'Enter' && !isInput) {
        e.preventDefault();
        handleGenerate();
        return;
      }

      // Esc → close all panels
      if (e.key === 'Escape') {
        setCloseAllKey((k) => k + 1);
        return;
      }
    };

    window.addEventListener('keydown', handler);
    return () => window.removeEventListener('keydown', handler);
  }, [theme, isDesktop, ingredients, mode, lang, prefs]);

  // ---------- Actions ----------

  const handleThemeToggle = useCallback(() => {
    const next = theme === 'magazine' ? 'cartoon' : 'magazine';
    setTheme(next);
    playSound(next, 'click');
  }, [theme, setTheme]);

  const handleLangChange = useCallback((newLang) => {
    setLang(newLang);
    playSound(theme, 'click');
  }, [theme, setLang]);

  const handleVoiceResult = useCallback((transcript) => {
    const cleaned = transcript.replace(/[，,、\s]+/g, '，').replace(/[。！？!?]/g, '').trim();
    const current = ingredients.trim();
    setIngredients(current ? `${current}，${cleaned}` : cleaned);
  }, [ingredients]);

  const handleInventoryClick = useCallback((item) => {
    const current = ingredients.trim();
    setIngredients(current ? `${current}，${item}` : item);
  }, [ingredients]);

  const handleAddToShopping = useCallback((item) => {
    addShopping(item);
    playSound(theme, 'click');
  }, [addShopping, theme]);

  // Generate recipe
  const handleGenerate = useCallback(async () => {
    const trimmedIngredients = ingredients.trim();
    if (!trimmedIngredients || isLoading) return;

    resumeAudio();
    playSound(theme, 'generate');

    if (abortRef.current) abortRef.current.abort();
    const controller = new AbortController();
    abortRef.current = controller;

    setIsLoading(true);
    setStreamText('');

    streamRecipe(
      trimmedIngredients, mode, lang, prefs,
      (_chunk, fullText) => {
        setStreamText(fullText);
      },
      (fullText) => {
        setIsLoading(false);
        setStreamText('');
        const parsed = parseRecipeJSON(fullText);
        if (parsed?.name) {
          setRecipes((prev) => [{ ...parsed, id: Date.now() }, ...prev]);
          addHistory({ ingredients: trimmedIngredients, mode, recipe: parsed });
          incrementCount();
          playSound(theme, 'success');
        } else {
          setRecipes((prev) => [{
            id: Date.now(),
            name: '解析失败', time: '?', difficulty: '未知',
            steps: ['AI 返回格式异常，请重试'],
            missingSeasonings: [],
            roast: fullText.slice(0, 200),
          }, ...prev]);
          playSound(theme, 'error');
        }
      },
      (error) => {
        setIsLoading(false);
        setStreamText('');
        setRecipes((prev) => [{
          id: Date.now(),
          name: '生成失败', time: '?', difficulty: '未知',
          steps: [error],
          missingSeasonings: [],
          roast: '请检查 API Key 和网络连接后重试',
        }, ...prev]);
        playSound(theme, 'error');
      },
      controller.signal,
    );
  }, [ingredients, mode, lang, prefs, theme, isLoading, addHistory, incrementCount]);

  // Achievement confetti
  useEffect(() => {
    if (newAchievement) fireConfetti(theme);
  }, [newAchievement, theme]);

  // ---------- Derived flags ----------
  const isAppleDesktop = theme === 'cartoon' && isDesktop;
  const hasRecipes = recipes.length > 0;

  // ---------- Panel props ----------
  const panelProps = { closeAllKey };

  // ---------- Render helpers ----------

  const renderSidebar = () => (
    <>
      <ModeSwitch mode={mode} onChange={setMode} lang={lang} theme={theme} />
      <div className="mt-4">
        <IngredientInput
          lang={lang} theme={theme}
          value={ingredients} onChange={setIngredients}
          onVoiceResult={handleVoiceResult}
          inputRef={inputRef}
        />
      </div>
      <div className="mt-2">
        <PreferencesPanel
          lang={lang} theme={theme} prefs={prefs}
          addDietary={addDietary} removeDietary={removeDietary}
          setTaste={setTaste} addTool={addTool} removeTool={removeTool}
          setServings={setServings}
          {...panelProps}
        />
      </div>
      <div className="mt-4">
        <GenerateBtn
          lang={lang} theme={theme}
          onClick={handleGenerate}
          isLoading={isLoading}
          hasRecipe={hasRecipes}
        />
      </div>
    </>
  );

  const renderResults = () => (
    <>
      {/* Loading progress bar (Apple desktop) */}
      {isAppleDesktop && isLoading && !streamText && (
        <div className="apple-progress-bar-track">
          <div className="apple-progress-bar-fill" />
        </div>
      )}

      {/* Streaming text preview */}
      {isLoading && streamText && (
        <div
          className="p-4 sm:p-5 animate-fade-in"
          style={{
            backgroundColor: 'var(--color-bg-card)',
            border: isCartoon ? '2.5px solid #333' : '1px solid var(--color-border)',
            borderRadius: 'var(--radius-card)',
            maxHeight: '200px',
            overflowY: 'auto',
          }}
        >
          <div
            className="text-xs sm:text-sm whitespace-pre-wrap streaming-cursor"
            style={{ color: 'var(--color-text-muted)', fontFamily: 'monospace' }}
          >
            {streamText}
          </div>
        </div>
      )}

      {/* Recipe cards or empty state */}
      {!isLoading && !hasRecipes && !streamText && (
        isAppleDesktop ? (
          /* ── Apple desktop empty state: line-art illustration ── */
          <div className="apple-empty-illustration">
            <div className="apple-empty-plate">
              <div className="apple-empty-plate-ring" />
              <div className="apple-empty-plate-inner" />
              <div className="apple-empty-fork" />
              <div className="apple-empty-spoon" />
            </div>
            <p className="apple-empty-text">{t(lang, 'emptyStateText')}</p>
          </div>
        ) : (
          /* ── Mobile / cartoon: original empty state ── */
          <RecipeCard
            lang={lang} theme={theme}
            recipe={null} isStreaming={false}
            onAddToShopping={handleAddToShopping}
            onPlaySound={playSound}
          />
        )
      )}

      {/* Recipe cards */}
      {hasRecipes && (
        <div className={isAppleDesktop && recipes.length > 1 ? 'apple-recipe-grid' : 'space-y-4'}>
          {recipes.map((r) => (
            <RecipeCard
              key={r.id}
              lang={lang} theme={theme}
              recipe={r} isStreaming={false}
              onAddToShopping={handleAddToShopping}
              onPlaySound={playSound}
              className={isAppleDesktop ? 'apple-card-hover' : ''}
            />
          ))}
        </div>
      )}

      {/* Hell mode rating */}
      {currentRecipe?.name && mode === 'hell' && (
        <button
          onClick={() => openLeaderboardRating(currentRecipe, ingredients, mode)}
          className="w-full py-2.5 text-sm font-medium transition-all hover:opacity-80 mt-4"
          style={{
            backgroundColor: isCartoon ? '#fff' : 'var(--color-bg-card)',
            color: isCartoon ? '#FF8FAB' : 'var(--color-primary)',
            border: isCartoon ? '2.5px dashed #FF8FAB' : '1px solid var(--color-primary)',
            borderRadius: 'var(--radius-btn)',
            fontWeight: isCartoon ? 700 : 500,
            transition: 'var(--transition-base)',
            cursor: 'pointer',
          }}
        >
          ☠️ 给这道黑暗料理打分
        </button>
      )}

      {/* Bottom panels */}
      <div className="mt-3 space-y-0">
        <ShoppingList lang={lang} theme={theme} items={shoppingItems} removeItem={removeShopping} clearItems={clearShopping} {...panelProps} />
        <HistoryPanel lang={lang} theme={theme} history={history} clearHistory={clearHistory} removeEntry={removeHistory} {...panelProps} />
        <AchievementPanel lang={lang} theme={theme} achievements={achievements} unlocked={unlocked} newAchievement={newAchievement} clearNewAchievement={clearNewAchievement} generationCount={generationCount} {...panelProps} />
        <InventoryPanel lang={lang} theme={theme} inventory={inventory} addItem={addInventory} removeItem={removeInventory} onItemClick={handleInventoryClick} {...panelProps} />
        <Leaderboard lang={lang} theme={theme} entries={leaderboardEntries} addEntry={addLeaderboard} removeEntry={removeLeaderboard} clearAll={clearLeaderboard} {...panelProps} />
      </div>
    </>
  );

  // ---------- Main render ----------

  const containerStyle = isCartoon
    ? { backgroundColor: 'var(--color-bg)', minHeight: '100vh', paddingBottom: '2rem' }
    : { backgroundColor: '#ffffff', minHeight: '100vh', paddingBottom: '2rem' };

  return (
    <div style={containerStyle}>
      {/* Cartoon background decorations */}
      {isCartoon && (
        <div className="fixed inset-0 pointer-events-none z-0 overflow-hidden" aria-hidden="true">
          <span className="absolute top-[8%] left-[3%] text-3xl sm:text-4xl opacity-20 animate-float select-none" style={{ animationDelay: '0s' }}>⭐</span>
          <span className="absolute top-[15%] right-[5%] text-2xl sm:text-3xl opacity-20 animate-float select-none" style={{ animationDelay: '0.8s' }}>🌟</span>
          <span className="absolute top-[50%] left-[2%] text-2xl opacity-15 animate-float select-none" style={{ animationDelay: '1.6s' }}>✨</span>
          <span className="absolute top-[70%] right-[3%] text-3xl opacity-15 animate-float select-none" style={{ animationDelay: '2.4s' }}>💫</span>
          <span className="absolute top-[30%] left-[90%] text-xl opacity-10 animate-float select-none" style={{ animationDelay: '1.2s' }}>🧊</span>
        </div>
      )}

      <Header lang={lang} theme={theme} onThemeToggle={handleThemeToggle} onLangChange={handleLangChange} />

      {/* ── Apple Desktop: two-column layout ── */}
      {isAppleDesktop ? (
        <div className="apple-layout-split">
          <aside className="apple-layout-sidebar">
            {renderSidebar()}
          </aside>
          <main className="apple-layout-main">
            {renderResults()}
          </main>
        </div>
      ) : (
        /* ── Mobile / Cartoon normal: single column ── */
        <main style={{ maxWidth: isCartoon ? '700px' : '640px', margin: '0 auto', padding: '0 16px' }} className="space-y-4 relative z-10">
          {renderSidebar()}
          {renderResults()}
        </main>
      )}

      {/* Keyboard hint toast (Apple desktop, first visit) */}
      {isAppleDesktop && showHint && (
        <div className="apple-keyboard-hint">
          {t(lang, 'keyboardHint')}
        </div>
      )}

      {/* Footer */}
      <footer className="text-center mt-8 py-6 relative z-10">
        <p className="text-xs" style={{ color: 'var(--color-text-muted)' }}>
          {isCartoon ? '🧊✨ ' : ''}{t(lang, 'appTitle')}{isCartoon ? ' ✨🧊' : ''}
          <span style={{ opacity: 0.5 }}> · Powered by DeepSeek AI</span>
        </p>
        {isCartoon && (
          <p className="text-[10px] mt-1" style={{ color: 'var(--color-text-muted)', opacity: 0.5 }}>
            (◕‿◕) ♪ ✨ 用魔法拯救剩菜！
          </p>
        )}
      </footer>
    </div>
  );
}
