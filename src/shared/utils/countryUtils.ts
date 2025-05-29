/**
 * 국가 관련 유틸리티 함수들
 */

export interface Country {
  code: string;        // 국가 코드 (KR, US, JP 등)
  name: string;        // 한국어 국가명
  englishName: string; // 영어 국가명
  flag: string;        // 국기 이모지 (폴백용)
}

/**
 * 전체 국가 목록 (주요 국가들 위주로 구성)
 */
export const COUNTRIES: Country[] = [
  // 아시아
  { code: 'KR', name: '대한민국', englishName: 'South Korea', flag: '🇰🇷' },
  { code: 'JP', name: '일본', englishName: 'Japan', flag: '🇯🇵' },
  { code: 'CN', name: '중국', englishName: 'China', flag: '🇨🇳' },
  { code: 'TW', name: '대만', englishName: 'Taiwan', flag: '🇹🇼' },
  { code: 'HK', name: '홍콩', englishName: 'Hong Kong', flag: '🇭🇰' },
  { code: 'SG', name: '싱가포르', englishName: 'Singapore', flag: '🇸🇬' },
  { code: 'TH', name: '태국', englishName: 'Thailand', flag: '🇹🇭' },
  { code: 'VN', name: '베트남', englishName: 'Vietnam', flag: '🇻🇳' },
  { code: 'PH', name: '필리핀', englishName: 'Philippines', flag: '🇵🇭' },
  { code: 'MY', name: '말레이시아', englishName: 'Malaysia', flag: '🇲🇾' },
  { code: 'ID', name: '인도네시아', englishName: 'Indonesia', flag: '🇮🇩' },
  { code: 'IN', name: '인도', englishName: 'India', flag: '🇮🇳' },
  { code: 'BD', name: '방글라데시', englishName: 'Bangladesh', flag: '🇧🇩' },
  { code: 'PK', name: '파키스탄', englishName: 'Pakistan', flag: '🇵🇰' },
  { code: 'LK', name: '스리랑카', englishName: 'Sri Lanka', flag: '🇱🇰' },
  { code: 'NP', name: '네팔', englishName: 'Nepal', flag: '🇳🇵' },
  { code: 'MM', name: '미얀마', englishName: 'Myanmar', flag: '🇲🇲' },
  { code: 'KH', name: '캄보디아', englishName: 'Cambodia', flag: '🇰🇭' },
  { code: 'LA', name: '라오스', englishName: 'Laos', flag: '🇱🇦' },
  { code: 'MN', name: '몽골', englishName: 'Mongolia', flag: '🇲🇳' },
  { code: 'KZ', name: '카자흐스탄', englishName: 'Kazakhstan', flag: '🇰🇿' },
  { code: 'UZ', name: '우즈베키스탄', englishName: 'Uzbekistan', flag: '🇺🇿' },

  // 북미
  { code: 'US', name: '미국', englishName: 'United States', flag: '🇺🇸' },
  { code: 'CA', name: '캐나다', englishName: 'Canada', flag: '🇨🇦' },
  { code: 'MX', name: '멕시코', englishName: 'Mexico', flag: '🇲🇽' },

  // 유럽
  { code: 'GB', name: '영국', englishName: 'United Kingdom', flag: '🇬🇧' },
  { code: 'DE', name: '독일', englishName: 'Germany', flag: '🇩🇪' },
  { code: 'FR', name: '프랑스', englishName: 'France', flag: '🇫🇷' },
  { code: 'IT', name: '이탈리아', englishName: 'Italy', flag: '🇮🇹' },
  { code: 'ES', name: '스페인', englishName: 'Spain', flag: '🇪🇸' },
  { code: 'PT', name: '포르투갈', englishName: 'Portugal', flag: '🇵🇹' },
  { code: 'NL', name: '네덜란드', englishName: 'Netherlands', flag: '🇳🇱' },
  { code: 'BE', name: '벨기에', englishName: 'Belgium', flag: '🇧🇪' },
  { code: 'CH', name: '스위스', englishName: 'Switzerland', flag: '🇨🇭' },
  { code: 'AT', name: '오스트리아', englishName: 'Austria', flag: '🇦🇹' },
  { code: 'SE', name: '스웨덴', englishName: 'Sweden', flag: '🇸🇪' },
  { code: 'NO', name: '노르웨이', englishName: 'Norway', flag: '🇳🇴' },
  { code: 'DK', name: '덴마크', englishName: 'Denmark', flag: '🇩🇰' },
  { code: 'FI', name: '핀란드', englishName: 'Finland', flag: '🇫🇮' },
  { code: 'PL', name: '폴란드', englishName: 'Poland', flag: '🇵🇱' },
  { code: 'CZ', name: '체코', englishName: 'Czech Republic', flag: '🇨🇿' },
  { code: 'HU', name: '헝가리', englishName: 'Hungary', flag: '🇭🇺' },
  { code: 'RO', name: '루마니아', englishName: 'Romania', flag: '🇷🇴' },
  { code: 'BG', name: '불가리아', englishName: 'Bulgaria', flag: '🇧🇬' },
  { code: 'GR', name: '그리스', englishName: 'Greece', flag: '🇬🇷' },
  { code: 'TR', name: '터키', englishName: 'Turkey', flag: '🇹🇷' },
  { code: 'RU', name: '러시아', englishName: 'Russia', flag: '🇷🇺' },
  { code: 'UA', name: '우크라이나', englishName: 'Ukraine', flag: '🇺🇦' },

  // 오세아니아
  { code: 'AU', name: '호주', englishName: 'Australia', flag: '🇦🇺' },
  { code: 'NZ', name: '뉴질랜드', englishName: 'New Zealand', flag: '🇳🇿' },

  // 아프리카
  { code: 'ZA', name: '남아프리카공화국', englishName: 'South Africa', flag: '🇿🇦' },
  { code: 'EG', name: '이집트', englishName: 'Egypt', flag: '🇪🇬' },
  { code: 'MA', name: '모로코', englishName: 'Morocco', flag: '🇲🇦' },
  { code: 'NG', name: '나이지리아', englishName: 'Nigeria', flag: '🇳🇬' },
  { code: 'KE', name: '케냐', englishName: 'Kenya', flag: '🇰🇪' },
  { code: 'ET', name: '에티오피아', englishName: 'Ethiopia', flag: '🇪🇹' },

  // 남미
  { code: 'BR', name: '브라질', englishName: 'Brazil', flag: '🇧🇷' },
  { code: 'AR', name: '아르헨티나', englishName: 'Argentina', flag: '🇦🇷' },
  { code: 'CL', name: '칠레', englishName: 'Chile', flag: '🇨🇱' },
  { code: 'PE', name: '페루', englishName: 'Peru', flag: '🇵🇪' },
  { code: 'CO', name: '콜롬비아', englishName: 'Colombia', flag: '🇨🇴' },
  { code: 'VE', name: '베네수엘라', englishName: 'Venezuela', flag: '🇻🇪' },

  // 중동
  { code: 'AE', name: '아랍에미리트', englishName: 'United Arab Emirates', flag: '🇦🇪' },
  { code: 'SA', name: '사우디아라비아', englishName: 'Saudi Arabia', flag: '🇸🇦' },
  { code: 'IL', name: '이스라엘', englishName: 'Israel', flag: '🇮🇱' },
  { code: 'IR', name: '이란', englishName: 'Iran', flag: '🇮🇷' },
  { code: 'IQ', name: '이라크', englishName: 'Iraq', flag: '🇮🇶' },
  { code: 'JO', name: '요단', englishName: 'Jordan', flag: '🇯🇴' },
  { code: 'LB', name: '레바논', englishName: 'Lebanon', flag: '🇱🇧' },
  { code: 'QA', name: '카타르', englishName: 'Qatar', flag: '🇶🇦' },
  { code: 'KW', name: '쿠웨이트', englishName: 'Kuwait', flag: '🇰🇼' },
  { code: 'OM', name: '오만', englishName: 'Oman', flag: '🇴🇲' },
];

