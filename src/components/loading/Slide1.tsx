import React from 'react';
import { motion } from 'framer-motion';

/**
 * 첫 번째 인트로 슬라이드 컴포넌트
 * 사용자 환영 메시지와 시작 안내를 표시합니다.
 */
const Slide1 = () => {
  return (
    <motion.div
      className="flex flex-col items-center justify-center w-full text-center px-6 space-y-6 mt-16"
      style={{ minHeight: '100%' }}
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.6 }}
    >
      <h2
        className="text-4xl font-bold bg-clip-text text-transparent"
        style={{
          background: 'linear-gradient(90deg, #d3d3d3 0%, #b0b0b0 100%)',
          WebkitBackgroundClip: 'text',
          color: 'transparent',
        }}
      >
        Start your journey with EUM!
      </h2>
      <p className="text-lg leading-relaxed max-w-lg" style={{ color: '#222', fontWeight: 500 }}>
        Discover Korea step by step with EUM.
        <br />
        We wish you a wonderful new journey.
      </p>
      <div
        className="w-24 h-1 rounded-full mt-4"
        style={{ background: 'linear-gradient(90deg, #d3d3d3 0%, #b0b0b0 100%)' }}
      />
    </motion.div>
  );
};

export default Slide1;
