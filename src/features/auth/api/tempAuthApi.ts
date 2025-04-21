// src/features/auth/authApi.ts
import axiosInstance from '../../../config/axios';
import { setToken, removeToken } from '../tokenUtils';

interface TempLoginResult {
  userId: number;
  // 나중에 확장용: name, email, role 등
}

/**
 * 임시 회원가입
 *  POST /join?nation=...&language=...&address=...&name=...
 */
export async function tempJoin(
  nation: string,
  language: string,
  address: string,
  name: string
): Promise<void> {
  await axiosInstance.post('/join', null, { params: { nation, language, address, name } });
}

/**
 * 임시 로그인
 *  POST /login?userId=...
 *  → 응답 헤더 'access-token' 에 JWT 토큰이 담겨 있습니다.
 */
export const tempLogin = async (userId: number) => {
  const res = await fetch(`http://localhost:8080/login?userId=${userId}`, {
    method: 'POST',
    credentials: 'include',
  });
  if (!res.ok) throw new Error('로그인 실패');
  const token = res.headers.get('access-token');
  if (!token) throw new Error('토큰이 없습니다');
  localStorage.setItem('auth_token', token);

  const body = await res.json();
  return { userId: body.userId };
};

/**
 * 현재 인증 상태 확인 (임시)
 * 로컬 스토리지에 저장된 JWT 토큰을 디코딩해서 userId 반환
 */
export async function checkAuthStatus(): Promise<{ userId: number }> {
  const token = localStorage.getItem('auth_token');
  if (!token) {
    throw new Error('인증 토큰이 없습니다.');
  }
  // JWT payload (base64 디코딩)
  const payload = JSON.parse(atob(token.split('.')[1]));
  return { userId: payload.userId };
}
/**
 * 로그아웃
 */
export function logout(): void {
  removeToken();
}