/**
 * 국가 코드로 국가 정보 찾기
 */
export const getCountryByCode = (code: string): Country | undefined => {
  return COUNTRIES.find(country => 
    country.code.toLowerCase() === code.toLowerCase()
  );
};

/**
 * 국가명으로 국가 정보 찾기 (한국어 또는 영어)
 */
export const getCountryByName = (name: string): Country | undefined => {
  const normalizedName = name.trim().toLowerCase();
  return COUNTRIES.find(country => 
    country.name.toLowerCase() === normalizedName ||
    country.englishName.toLowerCase() === normalizedName
  );
};

/**
 * 백엔드에서 받은 nation 값을 기반으로 국기와 국가명 표시
 * @param nation 백엔드에서 받은 국가 정보 (코드 또는 이름)
 * @returns 국기 + 국가명 형태의 문자열
 */
export const getCountryDisplay = (nation: string): string => {
  if (!nation || nation.trim() === '') {
    return '🌍 알 수 없음';
  }

  // 1. 국가 코드로 먼저 시도
  let country = getCountryByCode(nation);
  
  // 2. 국가명으로 시도
  if (!country) {
    country = getCountryByName(nation);
  }

  // 3. 찾은 경우 국기 + 국가명 반환
  if (country) {
    return `${country.flag} ${country.name}`;
  }

  // 4. 찾지 못한 경우 원본 값과 함께 기본 아이콘 반환
  return `🌍 ${nation}`;
};

