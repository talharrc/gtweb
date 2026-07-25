// Shared Framer Motion vocabulary for the homepage — one source of truth for easing,
// duration, stagger timing, and scroll-reveal viewport thresholds so sections don't
// each invent their own values.

export const EASE_OUT_EXPO = [0.16, 1, 0.3, 1] as const;

export const SPRING_SCROLL = { stiffness: 100, damping: 30 } as const;

export const DURATION = {
  fast: 0.25,
  base: 0.5,
  slow: 0.7,
} as const;

export const STAGGER_CHILD = 0.08;

// once: true — reveals play once and stay settled; replaying on every scroll-past
// is unnecessary re-render cost and reads as jittery on fast scroll.
export const VIEWPORT_DEFAULT = { once: true, amount: 0.2 } as const;

export const fadeUp = (delay = 0) => ({
  initial: { opacity: 0, y: 20 },
  whileInView: { opacity: 1, y: 0 },
  viewport: VIEWPORT_DEFAULT,
  transition: { duration: DURATION.base, delay, ease: EASE_OUT_EXPO },
});
