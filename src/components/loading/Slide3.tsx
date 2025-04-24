import React from 'react';
import { motion } from 'framer-motion';

const Slide3 = () => {
  return (
    <motion.div
      className="flex flex-col items-center justify-center h-full text-center px-6"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      transition={{ duration: 0.8 }}
    >
      <p>테스트 페이지 3</p>
      <h2 className="text-2xl font-bold text-gray-800 mb-2">곧 만나요!</h2>
      <p className="text-base text-gray-500">
        이제 준비가 거의 끝났어요. 로그인 화면으로 이동합니다
      </p>
    </motion.div>
  );
};

export default Slide3;
