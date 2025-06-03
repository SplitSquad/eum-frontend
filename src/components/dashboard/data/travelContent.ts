import { FloatingBallContent } from './floatingBallsData';

// 한국어 여행 콘텐츠
export const koreanTravelContent: FloatingBallContent[] = [
  {
    id: 'hanbok-experience',
    title: '🇰🇷 한복 입고 경복궁 체험하기',
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
    category: '숙소/지역정보',
    description: '예산과 여행 스타일에 맞는 숙소 선택 가이드',
    details: {
      checklist: ['위치: 지하철역과 얼마나 가까운가?', '언어지원: 영어 가능한 스태프 or 안내 시스템?', '시설: 와이파이, 세탁기, 조식 제공 여부', '리뷰: Google, Booking.com, Agoda에서 확인'],
      types: {
        '비즈니스 호텔': '도심, 깔끔함',
        '게스트하우스': '저렴, 교류 가능',
        '한옥스테이': '전통문화 체험 가능'
      },
      platforms: {
        '예약 사이트': 'Airbnb, Booking.com, Agoda',
        '한옥 체험': '한옥 체험은 koreanstay.kr도 추천!'
      }
    }
  },
  {
    id: 'seoul-districts',
    title: '🗺️ 서울 지역별 숙소 선택 가이드',
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
    category: '대사관/응급',
    description: '한국의 의료 시스템과 외국인 진료 가능한 병원',
    details: {
      hospitals: ['서울의료원 국제진료센터: 02-2276-7000', '세브란스병원 국제진료센터: 1599-1004', '삼성서울병원 International Clinic: 02-3410-0200'],
      pharmacy: ['약국은 보통 "약(藥)" 표시 간판이 있어요', '일반 감기약, 소화제는 처방 없이 구매 가능', '의사 처방전이 필요한 약도 많으니, 병원 먼저 방문하는 걸 추천'],
      apps: ['KakaoMap / NAVER Map에서 "약국", "병원" 검색 가능', 'Goodoc: 영어로 병원/약국 리뷰 및 위치 확인 가능']
    }
  }
];

// 영어 여행 콘텐츠
export const englishTravelContent: FloatingBallContent[] = [
  {
    id: 'hanbok-experience',
    title: '🇰🇷 Hanbok Experience at Gyeongbokgung Palace',
    category: 'Cultural Experience',
    description: 'Wear traditional Korean clothing and take amazing photos in an ancient palace',
    details: {
      location: '161 Sejong-ro, Jongno-gu, Seoul',
      transport: 'Subway Line 3, Gyeongbokgung Station Exit 5, 5-minute walk',
      hours: 'Daily 09:00 ~ 18:00 (Closed on Tuesdays)',
      price: 'General admission: Adults 3,000 KRW / Free with Hanbok',
      tips: ['Various Hanbok rental shops near Gyeongbokgung Palace', 'Rental available from 1 hour to full day (from about 15,000 KRW)']
    }
  },
  {
    id: 'gwangjang-market',
    title: '🍲 Traditional Market Food Tour: Gwangjang Market',
    category: 'Food/Restaurants',
    description: 'A famous spot to enjoy traditional Korean food at affordable prices',
    details: {
      location: '88 Changgyeonggung-ro, Jongno-gu, Seoul',
      transport: 'Subway Line 1, Jongno 5-ga Station Exit 8, 2-minute walk',
      specialties: ['Mayak Gimbap (Mini Gimbap)', 'Bindaetteok (Mung Bean Pancake)', 'Tteokbokki (Spicy Rice Cake)', 'Japchae, Yukhoe, etc.'],
      tips: ['Cash payment is convenient! (Many places accept cards too)', 'Visit earlier than lunch hours to avoid crowds']
    }
  },
  {
    id: 'temple-stay',
    title: '🧘‍♀️ Temple Stay: Spend a Night at a Buddhist Temple',
    category: 'Cultural Experience',
    description: 'A special program to experience traditional Korean Buddhist culture',
    details: {
      locations: ['Jogyesa Temple in Seoul', 'Bongseunsa Temple in Yangpyeong', 'Golgulsa Temple in Gyeongju (Sunmudo martial arts available)'],
      program: '1 night 2 days or day trip - Meditation, temple food experience, conversation with monks, etc.',
      price: 'About 50,000 ~ 100,000 KRW (varies by temple)',
      website: 'https://www.templestay.com'
    }
  },
  {
    id: 'korean-bbq',
    title: '🍖 Korean BBQ: The Joy of Grilling Your Own Meat!',
    category: 'Food/Restaurants',
    description: 'The unique culture of grilling and eating your own meat',
    details: {
      areas: {
        'Hongdae': 'Young atmosphere, many places with English menus',
        'Gangnam': 'Many premium BBQ restaurants',
        'Itaewon': 'Foreigner-friendly, various meat options available'
      },
      tips: ['Staff sometimes grill the meat for you!', 'Recommend ssamjang + garlic + vegetables combo!', 'Most orders are per portion (150g) - recommended for 2+ people']
    }
  },
  {
    id: 'bibimbap',
    title: '🍲 Jeonju Bibimbap: Healthy and Colorful Korean Meal',
    category: 'Food/Restaurants',
    description: 'Healthy and colorful traditional Korean food',
    details: {
      restaurants: {
        'Jeonju Hanok Village': 'The holy land of traditional bibimbap',
        'Gogung Myeongdong': 'Authentic bibimbap in central Seoul',
        'Insadong Korean restaurants': 'Bibimbap with traditional side dishes'
      },
      tips: ['Gochujang can be spicy, you can adjust the amount', 'Vegetarian bibimbap is often available on menus']
    }
  },
  {
    id: 'street-food',
    title: '🧁 Korean Street Food BEST 3',
    category: 'Food/Restaurants',
    description: 'Affordable and delicious street snacks',
    details: {
      foods: [
        'Hotteok: Sweet cinnamon nut-filled winter snack',
        'Fried food + Tteokbokki set: Perfect combination with spicy sauce',
        'Bungeoppang: Fish-shaped pastry filled with red beans or cream'
      ],
      locations: ['Myeongdong Street: Various street food stalls', 'Gwangjang Market: Affordable and traditional atmosphere', 'Hongdae Walking Street: Trendy snacks with youthful vibes'],
      price: 'Most items between 1,000-3,000 KRW'
    }
  },
  {
    id: 'subway-guide',
    title: '🚇 Complete Korean Subway Guide',
    category: 'Transportation',
    description: 'How to use the fast, affordable, and foreigner-friendly subway system',
    details: {
      howto: 'Buy T-money card → Charge → Tag and use',
      price: 'Basic fare: About 1,400-1,500 KRW',
      apps: ['Kakao Metro: Route maps and transfer information', 'NAVER Map / Kakao Map: Real-time directions'],
      tips: ['Train doors close automatically, get on quickly!', 'Stay quiet inside trains! Refrain from phone calls as courtesy']
    }
  },
  {
    id: 'airport-transport',
    title: '🚌 Airport to City Center: Airport Limousine or AREX?',
    category: 'Transportation',
    description: 'How to get from Incheon International Airport to Seoul city center',
    details: {
      options: [
        'Airport Limousine Bus: 16,000+ KRW, 60-80 minutes, stops in front of hotels',
        'AREX Express: 9,500 KRW, 43 minutes, non-stop to Seoul Station',
        'Regular AREX: 4,750 KRW, 60 minutes, budget option'
      ],
      tips: ['Buy tickets at airport ticket counters or vending machines', 'Card payment available / Space for luggage']
    }
  },
  {
    id: 'taxi-guide',
    title: '🚕 Taxi Usage and Precautions',
    category: 'Transportation',
    description: 'How to use taxis safely and conveniently in Korea',
    details: {
      basic: 'Base fare: About 4,800 KRW (Seoul standard, 2km)',
      apps: ['Kakao T - English available, card payment option', 'UT - Foreigner-friendly interface'],
      warnings: ['Avoid unofficial taxis (white private vehicles)!', 'Always check that the meter is running inside the taxi']
    }
  },
  {
    id: 'accommodation-tips',
    title: '🏨 5 Things to Consider When Choosing Accommodation in Korea',
    category: 'Accommodation/Regional Info',
    description: 'Guide to choosing accommodation that fits your budget and travel style',
    details: {
      checklist: ['Location: How close to subway stations?', 'Language support: English-speaking staff or guidance system?', 'Facilities: WiFi, washing machine, breakfast availability', 'Reviews: Check on Google, Booking.com, Agoda'],
      types: {
        'Business hotels': 'Downtown, clean',
        'Guesthouses': 'Affordable, social interaction possible',
        'Hanok stays': 'Traditional culture experience possible'
      },
      platforms: {
        'Booking sites': 'Airbnb, Booking.com, Agoda',
        'Hanok experiences': 'For Hanok experiences, koreanstay.kr is also recommended!'
      }
    }
  },
  {
    id: 'seoul-districts',
    title: '🗺️ Seoul District-wise Accommodation Selection Guide',
    category: 'Accommodation/Regional Info',
    description: 'Characteristics of Seoul districts and recommended targets',
    details: {
      districts: {
        'Myeongdong': 'Shopping, currency exchange, tourist attractions, English-friendly - First-time Seoul visitors',
        'Hongdae': 'Young atmosphere, nightlife, cafe streets - Independent travelers',
        'Gangnam': 'Sophisticated urban atmosphere, luxury accommodation, transportation hub - Business trips, medium to long-term stays',
        'Itaewon': 'Diverse international travelers, many foreign restaurants - Foreign community preference',
        'Jongno/Insadong': 'Traditional culture, near palaces, quiet and artistic atmosphere - Cultural experience purposes'
      },
      tips: ['Accommodations near subway lines 2 or 4 are very convenient for transportation!']
    }
  },
  {
    id: 'hanok-stay',
    title: '🏠 A Night in Hanok: Accommodation Experience with Tradition',
    category: 'Accommodation/Regional Info',
    description: 'Experience Korean culture directly in traditional Hanok buildings',
    details: {
      locations: ['Seoul Bukchon Hanok Village: Hanok experience in the city center', 'Jeonju Hanok Village: The home of Hanok experiences', 'Gyeongju/Andong: Areas where traditional culture and Hanok are well preserved'],
      experience: 'Ondol rooms (floor heating), tea ceremony experience, Hanbok experience, traditional breakfast provided',
      price: '50,000 ~ 150,000 KRW per night (varies by facilities and location)',
      booking: 'Search for "Hanok" on KoreaStay, Airbnb, Agoda, etc.'
    }
  },
  {
    id: 'emergency-contacts',
    title: '🏥 Essential Korean Contact Numbers for Emergencies',
    category: 'Embassy/Emergency',
    description: 'How to respond when sudden accidents or illness occurs',
    details: {
      emergency: ['Emergency medical/fire: 119 (English available)', 'Police report: 112', 'Foreigner civil complaints: 1345 (multilingual support)', 'Travel helpline: 1330 (24 hours, KakaoTalk chat consultation also available)'],
      tips: ['Most Korean emergency call centers support multiple languages including English', '1330 also provides KakaoTalk chat consultation (useful for tourism-related inquiries)']
    }
  },
  {
    id: 'embassies',
    title: '🏛️ Major Embassy Locations and Contact Numbers in Korea',
    category: 'Embassy/Emergency',
    description: 'Contact information for emergency situations like passport loss, arrest, accidents',
    details: {
      embassies: {
        'USA': 'Jongno-gu Sejong-daero 188, 02-397-4114',
        'Canada': 'Jung-gu Jeongdong-gil 21, 02-3783-6000',
        'UK': 'Jongno-gu Sejong-daero 19, 02-3210-5500',
        'France': 'Seocho-gu Hyoryeong-ro 396, 02-3149-4300',
        'Japan': 'Jongno-gu Yulgok-ro 6, 02-765-3011'
      },
      tips: ['Search for "[country] embassy Seoul" on Google Maps for quick access', 'Take a copy of your passport with you']
    }
  },
  {
    id: 'medical-guide',
    title: '💊 Hospital/Pharmacy Usage Guide During Travel',
    category: 'Embassy/Emergency',
    description: 'Korea\'s medical system and hospitals available for foreign patients',
    details: {
      hospitals: ['Seoul Medical Center International Clinic: 02-2276-7000', 'Severance Hospital International Clinic: 1599-1004', 'Samsung Seoul Hospital International Clinic: 02-3410-0200'],
      pharmacy: ['Pharmacies usually have "약(藥)" signs', 'Common cold medicine, digestive medicine can be purchased without prescription', 'Many medicines require doctor\'s prescription, so visiting hospital first is recommended'],
      apps: ['Search for "pharmacy" or "hospital" on KakaoMap / NAVER Map', 'Goodoc: English-friendly hospital/pharmacy reviews and locations']
    }
  }
];

