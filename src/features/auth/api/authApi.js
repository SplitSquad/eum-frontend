import axiosInstance from '../../../config/axios';
import { setToken, removeToken, getToken } from '../tokenUtils';
// JWT 토큰에서 userId 추출하는 유틸리티 함수
const getUserIdFromToken = (token) => {
    try {
        const payload = JSON.parse(atob(token.split('.')[1]));
        return payload.userId || 0;
    }
    catch (error) {
        console.error('JWT 디코딩 실패:', error);
        return 0;
    }
};
/**
 * 구글 OAuth 로그인 URL 가져오기
 */
export const getGoogleAuthUrl = async () => {
    try {
        const response = await axiosInstance.get('/auth/url');
        // 응답이 직접 데이터를 반환하므로 response.authUrl로 접근
        return response.authUrl;
    }
    catch (error) {
        console.error('Google 인증 URL 가져오기 실패:', error);
        throw error;
    }
};
/**
 * OAuth 콜백 처리
 * 인증 코드를 백엔드로 전송하고 토큰을 받아 저장
 * 백엔드는 /auth/login 엔드포인트에서 JSON 응답으로 토큰을 반환함
 */
export const handleOAuthCallback = async (code) => {
    try {
        // 백엔드에 인증 코드 전송 (리다이렉트 없이 JSON 응답 받기)
        const response = await fetch(`${import.meta.env.VITE_API_BASE_URL || 'http://localhost:8080'}/auth/login?code=${code}`, {
            method: 'GET',
            headers: {
                Accept: 'application/json',
            },
            credentials: 'include', // 쿠키(특히 refreshToken) 전달을 위해 추가
        });
        if (!response.ok) {
            throw new Error('인증 토큰을 받지 못했습니다');
        }
        // 응답 헤더에서 토큰 확인
        const authHeader = response.headers.get('Authorization') || response.headers.get('authorization') || '';
        // 응답 본문 데이터 가져오기
        const data = await response.json();
        // 토큰 소스 결정 (헤더 우선, 없으면 응답 본문)
        const token = authHeader || data.token || '';
        const email = data.email || '';
        const role = data.role || '';
        if (!token) {
            console.error('토큰이 응답에 없습니다. 헤더와 응답 본문 모두 확인했습니다.', {
                헤더: authHeader ? '있음' : '없음',
                응답본문: data,
            });
            throw new Error('토큰이 응답에 없습니다');
        }
        console.log('OAuth 콜백: 토큰을 로컬 스토리지에 저장합니다.');
        console.log('토큰 소스:', authHeader ? '헤더에서 가져옴' : '응답 본문에서 가져옴');
        // 토큰 저장
        setToken(token);
        // localStorage에도 토큰 저장 (axios 인터셉터가 사용하는 키)
        localStorage.setItem('auth_token', token);
        // 사용자 이메일 저장 (X-User-Email 헤더에 사용)
        if (email) {
            localStorage.setItem('userEmail', email);
            console.log('사용자 이메일 저장됨:', email);
        }
        console.log('토큰 저장됨, localStorage 확인:', localStorage.getItem('auth_token') ? '토큰 저장 성공' : '토큰 저장 실패');
        // 사용자 정보 구성 (서버에서 받은 email과 role을 직접 사용)
        const user = {
            userId: getUserIdFromToken(token),
            role: role || 'ROLE_USER',
            email: email || '',
        };
        return { token, user };
    }
    catch (error) {
        console.error('OAuth 콜백 처리 실패:', error);
        throw error;
    }
};
/**
 * 인증 상태 확인 (사용자 정보 가져오기)
 */
export const checkAuthStatus = async () => {
    try {
        const token = getToken() || localStorage.getItem('auth_token');
        if (!token) {
            throw new Error('토큰이 없습니다.');
        }
        try {
            // 프로필 정보 가져오기
            const profileResponse = await axiosInstance.get('/users/profile', {
                headers: {
                    Authorization: token,
                },
            });
            // 선호도 정보 가져오기
            const preferenceResponse = await axiosInstance.get('/users/preference', {
                headers: {
                    Authorization: token,
                },
            });
            console.log('선호도 정보:', preferenceResponse);
            console.log('프로필 정보:', profileResponse);
            // 사용자 정보 반환 (백엔드 응답 구조에 맞게 매핑)
            return {
                userId: profileResponse.userId,
                email: profileResponse.email,
                role: profileResponse.role,
                name: profileResponse.name,
                isOnBoardDone: preferenceResponse.isOnBoardDone || false,
            };
        }
        catch (apiError) {
            console.warn('API에서 사용자 정보 가져오기 실패, 토큰에서 정보 추출 시도:', apiError);
            // API 호출 실패 시 토큰에서 직접 정보 추출 (백업 방법)
            const payload = JSON.parse(atob(token.split('.')[1]));
            const userId = payload.userId || 0;
            const role = payload.role || 'ROLE_USER';
            const email = localStorage.getItem('userEmail') || '';
            console.log('토큰에서 추출한 사용자 정보:', { userId, role, email });
            // 사용자 정보 반환
            return {
                userId,
                role,
                email,
                // isOnBoardDone 정보는 토큰에서 추출할 수 없으므로 기본값으로 설정
                //isOnBoardDone: true, // 온보딩을 강제로 완료로 설정
            };
        }
    }
    catch (error) {
        console.error('인증 상태 확인 실패:', error);
        throw error;
    }
};
/**
 * 로그아웃
 */
export const logout = async () => {
    try {
        const token = getToken() || localStorage.getItem('auth_token');
        if (token) {
            // 백엔드 로그아웃 API 호출
            await axiosInstance.post('/auth/logout', {}, {
                headers: { Authorization: token },
            });
        }
    }
    catch (error) {
        console.error('로그아웃 실패:', error);
    }
    finally {
        // 로컬 스토리지에서 토큰 및 관련 정보 제거
        localStorage.removeItem('auth_token');
        localStorage.removeItem('userRole');
        localStorage.removeItem('userEmail');
        removeToken();
    }
};
/**
 * JWT 토큰 직접 설정
 * 테스트나 외부에서 받은 토큰을 직접 설정할 때 사용
 */
export const setJwtToken = (token) => {
    setToken(token);
    return { success: true, message: 'JWT 토큰이 성공적으로 설정되었습니다.' };
};
