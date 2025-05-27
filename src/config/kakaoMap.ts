import { devLog, env } from './env';

declare global {
  interface Window {
    kakao: any;
  }
}

/**
 * 카카오맵 API 키
 */
const KAKAO_MAP_API_KEY = env.KAKAO_MAP_API_KEY;

/**
 * API 키 유효성 검사
 */
const validateApiKey = (): boolean => {
  if (!KAKAO_MAP_API_KEY) {
    console.error('카카오맵 API 키가 설정되지 않았습니다.');
    return false;
  }
  
  if (KAKAO_MAP_API_KEY.length < 10) {
    console.error('카카오맵 API 키가 너무 짧습니다. 올바른 키인지 확인해주세요.');
    return false;
  }
  
  return true;
};

/**
 * 카카오맵 로드 상태 관리 (싱글톤)
 */
let isLoading = false;
let isLoaded = false;
let loadError: Error | null = null;
let resolvePromise: ((value: any) => void) | null = null;
let rejectPromise: ((reason: any) => void) | null = null;
let retryCount = 0;
const MAX_RETRY_COUNT = 3;

/**
 * 카카오맵 스크립트 로드 완료 프로미스
 */
let kakaoMapPromise: Promise<any> | null = null;

/**
 * 추가 초기화 필요 여부 (window.kakao는 있지만 maps가 완전히 초기화되지 않은 상태)
 */
const needsInitialization = (): boolean => {
  return (
    window.kakao && (!window.kakao.maps || !window.kakao.maps.LatLng || !window.kakao.maps.Map)
  );
};

/**
 * 글로벌 오브젝트 확인 및 초기화 상태 로깅
 */
const logKakaoStatus = () => {
  const status = {
    windowExists: typeof window !== 'undefined',
    kakaoExists: typeof window !== 'undefined' && !!window.kakao,
    mapsExists: typeof window !== 'undefined' && !!window.kakao && !!window.kakao.maps,
    mapClassExists:
      typeof window !== 'undefined' &&
      !!window.kakao &&
      !!window.kakao.maps &&
      !!window.kakao.maps.Map,
    latLngClassExists:
      typeof window !== 'undefined' &&
      !!window.kakao &&
      !!window.kakao.maps &&
      !!window.kakao.maps.LatLng,
  };

  console.log('카카오맵 상태 확인:', status);
  return status;
};

/**
 * 카카오맵 API 스크립트 로드 함수 - 단일 인스턴스 보장
 * @returns Promise<any> 스크립트 로드 완료 프로미스
 */
export const loadKakaoMapScript = (): Promise<any> => {
  // 상태 로깅
  logKakaoStatus();

  // 이미 완전히 로드됐으면 즉시 반환
  if (
    isLoaded &&
    window.kakao &&
    window.kakao.maps &&
    window.kakao.maps.Map &&
    window.kakao.maps.LatLng
  ) {
    console.log('카카오맵: 이미 완전히 초기화됨, 기존 인스턴스 반환');
    return Promise.resolve(window.kakao.maps);
  }

  // 추가 초기화가 필요한 경우
  if (needsInitialization()) {
    console.log('카카오맵: 부분적으로 로드됨, 추가 초기화 필요');
    // 기존 Promise 취소 및 새 Promise 생성
    isLoading = false;
    isLoaded = false;
    loadError = null;
    kakaoMapPromise = null;
  } else if (isLoading && kakaoMapPromise) {
    console.log('카카오맵: 로드 중, 기존 프로미스 반환');
    return kakaoMapPromise;
  }

  // 이전 로드 시도에서 에러가 있었으면 초기화
  if (loadError) {
    console.log('카카오맵: 이전 로드 오류 초기화');
    isLoading = false;
    isLoaded = false;
    loadError = null;
    kakaoMapPromise = null;
  }

  // API 키 유효성 검사
  if (!validateApiKey()) {
    const error = new Error(
      '카카오맵 API 키가 설정되지 않았습니다. .env 파일에 VITE_KAKAO_MAP_API_KEY를 설정해주세요.'
    );
    console.error(error.message);
    return Promise.reject(error);
  }

  // 새 로드 프로세스 시작
  isLoading = true;
  console.log(`카카오맵: 스크립트 로드 시작 (API 키: ${KAKAO_MAP_API_KEY.substring(0, 5)}...)`);

  // 프로미스 생성
  kakaoMapPromise = new Promise((resolve, reject) => {
    resolvePromise = resolve;
    rejectPromise = reject;

    // 타임아웃 추가 (30초)
    const globalTimeout = setTimeout(() => {
      handleError(new Error('카카오맵: 스크립트 로드 타임아웃 (30초)'));
    }, 30000);

    // 성공 핸들러 래퍼
    const successHandler = (maps: any) => {
      clearTimeout(globalTimeout);
      completeLoad(maps);
    };

    // 에러 핸들러 래퍼
    const errorHandler = (error: Error) => {
      clearTimeout(globalTimeout);
      handleError(error);
    };

    try {
      // 이미 스크립트가 DOM에 있는지 확인
      const existingScript = document.querySelector('script[src*="dapi.kakao.com/v2/maps/sdk.js"]');

      if (existingScript) {
        console.log('카카오맵: 스크립트가 이미 DOM에 존재함');

        // 초기화 상태 확인
        if (
          window.kakao &&
          window.kakao.maps &&
          window.kakao.maps.Map &&
          window.kakao.maps.LatLng
        ) {
          // 이미 완전히 초기화된 경우
          console.log('카카오맵: window.kakao.maps 완전히 초기화됨');
          successHandler(window.kakao.maps);
        } else if (window.kakao && window.kakao.maps && window.kakao.maps.load) {
          // maps 객체가 있지만 완전히 초기화되지 않은 경우
          console.log('카카오맵: maps 객체 있음, 추가 초기화 필요');
          loadMapsModule(successHandler, errorHandler);
        } else if (window.kakao) {
          // kakao 객체는 있지만 maps가 없거나 불완전한 경우
          console.log('카카오맵: window.kakao 존재하지만 maps 없음 또는 불완전함');
          replaceScript(successHandler, errorHandler);
        } else {
          // 스크립트는 있지만 kakao 객체가 없는 경우
          console.log('카카오맵: 스크립트 존재하지만 window.kakao 없음');
          replaceScript(successHandler, errorHandler);
        }
      } else {
        // 스크립트가 없는 경우 새로 생성
        console.log('카카오맵: 스크립트가 DOM에 없음, 새로 생성');
        createScript(successHandler, errorHandler);
      }
    } catch (error) {
      errorHandler(
        error instanceof Error ? error : new Error('카카오맵: 초기화 중 알 수 없는 오류')
      );
    }
  });

  return kakaoMapPromise;
};