// 일본어 여행 콘텐츠
export const japaneseTravelContent: FloatingBallContent[] = [
  {
    id: 'hanbok-experience',
    title: '🇰🇷 韓服を着て景福宮体験',
    category: '文化体験',
    description: '伝統衣装を着て古宮を歩き、人生最高の写真を撮りましょう',
    details: {
      location: 'ソウル市鍾路区世宗路161',
      transport: '地下鉄3号線景福宮駅5番出口から徒歩5分',
      hours: '毎日09:00～18:00（毎週火曜日休館）',
      price: '一般入場料：大人3,000ウォン／韓服着用時無料',
      tips: ['景福宮近くに様々な韓服レンタル店があります', '1時間～一日中レンタル可能（約15,000ウォンから）']
    }
  },
  {
    id: 'gwangjang-market',
    title: '🍲 伝統市場グルメツアー：広蔵市場',
    category: 'グルメ/レストラン',
    description: '韓国の伝統的な食べ物を安く楽しめる名所',
    details: {
      location: 'ソウル市鍾路区昌慶宮路88',
      transport: '地下鉄1号線鍾路5街駅8番出口から徒歩2分',
      specialties: ['麻薬キンパ（ミニキンパ）', 'ピンデトク（緑豆チヂミ）', 'トッポッキ（辛い餅）', 'チャプチェ、ユッケなど'],
      tips: ['現金決済が便利です！（カード可能な店も多数）', '昼食時間より早い時間に行くと混雑を避けられます']
    }
  },
  {
    id: 'temple-stay',
    title: '🧘‍♀️ テンプルステイ：お寺で一晩過ごす',
    category: '文化体験',
    description: '韓国の伝統仏教文化を体験できる特別なプログラム',
    details: {
      locations: ['ソウル曹渓寺', '楊平伝統寺院奉先寺', '慶州骨窟寺（仙武道体験可能）'],
      program: '1泊2日または日帰り体験 - 瞑想、寺院料理体験、僧侶との対話など',
      price: '約50,000～100,000ウォン（寺院により異なる）',
      website: 'https://www.templestay.com'
    }
  },
  {
    id: 'korean-bbq',
    title: '🍖 韓国式バーベキュー、自分で焼いて食べる楽しさ！',
    category: 'グルメ/レストラン',
    description: '自分で肉を焼いて食べるユニークな文化',
    details: {
      areas: {
        '弘大': '若い雰囲気、英語メニュー可能な店多数',
        '江南': 'プレミアム焼肉店が多い',
        '梨泰院': '外国人に優しい、様々な肉オプション提供'
      },
      tips: ['肉は店員が焼いてくれる場合もあります！', 'サムジャン＋ニンニク＋野菜の組み合わせをおすすめ！', 'ほとんど1人前（150g）基準注文（2人以上の訪問推奨）']
    }
  },
  {
    id: 'bibimbap',
    title: '🍲 全州ビビンバ：健康的で華やかな一食',
    category: 'グルメ/レストラン',
    description: '健康的で華やかな韓国伝統料理',
    details: {
      restaurants: {
        '全州韓屋村': '伝統ビビンバの聖地',
        '明洞古宮': 'ソウル中心で本格的なビビンバ',
        '仁寺洞韓定食店': 'ビビンバと一緒に伝統おかずも提供'
      },
      tips: ['コチュジャンが辛い場合があります、量調節可能', 'ベジタリアンビビンバもメニューにある場合が多いです']
    }
  },
  {
    id: 'street-food',
    title: '🧁 韓国屋台グルメBEST 3',
    category: 'グルメ/レストラン',
    description: '安くて美味しい屋台のおやつ',
    details: {
      foods: [
        'ホットク：甘いシナモンナッツ入りの冬のおやつ',
        '揚げ物＋トッポッキセット：辛いソースとの相性抜群',
        'たい焼き：魚の形の中に小豆やクリームが入ったおやつ'
      ],
      locations: ['明洞通り：様々な種類の屋台', '広蔵市場：安くて伝統的な雰囲気', '弘大歩きたい通り：若い感性のトレンディなおやつ'],
      price: 'ほとんど1,000ウォン～3,000ウォンの間'
    }
  },
  {
    id: 'subway-guide',
    title: '🚇 韓国地下鉄完全攻略ガイド',
    category: '交通/移動',
    description: '速くて安くて外国人に優しい地下鉄利用法',
    details: {
      howto: 'T-money交通カード購入 → チャージ → タッチして利用',
      price: '基本料金：約1,400ウォン～1,500ウォン',
      apps: ['Kakao Metro：路線図と乗換情報', 'NAVER Map / Kakao Map：リアルタイム道案内'],
      tips: ['電車のドアは自動で閉まります、急いで乗ってください！', '電車内では静かに！電話は控えるのがマナーです']
    }
  },
  {
    id: 'airport-transport',
    title: '🚌 空港から都心まで：空港リムジンorAREX？',
    category: '交通/移動',
    description: '仁川国際空港からソウル市内への移動方法',
    details: {
      options: [
        '空港リムジンバス：16,000ウォン～、60～80分、ホテル前停車',
        'AREX Express：9,500ウォン、43分、ソウル駅までノンストップ',
        '一般AREX：4,750ウォン、60分、安いオプション'
      ],
      tips: ['チケットは空港内の窓口または自動販売機で購入', 'カード決済可能／荷物を置くスペースあり']
    }
  },
  {
    id: 'taxi-guide',
    title: '🚕 タクシー利用法と注意事項',
    category: '交通/移動',
    description: '韓国でタクシーを安全で便利に利用する方法',
    details: {
      basic: '基本料金：約4,800ウォン（ソウル基準、2km)',
      apps: ['Kakao T（カカオタクシー）– 英語可能、カード決済選択可能', 'UT（ウティ）– 外国人に優しいインターフェース'],
      warnings: ['非公式タクシー（白い個人車両）は避けてください！', 'タクシー内でメーターが動いているか必ず確認してください']
    }
  },
  {
    id: 'accommodation-tips',
    title: '🏨 韓国で宿泊施設を選ぶ時に考慮すべき5つのこと',
    category: '宿泊/地域情報',
    description: '予算と旅行スタイルに合った宿泊施設選択ガイド',
    details: {
      checklist: ['位置：地下鉄駅とどれくらい近いか？', '言語サポート：英語可能なスタッフまたは案内システム？', '施設：WiFi、洗濯機、朝食提供の有無', 'レビュー：Google、Booking.com、Agodaで確認'],
      types: {
        'ビジネスホテル': '都心、清潔',
        'ゲストハウス': '安価、交流可能',
        '韓屋ステイ': '伝統文化体験可能'
      },
      platforms: {
        '予約サイト': 'Airbnb、Booking.com、Agoda',
        '韓屋体験': '韓屋体験はkoreanstay.krもおすすめ！'
      }
    }
  },
  {
    id: 'seoul-districts',
    title: '🗺️ ソウル地域別宿泊施設選択ガイド',
    category: '宿泊/地域情報',
    description: 'ソウル地域別特徴とおすすめ対象',
    details: {
      districts: {
        '明洞': 'ショッピング、両替、観光地密集、英語に優しい - ソウル初訪問者',
        '弘大': '若い雰囲気、ナイトライフ、カフェ通り - 自由旅行者',
        '江南': '洗練された都市雰囲気、高級宿泊施設、交通の中心地 - 出張、中長期滞在',
        '梨泰院': '様々な国籍の旅行者、外国レストラン多数 - 外国人コミュニティ好み',
        '鍾路/仁寺洞': '伝統文化、古宮近く、静かで芸術的な雰囲気 - 文化体験目的'
      },
      tips: ['地下鉄2号線または4号線近くの宿泊施設は移動がとても便利です！', '空港リムジン停車の有無もチェックすると良いです']
    }
  },
  {
    id: 'hanok-stay',
    title: '🏠 韓屋で一晩：伝統と共にする宿泊体験',
    category: '宿泊/地域情報',
    description: '伝統韓屋建物で韓国文化を直接体験',
    details: {
      locations: ['ソウル北村韓屋村：都心での韓屋体験', '全州韓屋村：韓屋体験の本場', '慶州/安東：伝統文化と韓屋がよく保存された地域'],
      experience: 'オンドル部屋（床暖房）、茶道体験、韓服体験、伝統朝食提供',
      price: '1泊基準50,000～150,000ウォン（施設と位置により差異）',
      booking: 'KoreaStay、Airbnb、Agodaなどで「Hanok」検索'
    }
  },
  {
    id: 'emergency-contacts',
    title: '🏥 緊急時に必ず知っておくべき韓国連絡先',
    category: '大使館/緊急',
    description: '突然の事故や病気が発生した時の対処法',
    details: {
      emergency: ['救急医療/火災：119（英語可能）', '警察通報：112', '外国人民願：1345（多言語サポート）', '旅行者ヘルプライン：1330（24時間、カカオトーク チャット相談も可能）'],
      tips: ['韓国のほとんどの緊急コールセンターは英語を含む多言語サポート可能', '1330はカカオトーク チャット相談も可能（観光関連問い合わせ時に有用）']
    }
  },
  {
    id: 'embassies',
    title: '🏛️ 韓国内主要大使館位置と連絡先',
    category: '大使館/緊急',
    description: 'パスポート紛失、逮捕、事故など緊急時の連絡先',
    details: {
      embassies: {
        'アメリカ': '鍾路区世宗大路188、02-397-4114',
        'カナダ': '中区貞洞キル21、02-3783-6000',
        'イギリス': '鍾路区世宗大路19、02-3210-5500',
        'フランス': '瑞草区孝令路396、02-3149-4300',
        '日本': '鍾路区栗谷路6、02-765-3011'
      },
      tips: ['Google マップで「[国]embassy Seoul」検索すると素早く見つけられます', 'パスポートのコピーを事前に写真で撮っておくと良いです']
    }
  },
  {
    id: 'medical-guide',
    title: '💊 旅行中の病院/薬局利用ガイド',
    category: '大使館/緊急',
    description: '韓国の医療システムと外国人診療可能な病院',
    details: {
      hospitals: ['ソウル医療院国際診療センター：02-2276-7000', 'セブランス病院国際診療センター：1599-1004', 'サムスンソウル病院International Clinic：02-3410-0200'],
      pharmacy: ['薬局は通常「薬(藥)」表示看板があります', '一般的な風邪薬、消化薬は処方なしで購入可能', '医師の処方箋が必要な薬も多いので、病院を先に訪問することをおすすめ'],
      apps: ['KakaoMap / NAVER Mapで「薬局」、「病院」検索可能', 'Goodoc：英語で病院/薬局レビューと位置確認可能']
    }
  }
];

