import { useEffect, useRef } from 'react';
/**
 * useA11y
 * - 스크린 리더용 라이브 리전을 생성하고, message를 읽어주도록 설정
 * @param message 읽을 메시지
 * @param polite 'polite' or 'assertive' 읽기 우선 순위 (기본 polite)
 */
const UseA11y = (message, polite = true) => {
    const liveRef = useRef(null);
    useEffect(() => {
        let region = liveRef.current;
        if (!region) {
            // 1) div 요소를 하나 만들고
            region = document.createElement('div');
            // 2) aria-live 속성: polite(읽기 우선순위 낮음) 또는 assertive(높음)
            region.setAttribute('aria-live', polite ? 'polite' : 'assertive');
            // 3) 읽은 후에도 전체 textContent 갱신을 보장
            region.setAttribute('aria-atomic', 'true');
            // 4) 시각적으로 보이지 않도록 스타일링
            Object.assign(region.style, {
                position: 'absolute',
                width: '1px',
                height: '1px',
                margin: '-1px',
                border: '0',
                padding: '0',
                clip: 'rect(0 0 0 0)',
            });
            // 5) body 맨 끝에 추가
            document.body.append(region);
            liveRef.current = region;
        }
        // 6) 매번 message가 바뀔 때마다 textContent 갱신 → 스크린 리더가 읽어줌
        region.textContent = message;
    }, [message, polite]);
};
export default UseA11y;
