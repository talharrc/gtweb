import React, { useEffect, useRef } from 'react';
import { useMotionValue, useTransform, useInView, animate } from 'motion/react';

interface CounterProps {
  value: number;
  suffix?: string;
  decimals?: number;
}

export default function Counter({ value, suffix = "", decimals = 0 }: CounterProps) {
  const ref = useRef<HTMLSpanElement>(null);
  const inView = useInView(ref, { once: true, amount: 0.3 });
  const count = useMotionValue(0);
  const formatted = useTransform(count, (latest) => latest.toFixed(decimals));

  useEffect(() => {
    if (inView) {
      const controls = animate(count, value, {
        duration: 2.0,
        ease: [0.16, 1, 0.3, 1], // easeOutExpo
      });
      return () => controls.stop();
    }
  }, [inView, value, count]);

  useEffect(() => {
    return formatted.on('change', (latest) => {
      if (ref.current) {
        ref.current.textContent = latest + suffix;
      }
    });
  }, [formatted, suffix]);

  return <span ref={ref}>0{suffix}</span>;
}
