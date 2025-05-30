'use client';

import { ChatResponse } from '../types';

/**
 * fetchChatbotResponse
 * - 백엔드 챗봇 API에 POST 요청을 보내고,
 * - 결과를 ChatResponse 형태로 파싱하여 반환
 *
 * @param query 사용자 질문 문자열
 * @param uid   사용자 고유 ID (세션 관리용)
 * @returns     Promise<ChatResponse>
 * @throws      네트워크 혹은 서버 오류 시 Error 발생
 */

export async function fetchChatbotResponse(query: string, uid: string): Promise<ChatResponse> {
  // localStorage에서 토큰 읽기
  const token = localStorage.getItem('auth_token');
  if (!token) {
    throw new Error('인증 토큰이 없습니다. 다시 로그인해주세요.');
  }
  // API 엔드포인트로 요청
  const res = await fetch(
    `${import.meta.env.VITE_API_BASE_URL || 'http://localhost:8080'}/api/v1/chatbot`,
    {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', Authorization: token },
      body: JSON.stringify({ query, uid }),
    }
  );

  // HTTP 상태 코드 확인
  if (!res.ok) {
    throw new Error(`API 호출 실패: ${res.status}`);
  }

  // JSON 파싱 후 반환
  return res.json();
}
