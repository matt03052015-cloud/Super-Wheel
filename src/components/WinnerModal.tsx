import { Trophy, X, UserMinus } from 'lucide-react';

interface WinnerModalProps {
  winner: string | null;
  open: boolean;
  onClose: () => void;
  onRemove: () => void;
}

const WinnerModal = ({ winner, open, onClose, onRemove }: WinnerModalProps) => {
  if (!open || !winner) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm animate-in fade-in duration-200"
      onClick={onClose}
    >
      <div
        className="relative bg-white rounded-2xl shadow-2xl p-8 mx-4 max-w-md w-full text-center animate-in zoom-in duration-300"
        onClick={(e) => e.stopPropagation()}
      >
        <button
          onClick={onClose}
          className="absolute top-3 right-3 flex items-center justify-center w-8 h-8 rounded-lg text-slate-400 hover:text-slate-700 hover:bg-slate-100 transition"
          aria-label="Close"
        >
          <X size={20} />
        </button>

        <div className="flex justify-center mb-4">
          <div className="relative">
            <div className="absolute inset-0 bg-amber-400/30 blur-2xl rounded-full animate-pulse" />
            <div className="relative flex items-center justify-center w-16 h-16 rounded-2xl bg-gradient-to-br from-amber-400 to-amber-500 shadow-lg">
              <Trophy size={32} className="text-amber-900" />
            </div>
          </div>
        </div>

        <p className="text-xs font-bold text-amber-600 uppercase tracking-widest mb-2">
          Winner
        </p>
        <p className="text-3xl font-extrabold text-slate-800 mb-6 break-words">
          {winner}
        </p>

        <div className="flex gap-3 justify-center">
          <button
            onClick={onRemove}
            className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-red-500 text-white font-medium text-sm hover:bg-red-600 transition active:scale-95"
          >
            <UserMinus size={16} />
            Remove
          </button>
          <button
            onClick={onClose}
            className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-slate-100 text-slate-700 font-medium text-sm hover:bg-slate-200 transition active:scale-95"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
};

export default WinnerModal;
