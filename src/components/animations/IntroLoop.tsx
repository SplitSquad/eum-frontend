// src/components/animations/IntroSlider.tsx
import React from 'react';
import { AnimatePresence, motion } from 'framer-motion';

interface Props {
  currentIndex: number;
  children: React.ReactNode[];
}

const IntroSlider = ({ currentIndex, children }: Props) => {
  return (
    <div className="w-full h-full relative overflow-hidden">
      <AnimatePresence mode="wait">
        <motion.div
          key={currentIndex}
          initial={{ opacity: 0, x: 100 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: -100 }}
          transition={{ duration: 0.6 }}
          className="absolute w-full h-full"
        >
          {children[currentIndex]}
        </motion.div>
      </AnimatePresence>
    </div>
  );
};

export default IntroSlider;
