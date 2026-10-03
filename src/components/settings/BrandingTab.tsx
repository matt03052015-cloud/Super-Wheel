import { Type, Image } from 'lucide-react';
import type { BrandingSettings, LogoIcon } from '@/types';
import { LOGO_ICON_LABELS } from '@/types';
import { SectionHeader, Toggle, Slider, Segmented, ColorPicker } from '@/components/controls';

interface BrandingTabProps {
  branding: BrandingSettings;
  setBranding: (b: BrandingSettings) => void;
}

const LOGO_OPTIONS: { value: LogoIcon; label: string }[] = (
  Object.keys(LOGO_ICON_LABELS) as LogoIcon[]
).map((k) => ({ value: k, label: LOGO_ICON_LABELS[k] }));

const BrandingTab = ({ branding, setBranding }: BrandingTabProps) => {
  const update = (patch: Partial<BrandingSettings>) =>
    setBranding({ ...branding, ...patch });

  return (
    <div className="space-y-7">
      {/* Title text */}
      <section>
        <SectionHeader icon={<Type size={16} />} title="Title Text" />
        <div className="space-y-4">
          <Toggle
            label="Show title"
            checked={branding.showTitle}
            onChange={(v) => update({ showTitle: v })}
          />
          {branding.showTitle && (
            <div className="pl-3 space-y-3 border-l-2 border-slate-100">
              <div>
                <label className="text-sm text-slate-600 mb-1.5 block">Website Title</label>
                <input
                  type="text"
                  value={branding.title}
                  onChange={(e) => update({ title: e.target.value })}
                  maxLength={40}
                  className="w-full px-3 py-2 text-sm rounded-lg border border-slate-300 focus:border-[#5B7C99] focus:ring-2 focus:ring-[#5B7C99]/20 outline-none transition"
                  placeholder="Super Wheel"
                />
              </div>
              <Slider
                label="Title Font Size"
                value={branding.titleFontSize}
                min={14}
                max={28}
                step={1}
                unit="px"
                onChange={(v) => update({ titleFontSize: v })}
              />
              <Segmented
                label="Title Font Weight"
                value={String(branding.titleFontWeight)}
                options={[
                  { value: '400', label: 'Regular' },
                  { value: '600', label: 'Semibold' },
                  { value: '700', label: 'Bold' },
                  { value: '800', label: 'Extra Bold' },
                ]}
                onChange={(v) => update({ titleFontWeight: Number(v) })}
              />
              <Segmented
                label="Title Alignment"
                value={branding.titleAlignment}
                options={[
                  { value: 'left', label: 'Left' },
                  { value: 'center', label: 'Center' },
                  { value: 'right', label: 'Right' },
                ]}
                onChange={(v) => update({ titleAlignment: v })}
              />
              <ColorPicker
                label="Title Color"
                value={branding.titleColor}
                onChange={(v) => update({ titleColor: v })}
              />
            </div>
          )}
        </div>
      </section>

      {/* Subtitle */}
      <section>
        <SectionHeader icon={<Type size={16} />} title="Subtitle Text" />
        <div className="space-y-4">
          <Toggle
            label="Show subtitle"
            checked={branding.showSubtitle}
            onChange={(v) => update({ showSubtitle: v })}
          />
          {branding.showSubtitle && (
            <div className="pl-3 space-y-3 border-l-2 border-slate-100">
              <div>
                <label className="text-sm text-slate-600 mb-1.5 block">Subtitle Text</label>
                <input
                  type="text"
                  value={branding.subtitle}
                  onChange={(e) => update({ subtitle: e.target.value })}
                  maxLength={60}
                  className="w-full px-3 py-2 text-sm rounded-lg border border-slate-300 focus:border-[#5B7C99] focus:ring-2 focus:ring-[#5B7C99]/20 outline-none transition"
                  placeholder="Random name picker"
                />
              </div>
              <ColorPicker
                label="Subtitle Color"
                value={branding.subtitleColor}
                onChange={(v) => update({ subtitleColor: v })}
              />
            </div>
          )}
        </div>
      </section>

      {/* Logo / Icon */}
      <section>
        <SectionHeader icon={<Image size={16} />} title="Logo / Icon" />
        <Segmented
          label="Header Icon"
          value={branding.logoIcon}
          options={LOGO_OPTIONS}
          onChange={(v) => update({ logoIcon: v })}
        />
      </section>

      {/* Accent color */}
      <section>
        <SectionHeader icon={<Type size={16} />} title="Accent Color" />
        <ColorPicker
          label="Custom Accent Color"
          value={branding.accentColor}
          onChange={(v) => update({ accentColor: v })}
        />
        <p className="mt-2 text-xs text-slate-400">
          Used for the header icon and highlights throughout the interface.
        </p>
      </section>
    </div>
  );
};

export default BrandingTab;
