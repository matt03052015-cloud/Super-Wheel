/**
 * Strong ease-out cubic: starts fast, decelerates smoothly.
 * t=0 → 0, t=1 → 1
 */
export function easeOutCubic(t: number): number {
  return 1 - Math.pow(1 - t, 3);
}

/**
 * Even stronger ease-out (quintic) for a more dramatic deceleration.
 */
export function easeOutQuint(t: number): number {
  return 1 - Math.pow(1 - t, 5);
}

/**
 * Three-phase easing: acceleration → constant → deceleration.
 * - accelPhase: fraction of duration spent accelerating (0..1)
 * - decelPhase: fraction of duration spent decelerating (0..1)
 * - remainder is constant-speed
 *
 * Returns normalized progress 0..1 given t 0..1.
 */
export function easeThreePhase(
  t: number,
  accelPhase = 0.15,
  decelPhase = 0.65,
): number {
  const decelStart = 1 - decelPhase;
  if (t < accelPhase) {
    // Acceleration: ease-in quad
    const lt = t / accelPhase;
    return 0.5 * lt * lt * accelPhase;
  }
  if (t < decelStart) {
    // Constant speed
    const accelEnd = 0.5 * accelPhase;
    const constStart = accelPhase;
    const constFrac = (t - constStart) / (decelStart - constStart);
    return accelEnd + constFrac * (decelStart - accelEnd);
  }
  // Deceleration: strong ease-out
  const accelEnd = 0.5 * accelPhase;
  const constEnd = decelStart;
  const dt = (t - decelStart) / decelPhase;
  const eased = 1 - Math.pow(1 - dt, 4);
  return constEnd + eased * (1 - constEnd);
}
