import React, { useState, useEffect, useCallback } from 'react';
import {
  fetchUnreadAlarms,
  markAlarmsRead,
  AlarmDetail,
} from '@/services/notification/alarmService';
import { useSse } from '@/shared/hooks/UseSse';

// userId 꺼내오는 헬퍼 (이미 구현하신 그대로)
export function getUserId(): number | null {
  try {
    const raw = localStorage.getItem('auth-storage');
    if (!raw) return null;
    const parsed = JSON.parse(raw);
    return parsed?.state?.user?.userId ?? null;
  } catch {
    return null;
  }
}

export function AlarmCenter() {
  const userId = getUserId();
  const [alarms, setAlarms] = useState<AlarmDetail[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string>();

  // 1) 초기 조회 (에러 시 빈 배열로 방어)
  useEffect(() => {
    if (!userId) return;
    fetchUnreadAlarms(userId)
      .then(data => setAlarms(data))
      .catch(err => {
        console.error('알림 조회 실패', err);
        setAlarms([]); // 빈 배열로 방어
        setError(typeof err === 'string' ? err : err.message);
      })
      .finally(() => setLoading(false));
  }, [userId]);

  // 2) 실시간 알람 콜백
  const handleNewAlarm = useCallback((alarm: AlarmDetail) => {
    setAlarms(prev => [alarm, ...prev]);
  }, []);

  // 3) SSE 구독: 'alarm' 이벤트만 처리하도록 내부 훅이 설정되어야 합니다.
  //    UseSse 훅 내부가 addEventListener('alarm', ...) 로 구현됐는지 확인하세요.
  useSse(userId, handleNewAlarm);

  // 4) 읽음 처리
  const markAllRead = async () => {
    const ids = alarms.map(a => a.alarmDetailId);
    try {
      await markAlarmsRead(ids);
      setAlarms([]);
    } catch (err: any) {
      console.error('읽음 처리 실패', err);
      setError(err.message);
    }
  };

  // 렌더링 가드
  if (!userId) return null;
  if (loading) return <p>알람 로딩 중…</p>;
  if (error) return <p style={{ color: 'red' }}>에러: {error}</p>;

  return (
    <div className="alarm-center">
      <header>
        <h2>🔔 알림센터</h2>
        {alarms.length > 0 && <button onClick={markAllRead}>모두 읽음 ({alarms.length})</button>}
      </header>

      {alarms.length === 0 ? (
        <p>새 알람이 없습니다.</p>
      ) : (
        <ul>
          {alarms.map(a => (
            <li key={a.alarmDetailId}>
              <time>{a.timestamp ? new Date(a.timestamp).toLocaleTimeString() : ''}</time>
              &nbsp;{a.content} <small>({a.language})</small>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
