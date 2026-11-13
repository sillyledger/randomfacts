export const SWIPE_DISTANCE = 80; // px of finger travel that completes a swipe
export const SWIPE_VELOCITY = 500; // px/s, a flick that completes a shorter swipe

// Which way a finished drag swiped: 'left' when the finger moved right to left, 'right' when it moved left to right,
// null for a short, slow drag that should spring back. `offsetX` and `velocityX` come from Framer's PanInfo;
// `durationMs` is the time since the finger touched down.
//
// The direction always comes from where the finger went. Framer's release velocity can point the other way at the
// end of a quick flick on iPhone (the finger rolls back as it lifts, and the first point is timed by the last
// animation frame), which used to turn short left flicks into right swipes. So it only counts when it agrees with
// the finger, and the finger's average speed over the whole drag also counts as a flick.
export function swipeDirection(offsetX: number, velocityX: number, durationMs: number): 'left' | 'right' | null {
  if (offsetX === 0) return null;
  const direction = offsetX < 0 ? 'left' : 'right';
  const distance = Math.abs(offsetX);
  const releaseSpeed = direction === 'left' ? -velocityX : velocityX;
  const averageSpeed = durationMs > 0 ? (distance / durationMs) * 1000 : 0;
  return distance > SWIPE_DISTANCE || releaseSpeed > SWIPE_VELOCITY || averageSpeed > SWIPE_VELOCITY ? direction : null;
}
