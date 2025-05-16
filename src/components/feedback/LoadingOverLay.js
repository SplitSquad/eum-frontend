import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import useIntroSlider from '@/shared/hooks/UseIntroSlider';
import IntroSlider from '@/components/loading/IntroSlider';
import Slide1 from '@/components/loading/Slide1';
import Slide2 from '@/components/loading/Slide2';
import Slide3 from '@/components/loading/Slide3';
const LoadingOverlay = ({ isLoaded = true }) => {
    const totalSlides = 3;
    const { currentIndex, hasCompletedAll } = useIntroSlider(isLoaded, totalSlides);
    const navigate = useNavigate();
    // 조건: 로딩 완료 && 슬라이드 전부 돌았으면 로그인 화면으로 이동
    useEffect(() => {
        if (hasCompletedAll) {
            const timeout = setTimeout(() => navigate('/home'), 800);
            return () => clearTimeout(timeout);
        }
    }, [hasCompletedAll, navigate]);
    useEffect(() => { }, [isLoaded]);
    return (_jsx("main", { className: "w-screen opacity-100", style: { minHeight: '20vh', height: 'auto' }, children: _jsxs(IntroSlider, { currentIndex: currentIndex, children: [_jsx(Slide1, {}), _jsx(Slide2, {}), _jsx(Slide3, {})] }) }));
};
export default LoadingOverlay;
