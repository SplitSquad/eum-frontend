import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { motion } from 'framer-motion';
/**
 * 세 번째 인트로 슬라이드 컴포넌트
 * 환영 메시지와 준비 완료 상태를 표시합니다.
 */
const Slide3 = () => {
    return (_jsxs(motion.div, { className: "flex flex-col items-center justify-center w-full text-center px-6 space-y-6 mt-16", style: { minHeight: '100%' }, initial: { opacity: 0 }, animate: { opacity: 1 }, exit: { opacity: 0 }, transition: { duration: 0.6 }, children: [_jsx(motion.h2, { className: "text-4xl font-bold bg-gradient-to-r from-purple-300 to-purple-500 bg-clip-text text-transparent", animate: { scale: [1, 1.05, 1] }, transition: { duration: 2, repeat: Infinity }, children: "\uD658\uC601\uD569\uB2C8\uB2E4!" }), _jsxs("p", { className: "text-lg text-gray-600 leading-relaxed max-w-lg", children: ["\uC774\uC74C\uC774\uC640 \uD568\uAED8\uD558\uB294 \uC5EC\uC815\uC774 \uACE7 \uC2DC\uC791\uB429\uB2C8\uB2E4.", _jsx("br", {}), "\uC0C8\uB85C\uC6B4 \uACBD\uD5D8\uC744 \uC704\uD55C \uC900\uBE44\uAC00 \uC644\uB8CC\uB418\uC5C8\uC5B4\uC694."] }), _jsx(motion.div, { className: "w-32 h-32 rounded-full bg-gradient-to-r from-purple-300 to-purple-500 opacity-20", animate: {
                    scale: [1, 1.2, 1],
                    opacity: [0.2, 0.3, 0.2],
                }, transition: { duration: 2, repeat: Infinity } })] }));
};
export default Slide3;