/**
 * 스크립트 생성 및 추가
 */
function createScript(onSuccess: (maps: any) => void, onError: (error: Error) => void) {
  try {
    console.log('카카오맵: 새 스크립트 생성');
    
    // 기존 스크립트 제거 (중복 방지)
    const existingScript = document.querySelector('script[src*="dapi.kakao.com"]');
    if (existingScript) {
      console.log('카카오맵: 기존 스크립트 제거');
      existingScript.remove();
    }
    
    const script = document.createElement('script');
    script.type = 'text/javascript';
    script.async = true;
    script.defer = true;
    script.crossOrigin = 'anonymous'; // CORS 설정 추가
    script.src = `https://dapi.kakao.com/v2/maps/sdk.js?appkey=${KAKAO_MAP_API_KEY}&autoload=false&libraries=services,clusterer,drawing,geometry`;

          // 20초 타임아웃 설정 (더 여유롭게)
      const timeout = setTimeout(() => {
        script.remove();
        onError(new Error('카카오맵: 스크립트 다운로드 타임아웃 (20초) - 네트워크 상태를 확인해주세요'));
      }, 20000);

    script.onload = () => {
      clearTimeout(timeout);
      console.log('카카오맵: 스크립트 다운로드 완료');

      if (!window.kakao) {
        onError(new Error('카카오맵: 스크립트 로드 후 window.kakao 객체가 없음'));
        return;
      }

      // 스크립트 로드 후 추가 지연 (더 안정적으로)
      setTimeout(() => {
        loadMapsModule(onSuccess, onError);
      }, 500); // 500ms 지연으로 스크립트 초기화 시간 확보
    };

    script.onerror = event => {
      clearTimeout(timeout);
      script.remove();
      console.error('카카오맵: 스크립트 로드 실패', event);
      onError(new Error('카카오맵: 스크립트 로드 실패 - 네트워크 오류 또는 API 키 문제'));
    };

    document.head.appendChild(script);
    console.log('카카오맵: 스크립트 DOM에 추가됨');
  } catch (error) {
    onError(
      error instanceof Error ? error : new Error('카카오맵: 스크립트 생성 중 알 수 없는 오류')
    );
  }
}

/**
 * 기존 스크립트 교체
 */
