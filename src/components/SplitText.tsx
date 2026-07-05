import { useRef } from 'react';
import { LazyMotion, m, useInView, domAnimation, type Variants } from 'framer-motion';

interface SplitTextProps {
  text: string;
  className?: string;
  delay?: number;
}

const charVariants: Variants = {
  hidden: { opacity: 0, y: 20, filter: 'blur(4px)' },
  visible: (i: number) => ({
    opacity: 1,
    y: 0,
    filter: 'blur(0px)',
    transition: { delay: i * 0.03, duration: 0.4, ease: [0.25, 0.46, 0.45, 0.94] },
  }),
};

export default function SplitText({ text, className, delay = 0 }: SplitTextProps) {
  const ref = useRef<HTMLSpanElement>(null);
  const isInView = useInView(ref, { once: true, margin: '-100px' });

  return (
    <LazyMotion features={domAnimation} strict>
      <m.span ref={ref} className={className} initial="hidden" animate={isInView ? 'visible' : 'hidden'}>
        {text.split('').map((char, i) => (
          <m.span key={`${char}-${i}`} custom={delay + i} variants={charVariants} style={{ display: 'inline-block', whiteSpace: char === ' ' ? 'pre' : undefined }}>
            {char}
          </m.span>
        ))}
      </m.span>
    </LazyMotion>
  );
}
