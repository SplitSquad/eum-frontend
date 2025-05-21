import axiosInstance from '../../../config/axios';
import { User } from '../store/authStore';
import { setToken, removeToken, getToken, decodeToken, getUserIdFromToken, getRoleFromToken } from '../tokenUtils';
import { AxiosResponse } from 'axios';
import { env } from '../../../config/env';

// OAuth 응답 타입 정의
interface OAuthResponse {
  token?: string;
  email?: string;
  role?: string;
  name?: string;
  isOnBoardDone?: boolean;
  loginType?: string;
  [key: string]: any; // 기타 속성을 위한 인덱스 시그니처
}

// 사용자 프로필 응답 타입
interface UserProfileData {
  userId: number;
  email: string;
  name: string;
  role: string;
  phoneNumber?: string;
  birthday?: string;
  profileImagePath?: string;
  address?: string;
  signedAt?: string;
  isDeactivate?: boolean;
}

// 사용자 선호도 응답 타입
interface UserPreferenceData {
  preferenceId: number;
  userId: number;
  nation: string;
  language: string;
  gender: string;
  visitPurpose: string;
  period: string;
  onBoardingPreference: string;
  isOnBoardDone: boolean;
  createdAt: string;
  updatedAt: string;
}

/**
 * Google 인증 URL 가져오기
 */
export const getGoogleAuthUrl = async () => {
  try {
    const response = await axiosInstance.get<{ authUrl: string }>('/auth/url');
    // 응답이 직접 데이터를 반환하므로 response.authUrl로 접근
    return (response as any).authUrl;
  } catch (error) {
    console.error('Google 인증 URL 가져오기 실패:', error);
    throw error;
  }
};

/**
 * OAuth 콜백 처리
 * 인증 코드를 백엔드로 전송하고 토큰을 받아 저장
 * 백엔드는 /auth/login 엔드포인트에서 JSON 응답으로 토큰을 반환함
 */
export const handleOAuthCallback = async (code: string) => {
  try {
    // 백엔드에 인증 코드 전송 (리다이렉트 없이 JSON 응답 받기)
    const response = await fetch(`${env.API_BASE_URL}/auth/login?code=${code}`, {
      method: 'GET',
      headers: {
        'Accept': 'application/json'
      },
      credentials: 'include' // 쿠키(특히 refreshToken) 전달을 위해 추가
    });

    if (!response.ok) {
      throw new Error('인증 토큰을 받지 못했습니다');
    }

    // 응답 헤더에서 토큰 확인
    const authHeader = response.headers.get('Authorization') || response.headers.get('authorization') || '';
    
    // 응답 본문 데이터 가져오기
    const data: OAuthResponse = await response.json();
    
    // 토큰 소스 결정 (헤더 우선, 없으면 응답 본문)
    const token = authHeader || data.token || '';
    const email = data.email || '';
    const name = data.name || '';
    const role = data.role || '';
    
    if (!token) {
      console.error('토큰이 응답에 없습니다. 헤더와 응답 본문 모두 확인했습니다.', {
        헤더: authHeader ? '있음' : '없음',
        응답본문: data
      });
      throw new Error('토큰이 응답에 없습니다');
    }

    console.log('OAuth 콜백: 토큰을 저장합니다.');
    
    // 토큰 저장 - tokenUtils 사용
    setToken(token);
    
    // 사용자 이메일 저장 (X-User-Email 헤더에 사용)
    if (email) {
      localStorage.setItem('userEmail', email);
    }
    
    // 사용자 이름 저장 (댓글/답글 작성 시 사용)
    if (name) {
      localStorage.setItem('userName', name);
    }
    
    // 사용자 권한 저장 (인증 확인용)
    if (role) {
      localStorage.setItem('userRole', role);
    }
    
    // 사용자 정보 구성
    const userId = getUserIdFromToken(token) || 0;
    
    const user: User = {
      userId,
      role: role || getRoleFromToken(token) || 'ROLE_USER',
      email: email || '',
      name: name || '',
      isOnBoardDone: data.isOnBoardDone !== undefined ? Boolean(data.isOnBoardDone) : false
    };
    
    // isOnBoardDone 값도 따로 저장 (폴백 시 사용)
    if (data.isOnBoardDone !== undefined) {
      localStorage.setItem('isOnBoardDone', String(data.isOnBoardDone));
    }
    
    return { token, user };
  } catch (error) {
    console.error('OAuth 콜백 처리 실패:', error);
    throw error;
  }
};

