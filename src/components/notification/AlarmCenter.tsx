import React, { useState, useEffect, useRef } from 'react';
import {
  fetchUnreadAlarms,
  markAlarmsRead,
  AlarmDetail,
} from '@/services/notification/alarmService';
import { useSseWithPolling } from '@/shared/hooks/UseSse';

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
  const [dropdownOpen, setDropdownOpen] = useState(false);

  // 초기 로딩
  useEffect(() => {
    if (!userId) {
      setLoading(false);
      return;
    }
    setLoading(true);
    fetchUnreadAlarms(userId)
      .then(list => setAlarms(list))
      .catch(err => {
        console.error('알림 조회 실패', err);
        setAlarms([]);
      })
      .finally(() => setLoading(false));
  }, [userId]);

  // SSE + 폴링 폴백 훅
  useSseWithPolling(
    userId!,
    // onAlarm: SSE로 들어올 때마다 중복 없이 추가
    alarm => {
      setAlarms(prev =>
        prev.some(a => a.alarmDetailId === alarm.alarmDetailId) ? prev : [alarm, ...prev]
      );
    },
    // onFullList: 폴링 모드일 땐 전체 리스트로 덮어쓰기
    list => {
      setAlarms(list);
    },
    2_000 // 2초마다 폴링
  );

  // // 개별 읽음 처리
  // const markOneRead = async (alarmDetailId: number) => {
  //   try {
  //     await markAlarmsRead([alarmDetailId]);
  //     setAlarms(prev => prev.filter(a => a.alarmDetailId !== alarmDetailId));
  //   } catch (err) {
  //     console.error('개별 읽음 처리 실패', err);
  //   }
  // };

  // 모두 읽음 처리
  const markAllRead = async () => {
    if (!userId || alarms.length === 0) return;
    try {
      await markAlarmsRead(alarms.map(a => a.alarmId));
      setAlarms([]);
    } catch (err) {
      console.error('읽음 처리 실패', err);
    }
  };

  // 드롭다운 외부 클릭 닫기
  const wrapperRef = useRef<HTMLDivElement>(null);
  useEffect(() => {
    const onClick = (e: MouseEvent) => {
      if (wrapperRef.current && !wrapperRef.current.contains(e.target as Node)) {
        setDropdownOpen(false);
      }
    };
    document.addEventListener('mousedown', onClick);
    return () => document.removeEventListener('mousedown', onClick);
  }, []);

  if (loading) return <p>알람 로딩 중…</p>;
  if (!userId) return null;

  return (
    <div ref={wrapperRef} style={{ position: 'relative', display: 'inline-block' }}>
      <button
        onClick={() => setDropdownOpen(o => !o)}
        style={{
          fontSize: '1.4rem',
          background: 'none',
          border: 'none',
          position: 'relative',
          cursor: 'pointer',
        }}
        aria-label="알림 센터 토글"
      >
        🔔
        {alarms.length > 0 && (
          <span
            style={{
              position: 'absolute',
              top: 0,
              right: 0,
              transform: 'translate(50%, -50%)',
              background: 'red',
              color: 'white',
              borderRadius: '50%',
              padding: '2px 6px',
              fontSize: '0.75rem',
            }}
          >
            {alarms.length}
          </span>
        )}
      </button>

      {dropdownOpen && (
        <div
          style={{
            position: 'absolute',
            right: 0,
            marginTop: 8,
            width: 300,
            maxHeight: 350,
            overflowY: 'auto',
            background: '#fff',
            boxShadow: '0 2px 8px rgba(0,0,0,0.15)',
            borderRadius: 4,
            zIndex: 1000,
          }}
        >
          <div
            style={{
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              padding: '8px 12px',
              borderBottom: '1px solid #eee',
            }}
          >
            <strong>알림 ({alarms.length})</strong>
            {alarms.length > 0 && (
              <button
                onClick={markAllRead}
                style={{
                  background: 'none',
                  border: 'none',
                  color: '#007bff',
                  cursor: 'pointer',
                  fontSize: '0.85rem',
                }}
              >
                모두 읽음
              </button>
            )}
          </div>

          {alarms.length === 0 ? (
            <div style={{ padding: 12, textAlign: 'center', color: '#666' }}>
              새 알람이 없습니다.
            </div>
          ) : (
            <ul style={{ listStyle: 'none', margin: 0, padding: 0 }}>
              {alarms.map(a => (
                <li
                  key={a.alarmDetailId}
                  style={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    padding: '8px 12px',
                    borderBottom: '1px solid #f0f0f0',
                  }}
                >
                  <div>
                    <div style={{ fontSize: '0.85rem', color: '#999' }}>
                      {a.timestamp ? new Date(a.timestamp).toLocaleTimeString() : ''}
                    </div>
                    <div>
                      {a.content} <small style={{ color: '#666' }}>({a.language})</small>
                    </div>
                  </div>
                </li>
              ))}
            </ul>
          )}
        </div>
      )}
    </div>
  );
}
