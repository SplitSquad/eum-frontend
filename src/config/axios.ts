import axios, { AxiosError, AxiosInstance, AxiosRequestConfig, AxiosResponse } from 'axios';

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
};

/**
 * 기본 axios 인스턴스 생성
 */
const axiosInstance: AxiosInstance = axios.create(config);

/**
 * 요청 인터셉터 - 모든 요청에 토큰 추가 및 요청 로깅
 */
axiosInstance.interceptors.request.use(
  config => {
    // 로컬 스토리지에서 토큰 가져오기
    const token = localStorage.getItem('auth_token');

    console.log('인터셉터 실행: 토큰 확인', token ? '토큰 있음' : '토큰 없음');

    // 요청 헤더에 인증 토큰 추가
    if (token && config.headers) {
      // Authorization 헤더에 Bearer 접두사 추가 (JWT 토큰 표준)
      config.headers.Authorization = `${token}`;
      console.log('토큰 헤더 추가됨:', `${token.substring(0, 10)}...`);
    } else if (config.headers) {
      // 토큰이 없는 경우 테스트용 토큰 추가 (개발 중에만 사용)
      const testToken =
        'eyJhbGciOiJIUzI1NiJ9.eyJ1c2VySWQiOjQsInJvbGUiOiJST0xFX1VTRVIiLCJpYXQiOjE3NDQ4NjkyNzgsImV4cCI6MTc0ODQ2OTI3OH0.iJQ-_ej0AWjrFI5z0t7R4Y0uKmUJ8tyQalXu3qlfHA4';
      config.headers.Authorization = `${testToken}`;
      console.log('테스트 토큰 사용:', `${testToken}`);
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
  (error: AxiosError) => {
    // 응답이 있는 경우 상태 코드 확인
    if (error.response) {
      const { status, data } = error.response;
      const requestUrl = error.config?.url || '알 수 없는 URL';

      // 401 Unauthorized - 인증 실패/토큰 만료
      if (status === 401) {
        // 로컬 스토리지 토큰 삭제
        localStorage.removeItem('auth_token');

        // 로그인 페이지로 리다이렉트 (필요에 따라 주석 해제)
        // window.location.href = '/login';

        console.error(
          `인증 오류 (401): ${requestUrl} - 인증이 필요하거나 토큰이 만료되었습니다.`,
          data
        );
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
