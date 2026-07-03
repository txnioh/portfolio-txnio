'use client';

import React, { useLayoutEffect, useRef } from 'react';
import { usePathname } from 'next/navigation';
import { motion, useAnimationControls } from 'framer-motion';

const PAGE_TRANSITION_DURATION = 0.22;

export default function PageTransition({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const controls = useAnimationControls();
  const previousPathRef = useRef(pathname);

  useLayoutEffect(() => {
    if (previousPathRef.current === pathname) return;

    previousPathRef.current = pathname;
    controls.set({ opacity: 0 });
    controls.start({
      opacity: 1,
      transition: {
        duration: PAGE_TRANSITION_DURATION,
        ease: [0.25, 0.1, 0.25, 1],
      },
    });
  }, [pathname, controls]);

  return (
    <motion.div
      initial={false}
      animate={controls}
      style={{ minHeight: '100%', willChange: 'opacity', opacity: 1 }}
    >
      {children}
    </motion.div>
  );
}
