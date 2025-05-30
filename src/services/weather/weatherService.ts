import axios from 'axios';
import { env } from '@/config/env';

// 날씨 정보 인터페이스
export interface WeatherInfo {
  current: string; // 현재 날씨 상태 (맑음, 흐림, 비 등)
  temperature: number; // 현재 기온
  location: string; // 위치 정보
  humidity?: number; // 습도 (옵션)
  forecast: Array<{
    day: string; // 예보 일자 (오늘, 내일, 모레)
    icon: string; // 날씨 아이콘
    temp: number; // 예상 기온
    minTemp?: number; // 최저 기온 (옵션)
    maxTemp?: number; // 최고 기온 (옵션)
    precipitationProbability?: number; // 강수확률 (옵션)
  }>;
}

// 위치 정보 인터페이스
interface LocationInfo {
  latitude: number;
  longitude: number;
}

// 기상청 API 응답 인터페이스
interface KmaApiResponse {
  response: {
    header: {
      resultCode: string;
      resultMsg: string;
    };
    body: {
      dataType: string;
      items: {
        item: Array<{
          baseDate: string;
          baseTime: string;
          category: string;
          fcstDate: string;
          fcstTime: string;
          fcstValue: string;
          nx: number;
          ny: number;
        }>;
      };
      pageNo: number;
      numOfRows: number;
      totalCount: number;
    };
  };
}

// 기상청 API 카테고리 코드
const CATEGORY_CODES = {
  SKY: 'SKY', // 하늘상태: 맑음(1), 구름많음(3), 흐림(4)
  PTY: 'PTY', // 강수형태: 없음(0), 비(1), 비/눈(2), 눈(3), 소나기(4)
  TMP: 'TMP', // 1시간 기온
  TMN: 'TMN', // 일 최저기온
  TMX: 'TMX', // 일 최고기온
  POP: 'POP', // 강수확률
  REH: 'REH', // 습도
  WSD: 'WSD', // 풍속
  PCP: 'PCP', // 1시간 강수량
  SNO: 'SNO', // 1시간 신적설
};

// 날씨 상태 매핑
const SKY_STATUS = {
  '1': '맑음',
  '3': '구름많음',
  '4': '흐림',
};

const PTY_STATUS = {
  '0': '',
  '1': '비',
  '2': '비/눈',
  '3': '눈',
  '4': '소나기',
};

// 위경도 좌표를 기상청 격자 좌표로 변환하는 함수
const convertToGridCoord = (lat: number, lon: number): { nx: number; ny: number } => {
  const RE = 6371.00877; // 지구 반경(km)
  const GRID = 5.0; // 격자 간격(km)
  const SLAT1 = 30.0; // 표준위도 1
  const SLAT2 = 60.0; // 표준위도 2
  const OLON = 126.0; // 기준점 경도
  const OLAT = 38.0; // 기준점 위도
  const XO = 210 / GRID; // 기준점 X좌표
  const YO = 675 / GRID; // 기준점 Y좌표

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
  if (theta > Math.PI) theta -= 2.0 * Math.PI;
  if (theta < -Math.PI) theta += 2.0 * Math.PI;
  theta *= sn;

  const x = Math.floor(ra * Math.sin(theta) + XO + 0.5);
  const y = Math.floor(ro - ra * Math.cos(theta) + YO + 0.5);

  return { nx: x, ny: y };
};

