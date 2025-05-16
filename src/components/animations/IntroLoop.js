import { jsx as _jsx } from "react/jsx-runtime";
import { AnimatePresence, motion } from 'framer-motion';
const IntroSlider = ({ currentIndex, children }) => {
    return (_jsx("div", { className: "w-full h-full relative overflow-hidden", children: _jsx(AnimatePresence, { mode: "wait", children: _jsx(motion.div, { initial: { opacity: 0, x: 100 }, animate: { opacity: 1, x: 0 }, exit: { opacity: 0, x: -100 }, transition: { duration: 0.6 }, className: "absolute w-full h-full", children: children[currentIndex] }, currentIndex) }) }));
};
export default IntroSlider;
