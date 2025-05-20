import { useCallback, useRef } from 'react';
/**
 * useMemoized
 * - 주어진 함수를 항상 최신 버전으로 실행하면서도, 콜백 참조는 안정적으로 유지
 * @param fn 메모이제이션할 함수
 * @returns 안정적인 함수 참조
 */
const UseMemoized = (fn) => {
    const fnRef = useRef(fn);
    fnRef.current = fn;
    return useCallback((...args) => {
        return fnRef.current(...args);
    }, []);
};
export default UseMemoized;