/**
 * 국가 검색 함수 (한국어, 영어, 코드 모두 지원)
 */
export const searchCountries = (query: string): Country[] => {
  if (!query || query.trim() === '') {
    return COUNTRIES;
  }

  const normalizedQuery = query.trim().toLowerCase();
  
  return COUNTRIES.filter(country => 
    country.name.toLowerCase().includes(normalizedQuery) ||
    country.englishName.toLowerCase().includes(normalizedQuery) ||
    country.code.toLowerCase().includes(normalizedQuery)
  );
};

/**
 * 인기 국가 목록 (온보딩에서 상위에 표시할 국가들)
 */
export const POPULAR_COUNTRIES = [
  'KR', 'US', 'JP', 'CN', 'GB', 'DE', 'FR', 'CA', 'AU', 'SG'
].map(code => getCountryByCode(code)).filter(Boolean) as Country[];

/**
 * 지역별 국가 그룹핑
 */
export const COUNTRIES_BY_REGION = {
  '아시아': COUNTRIES.filter(c => ['KR', 'JP', 'CN', 'TW', 'HK', 'SG', 'TH', 'VN', 'PH', 'MY', 'ID', 'IN', 'BD', 'PK', 'LK', 'NP', 'MM', 'KH', 'LA', 'MN', 'KZ', 'UZ'].includes(c.code)),
  '북미': COUNTRIES.filter(c => ['US', 'CA', 'MX'].includes(c.code)),
  '유럽': COUNTRIES.filter(c => ['GB', 'DE', 'FR', 'IT', 'ES', 'PT', 'NL', 'BE', 'CH', 'AT', 'SE', 'NO', 'DK', 'FI', 'PL', 'CZ', 'HU', 'RO', 'BG', 'GR', 'TR', 'RU', 'UA'].includes(c.code)),
  '오세아니아': COUNTRIES.filter(c => ['AU', 'NZ'].includes(c.code)),
  '아프리카': COUNTRIES.filter(c => ['ZA', 'EG', 'MA', 'NG', 'KE', 'ET'].includes(c.code)),
  '남미': COUNTRIES.filter(c => ['BR', 'AR', 'CL', 'PE', 'CO', 'VE'].includes(c.code)),
  '중동': COUNTRIES.filter(c => ['AE', 'SA', 'IL', 'IR', 'IQ', 'JO', 'LB', 'QA', 'KW', 'OM'].includes(c.code)),
};

/**
 * 실제 국기 이미지 URL 생성 함수
 */
export const getFlagImageUrl = (countryCode: string, size: 'small' | 'medium' | 'large' = 'small'): string => {
  if (!countryCode || countryCode.trim() === '') {
    return ''; // 빈 문자열 반환, 기본 아이콘은 컴포넌트에서 처리
  }

  // 국가 코드를 소문자로 변환
  const code = countryCode.toLowerCase();
  
  // 크기별 설정
  const sizeConfig = {
    small: '24x18',   // 작은 크기 (댓글, 인라인)
    medium: '32x24',  // 중간 크기 (카드)
    large: '48x36'    // 큰 크기 (상세페이지)
  };

  // flagcdn.com CDN 사용 (무료, 고품질 SVG/PNG)
  return `https://flagcdn.com/${sizeConfig[size]}/${code}.png`;
};

// React 컴포넌트에서 사용할 국기 이미지 속성 생성
export const getFlagImageProps = (countryCode: string, size: 'small' | 'medium' | 'large' = 'small') => {
  const country = getCountryByCode(countryCode) || getCountryByName(countryCode);
  
  return {
    src: getFlagImageUrl(countryCode, size),
    alt: `${country?.name || countryCode} 국기`,
    title: country?.name || countryCode,
    style: {
      width: size === 'small' ? '20px' : size === 'medium' ? '24px' : '32px',
      height: 'auto',
      borderRadius: '2px',
      marginRight: '6px',
      verticalAlign: 'middle'
    },
    onError: (e: any) => {
      // 이미지 로드 실패 시 이모지 폴백
      e.target.style.display = 'none';
      if (e.target.nextSibling && e.target.nextSibling.style) {
        e.target.nextSibling.style.display = 'inline';
      }
    }
  };
}; 