// 현재 시간을 기상청 API 형식으로 변환하는 함수
const getFormattedDateTime = (): { baseDate: string; baseTime: string } => {
  const now = new Date();

  // 현재 날짜 포맷 (YYYYMMDD)
  const baseDate =
    now.getFullYear() +
    String(now.getMonth() + 1).padStart(2, '0') +
    String(now.getDate()).padStart(2, '0');

  // 현재 시간에서 1시간 전의 시간을 구함 (API가 매 시간 45분에 갱신되므로)
  now.setHours(now.getHours() - 1);
  let hour = now.getHours();

  // 기상청 API 발표시각에 맞추기 (0200, 0500, 0800, 1100, 1400, 1700, 2000, 2300)
  const timeMap: { [key: number]: string } = {
    0: '2300',
    1: '2300',
    2: '0200',
    3: '0200',
    4: '0200',
    5: '0500',
    6: '0500',
    7: '0500',
    8: '0800',
    9: '0800',
    10: '0800',
    11: '1100',
    12: '1100',
    13: '1100',
    14: '1400',
    15: '1400',
    16: '1400',
    17: '1700',
    18: '1700',
    19: '1700',
    20: '2000',
    21: '2000',
    22: '2000',
    23: '2300',
  };

  // 전날 23시 데이터를 사용하는 경우 baseDate도 하루 전으로 조정
  let adjustedBaseDate = baseDate;
  if (hour < 2 || (hour === 23 && now.getMinutes() < 45)) {
    const yesterday = new Date(now);
    yesterday.setDate(yesterday.getDate() - 1);
    adjustedBaseDate =
      yesterday.getFullYear() +
      String(yesterday.getMonth() + 1).padStart(2, '0') +
      String(yesterday.getDate()).padStart(2, '0');
  }

  return { baseDate: adjustedBaseDate, baseTime: timeMap[hour] };
};

// 날씨 아이콘 매핑 함수
const getWeatherIcon = (sky: string, pty: string): string => {
  if (pty === '1') return '🌧️'; // 비
  if (pty === '2') return '🌨️'; // 비/눈
  if (pty === '3') return '❄️'; // 눈
  if (pty === '4') return '🌧️'; // 소나기

  if (sky === '1') return '☀️'; // 맑음
  if (sky === '3') return '⛅'; // 구름많음
  if (sky === '4') return '☁️'; // 흐림

  return '☀️'; // 기본값
};

