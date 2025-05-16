import { jsx as _jsx } from "react/jsx-runtime";
import { useRef } from 'react';
import LottieTravel from '@/assets/animations/lottie/travel.json';
import Lottie from 'lottie-react';
const Travel = () => {
    const lottieRef = useRef(null);
    const handleMouseEnter = () => {
        lottieRef.current?.stop();
    };
    const handleMouseLeave = () => {
        lottieRef.current?.play();
    };
    return (_jsx("div", { onMouseEnter: handleMouseEnter, onMouseLeave: handleMouseLeave, children: _jsx(Lottie, { lottieRef: lottieRef, animationData: LottieTravel, loop: true, autoplay: true, style: { width: '100%', height: '100%' } }) }));
};
export default Travel;
