import React, { useState, useEffect, useRef, useCallback } from 'react';
import {
  Box,
  Modal,
  Backdrop,
  Fade,
  Typography,
  Avatar,
  IconButton,
  Card,
  Chip,
} from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';
import TravelExploreIcon from '@mui/icons-material/TravelExplore';
import WorkIcon from '@mui/icons-material/Work';
import HomeIcon from '@mui/icons-material/Home';
import SchoolIcon from '@mui/icons-material/School';
import RestaurantIcon from '@mui/icons-material/Restaurant';
import DirectionsTransitIcon from '@mui/icons-material/DirectionsTransit';
import HotelIcon from '@mui/icons-material/Hotel';
import LocalHospitalIcon from '@mui/icons-material/LocalHospital';
import BusinessIcon from '@mui/icons-material/Business';
import AccountBalanceIcon from '@mui/icons-material/AccountBalance';
import InfoIcon from '@mui/icons-material/Info';
import LocationOnIcon from '@mui/icons-material/LocationOn';
import AccessTimeIcon from '@mui/icons-material/AccessTime';
import { useMypageStore } from '../../features/mypage/store/mypageStore';

// 사용자 목적 타입
type UserPurpose = 'travel' | 'work' | 'residence' | 'study';

// 목적별 정보
const PURPOSE_INFO: Record<UserPurpose, {
  label: string;
  icon: React.ReactElement;
  color: string;
  gradient: string;
}> = {
  travel: {
    label: '여행',
    icon: <TravelExploreIcon />,
    color: '#2196f3',
    gradient: 'linear-gradient(135deg, #2196f3 0%, #21cbf3 100%)',
  },
  work: {
    label: '취업',
    icon: <WorkIcon />,
    color: '#ff9800',
    gradient: 'linear-gradient(135deg, #ff9800 0%, #ffb74d 100%)',
  },
  residence: {
    label: '거주',
    icon: <HomeIcon />,
    color: '#4caf50',
    gradient: 'linear-gradient(135deg, #4caf50 0%, #66bb6a 100%)',
  },
  study: {
    label: '학업',
    icon: <SchoolIcon />,
    color: '#9c27b0',
    gradient: 'linear-gradient(135deg, #9c27b0 0%, #ba68c8 100%)',
  },
};

// 여행 관련 데이터 (사용자가 제공한 실제 콘텐츠)
const TRAVEL_CONTENT = [
  {
    id: 'hanbok-experience',
    title: '🇰🇷 한복 입고 경복궁 체험하기',
    icon: <TravelExploreIcon />,
    category: '문화체험',
    description: '전통의상을 입고 고궁을 거닐며 인생샷을 남기세요',
    details: {
      location: '서울 종로구 세종로 161',
      transport: '지하철 3호선 경복궁역 5번 출구 도보 5분',
      hours: '매일 09:00 ~ 18:00 (매주 화요일 휴무)',
      price: '일반 입장료: 성인 3,000원 / 한복 착용 시 무료',
      tips: ['경복궁 근처에 다양한 한복 대여점이 있어요', '1시간 ~ 하루 종일 대여 가능 (약 15,000원부터)']
    }
  },
  {
    id: 'gwangjang-market',
    title: '🍲 전통시장 먹거리 투어: 광장시장',
    icon: <RestaurantIcon />,
    category: '식도락/맛집',
    description: '한국 전통 먹거리를 저렴하게 즐길 수 있는 명소',
    details: {
      location: '서울 종로구 창경궁로 88',
      transport: '지하철 1호선 종로5가역 8번 출구 도보 2분',
      specialties: ['마약김밥 (Mini Gimbap)', '빈대떡 (Mung Bean Pancake)', '떡볶이 (Spicy Rice Cake)', '잡채, 육회 등'],
      tips: ['현금 결제가 편해요! (카드 가능한 곳도 많음)', '점심시간보다 이른 시간에 가면 덜 붐벼요']
    }
  },
  {
    id: 'temple-stay',
    title: '🧘‍♀️ 템플스테이: 사찰에서 하룻밤 보내기',
    icon: <AccountBalanceIcon />,
    category: '문화체험',
    description: '한국의 전통 불교문화를 체험할 수 있는 특별한 프로그램',
    details: {
      locations: ['서울 조계사', '양평 전통사찰 봉선사', '경주 골굴사 (선무도 체험 가능)'],
      program: '1박 2일 또는 당일 체험 - 명상, 사찰음식 체험, 스님과의 대화 등',
      price: '약 50,000 ~ 100,000원 (사찰마다 상이)',
      website: 'https://www.templestay.com'
    }
  },
  {
    id: 'korean-bbq',
    title: '🍖 한국식 바비큐, 직접 구워 먹는 즐거움!',
    icon: <RestaurantIcon />,
    category: '식도락/맛집',
    description: '직접 고기를 구워 먹는 독특한 문화',
    details: {
      areas: {
        '홍대': '젊은 분위기, 영어 메뉴 가능한 곳 다수',
        '강남': '프리미엄 고깃집 많음',
        '이태원': '외국인 친화적, 다양한 고기 옵션 제공'
      },
      tips: ['고기는 직원이 구워주는 경우도 있어요!', '쌈장 + 마늘 + 채소 조합을 추천!', '대부분 1인분(150g) 기준 주문 (2인 이상 방문 추천)']
    }
  },
  {
    id: 'bibimbap',
    title: '🍲 전주 비빔밥: 건강하고 화려한 한 끼',
    icon: <RestaurantIcon />,
    category: '식도락/맛집',
    description: '건강하고 화려한 한국 전통 음식',
    details: {
      restaurants: {
        '전주 한옥마을': '전통 비빔밥의 성지',
        '명동 고궁': '서울 중심에서 제대로 된 비빔밥',
        '인사동 한정식집': '비빔밥과 함께 전통 반찬도 제공'
      },
      tips: ['고추장이 매울 수 있어요, 양 조절 가능', '채식 비빔밥도 메뉴에 있는 경우 많아요']
    }
  },
  {
    id: 'street-food',
    title: '🧁 한국 길거리 간식 BEST 3',
    icon: <RestaurantIcon />,
    category: '식도락/맛집',
    description: '저렴하고 맛있는 길거리 간식',
    details: {
      foods: [
        '호떡 (Hotteok): 달콤한 시나몬 견과류가 들어간 겨울 간식',
        '튀김 + 떡볶이 세트: 매콤한 소스와 환상 궁합',
        '붕어빵: 생선 모양 안에 단팥 or 크림이 들어간 간식'
      ],
      locations: ['명동 거리: 다양한 종류의 포장마차', '광장시장: 저렴하고 전통적인 분위기', '홍대 걷고싶은 거리: 젊은 감성의 트렌디 간식'],
      price: '대부분 1,000원~3,000원 사이'
    }
  },
  {
    id: 'subway-guide',
    title: '🚇 한국 지하철 완전 정복 가이드',
    icon: <DirectionsTransitIcon />,
    category: '교통/이동',
    description: '빠르고 저렴하며 외국인 친화적인 지하철 이용법',
    details: {
      howto: 'T-money 교통카드 구입 → 충전 → 태그해서 이용',
      price: '기본요금: 약 1,400원 ~ 1,500원',
      apps: ['Kakao Metro: 노선도 및 환승 정보', 'NAVER Map / Kakao Map: 실시간 길찾기'],
      tips: ['열차 문은 자동으로 닫혀요, 빨리 타야 해요!', '전철 안에서는 조용히! 전화 통화는 자제하는 게 매너예요']
    }
  },
  {
    id: 'airport-transport',
    title: '🚌 공항에서 도심까지: 공항 리무진 or AREX?',
    icon: <DirectionsTransitIcon />,
    category: '교통/이동',
    description: '인천국제공항에서 서울 시내로 이동하는 방법',
    details: {
      options: [
        '공항 리무진버스: 16,000원~, 60~80분, 호텔 앞 정차',
        'AREX 직통열차: 9,500원, 43분, 서울역까지 논스톱',
        '일반 AREX: 4,750원, 60분, 저렴한 옵션'
      ],
      tips: ['티켓은 공항 내 매표소 또는 자동판매기에서 구매', '카드결제 가능 / 짐 실을 공간 있음']
    }
  },
  {
    id: 'taxi-guide',
    title: '🚕 택시 이용법과 주의사항',
    icon: <DirectionsTransitIcon />,
    category: '교통/이동',
    description: '한국에서 택시를 안전하고 편리하게 이용하는 방법',
    details: {
      basic: '기본요금: 약 4,800원 (서울 기준, 2km)',
      apps: ['Kakao T (카카오택시) – 영어 가능, 카드결제 선택 가능', 'UT(우티) – 외국인 친화적 인터페이스'],
      warnings: ['비공식 택시(흰색 개인차량)는 피하세요!', '택시 안에서는 미터기 켜는지 꼭 확인하세요']
    }
  },
  {
    id: 'accommodation-tips',
    title: '🏨 한국에서 숙소 고를 때 고려할 5가지',
    icon: <HotelIcon />,
    category: '숙소/지역정보',
    description: '예산과 여행 스타일에 맞는 숙소 선택 가이드',
    details: {
      checklist: ['위치: 지하철역과 얼마나 가까운가?', '언어지원: 영어 가능한 스태프 or 안내 시스템?', '시설: 와이파이, 세탁기, 조식 제공 여부', '리뷰: Google, Booking.com, Agoda에서 확인'],
      types: ['비즈니스 호텔: 도심, 깔끔함', '게스트하우스: 저렴, 교류 가능', '한옥스테이: 전통문화 체험 가능'],
      platforms: ['Airbnb, Booking.com, Agoda', '한옥 체험은 koreanstay.kr도 추천!']
    }
  },
  {
    id: 'seoul-districts',
    title: '🗺️ 서울 지역별 숙소 선택 가이드',
    icon: <LocationOnIcon />,
    category: '숙소/지역정보',
    description: '서울 지역별 특징과 추천 대상',
    details: {
      districts: {
        '명동': '쇼핑, 환전, 관광지 밀집, 영어 친화적 - 서울 첫 방문자',
        '홍대': '젊은 분위기, 밤문화, 카페 거리 - 자유 여행객',
        '강남': '세련된 도시 분위기, 고급 숙소, 교통 중심지 - 출장, 중장기 체류',
        '이태원': '다양한 국적의 여행자, 외국 식당 많음 - 외국인 커뮤니티 선호',
        '종로/인사동': '전통문화, 고궁 근처, 조용하고 예술적인 분위기 - 문화 체험 목적'
      },
      tips: ['지하철 2호선 또는 4호선 근처 숙소는 이동이 매우 편리해요!', '공항 리무진 정차 여부도 체크하면 좋아요']
    }
  },
  {
    id: 'hanok-stay',
    title: '🏠 한옥에서 하룻밤: 전통과 함께하는 숙박 체험',
    icon: <HomeIcon />,
    category: '숙소/지역정보',
    description: '전통 한옥 건물에서 한국 문화를 직접 체험',
    details: {
      locations: ['서울 북촌 한옥마을: 도심 속 한옥 체험', '전주 한옥마을: 한옥 체험의 본고장', '경주/안동: 전통문화와 한옥이 잘 보존된 지역'],
      experience: '온돌방(바닥 난방), 다도 체험, 한복 체험, 전통 조식 제공',
      price: '1박 기준 50,000 ~ 150,000원 (시설 및 위치에 따라 차이)',
      booking: 'KoreaStay, Airbnb, Agoda 등에서 "Hanok" 검색'
    }
  },
  {
    id: 'emergency-contacts',
    title: '🏥 응급상황 시 꼭 알아야 할 한국 연락처',
    icon: <LocalHospitalIcon />,
    category: '대사관/응급',
    description: '갑작스러운 사고나 병이 발생했을 때 대처 방법',
    details: {
      emergency: ['응급 의료/화재: 119 (영어 가능)', '경찰 신고: 112', '외국인 민원: 1345 (다국어 지원)', '여행자 헬프라인: 1330 (24시간, 카카오톡 채팅 상담도 가능)'],
      tips: ['한국 대부분의 응급 콜센터는 영어 포함 다국어 지원 가능', '1330은 카카오톡 채팅 상담도 가능 (관광 관련 문의 시 유용)']
    }
  },
  {
    id: 'embassies',
    title: '🏛️ 한국 내 주요 대사관 위치 및 연락처',
    icon: <AccountBalanceIcon />,
    category: '대사관/응급',
    description: '여권 분실, 체포, 사고 등 긴급 상황 시 연락처',
    details: {
      embassies: {
        '미국': '종로구 세종대로 188, 02-397-4114',
        '캐나다': '중구 정동길 21, 02-3783-6000',
        '영국': '종로구 세종대로 19, 02-3210-5500',
        '프랑스': '서초구 효령로 396, 02-3149-4300',
        '일본': '종로구 율곡로 6, 02-765-3011'
      },
      tips: ['Google 지도에서 "[국가] embassy Seoul" 검색하면 빠르게 찾을 수 있어요', '여권 사본을 미리 사진 찍어두면 좋아요']
    }
  },
  {
    id: 'medical-guide',
    title: '💊 여행 중 병원/약국 이용 가이드',
    icon: <LocalHospitalIcon />,
    category: '대사관/응급',
    description: '한국의 의료 시스템과 외국인 진료 가능한 병원',
    details: {
      hospitals: ['서울의료원 국제진료센터: 02-2276-7000', '세브란스병원 국제진료센터: 1599-1004', '삼성서울병원 International Clinic: 02-3410-0200'],
      pharmacy: ['약국은 보통 "약(藥)" 표시 간판이 있어요', '일반 감기약, 소화제는 처방 없이 구매 가능', '의사 처방전이 필요한 약도 많으니, 병원 먼저 방문하는 걸 추천'],
      apps: ['KakaoMap / NAVER Map에서 "약국", "병원" 검색 가능', 'Goodoc: 영어로 병원/약국 리뷰 및 위치 확인 가능']
    }
  }
];

