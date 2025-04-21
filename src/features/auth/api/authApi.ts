import axiosInstance from '../../../config/axios';
import { User } from '../store/authStore';

/**
 * 로컬 스토리지에서 토큰 가져오기
 */
export const getToken = (): string | null => {
  return localStorage.getItem('auth_token');
};

/**
 * 로컬 스토리지에 토큰 저장
 */
export const setToken = (token: string): void => {
  localStorage.setItem('auth_token', token);
};

/**
 * 로컬 스토리지에서 토큰 제거
 */
export const removeToken = (): void => {
  localStorage.removeItem('auth_token');
};

/**
 * 임시 로그인 (백엔드 개발 전까지 사용)
 *
 * TODO: 백엔드 개발 완료 후 실제 API로 교체 필요
 */
// export const tempLogin = async (userId: string) => {
//   // 개발용 임시 사용자 데이터
//   const mockUsers: Record<string, User> = {
//     user1: {
//       id: 'user1',
//       email: 'user1@example.com',
//       name: '일반 사용자',
//       role: 'USER',
//       picture: 'https://i.pravatar.cc/150?img=1',
//     },
//     admin1: {
//       id: 'admin1',
//       email: 'admin@example.com',
//       name: '관리자',
//       role: 'ADMIN',
//       picture: 'https://i.pravatar.cc/150?img=2',
//     },
//   };

//   // 요청된 사용자 ID로 사용자 찾기
//   const user = mockUsers[userId];
//   if (!user) {
//     throw new Error('사용자를 찾을 수 없습니다');
//   }

//   // 가짜 토큰 생성 (실제로는 JWT가 됨)
//   const token = `temp_token_${userId}_${Date.now()}`;

//   // 로컬 스토리지에 토큰 저장
//   setToken(token);

//   // 응답 형식은 실제 백엔드 응답 형식과 일치하도록 구성
//   return {
//     user,
//     token,
//   };
// };

/**
 * 임시 회원가입 (백엔드 개발 전까지 사용)
 *
 * TODO: 백엔드 개발 완료 후 실제 API로 교체 필요
 */
// export const tempJoin = async (userData: Partial<User>) => {
//   // 실제 회원가입 API가 개발되면 대체됨
//   console.log('회원가입 데이터:', userData);

//   // 가입 성공 응답
//   return {
//     success: true,
//     message: '회원가입이 완료되었습니다. 로그인해주세요.',
//   };
// };

/**
 * Google OAuth 로그인 URL 가져오기
 */
export const getGoogleAuthUrl = async () => {
  try {
    const response = await axiosInstance.get('/api/auth/google/url');
    return response.data.redirectUrl;
  } catch (error) {
    console.error('Google 인증 URL 가져오기 실패:', error);
    throw error;
  }
};

/**
 * OAuth 콜백 처리
 * 인증 코드를 백엔드로 전송하고 토큰을 받아 저장
 */
export const handleOAuthCallback = async (code: string, provider: string = 'google') => {
  try {
    // 백엔드에 인증 코드 전송
    const response = await axiosInstance.post(`/api/auth/${provider}/callback`, { code });

    // 토큰 저장
    if (response.data && response.data.token) {
      setToken(response.data.token);
    }

    return response.data;
  } catch (error) {
    console.error('OAuth 콜백 처리 실패:', error);
    throw error;
  }
};

/**
 * 현재 인증 상태 확인
 * 저장된 토큰으로 사용자 정보 가져오기
 */
export const checkAuthStatus = async () => {
  try {
    const token = getToken();
    if (!token) {
      throw new Error('인증 토큰이 없습니다');
    }

    // 백엔드에서 현재 사용자 정보 조회
    const response = await axiosInstance.get('/api/auth/me');
    return response.data.user;
  } catch (error) {
    console.error('인증 상태 확인 실패:', error);
    removeToken(); // 문제 발생 시 토큰 제거
    throw error;
  }
};

/**
 * 로그아웃
 * 저장된 토큰 제거 및 백엔드 로그아웃 처리
 */
export const logout = async () => {
  try {
    // 백엔드 로그아웃 API 호출
    await axiosInstance.post('/api/auth/logout');
  } catch (error) {
    console.error('로그아웃 API 호출 실패:', error);
  } finally {
    // 로컬 토큰 제거
    removeToken();
  }
};

/**
 * JWT 토큰 직접 설정
 * 테스트나 외부에서 받은 토큰을 직접 설정할 때 사용
 */
export const setJwtToken = (token: string) => {
  setToken(token);
  return { success: true, message: 'JWT 토큰이 성공적으로 설정되었습니다.' };
};