// 중국어 여행 콘텐츠
export const chineseTravelContent: FloatingBallContent[] = [
  {
    id: 'hanbok-experience',
    title: '🇰🇷 穿韩服体验景福宫',
    category: '文化体验',
    description: '穿着传统服装在古宫中漫步，拍摄人生美照',
    details: {
      location: '首尔钟路区世宗路161',
      transport: '地铁3号线景福宫站5号出口步行5分钟',
      hours: '每日09:00～18:00（每周二休息）',
      price: '一般门票：成人3,000韩元／穿韩服免费',
      tips: ['景福宫附近有各种韩服租赁店', '可租赁1小时～全天（约15,000韩元起）']
    }
  },
  {
    id: 'gwangjang-market',
    title: '🍲 传统市场美食之旅：广藏市场',
    category: '美食/餐厅',
    description: '可以便宜享用韩国传统美食的著名景点',
    details: {
      location: '首尔钟路区昌庆宫路88',
      transport: '地铁1号线钟路5街站8号出口步行2分钟',
      specialties: ['毒品紫菜包饭（迷你紫菜包饭）', '绿豆煎饼', '辣炒年糕', '杂菜、生牛肉等'],
      tips: ['现金结算很方便！（很多地方也可以刷卡）', '比午餐时间早一点去可以避开人群']
    }
  },
  {
    id: 'temple-stay',
    title: '🧘‍♀️ 寺庙住宿：在寺庙过夜',
    category: '文化体验',
    description: '可以体验韩国传统佛教文化的特别项目',
    details: {
      locations: ['首尔曹溪寺', '杨平传统寺院奉先寺', '庆州骨窟寺（可体验仙武道）'],
      program: '1晚2天或当日体验 - 冥想、寺庙料理体验、与僧人对话等',
      price: '约50,000～100,000韩元（各寺庙不同）',
      website: 'https://www.templestay.com'
    }
  },
  {
    id: 'korean-bbq',
    title: '🍖 韩式烤肉，自己烤着吃的乐趣！',
    category: '美食/餐厅',
    description: '自己烤肉吃的独特文化',
    details: {
      areas: {
        '弘大': '年轻氛围，有英文菜单的店很多',
        '江南': '高端烤肉店很多',
        '梨泰院': '对外国人友好，提供各种肉类选择'
      },
      tips: ['有时员工会帮你烤肉！', '推荐包饭酱+大蒜+蔬菜的组合！', '大部分按1人份（150g）标准点餐（推荐2人以上访问）']
    }
  },
  {
    id: 'bibimbap',
    title: '🍲 全州拌饭：健康又华丽的一餐',
    category: '美食/餐厅',
    description: '健康又华丽的韩国传统料理',
    details: {
      restaurants: {
        '全州韩屋村': '传统拌饭的圣地',
        '明洞古宫': '首尔中心的正宗拌饭',
        '仁寺洞韩定食店': '拌饭和传统小菜一起提供'
      },
      tips: ['韩式辣椒酱可能会辣，可以调节分量', '素食拌饭菜单上也经常有']
    }
  },
  {
    id: 'street-food',
    title: '🧁 韩国街头小吃BEST 3',
    category: '美食/餐厅',
    description: '便宜又美味的街头小吃',
    details: {
      foods: [
        '糖饼：甜蜜的肉桂坚果馅冬季小吃',
        '炸物+辣炒年糕套餐：与辣酱的绝配组合',
        '鲫鱼饼：鱼形状里装着红豆或奶油的小吃'
      ],
      locations: ['明洞街：各种各样的路边摊', '广藏市场：便宜且传统气氛', '弘大步行街：年轻感性的时尚小吃'],
      price: '大部分在1,000韩元～3,000韩元之间'
    }
  },
  {
    id: 'subway-guide',
    title: '🚇 韩国地铁完全攻略指南',
    category: '交通/出行',
    description: '快速、便宜且对外国人友好的地铁使用方法',
    details: {
      howto: '购买T-money交通卡 → 充值 → 刷卡使用',
      price: '基本费用：约1,400韩元～1,500韩元',
      apps: ['Kakao Metro：线路图和换乘信息', 'NAVER Map / Kakao Map：实时路线指引'],
      tips: ['列车门会自动关闭，要快速上车！', '车厢内要保持安静！不打电话是礼貌']
    }
  },
  {
    id: 'airport-transport',
    title: '🚌 机场到市中心：机场大巴还是AREX？',
    category: '交通/出行',
    description: '从仁川国际机场到首尔市内的交通方式',
    details: {
      options: [
        '机场大巴：16,000韩元～，60～80分钟，在酒店前停车',
        'AREX直达列车：9,500韩元，43分钟，直达首尔站',
        '普通AREX：4,750韩元，60分钟，经济实惠选择'
      ],
      tips: ['票可在机场内售票处或自动售票机购买', '可刷卡支付／有放行李的空间']
    }
  },
  {
    id: 'taxi-guide',
    title: '🚕 出租车使用方法和注意事项',
    category: '交通/出行',
    description: '在韩国安全便利地使用出租车的方法',
    details: {
      basic: '起步价：约4,800韩元（首尔标准，2公里）',
      apps: ['Kakao T（卡卡奥出租车）– 可用英语，可选择刷卡支付', 'UT（优T）– 对外国人友好的界面'],
      warnings: ['避免非正规出租车（白色私家车）！', '在出租车内一定要确认计价器是否运行']
    }
  },
  {
    id: 'accommodation-tips',
    title: '🏨 在韩国选择住宿时要考虑的5个要点',
    category: '住宿/地区信息',
    description: '符合预算和旅行风格的住宿选择指南',
    details: {
      checklist: ['位置：离地铁站有多近？', '语言支持：是否有会英语的工作人员或指引系统？', '设施：WiFi、洗衣机、早餐提供与否', '评价：在Google、Booking.com、Agoda上确认'],
      types: {
        '商务酒店': '市中心，干净整洁',
        '招待所': '便宜，可交流',
        '韩屋住宿': '可体验传统文化'
      },
      platforms: {
        '预订网站': 'Airbnb、Booking.com、Agoda',
        '韩屋体验': '韩屋体验还推荐koreanstay.kr！'
      }
    }
  },
  {
    id: 'seoul-districts',
    title: '🗺️ 首尔地区别住宿选择指南',
    category: '住宿/地区信息',
    description: '首尔各地区特色和推荐对象',
    details: {
      districts: {
        '明洞': '购物、换钱、观光地密集，英语友好 - 首次访问首尔者',
        '弘大': '年轻氛围，夜生活，咖啡街 - 自由行游客',
        '江南': '精致的都市氛围，高级住宿，交通中心 - 出差、中长期居住',
        '梨泰院': '各国游客，外国餐厅众多 - 偏好外国人社区',
        '钟路/仁寺洞': '传统文化，古宫附近，安静艺术氛围 - 文化体验目的'
      },
      tips: ['地铁2号线或4号线附近的住宿交通非常便利！', '也要检查机场大巴停靠与否']
    }
  },
  {
    id: 'hanok-stay',
    title: '🏠 韩屋过夜：与传统同行的住宿体验',
    category: '住宿/地区信息',
    description: '在传统韩屋建筑中直接体验韩国文化',
    details: {
      locations: ['首尔北村韩屋村：市中心的韩屋体验', '全州韩屋村：韩屋体验的本场', '庆州/安东：传统文化和韩屋保存完好的地区'],
      experience: '温突房（地暖）、茶道体验、韩服体验、传统早餐提供',
      price: '1晚标准50,000～150,000韩元（根据设施和位置有差异）',
      booking: '在KoreaStay、Airbnb、Agoda等搜索"Hanok"'
    }
  },
  {
    id: 'emergency-contacts',
    title: '🏥 紧急情况时必须知道的韩国联系方式',
    category: '大使馆/紧急',
    description: '发生突发事故或疾病时的应对方法',
    details: {
      emergency: ['急救医疗/火灾：119（可用英语）', '报警：112', '外国人民愿：1345（多语言支持）', '旅行者热线：1330（24小时，也可KakaoTalk聊天咨询）'],
      tips: ['韩国大部分紧急呼叫中心支持包括英语在内的多语言', '1330也可进行KakaoTalk聊天咨询（旅游相关咨询时有用）']
    }
  },
  {
    id: 'embassies',
    title: '🏛️ 韩国内主要大使馆位置及联系方式',
    category: '大使馆/紧急',
    description: '护照丢失、被捕、事故等紧急情况时的联系方式',
    details: {
      embassies: {
        '美国': '钟路区世宗大路188，02-397-4114',
        '加拿大': '中区贞洞路21，02-3783-6000',
        '英国': '钟路区世宗大路19，02-3210-5500',
        '法国': '瑞草区孝令路396，02-3149-4300',
        '日本': '钟路区栗谷路6，02-765-3011'
      },
      tips: ['在Google地图搜索"[国家] embassy Seoul"可快速找到', '事先拍摄护照复印件照片会很有用']
    }
  },
  {
    id: 'medical-guide',
    title: '💊 旅行中医院/药店使用指南',
    category: '大使馆/紧急',
    description: '韩国的医疗系统和可为外国人诊疗的医院',
    details: {
      hospitals: ['首尔医疗院国际诊疗中心：02-2276-7000', '延世大学医院国际诊疗中心：1599-1004', '三星首尔医院International Clinic：02-3410-0200'],
      pharmacy: ['药店通常有"药(藥)"标志招牌', '一般感冒药、消化药可无处方购买', '需要医生处方的药也很多，建议先去医院'],
      apps: ['在KakaoMap / NAVER Map可搜索"药店"、"医院"', 'Goodoc：可用英语确认医院/药店评价和位置']
    }
  }
];

