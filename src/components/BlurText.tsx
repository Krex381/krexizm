import { useRef } from 'react';
import { LazyMotion, m, useInView, domAnimation, type Variants } from 'framer-motion';

interface BlurTextProps {
  text: string;
  className?: string;
  delay?: number;
}

const wordVariants: Variants = {
  hidden: { opacity: 0, y: 12, filter: 'blur(8px)' },
  visible: (i: number) => ({
    opacity: 1,
    y: 0,
    filter: 'blur(0px)',
    transition: { delay: i * 0.1, duration: 0.5, ease: [0.25, 0.46, 0.45, 0.94] },
  }),
};

export default function BlurText({ text, className, delay = 0 }: BlurTextProps) {
  const ref = useRef<HTMLSpanElement>(null);
  const isInView = useInView(ref, { once: true, margin: '-100px' });

  return (
    <LazyMotion features={domAnimation} strict>
      <m.span ref={ref} className={className} initial="hidden" animate={isInView ? 'visible' : 'hidden'}>
        {text.split(' ').map((word, i) => (
          <m.span key={`${word}-${i}`} custom={delay + i} variants={wordVariants} style={{ display: 'inline-block', marginRight: '0.3em' }}>
            {word}
          </m.span>
        ))}
      </m.span>
    </LazyMotion>
  );
}
