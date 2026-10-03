interface SliderProps {
  label: string;
  value: number;
  min: number;
  max: number;
  step: number;
  unit?: string;
  format?: (v: number) => string;
  onChange: (v: number) => void;
}

export function Slider({ label, value, min, max, step, unit, format, onChange }: SliderProps) {
  const display = format ? format(value) : `${value}${unit ?? ''}`;
  return (
    <div>
      <div className="flex justify-between items-center mb-1.5">
        <label className="text-sm text-slate-600">{label}</label>
        <span className="text-sm font-semibold text-slate-800 tabular-nums">{display}</span>
      </div>
      <input
        type="range"
        min={min}
        max={max}
        step={step}
        value={value}
        onChange={(e) => onChange(Number(e.target.value))}
        className="w-full accent-[#5B7C99]"
      />
    </div>
  );
}

interface ToggleProps {
  label: string;
  checked: boolean;
  onChange: (v: boolean) => void;
}

export function Toggle({ label, checked, onChange }: ToggleProps) {
  return (
    <label className="flex items-center justify-between cursor-pointer">
      <span className="text-sm text-slate-600">{label}</span>
      <button
        onClick={() => onChange(!checked)}
        className={`relative w-11 h-6 rounded-full transition ${
          checked ? 'bg-[#5B7C99]' : 'bg-slate-300'
        }`}
        role="switch"
        aria-checked={checked}
      >
        <span
          className={`absolute top-0.5 left-0.5 w-5 h-5 bg-white rounded-full shadow transition-transform ${
            checked ? 'translate-x-5' : ''
          }`}
        />
      </button>
    </label>
  );
}

interface ColorPickerProps {
  label: string;
  value: string;
  onChange: (v: string) => void;
}

export function ColorPicker({ label, value, onChange }: ColorPickerProps) {
  return (
    <div className="flex items-center justify-between">
      <label className="text-sm text-slate-600">{label}</label>
      <div className="flex items-center gap-2">
        <input
          type="color"
          value={value}
          onChange={(e) => onChange(e.target.value)}
          className="w-8 h-8 rounded-lg border border-slate-200 cursor-pointer"
        />
        <span className="text-xs font-mono text-slate-400 w-20">{value}</span>
      </div>
    </div>
  );
}

interface SelectProps<T extends string> {
  label: string;
  value: T;
  options: { value: T; label: string }[];
  onChange: (v: T) => void;
}

export function Select<T extends string>({ label, value, options, onChange }: SelectProps<T>) {
  return (
    <div className="flex items-center justify-between">
      <label className="text-sm text-slate-600">{label}</label>
      <select
        value={value}
        onChange={(e) => onChange(e.target.value as T)}
        className="px-3 py-1.5 text-sm rounded-lg border border-slate-200 bg-white text-slate-700 focus:border-[#5B7C99] focus:ring-2 focus:ring-[#5B7C99]/20 outline-none transition"
      >
        {options.map((opt) => (
          <option key={opt.value} value={opt.value}>{opt.label}</option>
        ))}
      </select>
    </div>
  );
}

interface SectionHeaderProps {
  icon: React.ReactNode;
  title: string;
}

export function SectionHeader({ icon, title }: SectionHeaderProps) {
  return (
    <div className="flex items-center gap-2 mb-4">
      <span className="text-[#5B7C99]">{icon}</span>
      <h3 className="text-xs font-bold text-slate-500 uppercase tracking-wide">{title}</h3>
    </div>
  );
}

interface SegmentedProps<T extends string> {
  label?: string;
  value: T;
  options: { value: T; label: string }[];
  onChange: (v: T) => void;
}

export function Segmented<T extends string>({ label, value, options, onChange }: SegmentedProps<T>) {
  return (
    <div>
      {label && <label className="text-sm text-slate-600 mb-2 block">{label}</label>}
      <div className="flex gap-1.5 flex-wrap">
        {options.map((opt) => (
          <button
            key={opt.value}
            onClick={() => onChange(opt.value)}
            className={`px-3 py-1.5 rounded-lg text-sm border-2 transition ${
              value === opt.value
                ? 'border-[#5B7C99] bg-[#5B7C99]/5 text-[#3B4D61]'
                : 'border-slate-200 text-slate-600 hover:border-slate-300'
            }`}
          >
            {opt.label}
          </button>
        ))}
      </div>
    </div>
  );
}
