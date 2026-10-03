import { Gauge, Activity, Sparkles } from 'lucide-react';
import type { SpinConfig, CurvePresetName, AnimationCurve } from '@/types';
import { SectionHeader, Slider } from '@/components/controls';
import AnimationCurveEditor from '@/components/AnimationCurveEditor';

interface AnimationTabProps {
  spinConfig: SpinConfig;
  setSpinConfig: (cfg: SpinConfig) => void;
  onTestSpin: () => void;
  isSpinning: boolean;
}

const AnimationTab = ({ spinConfig, setSpinConfig, onTestSpin, isSpinning }: AnimationTabProps) => {
  const handleCurveChange = (curve: AnimationCurve, preset: CurvePresetName) => {
    setSpinConfig({ ...spinConfig, curve, curvePreset: preset });
  };

  return (
    <div className="space-y-7">
      {/* Basic spin settings */}
      <section>
        <SectionHeader icon={<Gauge size={16} />} title="Spin Parameters" />
        <div className="space-y-4">
          <Slider
            label="Spin Duration"
            value={spinConfig.spinDuration}
            min={3}
            max={12}
            step={0.5}
            format={(v) => `${v.toFixed(1)}s`}
            onChange={(v) => setSpinConfig({ ...spinConfig, spinDuration: v })}
          />
          <Slider
            label="Rotations"
            value={spinConfig.rotations}
            min={3}
            max={20}
            step={1}
            onChange={(v) => setSpinConfig({ ...spinConfig, rotations: v })}
          />
          <Slider
            label="Spin Speed"
            value={spinConfig.speed}
            min={0.5}
            max={2}
            step={0.1}
            format={(v) => `${v.toFixed(1)}x`}
            onChange={(v) => setSpinConfig({ ...spinConfig, speed: v })}
          />
        </div>
      </section>

      {/* Animation curve editor */}
      <section>
        <SectionHeader icon={<Activity size={16} />} title="Animation Curve" />
        <AnimationCurveEditor
          curve={spinConfig.curve}
          preset={spinConfig.curvePreset}
          onChange={handleCurveChange}
        />
      </section>

      {/* Settling */}
      <section>
        <SectionHeader icon={<Sparkles size={16} />} title="Settling Movement" />
        <Slider
          label="Final Settle Amount"
          value={spinConfig.settleAmount}
          min={0}
          max={3}
          step={0.1}
          format={(v) => `${v.toFixed(1)}°`}
          onChange={(v) => setSpinConfig({ ...spinConfig, settleAmount: v })}
        />
      </section>

      {/* Test spin */}
      <section className="pt-4 border-t border-slate-100">
        <button
          onClick={onTestSpin}
          disabled={isSpinning}
          className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-[#5B7C99] text-white font-medium text-sm hover:bg-[#4A6A85] transition active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {isSpinning ? (
            <>
              <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
              Spinning…
            </>
          ) : (
            'Test Spin'
          )}
        </button>
        <p className="mt-2 text-xs text-slate-400">
          Preview the current animation settings with a test spin.
        </p>
      </section>
    </div>
  );
};

export default AnimationTab;
