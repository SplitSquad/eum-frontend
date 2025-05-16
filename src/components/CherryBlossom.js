import { jsx as _jsx } from "react/jsx-runtime";
import { useEffect, useState } from 'react';
const CherryBlossom = ({ intensity = 1 }) => {
    const [petals, setPetals] = useState([]);
    useEffect(() => {
        // intensity에 따라 초기 꽃잎 개수 조절
        const initialCount = Math.floor(10 * intensity);
        const initialPetals = Array.from({ length: initialCount }).map((_, index) => (_jsx("div", { className: "petal", style: {
                left: `${Math.random() * 100}%`,
                animationDuration: `${8 + Math.random() * 7}s`,
                animationDelay: `${Math.random() * 10}s`,
                width: `${10 + Math.random() * 10}px`,
                height: `${10 + Math.random() * 10}px`
            } }, `initial-petal-${index}`)));
        setPetals(initialPetals);
        // 주기적으로 새로운 꽃잎 추가
        if (intensity > 0.2) {
            const interval = setInterval(() => {
                setPetals(prev => {
                    // 최대 개수 제한 (intensity에 비례)
                    const maxPetals = Math.floor(30 * intensity);
                    const newPetal = (_jsx("div", { className: "petal", style: {
                            left: `${Math.random() * 100}%`,
                            animationDuration: `${8 + Math.random() * 7}s`,
                            animationDelay: '0s',
                            width: `${10 + Math.random() * 10}px`,
                            height: `${10 + Math.random() * 10}px`
                        } }, `petal-${Date.now()}`));
                    return [...prev.slice(-maxPetals + 1), newPetal];
                });
            }, 1000 / Math.max(0.5, intensity)); // intensity가 높을수록 더 자주 추가
            return () => clearInterval(interval);
        }
        return undefined;
    }, [intensity]);
    return (_jsx("div", { className: "cherry-blossom", children: petals }));
};
export default CherryBlossom;
