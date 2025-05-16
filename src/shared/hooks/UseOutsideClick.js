import { useEffect } from 'react';
// ref: 감지 대상 DOM 요소에 대한 React RefObject
// callback: 요소 밖에서 클릭이 발생했을 때 호출할 함수
export default function useOutsideClick(ref, callback) {
    useEffect(() => {
        // 클릭 이벤트 핸들러 정의
        const handleClickOutside = (event) => {
            // ref.current가 존재하고, 이벤트의 target이 해당 요소에 포함되어 있지 않으면 실행
            if (ref.current && !ref.current.contains(event.target)) {
                callback();
            }
        };
        // mousedown 이벤트를 문서에 추가하여 클릭을 감지
        document.addEventListener('mousedown', handleClickOutside);
        // clean-up 함수: 컴포넌트 언마운트 시 이벤트 리스너 제거
        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
        };
    }, [ref, callback]); // ref와 callback이 변경될 때마다 useEffect 재실행
}
