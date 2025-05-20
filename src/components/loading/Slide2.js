import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { motion } from 'framer-motion';
/**
 * 두 번째 인트로 슬라이드 컴포넌트
 * 로딩 상태와 준비 메시지를 표시합니다.
 */
const Slide2 = () => {
    return (_jsxs(motion.div, { className: "flex flex-col items-center justify-center w-full text-center px-6 space-y-6 mt-16", style: { minHeight: '100%' }, initial: { opacity: 0 }, animate: { opacity: 1 }, exit: { opacity: 0 }, transition: { duration: 0.6 }, children: [_jsx("h2", { className: "text-4xl font-bold bg-gradient-to-r from-blue-300 to-blue-500 bg-clip-text text-transparent", children: "\uC7A0\uC2DC\uB9CC \uAE30\uB2E4\uB824\uC8FC\uC138\uC694" }), _jsxs("p", { className: "text-lg text-gray-600 leading-relaxed max-w-lg", children: ["\uC774\uC74C\uC774\uAC00 \uB2F9\uC2E0\uC744 \uC704\uD55C \uCD5C\uC801\uC758 \uACBD\uD5D8\uC744 \uC900\uBE44\uD558\uACE0 \uC788\uC5B4\uC694.", _jsx("br", {}), "\uACE7 \uBA4B\uC9C4 \uC5EC\uC815\uC774 \uC2DC\uC791\uB429\uB2C8\uB2E4."] }), _jsxs("div", { className: "flex space-x-2 mt-4", children: [_jsx(motion.div, { className: "w-3 h-3 bg-blue-400 rounded-full", animate: { scale: [1, 1.2, 1] }, transition: { duration: 1, repeat: Infinity, repeatDelay: 0.2 } }), _jsx(motion.div, { className: "w-3 h-3 bg-blue-500 rounded-full", animate: { scale: [1, 1.2, 1] }, transition: { duration: 1, repeat: Infinity, repeatDelay: 0.4 } }), _jsx(motion.div, { className: "w-3 h-3 bg-blue-600 rounded-full", animate: { scale: [1, 1.2, 1] }, transition: { duration: 1, repeat: Infinity, repeatDelay: 0.6 } })] })] }));
};
export default Slide2;
