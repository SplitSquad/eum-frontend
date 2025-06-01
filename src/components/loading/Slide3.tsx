import React from 'react';
import { motion } from 'framer-motion';

/**
 * 세 번째 인트로 슬라이드 컴포넌트
 * 환영 메시지와 준비 완료 상태를 표시합니다.
 */
const Slide3 = () => {
  return (
    <motion.div
      className="flex flex-col items-center justify-center w-full text-center px-6 space-y-6 mt-16"
      style={{ minHeight: '100%' }}
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.6 }}
    >
      <motion.h2
        className="text-4xl font-bold bg-clip-text text-transparent"
        style={{
          background: 'linear-gradient(90deg, #ECE9E6 0%, #B3B3B3 100%)',
          WebkitBackgroundClip: 'text',
          color: 'transparent',
        }}
        animate={{ scale: [1, 1.05, 1] }}
        transition={{ duration: 2, repeat: Infinity }}
      >
        Welcome!
      </motion.h2>
      <p className="text-lg leading-relaxed max-w-lg" style={{ color: '#222', fontWeight: 500 }}>
        Your journey with EUM is about to begin.
        <br />
        Everything is ready for your new experience.
      </p>
      <div
        className="w-24 h-1 rounded-full mt-4"
        style={{ background: 'linear-gradient(90deg, #ECE9E6 0%, #B3B3B3 100%)' }}
      />
    </motion.div>
  );
};

export default Slide3;