// 기상청 API 호출 서비스
const WeatherService = {
  // 현재 위치 정보 가져오기
  getCurrentPosition(): Promise<LocationInfo> {
    return new Promise((resolve, reject) => {
      if (!navigator.geolocation) {
        reject(new Error('Geolocation is not supported by this browser.'));
        return;
      }

      navigator.geolocation.getCurrentPosition(
        position => {
          resolve({
            latitude: position.coords.latitude,
            longitude: position.coords.longitude,
          });
        },
        error => {
          console.error('Error getting location:', error);
          // 기본 위치 (서울시청)
          resolve({
            latitude: 37.5666,
            longitude: 126.9784,
          });
        },
        { timeout: 10000, maximumAge: 600000 }
      );
    });
  },

  // 초단기실황 정보 가져오기 (현재 날씨)
  async getUltraSrtNcst(latitude: number, longitude: number): Promise<any> {
    try {
      // 위경도를 기상청 격자 좌표로 변환
      const gridCoord = convertToGridCoord(latitude, longitude);

      // 현재 날짜/시간 정보
      const now = new Date();
      const baseDate =
        now.getFullYear() +
        String(now.getMonth() + 1).padStart(2, '0') +
        String(now.getDate()).padStart(2, '0');

      // 현재 시각(정시로 설정)
      const hour = now.getHours();
      const minute = now.getMinutes();

      // 10분 이내면 이전 시간 데이터 조회 (매시각 10분 이후 호출 가능)
      const baseHour = minute < 10 ? (hour === 0 ? 23 : hour - 1) : hour;
      const baseTime = String(baseHour).padStart(2, '0') + '00';

      // 기상청 API 키
      let apiKey = env.WEATHER_API_KEY;

      console.log('UltraSrtNcst API Request:', {
        baseDate,
        baseTime,
        nx: gridCoord.nx,
        ny: gridCoord.ny,
        hasApiKey: !!apiKey,
      });

      // 운영 환경이 아닌 경우 실제 API 호출 대신 더미 데이터 반환
      if (!apiKey) {
        console.warn('Weather API key not provided. Returning mock data.');
        return {
          T1H: '22.3', // 기온
          RN1: '0.0', // 1시간 강수량
          REH: '50', // 습도
          PTY: '0', // 강수형태
          SKY: '1', // 하늘상태
          WSD: '1.2', // 풍속
        };
      }

      // 기상청 API 호출
      const url = `https://apis.data.go.kr/1360000/VilageFcstInfoService_2.0/getUltraSrtNcst`;
      const params = {
        serviceKey: decodeURIComponent(apiKey),
        pageNo: '1',
        numOfRows: '10',
        dataType: 'JSON',
        base_date: baseDate,
        base_time: baseTime,
        nx: gridCoord.nx.toString(),
        ny: gridCoord.ny.toString(),
      };

      const response = await axios.get(url, { params });

      // 결과 데이터 변환 (카테고리별 값을 키-값 형태로 변환)
      if (
        response.data?.response?.body?.items?.item &&
        Array.isArray(response.data.response.body.items.item)
      ) {
        const result: Record<string, string> = {};
        response.data.response.body.items.item.forEach((item: any) => {
          result[item.category] = item.obsrValue;
        });
        return result;
      }

      throw new Error('Invalid API response format');
    } catch (error) {
      console.error('기상청 API 호출 실패:', error);
      // 에러 발생 시 기본 날씨 정보 반환
      return {
        T1H: '22.3', // 기온
        RN1: '0.0', // 1시간 강수량
        REH: '50', // 습도
        PTY: '0', // 강수형태
        SKY: '1', // 하늘상태
        WSD: '1.2', // 풍속
      };
    }
  },

  // 단기예보 정보 가져오기 (오늘/내일 날씨)
  async getVilageFcst(latitude: number, longitude: number): Promise<any> {
    try {
      // 위경도를 기상청 격자 좌표로 변환
      const gridCoord = convertToGridCoord(latitude, longitude);

      // API 호출에 사용할 날짜/시간 정보
      const { baseDate, baseTime } = getFormattedDateTime();

      // 기상청 API 키
      let apiKey = env.WEATHER_API_KEY;

      // 운영 환경이 아닌 경우 실제 API 호출 대신 더미 데이터 반환
      if (!apiKey) {
        console.warn('Weather API key not provided. Returning mock forecast data.');
        return [
          { fcstDate: baseDate, fcstTime: '1200', category: 'TMP', fcstValue: '22' },
          { fcstDate: baseDate, fcstTime: '1200', category: 'SKY', fcstValue: '1' },
          { fcstDate: baseDate, fcstTime: '1200', category: 'PTY', fcstValue: '0' },
          // 내일
          {
            fcstDate: String(Number(baseDate) + 1),
            fcstTime: '1200',
            category: 'TMP',
            fcstValue: '23',
          },
          {
            fcstDate: String(Number(baseDate) + 1),
            fcstTime: '1200',
            category: 'SKY',
            fcstValue: '3',
          },
          {
            fcstDate: String(Number(baseDate) + 1),
            fcstTime: '1200',
            category: 'PTY',
            fcstValue: '0',
          },
        ];
      }

      // 기상청 API 호출
      const url = `https://apis.data.go.kr/1360000/VilageFcstInfoService_2.0/getVilageFcst`;
      const params = {
        serviceKey: decodeURIComponent(apiKey),
        pageNo: '1',
        numOfRows: '1000', // 많은 데이터를 한번에 받기
        dataType: 'JSON',
        base_date: baseDate,
        base_time: baseTime,
        nx: gridCoord.nx.toString(),
        ny: gridCoord.ny.toString(),
      };

      const response = await axios.get<KmaApiResponse>(url, { params });

      // 결과 데이터 변환
      if (
        response.data?.response?.body?.items?.item &&
        Array.isArray(response.data.response.body.items.item)
      ) {
        return response.data.response.body.items.item;
      }

      throw new Error('Invalid API response format');
    } catch (error) {
      console.error('기상청 단기예보 API 호출 실패:', error);
      // 에러 발생 시 기본 예보 정보 반환
      const baseDate = new Date().toISOString().split('T')[0].replace(/-/g, '');
      const tomorrow = new Date();
      tomorrow.setDate(tomorrow.getDate() + 1);
      const tomorrowDate = tomorrow.toISOString().split('T')[0].replace(/-/g, '');

      return [
        { fcstDate: baseDate, fcstTime: '1200', category: 'TMP', fcstValue: '22' },
        { fcstDate: baseDate, fcstTime: '1200', category: 'SKY', fcstValue: '1' },
        { fcstDate: baseDate, fcstTime: '1200', category: 'PTY', fcstValue: '0' },
        // 내일
        { fcstDate: tomorrowDate, fcstTime: '1200', category: 'TMP', fcstValue: '23' },
        { fcstDate: tomorrowDate, fcstTime: '1200', category: 'SKY', fcstValue: '3' },
        { fcstDate: tomorrowDate, fcstTime: '1200', category: 'PTY', fcstValue: '0' },
      ];
    }
  },

  // 종합된 날씨 정보 가져오기
  async getWeatherInfo(
    latitude: number,
    longitude: number,
    locationName: string
  ): Promise<WeatherInfo> {
    try {
      // 초단기실황 API 호출 (현재 날씨)
      const currentWeather = await this.getUltraSrtNcst(latitude, longitude);

      // 단기예보 API 호출 (예보)
      const forecast = await this.getVilageFcst(latitude, longitude);

      // 현재 온도
      const temperature = parseFloat(currentWeather.T1H);

      // 현재 날씨 상태
      const current = PTY_STATUS[currentWeather.PTY] || SKY_STATUS[currentWeather.SKY] || '맑음';

      // 예보 데이터 가공 - 하루 전체 최저/최고기온과 강수확률 포함
      const forecastData: { day: string; icon: string; temp: number; minTemp?: number; maxTemp?: number; precipitationProbability?: number }[] = [];

      // 내일 데이터 처리
      const tomorrow = new Date();
      tomorrow.setDate(tomorrow.getDate() + 1);
      const tomorrowStr = tomorrow.toISOString().split('T')[0].replace(/-/g, '');

      // 모레 데이터 처리
      const dayAfterTomorrow = new Date();
      dayAfterTomorrow.setDate(dayAfterTomorrow.getDate() + 2);
      const dayAfterTomorrowStr = dayAfterTomorrow.toISOString().split('T')[0].replace(/-/g, '');

      // 특정 날짜의 하루 전체 데이터 분석
      const getDayForecast = (date: string, dayName: string) => {
        // 해당 날짜의 모든 데이터 필터링
        const dayData = forecast.filter((item: any) => item.fcstDate === date);
        
        // 최저/최고 기온 찾기
        const temps = dayData.filter((item: any) => item.category === 'TMP').map((item: any) => parseFloat(item.fcstValue));
        const minTemp = temps.length > 0 ? Math.min(...temps) : null;
        const maxTemp = temps.length > 0 ? Math.max(...temps) : null;
        
        // 강수확률 찾기 (하루 중 최대값)
        const precipProbs = dayData.filter((item: any) => item.category === 'POP').map((item: any) => parseInt(item.fcstValue));
        const maxPrecipProb = precipProbs.length > 0 ? Math.max(...precipProbs) : null;
        
        // 대표 날씨 (오후 시간대 기준 - 12시 또는 15시)
        const representativeTime = dayData.find((item: any) => 
          (item.fcstTime === '1200' || item.fcstTime === '1500') && item.category === 'SKY'
        );
        const representativePty = dayData.find((item: any) => 
          (item.fcstTime === '1200' || item.fcstTime === '1500') && item.category === 'PTY'
        );
        
        const skyValue = representativeTime?.fcstValue || '1';
        const ptyValue = representativePty?.fcstValue || '0';
        
        // 평균 기온 (최저+최고)/2
        const avgTemp = (minTemp && maxTemp) ? Math.round((minTemp + maxTemp) / 2) : 24;
        
        return {
          day: dayName,
          icon: getWeatherIcon(skyValue, ptyValue),
          temp: avgTemp,
          minTemp: minTemp ? Math.round(minTemp) : undefined,
          maxTemp: maxTemp ? Math.round(maxTemp) : undefined,
          precipitationProbability: maxPrecipProb || undefined
        };
      };

      // 내일 예보 추가
      const tomorrowForecast = getDayForecast(tomorrowStr, '내일');
      // minTemp/maxTemp가 없어도 기본값으로 추가
      forecastData.push({
        ...tomorrowForecast,
        minTemp: tomorrowForecast.minTemp || 20,
        maxTemp: tomorrowForecast.maxTemp || 28,
        precipitationProbability: tomorrowForecast.precipitationProbability || 30
      });

      // 모레 예보 추가  
      const dayAfterTomorrowForecast = getDayForecast(dayAfterTomorrowStr, '모레');
      // minTemp/maxTemp가 없어도 기본값으로 추가
      forecastData.push({
        ...dayAfterTomorrowForecast,
        minTemp: dayAfterTomorrowForecast.minTemp || 18,
        maxTemp: dayAfterTomorrowForecast.maxTemp || 26,
        precipitationProbability: dayAfterTomorrowForecast.precipitationProbability || 50
      });

      // 최종 날씨 정보 반환
      return {
        current,
        temperature,
        location: locationName || '알 수 없음',
        humidity: parseInt(currentWeather.REH), // 습도
        forecast: forecastData,
      };
    } catch (error) {
      console.error('날씨 정보 조회 실패:', error);
      // 에러 발생 시 기본 날씨 정보 반환
      return {
        current: '맑음',
        temperature: 24,
        location: locationName || '알 수 없음',
        forecast: [
          { day: '내일', icon: '⛅', temp: 26, minTemp: 20, maxTemp: 30, precipitationProbability: 20 },
          { day: '모레', icon: '🌧️', temp: 22, minTemp: 18, maxTemp: 26, precipitationProbability: 70 },
        ],
      };
    }
  },

  // 시간대별 인사말 생성
  getTimeBasedGreeting(): string {
    const hours = new Date().getHours();
    if (hours < 12) {
      return '좋은 아침이에요';
    } else if (hours < 17) {
      return '즐거운 오후예요';
    } else {
      return '편안한 저녁이에요';
    }
  },

  // 날씨에 따른 활동 추천
  getWeatherBasedActivities(weather: string): string[] {
    const activities: Record<string, string[]> = {
      맑음: [
        '오늘은 날씨가 좋네요! 산책하기 좋은 날이에요.',
        '햇살이 좋아요. 야외 활동하기 좋은 날씨네요.',
        '창문을 열어 상쾌한 공기를 마셔보세요.',
      ],
      구름많음: [
        '구름이 많지만 야외 활동하기에 괜찮은 날씨네요.',
        '선크림은 잊지 마세요. 구름 사이로 UV는 여전히 강해요.',
        '약간 흐리지만 기분 좋은 하루가 될 거예요.',
      ],
      흐림: [
        '오늘은 흐린 날씨네요. 실내 활동은 어떨까요?',
        '흐린 날은 집에서 책 읽기 좋은 날이에요.',
        '습도가 높을 수 있으니 체감온도에 주의하세요.',
      ],
      비: [
        '비가 오고 있어요. 우산 잊지 마세요!',
        '오늘은 실내에서 차 한잔의 여유를 즐겨보는 건 어떨까요?',
        '비 오는 날의 영화 감상도 좋겠네요.',
      ],
      눈: [
        '눈이 내리고 있어요! 따뜻하게 입고 나가세요.',
        '미끄러운 길 조심하세요.',
        '따뜻한 음료로 몸을 녹여보세요.',
      ],
    };

    // 해당 날씨에 맞는 활동 또는 기본 활동 반환
    return activities[weather] || activities['맑음'];
  },
};

// 글로벌 윈도우 객체에 카카오맵 타입 확장 (TypeScript 정의)
declare global {
  interface Window {
    kakao: any;
  }
}

export default WeatherService;
