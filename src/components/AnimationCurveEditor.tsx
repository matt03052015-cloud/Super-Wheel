import { useCallback, useRef, useState } from 'react';
import type { AnimationCurve, ControlPoint, CurvePresetName } from '@/types';
import { CURVE_PRESETS, CURVE_PRESET_LABELS } from '@/types';
import { bezierPathD, evaluateCurve } from '@/utils/bezier';

interface AnimationCurveEditorProps {
  curve: AnimationCurve;
  preset: CurvePresetName;
  onChange: (curve: AnimationCurve, preset: CurvePresetName) => void;
}

const W = 240;
const H = 160;
const PAD = 28;
const PLOT_W = W - PAD * 2;
const PLOT_H = H - PAD * 2;

function toScreen(p: ControlPoint) {
  return { x: PAD + p.x * PLOT_W, y: PAD + (1 - p.y) * PLOT_H };
}
function toData(sx: number, sy: number): ControlPoint {
  return {
    x: Math.max(0, Math.min(1, (sx - PAD) / PLOT_W)),
    y: Math.max(0, Math.min(1, 1 - (sy - PAD) / PLOT_H)),
  };
}

const PRESET_ORDER: CurvePresetName[] = [
  'linear', 'smooth', 'easeIn', 'easeOut', 'easeInOut', 'fastStart', 'realistic', 'custom',
];

