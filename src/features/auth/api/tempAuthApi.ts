// src/features/auth/authApi.ts
import { axiosInstance } from '../../../config/axios';
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
  try {
    const response = await axiosInstance.post('/login', null, {
      params: { userId },
    });
    
    // 응답 헤더에서 토큰 가져오기
    // 응답은 axios 인터셉터에서 이미 data로 추출된 상태
    // 원본 응답 헤더를 확인하기 위해 별도 fetch 요청 사용
    const baseURL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:8080';
    const res = await fetch(`${baseURL}/login?userId=${userId}`, {
      method: 'POST',
    });
    
    const token = res.headers.get('access-token');
    if (!token) {
      // axios 인터셉터에서 사용하는 테스트 토큰 사용
      console.warn('서버에서 토큰을 받지 못했습니다. 테스트 토큰을 사용합니다.');
      const testToken = 'eyJhbGciOiJIUzI1NiJ9.eyJ1c2VySWQiOjQsInJvbGUiOiJST0xFX1VTRVIiLCJpYXQiOjE3NDQ4NjkyNzgsImV4cCI6MTc0ODQ2OTI3OH0.iJQ-_ej0AWjrFI5z0t7R4Y0uKmUJ8tyQalXu3qlfHA4';
      setToken(testToken);
      
      // JWT payload에서 userId 추출
      const payload = JSON.parse(atob(testToken.split('.')[1]));
      return { userId: payload.userId };
    }
    
    // 토큰 저장
    setToken(token);
    
    // userId 반환
    const payload = JSON.parse(atob(token.split('.')[1]));
    return { userId: payload.userId };
  } catch (error) {
    console.error('로그인 실패:', error);
    throw new Error('로그인에 실패했습니다');
  }
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
