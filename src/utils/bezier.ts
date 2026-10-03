import type { AnimationCurve, ControlPoint } from '@/types';

/**
 * Solve a cubic bezier for a given t (parameter 0..1) using Newton-Raphson
 * with bisection fallback. Returns the y-value of the curve (progress 0..1).
 *
 * The bezier has fixed endpoints P0=(0,0) and P3=(1,1) and two user-controlled
 * control points P1=(p1.x, p1.y) and P2=(p2.x, p2.y).
 *
 * We solve for the x-dimension first (find parameter `s` where X(s) = targetX),
 * then evaluate Y(s).
 */
function bezierComponent(s: number, p0: number, p1: number, p2: number, p3: number): number {
  const u = 1 - s;
  return u * u * u * p0 + 3 * u * u * s * p1 + 3 * u * s * s * p2 + s * s * s * p3;
}

const X_P0 = 0;
const X_P3 = 1;

function solveForX(targetX: number, cx1: number, cx2: number): number {
  let s = targetX; // good initial guess for monotonic curves
  for (let i = 0; i < 8; i++) {
    const xVal = bezierComponent(s, X_P0, cx1, cx2, X_P3);
    const dx = xVal - targetX;
    if (Math.abs(dx) < 1e-6) return s;

    // Approximate derivative of X w.r.t. s
    const ddx = 3 * (1 - s) * (1 - s) * (cx1 - X_P0) +
      6 * (1 - s) * s * (cx2 - cx1) +
      3 * s * s * (X_P3 - cx2);
    if (Math.abs(ddx) < 1e-6) break;
    s = s - dx / ddx;
    if (s < 0) s = 0;
    if (s > 1) s = 1;
  }

  // Bisection fallback if Newton didn't converge
  let lo = 0;
  let hi = 1;
  for (let i = 0; i < 30; i++) {
    s = (lo + hi) / 2;
    const xVal = bezierComponent(s, X_P0, cx1, cx2, X_P3);
    if (Math.abs(xVal - targetX) < 1e-6) return s;
    if (xVal < targetX) lo = s;
    else hi = s;
  }
  return s;
}

/**
 * Evaluate the cubic bezier progress curve at time fraction t (0..1).
 * Returns progress 0..1 — use this to interpolate the total rotation delta.
 */
export function evaluateCurve(t: number, curve: AnimationCurve): number {
  if (t <= 0) return 0;
  if (t >= 1) return 1;

  const cx1 = Math.max(0, Math.min(1, curve.p1.x));
  const cx2 = Math.max(0, Math.min(1, curve.p2.x));
  const s = solveForX(t, cx1, cx2);
  const y = bezierComponent(s, 0, curve.p1.y, curve.p2.y, 1);
  return Math.max(0, y);
}

/**
 * Given two control points, compute the midpoint for rendering the curve path.
 */
export function bezierPathD(curve: AnimationCurve, w: number, h: number): string {
  const p0: ControlPoint = { x: 0, y: 0 };
  const p3: ControlPoint = { x: 1, y: 1 };
  const toPx = (p: ControlPoint) => ({ x: p.x * w, y: h - p.y * h });
  const a = toPx(p0);
  const b = toPx(curve.p1);
  const c = toPx(curve.p2);
  const d = toPx(p3);
  return `M ${a.x} ${a.y} C ${b.x} ${b.y} ${c.x} ${c.y} ${d.x} ${d.y}`;
}