const AnimationCurveEditor = ({ curve, preset, onChange }: AnimationCurveEditorProps) => {
  const svgRef = useRef<SVGSVGElement>(null);
  const [dragging, setDragging] = useState<keyof AnimationCurve | null>(null);

  const handlePointerDown = (key: keyof AnimationCurve) => (e: React.PointerEvent) => {
    e.preventDefault();
    e.stopPropagation();
    (e.target as Element).setPointerCapture(e.pointerId);
    setDragging(key);
  };

  const handlePointerMove = useCallback(
    (e: React.PointerEvent) => {
      if (!dragging || !svgRef.current) return;
      const rect = svgRef.current.getBoundingClientRect();
      const scaleX = W / rect.width;
      const scaleY = H / rect.height;
      const sx = (e.clientX - rect.left) * scaleX;
      const sy = (e.clientY - rect.top) * scaleY;
      const np = toData(sx, sy);

      const newCurve: AnimationCurve = { ...curve, [dragging]: np };
      onChange(newCurve, 'custom');
    },
    [dragging, curve, onChange],
  );

  const handlePointerUp = () => setDragging(null);

  const pathD = bezierPathD(curve, PLOT_W, PLOT_H);
  const p1s = toScreen(curve.p1);
  const p2s = toScreen(curve.p2);
  const origin = toScreen({ x: 0, y: 0 });
  const end = toScreen({ x: 1, y: 1 });

  // Speed curve (derivative approximation) for display
  const speedPoints: string[] = [];
  const N = 40;
  let prevY = 0;
  for (let i = 1; i <= N; i++) {
    const t = i / N;
    const y = evaluateCurve(t, curve);
    const speed = (y - prevY) / (1 / N);
    prevY = y;
    const px = PAD + t * PLOT_W;
    const py = PAD + PLOT_H - Math.min(1, Math.max(0, speed)) * PLOT_H;
    speedPoints.push(`${px.toFixed(1)},${py.toFixed(1)}`);
  }

  return (
    <div className="space-y-3">
      {/* Graph */}
      <div className="bg-slate-50 rounded-xl border border-slate-200 p-2">
        <svg
          ref={svgRef}
          viewBox={`0 0 ${W} ${H}`}
          className="w-full touch-none select-none"
          style={{ cursor: dragging ? 'grabbing' : 'default' }}
          onPointerMove={handlePointerMove}
          onPointerUp={handlePointerUp}
          onPointerLeave={handlePointerUp}
        >
          {/* Grid */}
          {[0, 0.25, 0.5, 0.75, 1].map((v) => (
            <line key={`h${v}`} x1={PAD} y1={PAD + v * PLOT_H} x2={PAD + PLOT_W} y2={PAD + v * PLOT_H} stroke="#E2E8F0" strokeWidth="1" />
          ))}
          {[0, 0.25, 0.5, 0.75, 1].map((v) => (
            <line key={`v${v}`} x1={PAD + v * PLOT_W} y1={PAD} x2={PAD + v * PLOT_W} y2={PAD + PLOT_H} stroke="#E2E8F0" strokeWidth="1" />
          ))}

          {/* Speed curve (faded) */}
          <polyline
            points={speedPoints.join(' ')}
            fill="none"
            stroke="#FBBF24"
            strokeWidth="1.5"
            strokeDasharray="3,3"
            opacity="0.5"
          />

          {/* Progress curve */}
          <path d={pathD} fill="none" stroke="#5B7C99" strokeWidth="2.5" />

          {/* Control lines */}
          <line x1={origin.x} y1={origin.y} x2={p1s.x} y2={p1s.y} stroke="#94A3B8" strokeWidth="1" strokeDasharray="2,2" />
          <line x1={p2s.x} y1={p2s.y} x2={end.x} y2={end.y} stroke="#94A3B8" strokeWidth="1" strokeDasharray="2,2" />

          {/* Endpoints */}
          <circle cx={origin.x} cy={origin.y} r="4" fill="#334155" />
          <circle cx={end.x} cy={end.y} r="4" fill="#334155" />

          {/* Draggable control points */}
          <circle
            cx={p1s.x}
            cy={p1s.y}
            r="7"
            fill="#fff"
            stroke="#5B7C99"
            strokeWidth="2.5"
            className="cursor-grab"
            onPointerDown={handlePointerDown('p1')}
          />
          <circle
            cx={p2s.x}
            cy={p2s.y}
            r="7"
            fill="#fff"
            stroke="#5B7C99"
            strokeWidth="2.5"
            className="cursor-grab"
            onPointerDown={handlePointerDown('p2')}
          />

          {/* Axis labels */}
          <text x={PAD + PLOT_W / 2} y={H - 4} textAnchor="middle" fontSize="9" fill="#94A3B8">Time / Progress →</text>
          <text x={8} y={PAD + PLOT_H / 2} textAnchor="middle" fontSize="9" fill="#94A3B8" transform={`rotate(-90, 8, ${PAD + PLOT_H / 2})`}>Speed / Progress</text>

          {/* Legend */}
          <line x1={PAD + 4} y1={H - 14} x2={PAD + 14} y2={H - 14} stroke="#5B7C99" strokeWidth="2" />
          <text x={PAD + 18} y={H - 11} fontSize="8" fill="#64748B">Progress</text>
          <line x1={PAD + 64} y1={H - 14} x2={PAD + 74} y2={H - 14} stroke="#FBBF24" strokeWidth="1.5" strokeDasharray="2,2" />
          <text x={PAD + 78} y={H - 11} fontSize="8" fill="#64748B">Speed</text>
        </svg>
      </div>

      <p className="text-xs text-slate-400">
        Drag the white handles to shape the curve. Yellow dashed line shows instantaneous speed.
      </p>

      {/* Preset buttons */}
      <div className="flex gap-1.5 flex-wrap">
        {PRESET_ORDER.map((name) => (
          <button
            key={name}
            onClick={() => onChange(CURVE_PRESETS[name], name)}
            className={`px-2.5 py-1.5 rounded-lg text-xs font-medium border-2 transition ${
              preset === name
                ? 'border-[#5B7C99] bg-[#5B7C99]/5 text-[#3B4D61]'
                : 'border-slate-200 text-slate-600 hover:border-slate-300'
            }`}
          >
            {CURVE_PRESET_LABELS[name]}
          </button>
        ))}
      </div>
    </div>
  );
};

export default AnimationCurveEditor;