// 독일어 여행 콘텐츠
export const germanTravelContent: FloatingBallContent[] = [
  {
    id: 'hanbok-experience',
    title: '🇰🇷 Hanbok-Erlebnis im Gyeongbokgung-Palast',
    category: 'Kulturerlebnis',
    description: 'Tragen Sie traditionelle koreanische Kleidung und machen Sie großartige Fotos in einem alten Palast',
    details: {
      location: '161 Sejong-ro, Jongno-gu, Seoul',
      transport: 'U-Bahn Linie 3, Station Gyeongbokgung, Ausgang 5, 5 Minuten zu Fuß',
      hours: 'Täglich 09:00 ~ 18:00 (Dienstags geschlossen)',
      price: 'Allgemeine Eintrittskarte: Erwachsene 3.000 KRW / Kostenlos mit Hanbok',
      tips: ['Verschiedene Hanbok-Verleihgeschäfte in der Nähe des Gyeongbokgung-Palastes', 'Verleih von 1 Stunde bis ganztägig möglich (ab etwa 15.000 KRW)']
    }
  },
  {
    id: 'gwangjang-market',
    title: '🍲 Traditioneller Markt-Food-Tour: Gwangjang-Markt',
    category: 'Essen/Restaurants',
    description: 'Ein berühmter Ort, um traditionelles koreanisches Essen zu günstigen Preisen zu genießen',
    details: {
      location: '88 Changgyeonggung-ro, Jongno-gu, Seoul',
      transport: 'U-Bahn Linie 1, Station Jongno 5-ga, Ausgang 8, 2 Minuten zu Fuß',
      specialties: ['Mayak Gimbap (Mini Gimbap)', 'Bindaetteok (Mungbohnen-Pfannkuchen)', 'Tteokbokki (Scharfe Reiskuchen)', 'Japchae, Yukhoe, usw.'],
      tips: ['Barzahlung ist bequem! (Viele Orte akzeptieren auch Karten)', 'Besuchen Sie früher als zu den Mittagszeiten, um Menschenmassen zu vermeiden']
    }
  },
  {
    id: 'temple-stay',
    title: '🧘‍♀️ Tempel-Aufenthalt: Eine Nacht im buddhistischen Tempel verbringen',
    category: 'Kulturerlebnis',
    description: 'Ein spezielles Programm zur Erfahrung der traditionellen koreanischen buddhistischen Kultur',
    details: {
      locations: ['Jogyesa-Tempel in Seoul', 'Bongseunsa-Tempel in Yangpyeong', 'Golgulsa-Tempel in Gyeongju (Sunmudo-Kampfkunst verfügbar)'],
      program: '1 Nacht 2 Tage oder Tagesausflug - Meditation, Tempelfood-Erlebnis, Gespräch mit Mönchen, usw.',
      price: 'Etwa 50.000 ~ 100.000 KRW (variiert je nach Tempel)',
      website: 'https://www.templestay.com'
    }
  },
  {
    id: 'korean-bbq',
    title: '🍖 Koreanisches BBQ: Die Freude am Selbstgrillen!',
    category: 'Essen/Restaurants',
    description: 'Die einzigartige Kultur des Selbstgrillens und -essens',
    details: {
      areas: {
        'Hongdae': 'Junge Atmosphäre, viele Orte mit englischen Menüs',
        'Gangnam': 'Viele Premium-BBQ-Restaurants',
        'Itaewon': 'Ausländerfreundlich, verschiedene Fleischoptionen verfügbar'
      },
      tips: ['Manchmal grillt das Personal das Fleisch für Sie!', 'Empfehlen Ssamjang + Knoblauch + Gemüse-Kombo!', 'Die meisten Bestellungen sind pro Portion (150g) - empfohlen für 2+ Personen']
    }
  },
  {
    id: 'bibimbap',
    title: '🍲 Jeonju Bibimbap: Gesunde und farbenfrohe koreanische Mahlzeit',
    category: 'Essen/Restaurants',
    description: 'Gesundes und farbenprächtiges traditionelles koreanisches Essen',
    details: {
      restaurants: {
        'Jeonju Hanok Village': 'Das heilige Land des traditionellen Bibimbap',
        'Gogung Myeongdong': 'Authentisches Bibimbap im Zentrum von Seoul',
        'Insadong koreanische Restaurants': 'Bibimbap mit traditionellen Beilagen'
      },
      tips: ['Gochujang kann scharf sein, Sie können die Menge anpassen', 'Vegetarisches Bibimbap ist oft auf den Menüs verfügbar']
    }
  },
  {
    id: 'street-food',
    title: '🧁 Koreanisches Straßenessen BEST 3',
    category: 'Essen/Restaurants',
    description: 'Günstige und leckere Straßensnacks',
    details: {
      foods: [
        'Hotteok: Süßer Zimt-Nuss-gefüllter Wintersnack',
        'Frittiertes Essen + Tteokbokki Set: Perfekte Kombination mit scharfer Sauce',
        'Bungeoppang: Fischförmiges Gebäck gefüllt mit roten Bohnen oder Sahne'
      ],
      locations: ['Myeongdong Straße: Verschiedene Straßenimbissstände', 'Gwangjang Markt: Günstige und traditionelle Atmosphäre', 'Hongdae Fußgängerzone: Trendige Snacks mit jugendlicher Atmosphäre'],
      price: 'Die meisten zwischen 1.000-3.000 KRW'
    }
  },
  {
    id: 'subway-guide',
    title: '🚇 Kompletter koreanischer U-Bahn-Guide',
    category: 'Transport',
    description: 'Wie man das schnelle, günstige und ausländerfreundliche U-Bahn-System nutzt',
    details: {
      howto: 'T-money Karte kaufen → Aufladen → Antippen und benutzen',
      price: 'Grundtarif: Etwa 1.400-1.500 KRW',
      apps: ['Kakao Metro: Streckenplan und Umsteigeinfos', 'NAVER Map / Kakao Map: Echzeit-Wegbeschreibung'],
      tips: ['Zugtüren schließen automatiquement, schnell einsteigen!', 'Leise in den Zügen bleiben! Telefonate vermeiden als Höflichkeit']
    }
  },
  {
    id: 'airport-transport',
    title: '🚌 Flughafen zur Innenstadt: Flughafen-Limousine oder AREX?',
    category: 'Transport',
    description: 'Wie man vom Incheon International Airport ins Zentrum von Seoul kommt',
    details: {
      options: [
        'Flughafen-Limousine: 16.000+ KRW, 60-80 Minuten, hält vor Hotels',
        'AREX Express: 9.500 KRW, 43 Minuten, non-stop zum Seoul Bahnhof',
        'Regular AREX: 4.750 KRW, 60 Minuten, Budget-Option'
      ],
      tips: ['Tickets an Flughafen-Schaltern oder Automaten kaufen', 'Kartenzahlung möglich / Platz für Gepäck']
    }
  },
  {
    id: 'taxi-guide',
    title: '🚕 Taxi-Nutzung und Vorsichtsmaßnahmen',
    category: 'Transport',
    description: 'Wie man Taxis sicher und bequem in Korea nutzt',
    details: {
      basic: 'Grundpreis: Etwa 4.800 KRW (Seoul Standard, 2km)',
      apps: ['Kakao T - Englisch verfügbar, Kartenzahlung-Option', 'UT - Ausländerfreundliche Benutzeroberfläche'],
      warnings: ['Inoffizielle Taxis (weiße Privatfahrzeuge) vermeiden!', 'Immer prüfen, dass der Taxameter läuft']
    }
  },
  {
    id: 'accommodation-tips',
    title: '🏨 5 Dinge bei der Unterkunftswahl in Korea zu beachten',
    category: 'Unterkunft/Regionalinfo',
    description: 'Leitfaden zur Wahl von Unterkünften für Budget und Reisestil',
    details: {
      checklist: ['Lage: Wie nah zu U-Bahn-Stationen?', 'Sprachunterstützung: Englischsprachiges Personal oder Leitsystem?', 'Einrichtungen: WiFi, Waschmaschine, Frühstück verfügbar', 'Bewertungen: Auf Google, Booking.com, Agoda prüfen'],
      types: {
        'Business-Hotels': 'Innenstadt, sauber',
        'Gästehäuser': 'Günstig, soziale Interaktion möglich',
        'Hanok-Aufenthalte': 'Traditionelle Kulturerfahrung möglich'
      },
      platforms: {
        'Buchungsseiten': 'Airbnb, Booking.com, Agoda',
        'Hanok-Erlebnisse': 'Für Hanok-Erlebnisse ist koreanstay.kr auch empfohlen!'
      }
    }
  },
  {
    id: 'seoul-districts',
    title: '🗺️ Seoul Bezirks-Unterkunfts-Auswahl-Guide',
    category: 'Unterkunft/Regionalinfo',
    description: 'Charakteristika der Seoul-Bezirke und empfohlene Zielgruppen',
    details: {
      districts: {
        'Myeongdong': 'Shopping, Geldwechsel, Touristenattraktionen, englischfreundlich - Seoul Erstbesucher',
        'Hongdae': 'Junge Atmosphäre, Nachtleben, Café-Straßen - Individualreisende',
        'Gangnam': 'Gehobene Stadtkultur, Luxusunterkünfte, Verkehrsknotenpunkt - Geschäftsreisen, mittelfristige Aufenthalte',
        'Itaewon': 'Diverse internationale Reisende, viele ausländische Restaurants - Ausländer-Community-Präferenz',
        'Jongno/Insadong': 'Traditionelle Kultur, in der Nähe von Palästen, ruhige künstlerische Atmosphäre - Kulturerlebnis-Zwecke'
      },
      tips: ['Unterkünfte in der Nähe der U-Bahn-Linie 2 oder 4 sind sehr praktisch für Reisen!', 'Auch prüfen, ob Flughafen-Limousine in der Nähe hält']
    }
  },
  {
    id: 'hanok-stay',
    title: '🏠 Eine Nacht im Hanok: Unterkunftserlebnis mit Tradition',
    category: 'Unterkunft/Regionalinfo',
    description: 'Koreanische Kultur direkt in traditionellen Hanok-Gebäuden erleben',
    details: {
      locations: ['Seoul Bukchon Hanok Village: Hanok-Erlebnis im Stadtzentrum', 'Jeonju Hanok Village: Heimat der Hanok-Erlebnisse', 'Gyeongju/Andong: Gebiete mit gut erhaltener traditioneller Kultur und Hanoks'],
      experience: 'Ondol-Zimmer (Fußbodenheizung), Teezeremonie-Erlebnis, Hanbok-Erlebnis, traditionelles Frühstück',
      price: '50.000 ~ 150.000 KRW pro Nacht (variiert je nach Einrichtungen und Lage)',
      booking: 'Suche nach "Hanok" auf KoreaStay, Airbnb, Agoda, etc.'
    }
  },
  {
    id: 'emergency-contacts',
    title: '🏥 Wichtige koreanische Notfallkontakte',
    category: 'Botschaft/Notfall',
    description: 'Wie man bei plötzlichen Unfällen oder Krankheiten reagiert',
    details: {
      emergency: ['Notfall-Medizin/Feuer: 119 (Englisch verfügbar)', 'Polizei-Bericht: 112', 'Ausländer-Zivilbeschwerden: 1345 (mehrsprachige Unterstützung)', 'Reisenden-Helpline: 1330 (24 Stunden, KakaoTalk Chat-Beratung auch verfügbar)'],
      tips: ['Die meisten koreanischen Notruf-Callcenter unterstützen mehrere Sprachen einschließlich Englisch', '1330 bietet auch KakaoTalk Chat-Beratung (nützlich für tourismusbezogene Anfragen)']
    }
  },
  {
    id: 'embassies',
    title: '🏛️ Wichtige Botschaftsstandorte und Kontakte in Korea',
    category: 'Botschaft/Notfall',
    description: 'Kontaktinformationen für Notfälle wie Passverlust, Verhaftung, Unfälle',
    details: {
      embassies: {
        'USA': 'Jongno-gu Sejong-daero 188, 02-397-4114',
        'Kanada': 'Jung-gu Jeongdong-gil 21, 02-3783-6000',
        'Großbritannien': 'Jongno-gu Sejong-daero 19, 02-3210-5500',
        'Frankreich': 'Seocho-gu Hyoryeong-ro 396, 02-3149-4300',
        'Japan': 'Jongno-gu Yulgok-ro 6, 02-765-3011'
      },
      tips: ['Suche "[Land] embassy Seoul" in Google Maps für schnelles Finden', 'Fotos von Passkopien im Voraus machen']
    }
  },
  {
    id: 'medical-guide',
    title: '💊 Krankenhaus/Apotheken-Nutzung während der Reise',
    category: 'Botschaft/Notfall',
    description: 'Koreas Gesundheitssystem und Krankenhäuser für ausländische Patienten',
    details: {
      hospitals: ['Seoul Medical Center International Clinic: 02-2276-7000', 'Severance Hospital International Clinic: 1599-1004', 'Samsung Seoul Hospital International Clinic: 02-3410-0200'],
      pharmacy: ['Apotheken haben normalerweise "약(藥)" Schilder', 'Häufige Erkältungsmedizin, Verdauungsmedizin können ohne Rezept gekauft werden', 'Viele Medikamente benötigen Arztrezept, daher wird Krankenhausbesuch zuerst empfohlen'],
      apps: ['Suche nach "Apotheke", "Krankenhaus" auf KakaoMap / NAVER Map', 'Goodoc：英語で病院/薬局レビューと位置確認可能']
    }
  }
];