/**
 * 인증 상태 확인 (사용자 정보 가져오기)
 */
export const checkAuthStatus = async (): Promise<User> => {
  try {
    // tokenUtils의 getToken 함수 사용
    const token = getToken();
    
    if (!token) {
      throw new Error('토큰이 없습니다.');
    }

    try {
      // 프로필 정보 가져오기
      const profileResponse = await axiosInstance.get('/users/profile', {
        headers: {
          'Authorization': token
        }
      }) as any;

      // 선호도 정보 가져오기
      const preferenceResponse = await axiosInstance.get('/users/preference', {
        headers: {
          'Authorization': token
        }
      }) as any;
      
      // 응답에서 데이터 추출
      const profileData = profileResponse.data as UserProfileData; 
      const preferenceData = preferenceResponse.data as UserPreferenceData;
      
      // isOnBoardDone 값 로컬 스토리지에 저장 (폴백 로직에서 사용)
      localStorage.setItem('isOnBoardDone', String(preferenceData.isOnBoardDone));
      
      // 사용자 정보 반환 (백엔드 응답 구조에 맞게 매핑)
      const userData: User = {
        userId: profileData.userId,
        email: profileData.email,
        role: profileData.role,
        name: profileData.name,
        isOnBoardDone: Boolean(preferenceData.isOnBoardDone)
      };
      
      return userData;
      
    } catch (apiError) {
      console.warn('API에서 사용자 정보 가져오기 실패, 토큰에서 정보 추출 시도:', apiError);
      
      // API 호출 실패 시 토큰에서 직접 정보 추출 (백업 방법)
      const userId = getUserIdFromToken(token) || 0;
      const role = getRoleFromToken(token) || 'ROLE_USER';
      const email = localStorage.getItem('userEmail') || '';
      const name = localStorage.getItem('userName') || '';
      
      // localStorage에서 이전에 저장된 isOnBoardDone 값 확인
      const isOnBoardDone = localStorage.getItem('isOnBoardDone') === 'true';
      
      // 사용자 정보 반환
      return {
        userId,
        role,
        email,
        name,
        isOnBoardDone
      };
    }
  } catch (error) {
    console.error('인증 상태 확인 실패:', error);
    throw error;
  }
};

/**
 * 로그아웃
 */
export const logout = async () => {
  try {
    const token = getToken();
    if (token) {
      // 백엔드 로그아웃 API 호출
      await axiosInstance.post('/auth/logout', {}, {
        headers: { 'Authorization': token }
      });
    }
  } catch (error) {
    console.error('로그아웃 실패:', error);
  } finally {
    // 토큰 및 관련 정보 제거
    removeToken();
    localStorage.removeItem('userRole');
    localStorage.removeItem('userEmail');
    localStorage.removeItem('userName');
    localStorage.removeItem('isOnBoardDone');
  }
};

/**
 * JWT 토큰 직접 설정
 * 테스트나 외부에서 받은 토큰을 직접 설정할 때 사용
 */
export const setDirectToken = (token: string, user?: Partial<User>) => {
  if (!token) return;
  
  // tokenUtils를 통해 토큰 저장
  setToken(token);
  
  if (user) {
    if (user.email) localStorage.setItem('userEmail', user.email);
    if (user.name) localStorage.setItem('userName', user.name);
    if (user.role) localStorage.setItem('userRole', user.role);
    if (user.isOnBoardDone !== undefined) {
      localStorage.setItem('isOnBoardDone', String(user.isOnBoardDone));
    }
  }
};
