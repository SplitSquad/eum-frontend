import React from 'react';
import { motion } from 'framer-motion';

const Slide2 = () => {
  return (
    <motion.div
      className="flex flex-col items-center justify-center h-full text-center px-6"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      transition={{ duration: 0.8 }}
    >
      <p>테스트 페이지 2</p>
      <h2 className="text-2xl font-bold text-gray-800 mb-2">정보를 불러오고 있어요...</h2>
      <p className="text-base text-gray-500">
        조금만 기다려 주세요. 이음이가 열심히 준비 중이에요!
      </p>
    </motion.div>
  );
};

export default Slide2;
