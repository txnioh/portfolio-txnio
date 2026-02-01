'use client';

import React from 'react';
import { usePathname } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';

const BLUR_DURATION = 0.35;

export default function PageTransition({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();

  return (
    <AnimatePresence mode="wait">
      <motion.div
        key={pathname}
        initial={{
          filter: 'blur(12px)',
          opacity: 0,
        }}
        animate={{
          filter: 'blur(0px)',
          opacity: 1,
        }}
        exit={{
          filter: 'blur(12px)',
          opacity: 0,
        }}
        transition={{
          duration: BLUR_DURATION,
          ease: [0.25, 0.1, 0.25, 1],
        }}
        style={{ minHeight: '100%' }}
      >
        {children}
      </motion.div>
    </AnimatePresence>
  );
}
