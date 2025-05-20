import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { motion } from 'framer-motion';
/**
 * 첫 번째 인트로 슬라이드 컴포넌트
 * 사용자 환영 메시지와 시작 안내를 표시합니다.
 */
const Slide1 = () => {
    return (_jsxs(motion.div, { className: "flex flex-col items-center justify-center w-full text-center px-6 space-y-6 mt-16", style: { minHeight: '100%' }, initial: { opacity: 0 }, animate: { opacity: 1 }, exit: { opacity: 0 }, transition: { duration: 0.6 }, children: [_jsx("h2", { className: "text-4xl font-bold bg-gradient-to-r from-pink-300 to-pink-500 bg-clip-text text-transparent", children: "\uC774\uC74C\uC774\uC640 \uD568\uAED8 \uC2DC\uC791\uD574\uC694!" }), _jsxs("p", { className: "text-lg text-gray-600 leading-relaxed max-w-lg", children: ["\uCC98\uC74C \uB9CC\uB098\uB294 \uD55C\uAD6D, \uC774\uC74C\uC774\uC640 \uD568\uAED8 \uCC9C\uCC9C\uD788 \uC54C\uC544\uAC00\uC694.", _jsx("br", {}), "\uB2F9\uC2E0\uC758 \uC0C8\uB85C\uC6B4 \uC5EC\uC815\uC744 \uC751\uC6D0\uD569\uB2C8\uB2E4."] }), _jsx("div", { className: "w-24 h-1 bg-gradient-to-r from-pink-300 to-pink-500 rounded-full mt-4" })] }));
};
export default Slide1;
