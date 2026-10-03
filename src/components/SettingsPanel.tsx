import { useState } from 'react';
import { Settings, X, RotateCcw } from 'lucide-react';
import type { SpinConfig, AppearanceSettings, WinnerSettings, BrandingSettings } from '@/types';
import { DEFAULT_SPIN_CONFIG, DEFAULT_APPEARANCE, DEFAULT_WINNER, DEFAULT_BRANDING } from '@/types';
import GeneralTab from '@/components/settings/GeneralTab';
import AppearanceTab from '@/components/settings/AppearanceTab';
import AnimationTab from '@/components/settings/AnimationTab';
import WinnerTab from '@/components/settings/WinnerTab';
import BrandingTab from '@/components/settings/BrandingTab';

interface SettingsPanelProps {
  open: boolean;
  onClose: () => void;
  spinConfig: SpinConfig;
  setSpinConfig: (cfg: SpinConfig) => void;
  appearance: AppearanceSettings;
  setAppearance: (app: AppearanceSettings) => void;
  winnerSettings: WinnerSettings;
  setWinnerSettings: (s: WinnerSettings) => void;
  branding: BrandingSettings;
  setBranding: (b: BrandingSettings) => void;
  onTestSpin: () => void;
}

type TabName = 'general' | 'appearance' | 'animation' | 'winner' | 'branding';

const TABS: { id: TabName; label: string }[] = [
  { id: 'general', label: 'General' },
  { id: 'appearance', label: 'Appearance' },
  { id: 'animation', label: 'Spin Animation' },
  { id: 'winner', label: 'Winner' },
  { id: 'branding', label: 'Branding' },
];

const SettingsPanel = ({
  open,
  onClose,
  spinConfig,
  setSpinConfig,
  appearance,
  setAppearance,
  winnerSettings,
  setWinnerSettings,
  branding,
  setBranding,
  onTestSpin,
}: SettingsPanelProps) => {
  const [tab, setTab] = useState<TabName>('general');
  const [testSpinning, setTestSpinning] = useState(false);

  const handleTestSpin = () => {
    setTestSpinning(true);
    onTestSpin();
    // Reset after a reasonable duration
    const dur = (spinConfig.spinDuration / Math.max(0.5, Math.min(2, spinConfig.speed))) * 1000 + 500;
    setTimeout(() => setTestSpinning(false), dur);
  };

  return (
    <>
      {open && (
        <div
          className="fixed inset-0 bg-black/30 backdrop-blur-sm z-40 animate-in fade-in duration-200"
          onClick={onClose}
        />
      )}

      <div
        className={`fixed top-0 right-0 h-full w-full max-w-md bg-white shadow-2xl z-50 overflow-y-auto transition-transform duration-300 ease-out flex flex-col ${
          open ? 'translate-x-0' : 'translate-x-full'
        }`}
      >
        <div className="sticky top-0 z-20 bg-white border-b border-slate-100">
          {/* Header */}
          <div className="flex items-center justify-between px-5 py-3.5 bg-[#3B4D61] text-white">
            <div className="flex items-center gap-2">
              <Settings size={20} />
              <h2 className="text-base font-bold">Settings</h2>
            </div>
            <button
              onClick={onClose}
              className="flex items-center justify-center w-8 h-8 rounded-lg text-white/70 hover:text-white hover:bg-white/10 transition"
              aria-label="Close settings"
            >
              <X size={20} />
            </button>
          </div>

          {/* Tabs */}
          <div className="flex px-3 pt-2 gap-1">
            {TABS.map((t) => (
              <button
                key={t.id}
                onClick={() => setTab(t.id)}
                className={`px-3 py-2 text-xs font-semibold rounded-t-lg transition whitespace-nowrap ${
                  tab === t.id
                    ? 'text-[#5B7C99] border-b-2 border-[#5B7C99] bg-[#5B7C99]/5'
                    : 'text-slate-400 hover:text-slate-600'
                }`}
              >
                {t.label}
              </button>
            ))}
          </div>
        </div>

        {/* Content */}
        <div className="flex-1 px-5 py-5">
          {tab === 'general' && (
            <GeneralTab spinConfig={spinConfig} setSpinConfig={setSpinConfig} />
          )}
          {tab === 'appearance' && (
            <AppearanceTab appearance={appearance} setAppearance={setAppearance} />
          )}
          {tab === 'animation' && (
            <AnimationTab
              spinConfig={spinConfig}
              setSpinConfig={setSpinConfig}
              onTestSpin={handleTestSpin}
              isSpinning={testSpinning}
            />
          )}
          {tab === 'winner' && (
            <WinnerTab winnerSettings={winnerSettings} setWinnerSettings={setWinnerSettings} />
          )}
          {tab === 'branding' && (
            <BrandingTab branding={branding} setBranding={setBranding} />
          )}
        </div>

        {/* Reset footer */}
        <div className="sticky bottom-0 px-5 py-3 bg-white border-t border-slate-100">
          <button
            onClick={() => {
              setSpinConfig(DEFAULT_SPIN_CONFIG);
              setAppearance(DEFAULT_APPEARANCE);
              setWinnerSettings(DEFAULT_WINNER);
              setBranding(DEFAULT_BRANDING);
            }}
            className="flex items-center gap-2 text-sm font-medium text-slate-500 hover:text-slate-800 transition"
          >
            <RotateCcw size={16} />
            Reset all to defaults
          </button>
        </div>
      </div>
    </>
  );
};

export default SettingsPanel;
