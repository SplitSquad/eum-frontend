import { useEffect } from 'react';
import { SendLog } from '../../services/tracking/SendLog';

/**
 * useWebLog
 * - 컴포넌트 마운트 시 페이지 뷰 로그를 보냄
 *
 * @param logPageView 기본 true. false로 두면 페이지뷰 기록을 하지 x
 */
const UseWebLog = (logPageView: boolean = true) => {
  useEffect(() => {
    if (!logPageView) return;

    SendLog({
      event: 'page_view',
      path: window.location.pathname,
      timestamp: new Date().toISOString(),
    });
  }, [logPageView]);
};

export default UseWebLog;
