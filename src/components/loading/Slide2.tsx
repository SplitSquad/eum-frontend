import React from 'react';
import { motion } from 'framer-motion';

/**
 * 두 번째 인트로 슬라이드 컴포넌트
 * 로딩 상태와 준비 메시지를 표시합니다.
 */
const Slide2 = () => {
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
          background: 'linear-gradient(90deg, #6B4F27 0%, #A67C52 100%)',
          WebkitBackgroundClip: 'text',
          color: 'transparent',
        }}
      >
        Please wait a moment
      </h2>
      <p className="text-lg leading-relaxed max-w-lg" style={{ color: '#222', fontWeight: 500 }}>
        EUM is preparing the best experience for you.
        <br />
        Your amazing journey will begin soon.
      </p>
      <div
        className="w-24 h-1 rounded-full mt-4"
        style={{ background: 'linear-gradient(90deg, #6B4F27 0%, #A67C52 100%)' }}
      />
    </motion.div>
  );
};

export default Slide2;
