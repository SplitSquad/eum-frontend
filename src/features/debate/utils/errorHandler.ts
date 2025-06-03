import { AxiosError } from 'axios';

/**
 * API 에러 처리 및 토스트 메시지 표시 유틸리티
 */

// 토스트 메시지 이벤트 - 외부 컴포넌트에서 구독 가능
type ToastEventType = 'error' | 'warning' | 'info' | 'success';

export interface ToastEvent {
  type: ToastEventType;
  message: string;
  duration?: number;
}

// 간단한 이벤트 발행-구독 메커니즘
const subscribers: ((event: ToastEvent) => void)[] = [];

export function subscribeToToasts(callback: (event: ToastEvent) => void) {
  subscribers.push(callback);
  return () => {
    const index = subscribers.indexOf(callback);
    if (index !== -1) {
      subscribers.splice(index, 1);
    }
  };
}

export function showToast(type: ToastEventType, message: string, duration = 3000) {
  const event: ToastEvent = { type, message, duration };
  subscribers.forEach(subscriber => subscriber(event));
}

/**
 * API 에러 처리 함수
 * @param error API 호출 중 발생한 에러
 * @param defaultMessage 기본 에러 메시지
 * @param showToastMessage 토스트 메시지를 표시할지 여부
 * @returns 에러 메시지
 */
export function handleApiError(error: unknown, defaultMessage = 'An error occurred while processing the request.', showToastMessage = true): string {
  let errorMessage = defaultMessage;
  
  if (error instanceof Error) {
    console.error(error.message);
    errorMessage = error.message;
    
    // Axios 에러 처리
    if ((error as AxiosError).isAxiosError) {
      const axiosError = error as AxiosError;
      
      if (axiosError.response) {
        // 서버에서 응답이 온 경우
        const status = axiosError.response.status;
        const responseData = axiosError.response.data as any;
        
        // 서버 응답에서 에러 메시지 추출
        if (responseData) {
          if (responseData.message) {
            errorMessage = responseData.message;
          } else if (responseData.error) {
            errorMessage = responseData.error;
          }
        }
        
        // 상태 코드별 메시지
        if (!errorMessage || errorMessage === defaultMessage) {
          if (status === 400) {
            errorMessage = 'Invalid request.';
          } else if (status === 401) {
            errorMessage = 'Login is required.';
          } else if (status === 403) {
            errorMessage = 'Access denied.';
          } else if (status === 404) {
            errorMessage = 'Requested data not found.';
          } else if (status === 500) {
            errorMessage = 'Server error occurred.';
          }
        }
      } else if (axiosError.request) {
        // 요청은 보냈지만 응답이 없는 경우 (네트워크 오류 등)
        errorMessage = 'Cannot connect to server. Please check your network connection.';
      }
    }
  }
  
  // 토스트 메시지 표시
  if (showToastMessage) {
    showToast('error', errorMessage);
  }
  
  return errorMessage;
}

/**
 * API 성공 메시지 처리 함수
 * @param message 성공 메시지
 * @param showToastMessage 토스트 메시지를 표시할지 여부
 */
export function showSuccessMessage(message: string, showToastMessage = true): void {
  if (showToastMessage) {
    showToast('success', message);
  }
}

/**
 * 경고 메시지 표시 함수
 * @param message 경고 메시지
 * @param showToastMessage 토스트 메시지를 표시할지 여부
 */
export function showWarningMessage(message: string, showToastMessage = true): void {
  if (showToastMessage) {
    showToast('warning', message);
  }
}

export default {
  handleApiError,
  showToast,
  showSuccessMessage,
  showWarningMessage,
  subscribeToToasts
}; 