import axios, { AxiosError, AxiosInstance, AxiosRequestConfig, AxiosResponse } from 'axios';
import { setToken, getToken } from '../features/auth/tokenUtils';
import { checkDomainOfScale } from 'recharts/types/util/ChartUtils';

// 환경 변수 타입 확인이 필요하면 env.ts에서 import
// import { ENV } from './env';

/**
 * API 요청의 기본 URL과 타임아웃 설정
 */
const config: AxiosRequestConfig = {
  baseURL: import.meta.env.VITE_API_BASE_URL || 'http://localhost:8080',
  timeout: 30000, // 30초
  headers: {
    'Content-Type': 'application/json',
    Accept: 'application/json',
  },
  withCredentials: true, // 크로스 도메인 요청에서 쿠키 포함
  maxRedirects: 0, // 리다이렉션 방지
  validateStatus: status => {
    return status >= 200 && status < 400; // 400 미만의 모든 상태 코드를 성공으로 처리
  },
};

/**
 * 기본 axios 인스턴스 생성
 */
const axiosInstance: AxiosInstance = axios.create(config);

// 토큰 갱신 중인지 체크하는 플래그
let isRefreshing = false;

// 토큰 갱신을 대기하는 요청 큐
let refreshSubscribers: Array<(token: string) => void> = [];

// 토큰 갱신 함수
const refreshAuthToken = async (): Promise<string | null> => {
  try {
    console.log('토큰 갱신 시도');

    // 쿠키에서 refreshToken을 직접 사용 (axios는 withCredentials: true로 설정되어 있어서 쿠키가 함께 전송됨)
    const response = await axios.post(
      `${config.baseURL}/auth/refresh`,
      {},
      {
        withCredentials: true, // Refresh token cookie를 함께 전송
        validateStatus: status => status >= 200 && status < 400, // 응답 검증
      }
    );

    // 백엔드는 Authorization 헤더에 새 토큰을 포함시킴
    const newToken = response.headers.authorization || response.headers.Authorization;

    if (newToken) {
      console.log('토큰 갱신 성공: 헤더에서 토큰 추출');
      // 새 토큰 저장
      setToken(newToken);
      localStorage.setItem('auth_token', newToken);
      return newToken;
    }

    // 헤더에 토큰이 없는 경우 응답 본문도 확인 (백엔드가 수정될 경우를 대비)
    if (response.data && response.data.token) {
      console.log('토큰 갱신 성공: 응답 본문에서 토큰 추출');
      const tokenFromBody = response.data.token;
      setToken(tokenFromBody);
      localStorage.setItem('auth_token', tokenFromBody);
      return tokenFromBody;
    }

    console.warn('토큰 갱신 응답에서 토큰을 찾을 수 없습니다:', response);
    return null;
  } catch (error: any) {
    console.error('토큰 갱신 실패:', error);

    // 오류 세부 정보 로깅
    if (error.response) {
      console.error('토큰 갱신 오류 응답:', error.response.status, error.response.data);
    } else if (error.request) {
      console.error('토큰 갱신 요청 오류 (응답 없음):', error.request);
    } else {
      console.error('토큰 갱신 요청 설정 오류:', error.message);
    }

    return null;
  }
};

// 토큰 갱신 후 이전 요청을 다시 실행하기 위한 함수
const onRefreshed = (token: string) => {
  refreshSubscribers.forEach(callback => callback(token));
  refreshSubscribers = [];
};

// 요청이 완료될 때까지 대기하는 함수
const addSubscriber = (callback: (token: string) => void) => {
  refreshSubscribers.push(callback);
};

/**
 * 요청 인터셉터 - 모든 요청에 토큰 추가 및 요청 로깅
 */
