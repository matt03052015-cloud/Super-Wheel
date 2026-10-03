import { useCallback, useRef, useState, useEffect } from 'react';
import { Settings as SettingsIcon, Dice5, Circle, Trophy, Sparkles, Target, Star, Crown, Compass } from 'lucide-react';
import Wheel from '@/components/Wheel';
import NamePanel from '@/components/NamePanel';
import SettingsPanel from '@/components/SettingsPanel';
import WinnerModal from '@/components/WinnerModal';
import HistoryPanel from '@/components/HistoryPanel';
import { useLocalStorage } from '@/hooks/useLocalStorage';
import {
  type NameEntry,
  type SpinHistoryEntry,
  type SpinConfig,
  type AppearanceSettings,
  type WinnerSettings,
  type BrandingSettings,
  type LogoIcon,
  DEFAULT_SPIN_CONFIG,
  DEFAULT_APPEARANCE,
  DEFAULT_WINNER,
  DEFAULT_BRANDING,
} from '@/types';

function makeId(): string {
  return `${Date.now()}-${Math.random().toString(36).slice(2, 9)}`;
}

const DEFAULT_NAMES: NameEntry[] = [
  { id: makeId(), text: 'Alice' },
  { id: makeId(), text: 'Bob' },
  { id: makeId(), text: 'Charlie' },
  { id: makeId(), text: 'Diana' },
  { id: makeId(), text: 'Eve' },
  { id: makeId(), text: 'Frank' },
  { id: makeId(), text: 'Grace' },
  { id: makeId(), text: 'Henry' },
];

import type { LucideIcon } from 'lucide-react';

const LOGO_ICONS: Record<LogoIcon, LucideIcon | null> = {
  dice: Dice5,
  wheel: Circle,
  trophy: Trophy,
  sparkles: Sparkles,
  target: Target,
  star: Star,
  crown: Crown,
  compass: Compass,
  none: null,
};

