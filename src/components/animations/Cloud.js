import { jsx as _jsx } from "react/jsx-runtime";
import { useEffect, useRef } from 'react';
import LottieCloud from '@/assets/animations/lottie/Cloud.json';
import Lottie from 'lottie-react';
const Cloud = ({ isPlaying = true, className = '' }) => {
    const lottieRef = useRef(null);
    useEffect(() => {
        if (isPlaying) {
            lottieRef.current?.play();
        }
        else {
            lottieRef.current?.stop();
        }
    }, [isPlaying]);
    return (_jsx("div", { className: `w-16 h-16 hover:scale-110 transition-transform duration-200 ${className}`, children: _jsx(Lottie, { lottieRef: lottieRef, animationData: LottieCloud, loop: true, autoplay: false, style: { width: '100%', height: '100%' } }) }));
};
export default Cloud;
