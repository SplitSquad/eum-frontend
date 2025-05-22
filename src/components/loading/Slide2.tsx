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
      <h2 className="text-4xl font-bold bg-gradient-to-r from-blue-300 to-blue-500 bg-clip-text text-transparent">
        잠시만 기다려주세요
      </h2>
      <p className="text-lg text-gray-600 leading-relaxed max-w-lg">
        이음이가 당신을 위한 최적의 경험을 준비하고 있어요.
        <br />곧 멋진 여정이 시작됩니다.
      </p>
      <div className="flex space-x-2 mt-4">
        <motion.div
          className="w-3 h-3 bg-blue-400 rounded-full"
          animate={{ scale: [1, 1.2, 1] }}
          transition={{ duration: 1, repeat: Infinity, repeatDelay: 0.2 }}
        />
        <motion.div
          className="w-3 h-3 bg-blue-500 rounded-full"
          animate={{ scale: [1, 1.2, 1] }}
          transition={{ duration: 1, repeat: Infinity, repeatDelay: 0.4 }}
        />
        <motion.div
          className="w-3 h-3 bg-blue-600 rounded-full"
          animate={{ scale: [1, 1.2, 1] }}
          transition={{ duration: 1, repeat: Infinity, repeatDelay: 0.6 }}
        />
      </div>
    </motion.div>
  );
};

export default Slide2;
