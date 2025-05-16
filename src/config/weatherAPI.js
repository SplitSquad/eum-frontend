import axios from 'axios';
import { env, devLog } from './env';
/**
 * 기상청 API 키
 */
const WEATHER_API_KEY = env.WEATHER_API_KEY;
/**
 * 기상청 API 기본 URL
 */
const WEATHER_BASE_URL = 'http://apis.data.go.kr/1360000/VilageFcstInfoService_2.0';
/**
 * 기상청 API 요청을 위한 axios 인스턴스
 */
const weatherAxios = axios.create({
    baseURL: WEATHER_BASE_URL,
    params: {
        serviceKey: WEATHER_API_KEY,
        dataType: 'JSON',
    },
});
/**
 * 단기 예보 조회 (동네예보)
 * @param params 예보 조회 매개변수
 * @returns Promise<any> 단기 예보 데이터
 */
export const getShortTermForecast = async (params) => {
    try {
        if (!WEATHER_API_KEY) {
            throw new Error('기상청 API 키가 설정되지 않았습니다.');
        }
        const response = await weatherAxios.get('/getVilageFcst', {
            params: {
                base_date: params.base_date,
                base_time: params.base_time,
                nx: params.nx,
                ny: params.ny,
                numOfRows: params.numOfRows || 100,
                pageNo: params.pageNo || 1,
            },
        });
        if (response.data?.response?.header?.resultCode === '00') {
            devLog('단기 예보 조회 성공');
            return response.data.response.body.items.item;
        }
        else {
            const errorMsg = response.data?.response?.header?.resultMsg || '알 수 없는 오류';
            throw new Error(`단기 예보 조회 실패: ${errorMsg}`);
        }
    }
    catch (error) {
        console.error('단기 예보 조회 실패:', error);
        throw error;
    }
};
/**
 * 중기 예보 조회 (날씨 예보)
 * @param params 예보 조회 매개변수
 * @returns Promise<any> 중기 예보 데이터
 */
export const getMidTermForecast = async (params) => {
    try {
        if (!WEATHER_API_KEY) {
            throw new Error('기상청 API 키가 설정되지 않았습니다.');
        }
        const response = await weatherAxios.get('/getMidLandFcst', {
            params: {
                regId: params.regId,
                tmFc: params.tmFc,
                numOfRows: params.numOfRows || 10,
                pageNo: params.pageNo || 1,
            },
        });
        if (response.data?.response?.header?.resultCode === '00') {
            devLog('중기 예보 조회 성공');
            return response.data.response.body.items.item;
        }
        else {
            const errorMsg = response.data?.response?.header?.resultMsg || '알 수 없는 오류';
            throw new Error(`중기 예보 조회 실패: ${errorMsg}`);
        }
    }
    catch (error) {
        console.error('중기 예보 조회 실패:', error);
        throw error;
    }
};
/**
 * 초단기 실황 조회 (현재 날씨)
 * @param params 실황 조회 매개변수
 * @returns Promise<any> 초단기 실황 데이터
 */
export const getUltraShortNowcast = async (params) => {
    try {
        if (!WEATHER_API_KEY) {
            throw new Error('기상청 API 키가 설정되지 않았습니다.');
        }
        const response = await weatherAxios.get('/getUltraSrtNcst', {
            params: {
                base_date: params.base_date,
                base_time: params.base_time,
                nx: params.nx,
                ny: params.ny,
                numOfRows: params.numOfRows || 10,
                pageNo: params.pageNo || 1,
            },
        });
        if (response.data?.response?.header?.resultCode === '00') {
            devLog('초단기 실황 조회 성공');
            return response.data.response.body.items.item;
        }
        else {
            const errorMsg = response.data?.response?.header?.resultMsg || '알 수 없는 오류';
            throw new Error(`초단기 실황 조회 실패: ${errorMsg}`);
        }
    }
    catch (error) {
        console.error('초단기 실황 조회 실패:', error);
        throw error;
    }
};
/**
 * 날씨 코드 변환 함수 (코드 -> 텍스트)
 * @param category 카테고리 코드
 * @param value 값
 * @returns string 변환된 텍스트
 */
export const convertWeatherCode = (category, value) => {
    // 하늘상태(SKY) 코드 변환
    if (category === 'SKY') {
        const skyCodes = {
            '1': '맑음',
            '3': '구름많음',
            '4': '흐림',
        };
        return skyCodes[value] || value;
    }
    // 강수형태(PTY) 코드 변환
    if (category === 'PTY') {
        const ptyCodes = {
            '0': '없음',
            '1': '비',
            '2': '비/눈',
            '3': '눈',
            '4': '소나기',
        };
        return ptyCodes[value] || value;
    }
    // 그 외 그대로 반환
    return value;
};
/**
 * 좌표계 변환 (위/경도 -> 기상청 좌표)
 * @param lat 위도
 * @param lon 경도
 * @returns {nx: number, ny: number} 기상청 좌표
 */
export const convertToWeatherGrid = (lat, lon) => {
    const RE = 6371.00877; // 지구 반경(km)
    const GRID = 5.0; // 격자 간격(km)
    const SLAT1 = 30.0; // 투영 위도1(degree)
    const SLAT2 = 60.0; // 투영 위도2(degree)
    const OLON = 126.0; // 기준점 경도(degree)
    const OLAT = 38.0; // 기준점 위도(degree)
    const XO = 43; // 기준점 X좌표(GRID)
    const YO = 136; // 기준점 Y좌표(GRID)
    const DEGRAD = Math.PI / 180.0;
    const re = RE / GRID;
    const slat1 = SLAT1 * DEGRAD;
    const slat2 = SLAT2 * DEGRAD;
    const olon = OLON * DEGRAD;
    const olat = OLAT * DEGRAD;
    let sn = Math.tan(Math.PI * 0.25 + slat2 * 0.5) / Math.tan(Math.PI * 0.25 + slat1 * 0.5);
    sn = Math.log(Math.cos(slat1) / Math.cos(slat2)) / Math.log(sn);
    let sf = Math.tan(Math.PI * 0.25 + slat1 * 0.5);
    sf = (Math.pow(sf, sn) * Math.cos(slat1)) / sn;
    let ro = Math.tan(Math.PI * 0.25 + olat * 0.5);
    ro = (re * sf) / Math.pow(ro, sn);
    let ra = Math.tan(Math.PI * 0.25 + lat * DEGRAD * 0.5);
    ra = (re * sf) / Math.pow(ra, sn);
    let theta = lon * DEGRAD - olon;
    if (theta > Math.PI)
        theta -= 2.0 * Math.PI;
    if (theta < -Math.PI)
        theta += 2.0 * Math.PI;
    theta *= sn;
    const nx = Math.floor(ra * Math.sin(theta) + XO + 0.5);
    const ny = Math.floor(ro - ra * Math.cos(theta) + YO + 0.5);
    return { nx, ny };
};
