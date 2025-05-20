'use client';
import { jsxs as _jsxs, jsx as _jsx, Fragment as _Fragment } from "react/jsx-runtime";
import { useState, useRef, useEffect } from 'react';
import { fetchChatbotResponse } from '@/features/assistant/api/ChatApi';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
/**-----------------------------------웹로그 관련------------------------------------ **/
// userId 꺼내오는 헬퍼
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
// BASE URL에 엔드포인트 설정
const BASE = import.meta.env.VITE_API_BASE_URL;
// 로그 전송 함수
export function sendWebLog(log) {
    // jwt token 가져오기
    const token = localStorage.getItem('auth_token');
    if (!token) {
        throw new Error('인증 토큰이 없습니다. 다시 로그인해주세요.');
    }
    fetch(`${BASE}/logs`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', Authorization: token },
        body: JSON.stringify(log),
    }).catch(err => {
        console.error('WebLog 전송 실패:', err);
    });
    // 전송 완료
    console.log('WebLog 전송 성공:', log);
}
/**
 * ChatContent 컴포넌트
 * - AI 챗봇과의 상호작용 UI를 렌더링하고,
 *   타자기 효과로 메시지를 한 글자씩 표시
 */
export default function ChatContent({ categoryLabel = '전체', onCategoryChange, }) {
    // 메시지 목록, 초기 봇 메시지 포함
    const [messages, setMessages] = useState([
        {
            id: Date.now(),
            sender: 'bot',
            text: '무엇을 도와드릴까요?',
            displayText: '무엇을 도와드릴까요?',
            isTyping: false,
        },
    ]);
    const [input, setInput] = useState('');
    const [loading, setLoading] = useState(false);
    const listRef = useRef(null);
    /**
     * 메시지 전송 핸들러
     */
    const sendMessage = async (query) => {
        const text = query ?? input.trim();
        if (!text)
            return;
        // 사용자 메시지 추가
        setMessages(prev => [...prev, { id: Date.now(), sender: 'user', text }]);
        // 웹로그 전송
        const userId = getUserId() ?? 0;
        const chatLogPayload = {
            UID: userId,
            ClickPath: location.pathname,
            TAG: categoryLabel,
            CurrentPath: location.pathname,
            Event: 'chat',
            Content: text,
            Timestamp: new Date().toISOString(),
        };
        sendWebLog({ userId, content: JSON.stringify(chatLogPayload) });
        // 입력창 초기화 및 로딩 상태 설정
        setInput('');
        setLoading(true);
        try {
            const data = await fetchChatbotResponse(text, '1');
            // 봇 메시지 placeholder 추가
            setMessages(prev => [
                ...prev,
                {
                    id: Date.now() + 1,
                    sender: 'bot',
                    text: data.response,
                    displayText: '',
                    isTyping: true,
                },
            ]);
            // 봇 웹로그 전송
            const userId = getUserId() ?? 0;
            const chatLogPayload = {
                UID: userId,
                ClickPath: location.pathname,
                TAG: categoryLabel,
                CurrentPath: location.pathname,
                Event: 'chat',
                Content: text,
                Timestamp: new Date().toISOString(),
            };
            sendWebLog({ userId, content: JSON.stringify(chatLogPayload) });
            // 예시: 카테고리 매핑 로직
            const map = {
                visa_law: 'visa',
                social_security: 'social',
                tax_finance: 'tax',
                medical_health: 'health',
                employment: 'employment',
                daily_life: 'life',
                all: 'all',
            };
            const rag = data.metadata?.rag_type;
            const newKey = rag && map[rag] ? map[rag] : undefined;
            if (newKey && onCategoryChange)
                onCategoryChange(newKey);
        }
        catch (error) {
            // 오류 메시지
            setMessages(prev => [
                ...prev,
                {
                    id: Date.now() + 2,
                    sender: 'bot',
                    text: '응답 중 오류가 발생했습니다.',
                    displayText: '응답 중 오류가 발생했습니다.',
                    isTyping: false,
                },
            ]);
        }
        finally {
            setLoading(false);
            // 웹로그
        }
    };
    /**
     * 타자기(타이핑) 효과: 마지막 봇 메시지를 한 글자씩 표시
     */
    useEffect(() => {
        const last = messages[messages.length - 1];
        if (last?.sender === 'bot' && last.isTyping) {
            let idx = 0;
            const { text, id: msgId } = last;
            const interval = setInterval(() => {
                idx += 1;
                setMessages(prev => {
                    const copy = [...prev];
                    if (copy[copy.length - 1].id === msgId) {
                        copy[copy.length - 1] = {
                            ...copy[copy.length - 1],
                            displayText: text.slice(0, idx),
                            isTyping: idx < text.length,
                        };
                    }
                    return copy;
                });
                if (idx >= text.length)
                    clearInterval(interval);
            }, 30);
            return () => clearInterval(interval);
        }
        // 마지막 메시지 id 변경 시에만 effect 실행
    }, [messages[messages.length - 1]?.id]);
    /**
     * 메시지 추가 시 자동으로 스크롤 하단으로 이동
     */
    useEffect(() => {
        if (listRef.current) {
            listRef.current.scrollTop = listRef.current.scrollHeight;
        }
    }, [messages, loading]);
    return (_jsxs("div", { className: "flex-1 flex flex-col h-full bg-gray-100", children: [_jsxs("div", { className: "px-6 py-4 bg-white border-b", children: [_jsxs("h1", { className: "text-2xl font-bold inline", children: [categoryLabel, " AI \uBE44\uC11C"] }), _jsx("span", { className: "ml-4 text-gray-600", children: new Intl.DateTimeFormat('ko-KR', { hour: '2-digit', minute: '2-digit' }).format(new Date()) }), _jsxs("p", { className: "mt-2 text-gray-700", children: ["\uC548\uB155\uD558\uC138\uC694! ", categoryLabel, " AI \uBE44\uC11C\uC785\uB2C8\uB2E4."] }), _jsx("div", { className: "mt-4 flex flex-wrap gap-2", children: ['한국에서 필요한 기본 서류는?', '한국에서 일하려면?', '한국어 배우는 방법?'].map(q => (_jsx("button", { onClick: () => sendMessage(q), className: "px-4 py-1 bg-blue-50 text-blue-600 rounded-full text-sm hover:bg-blue-100", children: q }, q))) })] }), _jsxs("div", { ref: listRef, className: "overflow-auto p-2 space-y-3 bg-gray-50 h-[50vh]", children: [messages.map(m => (_jsx("div", { className: `flex ${m.sender === 'user' ? 'justify-end' : 'justify-start'}`, children: m.sender === 'user' ? (_jsx("span", { className: "inline-block px-4 py-2 rounded-xl max-w-[70%] break-words bg-blue-500 text-white", children: m.text })) : (_jsx("span", { className: "inline-block px-4 py-2 rounded-xl max-w-[70%] whitespace-pre-wrap break-words bg-gray-200 text-gray-800", children: _jsx(ReactMarkdown, { remarkPlugins: [remarkGfm], components: { p: ({ children }) => _jsx(_Fragment, { children: children }) }, children: m.displayText ?? m.text }) })) }, m.id))), loading && _jsx("div", { className: "text-center text-gray-500", children: "\uB2F5\uBCC0 \uC911..." })] }), _jsxs("div", { className: "px-6 py-4 bg-white border-t flex items-center", children: [_jsx("input", { type: "text", value: input, onChange: e => setInput(e.target.value), onKeyDown: e => e.key === 'Enter' && !loading && sendMessage(), disabled: loading, className: "flex-1 px-4 py-2 bg-white border rounded-full focus:outline-none focus:ring disabled:opacity-50", placeholder: "\uC9C8\uBB38\uC744 \uC785\uB825\uD558\uC138\uC694..." }), _jsx("button", { onClick: () => sendMessage(), disabled: loading, className: "ml-4 px-6 py-2 bg-indigo-600 text-white rounded-full disabled:opacity-50", children: "\uC804\uC1A1" })] })] }));
}
