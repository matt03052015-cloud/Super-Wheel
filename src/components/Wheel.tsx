import { useCallback, useEffect, useRef } from 'react';
import { COLOR_PALETTES, type AppearanceSettings, type SpinConfig } from '@/types';
import { evaluateCurve } from '@/utils/bezier';
import { playTick, playWin } from '@/utils/sound';
import WheelLights from '@/components/WheelLights';

interface WheelProps {
  names: string[];
  appearance: AppearanceSettings;
  spinConfig: SpinConfig;
  onWinner: (winner: string) => void;
  spinTrigger: number;
  spinningRef: React.MutableRefObject<boolean>;
  winnerFlash: boolean;
}

const VIEWBOX = 500;
const CENTER = VIEWBOX / 2;
const RADIUS = CENTER - 36;

function getColor(palette: string[], index: number): string {
  return palette[index % palette.length];
}

function truncate(text: string, maxLen: number): string {
  if (text.length <= maxLen) return text;
  return text.slice(0, maxLen - 1) + '…';
}

const Wheel = ({
  names,
  appearance,
  spinConfig,
  onWinner,
  spinTrigger,
  spinningRef,
  winnerFlash,
}: WheelProps) => {
  const rotationRef = useRef(0);
  const wheelRef = useRef<SVGGElement>(null);
  const animFrameRef = useRef<number | null>(null);
  const lastSegmentRef = useRef(-1);

  const palette = COLOR_PALETTES[appearance.colorPalette] ?? COLOR_PALETTES.classic;
  const count = names.length;
  const segmentAngle = count > 0 ? 360 / count : 360;

  const { border, lights } = appearance;

  const computeFontSize = useCallback(
    (n: number) => {
      const base = appearance.fontSize;
      if (n <= 4) return base + 6;
      if (n <= 8) return base + 3;
      if (n <= 16) return base;
      if (n <= 24) return base - 2;
      if (n <= 36) return base - 4;
      return base - 6;
    },
    [appearance.fontSize],
  );

  // Build segments
  const segments: { path: string; name: string; color: string }[] = [];
  if (count === 0) {
    segments.push({
      path: `M ${CENTER} ${CENTER} L ${CENTER} ${CENTER - RADIUS} A ${RADIUS} ${RADIUS} 0 1 1 ${CENTER - 0.01} ${CENTER - RADIUS} Z`,
      name: '',
      color: '#DEE2E6',
    });
  } else if (count === 1) {
    segments.push({
      path: `M ${CENTER} ${CENTER} m ${-RADIUS} 0 a ${RADIUS} ${RADIUS} 0 1 0 ${RADIUS * 2} 0 a ${RADIUS} ${RADIUS} 0 1 0 ${-RADIUS * 2} 0 Z`,
      name: names[0],
      color: getColor(palette, 0),
    });
  } else {
    for (let i = 0; i < count; i++) {
      const startAngle = i * segmentAngle - 90;
      const endAngle = (i + 1) * segmentAngle - 90;
      const startRad = (startAngle * Math.PI) / 180;
      const endRad = (endAngle * Math.PI) / 180;
      const x1 = CENTER + RADIUS * Math.cos(startRad);
      const y1 = CENTER + RADIUS * Math.sin(startRad);
      const x2 = CENTER + RADIUS * Math.cos(endRad);
      const y2 = CENTER + RADIUS * Math.sin(endRad);
      const largeArc = segmentAngle > 180 ? 1 : 0;
      segments.push({
        path: `M ${CENTER} ${CENTER} L ${x1} ${y1} A ${RADIUS} ${RADIUS} 0 ${largeArc} 1 ${x2} ${y2} Z`,
        name: names[i],
        color: getColor(palette, i),
      });
    }
  }

  const fs = computeFontSize(count);

  const applyRotation = useCallback((deg: number) => {
    if (wheelRef.current) {
      wheelRef.current.style.transform = `rotate(${deg}deg)`;
    }
  }, []);

  const getSegmentAtPointer = useCallback(
    (deg: number) => {
      if (count === 0) return -1;
      const norm = ((deg % 360) + 360) % 360;
      const pointerAngle = (360 - norm) % 360;
      return Math.floor(pointerAngle / segmentAngle) % count;
    },
    [count, segmentAngle],
  );

  const stopAnim = useCallback(() => {
    if (animFrameRef.current !== null) {
      cancelAnimationFrame(animFrameRef.current);
      animFrameRef.current = null;
    }
  }, []);

  useEffect(() => {
    if (spinTrigger === 0) return;
    if (count === 0) return;
    if (spinningRef.current) return;

    spinningRef.current = true;
    stopAnim();

    const { spinDuration, rotations, settleAmount, soundEnabled, speed, curve } = spinConfig;
    const winnerIndex = Math.floor(Math.random() * count);
    const totalRotation = rotations * 360;
    const winnerCenter = (winnerIndex + 0.5) * segmentAngle;
    const randomOffset = (Math.random() - 0.5) * segmentAngle * 0.7;
    const desiredNorm = (360 - winnerCenter - randomOffset + 360) % 360;
    const currentNorm = ((rotationRef.current % 360) + 360) % 360;
    let deltaToTarget = desiredNorm - currentNorm;
    if (deltaToTarget < 0) deltaToTarget += 360;
    const finalRotation = rotationRef.current + totalRotation + deltaToTarget;

    const startRotation = rotationRef.current;
    const totalDelta = finalRotation - startRotation;
    const durationMs = (spinDuration * 1000) / Math.max(0.5, Math.min(2, speed));
    const startTime = performance.now();
    lastSegmentRef.current = getSegmentAtPointer(startRotation);

    const animate = (now: number) => {
      const elapsed = now - startTime;
      const t = Math.min(elapsed / durationMs, 1);
      const eased = evaluateCurve(t, curve);
      const current = startRotation + totalDelta * eased;
      rotationRef.current = current;
      applyRotation(current);

      if (soundEnabled) {
        const seg = getSegmentAtPointer(current);
        if (seg !== lastSegmentRef.current) {
          lastSegmentRef.current = seg;
          const vol = 0.08 + 0.22 * (1 - t);
          playTick(vol);
        }
      }

      if (t < 1) {
        animFrameRef.current = requestAnimationFrame(animate);
      } else {
        settlePhase();
      }
    };

    const settlePhase = () => {
      const settleStart = rotationRef.current;
      const settleDelta = settleAmount;
      const settleDuration = 400;
      const settleStartTime = performance.now();

      const settleAnim = (now: number) => {
        const elapsed = now - settleStartTime;
        const t = Math.min(elapsed / settleDuration, 1);
        const eased = 1 - Math.pow(1 - t, 3);
        const overshoot = settleDelta * Math.sin(eased * Math.PI);
        const current = settleStart + overshoot;
        rotationRef.current = current;
        applyRotation(current);

        if (t < 1) {
          animFrameRef.current = requestAnimationFrame(settleAnim);
        } else {
          rotationRef.current = startRotation + totalDelta;
          applyRotation(rotationRef.current);
          stopAnim();
          spinningRef.current = false;

          if (soundEnabled) playWin(0.4);

          const finalSeg = getSegmentAtPointer(rotationRef.current);
          const winnerName = names[finalSeg] ?? names[winnerIndex];
          onWinner(winnerName);
        }
      };
      animFrameRef.current = requestAnimationFrame(settleAnim);
    };

    animFrameRef.current = requestAnimationFrame(animate);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [spinTrigger]);

  useEffect(() => stopAnim, [stopAnim]);

  // Border style dash pattern
  const dashArray =
    border.style === 'dashed' ? `${border.thickness * 2} ${border.thickness}` :
    border.style === 'dotted' ? `${border.thickness * 0.5} ${border.thickness}` :
    border.style === 'double' ? undefined :
    undefined;

  const lightRadius = CENTER - 14;

  // Build shadow filter
  const shadowFilterId = border.shadowEnabled ? 'wheel-shadow' : undefined;
  const glowFilterId = border.glowEnabled ? 'border-glow' : undefined;

  return (
    <div className="relative flex items-center justify-center w-full select-none">
      {/* Triangle pointer */}
      <div
        className="absolute z-30 pointer-events-none"
        style={{ top: '-2%', left: '50%', transform: 'translateX(-50%)' }}
      >
        <svg width="46" height="60" viewBox="0 0 46 60">
          <defs>
            <linearGradient id="ptrGrad" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#334155" />
              <stop offset="100%" stopColor="#0F172A" />
            </linearGradient>
          </defs>
          <path
            d="M 23 58 L 4 6 Q 23 -2 42 6 Z"
            fill="url(#ptrGrad)"
            stroke="#fff"
            strokeWidth="3"
            strokeLinejoin="round"
          />
          <circle cx="23" cy="12" r="5" fill="#fff" />
          <circle cx="23" cy="12" r="2.5" fill="#334155" />
        </svg>
      </div>

      <div className="relative" style={{ width: 'min(92vw, 520px)', aspectRatio: '1 / 1' }}>
        <svg viewBox={`0 0 ${VIEWBOX} ${VIEWBOX}`} className="w-full h-full" style={{ overflow: 'visible' }}>
          <defs>
            {border.shadowEnabled && (
              <filter id={shadowFilterId!} x="-30%" y="-30%" width="160%" height="160%">
                <feDropShadow
                  dx="0"
                  dy="0"
                  stdDeviation={border.shadowBlur / 3}
                  floodColor="#000000"
                  floodOpacity={border.shadowIntensity}
                />
              </filter>
            )}
            {border.glowEnabled && (
              <filter id={glowFilterId!} x="-50%" y="-50%" width="200%" height="200%">
                <feGaussianBlur stdDeviation={border.glowSize / 3} result="blur" />
                <feFlood floodColor={border.glowColor} floodOpacity={border.glowIntensity} result="color" />
                <feComposite in="color" in2="blur" operator="in" result="glow" />
                <feMerge>
                  <feMergeNode in="glow" />
                  <feMergeNode in="SourceGraphic" />
                </feMerge>
              </filter>
            )}
          </defs>

          {/* Outer fill disc (background for border) */}
          <circle
            cx={CENTER}
            cy={CENTER}
            r={CENTER - 4}
            fill={border.color}
            opacity={border.opacity}
            filter={shadowFilterId}
          />

          {/* Outer border ring */}
          {border.thickness > 0 && (
            <circle
              cx={CENTER}
              cy={CENTER}
              r={CENTER - 4 - border.thickness / 2}
              fill="none"
              stroke={border.color}
              strokeWidth={border.thickness}
              strokeDasharray={dashArray}
              opacity={border.opacity}
              filter={glowFilterId}
            />
          )}

          {/* Inner border */}
          {border.innerBorderEnabled && border.innerBorderThickness > 0 && (
            <circle
              cx={CENTER}
              cy={CENTER}
              r={RADIUS + 4 + border.innerBorderThickness / 2}
              fill="none"
              stroke={border.innerBorderColor}
              strokeWidth={border.innerBorderThickness}
            />
          )}

          {/* Inner shadow ring (gap between border and segments) */}
          <circle cx={CENTER} cy={CENTER} r={RADIUS + 3} fill="#0F172A" />

          {/* Lights around the rim */}
          <WheelLights
            settings={lights}
            isSpinning={spinningRef.current}
            winnerFlash={winnerFlash}
            centerX={CENTER}
            centerY={CENTER}
            radius={lightRadius}
          />

          {/* Rotating wheel group */}
          <g ref={wheelRef} style={{ transformOrigin: 'center', transition: 'none' }}>
            {segments.map((seg, i) => {
              const midAngle = count <= 1 ? 0 : i * segmentAngle + segmentAngle / 2 - 90;
              const midRad = (midAngle * Math.PI) / 180;
              const textRadius = RADIUS * 0.63;
              const tx = CENTER + textRadius * Math.cos(midRad);
              const ty = CENTER + textRadius * Math.sin(midRad);
              const textRotation = midAngle + 90;

              return (
                <g key={i}>
                  <path
                    d={seg.path}
                    fill={seg.color}
                    stroke="rgba(255,255,255,0.2)"
                    strokeWidth="1.5"
                  />
                  {seg.name && (
                    <text
                      x={tx}
                      y={ty}
                      fill={appearance.textColor}
                      fontSize={fs}
                      fontWeight={appearance.fontWeight}
                      textAnchor="middle"
                      dominantBaseline="central"
                      transform={`rotate(${textRotation}, ${tx}, ${ty})`}
                      style={{
                        pointerEvents: 'none',
                        userSelect: 'none',
                        fontFamily: 'Inter, sans-serif',
                      }}
                    >
                      {truncate(seg.name, count > 24 ? 10 : count > 12 ? 16 : 22)}
                    </text>
                  )}
                </g>
              );
            })}
          </g>

          {/* Center hub */}
          <circle cx={CENTER} cy={CENTER} r="28" fill="#1E293B" stroke="#fff" strokeWidth="4" />
          <circle cx={CENTER} cy={CENTER} r="10" fill="#fff" />
        </svg>
      </div>
    </div>
  );
};

export default Wheel;
