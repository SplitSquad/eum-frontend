import React from 'react';
import { motion } from 'framer-motion';

TODO: 이음이 애니메이션 추가 및 슬라이드 하나로 통합합


const Slide1 = () => {
  return (
    <motion.div
      className="flex flex-col items-center justify-center h-full text-center px-6"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      transition={{ duration: 0.8 }}
    >
      <p>테스트 슬라이드 페이지 1</p>
      <h2 className="text-2xl font-bold text-gray-800 mb-2">이음이와 함께 시작해요!</h2>
      <p className="text-base text-gray-500">처음 만나는 한국, 이음이와 함께 천천히 알아가요</p>
    </motion.div>
  );
};

export default Slide1;
