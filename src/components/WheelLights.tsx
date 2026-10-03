import { useEffect, useRef, useState } from 'react';
import type { LightSettings, LightPattern } from '@/types';

interface WheelLightsProps {
  settings: LightSettings;
  isSpinning: boolean;
  winnerFlash: boolean;
  centerX: number;
  centerY: number;
  radius: number;
}

const WheelLights = ({
  settings,
  isSpinning,
  winnerFlash,
  centerX,
  centerY,
  radius,
}: WheelLightsProps) => {
  const [phase, setPhase] = useState(0);
  const rafRef = useRef<number | null>(null);
  const startTimeRef = useRef(0);

  const {
    enabled, color1, color2, count, size, brightness,
    glowStrength, animationSpeed, pattern,
  } = settings;

  useEffect(() => {
    if (!enabled) return;
    if (pattern === 'static') return;

    startTimeRef.current = performance.now();

    const tick = (now: number) => {
      const elapsed = (now - startTimeRef.current) / 1000;
      setPhase(elapsed);
      rafRef.current = requestAnimationFrame(tick);
    };
    rafRef.current = requestAnimationFrame(tick);

    return () => {
      if (rafRef.current !== null) cancelAnimationFrame(rafRef.current);
    };
  }, [enabled, pattern, animationSpeed]);

  if (!enabled) return null;

  // For spinActive, only animate while spinning
  const activePattern: LightPattern =
    pattern === 'spinActive' && !isSpinning
      ? 'static'
      : pattern === 'winnerFlash' && !winnerFlash
        ? 'static'
        : pattern;

  const bulbs = Array.from({ length: count }, (_, i) => {
    const angle = (i * 360) / count;
    const rad = ((angle - 90) * Math.PI) / 180;
    const x = centerX + radius * Math.cos(rad);
    const y = centerY + radius * Math.sin(rad);

    let color = i % 2 === 0 ? color1 : color2;
    let opacity = brightness;

    const t = phase * animationSpeed;

    switch (activePattern) {
      case 'blink': {
        const blink = Math.sin(t * Math.PI * 2) > 0;
        color = blink ? color1 : color2;
        opacity = blink ? brightness : brightness * 0.3;
        break;
      }
      case 'chase': {
        const segment = 360 / count;
        const chaseAngle = (t * 60) % 360;
        const diff = Math.min(
          Math.abs(angle - chaseAngle),
          360 - Math.abs(angle - chaseAngle),
        );
        const proximity = Math.max(0, 1 - diff / (segment * 3));
        color = proximity > 0.5 ? color1 : color2;
        opacity = brightness * (0.3 + 0.7 * proximity);
        break;
      }
      case 'alternate': {
        const altPhase = Math.floor(t * 2) % 2;
        color = (i + altPhase) % 2 === 0 ? color1 : color2;
        opacity = brightness;
        break;
      }
      case 'spinActive': {
        const seg = 360 / count;
        const spinAngle = (phase * 180) % 360;
        const diff = Math.min(
          Math.abs(angle - spinAngle),
          360 - Math.abs(angle - spinAngle),
        );
        const proximity = Math.max(0, 1 - diff / (seg * 4));
        color = proximity > 0.3 ? color1 : color2;
        opacity = brightness * (0.2 + 0.8 * proximity);
        break;
      }
      case 'winnerFlash': {
        const flash = Math.sin(t * Math.PI * 6) > 0;
        color = flash ? color1 : color2;
        opacity = flash ? brightness : brightness * 0.15;
        break;
      }
      case 'static':
      default:
        break;
    }

    const filterId = `light-glow-${i}`;

    return (
      <g key={i}>
        {glowStrength > 0 && (
          <circle
            cx={x}
            cy={y}
            r={size + size * glowStrength * 3}
            fill={color}
            opacity={opacity * glowStrength * 0.3}
          />
        )}
        <circle
          cx={x}
          cy={y}
          r={size}
          fill={color}
          opacity={opacity}
          stroke={color}
          strokeWidth="0.5"
          filter={glowStrength > 0.3 ? `url(#${filterId})` : undefined}
        />
      </g>
    );
  });

  const blurAmount = size * glowStrength * 2;

  return (
    <>
      <defs>
        {glowStrength > 0.3 && (
          <filter id="light-glow-bulbs" x="-50%" y="-50%" width="200%" height="200%">
            <feGaussianBlur stdDeviation={blurAmount} result="blur" />
            <feMerge>
              <feMergeNode in="blur" />
              <feMergeNode in="SourceGraphic" />
            </feMerge>
          </filter>
        )}
      </defs>
      {bulbs}
    </>
  );
};

export default WheelLights;