function replaceScript(onSuccess: (maps: any) => void, onError: (error: Error) => void) {
  try {
    console.log('카카오맵: 기존 스크립트 교체');

    // 기존 스크립트 제거
    const existingScript = document.querySelector('script[src*="dapi.kakao.com/v2/maps/sdk.js"]');
    if (existingScript && existingScript.parentNode) {
      existingScript.parentNode.removeChild(existingScript);
    }

    // 전역 객체 정리
    try {
      if (window.kakao) {
        if (window.kakao._cleanup) {
          window.kakao._cleanup();
        }

        // 안전하게 kakao 객체 재설정 시도
        delete window.kakao;
      }
    } catch (cleanupError) {
      console.warn('카카오맵: 전역 객체 정리 중 오류', cleanupError);
    }

    // 새 스크립트 생성 전 잠시 지연
    setTimeout(() => {
      createScript(onSuccess, onError);
    }, 300);
  } catch (error) {
    onError(
      error instanceof Error ? error : new Error('카카오맵: 스크립트 교체 중 알 수 없는 오류')
    );
  }
}

/**
 * Maps 모듈 로드
 */
function loadMapsModule(onSuccess: (maps: any) => void, onError: (error: Error) => void) {
  try {
    console.log('카카오맵: maps 모듈 로드 시작');

    if (!window.kakao) {
      onError(new Error('카카오맵: window.kakao 객체가 없음'));
      return;
    }

    if (!window.kakao.maps) {
      onError(new Error('카카오맵: window.kakao.maps 객체가 없음'));
      return;
    }

    if (!window.kakao.maps.load) {
      onError(new Error('카카오맵: maps.load 함수가 없음'));
      return;
    }

    // 3초 타임아웃 설정
    const timeout = setTimeout(() => {
      onError(new Error('카카오맵: maps 모듈 로드 타임아웃 (3초)'));
    }, 3000);

    window.kakao.maps.load(() => {
      clearTimeout(timeout);

      // 추가 검증
      if (!window.kakao.maps.Map) {
        onError(new Error('카카오맵: Map 클래스가 로드되지 않음'));
        return;
      }

      if (!window.kakao.maps.LatLng) {
        onError(new Error('카카오맵: LatLng 클래스가 로드되지 않음'));
        return;
      }

      console.log('카카오맵: maps 모듈 로드 완료');

      // 서비스 로드 확인
      if (window.kakao.maps.services) {
        console.log('카카오맵: services 라이브러리 로드됨');
      } else {
        console.warn('카카오맵: services 라이브러리 누락됨');
      }

      if (window.kakao.maps.geometry) {
        console.log('카카오맵: geometry 라이브러리 로드됨');
      } else {
        console.warn('카카오맵: geometry 라이브러리 누락됨');
      }

      // 핵심 객체 테스트 시도
      try {
        const testLatLng = new window.kakao.maps.LatLng(37.5665, 126.978);
        console.log('카카오맵: LatLng 생성 테스트 성공');
      } catch (testError) {
        console.error('카카오맵: LatLng 생성 테스트 실패', testError);
        // 실패해도 계속 진행 (나중에 재시도 가능)
      }

      // 추가 지연 후 성공 처리 (더 안정적인 초기화 보장)
      setTimeout(() => {
        onSuccess(window.kakao.maps);
      }, 200);
    });
  } catch (error) {
    onError(
      error instanceof Error ? error : new Error('카카오맵: maps 모듈 로드 중 알 수 없는 오류')
    );
  }
}

/**
 * 로드 완료 처리
 */
function completeLoad(maps: any) {
  isLoaded = true;
  isLoading = false;
  console.log('카카오맵: 로드 완료');

  if (resolvePromise) {
    resolvePromise(maps);
    resolvePromise = null;
    rejectPromise = null;
  }
}

/**
 * 오류 처리
 */
function handleError(error: Error) {
  console.error('카카오맵 로드 오류:', error.message);
  loadError = error;
  isLoading = false;

  if (rejectPromise) {
    rejectPromise(error);
    resolvePromise = null;
    rejectPromise = null;
  }
}

/**
 * 카카오맵 인스턴스를 생성하는 함수
 * @param elementId 지도를 표시할 HTML 요소의 ID
 * @param options 지도 옵션
 * @returns Promise<any> 지도 인스턴스 프로미스
 */