// 프랑스어 여행 콘텐츠
export const frenchTravelContent: FloatingBallContent[] = [
  {
    id: 'hanbok-experience',
    title: '🇰🇷 Expérience Hanbok au Palais Gyeongbokgung',
    category: 'Expérience culturelle',
    description: 'Portez des vêtements traditionnels coréens et prenez de superbes photos dans un palais ancien',
    details: {
      location: '161 Sejong-ro, Jongno-gu, Séoul',
      transport: 'Métro ligne 3, station Gyeongbokgung, sortie 5, 5 minutes à pied',
      hours: 'Tous les jours 09:00 ~ 18:00 (Fermé le mardi)',
      price: 'Admission générale : Adultes 3 000 KRW / Gratuit avec Hanbok',
      tips: ['Divers magasins de location de Hanbok près du palais Gyeongbokgung', 'Location disponible de 1 heure à toute la journée (à partir d\'environ 15 000 KRW)']
    }
  },
  {
    id: 'gwangjang-market',
    title: '🍲 Tour gastronomique du marché traditionnel : Marché Gwangjang',
    category: 'Nourriture/Restaurants',
    description: 'Un endroit célèbre pour déguster la cuisine traditionnelle coréenne à des prix abordables',
    details: {
      location: '88 Changgyeonggung-ro, Jongno-gu, Séoul',
      transport: 'Métro ligne 1, station Jongno 5-ga, sortie 8, 2 minutes à pied',
      specialties: ['Mayak Gimbap (Mini Gimbap)', 'Bindaetteok (Crêpe aux haricots mungo)', 'Tteokbokki (Gâteau de riz épicé)', 'Japchae, Yukhoe, etc.'],
      tips: ['Le paiement en espèces est pratique ! (Beaucoup d\'endroits acceptent aussi les cartes)', 'Visitez plus tôt que les heures de déjeuner pour éviter la foule']
    }
  },
  {
    id: 'temple-stay',
    title: '🧘‍♀️ Séjour au temple : Passer une nuit dans un temple bouddhiste',
    category: 'Expérience culturelle',
    description: 'Un programme spécial pour découvrir la culture bouddhiste traditionnelle coréenne',
    details: {
      locations: ['Temple Jogyesa à Séoul', 'Temple Bongseunsa à Yangpyeong', 'Temple Golgulsa à Gyeongju (arts martiaux Sunmudo disponibles)'],
      program: '1 nuit 2 jours ou excursion d\'une journée - Méditation, expérience de nourriture de temple, conversation avec des moines, etc.',
      price: 'Environ 50 000 ~ 100 000 KRW (varie selon le temple)',
      website: 'https://www.templestay.com'
    }
  },
  {
    id: 'korean-bbq',
    title: '🍖 BBQ coréen : La joie de griller sa propre viande !',
    category: 'Nourriture/Restaurants',
    description: 'La culture unique de griller et manger sa propre viande',
    details: {
      areas: {
        'Hongdae': 'Atmosphère jeune, beaucoup d\'endroits avec menus anglais',
        'Gangnam': 'Beaucoup de restaurants BBQ premium',
        'Itaewon': 'Convivial pour les étrangers, diverses options de viande disponibles'
      },
      tips: ['Parfois le personnel grille la viande pour vous !', 'Recommandons le combo ssamjang + ail + légumes !', 'La plupart des commandes sont par portion (150g) - recommandé pour 2+ personnes']
    }
  },
  {
    id: 'bibimbap',
    title: '🍲 Bibimbap de Jeonju : Repas coréen sain et coloré',
    category: 'Nourriture/Restaurants',
    description: 'Nourriture traditionnelle coréenne saine et colorée',
    details: {
      restaurants: {
        'Village Hanok de Jeonju': 'La terre sainte du bibimbap traditionnel',
        'Gogung Myeongdong': 'Bibimbap authentique au centre de Séoul',
        'Restaurants coréens d\'Insadong': 'Bibimbap avec des accompagnements traditionnels'
      },
      tips: ['Le gochujang peut être épicé, vous pouvez ajuster la quantité', 'Le bibimbap végétarien est souvent disponible sur les menus']
    }
  },
  {
    id: 'street-food',
    title: '🧁 Cuisine de rue coréenne BEST 3',
    category: 'Nourriture/Restaurants',
    description: 'Collations de rue abordables et délicieuses',
    details: {
      foods: [
        'Hotteok : Collation hivernale sucrée fourrée aux noix et cannelle',
        'Set aliments frits + Tteokbokki : Combinaison parfaite avec sauce épicée',
        'Bungeoppang : Pâtisserie en forme de poisson fourrée aux haricots rouges ou à la crème'
      ],
      locations: ['Rue Myeongdong : Divers stands de nourriture de rue', 'Marché Gwangjang : Atmosphère abordable et traditionnelle', 'Rue piétonne Hongdae : Collations tendance avec ambiance jeune'],
      price: 'La plupart entre 1 000-3 000 KRW'
    }
  },
  {
    id: 'subway-guide',
    title: '🚇 Guide complet du métro coréen',
    category: 'Transport',
    description: 'Comment utiliser le système de métro rapide, abordable et convivial pour les étrangers',
    details: {
      howto: 'Acheter carte T-money → Recharger → Scanner et utiliser',
      price: 'Tarif de base : Environ 1 400-1 500 KRW',
      apps: ['Kakao Metro : Plans de lignes et infos de correspondance', 'NAVER Map / Kakao Map : Directions en temps réel'],
      tips: ['Les portes du train se ferment automatiquement, montez rapidement !', 'Restez silencieux dans les trains ! Évitez les appels téléphoniques par courtoisie']
    }
  },
  {
    id: 'airport-transport',
    title: '🚌 Aéroport vers centre-ville : Limousine d\'aéroport ou AREX ?',
    category: 'Transport',
    description: 'Comment aller de l\'aéroport international d\'Incheon au centre de Séoul',
    details: {
      options: [
        'Bus limousine d\'aéroport : 16 000+ KRW, 60-80 minutes, arrêts devant les hôtels',
        'AREX Express : 9 500 KRW, 43 minutes, direct vers la gare de Séoul',
        'AREX régulier : 4 750 KRW, 60 minutes, option économique'
      ],
      tips: ['Acheter billets aux guichets de l\'aéroport ou distributeurs automatiques', 'Paiement par carte possible / Espace pour bagages']
    }
  },
  {
    id: 'taxi-guide',
    title: '🚕 Utilisation des taxis et précautions',
    category: 'Transport',
    description: 'Comment utiliser les taxis en sécurité et commodément en Corée',
    details: {
      basic: 'Tarif de base : Environ 4 800 KRW (standard Séoul, 2km)',
      apps: ['Kakao T - Anglais disponible, option paiement par carte', 'UT - Interface conviviale pour étrangers'],
      warnings: ['Éviter les taxis non officiels (véhicules privés blancs) !', 'Toujours vérifier que le compteur fonctionne dans le taxi']
    }
  },
  {
    id: 'accommodation-tips',
    title: '🏨 5 choses à considérer lors du choix d\'hébergement en Corée',
    category: 'Hébergement/Info régionale',
    description: 'Guide pour choisir un hébergement adapté à votre budget et style de voyage',
    details: {
      checklist: ['Emplacement : À quelle distance des stations de métro ?', 'Support linguistique : Personnel anglophone ou système de guidage ?', 'Installations : WiFi, machine à laver, petit-déjeuner disponible', 'Avis : Vérifier sur Google, Booking.com, Agoda'],
      types: {
        'Hôtels d\'affaires': 'Centre-ville, propre',
        'Maisons d\'hôtes': 'Abordable, interaction sociale possible',
        'Séjours Hanok': 'Expérience culturelle traditionnelle possible'
      },
      platforms: {
        'Sites de réservation': 'Airbnb, Booking.com, Agoda',
        'Expériences Hanok': 'Pour les expériences Hanok, koreanstay.kr est aussi recommandé !'
      }
    }
  },
  {
    id: 'seoul-districts',
    title: '🗺️ Guide de sélection d\'hébergement par district de Séoul',
    category: 'Hébergement/Info régionale',
    description: 'Caractéristiques des districts de Séoul et publics cibles recommandés',
    details: {
      districts: {
        'Myeongdong': 'Shopping, change de devises, attractions touristiques, anglophone - Premiers visiteurs de Séoul',
        'Hongdae': 'Atmosphère jeune, vie nocturne, cafe streets - Independent travelers',
        'Gangnam': 'Atmosphère urbaine sophistiquée, hébergement de luxe, hub de transport - Voyages d\'affaires, séjours moyen/long terme',
        'Itaewon': 'Voyageurs internationaux divers, nombreux restaurants étrangers - Préférence communauté étrangère',
        'Jongno/Insadong': 'Culture traditionnelle, près des palais, atmosphère artistique calme - Objectifs d\'expérience culturelle'
      },
      tips: ['Les hébergements près des lignes de métro 2 ou 4 sont très pratiques pour voyager !', 'Vérifier aussi si la limousine d\'aéroport s\'arrête à proximité']
    }
  },
  {
    id: 'hanok-stay',
    title: '🏠 Une nuit en Hanok : Expérience d\'hébergement avec tradition',
    category: 'Hébergement/Info régionale',
    description: 'Vivre directement la culture coréenne dans des bâtiments Hanok traditionnels',
    details: {
      locations: ['Village Hanok Bukchon de Séoul : Expérience Hanok en centre-ville', 'Village Hanok de Jeonju : Foyer des expériences Hanok', 'Gyeongju/Andong : Zones où la culture traditionnelle et les Hanok sont bien préservés'],
      experience: 'Chambres Ondol (chauffage au sol), expérience de cérémonie du thé, expérience Hanbok, petit-déjeuner traditionnel fourni',
      price: '50 000 ~ 150 000 KRW par nuit (varie selon installations et emplacement)',
      booking: 'Rechercher "Hanok" sur KoreaStay, Airbnb, Agoda, etc.'
    }
  },
  {
    id: 'emergency-contacts',
    title: '🏥 Contacts d\'urgence coréens essentiels',
    category: 'Ambassade/Urgence',
    description: 'Comment réagir en cas d\'accidents soudains ou de maladie',
    details: {
      emergency: ['Urgence médicale/incendie : 119 (anglais disponible)', 'Rapport de police : 112', 'Plaintes civiles étrangers : 1345 (support multilingue)', 'Ligne d\'aide voyageurs : 1330 (24h, consultation chat KakaoTalk aussi disponible)'],
      tips: ['La plupart des centres d\'appels d\'urgence coréens supportent plusieurs langues dont l\'anglais', '1330 fournit aussi consultation chat KakaoTalk (utile pour demandes liées au tourisme)']
    }
  },
  {
    id: 'embassies',
    title: '🏛️ Emplacements et contacts des principales ambassades en Corée',
    category: 'Ambassade/Urgence',
    description: 'Informations de contact pour situations d\'urgence comme perte de passeport, arrestation, accidents',
    details: {
      embassies: {
        'États-Unis': 'Jongno-gu Sejong-daero 188, 02-397-4114',
        'Canada': 'Jung-gu Jeongdong-gil 21, 02-3783-6000',
        'Royaume-Uni': 'Jongno-gu Sejong-daero 19, 02-3210-5500',
        'France': 'Seocho-gu Hyoryeong-ro 396, 02-3149-4300',
        'Japon': 'Jongno-gu Yulgok-ro 6, 02-765-3011'
      },
      tips: ['Rechercher "[pays] embassy Seoul" sur Google Maps pour trouver rapidement', 'Prendre photos des copies de passeport à l\'avance']
    }
  },
  {
    id: 'medical-guide',
    title: '💊 Guide d\'utilisation hôpital/pharmacie pendant le voyage',
    category: 'Ambassade/Urgence',
    description: 'Système de santé coréen et hôpitaux disponibles pour patients étrangers',
    details: {
      hospitals: ['Seoul Medical Center International Clinic : 02-2276-7000', 'Severance Hospital International Clinic : 1599-1004', 'Samsung Seoul Hospital International Clinic : 02-3410-0200'],
      pharmacy: ['Les pharmacies ont généralement des panneaux "약(藥)"', 'Médicaments courants contre rhume, digestion peuvent être achetés sans ordonnance', 'Beaucoup de médicaments nécessitent ordonnance médicale, donc visiter l\'hôpital en premier est recommandé'],
      apps: ['Rechercher "pharmacie", "hôpital" sur KakaoMap / NAVER Map', 'Goodoc : Vérifier avis et emplacements hôpital/pharmacie en anglais']
    }
  }
];