// 거주 관련 데이터 (사용자가 제공한 실제 콘텐츠)
const RESIDENCE_CONTENT = [
  {
    id: 'real-estate-contracts',
    title: '🏠 한국에서 집 구하기: 전세, 월세, 단기임대 차이',
    icon: <HomeIcon />,
    category: '부동산/계약',
    description: '한국의 독특한 부동산 계약 방식 이해하기',
    details: {
      types: {
        '전세': '큰 보증금(예: 1억 원)만 내고 월세는 없음 - 외국인에게 비추천',
        '월세': '보증금 + 매달 월세 납부 - 일반적 선택',
        '단기임대': '1~6개월 단위, 가구·가전 포함, 계약 간단 - 단기 체류자에게 적합'
      },
      tips: ['단기 체류자는 에어비앤비 / 고시원 / 쉐어하우스도 고려 가능', '보증금은 퇴실 시 대부분 환급됨 (계약서에 조건 명시됨)']
    }
  },
  {
    id: 'contract-process',
    title: '📝 부동산 계약 절차 & 체크리스트',
    icon: <BusinessIcon />,
    category: '부동산/계약',
    description: '외국인도 합법적으로 계약할 수 있는 절차와 주의사항',
    details: {
      process: ['매물 찾기: 부동산 중개업소 방문 또는 앱 이용', '집 보기: 원하는 위치/조건의 집을 직접 방문', '계약서 작성: 보증금, 월세, 계약기간, 관리비 포함 여부 확인', '전입신고 및 외국인등록지 변경: 이사 후 14일 이내 신고 필요'],
      checklist: ['집주인이 실제 소유자인지 확인 (등기부등본 요청 가능)', '중개사 등록번호 확인 (불법 중개 주의)', '관리비 포함 항목 명확히 확인 (전기, 수도, 인터넷 등)']
    }
  },
  {
    id: 'real-estate-apps',
    title: '📱 외국인 집 구할 때 유용한 앱 & 서비스',
    icon: <BusinessIcon />,
    category: '부동산/계약',
    description: '한국어가 서툴러도 이용 가능한 부동산 플랫폼',
    details: {
      platforms: {
        '직방 (Zigbang)': '다양한 월세/전세 매물, 3D뷰 지원',
        '다방 (Dabang)': '사용 편리, 서울 주요지역 위주 매물 다수',
        'Wehome / Airbnb': '단기 렌트에 적합, 외국어 안내 있음',
        'Housing Seoul': '서울시 공공 외국인 주택정보 사이트',
        'Ziptoss': '영어 중개사 매칭, 계약/입주까지 도와주는 외국인 전용 서비스'
      },
      tips: ['대부분의 중개사무소는 한국어만 사용 → "외국인 전용 중개" 검색', '서울 강남, 이태원, 홍대, 송도 등에는 외국인 대상 중개사 다수 있음']
    }
  },
  {
    id: 'life-shopping',
    title: '🛒 외국인을 위한 한국 생활 쇼핑 가이드',
    icon: <BusinessIcon />,
    category: '생활환경/편의',
    description: '장보기와 생활용품 구매를 위한 쇼핑 채널',
    details: {
      offline: {
        '이마트 / 홈플러스 / 롯데마트': '대형마트, 식료품·생활용품 전부 가능',
        '다이소': '저렴한 생활용품, 전 지점 동일한 가격대',
        '편의점(CU, GS25, 7-Eleven)': '간단한 식사·음료·생활용품 24시간 운영'
      },
      online: {
        'Coupang': '빠른 배송(새벽배송 포함), 가입 쉬움',
        'Gmarket/11번가': '외국어 모드 가능 (영어/중국어 등)',
        'Market Kurly': '프리미엄 식품 중심, 새벽배송 가능'
      },
      tips: ['배달앱(배달의민족, 요기요)는 한식뿐 아니라 외국 음식도 다양하게 배달 가능!']
    }
  },
  {
    id: 'daily-life-basics',
    title: '🧺 세탁, 우편, 쓰레기 배출… 한국 생활의 기본',
    icon: <BusinessIcon />,
    category: '생활환경/편의',
    description: '한국 생활에서 자주 접하는 기본 시스템들',
    details: {
      laundry: ['대부분 원룸/아파트는 세탁기 기본 포함', '공동세탁기/건조기 있는 쉐어하우스도 많음', '세탁방(코인워시)에서는 현금 또는 앱 결제 가능'],
      delivery: ['주소는 한국식 주소 체계 (도로명주소) 사용', '무인택배함 사용 시, 문자로 인증번호 수신 → 입력 후 수령'],
      garbage: {
        '일반쓰레기': '종량제 봉투 필요 (편의점/마트에서 구매)',
        '음식물쓰레기': '아파트 내 음식물통 / RFID 방식으로 배출',
        '재활용품': '플라스틱, 캔, 유리병, 종이 분리 배출 필수'
      },
      tips: ['외국인은 쓰레기 배출 규칙을 몰라 불이익을 당하는 경우도 있으니, 입주 시 꼭 관리자에게 확인해보는 게 좋아요']
    }
  },
  {
    id: 'best-districts',
    title: '🌆 살기 좋은 한국 도시/동네 TOP 지역 소개',
    icon: <LocationOnIcon />,
    category: '생활환경/편의',
    description: '장기 거주를 위한 외국인 친화적 지역',
    details: {
      seoul: {
        '이태원': '다국적 식당, 외국인 밀집, 영어 사용 용이 - 영어권 외국인',
        '홍대': '젊고 자유로운 분위기, 다양한 카페·문화공간 - 학생·크리에이터',
        '강남': '교통 편리, 다양한 편의시설, 고급 주택지역 - 전문가·장기 체류자',
        '성수/왕십리': '신도시 개발지역, 새 아파트, 대형 마트·병원 밀집 - 가족 단위 거주자'
      },
      other_cities: {
        '부산': '바다 근처, 해운대·광안리 인기, 외국인 커뮤니티 존재',
        '인천 송도': '국제도시, 영어 가능한 환경, 외국계 회사 다수',
        '대구/대전/광주': '저렴한 물가, 교육시설 우수, 지방생활 선호자에게 추천'
      },
      tips: ['한국의 네이버부동산, 직방, 다방 앱에서 해당 지역 편의시설, 학교, 병원 정보까지 확인 가능!']
    }
  },
  {
    id: 'korean-etiquette',
    title: '🎭 한국의 기본 예절과 생활 문화 익히기',
    icon: <SchoolIcon />,
    category: '문화/생활',
    description: '일상에서 자주 마주치는 상황별 기본 예절',
    details: {
      greetings: ['고개를 살짝 숙이며 인사 → 공손함의 표현', '어른/직장 상사에게는 "안녕하세요"보다 "안녕하십니까" 사용'],
      indoor: ['집, 일부 전통식당, 찜질방 등에서는 신발 벗고 입장', '신발장 있는 곳은 대부분 벗어야 함'],
      dining: ['어른보다 먼저 식사 시작 ❌', '술은 두 손으로 따르고 받기 (특히 어른에게는 필수)', '국물 소리 내며 먹는 건 자연스러움 (특히 면요리)'],
      tips: ['문화 차이로 인한 오해를 줄이기 위해, 처음엔 주변을 보고 따라하는 것도 좋아요!']
    }
  },
  {
    id: 'leisure-activities',
    title: '🧘‍♀️ 한국에서 여가를 즐기는 방법: 체험과 취미활동',
    icon: <TravelExploreIcon />,
    category: '문화/생활',
    description: '외국인도 쉽게 참여할 수 있는 다양한 활동들',
    details: {
      traditional: {
        '한복 체험': '경복궁, 북촌 한옥마을',
        '도자기 만들기': '이천 도예촌, 인사동 공방',
        '전통 음식 만들기': '한식문화관, 쿠킹클래스 플랫폼 (클래스101 등)'
      },
      modern: {
        '헬스/필라테스': '대부분 아파트 단지 또는 근처 센터 존재',
        '독서/스터디카페': '24시간 운영, 조용한 공간 필요할 때 추천',
        '외국인 모임': 'Meetup, Facebook 그룹, 교환학생 커뮤니티 등에서 다국적 모임 다수 운영'
      },
      tips: ['"탈잉", "클래스101", "Frip" 같은 앱에서는 영어로 제공되는 수업도 종종 찾아볼 수 있어요!']
    }
  },
  {
    id: 'holidays-seasons',
    title: '📅 한국의 공휴일과 계절별 생활 팁',
    icon: <InfoIcon />,
    category: '문화/생활',
    description: '한국의 사계절과 대형 연휴 시기 생활 정보',
    details: {
      holidays: {
        '설날(음력 1월)': '1~2월, 가족과 함께 지내는 명절, 가게들 많이 닫음',
        '추석(음력 8월)': '9~10월, 한국의 추수감사절, 고향 방문 많음',
        '광복절': '8월 15일, 한국 독립 기념일',
        '크리스마스': '12월 25일, 공휴일이나 가족보다는 연인 중심 문화'
      },
      seasons: {
        '봄': '꽃축제 시즌(벚꽃), 미세먼지 심한 날 많음 → 마스크 필수',
        '여름': '매우 습하고 더움 → 에어컨 필수, 모기 주의',
        '가을': '날씨 좋고 걷기 좋은 계절 → 단풍 구경 명소 인기',
        '겨울': '영하로 떨어짐, 난방·방한용품 필요 → 전기장판 인기'
      },
      tips: ['공휴일에는 일부 식당·가게가 쉬기도 하니, 미리 확인하는 게 좋아요!']
    }
  },
  {
    id: 'management-fees',
    title: '🧾 관리비란? 한국의 아파트·오피스텔 관리비 구조',
    icon: <BusinessIcon />,
    category: '주거지 관리/유지',
    description: '월별 관리비에 포함되는 항목들',
    details: {
      includes: {
        '공용 전기/수도료': '엘리베이터, 복도, 외부 조명 등 공용 시설 사용료',
        '경비/청소 인건비': '건물 관리인, 청소 인력 비용',
        '난방비(지역난방인 경우)': '계절별 부과, 특히 겨울철 비용 증가 가능성',
        '기타(인터넷, TV 등)': '일부 건물은 인터넷, TV 시청료 포함하기도 함'
      },
      tips: ['어떤 비용이 포함되는지 계약서에 명시되어 있으므로 꼭 확인하세요!']
    }
  },
  {
    id: 'facility-repair',
    title: '🔧 집안 시설 고장났을 때: 수리 요청 & 해결 방법',
    icon: <BusinessIcon />,
    category: '주거지 관리/유지',
    description: '거주 중 시설 문제 발생 시 대응 방법',
    details: {
      common_problems: {
        '수도/배관 누수': '관리사무소 또는 집주인에게 바로 연락',
        '보일러 작동 안 됨': '난방 기기 이상 시 A/S 센터 또는 중개인 통해 요청',
        '에어컨/세탁기 고장': '빌트인 제품은 집주인이 A/S 처리, 개인 구매 제품은 본인 부담'
      },
      contacts: ['관리사무소: 아파트나 오피스텔 내 공용시설 관련 문제', '임대인 또는 중개업자: 집 내부 고장이나 계약 관련 문제', '고객센터(삼성/LG 등): 가전제품 문제 시'],
      tips: ['외국인 전용 콜센터를 운영하는 관리사무소도 있어요. 입주 전 문의해보면 좋아요!']
    }
  },
  {
    id: 'utility-bills',
    title: '⚡ 전기, 가스, 수도 요금 납부 및 절약 팁',
    icon: <BusinessIcon />,
    category: '주거지 관리/유지',
    description: '공공요금 납부 방식과 절약 방법',
    details: {
      payment: {
        '전기': '한국전력(Kepco)에서 고지서 발행, 은행·앱 납부 가능',
        '수도': '각 지자체에서 관리, 관리비에 포함되기도 함',
        '가스': '지역 도시가스 업체(예: 서울도시가스) 통해 고지서 발송'
      },
      payment_methods: ['은행 계좌 자동이체', '카카오페이, 네이버페이 등 간편결제 앱도 사용 가능!'],
      saving_tips: {
        '전기': '여름철 에어컨 타이머 설정, 대기전력 차단 멀티탭 사용',
        '가스': '겨울철 보일러 외출 모드 활용, 창문 단열 필름 부착',
        '수도': '샤워시간 줄이기, 절수형 샤워기 사용'
      }
    }
  }
];

