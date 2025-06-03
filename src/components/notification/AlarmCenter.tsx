import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom'; // React Router의 경로 이동 훅
import {
  fetchUnreadAlarms,
  markAlarmsRead,
  AlarmDetail,
} from '@/services/notification/alarmService';
import { useSseWithPolling } from '@/shared/hooks/UseSse';
import Bell from '@/components/animations/Bell';
import { useTranslation } from '@/shared/i18n';

// 로컬스토리지에서 userId를 안전하게 추출하는 함수
export function getUserId(): number | null {
  try {
    const raw = localStorage.getItem('auth-storage');
    if (!raw) return null; // 데이터 없으면 null 반환
    const parsed = JSON.parse(raw);
    return parsed?.state?.user?.userId ?? null; // userId가 있으면 반환, 없으면 null
  } catch {
    return null; // 파싱 실패 시 null 반환
  }
}

export function AlarmCenter() {
  const { t } = useTranslation(); // 다국어 번역 함수
  const userId = getUserId(); // 현재 로그인한 사용자 ID
  const navigate = useNavigate(); // 페이지 이동 함수

  // 알림 리스트 상태
  const [alarms, setAlarms] = useState<AlarmDetail[]>([]);
  // 데이터 로딩 상태
  const [loading, setLoading] = useState(true);
  // 드롭다운 열림 상태
  const [dropdownOpen, setDropdownOpen] = useState(false);
  // 벨 애니메이션 재생 상태
  const [isBellPlaying, setIsBellPlaying] = useState(false);

  // 최초 마운트 또는 userId 변경 시 미확인 알림 API 호출
  useEffect(() => {
    if (!userId) {
      setLoading(false); // userId 없으면 로딩 끝내기
      return;
    }
    setLoading(true); // 로딩 시작
    fetchUnreadAlarms(userId)
      .then(list => setAlarms(list)) // 알림 리스트 상태에 저장
      .catch(err => {
        console.error('Fetch unread alarms failed', err);
        setAlarms([]); // 실패 시 빈 배열
      })
      .finally(() => setLoading(false)); // 로딩 완료 처리
  }, [userId]);

  // SSE + 폴링을 통한 실시간 알림 처리 훅 사용
  useSseWithPolling(
    userId!, // userId가 반드시 존재한다고 단언 (필요 시 조건문 추가)
    // SSE로 새로운 알림 도착 시 중복 체크 후 추가
    alarm => {
      setAlarms(prev =>
        prev.some(a => a.alarmDetailId === alarm.alarmDetailId) ? prev : [alarm, ...prev]
      );
    },
    // 폴링 시 전체 알림 리스트로 덮어쓰기
    list => {
      setAlarms(list);
    },
    2_000 // 2초 간격 폴링
  );

  // '모두 읽음' 버튼 클릭 시 알림 모두 읽음 처리 API 호출 및 리스트 초기화
  const markAllRead = async () => {
    if (!userId || alarms.length === 0) return; // userId 없거나 알림 없으면 무시
    try {
      await markAlarmsRead(alarms.map(a => a.alarmId)); // 모든 알림 ID 배열 넘김
      setAlarms([]); // 클라이언트 상태 초기화
    } catch (err) {
      console.error('Mark all read failed', err);
    }
  };

  // 드롭다운 외부 클릭 감지용 ref
  const wrapperRef = useRef<HTMLDivElement>(null);

  // 드롭다운 외부 클릭 시 닫기 이벤트 등록 및 해제
  useEffect(() => {
    const onClick = (e: MouseEvent) => {
      if (wrapperRef.current && !wrapperRef.current.contains(e.target as Node)) {
        setDropdownOpen(false); // 외부 클릭 시 드롭다운 닫기
      }
    };
    document.addEventListener('mousedown', onClick);
    return () => document.removeEventListener('mousedown', onClick);
  }, []);

  // 알림 항목 클릭 시 serviceType/postId 경로로 이동
  const handleAlarmClick = (serviceType: string, postId: number) => {
    navigate(`/${serviceType}/${postId}`); // 경로 이동
    setDropdownOpen(false); // 드롭다운 닫기
  };

  // 로딩 중일 때 번역된 로딩 메시지 표시
  if (loading) return <p>{t('alarm.loading')}</p>;
  // 로그인 안 했으면 컴포넌트 렌더링 안함
  if (!userId) return null;

  return (
    <div ref={wrapperRef} style={{ position: 'relative', display: 'inline-block' }}>
      {/* 알림 센터 토글 버튼 */}
      <button
        onClick={() => setDropdownOpen(o => !o)} // 클릭 시 드롭다운 토글
        onMouseEnter={() => setIsBellPlaying(true)} // 마우스 오버 시 벨 애니메이션 시작
        onMouseLeave={() => setIsBellPlaying(false)} // 마우스 떠날 시 애니메이션 중지
        style={{
          fontSize: '1.4rem',
          background: 'none',
          border: 'none',
          position: 'relative',
          cursor: 'pointer',
          padding: 0,
          width: 48,
          height: 48,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          outline: 'none',
          boxShadow: 'none',
        }}
        aria-label="Notification center toggle"
        tabIndex={0}
        onFocus={e => (e.currentTarget.style.outline = 'none')}
        onBlur={e => (e.currentTarget.style.outline = 'none')}
      >
        {/* 벨 애니메이션 컴포넌트, 알림 있거나 열려있으면 애니메이션 재생 */}
        <Bell isPlaying={isBellPlaying || dropdownOpen || alarms.length > 0} />

        {/* 알림 개수 뱃지 표시 */}
        {alarms.length > 0 && (
          <span
            style={{
              position: 'absolute',
              top: -2,
              right: 3,
              background: 'red',
              color: 'white',
              borderRadius: '50%',
              width: 18,
              height: 18,
              padding: 0,
              fontSize: '0.68rem',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
            }}
          >
            {alarms.length}
          </span>
        )}
      </button>

      {/* 드롭다운 메뉴 */}
      {dropdownOpen && (
        <div
          style={{
            position: 'absolute',
            right: 0,
            marginTop: 8,
            width: 300,
            maxHeight: 350,
            overflowY: 'auto',
            background: 'rgba(255,255,255,0.85)',
            boxShadow: '0 2px 8px rgba(0,0,0,0.15)',
            borderRadius: 4,
            zIndex: 1000,
          }}
        >
          {/* 헤더: 알림 개수 + 모두 읽음 버튼 */}
          <div
            style={{
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              padding: '8px 12px',
              borderBottom: '1px solid #eee',
            }}
          >
            <strong>
              {t('alarm.alarm')} ({alarms.length})
            </strong>
            {alarms.length > 0 && (
              <button
                onClick={markAllRead}
                style={{
                  background: 'none',
                  border: 'none',
                  color: '#007BFF',
                  cursor: 'pointer',
                  fontSize: '0.85rem',
                }}
              >
                {t('alarm.markAllRead')}
              </button>
            )}
          </div>

          {/* 알림 리스트 또는 없을 때 안내 메시지 */}
          {alarms.length === 0 ? (
            <div style={{ padding: 12, textAlign: 'center', color: '#666' }}>
              {t('alarm.noAlarms')}
            </div>
          ) : (
            <ul style={{ listStyle: 'none', margin: 0, padding: 0 }}>
              {alarms.map(a => (
                <li
                  key={a.alarmDetailId}
                  onClick={() => handleAlarmClick(a.serviceType, a.postId)} // 클릭 시 페이지 이동
                  style={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    padding: '8px 12px',
                    borderBottom: '1px solid #F0F0F0',
                    cursor: 'pointer', // 클릭 가능한 UI 강조
                  }}
                >
                  <div>
                    {/* 알림 발생 시간 (있으면 표시) */}
                    <div style={{ fontSize: '0.85rem', color: '#999' }}>
                      {a.timestamp ? new Date(a.timestamp).toLocaleTimeString() : ''}
                    </div>
                    {/* 알림 내용 + 언어 정보 */}
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
