import { jsx as _jsx } from "react/jsx-runtime";
import { useEffect, useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
/**
 * 인트로 슬라이더 컴포넌트
 * @param currentIndex 현재 표시할 슬라이드 인덱스
 * @param children 슬라이드 컴포넌트 배열
 */
function IntroSlider({ currentIndex, children }) {
    const isFirst = currentIndex === 0;
    const [viewportHeight, setViewportHeight] = useState('100vh');
    // 모바일 브라우저 vh 단위 이슈 해결
    useEffect(() => {
        const updateViewportHeight = () => {
            const vh = window.innerHeight * 0.01;
            document.documentElement.style.setProperty('--vh', `${vh}px`);
            setViewportHeight(`${window.innerHeight}px`);
        };
        updateViewportHeight();
        window.addEventListener('resize', updateViewportHeight);
        return () => window.removeEventListener('resize', updateViewportHeight);
    }, []);
    return (_jsx("div", { className: "w-full relative overflow-hidden", style: { minHeight: viewportHeight }, children: _jsx(AnimatePresence, { children: _jsx(motion.div, { initial: isFirst ? { opacity: 0 } : { opacity: 0, x: 100 }, animate: { opacity: 1, x: 0 }, exit: { opacity: 0, x: -100 }, transition: { duration: 0.6 }, className: "absolute w-full", style: { minHeight: viewportHeight }, children: children[currentIndex] }, currentIndex) }) }));
}
export default IntroSlider;
