'use client';
import React, { useState, useRef, useEffect } from 'react';
import { callAgentic } from '@/shared/utils/Agentic';
import { callJobAgent, processCoverLetterResponse } from '@/shared/utils/JobAgent';
import { CoverLetterState, CoverLetterResponse } from '@/types/CoverLetterTypes';
type Message = { id: number; sender: 'user' | 'bot'; text: string };
type AgentType = 'schedule' | 'job';
export default function ModalContent() {
  const [activeAgent, setActiveAgent] = useState<AgentType>('schedule');

  // 일정 에이전트 상태
  const [scheduleMessages, setScheduleMessages] = useState<Message[]>([]);
  const [scheduleLoading, setScheduleLoading] = useState(false);

  // 구직 에이전트 상태
  const [jobMessages, setJobMessages] = useState<Message[]>([]);
  const [jobLoading, setJobLoading] = useState(false);
  const [coverLetterState, setCoverLetterState] = useState<CoverLetterState | null>(null);
  const listRef = useRef<HTMLDivElement>(null);
  const [input, setInput] = useState('');
  // 초기 환영 메시지
  useEffect(() => {
    if (activeAgent === 'schedule' && scheduleMessages.length === 0) {
      setScheduleMessages([
        {
          id: Date.now(),
          sender: 'bot',
          text: '일정 및 게시글 작성 에이전트입니다. 무엇을 도와드릴까요?',
        },
      ]);
    }
    if (activeAgent === 'job' && jobMessages.length === 0) {
      setJobMessages([
        { id: Date.now(), sender: 'bot', text: '구직 에이전트입니다. 어떤 직무를 찾고 계신가요?' },
      ]);
    }
  }, [activeAgent]);
  // 자동 스크롤
  useEffect(() => {
    if (listRef.current) {
      listRef.current.scrollTop = listRef.current.scrollHeight;
    }
  }, [scheduleMessages, jobMessages, scheduleLoading, jobLoading, activeAgent]);
  const sendMessage = async () => {
    const text = input.trim();
    if (!text) return;
    setInput('');
    if (activeAgent === 'schedule') {
      // 일정 에이전트 로직
      const nextId = Date.now();
      setScheduleMessages(msgs => [...msgs, { id: nextId, sender: 'user', text }]);
      setScheduleLoading(true);
      try {
        const { response } = await callAgentic(text, 'user_id');
        setScheduleMessages(msgs => [...msgs, { id: nextId + 1, sender: 'bot', text: response }]);
      } catch {
        setScheduleMessages(msgs => [
          ...msgs,
          { id: nextId + 2, sender: 'bot', text: '응답 중 오류가 발생했습니다.' },
        ]);
      } finally {
        setScheduleLoading(false);
      }
    } else {
      // 구직 에이전트 로직
      const nextId = Date.now();
      setJobMessages(msgs => [...msgs, { id: nextId, sender: 'user', text }]);
      setJobLoading(true);
      try {
        if (!coverLetterState) {
          // 첫 메시지인 경우 자기소개서 시작
          const response = await callJobAgent(text, 'user_id');
          setCoverLetterState(response.state);
          setJobMessages(msgs => [
            ...msgs,
            { id: nextId + 1, sender: 'bot', text: response.message },
          ]);
        } else {
          // 이후 메시지는 자기소개서 응답 처리
          const response = await processCoverLetterResponse(text, coverLetterState);
          setCoverLetterState(response.state);
          if (response.cover_letter) {
            // 자기소개서가 생성된 경우
            setJobMessages(msgs => [
              ...msgs,
              { id: nextId + 1, sender: 'bot', text: '자기소개서가 생성되었습니다!' },
            ]);
            // PDF 다운로드 링크 표시
            if (response.pdf_path) {
              setJobMessages(msgs => [
                ...msgs,
                {
                  id: nextId + 3,
                  sender: 'bot',
                  text: `PDF 다운로드 링크: ${response.pdf_path}`,
                },
              ]);
            }
          } else {
            // 다음 질문 표시
            setJobMessages(msgs => [
              ...msgs,
              { id: nextId + 1, sender: 'bot', text: response.message },
            ]);
          }
        }
      } catch (error) {
        setJobMessages(msgs => [
          ...msgs,
          { id: nextId + 2, sender: 'bot', text: '구직 에이전트 오류가 발생했습니다.' },
        ]);
      } finally {
        setJobLoading(false);
      }
    }
  };
  // 현재 렌더할 메시지와 로딩 상태 선택
  const messages = activeAgent === 'schedule' ? scheduleMessages : jobMessages;
  const loading = activeAgent === 'schedule' ? scheduleLoading : jobLoading;
  return (
    <div className="flex flex-col h-[400px] w-[350px] bg-white rounded-lg shadow-lg">
      {/* 탭 버튼 */}
      <div className="flex">
        <button
          className={`flex-1 py-2 ${activeAgent === 'schedule' ? 'bg-indigo-600 text-white' : 'bg-gray-200'}`}
          onClick={() => setActiveAgent('schedule')}
        >
          일정 에이전트
        </button>
        <button
          className={`flex-1 py-2 ${activeAgent === 'job' ? 'bg-indigo-600 text-white' : 'bg-gray-200'}`}
          onClick={() => setActiveAgent('job')}
        >
          구직 에이전트
        </button>
      </div>
      {/* 메시지 리스트 */}
      <div ref={listRef} className="flex-1 overflow-auto p-3 space-y-2 bg-gray-50">
        {messages.map(m => (
          <div
            key={m.id}
            className={`flex ${m.sender === 'user' ? 'justify-end' : 'justify-start'}`}
          >
            <span
              className={`inline-block px-3 py-1 rounded-xl max-w-[70%] break-words ${
                m.sender === 'user' ? 'bg-blue-500 text-white' : 'bg-gray-200 text-gray-800'
              }`}
            >
              {m.text}
            </span>
          </div>
        ))}
        {loading && (
          <div className="sticky bottom-0 w-full text-center py-2 bg-white/70">
            <span className="text-gray-500">답변 중...</span>
          </div>
        )}
      </div>
      {/* 입력창 */}
      <div className="flex items-center border-t p-2">
        <input
          type="text"
          value={input}
          onChange={e => setInput(e.target.value)}
          onKeyDown={e => e.key === 'Enter' && !loading && sendMessage()}
          disabled={loading}
          className="flex-1 px-3 py-1 bg-white border rounded-lg focus:outline-none focus:ring disabled:opacity-50"
          placeholder={
            activeAgent === 'schedule'
              ? '일정 및 게시글 작성 요청을 입력하세요...'
              : '구직 관련 질문을 입력하세요...'
          }
        />
        <button
          onClick={sendMessage}
          disabled={loading}
          className="ml-2 px-4 py-1 bg-indigo-600 text-white rounded-lg disabled:opacity-50"
        >
          전송
        </button>
      </div>
    </div>
  );
}
