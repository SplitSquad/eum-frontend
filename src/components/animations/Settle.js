import { jsx as _jsx } from "react/jsx-runtime";
import { useRef } from 'react';
import LottieSettle from '@/assets/animations/lottie/settle.json';
import Lottie from 'lottie-react';
const Settle = () => {
    const lottieRef = useRef(null);
    const handleMouseEnter = () => {
        lottieRef.current?.stop();
    };
    const handleMouseLeave = () => {
        lottieRef.current?.play();
    };
    return (_jsx("div", { onMouseEnter: handleMouseEnter, onMouseLeave: handleMouseLeave, children: _jsx(Lottie, { lottieRef: lottieRef, animationData: LottieSettle, loop: true, autoplay: true, style: { width: '100%', height: '100%' } }) }));
};
export default Settle;