// 업무/취업 관련 데이터 (사용자가 제공한 실제 콘텐츠)
const WORK_CONTENT = [
  {
    id: 'korean-resume',
    title: '📄 한국식 이력서(Resume) 작성 가이드',
    icon: <WorkIcon />,
    category: '이력/채용준비',
    description: '외국인 유학생을 위한 한국식 이력서 작성법',
    details: {
      basic_structure: ['인적사항 (이름, 생년월일, 연락처)', '사진 (증명사진 필수, 최근 6개월 이내)', '학력 및 경력', '어학능력 (TOPIK, TOEIC, JLPT 등)', '자격증', '수상내역 및 활동 경력'],
      writing_tips: ['워드 or 한글 문서로 작성 (PDF 저장 추천)', '한국식 연도 표기 사용 (예: 2025.03 ~ 2025.08)', '불필요한 정보 줄이고 핵심 강조 (성과 중심)'],
      reference_sites: ['사람인 이력서 양식: saramin.co.kr', '잡코리아 샘플: jobkorea.co.kr']
    }
  },
  {
    id: 'cover-letter',
    title: '👔 한국식 자기소개서(자소서) 4문항 구조',
    icon: <WorkIcon />,
    category: '이력/채용준비',
    description: '한국 기업 자소서 작성의 핵심 구조 이해',
    details: {
      four_sections: {
        '성장 과정': '배경 설명 + 성격 형성 과정 (문화 적응력 강조 가능)',
        '성격의 장단점': '장점 중심 + 단점을 보완하려는 노력',
        '지원 동기 및 입사 후 포부': '회사/직무 조사 결과를 바탕으로 구체적으로 작성',
        '경험 및 활동 사례': 'STAR 기법 활용 (Situation, Task, Action, Result)'
      },
      writing_tips: ['너무 추상적인 표현은 피하기', '한국어로 직접 작성 후, 교정 도움 받기 (학교 커리어 센터 또는 한국인 친구)']
    }
  },
  {
    id: 'interview-prep',
    title: '🎤 외국인을 위한 한국 취업 면접 준비 전략',
    icon: <WorkIcon />,
    category: '이력/채용준비',
    description: '한국 기업 면접의 문화적 특성과 준비 요령',
    details: {
      interview_types: ['1차 서류 통과 후 인성 면접 (개별/패널)', '2차 실무 면접 또는 PT 면접', '일부 기업은 AI 면접, 집단 토론 포함'],
      common_questions: ['자기소개 (1분 자기소개 = "자기PR")', '지원동기 / 장단점', '갈등 해결 경험', '한국에서 일하고 싶은 이유'],
      foreigner_specific: ['한국어 능력 수준', '한국 문화 적응 경험', '비자/체류 관련 상황 설명'],
      tips: ['면접 전 모의면접 필수!', '정장 착용 + 시간 엄수 + 존댓말 사용', '마지막 질문: "하고 싶은 말 있으신가요?" → 짧고 긍정적인 마무리']
    }
  },
  {
    id: 'work-visa',
    title: '🛂 한국 취업 비자 종류 정리 (D-10, E-7, F-2 등)',
    icon: <BusinessIcon />,
    category: '비자/법률/노동',
    description: '졸업 후 한국 취업을 위한 비자 전환 가이드',
    details: {
      visa_types: {
        'D-10 (구직 비자)': '졸업 후 구직 활동 중인 외국인 - 최대 6개월, 1회 연장 가능',
        'E-7 (전문직 비자)': '전문 인력 (IT, 디자인, 무역 등) - 학력 + 경력 필요, 고용계약 필수',
        'F-2-7 (거주 비자)': '일정 점수 이상 우수 인재 - 자유 취업 가능, 장기 체류에 유리',
        'F-4 (재외동포)': '한국계 외국인 - 취업 제한 거의 없음, 자유로운 활동 가능'
      },
      conversion_tips: ['D-2 → D-10: 졸업 전 30일 이내 신청', 'D-10 → E-7: 고용계약서 + 관련 전공 또는 경력 증빙 필요', 'E-7 조건 강화: 연봉, 업종, 학력 기준 확인 필수']
    }
  },
  {
    id: 'labor-law',
    title: '⚖️ 외국인 근로자를 위한 한국 노동법 기초',
    icon: <BusinessIcon />,
    category: '비자/법률/노동',
    description: '외국인 근로자의 기본 권리와 의무',
    details: {
      basic_rights: ['최저임금 보장 (2025년 기준: ₩9,860/시간)', '주 1회 유급휴일, 주 52시간 근무 제한', '4대 보험 가입 대상 (국민연금, 건강보험, 고용보험, 산재보험)', '부당 해고 시 노동청 진정 가능'],
      common_problems: ['무계약 근로 / 불법 체류 후 취업', '임금 체불', '휴일/야근 수당 미지급'],
      help_contacts: ['고용노동부 1350 콜센터 (다국어 지원)', '외국인력지원센터 또는 지역 노동청']
    }
  },
  {
    id: 'employment-contract',
    title: '📑 외국인을 위한 근로계약서 체크리스트',
    icon: <BusinessIcon />,
    category: '비자/법률/노동',
    description: '합법적인 근로를 위한 계약서 필수 사항',
    details: {
      required_items: ['근무지 주소', '업무 내용', '근로 시간 및 휴게 시간', '임금 (지급일, 방식 포함)', '휴일 및 연차', '퇴직금 및 계약 종료 조건'],
      precautions: ['구두계약만 존재하거나 계약서 미제공 시 거절 권리 있음', '계약서 사본 꼭 보관', '한국어로만 작성된 경우, 번역 도움 요청 가능'],
      references: ['고용노동부 외국인 고용 가이드북', 'HiKorea 비자 정보 포털']
    }
  },
  {
    id: 'job-fair',
    title: '🎪 외국인 유학생을 위한 취업 박람회(잡페어) 안내',
    icon: <BusinessIcon />,
    category: '잡페어/네트워킹',
    description: '취업 정보와 기회를 직접 얻을 수 있는 현장',
    details: {
      major_events: {
        '외국인 유학생 채용박람회': '주최: 고용노동부, 산업통상자원부 / 시기: 보통 9~10월 / 장소: 코엑스, SETEC 등',
        '대학별 글로벌 잡페어': '고려대, 성균관대, 연세대 등 / 외국계/국내기업 다수 참여'
      },
      preparation: ['국/영문 이력서, 자기소개서', '복장: 비즈니스 정장', '기본 한국어 회화 준비'],
      tips: ['기업별 부스 방문 전 관심 기업 조사', '현장 면접 기회 있으므로 자기소개 연습 필수']
    }
  },
  {
    id: 'networking',
    title: '🤝 한국에서 네트워킹하는 5가지 방법',
    icon: <BusinessIcon />,
    category: '잡페어/네트워킹',
    description: '네트워크 중심 사회인 한국에서의 관계 형성법',
    details: {
      methods: ['학교 커리어 센터 프로그램 - 멘토링, 기업 특강, 취업 동아리', '국제학생 모임 - AIESEC, ISN, Buddy Program 등', '링크드인(LinkedIn) 활용 - 기업 담당자, 동문 연결', '한-외국인 기업 교류회 - 대한상공회의소, 코트라, 외국인 투자청 주최', '각국 대사관 행사 - 문화 행사 + 기업 정보 제공 병행'],
      networking_tips: ['자기소개 준비 (한/영 버전)', '명함 또는 연락처 카드 지참', '후속 연락(이메일, SNS) 필수']
    }
  },
  {
    id: 'part-time-work',
    title: '💼 외국인 유학생의 합법적인 아르바이트 조건 (D-2 비자)',
    icon: <WorkIcon />,
    category: '알바/파트타임',
    description: 'D-2 비자 유학생의 아르바이트 가능 조건',
    details: {
      requirements: ['외국인등록증 발급 완료', '대학의 사전 허가 필요 (지도교수 또는 국제처 승인)', '출입국관리사무소에 근로허가 신청 후 허가증(Permission Letter) 발급'],
      working_hours: ['학기 중: 주당 20시간 이하 (주말, 공휴일 제외)', '방학 중: 시간 제한 없음', '대학원생: 조교 근무 외 별도 규정 적용 가능'],
      allowed_jobs: ['음식점 서빙, 편의점, 카페', '통·번역 보조, 외국어 강사 보조', '마트 계산, 사무보조 등 단순 서비스업'],
      prohibited: ['유흥업소, 노래방, 마사지샵, 도박 관련 업종 등']
    }
  },
  {
    id: 'part-time-job-search',
    title: '🔍 유학생 아르바이트 구하는 방법 5가지',
    icon: <WorkIcon />,
    category: '알바/파트타임',
    description: '외국인 유학생이 쉽게 접근할 수 있는 알바 구직 경로',
    details: {
      platforms: {
        '알바몬 / 알바천국': '외국인 전용 필터 있음 - https://www.albamon.com, https://www.alba.co.kr',
        '학교 국제처 게시판 / SNS': '유학생 대상 교내 알바 공고 자주 게시됨',
        '외국인 커뮤니티': 'Facebook 그룹, 카카오 오픈채팅 등',
        '지역 기반 알바 정보 앱': '당근알바, 직방 알바 등',
        '지인 추천 또는 방문 문의': '주변 상점 직접 방문 시 채용 중인 곳 발견 가능'
      },
      tips: ['이력서 준비: 간단한 한국어 자기소개 포함', '출입국 허가증(Permission Letter) 꼭 소지 후 근무']
    }
  },
  {
    id: 'part-time-precautions',
    title: '⚠️ 외국인 유학생이 아르바이트 할 때 주의할 점',
    icon: <WorkIcon />,
    category: '알바/파트타임',
    description: '알바 시 체류에 문제가 되지 않도록 하는 주의사항',
    details: {
      warnings: ['출입국 허가 없이 근무 = 불법체류 간주', '최저임금 미만 지급 시 신고 가능 (2025년 기준: ₩9,860/시간)', '임금 체불 시 근로계약서 없으면 불리', '고용주가 외국인 신분 악용할 수 있음 → 항상 계약서 서면 작성'],
      protection: ['고용노동부 1350 콜센터 이용 (다국어 지원)', '외국인력지원센터 상담', '학교 국제처 신고 또는 도움 요청'],
      checklist: ['출입국 근로허가 받았는가?', '근로계약서를 썼는가?', '급여 지급 방식과 날짜는 명확한가?', '주휴수당, 야근수당 등 받을 수 있는 권리는 알고 있는가?']
    }
  }
];

