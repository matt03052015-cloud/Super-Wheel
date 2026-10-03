import { Plus, X, Trash2 } from 'lucide-react';
import type { NameEntry } from '@/types';

interface NamePanelProps {
  names: NameEntry[];
  onAdd: (text: string) => void;
  onAddMany: (texts: string[]) => void;
  onRemove: (id: string) => void;
  onClear: () => void;
  disabled: boolean;
}

const NamePanel = ({ names, onAdd, onAddMany, onRemove, onClear, disabled }: NamePanelProps) => {
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const form = e.currentTarget as HTMLFormElement;
    const input = form.elements.namedItem('nameInput') as HTMLInputElement;
    const trimmed = input.value.trim();
    if (!trimmed) return;

    if (trimmed.includes(',') || trimmed.includes('\n')) {
      const parts = trimmed
        .split(/[,\n]/)
        .map((s) => s.trim())
        .filter(Boolean);
      if (parts.length > 0) onAddMany(parts);
    } else {
      onAdd(trimmed);
    }
    input.value = '';
  };

  return (
    <div className="bg-white rounded-xl shadow-md border border-slate-200 overflow-hidden">
      <div className="flex items-center justify-between px-5 py-3 bg-[#3B4D61] text-white">
        <h2 className="text-sm font-bold uppercase tracking-wide">Names</h2>
        <span className="text-xs font-semibold bg-white/20 px-2.5 py-0.5 rounded-full">
          {names.length}
        </span>
      </div>

      <form onSubmit={handleSubmit} className="px-4 py-3 border-b border-slate-100">
        <div className="flex gap-2">
          <input
            name="nameInput"
            type="text"
            placeholder="Enter a name…"
            disabled={disabled}
            className="flex-1 px-3 py-2 text-sm rounded-lg border border-slate-300 focus:border-[#5B7C99] focus:ring-2 focus:ring-[#5B7C99]/20 outline-none transition disabled:opacity-50"
          />
          <button
            type="submit"
            disabled={disabled}
            className="flex items-center justify-center w-9 h-9 rounded-lg bg-[#5B7C99] text-white hover:bg-[#4A6A85] active:scale-95 transition disabled:opacity-50 shrink-0"
            aria-label="Add name"
          >
            <Plus size={18} />
          </button>
        </div>
        <p className="mt-1.5 text-xs text-slate-400">
          Separate multiple names with commas
        </p>
      </form>

      <div className="overflow-y-auto px-2 py-2 max-h-[280px] lg:max-h-[420px]">
        {names.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-10 text-slate-400">
            <p className="text-sm">No names yet</p>
          </div>
        ) : (
          <ul className="space-y-0.5">
            {names.map((entry, i) => (
              <li
                key={entry.id}
                className="group flex items-center gap-2 px-3 py-1.5 rounded-lg hover:bg-slate-50 transition"
              >
                <span className="w-5 text-xs font-mono text-slate-400 shrink-0">
                  {i + 1}
                </span>
                <span className="flex-1 text-sm text-slate-700 truncate">
                  {entry.text}
                </span>
                <button
                  onClick={() => onRemove(entry.id)}
                  disabled={disabled}
                  className="opacity-0 group-hover:opacity-100 flex items-center justify-center w-6 h-6 rounded-md text-slate-400 hover:text-red-500 hover:bg-red-50 transition disabled:opacity-20"
                  aria-label={`Remove ${entry.text}`}
                >
                  <X size={14} />
                </button>
              </li>
            ))}
          </ul>
        )}
      </div>

      {names.length > 0 && (
        <div className="px-4 py-2.5 border-t border-slate-100">
          <button
            onClick={onClear}
            disabled={disabled}
            className="flex items-center gap-1.5 text-xs font-medium text-slate-500 hover:text-red-500 transition disabled:opacity-50"
          >
            <Trash2 size={13} />
            Clear all
          </button>
        </div>
      )}
    </div>
  );
};

export default NamePanel;