// 스페인어 여행 콘텐츠
export const spanishTravelContent: FloatingBallContent[] = [
  {
    id: 'hanbok-experience',
    title: '🇰🇷 Experiencia Hanbok en el Palacio Gyeongbokgung',
    category: 'Experiencia cultural',
    description: 'Viste ropa tradicional coreana y toma fotos increíbles en un palacio antiguo',
    details: {
      location: '161 Sejong-ro, Jongno-gu, Seúl',
      transport: 'Metro línea 3, estación Gyeongbokgung, salida 5, 5 minutos caminando',
      hours: 'Diario 09:00 ~ 18:00 (Cerrado los martes)',
      price: 'Admisión general: Adultes 3,000 KRW / Gratis con Hanbok',
      tips: ['Varias tiendas de alquiler de Hanbok cerca del Palacio Gyeongbokgung', 'Location disponible de 1 hora a todo el día (desde aproximadamente 15,000 KRW)']
    }
  },
  {
    id: 'gwangjang-market',
    title: '🍲 Tour gastronómico del mercado tradicional: Mercado Gwangjang',
    category: 'Comida/Restaurantes',
    description: 'Un lugar famoso para disfrutar comida tradicional coreana a precios asequibles',
    details: {
      location: '88 Changgyeonggung-ro, Jongno-gu, Seúl',
      transport: 'Metro línea 1, estación Jongno 5-ga, salida 8, 2 minutos caminando',
      specialties: ['Mayak Gimbap (Mini Gimbap)', 'Bindaetteok (Panqueque de frijol mungo)', 'Tteokbokki (Pastel de arroz picante)', 'Japchae, Yukhoe, etc.'],
      tips: ['¡El pago en efectivo es conveniente! (Muchos lugares también aceptan tarjetas)', 'Visita más temprano que las horas de almuerzo para evitar multitudes']
    }
  },
  {
    id: 'temple-stay',
    title: '🧘‍♀️ Estancia en el templo: Pasar una noche en un templo budista',
    category: 'Experiencia cultural',
    description: 'Un programa especial para experimentar la cultura budista tradicional coreana',
    details: {
      locations: ['Templo Jogyesa en Seúl', 'Templo Bongseunsa en Yangpyeong', 'Templo Golgulsa en Gyeongju (artes marciales Sunmudo disponibles)'],
      program: '1 noche 2 días o excursión de un día - Meditación, experiencia de comida del templo, conversación con monjes, etc.',
      price: 'Aproximadamente 50,000 ~ 100,000 KRW (varía según el templo)',
      website: 'https://www.templestay.com'
    }
  },
  {
    id: 'korean-bbq',
    title: '🍖 BBQ coreano: ¡La alegría de asar tu propia carne!',
    category: 'Comida/Restaurantes',
    description: 'La cultura única de asar y comer tu propia carne',
    details: {
      areas: {
        'Hongdae': 'Ambiente joven, muchos lugares con menús en inglés',
        'Gangnam': 'Muchos restaurantes BBQ premium',
        'Itaewon': 'Amigable para extranjeros, varias opciones de carne disponibles'
      },
      tips: ['¡A veces el personal asa la carne por ti!', '¡Recomendamos la combinación ssamjang + ajo + verduras!', 'La mayoría de pedidos son por porción (150g) - recomendado para 2+ personas']
    }
  },
  {
    id: 'bibimbap',
    title: '🍲 Bibimbap de Jeonju: Comida coreana saludable y colorida',
    category: 'Comida/Restaurantes',
    description: 'Comida tradicional coreana saludable y colorida',
    details: {
      restaurants: {
        'Pueblo Hanok de Jeonju': 'La tierra sagrada del bibimbap tradicional',
        'Gogung Myeongdong': 'Bibimbap auténtico en el centro de Seúl',
        'Restaurantes coreanos de Insadong': 'Bibimbap con acompañamientos tradicionales'
      },
      tips: ['El gochujang puede ser picante, puedes ajustar la cantidad', 'El bibimbap vegetariano a menudo está disponible en los menús']
    }
  }
];