axiosInstance.interceptors.request.use(
  config => {
    // 로컬 스토리지에서 토큰 가져오기
    const token = getToken() || localStorage.getItem('auth_token');

    // 개발 환경에서만 로깅
    if (import.meta.env.DEV) {
      console.log('인터셉터 실행: 토큰 확인', token ? '토큰 있음' : '토큰 없음');
      if (token) {
        console.log('토큰 첫 부분:', token.substring(0, 15) + '...');
        try {
          // JWT 디코딩 시도 (디버깅용)
          const parts = token.split('.');
          if (parts.length === 3) {
            const payload = JSON.parse(atob(parts[1]));
            console.log('토큰 페이로드:', payload);
          }
        } catch (e) {
          console.error('토큰 디코딩 실패:', e);
        }
      }
    }

    // 요청 헤더에 인증 토큰 추가
    if (token && config.headers) {
      // Authorization 헤더에 토큰 설정 (Bearer 접두사 없이 토큰만 전달)
      config.headers.Authorization = token;

      // 헤더 설정 메서드가 있는 경우 사용 (Axios v1.x 이상의 형식)
      if (typeof config.headers.set === 'function') {
        config.headers.set('Authorization', token);
      }

      if (import.meta.env.DEV) {
        console.log('토큰 헤더 추가됨:', `${token.substring(0, 10)}...`);
      }
    } else if (config.headers) {
      // 토큰이 없는 경우 로깅만 수행
      console.log('토큰 없음, 인증 헤더 추가되지 않음');
    }

    // 개발 환경에서 요청 로깅
    if (import.meta.env.DEV) {
      console.log('API 요청:', config.url, config.method, config.data);
      console.log('요청 헤더:', config.headers);
    }

    return config;
  },
  (error: AxiosError) => {
    return Promise.reject(error);
  }
);

/**
 * 응답 인터셉터 - 응답 처리 및 에러 핸들링
 */