export const createKakaoMap = async (
  element: HTMLElement | string,
  options?: {
    center?: { latitude: number; longitude: number };
    level?: number;
  }
): Promise<any> => {
  try {
    const kakaoMaps = await loadKakaoMapScript();

    // 컨테이너 요소 가져오기
    const container = typeof element === 'string' ? document.getElementById(element) : element;

    if (!container) {
      throw new Error(`지도 컨테이너를 찾을 수 없습니다.`);
    }

    // 컨테이너 크기 확인 및 조정
    const { clientWidth, clientHeight } = container;
    if (clientWidth === 0 || clientHeight === 0) {
      console.warn('지도 컨테이너의 크기가 0입니다. 지도가 제대로 표시되지 않을 수 있습니다.');
      container.style.width = '100%';
      container.style.minHeight = '200px';

      // 컨테이너 크기 조정을 위한 리플로우 유도
      container.getBoundingClientRect();
    }

    // 안전한 지도 옵션 설정
    try {
      const mapOptions = {
        center: new kakaoMaps.LatLng(
          options?.center?.latitude || 37.5665, // 서울 중심부 기본값
          options?.center?.longitude || 126.978
        ),
        level: options?.level || 3, // 기본 확대 레벨
      };

      // 지도 인스턴스 생성
      console.log('카카오맵: 지도 인스턴스 생성 시작');
      const mapInstance = new kakaoMaps.Map(container, mapOptions);
      console.log('카카오맵: 지도 인스턴스 생성 완료');

      return mapInstance;
    } catch (mapError) {
      // LatLng 생성자 오류인 경우 재시도
      if (mapError instanceof Error && mapError.message.includes('not a constructor')) {
        console.warn('카카오맵: LatLng 생성자 오류, 재초기화 후 재시도');

        // 재초기화 시도
        isLoaded = false;
        const reloadedMaps = await loadKakaoMapScript();

        // 재시도
        const mapOptions = {
          center: new reloadedMaps.LatLng(
            options?.center?.latitude || 37.5665,
            options?.center?.longitude || 126.978
          ),
          level: options?.level || 3,
        };

        return new reloadedMaps.Map(container, mapOptions);
      }

      throw mapError;
    }
  } catch (error) {
    console.error('카카오맵 생성 실패:', error);
    throw error;
  }
};

/**
 * 좌표로 주소를 얻는 함수 (좌표 -> 주소 변환)
 * @param map 카카오맵 인스턴스
 * @param latitude 위도
 * @param longitude 경도
 * @returns Promise<string> 주소 프로미스
 */
export const getAddressFromCoords = async (
  map: any,
  latitude: number,
  longitude: number
): Promise<string> => {
  try {
    await loadKakaoMapScript();

    return new Promise((resolve, reject) => {
      if (!window.kakao || !window.kakao.maps || !window.kakao.maps.services) {
        return reject(new Error('카카오맵 services 라이브러리가 로드되지 않았습니다.'));
      }

      const geocoder = new window.kakao.maps.services.Geocoder();

      geocoder.coord2Address(longitude, latitude, (result: any[], status: any) => {
        if (status === window.kakao.maps.services.Status.OK) {
          if (result[0]?.address) {
            resolve(result[0].address.address_name);
          } else {
            resolve('주소를 찾을 수 없습니다.');
          }
        } else {
          reject(new Error(`주소 검색 실패 (상태: ${status})`));
        }
      });
    });
  } catch (error) {
    console.error('주소 검색 실패:', error);
    throw error;
  }
};

/**
 * 주소로 좌표를 얻는 함수 (주소 -> 좌표 변환)
 * @param map 카카오맵 인스턴스
 * @param address 주소
 * @returns Promise<{latitude: number, longitude: number}> 좌표 프로미스
 */
export const getCoordsFromAddress = async (
  map: any,
  address: string
): Promise<{ latitude: number; longitude: number }> => {
  try {
    await loadKakaoMapScript();

    return new Promise((resolve, reject) => {
      if (!window.kakao || !window.kakao.maps || !window.kakao.maps.services) {
        return reject(new Error('카카오맵 services 라이브러리가 로드되지 않았습니다.'));
      }

      const geocoder = new window.kakao.maps.services.Geocoder();

      geocoder.addressSearch(address, (result: any[], status: any) => {
        if (status === window.kakao.maps.services.Status.OK) {
          resolve({
            latitude: parseFloat(result[0].y),
            longitude: parseFloat(result[0].x),
          });
        } else {
          reject(new Error(`좌표 검색 실패 (상태: ${status})`));
        }
      });
    });
  } catch (error) {
    console.error('좌표 검색 실패:', error);
    throw error;
  }
};

/**
 * 길찾기 페이지 URL 생성 함수
 * @param startName 출발지 이름
 * @param startLat 출발지 위도
 * @param startLng 출발지 경도
 * @param endName 도착지 이름
 * @param endLat 도착지 위도
 * @param endLng 도착지 경도
 * @returns 길찾기 페이지 URL
 */
export const getKakaoMapDirectionsUrl = (
  startName: string,
  startLat: number,
  startLng: number,
  endName: string,
  endLat: number,
  endLng: number
): string => {
  // 카카오맵 길찾기 페이지로 연결
  const kakaoMapUrl = `https://map.kakao.com/link/to/${encodeURIComponent(endName)},${endLat},${endLng}`;
  
  return kakaoMapUrl;
};
