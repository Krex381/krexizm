import { useEffect, useRef } from 'react';
import { LazyMotion, m, useInView, useMotionValue, useSpring, useMotionValueEvent, domAnimation } from 'framer-motion';

interface CountUpProps {
  from?: number;
  to: number;
  duration?: number;
  className?: string;
  decimals?: number;
  suffix?: string;
}

export default function CountUp({ from = 0, to, duration = 2, className, decimals = 0, suffix = '' }: CountUpProps) {
  const ref = useRef<HTMLSpanElement>(null);
  const isInView = useInView(ref, { once: true, margin: '-100px' });
  const count = useMotionValue(from);
  const spring = useSpring(count, { duration: duration * 1000, bounce: 0 });

  useEffect(() => {
    if (isInView) {
      count.set(to);
    }
  }, [isInView, to, count]);

  useMotionValueEvent(spring, 'change', (latest) => {
    if (ref.current) {
      ref.current.textContent = `${latest.toFixed(decimals)}${suffix}`;
    }
  });

  return (
    <LazyMotion features={domAnimation} strict>
      <m.span ref={ref} className={className}>
        {from.toFixed(decimals)}{suffix}
      </m.span>
    </LazyMotion>
  );
}
