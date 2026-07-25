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
