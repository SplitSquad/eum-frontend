import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { useState, useEffect, useRef } from 'react';
import { fetchUnreadAlarms, markAlarmsRead, } from '@/services/notification/alarmService';
import { useSseWithPolling } from '@/shared/hooks/UseSse';
import Bell from '@/components/animations/Bell';
export function getUserId() {
    try {
        const raw = localStorage.getItem('auth-storage');
        if (!raw)
            return null;
        const parsed = JSON.parse(raw);
        return parsed?.state?.user?.userId ?? null;
    }
    catch {
        return null;
    }
}
export function AlarmCenter() {
    const userId = getUserId();
    const [alarms, setAlarms] = useState([]);
    const [loading, setLoading] = useState(true);
    const [dropdownOpen, setDropdownOpen] = useState(false);
    const [isBellPlaying, setIsBellPlaying] = useState(false);
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
    useSseWithPolling(userId, 
    // onAlarm: SSE로 들어올 때마다 중복 없이 추가
    alarm => {
        setAlarms(prev => prev.some(a => a.alarmDetailId === alarm.alarmDetailId) ? prev : [alarm, ...prev]);
    }, 
    // onFullList: 폴링 모드일 땐 전체 리스트로 덮어쓰기
    list => {
        setAlarms(list);
    }, 2000 // 2초마다 폴링
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
        if (!userId || alarms.length === 0)
            return;
        try {
            await markAlarmsRead(alarms.map(a => a.alarmId));
            setAlarms([]);
        }
        catch (err) {
            console.error('읽음 처리 실패', err);
        }
    };
    // 드롭다운 외부 클릭 닫기
    const wrapperRef = useRef(null);
    useEffect(() => {
        const onClick = (e) => {
            if (wrapperRef.current && !wrapperRef.current.contains(e.target)) {
                setDropdownOpen(false);
            }
        };
        document.addEventListener('mousedown', onClick);
        return () => document.removeEventListener('mousedown', onClick);
    }, []);
    if (loading)
        return _jsx("p", { children: "\uC54C\uB78C \uB85C\uB529 \uC911\u2026" });
    if (!userId)
        return null;
    return (_jsxs("div", { ref: wrapperRef, style: { position: 'relative', display: 'inline-block' }, children: [_jsxs("button", { onClick: () => setDropdownOpen(o => !o), onMouseEnter: () => setIsBellPlaying(true), onMouseLeave: () => setIsBellPlaying(false), style: {
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
                }, "aria-label": "\uC54C\uB9BC \uC13C\uD130 \uD1A0\uAE00", tabIndex: 0, onFocus: e => (e.currentTarget.style.outline = 'none'), onBlur: e => (e.currentTarget.style.outline = 'none'), children: [_jsx(Bell, { isPlaying: isBellPlaying || dropdownOpen || alarms.length > 0 }), alarms.length > 0 && (_jsx("span", { style: {
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
                        }, children: alarms.length }))] }), dropdownOpen && (_jsxs("div", { style: {
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
                }, children: [_jsxs("div", { style: {
                            display: 'flex',
                            justifyContent: 'space-between',
                            alignItems: 'center',
                            padding: '8px 12px',
                            borderBottom: '1px solid #eee',
                        }, children: [_jsxs("strong", { children: ["\uC54C\uB9BC (", alarms.length, ")"] }), alarms.length > 0 && (_jsx("button", { onClick: markAllRead, style: {
                                    background: 'none',
                                    border: 'none',
                                    color: '#007bff',
                                    cursor: 'pointer',
                                    fontSize: '0.85rem',
                                }, children: "\uBAA8\uB450 \uC77D\uC74C" }))] }), alarms.length === 0 ? (_jsx("div", { style: { padding: 12, textAlign: 'center', color: '#666' }, children: "\uC0C8 \uC54C\uB78C\uC774 \uC5C6\uC2B5\uB2C8\uB2E4." })) : (_jsx("ul", { style: { listStyle: 'none', margin: 0, padding: 0 }, children: alarms.map(a => (_jsx("li", { style: {
                                display: 'flex',
                                justifyContent: 'space-between',
                                padding: '8px 12px',
                                borderBottom: '1px solid #f0f0f0',
                            }, children: _jsxs("div", { children: [_jsx("div", { style: { fontSize: '0.85rem', color: '#999' }, children: a.timestamp ? new Date(a.timestamp).toLocaleTimeString() : '' }), _jsxs("div", { children: [a.content, " ", _jsxs("small", { style: { color: '#666' }, children: ["(", a.language, ")"] })] })] }) }, a.alarmDetailId))) }))] }))] }));
}
