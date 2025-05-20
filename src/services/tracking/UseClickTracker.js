import { useEffect } from 'react';
import { SendLog } from './SendLog';
/**
 * useClickTracker
 * - 문서 전체의 클릭 이벤트를 듣고, 클릭이 발생할 때마다 로그를 전송
 */
const useClickTracker = () => {
    useEffect(() => {
        const handleClick = (e) => {
            const target = e.target;
            SendLog({
                event: 'click',
                tag: target.tagName,
                id: target.id,
                timestamp: new Date().toISOString(),
            });
        };
        document.addEventListener('click', handleClick);
        return () => {
            document.removeEventListener('click', handleClick);
        };
    }, []);
};
export default useClickTracker;