// 학업/유학 관련 데이터 (사용자가 제공한 실제 콘텐츠)
const STUDY_CONTENT = [
  {
    id: 'university-admission',
    title: '📚 한국 대학 학사 과정 입학 가이드',
    icon: <SchoolIcon />,
    category: '학사/캠퍼스',
    description: '외국인 유학생을 위한 단계별 입학 절차',
    details: {
      main_procedures: ['대학 및 전공 선택 - 국립/사립대학교 선택, 전공에 따른 특성 확인', '지원 서류 준비 - 고등학교 졸업 증명서 (공증 필요), 성적 증명서, 자기소개서 및 학업계획서', '한국어 능력 시험(TOPIK) 또는 영어 성적 (학교에 따라 다름)', '입학 일정 확인 - 대부분의 대학은 봄학기(3월), 가을학기(9월) 입학'],
      university_examples: ['서울대(연구 중심)', '한양대(공학 특화)', '이화여대(여성 전용)'],
      references: ['Study in Korea', '각 대학교 국제처 홈페이지']
    }
  },
  {
    id: 'campus-life',
    title: '🏫 한국 대학교 캠퍼스 생활 A to Z',
    icon: <SchoolIcon />,
    category: '학사/캠퍼스',
    description: '외국인 학생들이 자주 묻는 캠퍼스 라이프 팁',
    details: {
      dining: ['대학 내 학생식당 이용 가능 (₩3,000~₩6,000)', '근처 편의점, 카페 다수'],
      dormitory: ['대부분의 대학교는 유학생을 위한 기숙사 제공', '월 비용: 약 ₩200,000~₩500,000', '신청 시기 주의: 입학 확정 후 바로 신청해야 자리 확보 가능'],
      activities: ['외국인 전용 동아리 존재', '한국인 친구 사귀기 좋은 기회'],
      facilities: ['캠퍼스 전역 무료 Wi-Fi 제공', '도서관, 헬스장, 스터디룸 무료 또는 저렴한 이용 가능']
    }
  },
  {
    id: 'korean-language-support',
    title: '🗣️ 외국인을 위한 한국어 강의 & 학사 병행 팁',
    icon: <SchoolIcon />,
    category: '학사/캠퍼스',
    description: '한국어가 부족한 유학생을 위한 지원 시스템',
    details: {
      preparatory_course: ['한국 대학 부설 어학당에서 6개월~1년 수강', 'TOPIK 3~4급 이상 취득 후 학사 진학 가능'],
      language_options: ['일부 대학(연세대, POSTECH 등)은 영어 전용 강의 제공', '인문/사회계열은 한국어 강의가 더 많음 → 한국어 능력 필수'],
      tips: ['한국어 어플 (e.g. Papago, Naver Dictionary) 적극 활용', '유학생 도우미 제도 활용 (튜터링 제공)']
    }
  },
  {
    id: 'academic-support',
    title: '🏫 한국 대학의 학업 지원 서비스 안내',
    icon: <SchoolIcon />,
    category: '학업지원/시설',
    description: '외국인 유학생을 위한 다양한 학업 지원 제도',
    details: {
      tutoring: ['교내 전공 튜터링: 한국 학생이 외국인 학생에게 과제, 시험 준비 등을 도와주는 프로그램', '대부분 무료 제공, 학기 초 신청 필수'],
      language_support: ['한국어 튜터링, 회화 수업, 언어교화 프로그램 운영', 'TOPIK 대비반 운영 (일부 학교 무료)'],
      counseling: ['정기적인 학업 상담 가능', '교수님과의 미팅 통해 전공 이해도 상승 + 진로 조언 가능'],
      learning_center: ['에세이 작성법, 프레젠테이션 기법, 논문 작성법 등 워크숍 진행']
    }
  },
  {
    id: 'library-guide',
    title: '📖 외국인 유학생을 위한 도서관 이용 가이드',
    icon: <SchoolIcon />,
    category: '학업지원/시설',
    description: '유학생에게 최고의 공부 공간인 도서관 활용법',
    details: {
      operating_hours: ['일반적으로 09:00~22:00, 시험 기간엔 24시간 운영 가능', '자동 출입 시스템: 학생증 필요'],
      services: ['개별 열람실, 그룹 스터디룸', '프린터/복사기 사용 가능 (소액 결제)', '전공별 자료, 전자책, 논문 데이터베이스 제공'],
      digital_resources: ['교내 와이파이 또는 학교 VPN 접속 후 이용', 'RISS, DBpia, KISS 등 한국 논문 검색 사이트 사용 가능'],
      tips: ['조용히 해야 하므로 음성 통화, 음식 반입은 금지', '시험기간에는 좌석 부족하니 미리 예약']
    }
  },
  {
    id: 'it-facilities',
    title: '🖥️ IT & 학습 시설 총정리',
    icon: <BusinessIcon />,
    category: '학업지원/시설',
    description: '한국 대학의 우수한 디지털 학습 환경',
    details: {
      computer_lab: ['교내 대부분의 건물에 컴퓨터실 완비', '무료 이용, 출력 기능 포함', 'MS Office, 통계 프로그램(R, SPSS) 설치되어 있음'],
      e_learning: ['대부분의 대학은 자체 온라인 학습 플랫폼(LMS) 운영', '과제 제출, 출석 확인, 강의 다시 보기 가능', '예시: 블랙보드, 이클래스, 아이캠퍼스 등'],
      printing: ['도서관, 학생회관, 공용 공간에 프린터 배치', '교내 카드 또는 학생증으로 결제 가능'],
      tech_support: ['교내 IT 서비스 센터에서 Wi-Fi 문제, 계정 오류, 장비 문제 해결']
    }
  },
  {
    id: 'student-visa',
    title: '🛂 한국 유학 비자(D-2) 신청 가이드',
    icon: <BusinessIcon />,
    category: '행정/비자/서류',
    description: '한국에서 정규 대학 과정 이수를 위한 D-2 비자',
    details: {
      procedures: ['입학 허가서 수령 (대학교로부터)', '비자 신청서 작성', '관할 한국 대사관/영사관에 접수'],
      required_docs: ['입학허가서', '표준입학허가서 (Standard Admission Letter)', '최종학력 졸업증명서 및 성적증명서 (공증 번역본)', '재정증명서 (예치금 10,000 USD 이상 권장)', '여권 원본 + 사본', '여권용 사진 1매'],
      notes: ['일부 국가는 건강검진서 필요', '발급 소요: 약 2~4주', '학기 시작 2~3달 전 신청 권장']
    }
  },
  {
    id: 'alien-registration',
    title: '📝 외국인 등록증 (ARC) 발급 안내',
    icon: <BusinessIcon />,
    category: '행정/비자/서류',
    description: '입국 후 90일 이내 필수 절차',
    details: {
      application_place: ['출입국·외국인청 또는 온라인 신청 (HiKorea)'],
      required_docs: ['여권', '비자 (D-2 등)', '입학허가서 또는 재학증명서', '주민등록사진 (3.5 x 4.5cm)', '수수료: 약 ₩30,000'],
      processing_time: ['보통 3~4주 소요', '외국인등록증 발급 전에는 출국 자제'],
      tips: ['학교에서 단체 신청을 도와주는 경우도 있음 (신입생 오리엔테이션 참고)']
    }
  },
  {
    id: 'academic-documents',
    title: '📁 학업 중 필요한 행정 서류 총정리',
    icon: <BusinessIcon />,
    category: '행정/비자/서류',
    description: '유학생활 중 자주 필요한 서류와 발급 방법',
    details: {
      common_docs: {
        '재학증명서': '비자 연장, 외국인등록 - 학교 행정실 / 포털',
        '성적증명서': '편입, 장학금 신청 - 학교 포털 / 방문 신청',
        '출입국사실증명서': '통장 개설, 각종 행정 업무 - 주민센터 or 정부24',
        '주소지 변경 신고': '외국인 등록 정보 변경 - 출입국청 / 정부24',
        '비자 연장 신청서': '장기 체류 연장 - HiKorea 웹사이트'
      },
      online_tips: ['대부분의 학교는 포털사이트에서 PDF 형식 서류 발급 가능', '정부24, 민원24 통해 공공기관 서류도 신청 가능 (공동인증서 필요)']
    }
  },
  {
    id: 'dormitory-guide',
    title: '🏢 한국 대학 기숙사 완벽 가이드',
    icon: <HotelIcon />,
    category: '기숙사/주거',
    description: '처음 한국에 오는 유학생에게 가장 안전하고 편리한 선택',
    details: {
      features: ['2인실 또는 3인실 위주 / 일부 학교는 1인실 제공', '기본 제공: 침대, 책상, 옷장, 에어컨, 와이파이', '공용 시설: 세탁실, 샤워실, 식당, 편의점 등'],
      cost: ['월 ₩200,000 ~ ₩500,000 수준 (학교 및 방 종류에 따라 다름)', '보증금 없음, 관리비 포함'],
      application: ['입학 확정 후 국제처 홈페이지 또는 포털을 통해 온라인 신청', '조기 마감 주의! → 신청 시기 확인 필수'],
      living_tips: ['남녀 분리형이 대부분', '외부 음식 제한, 출입 시간 제한이 있는 학교도 있음', '공용공간 예절 중요 (청결 유지, 소음 주의)']
    }
  },
  {
    id: 'housing-options',
    title: '🏠 유학생을 위한 외부 거주 형태 비교',
    icon: <HomeIcon />,
    category: '기숙사/주거',
    description: '예산과 라이프스타일에 따른 다양한 거주 옵션',
    details: {
      housing_types: {
        '원룸': '독립된 공간 (화장실/주방 포함) - ₩500,000~₩800,000 - 프라이버시 확보 vs 보증금 높음',
        '고시원': '좁은 개인 방 + 공용 공간 - ₩300,000~₩500,000 - 저렴함, 계약 간단 vs 좁고 방음 취약',
        '하숙/홈스테이': '집주인과 거주 + 식사 제공 - ₩400,000~₩600,000 - 문화 교류 가능 vs 자유도 낮음',
        '쉐어하우스': '여러 명과 공동 생활 - ₩400,000~₩600,000 - 친구 사귀기 쉬움 vs 갈등 발생 가능'
      },
      precautions: ['보증금(보통 ₩5,000,000 이상) 요구 가능 → 계약서 꼭 확인!', '한국어 계약서가 대부분 → 통역 도움 필요', '공과금 별도인지 확인']
    }
  },
  {
    id: 'housing-contract',
    title: '🧾 유학생을 위한 집 계약 & 행정 절차 안내',
    icon: <BusinessIcon />,
    category: '기숙사/주거',
    description: '외부 거주 시 정식 계약 및 주소 등록의 중요성',
    details: {
      contract_checklist: ['계약서 유무 (전입신고용 필요)', '보증금 및 월세 조건', '퇴실 시 환급 조건', '관리비 포함 여부'],
      address_registration: ['계약 후 2주 이내, 가까운 주민센터에서 전입신고', '외국인등록증 주소 변경과도 연결됨'],
      safety_tips: ['부동산 중개소 이용 권장 (불법 중개 피해 예방)', '계약서 사본은 꼭 보관', '계약 전에 집 상태(곰팡이, 누수 등) 확인']
    }
  }
];

