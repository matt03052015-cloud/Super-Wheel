export interface NameEntry {
  id: string;
  text: string;
}

// ---- Branding ----

export type LogoIcon =
  | 'dice' | 'wheel' | 'trophy' | 'sparkles'
  | 'target' | 'star' | 'crown' | 'compass' | 'none';

export interface BrandingSettings {
  title: string;
  subtitle: string;
  logoIcon: LogoIcon;
  showTitle: boolean;
  showSubtitle: boolean;
  titleFontSize: number;
  titleFontWeight: number;
  titleAlignment: 'left' | 'center' | 'right';
  titleColor: string;
  subtitleColor: string;
  accentColor: string;
}

export const LOGO_ICON_LABELS: Record<LogoIcon, string> = {
  dice: 'Dice',
  wheel: 'Wheel',
  trophy: 'Trophy',
  sparkles: 'Sparkles',
  target: 'Target',
  star: 'Star',
  crown: 'Crown',
  compass: 'Compass',
  none: 'None',
};

export const DEFAULT_BRANDING: BrandingSettings = {
  title: 'Super Wheel',
  subtitle: 'Random name picker',
  logoIcon: 'dice',
  showTitle: true,
  showSubtitle: false,
  titleFontSize: 18,
  titleFontWeight: 700,
  titleAlignment: 'left',
  titleColor: '#ffffff',
  subtitleColor: '#94A3B8',
  accentColor: '#FBBF24',
};

export interface SpinHistoryEntry {
  id: string;
  winner: string;
  timestamp: number;
}

// ---- Animation curve ----

export interface ControlPoint {
  x: number;
  y: number;
}

export interface AnimationCurve {
  // Two cubic bezier control points for a CSS-like cubic-bezier(x1,y1,x2,y2)
  // mapped to a progress curve from (0,0) to (1,1)
  p1: ControlPoint;
  p2: ControlPoint;
}

export type CurvePresetName =
  | 'linear'
  | 'smooth'
  | 'easeIn'
  | 'easeOut'
  | 'easeInOut'
  | 'fastStart'
  | 'realistic'
  | 'custom';

export const CURVE_PRESETS: Record<CurvePresetName, AnimationCurve> = {
  linear:      { p1: { x: 1, y: 0 }, p2: { x: 0, y: 1 } },
  smooth:      { p1: { x: 0.42, y: 0 }, p2: { x: 0.58, y: 1 } },
  easeIn:      { p1: { x: 0.42, y: 0 }, p2: { x: 1, y: 1 } },
  easeOut:     { p1: { x: 0, y: 0 }, p2: { x: 0.58, y: 1 } },
  easeInOut:   { p1: { x: 0.42, y: 0 }, p2: { x: 0.58, y: 1 } },
  fastStart:   { p1: { x: 0.05, y: 0.8 }, p2: { x: 0.3, y: 1 } },
  realistic:   { p1: { x: 0.12, y: 0.6 }, p2: { x: 0.75, y: 1 } },
  custom:      { p1: { x: 0.25, y: 0.1 }, p2: { x: 0.75, y: 0.9 } },
};

export const CURVE_PRESET_LABELS: Record<CurvePresetName, string> = {
  linear: 'Linear',
  smooth: 'Smooth',
  easeIn: 'Ease In',
  easeOut: 'Ease Out',
  easeInOut: 'Ease In Out',
  fastStart: 'Fast Start',
  realistic: 'Realistic Wheel',
  custom: 'Custom',
};

// ---- Border settings ----

export interface BorderSettings {
  thickness: number;
  color: string;
  opacity: number;      // 0..1
  style: 'solid' | 'dashed' | 'dotted' | 'double';
  glowEnabled: boolean;
  glowColor: string;
  glowIntensity: number; // 0..1
  glowSize: number;      // px
  innerBorderEnabled: boolean;
  innerBorderThickness: number;
  innerBorderColor: string;
  shadowEnabled: boolean;
  shadowIntensity: number; // 0..1
  shadowBlur: number;      // px
}

export const DEFAULT_BORDER: BorderSettings = {
  thickness: 8,
  color: '#1E293B',
  opacity: 1,
  style: 'solid',
  glowEnabled: false,
  glowColor: '#FBBF24',
  glowIntensity: 0.6,
  glowSize: 20,
  innerBorderEnabled: false,
  innerBorderThickness: 3,
  innerBorderColor: '#334155',
  shadowEnabled: true,
  shadowIntensity: 0.4,
  shadowBlur: 30,
};

