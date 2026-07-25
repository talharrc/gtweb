import { useState, useLayoutEffect, type RefObject } from 'react';

/** Measures the actual rendered (letterboxed) box of an object-contain image inside its
 * container, so percentage-based overlays stay pixel-aligned with the artwork at any
 * viewport size. Used by the Hero, which keeps its source artwork as a real background
 * image and overlays real DOM (stats, CTAs) precisely on top of it. */
export function useContainBox(ref: RefObject<HTMLElement>, aspect: number) {
  const [box, setBox] = useState({ width: 0, height: 0, left: 0, top: 0 });
  useLayoutEffect(() => {
    const el = ref.current;
    if (!el) return;
    const update = () => {
      const cw = el.clientWidth, ch = el.clientHeight;
      if (!cw || !ch) return;
      const containerAspect = cw / ch;
      const width = containerAspect > aspect ? ch * aspect : cw;
      const height = containerAspect > aspect ? ch : cw / aspect;
      setBox({ width, height, left: (cw - width) / 2, top: (ch - height) / 2 });
    };
    update();
    const ro = new ResizeObserver(update);
    ro.observe(el);
    return () => ro.disconnect();
  }, [ref, aspect]);
  return box;
}

export function BlurredBackdrop({ src, tint }: { src: string; tint: string }) {
  return (
    <>
      <img
        src={src}
        alt=""
        aria-hidden="true"
        className="absolute inset-0 w-full h-full object-cover scale-125 blur-3xl"
      />
      <div className="absolute inset-0" style={{ background: tint, opacity: 0.45 }} />
    </>
  );
}

export type ContainBoxRect = { width: number; height: number; left: number; top: number };

/** Patches a rectangular region of the artwork (given as fractions of the contain-box) with
 * a flat fill, feathered on one edge, so a real DOM element can be overlaid in that exact
 * spot in place of whatever was baked flat into the image there (a stat number, a progress
 * bar, a toggle switch). Positioned against the measured contain-box, not the viewport, so
 * it stays pixel-aligned with the artwork at any window size. */
export function ImagePatch({
  box, left = 0, top, width = 1, height, color, feather = 'bottom',
}: {
  box: ContainBoxRect;
  left?: number;
  top: number;
  width?: number;
  height: number;
  color: string;
  feather?: 'top' | 'bottom' | 'left' | 'right' | 'none';
}) {
  if (!box.width) return null;
  const gradientDir = { top: 'to top', bottom: 'to bottom', left: 'to left', right: 'to right', none: null }[feather];
  const mask = gradientDir ? `linear-gradient(${gradientDir}, black 90%, transparent 100%)` : undefined;
  return (
    <div
      style={{
        position: 'absolute',
        left: box.left + box.width * left,
        top: box.top + box.height * top,
        width: box.width * width,
        height: box.height * height,
        background: color,
        WebkitMaskImage: mask,
        maskImage: mask,
      }}
    />
  );
}