axiosInstance.interceptors.response.use(
  (response: AxiosResponse) => {
    // 개발 환경에서 응답 로깅
    if (import.meta.env.DEV) {
      console.log('API 응답:', response.config.url, response.status, response.data);
    }

    // 응답 데이터만 반환
    return response.data;
  },
  async (error: AxiosError) => {
    // 응답이 있는 경우 상태 코드 확인
    if (error.response) {
      const { status, data } = error.response;
      const requestUrl = error.config?.url || '알 수 없는 URL';
      const originalRequest = error.config;

      // 401 Unauthorized - 인증 실패/토큰 만료 처리
      if (status === 401 && originalRequest) {
        // 토큰 갱신 API가 아닌 경우에만 갱신 시도
        console.log('토큰 갱신 시도2');
        if (requestUrl !== '/auth/refresh' && !isRefreshing) {
          isRefreshing = true;

          try {
            // 토큰 갱신 시도
            const newToken = await refreshAuthToken();

            if (newToken) {
              // 갱신 성공: 기존 요청 재시도를 위한 콜백 실행
              onRefreshed(newToken);

              // 원래 요청 재시도
              if (originalRequest.headers) {
                // Authorization 헤더 설정
                originalRequest.headers.Authorization = newToken;
                // 기존 오류가 헤더 자체를 수정했을 수 있으므로 복원
                if (typeof originalRequest.headers.set === 'function') {
                  originalRequest.headers.set('Authorization', newToken);
                }
              }

              isRefreshing = false;
              return axios(originalRequest);
            } else {
              // 갱신 실패: 로그인 페이지로 이동
              console.error('토큰 갱신 실패, 로그인 필요');
              // 토큰 및 관련 정보 정리
              localStorage.removeItem('auth_token');
              sessionStorage.removeItem('auth_token');
              localStorage.removeItem('userEmail');

              // 로그인 페이지로 이동 전에 플래그 리셋
              isRefreshing = false;
              window.location.href = '/login';
            }
          } catch (refreshError) {
            console.error('토큰 갱신 중 오류:', refreshError);
            localStorage.removeItem('auth_token');
            sessionStorage.removeItem('auth_token');
            localStorage.removeItem('userEmail');

            isRefreshing = false;
            window.location.href = '/login';
          }
        } else if (requestUrl !== '/auth/refresh' && isRefreshing) {
          console.log('토큰 갱신 시도3');
          // 이미 토큰 갱신 중이면 갱신 완료 후 요청 재시도를 위해 큐에 추가
          return new Promise(resolve => {
            addSubscriber((token: string) => {
              if (originalRequest.headers) {
                originalRequest.headers.Authorization = token;
                if (typeof originalRequest.headers.set === 'function') {
                  originalRequest.headers.set('Authorization', token);
                }
              }
              resolve(axios(originalRequest));
            });
          });
        } else {
          // 토큰 갱신 API 자체가 401 반환 시
          console.error('인증 오류 (401): 토큰 갱신 불가, 로그인 필요');
          localStorage.removeItem('auth_token');
          sessionStorage.removeItem('auth_token');
          localStorage.removeItem('userEmail');

          window.location.href = '/login';
        }
      }

      // 403 Forbidden - 권한 없음
      else if (status === 403) {
        console.error(`권한 오류 (403): ${requestUrl} - 해당 요청에 대한 권한이 없습니다.`, data);
      }

      // 404 Not Found - 리소스 없음
      else if (status === 404) {
        console.error(`리소스 없음 (404): ${requestUrl} - 요청한 리소스를 찾을 수 없습니다.`, data);
      }

      // 400 Bad Request - 잘못된 요청
      else if (status === 400) {
        console.error(`잘못된 요청 (400): ${requestUrl} - 요청 형식이 올바르지 않습니다.`, data);
      }

      // 429 Too Many Requests - 요청 제한
      else if (status === 429) {
        console.error(`요청 제한 (429): ${requestUrl} - 너무 많은 요청을 보냈습니다.`, data);
      }

      // 500 Internal Server Error - 서버 오류
      else if (status >= 500) {
        console.error(`서버 오류 (${status}): ${requestUrl} - 서버에서 오류가 발생했습니다.`, data);
      }

      // 기타 오류
      else {
        console.error(`API 오류 (${status}): ${requestUrl}`, data);
      }
    }
    // 네트워크 오류 또는 요청 설정 오류
    else if (error.request) {
      console.error('네트워크 오류:', error.message, '- 서버에 연결할 수 없거나 응답이 없습니다.');
    }
    // 그 외 오류
    else {
      console.error('API 요청 준비 중 오류가 발생했습니다:', error.message);
    }

    // 오류를 컴포넌트에서 처리할 수 있도록 reject
    return Promise.reject(error);
  }
);

/**
 * ApiClient 클래스 - 표준화된 HTTP 메서드 제공
 */
class ApiClient {
  private instance: AxiosInstance;

  constructor() {
    this.instance = axiosInstance;
  }

  // GET 요청
  async get<T>(url: string, config?: AxiosRequestConfig): Promise<T> {
    try {
      return await this.instance.get<T, T>(url, config);
    } catch (error) {
      throw error;
    }
  }

  // POST 요청
  async post<T>(url: string, data?: any, config?: AxiosRequestConfig): Promise<T> {
    try {
      return await this.instance.post<T, T>(url, data, config);
    } catch (error) {
      throw error;
    }
  }

  // PUT 요청
  async put<T>(url: string, data?: any, config?: AxiosRequestConfig): Promise<T> {
    try {
      return await this.instance.put<T, T>(url, data, config);
    } catch (error) {
      throw error;
    }
  }

  // PATCH 요청
  async patch<T>(url: string, data?: any, config?: AxiosRequestConfig): Promise<T> {
    try {
      return await this.instance.patch<T, T>(url, data, config);
    } catch (error) {
      throw error;
    }
  }

  // DELETE 요청
  async delete<T>(url: string, config?: AxiosRequestConfig): Promise<T> {
    try {
      return await this.instance.delete<T, T>(url, config);
    } catch (error) {
      throw error;
    }
  }
}

// 기본 API 클라이언트 인스턴스 생성
const apiClient = new ApiClient();

export { axiosInstance };
export default apiClient;
