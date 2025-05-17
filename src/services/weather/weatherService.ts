import axios from 'axios';

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
      let apiKey = import.meta.env.VITE_WEATHER_API_KEY;

      console.log('UltraSrtNcst API Request:', {
        baseDate,
        baseTime,
        nx: gridCoord.nx,
        ny: gridCoord.ny,
        hasApiKey: !!apiKey,
      });

      // API 키 처리
      if (apiKey.includes('%')) {
        try {
          const decodedKey = decodeURIComponent(apiKey);
          apiKey = encodeURIComponent(decodedKey);
        } catch (e) {
          console.warn('API key decoding failed, using original key');
        }
      } else {
        apiKey = encodeURIComponent(apiKey);
      }

      // API URL 생성
      const url = `https://apis.data.go.kr/1360000/VilageFcstInfoService_2.0/getUltraSrtNcst?serviceKey=${apiKey}&numOfRows=10&pageNo=1&dataType=JSON&base_date=${baseDate}&base_time=${baseTime}&nx=${gridCoord.nx}&ny=${gridCoord.ny}`;

      // 요청 헤더 설정
      const headers = {
        Accept: 'application/json',
        'Content-Type': 'application/json',
      };

      // API 호출 시도 (최대 3번)
      let response;
      let retryCount = 0;
      const maxRetries = 3;

      while (retryCount < maxRetries) {
        try {
          response = await axios.get(url, { headers });

          if (response.data?.response?.header) {
            console.log('UltraSrtNcst API Response:', response.data.response.header);

            if (response.data.response.header.resultCode === '00') {
              break;
            }

            if (response.data.response.header.resultCode === '30') {
              console.error('API Key error (code 30). Trying with unencoded key...');
              apiKey = import.meta.env.VITE_WEATHER_API_KEY;
              const newUrl = `https://apis.data.go.kr/1360000/VilageFcstInfoService_2.0/getUltraSrtNcst?serviceKey=${apiKey}&numOfRows=10&pageNo=1&dataType=JSON&base_date=${baseDate}&base_time=${baseTime}&nx=${gridCoord.nx}&ny=${gridCoord.ny}`;
              response = await axios.get(newUrl, { headers });
              if (response.data?.response?.header?.resultCode === '00') {
                break;
              }
            }
          }
        } catch (error) {
          console.error(`UltraSrtNcst API call attempt ${retryCount + 1} failed:`, error);
        }

        retryCount++;

        if (retryCount < maxRetries) {
          await new Promise(resolve => setTimeout(resolve, 1000));
        }
      }

      if (
        !response ||
        !response.data?.response?.header ||
        response.data.response.header.resultCode !== '00'
      ) {
        throw new Error(
          `API Error after ${maxRetries} attempts: ${response?.data?.response?.header?.resultMsg || 'Unknown error'}`
        );
      }

      const items = response.data.response.body.items.item;
      if (!items || items.length === 0) {
        throw new Error('No weather data available');
      }

      // 초단기실황 데이터 파싱
      const ncstData: { [key: string]: string } = {};
      items.forEach((item: any) => {
        ncstData[item.category] = item.obsrValue;
      });

      return ncstData;
    } catch (error) {
      console.error('초단기실황 조회 실패:', error);
      throw error;
    }
  },

  // 단기예보 정보 가져오기 (향후 날씨)
  async getVilageFcst(latitude: number, longitude: number): Promise<any> {
    try {
      // 위경도를 기상청 격자 좌표로 변환
      const gridCoord = convertToGridCoord(latitude, longitude);

      // 현재 시간에 맞는 baseDate, baseTime 구하기
      const { baseDate, baseTime } = getFormattedDateTime();

      // 기상청 API 키
      let apiKey = import.meta.env.VITE_WEATHER_API_KEY;

      console.log('VilageFcst API Request:', {
        baseDate,
        baseTime,
        nx: gridCoord.nx,
        ny: gridCoord.ny,
        hasApiKey: !!apiKey,
      });

      // API 키 처리
      if (apiKey.includes('%')) {
        try {
          const decodedKey = decodeURIComponent(apiKey);
          apiKey = encodeURIComponent(decodedKey);
        } catch (e) {
          console.warn('API key decoding failed, using original key');
        }
      } else {
        apiKey = encodeURIComponent(apiKey);
      }

      // API URL 생성
      const url = `https://apis.data.go.kr/1360000/VilageFcstInfoService_2.0/getVilageFcst?serviceKey=${apiKey}&numOfRows=1000&pageNo=1&dataType=JSON&base_date=${baseDate}&base_time=${baseTime}&nx=${gridCoord.nx}&ny=${gridCoord.ny}`;

      // 요청 헤더 설정
      const headers = {
        Accept: 'application/json',
        'Content-Type': 'application/json',
      };

      // API 호출 시도 (최대 3번)
      let response;
      let retryCount = 0;
      const maxRetries = 3;

      while (retryCount < maxRetries) {
        try {
          response = await axios.get(url, { headers });

          if (response.data?.response?.header) {
            console.log('VilageFcst API Response:', response.data.response.header);

            if (response.data.response.header.resultCode === '00') {
              break;
            }

            if (response.data.response.header.resultCode === '30') {
              console.error('API Key error (code 30). Trying with unencoded key...');
              apiKey = import.meta.env.VITE_WEATHER_API_KEY;
              const newUrl = `https://apis.data.go.kr/1360000/VilageFcstInfoService_2.0/getVilageFcst?serviceKey=${apiKey}&numOfRows=1000&pageNo=1&dataType=JSON&base_date=${baseDate}&base_time=${baseTime}&nx=${gridCoord.nx}&ny=${gridCoord.ny}`;
              response = await axios.get(newUrl, { headers });
              if (response.data?.response?.header?.resultCode === '00') {
                break;
              }
            }
          }
        } catch (error) {
          console.error(`VilageFcst API call attempt ${retryCount + 1} failed:`, error);
        }

        retryCount++;

        if (retryCount < maxRetries) {
          await new Promise(resolve => setTimeout(resolve, 1000));
        }
      }

      if (
        !response ||
        !response.data?.response?.header ||
        response.data.response.header.resultCode !== '00'
      ) {
        throw new Error(
          `API Error after ${maxRetries} attempts: ${response?.data?.response?.header?.resultMsg || 'Unknown error'}`
        );
      }

      const items = response.data.response.body.items.item;
      if (!items || items.length === 0) {
        throw new Error('No weather data available');
      }

      // 날짜별 데이터 정리
      const weatherByDate: { [key: string]: any } = {};

      items.forEach((item: any) => {
        const date = item.fcstDate;
        const time = item.fcstTime;
        const category = item.category;
        const value = item.fcstValue;

        if (!weatherByDate[date]) {
          weatherByDate[date] = {};
        }

        if (!weatherByDate[date][time]) {
          weatherByDate[date][time] = {};
        }

        weatherByDate[date][time][category] = value;
      });

      return weatherByDate;
    } catch (error) {
      console.error('단기예보 조회 실패:', error);
      throw error;
    }
  },

  // 날씨 정보 가져오기 (통합)
  async getWeatherInfo(
    latitude: number,
    longitude: number,
    locationName: string
  ): Promise<WeatherInfo> {
    try {
      // 1. 초단기실황 조회 (현재 날씨)
      const currentWeatherData = await this.getUltraSrtNcst(latitude, longitude);

      // 2. 단기예보 조회 (내일, 모레 날씨)
      const forecastData = await this.getVilageFcst(latitude, longitude);

      // 현재 날짜
      const today = new Date();
      const todayStr =
        today.getFullYear() +
        String(today.getMonth() + 1).padStart(2, '0') +
        String(today.getDate()).padStart(2, '0');

      // 내일 날짜
      const tomorrow = new Date(today);
      tomorrow.setDate(tomorrow.getDate() + 1);
      const tomorrowStr =
        tomorrow.getFullYear() +
        String(tomorrow.getMonth() + 1).padStart(2, '0') +
        String(tomorrow.getDate()).padStart(2, '0');

      // 모레 날짜
      const dayAfterTomorrow = new Date(today);
      dayAfterTomorrow.setDate(dayAfterTomorrow.getDate() + 2);
      const dayAfterTomorrowStr =
        dayAfterTomorrow.getFullYear() +
        String(dayAfterTomorrow.getMonth() + 1).padStart(2, '0') +
        String(dayAfterTomorrow.getDate()).padStart(2, '0');

      // 내일 정오 날씨
      const tomorrowNoon = forecastData[tomorrowStr]?.['0800'] || {};

      // 모레 정오 날씨 (있는 경우)
      const dayAfterTomorrowNoon = forecastData[dayAfterTomorrowStr]?.['0800'] || {};

      // 최고/최저 기온 찾기
      let todayMinTemp = 100,
        todayMaxTemp = -100;
      let tomorrowMinTemp = 100,
        tomorrowMaxTemp = -100;
      let dayAfterTomorrowMinTemp = 100,
        dayAfterTomorrowMaxTemp = -100;

      // 오늘 시간대별 기온 확인
      Object.values(forecastData[todayStr] || {}).forEach((timeData: any) => {
        if (timeData.TMP) {
          const temp = parseFloat(timeData.TMP);
          todayMinTemp = Math.min(todayMinTemp, temp);
          todayMaxTemp = Math.max(todayMaxTemp, temp);
        }
      });

      // 내일 시간대별 기온 확인
      Object.values(forecastData[tomorrowStr] || {}).forEach((timeData: any) => {
        if (timeData.TMP) {
          const temp = parseFloat(timeData.TMP);
          tomorrowMinTemp = Math.min(tomorrowMinTemp, temp);
          tomorrowMaxTemp = Math.max(tomorrowMaxTemp, temp);
        }
      });

      // 모레 시간대별 기온 확인 (있는 경우)
      Object.values(forecastData[dayAfterTomorrowStr] || {}).forEach((timeData: any) => {
        if (timeData.TMP) {
          const temp = parseFloat(timeData.TMP);
          dayAfterTomorrowMinTemp = Math.min(dayAfterTomorrowMinTemp, temp);
          dayAfterTomorrowMaxTemp = Math.max(dayAfterTomorrowMaxTemp, temp);
        }
      });

      // 현재 시간에 가장 가까운 예보 시간 찾기 (오늘 데이터용)
      const currentHour = String(today.getHours()).padStart(2, '0') + '00';
      let closestTime = Object.keys(forecastData[todayStr] || {}).reduce((prev, curr) => {
        return Math.abs(parseInt(curr) - parseInt(currentHour)) <
          Math.abs(parseInt(prev) - parseInt(currentHour))
          ? curr
          : prev;
      }, '0000');

      // 현재 날씨 상태 결정 (초단기실황 데이터 사용)
      const currentPty = currentWeatherData.PTY || '0';
      const currentSky = forecastData[todayStr]?.[closestTime]?.SKY || '1'; // 초단기실황에는 SKY가 없어서 예보에서 가져옴

      // 현재 날씨 상태 결정
      const skyStatus = SKY_STATUS[currentSky as keyof typeof SKY_STATUS] || '맑음';
      const ptyStatus = PTY_STATUS[currentPty as keyof typeof PTY_STATUS] || '';
      const weatherStatus = ptyStatus ? ptyStatus : skyStatus;

      // 결과 생성
      const result: WeatherInfo = {
        current: weatherStatus,
        temperature: parseFloat(currentWeatherData.T1H || '0'), // 초단기실황의 기온
        location: locationName,
        humidity: parseInt(currentWeatherData.REH || '0'),
        forecast: [
          {
            day: '오늘',
            icon: getWeatherIcon(currentSky, currentPty),
            temp: parseFloat(currentWeatherData.T1H || '0'),
            minTemp: todayMinTemp !== 100 ? todayMinTemp : undefined,
            maxTemp: todayMaxTemp !== -100 ? todayMaxTemp : undefined,
            precipitationProbability: parseInt(forecastData[todayStr]?.[closestTime]?.POP || '0'),
          },
          {
            day: '내일',
            icon: getWeatherIcon(tomorrowNoon.SKY, tomorrowNoon.PTY),
            temp: parseFloat(tomorrowNoon.TMP || '0'),
            minTemp: tomorrowMinTemp !== 100 ? tomorrowMinTemp : undefined,
            maxTemp: tomorrowMaxTemp !== -100 ? tomorrowMaxTemp : undefined,
            precipitationProbability: parseInt(tomorrowNoon.POP || '0'),
          },
        ],
      };

      // 모레 데이터가 있으면 추가
      if (dayAfterTomorrowNoon.TMP) {
        result.forecast.push({
          day: '모레',
          icon: getWeatherIcon(dayAfterTomorrowNoon.SKY, dayAfterTomorrowNoon.PTY),
          temp: parseFloat(dayAfterTomorrowNoon.TMP || '0'),
          minTemp: dayAfterTomorrowMinTemp !== 100 ? dayAfterTomorrowMinTemp : undefined,
          maxTemp: dayAfterTomorrowMaxTemp !== -100 ? dayAfterTomorrowMaxTemp : undefined,
          precipitationProbability: parseInt(dayAfterTomorrowNoon.POP || '0'),
        });
      }

      return result;
    } catch (error) {
      console.error('Weather API Error:', error);

      // 에러 발생 시 기본 날씨 정보 반환
      return {
        current: '맑음',
        temperature: 24,
        location: locationName,
        forecast: [
          { day: '오늘', icon: '☀️', temp: 24 },
          { day: '내일', icon: '⛅', temp: 26 },
          { day: '모레', icon: '🌧️', temp: 22 },
        ],
      };
    }
  },
};

export default WeatherService;
