import axios from 'axios';
import { env, devLog } from './env';
/**
 * 한국관광공사 API 키
 */
const TOUR_API_KEY = env.TOUR_API_KEY;
/**
 * 한국관광공사 API 기본 URL
 */
const TOUR_BASE_URL = 'http://apis.data.go.kr/B551011/KorService1';
/**
 * 한국관광공사 API 요청을 위한 axios 인스턴스
 */
const tourAxios = axios.create({
    baseURL: TOUR_BASE_URL,
    params: {
        serviceKey: TOUR_API_KEY,
        MobileOS: 'ETC',
        MobileApp: 'EumApp',
        _type: 'json',
    },
});
/**
 * 지역 기반 관광정보 조회
 * @param params 조회 매개변수
 * @returns Promise<any> 관광정보 데이터
 */
export const getAreaBasedList = async (params) => {
    try {
        if (!TOUR_API_KEY) {
            throw new Error('한국관광공사 API 키가 설정되지 않았습니다.');
        }
        const response = await tourAxios.get('/areaBasedList1', {
            params: {
                areaCode: params.areaCode,
                sigunguCode: params.sigunguCode,
                contentTypeId: params.contentTypeId,
                cat1: params.cat1,
                cat2: params.cat2,
                cat3: params.cat3,
                numOfRows: params.numOfRows || 10,
                pageNo: params.pageNo || 1,
            },
        });
        if (response.data?.response?.header?.resultCode === '0000') {
            devLog('지역 기반 관광정보 조회 성공');
            return response.data.response.body.items.item || [];
        }
        else {
            const errorMsg = response.data?.response?.header?.resultMsg || '알 수 없는 오류';
            throw new Error(`지역 기반 관광정보 조회 실패: ${errorMsg}`);
        }
    }
    catch (error) {
        console.error('지역 기반 관광정보 조회 실패:', error);
        throw error;
    }
};
/**
 * 위치 기반 관광정보 조회
 * @param params 조회 매개변수
 * @returns Promise<any> 관광정보 데이터
 */
export const getLocationBasedList = async (params) => {
    try {
        if (!TOUR_API_KEY) {
            throw new Error('한국관광공사 API 키가 설정되지 않았습니다.');
        }
        const response = await tourAxios.get('/locationBasedList1', {
            params: {
                mapX: params.mapX,
                mapY: params.mapY,
                radius: params.radius || 1000, // 기본값 1km
                contentTypeId: params.contentTypeId,
                numOfRows: params.numOfRows || 10,
                pageNo: params.pageNo || 1,
            },
        });
        if (response.data?.response?.header?.resultCode === '0000') {
            devLog('위치 기반 관광정보 조회 성공');
            return response.data.response.body.items.item || [];
        }
        else {
            const errorMsg = response.data?.response?.header?.resultMsg || '알 수 없는 오류';
            throw new Error(`위치 기반 관광정보 조회 실패: ${errorMsg}`);
        }
    }
    catch (error) {
        console.error('위치 기반 관광정보 조회 실패:', error);
        throw error;
    }
};
/**
 * 키워드 검색 조회
 * @param params 조회 매개변수
 * @returns Promise<any> 관광정보 데이터
 */
export const getSearchKeyword = async (params) => {
    try {
        if (!TOUR_API_KEY) {
            throw new Error('한국관광공사 API 키가 설정되지 않았습니다.');
        }
        const response = await tourAxios.get('/searchKeyword1', {
            params: {
                keyword: params.keyword,
                areaCode: params.areaCode,
                sigunguCode: params.sigunguCode,
                contentTypeId: params.contentTypeId,
                numOfRows: params.numOfRows || 10,
                pageNo: params.pageNo || 1,
            },
        });
        if (response.data?.response?.header?.resultCode === '0000') {
            devLog('키워드 검색 조회 성공');
            return response.data.response.body.items.item || [];
        }
        else {
            const errorMsg = response.data?.response?.header?.resultMsg || '알 수 없는 오류';
            throw new Error(`키워드 검색 조회 실패: ${errorMsg}`);
        }
    }
    catch (error) {
        console.error('키워드 검색 조회 실패:', error);
        throw error;
    }
};
/**
 * 컨텐츠 상세정보 조회
 * @param params 조회 매개변수
 * @returns Promise<any> 컨텐츠 상세정보
 */
export const getDetailCommon = async (params) => {
    try {
        if (!TOUR_API_KEY) {
            throw new Error('한국관광공사 API 키가 설정되지 않았습니다.');
        }
        const response = await tourAxios.get('/detailCommon1', {
            params: {
                contentId: params.contentId,
                contentTypeId: params.contentTypeId,
                defaultYN: params.defaultYN || 'Y',
                firstImageYN: params.firstImageYN || 'Y',
                areacodeYN: params.areacodeYN || 'Y',
                catcodeYN: params.catcodeYN || 'Y',
                addrinfoYN: params.addrinfoYN || 'Y',
                mapinfoYN: params.mapinfoYN || 'Y',
                overviewYN: params.overviewYN || 'Y',
            },
        });
        if (response.data?.response?.header?.resultCode === '0000') {
            devLog('컨텐츠 상세정보 조회 성공');
            return response.data.response.body.items.item[0] || {};
        }
        else {
            const errorMsg = response.data?.response?.header?.resultMsg || '알 수 없는 오류';
            throw new Error(`컨텐츠 상세정보 조회 실패: ${errorMsg}`);
        }
    }
    catch (error) {
        console.error('컨텐츠 상세정보 조회 실패:', error);
        throw error;
    }
};
