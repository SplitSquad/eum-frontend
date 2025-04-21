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
export const getAreaBasedList = async (params: {
  areaCode?: string; // 지역코드
  sigunguCode?: string; // 시군구코드
  contentTypeId?: string; // 관광타입(12:관광지, 14:문화시설, 15:축제공연행사, 25:여행코스, 28:레포츠, 32:숙박, 38:쇼핑, 39:음식점) ID
  cat1?: string; // 대분류 코드
  cat2?: string; // 중분류 코드
  cat3?: string; // 소분류 코드
  numOfRows?: number; // 한 페이지 결과 수
  pageNo?: number; // 페이지 번호
}): Promise<any> => {
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
    } else {
      const errorMsg = response.data?.response?.header?.resultMsg || '알 수 없는 오류';
      throw new Error(`지역 기반 관광정보 조회 실패: ${errorMsg}`);
    }
  } catch (error) {
    console.error('지역 기반 관광정보 조회 실패:', error);
    throw error;
  }
};

/**
 * 위치 기반 관광정보 조회
 * @param params 조회 매개변수
 * @returns Promise<any> 관광정보 데이터
 */
export const getLocationBasedList = async (params: {
  mapX: number; // GPS X좌표(경도)
  mapY: number; // GPS Y좌표(위도)
  radius?: number; // 거리 반경(미터)
  contentTypeId?: string; // 관광타입(12:관광지, 14:문화시설, 15:축제공연행사, 25:여행코스, 28:레포츠, 32:숙박, 38:쇼핑, 39:음식점) ID
  numOfRows?: number; // 한 페이지 결과 수
  pageNo?: number; // 페이지 번호
}): Promise<any> => {
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
    } else {
      const errorMsg = response.data?.response?.header?.resultMsg || '알 수 없는 오류';
      throw new Error(`위치 기반 관광정보 조회 실패: ${errorMsg}`);
    }
  } catch (error) {
    console.error('위치 기반 관광정보 조회 실패:', error);
    throw error;
  }
};

/**
 * 키워드 검색 조회
 * @param params 조회 매개변수
 * @returns Promise<any> 관광정보 데이터
 */
export const getSearchKeyword = async (params: {
  keyword: string; // 검색 키워드
  areaCode?: string; // 지역코드
  sigunguCode?: string; // 시군구코드
  contentTypeId?: string; // 관광타입(12:관광지, 14:문화시설, 15:축제공연행사, 25:여행코스, 28:레포츠, 32:숙박, 38:쇼핑, 39:음식점) ID
  numOfRows?: number; // 한 페이지 결과 수
  pageNo?: number; // 페이지 번호
}): Promise<any> => {
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
    } else {
      const errorMsg = response.data?.response?.header?.resultMsg || '알 수 없는 오류';
      throw new Error(`키워드 검색 조회 실패: ${errorMsg}`);
    }
  } catch (error) {
    console.error('키워드 검색 조회 실패:', error);
    throw error;
  }
};

/**
 * 컨텐츠 상세정보 조회
 * @param params 조회 매개변수
 * @returns Promise<any> 컨텐츠 상세정보
 */
export const getDetailCommon = async (params: {
  contentId: string; // 콘텐츠 ID
  contentTypeId: string; // 관광타입(12:관광지, 14:문화시설, 15:축제공연행사, 25:여행코스, 28:레포츠, 32:숙박, 38:쇼핑, 39:음식점) ID
  defaultYN?: string; // 기본정보 조회여부
  firstImageYN?: string; // 대표이미지 조회여부
  areacodeYN?: string; // 지역코드 조회여부
  catcodeYN?: string; // 카테고리코드 조회여부
  addrinfoYN?: string; // 주소 조회여부
  mapinfoYN?: string; // 좌표 조회여부
  overviewYN?: string; // 개요 조회여부
}): Promise<any> => {
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
    } else {
      const errorMsg = response.data?.response?.header?.resultMsg || '알 수 없는 오류';
      throw new Error(`컨텐츠 상세정보 조회 실패: ${errorMsg}`);
    }
  } catch (error) {
    console.error('컨텐츠 상세정보 조회 실패:', error);
    throw error;
  }
};