// 러시아어 여행 콘텐츠
export const russianTravelContent: FloatingBallContent[] = [
  {
    id: 'hanbok-experience',
    title: '🇰🇷 Опыт Ханбок во дворце Кёнбоккун',
    category: 'Культурный опыт',
    description: 'Наденьте традиционную корейскую одежду и сделайте потрясающие фотографии в древнем дворце',
    details: {
      location: '161 Седжон-ро, Чонно-гу, Сеул',
      transport: 'Метро линия 3, станция Кёнбоккун, выход 5, 5 минут пешком',
      hours: 'Ежедневно 09:00 ~ 18:00 (Закрыто по вторникам)',
      price: 'Общий вход: Взрослые 3,000 вон / Бесплатно с ханбок',
      tips: ['Различные магазины проката ханбок рядом с дворцом Кёнбоккун', 'Аренда доступна от 1 часа до целого дня (от примерно 15,000 вон)']
    }
  },
  {
    id: 'gwangjang-market',
    title: '🍲 Гастрономический тур по традиционному рынку: Рынок Кванджан',
    category: 'Еда/Рестораны',
    description: 'Знаменитое место для наслаждения традиционной корейской едой по доступным ценам',
    details: {
      location: '88 Чангкёнгун-ро, Чонно-гу, Сеул',
      transport: 'Метро линия 1, станция Чонно 5-га, выход 8, 2 минуты пешком',
      specialties: ['Маяк кимбап (Мини кимбап)', 'Биндэттeок (Блин из маша)', 'Ттeокбокки (Острые рисовые лепешки)', 'Чапче, Юкхё и др.'],
      tips: ['Оплата наличными удобна! (Многие места также принимают карты)', 'Посетите раньше обеденного времени, чтобы избежать толпы']
    }
  },
  {
    id: 'temple-stay',
    title: '🧘‍♀️ Пребывание в храме: Проведите ночь в буддийском храме',
    category: 'Культурный опыт',
    description: 'Специальная программа для знакомства с традиционной корейской буддийской культурой',
    details: {
      locations: ['Храм Чогеса в Сеуле', 'Храм Понсынса в Янпхёне', 'Храм Колгульса в Кёнджу (доступны боевые искусства Сунмудо)'],
      program: '1 ночь 2 дня или однодневная экскурсия - Медитация, опыт храмовой еды, беседа с монахами и т.д.',
      price: 'Примерно 50,000 ~ 100,000 вон (варьируется в зависимости от храма)',
      website: 'https://www.templestay.com'
    }
  },
  {
    id: 'korean-bbq',
    title: '🍖 Корейское барбекю: Радость самостоятельного приготовления мяса!',
    category: 'Еда/Рестораны',
    description: 'Уникальная культура самостоятельного приготовления и поедания мяса',
    details: {
      areas: {
        'Хондэ': 'Молодая атмосфера, много мест с английскими меню',
        'Каннам': 'Много премиальных барбекю-ресторанов',
        'Итхэвон': 'Дружелюбно к иностранцам, доступны различные варианты мяса'
      },
      tips: ['Иногда персонал готовит мясо за вас!', 'Рекомендуем комбо ссамджан + чеснок + овощи!', 'Большинство заказов по порциям (150г) - рекомендуется для 2+ человек']
    }
  },
  {
    id: 'bibimbap',
    title: '🍲 Чонджу бибимбап: Здоровая и красочная корейская еда',
    category: 'Еда/Рестораны',
    description: 'Здоровая и красочная традиционная корейская еда',
    details: {
      restaurants: {
        'Деревня Ханок в Чонджу': 'Святая земля традиционного бибимбап',
        'Когун Мёндон': 'Аутентичный бибимбап в центре Сеула',
        'Корейские рестораны Инсадона': 'Бибимбап с традиционными гарнирами'
      },
      tips: ['Кочхуджан может быть острым, вы можете регулировать количество', 'Вегетарианский бибимбап часто доступен в меню']
    }
  },
  {
    id: 'street-food',
    title: '🧁 Корейская уличная еда ЛУЧШИЕ 3',
    category: 'Еда/Рестораны',
    description: 'Доступные и вкусные уличные закуски',
    details: {
      foods: [
        'Хоттeок: Сладкая зимняя закуска с начинкой из корицы и орехов',
        'Набор жареной еды + Ттeокбокки: Идеальное сочетание с острым соусом',
        'Пунeoппан: Выпечка в форме рыбы с начинкой из красной фасоли или крема'
      ],
      locations: ['Улица Мёндон: Различные уличные лотки', 'Рынок Кванджан: Доступная и традиционная атмосфера', 'Пешеходная улица Хондэ: Модные закуски с молодежной атмосферой'],
      price: 'Большинство между 1,000-3,000 вон'
    }
  },
  {
    id: 'subway-guide',
    title: '🚇 Полное руководство по корейскому метро',
    category: 'Транспорт',
    description: 'Как пользоваться быстрой, доступной и дружелюбной к иностранцам системой метро',
    details: {
      howto: 'Купить карту T-money → Пополнить → Приложить и использовать',
      price: 'Базовый тариф: Примерно 1,400-1,500 вон',
      apps: ['Kakao Metro: Схемы линий и информация о пересадках', 'NAVER Map / Kakao Map: Маршруты в реальном времени'],
      tips: ['Двери поезда закрываются автоматически, быстро садитесь!', 'Соблюдайте тишину в поездах! Избегайте телефонных звонков из вежливости']
    }
  },
  {
    id: 'airport-transport',
    title: '🚌 Аэропорт в центр города: Лимузин аэропорта или AREX?',
    category: 'Транспорт',
    description: 'Как добраться из международного аэропорта Инчхон в центр Сеула',
    details: {
      options: [
        'Автобус-лимузин аэропорта: 16,000+ вон, 60-80 минут, остановки у отелей',
        'AREX Экспресс: 9,500 вон, 43 минуты, прямо до станции Сеул',
        'Обычный AREX: 4,750 вон, 60 минут, бюджетный вариант'
      ],
      tips: ['Покупать билеты в кассах аэропорта или автоматах', 'Оплата картой возможна / Место для багажа']
    }
  },
  {
    id: 'taxi-guide',
    title: '🚕 Использование такси и меры предосторожности',
    category: 'Транспорт',
    description: 'Как безопасно и удобно пользоваться такси в Корее',
    details: {
      basic: 'Базовый тариф: Примерно 4,800 вон (стандарт Сеула, 2км)',
      apps: ['Kakao T - Английский доступен, опция оплаты картой', 'UT - Дружелюбный к иностранцам интерфейс'],
      warnings: ['Избегайте неофициальных такси (белые частные автомобили)!', 'Всегда проверяйте, что счетчик работает в такси']
    }
  },
  {
    id: 'accommodation-tips',
    title: '🏨 5 вещей, которые следует учитывать при выборе жилья в Корее',
    category: 'Жилье/Региональная информация',
    description: 'Руководство по выбору жилья, подходящего вашему бюджету и стилю путешествия',
    details: {
      checklist: ['Расположение: Насколько близко к станциям метро?', 'Языковая поддержка: Англоговорящий персонал или система ориентации?', 'Удобства: WiFi, стиральная машина, завтрак доступен', 'Отзывы: Проверить на Google, Booking.com, Agoda'],
      types: {
        'Бизнес-отели': 'Центр города, чистые',
        'Гостевые дома': 'Доступные, возможно социальное взаимодействие',
        'Проживание в ханок': 'Возможен опыт традиционной культуры'
      },
      platforms: {
        'Сайты бронирования': 'Airbnb, Booking.com, Agoda',
        'Опыт ханок': 'Для опыта ханок koreanstay.kr также рекомендуется!'
      }
    }
  },
  {
    id: 'seoul-districts',
    title: '🗺️ Руководство по выбору жилья по районам Сеула',
    category: 'Жилье/Региональная информация',
    description: 'Характеристики районов Сеула и рекомендуемые целевые группы',
    details: {
      districts: {
        'Мёндон': 'Шоппинг, обмен валют, туристические достопримечательности, англоязычный - Первые посетители Сеула',
        'Хондэ': 'Молодая атмосфера, ночная жизнь, кафе-улицы - Независимые путешественники',
        'Каннам': 'Изысканная городская атмосфера, роскошное жилье, транспортный узел - Деловые поездки, средне/долгосрочное пребывание',
        'Итхэвон': 'Разнообразные международные путешественники, много иностранных ресторанов - Предпочтение иностранного сообщества',
        'Чонно/Инсадон': 'Традиционная культура, рядом с дворцами, тихая художественная атмосфера - Цели культурного опыта'
      },
      tips: ['Жилье рядом с линиями метро 2 или 4 очень удобно для путешествий!', 'Также проверьте, останавливается ли лимузин аэропорта поблизости']
    }
  },
  {
    id: 'hanok-stay',
    title: '🏠 Ночь в ханок: Опыт проживания с традицией',
    category: 'Жилье/Региональная информация',
    description: 'Непосредственный опыт корейской культуры в традиционных зданиях ханок',
    details: {
      locations: ['Деревня ханок Букчхон в Сеуле: Опыт ханок в центре города', 'Деревня ханок в Чонджу: Дом опыта ханок', 'Кёнджу/Андон: Области, где хорошо сохранены традиционная культура и ханок'],
      experience: 'Комнаты ондоль (подогрев пола), опыт чайной церемонии, опыт ханбок, традиционный завтрак предоставляется',
      price: '50,000 ~ 150,000 вон за ночь (варьируется в зависимости от удобств и расположения)',
      booking: 'Поиск "Hanok" на KoreaStay, Airbnb, Agoda и т.д.'
    }
  },
  {
    id: 'emergency-contacts',
    title: '🏥 Основные корейские контакты экстренных служб',
    category: 'Посольство/Экстренная ситуация',
    description: 'Как реагировать при внезапных несчастных случаях или болезни',
    details: {
      emergency: ['Экстренная медицина/пожар: 119（английский доступен)', 'Сообщение в полицию: 112', 'Жалобы иностранцев: 1345（многоязычная поддержка)', 'Линия помощи путешественникам: 1330（24 часа, консультация в чате KakaoTalk также доступна)'],
      tips: ['Большинство корейских центров экстренных вызовов поддерживают несколько языков, включая английский', '1330 также предоставляет консультацию в чате KakaoTalk (полезно для запросов, связанных с туризмом)']
    }
  },
  {
    id: 'embassies',
    title: '🏛️ Расположение и контакты основных посольств в Корее',
    category: 'Посольство/Экстренная ситуация',
    description: 'Контактная информация для экстренных ситуаций, таких как потеря паспорта, арест, несчастные случаи',
    details: {
      embassies: {
        'США': 'Чонно-гу Седжон-дэро 188, 02-397-4114',
        'Канада': 'Чунг-гу Чондон-гиль 21, 02-3783-6000',
        'Великобритания': 'Чонно-гу Седжон-дэро 19, 02-3210-5500',
        'Франция': 'Сочхо-гу Хёрён-ро 396, 02-3149-4300',
        'Япония': 'Чонно-гу Юльгок-ро 6, 02-765-3011'
      },
      tips: ['Поиск "[страна] embassy Seoul" на Google Maps для быстрого поиска', 'Сделать фотографии копий паспорта заранее']
    }
  },
  {
    id: 'medical-guide',
    title: '💊 Руководство по использованию больницы/аптеки во время путешествия',
    category: 'Посольство/Экстренная ситуация',
    description: 'Система здравоохранения Кореи и больницы, доступные для иностранных пациентов',
    details: {
      hospitals: ['Seoul Medical Center International Clinic: 02-2276-7000', 'Severance Hospital International Clinic: 1599-1004', 'Samsung Seoul Hospital International Clinic: 02-3410-0200'],
      pharmacy: ['Аптеки обычно имеют знаки "약(藥)"', 'Обычные лекарства от простуды, пищеварения можно купить без рецепта', 'Многие лекарства требуют рецепта врача, поэтому сначала рекомендуется посетить больницу'],
      apps: ['Поиск "аптека", "больница" на KakaoMap / NAVER Map', 'Goodoc: Проверка отзывов и местоположений больниц/аптек на английском']
    }
  }
]; 