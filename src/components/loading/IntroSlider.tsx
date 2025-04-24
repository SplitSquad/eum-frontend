import React from 'react';
import { AnimatePresence, motion } from 'framer-motion';

interface Props {
  currentIndex: number;
  children: React.ReactNode[];
}

function IntroSlider({ currentIndex, children }: Props) {
  const isFirst = currentIndex === 0;
  return (
    <div className="w-full h-full relative overflow-hidden">
      <AnimatePresence mode="wait">
        <motion.div
          key={currentIndex} // index가 바뀌면 새 요소로 인식해 animation 적용됨
          initial={
            isFirst
              ? { opacity: 0 } // 첫 슬라이드는 x 축 이동 없이 fade-in
              : { opacity: 0, x: 100 }
          } // 들어올 때 오른쪽에서 시작
          animate={{ opacity: 1, x: 0 }} // 중앙 정위치
          exit={{ opacity: 0, x: -100 }} // 나갈 때 왼쪽으로 나감
          transition={{ duration: 0.6 }}
          className="absolute w-full h-full"
        >
          {children[currentIndex]}
        </motion.div>
      </AnimatePresence>
    </div>
  );
}

export default IntroSlider;