function App() {
  const [names, setNames] = useLocalStorage<NameEntry[]>('wheel-names', DEFAULT_NAMES);
  const [history, setHistory] = useLocalStorage<SpinHistoryEntry[]>('wheel-history', []);
  const [spinConfig, setSpinConfig] = useLocalStorage<SpinConfig>('wheel-spin-config', DEFAULT_SPIN_CONFIG);
  const [appearance, setAppearance] = useLocalStorage<AppearanceSettings>('wheel-appearance', DEFAULT_APPEARANCE);
  const [winnerSettings, setWinnerSettings] = useLocalStorage<WinnerSettings>('wheel-winner-settings', DEFAULT_WINNER);
  const [branding, setBranding] = useLocalStorage<BrandingSettings>('wheel-branding', DEFAULT_BRANDING);

  const [isSpinning, setIsSpinning] = useState(false);
  const [winner, setWinner] = useState<string | null>(null);
  const [spinTrigger, setSpinTrigger] = useState(0);
  const [settingsOpen, setSettingsOpen] = useState(false);
  const [winnerModalOpen, setWinnerModalOpen] = useState(false);
  const [winnerFlash, setWinnerFlash] = useState(false);

  const spinningRef = useRef(false);
  const nameTexts = names.map((n) => n.text);

  // Update document title and header accent color dynamically
  useEffect(() => {
    document.title = branding.showTitle ? branding.title : 'Wheel of Names';
  }, [branding.title, branding.showTitle]);

  const handleAdd = useCallback((text: string) => {
    setNames((prev) => [...prev, { id: makeId(), text }]);
  }, [setNames]);

  const handleAddMany = useCallback((texts: string[]) => {
    setNames((prev) => [...prev, ...texts.map((t) => ({ id: makeId(), text: t }))]);
  }, [setNames]);

  const handleRemove = useCallback((id: string) => {
    setNames((prev) => prev.filter((n) => n.id !== id));
  }, [setNames]);

  const handleClear = useCallback(() => setNames([]), [setNames]);

  const handleSpin = useCallback(() => {
    if (spinningRef.current || names.length === 0) return;
    setWinner(null);
    setWinnerModalOpen(false);
    setWinnerFlash(false);
    setSpinTrigger((c) => c + 1);
    setIsSpinning(true);
  }, [names.length]);

  const handleWinner = useCallback(
    (winnerName: string) => {
      setWinner(winnerName);
      setIsSpinning(false);

      setHistory((prev) => [
        { id: makeId(), winner: winnerName, timestamp: Date.now() },
        ...prev,
      ]);

      if (winnerSettings.winnerFlashLights) {
        setWinnerFlash(true);
      }

      if (winnerSettings.autoRemove === 'always') {
        setNames((prev) => prev.filter((n) => n.text !== winnerName));
      }

      if (winnerSettings.autoRemove === 'off' || winnerSettings.autoRemove === 'ask') {
        setWinnerModalOpen(true);
      } else {
        setWinnerModalOpen(true);
        if (winnerSettings.popupDuration > 0) {
          setTimeout(() => {
            setWinnerModalOpen(false);
            setWinnerFlash(false);
          }, winnerSettings.popupDuration * 1000);
        }
      }
    },
    [setHistory, winnerSettings, setNames],
  );

  useEffect(() => {
    if (!winnerModalOpen) return;
    if (winnerSettings.popupDuration === 0) return;
    if (winnerSettings.autoRemove === 'always') return;
    const timer = setTimeout(() => {
      setWinnerModalOpen(false);
      setWinnerFlash(false);
    }, winnerSettings.popupDuration * 1000);
    return () => clearTimeout(timer);
  }, [winnerModalOpen, winnerSettings.popupDuration, winnerSettings.autoRemove]);

  const handleRemoveWinner = useCallback(() => {
    if (!winner) return;
    setNames((prev) => prev.filter((n) => n.text !== winner));
    setWinnerModalOpen(false);
    setWinnerFlash(false);
  }, [winner, setNames]);

  const handleCloseWinner = useCallback(() => {
    setWinnerModalOpen(false);
    setWinnerFlash(false);
  }, []);

  const handleClearHistory = useCallback(() => setHistory([]), [setHistory]);

  const canSpin = names.length > 0 && !isSpinning;

  const LogoIcon = LOGO_ICONS[branding.logoIcon];
  const headerBg = '#3B4D61';
  const alignClass =
    branding.titleAlignment === 'center' ? 'justify-center' :
    branding.titleAlignment === 'right' ? 'justify-end' :
    'justify-start';

  return (
    <div className="min-h-screen bg-[#F8F6F0] flex flex-col">
      <header className="text-white shadow-lg z-30" style={{ backgroundColor: headerBg }}>
        <div className="max-w-6xl mx-auto px-4 sm:px-6 h-14 flex items-center justify-between">
          <div className={`flex items-center gap-2.5 min-w-0 flex-1 ${alignClass}`}>
            {LogoIcon && branding.logoIcon !== 'none' && (
              <LogoIcon size={24} style={{ color: branding.accentColor }} className="shrink-0" />
            )}
            <div className="min-w-0">
              {branding.showTitle && (
                <span
                  className="block truncate"
                  style={{
                    fontSize: `${branding.titleFontSize}px`,
                    fontWeight: branding.titleFontWeight,
                    color: branding.titleColor,
                    letterSpacing: '0.02em',
                  }}
                >
                  {branding.title}
                </span>
              )}
              {branding.showSubtitle && (
                <span
                  className="block text-xs truncate"
                  style={{ color: branding.subtitleColor }}
                >
                  {branding.subtitle}
                </span>
              )}
            </div>
          </div>
          <button
            onClick={() => setSettingsOpen(true)}
            className="flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium text-white/90 hover:text-white hover:bg-white/10 transition shrink-0"
          >
            <SettingsIcon size={18} />
            <span className="hidden sm:inline">Settings</span>
          </button>
        </div>
      </header>

      <main className="flex-1 max-w-6xl mx-auto w-full px-4 sm:px-6 py-6">
        <div className="grid grid-cols-1 lg:grid-cols-[1fr_auto_280px] gap-6 items-start">
          <div className="order-2 lg:order-1 w-full lg:max-w-sm">
            <NamePanel
              names={names}
              onAdd={handleAdd}
              onAddMany={handleAddMany}
              onRemove={handleRemove}
              onClear={handleClear}
              disabled={isSpinning}
            />
          </div>

          <div className="order-1 lg:order-2 flex flex-col items-center gap-4">
            <Wheel
              names={nameTexts}
              appearance={appearance}
              spinConfig={spinConfig}
              onWinner={handleWinner}
              spinTrigger={spinTrigger}
              spinningRef={spinningRef}
              winnerFlash={winnerFlash}
            />

            <button
              onClick={handleSpin}
              disabled={!canSpin}
              className={`flex items-center gap-3 px-12 py-4 rounded-xl font-bold text-lg tracking-wide transition-all ${
                canSpin
                  ? 'bg-[#5B7C99] text-white shadow-lg hover:bg-[#4A6A85] hover:shadow-xl active:scale-95'
                  : 'bg-slate-300 text-slate-500 cursor-not-allowed'
              }`}
            >
              {isSpinning ? (
                <>
                  <span className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                  Spinning…
                </>
              ) : (
                <>Spin</>
              )}
            </button>

            {names.length === 0 && !isSpinning && (
              <p className="text-sm text-slate-500">Add names to start spinning</p>
            )}
          </div>

          <div className="order-3 w-full lg:max-w-[280px]">
            <HistoryPanel history={history} onClear={handleClearHistory} />
          </div>
        </div>
      </main>

      <footer className="text-center py-4 text-xs text-slate-400">
        {branding.showTitle ? branding.title : 'Wheel'}{branding.showSubtitle && branding.subtitle ? ` — ${branding.subtitle}` : ''}
      </footer>

      <SettingsPanel
        open={settingsOpen}
        onClose={() => setSettingsOpen(false)}
        spinConfig={spinConfig}
        setSpinConfig={setSpinConfig}
        appearance={appearance}
        setAppearance={setAppearance}
        winnerSettings={winnerSettings}
        setWinnerSettings={setWinnerSettings}
        branding={branding}
        setBranding={setBranding}
        onTestSpin={handleSpin}
      />

      <WinnerModal
        winner={winner}
        open={winnerModalOpen}
        onClose={handleCloseWinner}
        onRemove={handleRemoveWinner}
      />
    </div>
  );
}

export default App;
