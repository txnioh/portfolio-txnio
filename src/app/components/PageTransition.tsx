'use client';

import React, { useLayoutEffect, useRef } from 'react';
import { usePathname } from 'next/navigation';
import { motion, useAnimationControls } from 'framer-motion';

const BLUR_DURATION = 0.35;

export default function PageTransition({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const controls = useAnimationControls();
  const previousPathRef = useRef(pathname);

  useLayoutEffect(() => {
    if (previousPathRef.current === pathname) return;

    previousPathRef.current = pathname;
    controls.set({ filter: 'blur(10px)', opacity: 0 });
    controls.start({
      filter: 'blur(0px)',
      opacity: 1,
      transition: {
        duration: BLUR_DURATION,
        ease: [0.25, 0.1, 0.25, 1],
      },
    });
  }, [pathname, controls]);

  return (
    <motion.div
      initial={false}
      animate={controls}
      style={{ minHeight: '100%', willChange: 'filter, opacity', filter: 'blur(0px)', opacity: 1 }}
    >
      {children}
    </motion.div>
  );
}
