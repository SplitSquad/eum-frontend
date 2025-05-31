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
        className="text-4xl font-bold bg-gradient-to-r from-purple-300 to-purple-500 bg-clip-text text-transparent"
        animate={{ scale: [1, 1.05, 1] }}
        transition={{ duration: 2, repeat: Infinity }}
      >
        환영합니다!
      </motion.h2>
      <p className="text-lg text-gray-600 leading-relaxed max-w-lg">
        이음이와 함께하는 여정이 곧 시작됩니다.
        <br />
        새로운 경험을 위한 준비가 완료되었어요.
      </p>
    </motion.div>
  );
};

export default Slide3;
