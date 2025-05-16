import { env, devLog } from './env';
/**
 * 카카오맵 API 키
 */
const KAKAO_MAP_API_KEY = env.KAKAO_MAP_API_KEY;
/**
 * 카카오맵 스크립트 로드 상태
 */
let isScriptLoaded = false;
/**
 * 카카오맵 스크립트 로드 완료 프로미스
 */
let kakaoMapPromise = null;
/**
 * 카카오맵 API 스크립트 로드 함수
 * @returns Promise<any> 스크립트 로드 완료 프로미스
 */
export const loadKakaoMapScript = () => {
    // 이미 프로미스가 있으면 재사용
    if (kakaoMapPromise) {
        return kakaoMapPromise;
    }
    // 이미 로드된 경우 완료된 프로미스 반환
    if (isScriptLoaded && window.kakao && window.kakao.maps) {
        return Promise.resolve(window.kakao.maps);
    }
    // API 키 확인
    if (!KAKAO_MAP_API_KEY) {
        return Promise.reject(new Error('카카오맵 API 키가 설정되지 않았습니다.'));
    }
    // 새 프로미스 생성 및 스크립트 로드
    kakaoMapPromise = new Promise((resolve, reject) => {
        try {
            const script = document.createElement('script');
            script.type = 'text/javascript';
            script.src = `//dapi.kakao.com/v2/maps/sdk.js?appkey=${KAKAO_MAP_API_KEY}&autoload=false&libraries=services,clusterer,drawing`;
            script.async = true;
            script.onload = () => {
                window.kakao.maps.load(() => {
                    isScriptLoaded = true;
                    devLog('카카오맵 스크립트 로드 완료');
                    resolve(window.kakao.maps);
                });
            };
            script.onerror = e => {
                reject(new Error('카카오맵 스크립트 로드 실패'));
            };
            document.head.appendChild(script);
        }
        catch (error) {
            reject(error);
        }
    });
    return kakaoMapPromise;
};
/**
 * 카카오맵 인스턴스를 생성하는 함수
 * @param elementId 지도를 표시할 HTML 요소의 ID
 * @param options 지도 옵션
 * @returns Promise<any> 지도 인스턴스 프로미스
 */
export const createKakaoMap = async (elementId, options) => {
    try {
        const kakaoMaps = await loadKakaoMapScript();
        const container = document.getElementById(elementId);
        if (!container) {
            throw new Error(`요소 ID "${elementId}"를 찾을 수 없습니다.`);
        }
        const mapOptions = {
            center: new kakaoMaps.LatLng(options?.center?.latitude || 37.5665, // 서울 중심부 기본값
            options?.center?.longitude || 126.978),
            level: options?.level || 3, // 기본 확대 레벨
        };
        return new kakaoMaps.Map(container, mapOptions);
    }
    catch (error) {
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
export const getAddressFromCoords = async (map, latitude, longitude) => {
    try {
        await loadKakaoMapScript();
        return new Promise((resolve, reject) => {
            const geocoder = new window.kakao.maps.services.Geocoder();
            geocoder.coord2Address(longitude, latitude, (result, status) => {
                if (status === window.kakao.maps.services.Status.OK) {
                    if (result[0]?.address) {
                        resolve(result[0].address.address_name);
                    }
                    else {
                        resolve('주소를 찾을 수 없습니다.');
                    }
                }
                else {
                    reject(new Error('주소 검색 실패'));
                }
            });
        });
    }
    catch (error) {
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
export const getCoordsFromAddress = async (map, address) => {
    try {
        await loadKakaoMapScript();
        return new Promise((resolve, reject) => {
            const geocoder = new window.kakao.maps.services.Geocoder();
            geocoder.addressSearch(address, (result, status) => {
                if (status === window.kakao.maps.services.Status.OK) {
                    resolve({
                        latitude: parseFloat(result[0].y),
                        longitude: parseFloat(result[0].x),
                    });
                }
                else {
                    reject(new Error('좌표 검색 실패'));
                }
            });
        });
    }
    catch (error) {
        console.error('좌표 검색 실패:', error);
        throw error;
    }
};
