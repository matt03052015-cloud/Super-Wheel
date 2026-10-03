import { Volume2, VolumeX, Settings2 } from 'lucide-react';
import type { SpinConfig } from '@/types';
import { Toggle, SectionHeader } from '@/components/controls';

interface GeneralTabProps {
  spinConfig: SpinConfig;
  setSpinConfig: (cfg: SpinConfig) => void;
}

const GeneralTab = ({ spinConfig, setSpinConfig }: GeneralTabProps) => {
  return (
    <div className="space-y-7">
      <section>
        <SectionHeader icon={spinConfig.soundEnabled ? <Volume2 size={16} /> : <VolumeX size={16} />} title="Sound" />
        <Toggle
          label="Sound effects"
          checked={spinConfig.soundEnabled}
          onChange={(v) => setSpinConfig({ ...spinConfig, soundEnabled: v })}
        />
      </section>

      <section>
        <SectionHeader icon={<Settings2 size={16} />} title="General Preferences" />
        <p className="text-sm text-slate-400">
          Sound effects play tick sounds as the wheel spins and a fanfare when a winner is selected.
        </p>
      </section>
    </div>
  );
};

export default GeneralTab;