// 목적별 콘텐츠 매핑
const CONTENT_BY_PURPOSE: Record<UserPurpose, any[]> = {
  travel: TRAVEL_CONTENT,
  work: WORK_CONTENT,
  residence: RESIDENCE_CONTENT,
  study: STUDY_CONTENT,
};

// 동적 공 타입
interface FloatingBall {
  id: string;
  purpose: UserPurpose;
  title: string;
  description: string;
  icon: React.ReactElement;
  category: string;
  position: { x: number; y: number };
  velocity: { x: number; y: number };
  size: number;
  zIndex: number;
  data: any;
}

// 목적 매핑 함수 (KakaoMapWidget에서 가져옴)
const mapVisitPurposeToUserPurpose = (visitPurpose?: string): UserPurpose => {
  if (!visitPurpose) return 'travel';
  
  const purposeMap: Record<string, UserPurpose> = {
    'Travel': 'travel',
    'Study': 'study', 
    'Work': 'work',
    'Living': 'residence',
    'travel': 'travel',
    'study': 'study',
    'work': 'work',
    'living': 'residence',
    'residence': 'residence',
    'job': 'work'
  };

  return purposeMap[visitPurpose] || 'travel';
};

// 랜덤 위치 생성
const generateRandomPosition = (containerWidth: number, containerHeight: number, itemSize: number) => {
  const margin = itemSize / 2 + 20;
  return {
    x: Math.random() * (containerWidth - margin * 2) + margin,
    y: Math.random() * (containerHeight - margin * 2) + margin,
  };
};

