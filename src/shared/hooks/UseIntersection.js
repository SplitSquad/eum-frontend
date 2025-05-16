import { useState, useEffect } from 'react';
/**
 * useIntersection
 * - 주어진 ref 요소가 뷰포트에 진입/이탈 여부를 boolean으로 반환
 * @param ref 관찰할 DOM 요소의 RefObject
 * @param options IntersectionObserver 초기화 옵션
 */
const UseIntersection = (ref, options) => {
    const [isIntersecting, setIsIntersecting] = useState(false);
    useEffect(() => {
        if (!ref.current)
            return;
        const observer = new IntersectionObserver(([entry]) => {
            setIsIntersecting(entry.isIntersecting);
        }, options);
        observer.observe(ref.current);
        return () => {
            observer.disconnect();
        };
    }, [ref, options]);
    return isIntersecting;
};
export default UseIntersection;
