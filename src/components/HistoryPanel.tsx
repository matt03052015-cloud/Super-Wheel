import { History, Trash2, Trophy } from 'lucide-react';
import type { SpinHistoryEntry } from '@/types';

interface HistoryPanelProps {
  history: SpinHistoryEntry[];
  onClear: () => void;
}

const HistoryPanel = ({ history, onClear }: HistoryPanelProps) => {
  return (
    <div className="bg-white rounded-xl shadow-md border border-slate-200 overflow-hidden">
      <div className="flex items-center justify-between px-5 py-3 bg-[#3B4D61] text-white">
        <div className="flex items-center gap-2">
          <History size={16} />
          <h2 className="text-sm font-bold uppercase tracking-wide">History</h2>
        </div>
        {history.length > 0 && (
          <button
            onClick={onClear}
            className="flex items-center gap-1 text-xs font-medium text-white/70 hover:text-white transition"
          >
            <Trash2 size={13} />
            Clear
          </button>
        )}
      </div>

      <div className="max-h-[220px] lg:max-h-[360px] overflow-y-auto">
        {history.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-10 text-slate-400">
            <Trophy size={26} className="mb-2 opacity-30" />
            <p className="text-sm">No spins yet</p>
          </div>
        ) : (
          <ul className="divide-y divide-slate-50">
            {history.map((entry, i) => (
              <li
                key={entry.id}
                className="flex items-center gap-3 px-4 py-2.5 hover:bg-slate-50 transition"
              >
                <div
                  className={`flex items-center justify-center w-6 h-6 rounded-full shrink-0 ${
                    i === 0 ? 'bg-amber-100 text-amber-600' : 'bg-slate-100 text-slate-400'
                  }`}
                >
                  <Trophy size={12} />
                </div>
                <span className="flex-1 text-sm font-medium text-slate-700 truncate">
                  {entry.winner}
                </span>
                <span className="text-xs text-slate-400 tabular-nums shrink-0">
                  {new Date(entry.timestamp).toLocaleTimeString([], {
                    hour: '2-digit',
                    minute: '2-digit',
                  })}
                </span>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
};

export default HistoryPanel;
