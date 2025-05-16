import React from 'react';
import { motion } from 'framer-motion';

/**
 * 첫 번째 인트로 슬라이드 컴포넌트
 * 사용자 환영 메시지와 시작 안내를 표시합니다.
 */
const Slide1 = () => {
  return (
    <motion.div
      className="flex flex-col items-center justify-center w-full text-center px-6 space-y-6 min-h-screen"
      style={{ minHeight: 'calc(var(--vh, 1vh) * 100)' }}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      transition={{ duration: 0.8 }}
    >
      <h2 className="text-4xl font-bold bg-gradient-to-r from-pink-300 to-pink-500 bg-clip-text text-transparent">
        이음이와 함께 시작해요!
      </h2>
      <p className="text-lg text-gray-600 leading-relaxed max-w-lg">
        처음 만나는 한국, 이음이와 함께 천천히 알아가요.
        <br />
        당신의 새로운 여정을 응원합니다.
      </p>
      <div className="w-24 h-1 bg-gradient-to-r from-pink-300 to-pink-500 rounded-full mt-4" />
    </motion.div>
  );
};

export default Slide1;