// ---- Light settings ----

export type LightPattern = 'static' | 'blink' | 'chase' | 'alternate' | 'spinActive' | 'winnerFlash';

export interface LightSettings {
  enabled: boolean;
  color1: string;
  color2: string;
  count: number;
  size: number;
  brightness: number;     // 0..1
  glowStrength: number;   // 0..1
  animationSpeed: number; // 0.5..5 (Hz)
  pattern: LightPattern;
}

export const DEFAULT_LIGHTS: LightSettings = {
  enabled: true,
  color1: '#FEF3C7',
  color2: '#FDE68A',
  count: 24,
  size: 5,
  brightness: 0.8,
  glowStrength: 0.5,
  animationSpeed: 2,
  pattern: 'static',
};

export const LIGHT_PATTERN_LABELS: Record<LightPattern, string> = {
  static: 'Static',
  blink: 'Blinking',
  chase: 'Chasing',
  alternate: 'Alternating',
  spinActive: 'Spin Active',
  winnerFlash: 'Winner Flash',
};

// ---- Winner settings ----

export type AutoRemoveMode = 'off' | 'ask' | 'always';

export interface WinnerSettings {
  autoRemove: AutoRemoveMode;
  winnerFlashLights: boolean;
  winnerSound: boolean;
  popupDuration: number; // seconds, 0 = manual close only
}

export const DEFAULT_WINNER: WinnerSettings = {
  autoRemove: 'off',
  winnerFlashLights: true,
  winnerSound: true,
  popupDuration: 0,
};

// ---- Spin config ----

export interface SpinConfig {
  spinDuration: number;
  rotations: number;
  settleAmount: number;
  soundEnabled: boolean;
  speed: number; // multiplier 0.5..2
  curve: AnimationCurve;
  curvePreset: CurvePresetName;
}

export const DEFAULT_SPIN_CONFIG: SpinConfig = {
  spinDuration: 7,
  rotations: 12,
  settleAmount: 0.5,
  soundEnabled: true,
  speed: 1,
  curve: CURVE_PRESETS.realistic,
  curvePreset: 'realistic',
};

// ---- Appearance ----

export interface AppearanceSettings {
  colorPalette: string;
  textColor: string;
  fontSize: number;
  fontWeight: number;
  border: BorderSettings;
  lights: LightSettings;
}

export const DEFAULT_APPEARANCE: AppearanceSettings = {
  colorPalette: 'classic',
  textColor: '#ffffff',
  fontSize: 15,
  fontWeight: 700,
  border: DEFAULT_BORDER,
  lights: DEFAULT_LIGHTS,
};

// ---- Color palettes ----

export const COLOR_PALETTES: Record<string, string[]> = {
  classic: [
    '#E63946', '#F4A261', '#E9C46A', '#2A9D8F',
    '#264653', '#457B9D', '#A8DADC', '#F1FAEE',
    '#E76F51', '#F6BD60', '#84A59D', '#F28482',
  ],
  vivid: [
    '#EF4444', '#F97316', '#F59E0B', '#EAB308',
    '#84CC16', '#22C55E', '#10B981', '#14B8A6',
    '#06B6D4', '#0EA5E9', '#3B82F6', '#6366F1',
  ],
  ocean: [
    '#0EA5E9', '#06B6D4', '#0891B2', '#0E7490',
    '#155E75', '#1E40AF', '#1E3A8A', '#312E81',
    '#1F2937', '#0F172A', '#075985', '#0369A1',
  ],
  sunset: [
    '#F97316', '#EA580C', '#F59E0B', '#DC2626',
    '#EF4444', '#E11D48', '#BE185D', '#9D174D',
    '#FB923C', '#FBBF24', '#FDE047', '#FCA5A5',
  ],
  forest: [
    '#22C55E', '#16A34A', '#15803D', '#14532D',
    '#84CC16', '#A3E635', '#65A30D', '#4D7C0F',
    '#10B981', '#059669', '#047857', '#065F46',
  ],
  pastel: [
    '#F9A8D4', '#FBCFE8', '#DDD6FE', '#BFDBFE',
    '#A7F3D0', '#BBF7D0', '#FDE68A', '#FED7AA',
    '#FECACA', '#FECDD3', '#E0E7FF', '#C7D2FE',
  ],
};

export const PALETTE_NAMES: Record<string, string> = {
  classic: 'Classic',
  vivid: 'Vivid',
  ocean: 'Ocean',
  sunset: 'Sunset',
  forest: 'Forest',
  pastel: 'Pastel',
};
