import { jsx as _jsx } from "react/jsx-runtime";
import { useEffect, useRef } from 'react';
import LottieBell from '@/assets/animations/lottie/Bell.json';
import Lottie from 'lottie-react';
const Bell = ({ isPlaying = true }) => {
    const lottieRef = useRef(null);
    useEffect(() => {
        if (isPlaying) {
            lottieRef.current?.play();
        }
        else {
            lottieRef.current?.stop();
        }
    }, [isPlaying]);
    return (_jsx("div", { className: "w-12 h-12 hover:scale-110 transition-transform duration-200", children: _jsx(Lottie, { lottieRef: lottieRef, animationData: LottieBell, loop: true, autoplay: false, style: { width: '100%', height: '100%' } }) }));
};
export default Bell;