// 랜덤 속도 생성
const generateRandomVelocity = () => ({
  x: (Math.random() - 0.5) * 2, // -1 ~ 1
  y: (Math.random() - 0.5) * 2,
});

const FloatingPurposeBalls: React.FC = () => {
  const { profile, fetchProfile } = useMypageStore();
  const [userPurpose, setUserPurpose] = useState<UserPurpose>('travel');
  const [selectedBall, setSelectedBall] = useState<FloatingBall | null>(null);
  const [modalOpen, setModalOpen] = useState(false);
  const [balls, setBalls] = useState<FloatingBall[]>([]);
  const [containerDimensions, setContainerDimensions] = useState({ width: 0, height: 0 });
  const animationRef = useRef<number>();
  const [isAnimating, setIsAnimating] = useState(true);

  // 마이페이지에서 사용자 목적 가져오기
  useEffect(() => {
    if (profile?.role) {
      const mappedPurpose = mapVisitPurposeToUserPurpose(profile.role);
      setUserPurpose(mappedPurpose);
      console.log('사용자 목적 설정:', profile.role, '->', mappedPurpose);
    }
  }, [profile?.role]);

  // 프로필이 없으면 가져오기
  useEffect(() => {
    if (!profile) {
      fetchProfile();
    }
  }, [profile, fetchProfile]);

  // 화면 크기 측정
  const updateContainerDimensions = useCallback(() => {
    setContainerDimensions({ 
      width: window.innerWidth, 
      height: window.innerHeight 
    });
  }, []);

  // 공들 초기화 (랜덤으로 3개 선택)
  const initializeBalls = useCallback(() => {
    const contentArray = CONTENT_BY_PURPOSE[userPurpose] || TRAVEL_CONTENT;
    
    // 랜덤으로 3개 선택
    const shuffled = [...contentArray].sort(() => 0.5 - Math.random());
    const selectedContent = shuffled.slice(0, 3);
    
    const newBalls: FloatingBall[] = selectedContent.map((content, index) => ({
      id: content.id,
      purpose: userPurpose,
      title: content.title,
      description: content.description,
      icon: content.icon,
      category: content.category,
      position: generateRandomPosition(containerDimensions.width, containerDimensions.height, 60 + index * 10),
      velocity: generateRandomVelocity(),
      size: 60 + index * 10, // 크기 다양화
      zIndex: Math.floor(Math.random() * 100),
      data: content.details
    }));
    
    setBalls(newBalls);
  }, [userPurpose, containerDimensions]);

  // 애니메이션 업데이트
  const updateAnimation = useCallback(() => {
    if (!isAnimating) return;

    setBalls(prevBalls => 
      prevBalls.map(ball => {
        let newPosition = {
          x: ball.position.x + ball.velocity.x,
          y: ball.position.y + ball.velocity.y,
        };
        let newVelocity = { ...ball.velocity };

        // 경계 충돌 검사 및 반사
        const margin = ball.size / 2;
        if (newPosition.x <= margin || newPosition.x >= containerDimensions.width - margin) {
          newVelocity.x = -newVelocity.x;
          newPosition.x = Math.max(margin, Math.min(containerDimensions.width - margin, newPosition.x));
        }
        if (newPosition.y <= margin || newPosition.y >= containerDimensions.height - margin) {
          newVelocity.y = -newVelocity.y;
          newPosition.y = Math.max(margin, Math.min(containerDimensions.height - margin, newPosition.y));
        }

        return {
          ...ball,
          position: newPosition,
          velocity: newVelocity,
        };
      })
    );

    animationRef.current = requestAnimationFrame(updateAnimation);
  }, [isAnimating, containerDimensions]);

  // 공 클릭 핸들러 (펑 터지는 효과)
  const handleBallClick = useCallback((ball: FloatingBall) => {
    setSelectedBall(ball);
    setModalOpen(true);
    setIsAnimating(false); // 애니메이션 일시 정지
    
    // 클릭 효과: 일시적으로 크기 확대
    setBalls(prevBalls => 
      prevBalls.map(prevBall => 
        prevBall.id === ball.id 
          ? { ...prevBall, size: prevBall.size * 1.5 }
          : prevBall
      )
    );
    
    // 0.3초 후 원래 크기로 복원
    setTimeout(() => {
      setBalls(prevBalls => 
        prevBalls.map(prevBall => 
          prevBall.id === ball.id 
            ? { ...prevBall, size: prevBall.size / 1.5 }
            : prevBall
        )
      );
    }, 300);
  }, []);

  // 모달 닫기
  const handleCloseModal = useCallback(() => {
    setModalOpen(false);
    setSelectedBall(null);
    setTimeout(() => setIsAnimating(true), 300); // 애니메이션 재시작
  }, []);

  // 리사이즈 핸들러
  useEffect(() => {
    const handleResize = () => updateContainerDimensions();
    window.addEventListener('resize', handleResize);
    updateContainerDimensions();
    return () => window.removeEventListener('resize', handleResize);
  }, [updateContainerDimensions]);

  // 공들 초기화
  useEffect(() => {
    if (containerDimensions.width > 0 && containerDimensions.height > 0) {
      initializeBalls();
    }
  }, [initializeBalls]);

  // 애니메이션 시작
  useEffect(() => {
    if (isAnimating && balls.length > 0) {
      animationRef.current = requestAnimationFrame(updateAnimation);
    }
    return () => {
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
      }
    };
  }, [updateAnimation, isAnimating, balls.length]);

  return (
    <>
      {/* 플로팅 공들 컨테이너 */}
      <Box
        sx={{
          position: 'fixed',
          top: 0,
          left: 0,
          width: '100vw',
          height: '100vh',
          pointerEvents: 'none', // 다른 요소와의 상호작용 방해하지 않음
          zIndex: 50, // 위젯들보다 낮은 z-index
          overflow: 'hidden',
        }}
      >
        {balls.map((ball) => (
          <Box
            key={ball.id}
            onClick={() => handleBallClick(ball)}
            sx={{ 
              position: 'absolute',
              left: ball.position.x - ball.size / 2,
              top: ball.position.y - ball.size / 2,
              width: ball.size,
              height: ball.size,
              borderRadius: '50%',
              background: PURPOSE_INFO[ball.purpose].gradient,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              cursor: 'pointer',
              transition: 'transform 0.3s ease, box-shadow 0.3s ease',
              boxShadow: '0 4px 20px rgba(0,0,0,0.3)',
              zIndex: ball.zIndex,
              pointerEvents: 'auto', // 클릭 가능하게 함
              '&:hover': {
                transform: 'scale(1.2)',
                boxShadow: '0 8px 30px rgba(0,0,0,0.4)',
                zIndex: 1000,
              },
              '&:active': {
                transform: 'scale(1.5)',
                transition: 'transform 0.1s ease',
              },
            }}
          >
            <Box sx={{ color: 'white', fontSize: ball.size * 0.3 }}>
              {ball.icon}
            </Box>
          </Box>
        ))}
      </Box>

      {/* 정보 상세 모달 */}
      <Modal
        open={modalOpen}
        onClose={handleCloseModal}
        closeAfterTransition
        BackdropComponent={Backdrop}
        BackdropProps={{
          timeout: 500,
          sx: { backdropFilter: 'blur(4px)' }
        }}
      >
        <Fade in={modalOpen}>
          <Box sx={{
            position: 'absolute',
            top: '50%',
            left: '50%',
            transform: 'translate(-50%, -50%)',
            width: { xs: '95%', sm: '90%', md: 600 },
            maxHeight: '80vh',
            bgcolor: 'background.paper',
            boxShadow: '0 20px 60px rgba(0,0,0,0.15)',
            borderRadius: 3,
            overflow: 'hidden',
          }}>
            {selectedBall && (
              <Box>
                {/* 헤더 */}
                <Box sx={{ 
                  background: PURPOSE_INFO[selectedBall.purpose].gradient,
                  color: 'white',
                  p: 3,
                  position: 'relative'
                }}>
                  <IconButton 
                    onClick={handleCloseModal} 
                    size="small"
                    sx={{ 
                      position: 'absolute',
                      top: 16,
                      right: 16,
                      color: 'white',
                      bgcolor: 'rgba(255,255,255,0.1)',
                      '&:hover': { bgcolor: 'rgba(255,255,255,0.2)' }
                    }}
                  >
                    <CloseIcon />
                  </IconButton>
                  
                  <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                    <Avatar sx={{ bgcolor: 'rgba(255,255,255,0.2)', color: 'white', mr: 2, width: 48, height: 48 }}>
                      {selectedBall.icon}
                    </Avatar>
                    <Box>
                      <Typography variant="h6" fontWeight={600}>
                        {selectedBall.title}
                      </Typography>
                      <Typography variant="body2" sx={{ opacity: 0.9 }}>
                        {selectedBall.description}
                      </Typography>
                    </Box>
                  </Box>
                  <Chip 
                    label={selectedBall.category}
                    size="small"
                    sx={{ bgcolor: 'rgba(255,255,255,0.2)', color: 'white' }}
                  />
                </Box>

                {/* 콘텐츠 */}
                <Box sx={{ p: 3, maxHeight: 'calc(80vh - 200px)', overflowY: 'auto' }}>
                  {selectedBall.data && (
                    <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                      {/* 동적 콘텐츠 렌더링 */}
                      {Object.entries(selectedBall.data).map(([key, value]) => {
                        if (!value) return null;

                        // 배열 형태의 데이터 처리
                        if (Array.isArray(value)) {
                          return (
                            <Card key={key} sx={{ p: 2, bgcolor: 'action.hover' }}>
                              <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                                <InfoIcon sx={{ mr: 1, color: 'primary.main' }} />
                                <Typography variant="subtitle2" fontWeight={600}>
                                  {key === 'basic_structure' ? '기본 구성' :
                                   key === 'writing_tips' ? '작성 팁' :
                                   key === 'reference_sites' ? '참고 사이트' :
                                   key === 'interview_types' ? '면접 유형' :
                                   key === 'common_questions' ? '자주 나오는 질문' :
                                   key === 'foreigner_specific' ? '외국인 대상 질문' :
                                   key === 'tips' ? '꿀팁' :
                                   key === 'conversion_tips' ? '비자 전환 팁' :
                                   key === 'basic_rights' ? '기본 권리' :
                                   key === 'common_problems' ? '자주 발생하는 문제' :
                                   key === 'help_contacts' ? '도움 연락처' :
                                   key === 'required_items' ? '필수 계약 항목' :
                                   key === 'precautions' ? '주의사항' :
                                   key === 'references' ? '참고자료' :
                                   key === 'preparation' ? '준비물' :
                                   key === 'methods' ? '네트워킹 방법' :
                                   key === 'networking_tips' ? '네트워킹 팁' :
                                   key === 'requirements' ? '필요 조건' :
                                   key === 'working_hours' ? '근무 시간' :
                                   key === 'allowed_jobs' ? '허용 업종' :
                                   key === 'prohibited' ? '금지 업종' :
                                   key === 'warnings' ? '주의사항' :
                                   key === 'protection' ? '권리 보호' :
                                   key === 'checklist' ? '체크리스트' :
                                   key === 'main_procedures' ? '주요 절차' :
                                   key === 'university_examples' ? '대학 예시' :
                                   key === 'dining' ? '식사' :
                                   key === 'dormitory' ? '기숙사' :
                                   key === 'activities' ? '동아리 활동' :
                                   key === 'facilities' ? '시설' :
                                   key === 'preparatory_course' ? '예비 과정' :
                                   key === 'language_options' ? '강의 언어' :
                                   key === 'tutoring' ? '튜터링 프로그램' :
                                   key === 'language_support' ? '한국어 지원' :
                                   key === 'counseling' ? '상담' :
                                   key === 'learning_center' ? '학습센터' :
                                   key === 'operating_hours' ? '운영시간' :
                                   key === 'services' ? '제공 서비스' :
                                   key === 'digital_resources' ? '전자자료' :
                                   key === 'computer_lab' ? '컴퓨터실' :
                                   key === 'e_learning' ? '이러닝' :
                                   key === 'printing' ? '출력/복사' :
                                   key === 'tech_support' ? '기술 지원' :
                                   key === 'procedures' ? '절차' :
                                   key === 'required_docs' ? '필요 서류' :
                                   key === 'notes' ? '유의사항' :
                                   key === 'application_place' ? '신청 장소' :
                                   key === 'processing_time' ? '처리 기간' :
                                   key === 'online_tips' ? '온라인 발급 팁' :
                                   key === 'features' ? '주요 특징' :
                                   key === 'cost' ? '비용' :
                                   key === 'application' ? '신청 방법' :
                                   key === 'living_tips' ? '생활 팁' :
                                   key === 'address_registration' ? '전입신고' :
                                   key === 'safety_tips' ? '안전 팁' :
                                   key === 'contract_checklist' ? '계약 체크리스트' :
                                   key === 'specialties' ? '추천 먹거리' :
                                   key}
                                </Typography>
                              </Box>
                              {value.map((item: string, index: number) => (
                                <Typography key={index} variant="body2" sx={{ mb: 0.5 }}>
                                  • {item}
                                </Typography>
                              ))}
                            </Card>
                          );
                        }

                        // 객체 형태의 데이터 처리
                        if (typeof value === 'object' && value !== null) {
                          return (
                            <Card key={key} sx={{ p: 2, bgcolor: 'action.hover' }}>
                              <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                                <InfoIcon sx={{ mr: 1, color: 'primary.main' }} />
                                <Typography variant="subtitle2" fontWeight={600}>
                                  {key === 'four_sections' ? '자소서 4문항' :
                                   key === 'visa_types' ? '비자 종류' :
                                   key === 'major_events' ? '주요 박람회' :
                                   key === 'platforms' ? '구직 플랫폼' :
                                   key === 'common_docs' ? '자주 사용하는 서류' :
                                   key === 'housing_types' ? '거주 형태' :
                                   key === 'areas' ? '지역별 정보' :
                                   key === 'districts' ? '지역별 특징' :
                                   key === 'other_cities' ? '다른 도시' :
                                   key === 'restaurants' ? '추천 식당' :
                                   key === 'foods' ? '음식 정보' :
                                   key === 'locations' ? '장소' :
                                   key === 'options' ? '옵션' :
                                   key === 'apps' ? '앱' :
                                   key === 'types' ? '유형' :
                                   key === 'includes' ? '포함 사항' :
                                   key === 'common_problems' ? '자주 발생하는 문제' :
                                   key === 'contacts' ? '연락처' :
                                   key === 'payment' ? '결제 방법' :
                                   key === 'payment_methods' ? '결제 수단' :
                                   key === 'saving_tips' ? '절약 팁' :
                                   key === 'greetings' ? '인사 예절' :
                                   key === 'indoor' ? '실내 예절' :
                                   key === 'dining' ? '식사 예절' :
                                   key === 'traditional' ? '전통 활동' :
                                   key === 'modern' ? '현대 활동' :
                                   key === 'holidays' ? '공휴일' :
                                   key === 'seasons' ? '계절별 팁' :
                                   key === 'offline' ? '오프라인 쇼핑' :
                                   key === 'online' ? '온라인 쇼핑' :
                                   key === 'laundry' ? '세탁' :
                                   key === 'delivery' ? '택배' :
                                   key === 'garbage' ? '쓰레기' :
                                   key === 'seoul' ? '서울' :
                                   key === 'embassies' ? '주요 대사관' :
                                   key === 'hospitals' ? '병원' :
                                   key === 'pharmacy' ? '약국' :
                                   key}
                                </Typography>
                              </Box>
                              {Object.entries(value as Record<string, any>).map(([subKey, subValue]) => (
                                <Box key={subKey} sx={{ mb: 1 }}>
                                  <Typography variant="body2" fontWeight={500} sx={{ mb: 0.5 }}>
                                    📌 {subKey}
                                  </Typography>
                                  <Typography variant="body2" sx={{ ml: 2, mb: 0.5 }}>
                                    {typeof subValue === 'string' ? subValue : 
                                     Array.isArray(subValue) ? subValue.join(', ') : 
                                     JSON.stringify(subValue)}
                                  </Typography>
                                </Box>
                              ))}
                            </Card>
                          );
                        }

                        // 문자열 형태의 데이터 처리 
                        if (typeof value === 'string') {
                          return (
                            <Card key={key} sx={{ p: 2, bgcolor: 'action.hover' }}>
                              <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                                {key === 'location' ? <LocationOnIcon sx={{ mr: 1, color: 'primary.main' }} /> :
                                 key === 'transport' ? <DirectionsTransitIcon sx={{ mr: 1, color: 'primary.main' }} /> :
                                 key === 'hours' ? <AccessTimeIcon sx={{ mr: 1, color: 'primary.main' }} /> :
                                 key === 'price' ? <InfoIcon sx={{ mr: 1, color: 'primary.main' }} /> :
                                 key === 'program' ? <SchoolIcon sx={{ mr: 1, color: 'primary.main' }} /> :
                                 key === 'website' ? <InfoIcon sx={{ mr: 1, color: 'primary.main' }} /> :
                                 key === 'basic' ? <InfoIcon sx={{ mr: 1, color: 'primary.main' }} /> :
                                 <InfoIcon sx={{ mr: 1, color: 'primary.main' }} />}
                                <Typography variant="subtitle2" fontWeight={600}>
                                  {key === 'location' ? '위치' :
                                   key === 'transport' ? '교통편' :
                                   key === 'hours' ? '운영시간' :
                                   key === 'price' ? '요금' :
                                   key === 'program' ? '프로그램' :
                                   key === 'website' ? '웹사이트' :
                                   key === 'basic' ? '기본 정보' :
                                   key}
                                </Typography>
                              </Box>
                              <Typography variant="body2">{value}</Typography>
                            </Card>
                          );
                        }

                        return null;
                      })}
                    </Box>
                  )}
                </Box>
              </Box>
            )}
          </Box>
        </Fade>
      </Modal>
    </>
  );
};

export default FloatingPurposeBalls; 