import { Trophy, Zap } from 'lucide-react';
import type { WinnerSettings } from '@/types';
import { SectionHeader, Toggle, Segmented, Slider } from '@/components/controls';

interface WinnerTabProps {
  winnerSettings: WinnerSettings;
  setWinnerSettings: (s: WinnerSettings) => void;
}

const WinnerTab = ({ winnerSettings, setWinnerSettings }: WinnerTabProps) => {
  return (
    <div className="space-y-7">
      <section>
        <SectionHeader icon={<Trophy size={16} />} title="Winner Popup" />
        <div className="space-y-4">
          <Segmented
            label="Automatically Remove Winner"
            value={winnerSettings.autoRemove}
            options={[
              { value: 'off', label: 'Off' },
              { value: 'ask', label: 'Ask Every Time' },
              { value: 'always', label: 'Always Remove' },
            ]}
            onChange={(v) => setWinnerSettings({ ...winnerSettings, autoRemove: v })}
          />
          <p className="text-xs text-slate-400">
            {winnerSettings.autoRemove === 'off' && 'Winners stay on the wheel after being selected.'}
            {winnerSettings.autoRemove === 'ask' && 'After each spin, the winner popup will show a Remove button.'}
            {winnerSettings.autoRemove === 'always' && 'Winners are automatically removed from the wheel after each spin.'}
          </p>
        </div>
      </section>

      <section>
        <SectionHeader icon={<Zap size={16} />} title="Winner Effects" />
        <div className="space-y-4">
          <Toggle
            label="Flash lights on winner"
            checked={winnerSettings.winnerFlashLights}
            onChange={(v) => setWinnerSettings({ ...winnerSettings, winnerFlashLights: v })}
          />
          <Toggle
            label="Play winner sound"
            checked={winnerSettings.winnerSound}
            onChange={(v) => setWinnerSettings({ ...winnerSettings, winnerSound: v })}
          />
          <Slider
            label="Auto-close popup"
            value={winnerSettings.popupDuration}
            min={0}
            max={10}
            step={1}
            format={(v) => (v === 0 ? 'Manual' : `${v}s`)}
            onChange={(v) => setWinnerSettings({ ...winnerSettings, popupDuration: v })}
          />
        </div>
      </section>
    </div>
  );
};

export default WinnerTab;
