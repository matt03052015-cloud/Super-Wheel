import { Palette, Square, Circle, Lightbulb, Type } from 'lucide-react';
import type { AppearanceSettings } from '@/types';
import { COLOR_PALETTES, PALETTE_NAMES } from '@/types';
import { Slider, Toggle, ColorPicker, Select, SectionHeader, Segmented } from '@/components/controls';

interface AppearanceTabProps {
  appearance: AppearanceSettings;
  setAppearance: (app: AppearanceSettings) => void;
}

const AppearanceTab = ({ appearance, setAppearance }: AppearanceTabProps) => {
  const { border, lights } = appearance;
  const paletteKeys = Object.keys(COLOR_PALETTES);

  const updateBorder = (patch: Partial<typeof border>) =>
    setAppearance({ ...appearance, border: { ...border, ...patch } });
  const updateLights = (patch: Partial<typeof lights>) =>
    setAppearance({ ...appearance, lights: { ...lights, ...patch } });

  return (
    <div className="space-y-7">
      {/* Colors */}
      <section>
        <SectionHeader icon={<Palette size={16} />} title="Colors" />
        <div className="space-y-4">
          <div>
            <label className="text-sm text-slate-600 mb-2 block">Color Palette</label>
            <div className="grid grid-cols-2 gap-2">
              {paletteKeys.map((key) => (
                <button
                  key={key}
                  onClick={() => setAppearance({ ...appearance, colorPalette: key })}
                  className={`flex items-center gap-2 px-3 py-2 rounded-lg border-2 transition text-left ${
                    appearance.colorPalette === key
                      ? 'border-[#5B7C99] bg-[#5B7C99]/5'
                      : 'border-slate-200 hover:border-slate-300'
                  }`}
                >
                  <div className="flex gap-0.5 shrink-0">
                    {COLOR_PALETTES[key].slice(0, 4).map((c, i) => (
                      <div key={i} className="w-3 h-3 rounded-full" style={{ backgroundColor: c }} />
                    ))}
                  </div>
                  <span className="text-xs font-medium text-slate-700">{PALETTE_NAMES[key]}</span>
                </button>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Text Appearance */}
      <section>
        <SectionHeader icon={<Type size={16} />} title="Text Appearance" />
        <div className="space-y-4">
          <ColorPicker
            label="Text Color"
            value={appearance.textColor}
            onChange={(v) => setAppearance({ ...appearance, textColor: v })}
          />
          <Slider
            label="Font Size"
            value={appearance.fontSize}
            min={10}
            max={22}
            step={1}
            unit="px"
            onChange={(v) => setAppearance({ ...appearance, fontSize: v })}
          />
          <Segmented
            label="Font Weight"
            value={String(appearance.fontWeight)}
            options={[
              { value: '400', label: 'Regular' },
              { value: '600', label: 'Semibold' },
              { value: '700', label: 'Bold' },
            ]}
            onChange={(v) => setAppearance({ ...appearance, fontWeight: Number(v) })}
          />
        </div>
      </section>

      {/* Outer Border */}
      <section>
        <SectionHeader icon={<Square size={16} />} title="Outer Border" />
        <div className="space-y-4">
          <Slider
            label="Border Thickness"
            value={border.thickness}
            min={0}
            max={24}
            step={1}
            unit="px"
            onChange={(v) => updateBorder({ thickness: v })}
          />
          <ColorPicker
            label="Border Color"
            value={border.color}
            onChange={(v) => updateBorder({ color: v })}
          />
          <Slider
            label="Border Opacity"
            value={border.opacity}
            min={0}
            max={1}
            step={0.05}
            format={(v) => `${Math.round(v * 100)}%`}
            onChange={(v) => updateBorder({ opacity: v })}
          />
          <Select
            label="Border Style"
            value={border.style}
            options={[
              { value: 'solid', label: 'Solid' },
              { value: 'dashed', label: 'Dashed' },
              { value: 'dotted', label: 'Dotted' },
              { value: 'double', label: 'Double' },
            ]}
            onChange={(v) => updateBorder({ style: v })}
          />

          <Toggle
            label="Border Glow"
            checked={border.glowEnabled}
            onChange={(v) => updateBorder({ glowEnabled: v })}
          />
          {border.glowEnabled && (
            <div className="pl-3 space-y-3 border-l-2 border-slate-100">
              <ColorPicker
                label="Glow Color"
                value={border.glowColor}
                onChange={(v) => updateBorder({ glowColor: v })}
              />
              <Slider
                label="Glow Intensity"
                value={border.glowIntensity}
                min={0}
                max={1}
                step={0.05}
                format={(v) => `${Math.round(v * 100)}%`}
                onChange={(v) => updateBorder({ glowIntensity: v })}
              />
              <Slider
                label="Glow Size"
                value={border.glowSize}
                min={5}
                max={60}
                step={1}
                unit="px"
                onChange={(v) => updateBorder({ glowSize: v })}
              />
            </div>
          )}
        </div>
      </section>

      {/* Inner Border */}
      <section>
        <SectionHeader icon={<Circle size={16} />} title="Inner Border" />
        <Toggle
          label="Enable Inner Border"
          checked={border.innerBorderEnabled}
          onChange={(v) => updateBorder({ innerBorderEnabled: v })}
        />
        {border.innerBorderEnabled && (
          <div className="mt-3 pl-3 space-y-3 border-l-2 border-slate-100">
            <Slider
              label="Inner Border Thickness"
              value={border.innerBorderThickness}
              min={1}
              max={12}
              step={1}
              unit="px"
              onChange={(v) => updateBorder({ innerBorderThickness: v })}
            />
            <ColorPicker
              label="Inner Border Color"
              value={border.innerBorderColor}
              onChange={(v) => updateBorder({ innerBorderColor: v })}
            />
          </div>
        )}
      </section>

      {/* Shadow */}
      <section>
        <SectionHeader icon={<Square size={16} />} title="Shadow" />
        <Toggle
          label="Enable Shadow"
          checked={border.shadowEnabled}
          onChange={(v) => updateBorder({ shadowEnabled: v })}
        />
        {border.shadowEnabled && (
          <div className="mt-3 pl-3 space-y-3 border-l-2 border-slate-100">
            <Slider
              label="Shadow Intensity"
              value={border.shadowIntensity}
              min={0}
              max={1}
              step={0.05}
              format={(v) => `${Math.round(v * 100)}%`}
              onChange={(v) => updateBorder({ shadowIntensity: v })}
            />
            <Slider
              label="Shadow Blur"
              value={border.shadowBlur}
              min={5}
              max={80}
              step={1}
              unit="px"
              onChange={(v) => updateBorder({ shadowBlur: v })}
            />
          </div>
        )}
      </section>

      {/* Lights */}
      <section>
        <SectionHeader icon={<Lightbulb size={16} />} title="Lights" />
        <Toggle
          label="Enable Lights"
          checked={lights.enabled}
          onChange={(v) => updateLights({ enabled: v })}
        />
        {lights.enabled && (
          <div className="mt-3 pl-3 space-y-3 border-l-2 border-slate-100">
            <ColorPicker
              label="Light Color 1"
              value={lights.color1}
              onChange={(v) => updateLights({ color1: v })}
            />
            <ColorPicker
              label="Light Color 2"
              value={lights.color2}
              onChange={(v) => updateLights({ color2: v })}
            />
            <Slider
              label="Number of Lights"
              value={lights.count}
              min={6}
              max={48}
              step={1}
              onChange={(v) => updateLights({ count: v })}
            />
            <Slider
              label="Light Size"
              value={lights.size}
              min={2}
              max={12}
              step={0.5}
              unit="px"
              onChange={(v) => updateLights({ size: v })}
            />
            <Slider
              label="Brightness"
              value={lights.brightness}
              min={0.2}
              max={1}
              step={0.05}
              format={(v) => `${Math.round(v * 100)}%`}
              onChange={(v) => updateLights({ brightness: v })}
            />
            <Slider
              label="Glow Strength"
              value={lights.glowStrength}
              min={0}
              max={1}
              step={0.05}
              format={(v) => `${Math.round(v * 100)}%`}
              onChange={(v) => updateLights({ glowStrength: v })}
            />
            <Slider
              label="Animation Speed"
              value={lights.animationSpeed}
              min={0.5}
              max={5}
              step={0.5}
              format={(v) => `${v.toFixed(1)}x`}
              onChange={(v) => updateLights({ animationSpeed: v })}
            />
            <Select
              label="Lighting Pattern"
              value={lights.pattern}
              options={[
                { value: 'static', label: 'Static' },
                { value: 'blink', label: 'Blinking' },
                { value: 'chase', label: 'Chasing' },
                { value: 'alternate', label: 'Alternating' },
                { value: 'spinActive', label: 'Spin Active' },
                { value: 'winnerFlash', label: 'Winner Flash' },
              ]}
              onChange={(v) => updateLights({ pattern: v })}
            />
          </div>
        )}
      </section>
    </div>
  );
};

export default AppearanceTab;
