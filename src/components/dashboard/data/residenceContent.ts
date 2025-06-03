import { FloatingBallContent } from './floatingBallsData';

// 한국어 거주 콘텐츠
export const koreanResidenceContent: FloatingBallContent[] = [
  {
    id: 'dormitory-guide',
    title: '🏫 외국인 유학생을 위한 기숙사 완벽 가이드',
    category: '주거/숙소',
    description: '한국 대학 기숙사 신청부터 생활까지 모든 것',
    details: {
      application: ['대학 홈페이지에서 온라인 신청 (보통 2~3월, 8~9월)', '선발 기준: 거리, 성적, 경제적 여건, 신청 순서', '필요 서류: 입학허가서, 여권사본, 건강진단서, 재정증명서'],
      dormitory_types: ['국제관 (외국인 전용) - 문화 교류 프로그램 다수', '일반 기숙사 (한국인과 함께) - 한국어 연습 기회', '원룸형 vs 2인실 vs 4인실 선택 가능'],
      facilities: ['침대, 책상, 옷장, 에어컨 기본 제공', '공용 세탁실, 건조실, 휴게실', '식당, 편의점, 카페 (보통 건물 내 위치)', '와이파이, 인터넷 무료 제공'],
      cost: ['학기당 80만원~150만원 (2인실 기준)', '식비 별도 (식당 이용 시 월 25만원 내외)', '보증금 10만원~30만원 (퇴실 시 반환)'],
      living_tips: ['기숙사 규칙 숙지 (금주, 금연, 외박신고 등)', '한국인 룸메이트와 소통하며 한국 문화 배우기', '기숙사 행사 적극 참여로 친구 만들기']
    }
  },
  {
    id: 'room-hunting',
    title: '🔍 원룸/오피스텔 구하는 완벽 가이드',
    category: '주거/숙소',
    description: '한국의 월세 시스템과 방 구하는 노하우',
    details: {
      housing_types: {
        '원룸': '방, 주방, 화장실이 하나의 공간 - 보통 보증금 300~1000만원, 월세 40~80만원',
        '투룸': '방 2개 + 거실 + 주방 + 화장실 - 보증금 500~2000만원, 월세 60~120만원',
        '오피스텔': '원룸 + 관리사무소, 보안 - 보증금 500~1500만원, 월세 50~100만원',
        '셰어하우스': '개인실 + 공용 공간 공유 - 보증금 50~200만원, 월세 30~60만원'
      },
      search_platforms: ['직방 앱 (가장 대중적)', '다방 앱', '네이버 부동산', '호갱노노 (실거래가 확인)', '부동산 직접 방문'],
      contract_tips: ['계약 전 현장 방문 필수', '등기부등본으로 소유자 확인', '보증보험 가입 권장', '계약서 꼼꼼히 확인 후 서명'],
      location_guide: ['대학 근처: 도보 10분 이내 (비싸지만 편리)', '지하철 1~2정거장: 교통비 고려해도 저렴', '버스 노선 확인: 대학까지 직행 버스 있는지 체크']
    }
  },
  {
    id: 'rental-contract',
    title: '📋 임대계약 체크리스트 - 사기 방지 가이드',
    category: '계약/법률',
    description: '안전한 임대계약을 위한 필수 확인사항',
    details: {
      before_contract: ['집주인 신분증 확인', '등기부등본 열람 (소유권, 근저당 확인)', '실제 거주 가능한 상태인지 점검', '주변 소음, 채광, 수압 등 체크'],
      contract_checklist: ['계약 기간 (보통 1년)', '보증금/월세 금액 및 납부일', '관리비 포함 항목 확인', '수리 및 유지보수 책임 소재', '중도 해지 조건', '보증금 반환 조건'],
      required_docs: ['임대차계약서 (인감도장 또는 서명)', '신분증 사본', '외국인등록증 사본', '보증금 입금확인서'],
      protection: ['한국토지주택공사(LH) 전월세보증보험 가입', '계약서 사본 보관', '보증금은 계좌이체로만 납부', '문제 발생 시 1372 (국민신문고) 신고'],
      red_flags: ['현금으로만 거래 요구', '계약서 작성 거부', '등기부등본 열람 거부', '터무니없이 저렴한 가격']
    }
  },
  {
    id: 'housing-support',
    title: '🏠 외국인 유학생 주거지원 프로그램',
    category: '지원/혜택',
    description: '정부 및 민간에서 제공하는 주거 지원 제도',
    details: {
      government_support: {
        'K-Housing 프로그램': '한국토지주택공사 - 외국인 유학생 전용 주택, 시세 80% 수준',
        '서울시 외국인 쉐어하우스': '서울시 - 월 30~50만원, 보증금 최소화',
        '대학 연계 주거 프로그램': '각 대학 국제처 - 할인된 가격으로 주변 원룸 제공'
      },
      private_support: ['외국인 전용 부동산 (한국어 지원)', '글로벌 쉐어하우스 업체', '대학생 주거 커뮤니티'],
      application: ['각 대학 국제처 문의', '한국토지주택공사 K-Housing 홈페이지', '서울글로벌센터 주거상담'],
      tips: ['신청 시기: 입학 3개월 전부터 가능', '대기자 명단 등록 권장', '여러 프로그램 동시 신청 가능']
    }
  },
  {
    id: 'living-essentials',
    title: '🛒 한국 생활용품 구입 가이드',
    category: '생활용품/쇼핑',
    description: '생활 필수품을 저렴하게 구입하는 방법',
    details: {
      essential_items: ['침구류 (이불, 베개, 침대시트)', '주방용품 (냄비, 프라이팬, 식기)', '생활용품 (세제, 샴푸, 휴지)', '가전제품 (냉장고, 세탁기, 전자레인지)'],
      shopping_places: {
        '다이소': '1000원~5000원 생활용품 - 전국 어디서나',
        '이마트/홈플러스': '대형마트 - 한 번에 대량 구매',
        '당근마켓': '중고 거래 앱 - 가전제품 저렴하게',
        '쿠팡': '온라인 배송 - 무거운 물건 집까지 배송',
        '이케아': '가구 - 조립식이지만 저렴하고 디자인 좋음'
      },
      money_saving_tips: ['입주 전 필요한 물건 리스트 작성', '중고 거래 적극 활용 (특히 가전제품)', '계절 할인 시기 노리기 (여름/겨울 가전)', '대형마트 특가일 이용', '친구들과 공동구매'],
      delivery_info: ['쿠팡: 다음날 배송, 무료배송 조건 확인', '이마트몰: 당일배송 지역 확인', '배송 시 부재중일 때 택배함 이용법']
    }
  },
  {
    id: 'neighborhood-guide',
    title: '🗺️ 지역별 생활환경 가이드 (서울 중심)',
    category: '지역정보',
    description: '대학가별 특징과 생활비 비교',
    details: {
      university_areas: {
        '신촌/홍대 (연세대, 서강대)': '젊은 문화, 밤늦게까지 활기 - 원룸 월세 60~100만원',
        '강남 (한양대, 숭실대 근처)': '교통 편리, 비싸지만 시설 좋음 - 월세 80~150만원',
        '성북구 (고려대, 성균관대)': '조용한 주거지, 상대적으로 저렴 - 월세 50~80만원',
        '마포구 (홍익대)': '예술 문화, 외국인 많음 - 월세 60~90만원'
      },
      facilities_check: ['지하철역 도보 거리', '편의점, 마트 접근성', '병원, 약국 위치', '은행, 우체국 위치', '24시간 시설 (PC방, 코인세탁소 등)'],
      safety_tips: ['밤늦은 시간 골목길 피하기', 'CCTV 많은 지역 선호', '경찰서, 파출소 위치 파악', '1인 거주 시 1층보다 2층 이상'],
      transportation: ['지하철 노선도 숙지', '버스 앱 다운로드 (버스타고, 지하철 지도)', '자전거 도로 확인 (씽씽)', 'T-money 카드 구입 방법']
    }
  },
  {
    id: 'foreigner-housing',
    title: '🌍 외국인 전용 주거 서비스',
    category: '주거/숙소',
    description: '언어 장벽 없는 외국인 친화적 주거 솔루션',
    details: {
      global_sharehouses: {
        'BORDERLESS HOUSE': '한국인-외국인 함께 거주, 언어교환 - 월 40~70만원',
        'ZZIM HOUSE': '외국인 전용 쉐어하우스 - 월 35~60만원',
        'WJ STAY': '단기/장기 모두 가능 - 월 50~80만원'
      },
      services_included: ['영어/중국어/일본어 상담 지원', '가구 완전 구비', '인터넷, 공과금 포함', '24시간 관리사무소', '국제 커뮤니티 프로그램'],
      pros_cons: {
        '장점': '언어 소통 편리, 친구 만들기 쉬움, 복잡한 계약 절차 없음',
        '단점': '일반 원룸보다 비쌈, 프라이버시 제한, 하우스 룰 준수 필요'
      },
      application_process: ['온라인 신청서 작성', '화상 인터뷰 (한국어/영어)', '계약금 납부', '입주일 조정'],
      tips: ['계약 기간 유연하게 조정 가능한지 확인', '하우스 투어 신청해서 미리 분위기 파악', '다른 거주자들 국적 비율 문의']
    }
  },
  {
    id: 'deposit-system',
    title: '💰 한국 전월세 시스템 완벽 이해',
    category: '계약/법률',
    description: '전세, 월세, 보증금 시스템의 모든 것',
    details: {
      types_explained: {
        '전세': '보증금만 내고 월세 없음 (보통 집값의 70~80%) - 2년 계약',
        '월세': '보증금 + 매월 월세 납부 - 1년 계약',
        '반전세': '전세보다 적은 보증금 + 월세 조금 - 1~2년 계약'
      },
      deposit_calculation: ['보증금이 높을수록 월세는 낮아짐', '보증금 1000만원 ≈ 월세 10~15만원', '은행 이자율에 따라 변동'],
      payment_schedule: ['계약 시: 계약금 (보증금의 10%)', '잔금: 입주일에 나머지 보증금', '월세: 매월 정해진 날짜 (보통 말일 또는 5일)'],
      return_conditions: ['정상 퇴실 시 보증금 전액 반환', '손상 시 수리비 차감', '청소비 별도 (20~30만원)', '반환 기간: 퇴실 후 1주일 이내'],
      negotiation_tips: ['보증금 올리고 월세 내리기 협상', '관리비 포함 여부 확인', '입주일 조정으로 할인 받기', '장기 계약 시 할인 요청']
    }
  },
  {
    id: 'address-registration',
    title: '📮 전입신고 및 주소 등록 완벽 가이드',
    category: '행정절차',
    description: '한국 거주를 위한 필수 행정 절차',
    details: {
      address_registration: ['입주 후 30일 이내 주민센터 방문', '필요 서류: 임대차계약서, 외국인등록증, 여권', '신분증 주소 변경도 함께 신청'],
      procedures: ['주민센터 민원실 방문', '전입신고서 작성', '담당 공무원에게 서류 제출', '외국인등록증 주소 변경 (즉시 가능)', '새 주소 확인서 발급 (필요시)'],
      benefits: ['은행, 휴대폰, 인터넷 가입 시 주소 증명', '택배, 우편물 정상 수령', '각종 할인 혜택 (지역 주민 대상)', '응급상황 시 신속한 대응'],
      online_services: ['정부24 앱에서 주소 변경 내역 확인', '전자 주민등록등본 발급', '우편물 주소 변경 서비스 이용'],
      tips: ['이사 전에 미리 주민센터 위치 확인', '공과금 (전기, 가스, 수도) 명의 변경도 함께', '인터넷 쇼핑몰 주소 일괄 변경', '은행 주소 변경 (온라인 또는 영업점)']
    }
  },
  {
    id: 'living-costs',
    title: '💸 한국 생활비 절약 꿀팁',
    category: '생활비/절약',
    description: '유학생을 위한 실용적인 돈 절약 방법',
    details: {
      monthly_budget: {
        '식비': '20~30만원 (자취 시), 40~50만원 (외식 위주)',
        '교통비': '5~8만원 (대중교통 정기권)',
        '통신비': '3~5만원 (휴대폰 요금제)',
        '생활용품': '5~10만원',
        '여가비': '10~20만원'
      },
      food_saving: ['학교 식당 이용 (한 끼 3000~5000원)', '편의점 도시락 할인시간 (밤 10시 이후)', '마트 특가일 이용 (대형마트 격주 화요일)', '쿠팡이츠, 배달의민족 쿠폰 활용', '집에서 요리하기 (재료비 절약)'],
      shopping_tips: ['당근마켓 중고 거래', '인터넷 쇼핑몰 적립금 활용', '신용카드 할인 혜택 확인', '대량 구매 시 친구들과 나눠서', '계절 세일 시기 노리기'],
      utility_bills: ['에너지 절약 (전기, 가스료 절약)', '인터넷 결합상품 이용', '휴대폰 요금제 비교 후 선택', '은행 수수료 없는 계좌 이용'],
      student_discounts: ['대학생 할인 (영화관, 카페, 교통)', '청년 할인 정책 활용', '외국인 관광 할인 (일부 지역)', '학생증 제시로 받는 혜택들']
    }
  },
  {
    id: 'emergency-guide',
    title: '🚨 응급상황 대처법 및 비상연락처',
    category: '안전/응급',
    description: '한국에서 응급상황 발생 시 대처 방법',
    details: {
      emergency_numbers: ['119: 화재, 응급의료', '112: 경찰 신고', '1339: 응급의료정보센터', '1330: 관광 통역 핫라인 (외국인 전용)', '1350: 고용노동부 (다국어 지원)'],
      medical_emergency: ['119 신고 시 주소 정확히 전달', '외국인등록증 지참', '보험카드 확인', '응급실 이용 시 본인부담금 있음', '통역 서비스 요청 가능'],
      natural_disasters: {
        '지진': '머리 보호, 책상 아래 대피, 문 열어두기',
        '태풍': '외출 자제, 창문 테이프 붙이기, 비상용품 준비',
        '폭우': '지하철, 지하차도 피하기, 산사태 위험지역 주의'
      },
      crime_prevention: ['밤늦은 시간 혼자 다니기 피하기', '값비싼 물건 노출 주의', '문 잠금 철저히', '이상한 사람 따라오면 사람 많은 곳으로', '신용카드 분실 시 즉시 정지'],
      insurance_info: ['국민건강보험 가입 필수', '유학생보험 추가 가입 권장', '보험 혜택 범위 미리 확인', '병원 이용 시 보험카드 지참'],
      embassy_contacts: ['자국 대사관 연락처 저장', '영사 서비스 이용법', '여권 분실 시 대사관 신고', '장기 체류 신고']
    }
  },
  {
    id: 'living-etiquette',
    title: '🤝 한국 생활 규칙 및 매너',
    category: '문화/매너',
    description: '한국에서 지켜야 할 생활 예절과 문화',
    details: {
      apartment_rules: ['밤 10시 이후 소음 주의 (TV, 음악, 발걸음)', '쓰레기 분리수거 철저히', '공용 공간 사용 후 정리', '엘리베이터에서 윗사람께 인사', '주차 규칙 준수'],
      noise_etiquette: ['밤늦은 시간 전화 통화 자제', '문 열고 닫을 때 조심스럽게', '드라이어, 세탁기 사용 시간 고려', '신발 신고 실내 돌아다니지 않기'],
      garbage_disposal: {
        '일반쓰레기': '흰색 종량제 봉투 (주 2-3회 수거)',
        '재활용품': '분리수거 - 플라스틱, 유리, 종이, 캔',
        '음식물쓰레기': '노란색 봉투 또는 전용 용기',
        '대형폐기물': '사전 신고 후 스티커 구입'
      },
      neighbor_relations: ['이사 인사 (떡 돌리기 문화)', '층간소음 주의', '공동 현관문 뒤로 사람 있는지 확인', '택배 대신 받아주기', '어려운 일 있을 때 도움 요청'],
      public_spaces: ['지하철에서 노약자석 양보', '대중교통에서 큰 소리로 통화 금지', '길에서 흡연 시 주의', '음식점에서 잔반 남기지 않기', '공공장소에서 쓰레기 함부로 버리지 않기'],
      cultural_tips: ['어른께 두 손으로 물건 주고받기', '술자리 문화 이해하기', '나이/서열 문화 이해', '집들이 문화 (새 집에 화장지, 세제 선물)', '명절 연휴 이해 (설날, 추석)']
    }
  }
];

// 영어 거주 콘텐츠
export const englishResidenceContent: FloatingBallContent[] = [
  {
    id: 'dormitory-guide',
    title: '🏫 Complete Dormitory Guide for International Students',
    category: 'Housing/Accommodation',
    description: 'Everything from Korean university dormitory application to living',
    details: {
      application: ['Online application through university website (usually Feb-Mar, Aug-Sep)', 'Selection criteria: distance, grades, financial condition, application order', 'Required documents: admission letter, passport copy, health certificate, financial statement'],
      dormitory_types: ['International house (foreigners only) - many cultural exchange programs', 'General dormitory (with Koreans) - Korean language practice opportunities', 'Studio vs 2-person vs 4-person room options available'],
      facilities: ['Bed, desk, wardrobe, air conditioning provided as standard', 'Shared laundry room, drying room, lounge', 'Cafeteria, convenience store, cafe (usually located within building)', 'WiFi, internet provided free'],
      cost: ['80-150 thousand won per semester (2-person room basis)', 'Food expenses separate (around 250 thousand won monthly if using cafeteria)', 'Deposit 10-30 thousand won (returned upon move-out)'],
      living_tips: ['Learn dormitory rules (no alcohol, no smoking, overnight stay reports, etc.)', 'Communicate with Korean roommates to learn Korean culture', 'Actively participate in dormitory events to make friends']
    }
  },
  {
    id: 'room-hunting',
    title: '🔍 Complete Guide to Finding Studio/Officetel',
    category: 'Housing/Accommodation',
    description: 'Korea\'s monthly rent system and room hunting know-how',
    details: {
      housing_types: {
        'Studio (One-room)': 'Room, kitchen, bathroom in one space - usually deposit 3-10 million won, monthly rent 400-800 thousand won',
        'Two-room': '2 rooms + living room + kitchen + bathroom - deposit 5-20 million won, monthly rent 600-1200 thousand won',
        'Officetel': 'Studio + management office, security - deposit 5-15 million won, monthly rent 500-1000 thousand won',
        'Share house': 'Private room + shared common space - deposit 500 thousand-2 million won, monthly rent 300-600 thousand won'
      },
      search_platforms: ['Zigbang app (most popular)', 'Dabang app', 'Naver Real Estate', 'Hogangnono (actual transaction price check)', 'Direct real estate office visit'],
      contract_tips: ['Site visit essential before contract', 'Check owner with property register', 'Deposit insurance recommended', 'Carefully review contract before signing'],
      location_guide: ['Near university: within 10 minutes walk (expensive but convenient)', 'Subway 1-2 stations: cheap considering transportation costs', 'Bus route check: verify direct bus to university']
    }
  },
  {
    id: 'rental-contract',
    title: '📋 Rental Contract Checklist - Fraud Prevention Guide',
    category: 'Contract/Legal',
    description: 'Essential checkpoints for safe rental contracts',
    details: {
      before_contract: ['Verify landlord\'s ID', 'Property register review (ownership, mortgage check)', 'Check if actually habitable condition', 'Check surrounding noise, lighting, water pressure'],
      contract_checklist: ['Contract period (usually 1 year)', 'Deposit/monthly rent amount and payment date', 'Check management fee inclusions', 'Repair and maintenance responsibility', 'Early termination conditions', 'Deposit return conditions'],
      required_docs: ['Rental contract (seal or signature)', 'ID copy', 'Alien registration card copy', 'Deposit transfer confirmation'],
      protection: ['Korea Land & Housing Corporation (LH) jeonse guarantee insurance', 'Keep contract copy', 'Pay deposit only by bank transfer', 'Report to 1372 (National Complaint Center) if problems occur'],
      red_flags: ['Demanding cash-only transactions', 'Refusing to write contract', 'Refusing property register review', 'Unreasonably cheap price']
    }
  },
  {
    id: 'housing-support',
    title: '🏠 Housing Support Programs for International Students',
    category: 'Support/Benefits',
    description: 'Housing support systems provided by government and private sector',
    details: {
      government_support: {
        'K-Housing Program': 'Korea Land & Housing Corporation - housing exclusively for international students, 80% of market price',
        'Seoul Foreign Share House': 'Seoul City - 300-500 thousand won monthly, minimized deposit',
        'University-linked Housing Program': 'Each university international affairs - nearby studios at discounted prices'
      },
      private_support: ['Real estate agencies for foreigners (Korean language support)', 'Global share house companies', 'University student housing communities'],
      application: ['Contact each university international affairs office', 'Korea Land & Housing Corporation K-Housing website', 'Seoul Global Center housing consultation'],
      tips: ['Application timing: possible from 3 months before enrollment', 'Waiting list registration recommended', 'Multiple program applications possible']
    }
  },
  {
    id: 'living-essentials',
    title: '🛒 Korean Living Essentials Shopping Guide',
    category: 'Living Goods/Shopping',
    description: 'How to buy daily necessities at affordable prices',
    details: {
      essential_items: ['Bedding (blanket, pillow, bed sheets)', 'Kitchen items (pots, pans, dishes)', 'Living supplies (detergent, shampoo, tissue)', 'Appliances (refrigerator, washing machine, microwave)'],
      shopping_places: {
        'Daiso': '1000-5000 won living goods - available nationwide',
        'E-Mart/Home Plus': 'Large supermarkets - bulk purchasing at once',
        'Carrot Market': 'Second-hand trading app - appliances at low prices',
        'Coupang': 'Online delivery - heavy items delivered to home',
        'IKEA': 'Furniture - assembly required but cheap and good design'
      },
      money_saving_tips: ['Create list of needed items before moving in', 'Actively use second-hand trading (especially appliances)', 'Target seasonal discount periods (summer/winter appliances)', 'Use large supermarket special sale days', 'Group buying with friends'],
      delivery_info: ['Coupang: next-day delivery, check free shipping conditions', 'E-Mart Mall: check same-day delivery areas', 'How to use delivery boxes when absent during delivery']
    }
  },
  {
    id: 'neighborhood-guide',
    title: '🗺️ Regional Living Environment Guide (Seoul Focus)',
    category: 'Regional Information',
    description: 'University area characteristics and living cost comparison',
    details: {
      university_areas: {
        'Sinchon/Hongdae (Yonsei, Sogang)': 'Young culture, lively until late night - studio monthly rent 600-1000 thousand won',
        'Gangnam (near Hanyang, Soongsil)': 'Convenient transportation, expensive but good facilities - monthly rent 800-1500 thousand won',
        'Seongbuk-gu (Korea, Sungkyunkwan)': 'Quiet residential area, relatively affordable - monthly rent 500-800 thousand won',
        'Mapo-gu (Hongik)': 'Arts culture, many foreigners - monthly rent 600-900 thousand won'
      },
      facilities_check: ['Walking distance to subway station', 'Convenience store, supermarket accessibility', 'Hospital, pharmacy location', 'Bank, post office location', '24-hour facilities (PC rooms, coin laundromats, etc.)'],
      safety_tips: ['Avoid alleyways late at night', 'Prefer areas with many CCTVs', 'Know police station, police box locations', 'For single living, prefer 2nd floor or higher over 1st floor'],
      transportation: ['Learn subway route map', 'Download bus apps (Bus Tago, Subway Map)', 'Check bicycle roads (Ttareungyi)', 'How to buy T-money card']
    }
  },
  {
    id: 'foreigner-housing',
    title: '🌍 Foreigner-Exclusive Housing Services',
    category: 'Housing/Accommodation',
    description: 'Foreigner-friendly housing solutions without language barriers',
    details: {
      global_sharehouses: {
        'BORDERLESS HOUSE': 'Koreans-foreigners living together, language exchange - 400-700 thousand won monthly',
        'ZZIM HOUSE': 'Foreigner-exclusive share house - 350-600 thousand won monthly',
        'WJ STAY': 'Both short-term/long-term possible - 500-800 thousand won monthly'
      },
      services_included: ['English/Chinese/Japanese consultation support', 'Fully furnished', 'Internet, utilities included', '24-hour management office', 'International community programs'],
      pros_cons: {
        'Pros': 'Easy language communication, easy to make friends, no complex contract procedures',
        'Cons': 'More expensive than regular studios, privacy limitations, must follow house rules'
      },
      application_process: ['Fill out online application', 'Video interview (Korean/English)', 'Pay contract money', 'Adjust move-in date'],
      tips: ['Check if contract period can be flexibly adjusted', 'Apply for house tour to understand atmosphere in advance', 'Ask about nationality ratio of other residents']
    }
  },
  {
    id: 'deposit-system',
    title: '💰 Complete Understanding of Korean Jeonse/Monthly Rent System',
    category: 'Contract/Legal',
    description: 'Everything about jeonse, monthly rent, and deposit systems',
    details: {
      types_explained: {
        'Jeonse': 'Only deposit, no monthly rent (usually 70-80% of house price) - 2-year contract',
        'Monthly rent': 'Deposit + monthly rent payment - 1-year contract',
        'Semi-jeonse': 'Less deposit than jeonse + small monthly rent - 1~2 year contract'
      },
      deposit_calculation: ['Higher deposit means lower monthly rent', 'Deposit 10 million won ≈ monthly rent 100-150 thousand won', 'Varies according to bank interest rates'],
      payment_schedule: ['At contract: contract money (10% of deposit)', 'Balance: remaining deposit on move-in day', 'Monthly rent: every month on set date (usually end of month or 5th)'],
      return_conditions: ['Full deposit return upon normal move-out', 'Repair costs deducted if damaged', 'Cleaning fee separate (200-300 thousand won)', 'Return period: within 1 week after move-out'],
      negotiation_tips: ['Negotiate raising deposit to lower monthly rent', 'Check if management fee included', 'Get discount by adjusting move-in date', 'Request discount for long-term contract']
    }
  },
  {
    id: 'address-registration',
    title: '📮 Complete Guide to Address Registration and Moving Report',
    category: 'Administrative Procedures',
    description: 'Essential administrative procedures for residing in Korea',
    details: {
      address_registration: ['Visit community center within 30 days after moving in', 'Required documents: rental contract, alien registration card, passport', 'Also apply for ID address change'],
      procedures: ['Visit community center civil affairs office', 'Fill out moving report form', 'Submit documents to officer in charge', 'Alien registration card address change (immediately available)', 'Issue new address certificate (if needed)'],
      benefits: ['Address proof for bank, mobile phone, internet registration', 'Normal receipt of packages, mail', 'Various discount benefits (for local residents)', 'Quick response in emergency situations'],
      online_services: ['Check address change history on Government24 app', 'Issue electronic resident registration copy', 'Use mail address change service'],
      tips: ['Check community center location before moving', 'Also change utility bills (electricity, gas, water) name', 'Batch change online shopping mall addresses', 'Bank address change (online or branch)']
    }
  },
  {
    id: 'living-costs',
    title: '💸 Korean Living Cost Saving Tips',
    category: 'Living Costs/Saving',
    description: 'Practical money-saving methods for students',
    details: {
      monthly_budget: {
        'Food expenses': '200-300 thousand won (self-cooking), 400-500 thousand won (eating out mainly)',
        'Transportation': '50-80 thousand won (public transport pass)',
        'Communication': '30-50 thousand won (mobile phone plan)',
        'Living supplies': '50-100 thousand won',
        'Entertainment': '100-200 thousand won'
      },
      food_saving: ['Use school cafeteria (3000-5000 won per meal)', 'Convenience store lunch box discount time (after 10 PM)', 'Use supermarket special days (large supermarket biweekly Tuesday)', 'Use Coupang Eats, Baedal Minjok coupons', 'Cook at home (save on ingredients)'],
      shopping_tips: ['Carrot Market second-hand trading', 'Use online shopping mall points', 'Check credit card discount benefits', 'Share with friends for bulk purchases', 'Target seasonal sale periods'],
      utility_bills: ['Energy saving (electricity, gas bill saving)', 'Use internet bundle products', 'Compare mobile phone plans before choosing', 'Use bank accounts without fees'],
      student_discounts: ['University student discounts (cinema, cafe, transportation)', 'Use youth discount policies', 'Foreigner tourism discounts (some areas)', 'Benefits received by showing student ID']
    }
  },
  {
    id: 'emergency-guide',
    title: '🚨 Emergency Response and Emergency Contacts',
    category: 'Safety/Emergency',
    description: 'How to respond when emergencies occur in Korea',
    details: {
      emergency_numbers: ['119: Fire, emergency medical', '112: Police report', '1339: Emergency medical information center', '1330: Tourism interpretation hotline (foreigner exclusive)', '1350: Ministry of Employment and Labor (multilingual support)'],
      medical_emergency: ['Accurately convey address when calling 119', 'Bring alien registration card', 'Check insurance card', 'Personal expenses exist when using emergency room', 'Translation service request possible'],
      natural_disasters: {
        'Earthquake': 'Protect head, evacuate under desk, keep doors open',
        'Typhoon': 'Refrain from going out, tape windows, prepare emergency supplies',
        'Heavy rain': 'Avoid subway, underpasses, be careful of landslide risk areas'
      },
      crime_prevention: ['Avoid walking alone late at night', 'Be careful about exposing expensive items', 'Lock doors thoroughly', 'Go to crowded places if strange person following', 'Immediately stop credit card if lost'],
      insurance_info: ['National health insurance registration essential', 'Additional student insurance registration recommended', 'Check insurance benefit scope in advance', 'Bring insurance card when using hospital'],
      embassy_contacts: ['Save home country embassy contact', 'How to use consular services', 'Report to embassy if passport lost', 'Long-term stay report']
    }
  },
  {
    id: 'living-etiquette',
    title: '🤝 Korean Living Rules and Manners',
    category: 'Culture/Manners',
    description: 'Living etiquette and culture to follow in Korea',
    details: {
      apartment_rules: ['Be careful of noise after 10 PM (TV, music, footsteps)', 'Thorough waste separation', 'Clean up after using common spaces', 'Greet elders in elevator', 'Follow parking rules'],
      noise_etiquette: ['Refrain from phone calls late at night', 'Be careful when opening and closing doors', 'Consider time when using hair dryer, washing machine', 'Don\'t walk around indoors wearing shoes'],
      garbage_disposal: {
        'General waste': 'White volume-based bags (collected 2-3 times per week)',
        'Recyclables': 'Separate collection - plastic, glass, paper, cans',
        'Food waste': 'Yellow bags or dedicated containers',
        'Large waste': 'Pre-report and buy stickers'
      },
      neighbor_relations: ['Moving greetings (rice cake sharing culture)', 'Be careful of inter-floor noise', 'Check if people behind when using main entrance', 'Help receive packages for others', 'Ask for help when in trouble'],
      public_spaces: ['Yield priority seats to elderly/weak on subway', 'No loud phone calls on public transport', 'Be careful when smoking on streets', 'Don\'t leave food at restaurants', 'Don\'t litter in public places'],
      cultural_tips: ['Give and receive items with both hands to elders', 'Understand drinking culture', 'Understand age/hierarchy culture', 'Housewarming culture (gift toilet paper, detergent to new home)', 'Understand holiday breaks (New Year, Chuseok)']
    }
  }
];

// 일본어 거주 콘텐츠
export const japaneseResidenceContent: FloatingBallContent[] = [
  {
    id: 'dormitory-guide',
    title: '🏫 外国人留学生のための寮完全ガイド',
    category: '住居/宿泊',
    description: '韓国大学寮申請から生活まですべて',
    details: {
      application: ['大学ホームページでオンライン申請（通常2~3月、8~9月）', '選考基準：距離、成績、経済的事情、申請順序', '必要書類：入学許可書、パスポートコピー、健康診断書、財政証明書'],
      dormitory_types: ['国際館（外国人専用）- 文化交流プログラム多数', '一般寮（韓国人と一緒）- 韓国語練習機会', 'ワンルーム型 vs 2人室 vs 4人室選択可能'],
      facilities: ['ベッド、机、クローゼット、エアコン基本提供', '共用洗濯室、乾燥室、休憩室', '食堂、コンビニ、カフェ（通常建物内位置）', 'WiFi、インターネット無料提供'],
      cost: ['学期当たり80万ウォン~150万ウォン（2人室基準）', '食費別途（食堂利用時月25万ウォン前後）', '保証金10万ウォン~30万ウォン（退室時返還）'],
      living_tips: ['寮規則熟知（禁酒、禁煙、外泊届出など）', '韓国人ルームメイトとコミュニケーションして韓国文化学習', '寮行事積極参加で友達作り']
    }
  },
  {
    id: 'room-hunting',
    title: '🔍 ワンルーム/オフィステル探し完全ガイド',
    category: '住居/宿泊',
    description: '韓国の月家賃システムと部屋探しのノウハウ',
    details: {
      housing_types: {
        'ワンルーム': '部屋、キッチン、トイレが一つの空間 - 通常保証金300~1000万ウォン、月家賃40~80万ウォン',
        'ツールーム': '部屋2つ + リビング + キッチン + トイレ - 保証金500~2000万ウォン、月家賃60~120万ウォン',
        'オフィステル': 'ワンルーム + 管理事務所、セキュリティ - 保証金500~1500万ウォン、月家賃50~100万ウォン',
        'シェアハウス': '個人室 + 共用空間共有 - 保証金50~200万ウォン、月家賃30~60万ウォン'
      },
      search_platforms: ['チッパンアプリ（最も大衆的）', 'ダバンアプリ', 'ネイバー不動産', 'ホガンノノ（実取引価格確認）', '不動産直接訪問'],
      contract_tips: ['契約前現場訪問必須', '登記簿謄本で所有者確認', '保証保険加入推奨', '契約書詳細確認後署名'],
      location_guide: ['大学近く：徒歩10分以内（高いが便利）', '地下鉄1~2駅：交通費考慮しても安い', 'バス路線確認：大学まで直行バスあるかチェック']
    }
  },
  {
    id: 'rental-contract',
    title: '📋 賃貸契約チェックリスト - 詐欺防止ガイド',
    category: '契約/法律',
    description: '安全な賃貸契約のための必須確認事項',
    details: {
      before_contract: ['家主身分証確認', '登記簿謄本閲覧（所有権、根抵当権確認）', '実際居住可能な状態か点検', '周辺騒音、採光、水圧等チェック'],
      contract_checklist: ['契約期間（通常1年）', '保証金/月家賃金額及び納付日', '管理費含む項目確認', '修理及び維持保守責任所在', '中途解約条件', '保証金返還条件'],
      required_docs: ['賃貸借契約書（印鑑印章又は署名）', '身分証コピー', '外国人登録証コピー', '保証金入金確認書'],
      protection: ['韓国土地住宅公社(LH)全月貰保証保険加入', '契約書コピー保管', '保証金は口座振替でのみ納付', '問題発生時1372（国民申聞報）申告'],
      red_flags: ['現金でのみ取引要求', '契約書作成拒否', '登記簿謄本閲覧拒否', 'とんでもなく安い価格']
    }
  },
  {
    id: 'housing-support',
    title: '🏠 外国人留学生住居支援プログラム',
    category: '支援/恩恵',
    description: '政府及び民間で提供する住居支援制度',
    details: {
      government_support: {
        'K-Housingプログラム': '韓国土地住宅公社 - 外国人留学生専用住宅、時価80%水準',
        'ソウル市外国人シェアハウス': 'ソウル市 - 月30~50万ウォン、保証金最小化',
        '大学連携住居プログラム': '各大学国際処 - 割引価格で周辺ワンルーム提供'
      },
      private_support: ['外国人専用不動産（韓国語支援）', 'グローバルシェアハウス業者', '大学生住居コミュニティ'],
      application: ['各大学国際処問い合わせ', '韓国土地住宅公社K-Housingホームページ', 'ソウルグローバルセンター住居相談'],
      tips: ['申請時期：入学3ヶ月前から可能', '待機者名簿登録推奨', '複数プログラム同時申請可能']
    }
  },
  {
    id: 'living-essentials',
    title: '🛒 韓国生活用品購入ガイド',
    category: '生活用品/ショッピング',
    description: '生活必需品を安く購入する方法',
    details: {
      essential_items: ['寝具類（布団、枕、ベッドシーツ）', 'キッチン用品（鍋、フライパン、食器）', '生活用品（洗剤、シャンプー、ティッシュ）', '家電製品（冷蔵庫、洗濯機、電子レンジ）'],
      shopping_places: {
        'ダイソー': '1000ウォン~5000ウォン生活用品 - 全国どこでも',
        'イーマート/ホームプラス': '大型マート - 一度に大量購入',
        'ニンジン市場': '中古取引アプリ - 家電製品安く',
        'クーパン': 'オンライン配送 - 重い物も家まで配送',
        'イケア': '家具 - 組み立て式だが安くてデザイン良い'
      },
      money_saving_tips: ['入居前必要な物リスト作成', '中古取引積極活用（特に家電製品）', '季節割引時期狙う（夏/冬家電）', '大型マート特価日利用', '友達と共同購入'],
      delivery_info: ['クーパン：翌日配送、無料配送条件確認', 'イーマートモール：当日配送地域確認', '配送時不在時宅配ボックス利用法']
    }
  },
  {
    id: 'neighborhood-guide',
    title: '🗺️ 地域別生活環境ガイド（ソウル中心）',
    category: '地域情報',
    description: '大学街別特徴と生活費比較',
    details: {
      university_areas: {
        '新村/弘大（延世大、西江大）': '若い文化、夜遅くまで活気 - ワンルーム月家賃60~100万ウォン',
        '江南（漢陽大、崇実大近く）': '交通便利、高いが施設良い - 月家賃80~150万ウォン',
        '城北区（高麗大、成均館大）': '静かな住宅地、相対的に安い - 月家賃50~80万ウォン',
        '麻浦区（弘益大）': '芸術文化、外国人多い - 月家賃60~90万ウォン'
      },
      facilities_check: ['地下鉄駅徒歩距離', 'コンビニ、マートアクセス', '病院、薬局位置', '銀行、郵便局位置', '24時間施設（PCルーム、コインランドリー等）'],
      safety_tips: ['夜遅い時間路地避ける', 'CCTV多い地域選好', '警察署、派出所位置把握', '一人居住時1階より2階以上'],
      transportation: ['地下鉄路線図熟知', 'バスアプリダウンロード（バスタゴ、地下鉄地図）', '自転車道路確認（ッタルンイ）', 'T-moneyカード購入方法']
    }
  },
  {
    id: 'foreigner-housing',
    title: '🌍 外国人専用住居サービス',
    category: '住居/宿泊',
    description: '言語障壁のない外国人親和的住居ソリューション',
    details: {
      global_sharehouses: {
        'BORDERLESS HOUSE': '韓国人-外国人一緒居住、言語交換 - 月40~70万ウォン',
        'ZZIM HOUSE': '外国人専用シェアハウス - 月35~60万ウォン',
        'WJ STAY': '短期/長期両方可能 - 月50~80万ウォン'
      },
      services_included: ['英語/中国語/日本語相談支援', '家具完全装備', 'インターネット、公共料金込み', '24時間管理事務所', '国際コミュニティプログラム'],
      pros_cons: {
        '長所': '言語コミュニケーション便利、友達作り易い、複雑な契約手続きなし',
        '短所': '一般ワンルームより高い、プライバシー制限、ハウスルール遵守必要'
      },
      application_process: ['オンライン申請書作成', 'ビデオインタビュー（韓国語/英語）', '契約金納付', '入居日調整'],
      tips: ['契約期間柔軟に調整可能か確認', 'ハウスツアー申請して事前に雰囲気把握', '他居住者国籍比率問い合わせ']
    }
  },
  {
    id: 'deposit-system',
    title: '💰 韓国全月貰システム完全理解',
    category: '契約/法律',
    description: '全貰、月貰、保証金システムのすべて',
    details: {
      types_explained: {
        '全貰': '保証金のみで月家賃なし（通常家価格の70~80%）- 2年契約',
        '月貰': '保証金 + 毎月月家賃納付 - 1年契約',
        '半全貰': '全貰より少ない保証金 + 月家賃少し - 1~2年契約'
      },
      deposit_calculation: ['保証金高いほど月家賃は安くなる', '保証金1000万ウォン ≈ 月家賃10~15万ウォン', '銀行金利により変動'],
      payment_schedule: ['契約時：契約金（保証金の10%）', '残金：入居日に残り保証金', '月家賃：毎月決まった日付（通常月末または5日）'],
      return_conditions: ['正常退室時保証金全額返還', '損傷時修理費差引', '清掃費別途（20~30万ウォン）', '返還期間：退室後1週間以内'],
      negotiation_tips: ['保証金上げて月家賃下げる交渉', '管理費含有可否確認', '入居日調整で割引受ける', '長期契約時割引要請']
    }
  },
  {
    id: 'address-registration',
    title: '📮 転入届及び住所登録完全ガイド',
    category: '行政手続き',
    description: '韓国居住のための必須行政手続き',
    details: {
      address_registration: ['入居後30日以内住民センター訪問', '必要書類：賃貸借契約書、外国人登録証、パスポート', '身分証住所変更も一緒申請'],
      procedures: ['住民センター民願室訪問', '転入届書作成', '担当公務員に書類提出', '外国人登録証住所変更（即時可能）', '新住所確認書発給（必要時）'],
      benefits: ['銀行、携帯電話、インターネット加入時住所証明', '宅配、郵便物正常受領', '各種割引恩恵（地域住民対象）', '緊急状況時迅速対応'],
      online_services: ['政府24アプリで住所変更内訳確認', '電子住民登録謄本発給', '郵便物住所変更サービス利用'],
      tips: ['引越し前事前に住民センター位置確認', '公共料金（電気、ガス、水道）名義変更も一緒', 'インターネットショッピングモール住所一括変更', '銀行住所変更（オンラインまたは営業店）']
    }
  },
  {
    id: 'living-costs',
    title: '💸 韓国生活費節約꿀팁',
    category: '生活費/節約',
    description: '留学生のための実用的お金節約方法',
    details: {
      monthly_budget: {
        '食費': '200-300 thousand won (self-cooking), 400-500 thousand won (eating out mainly)',
        '交通費': '50-80 thousand won (public transport pass)',
        '通信費': '30-50 thousand won (mobile phone plan)',
        '生活用品': '50-100 thousand won',
        '余暇費': '100-200 thousand won'
      },
      food_saving: ['学校食堂利用（一食3000~5000ウォン）', 'コンビニ弁当割引時間（夜10時以降）', 'マート特価日利用（大型マート隔週火曜日）', 'クーパンイーツ、配達の民族クーポン活用', '家で料理（材料費節約）'],
      shopping_tips: ['Carrot Market second-hand trading', 'Use online shopping mall points', 'Check credit card discount benefits', 'Share with friends for bulk purchases', 'Target seasonal sale periods'],
      utility_bills: ['エネルギー節約（電気、ガス料節約）', 'インターネット結合商品利用', '携帯電話料金制比較後選択', '銀行手数料ない口座利用'],
      student_discounts: ['大学生割引（映画館、カフェ、交通）', '青年割引政策活用', '外国人観光割引（一部地域）', '学生証提示で受ける恩恵']
    }
  },
  {
    id: 'emergency-guide',
    title: '🚨 緊急状況対処法及び非常連絡先',
    category: '安全/緊急',
    description: '韓国で緊急状況発生時対処方法',
    details: {
      emergency_numbers: ['119：火災、応急医療', '112：警察申告', '1339：応急医療情報センター', '1330：観光通訳ホットライン（外国人専用）', '1350：雇用労働部（多言語支援）'],
      medical_emergency: ['119申告時住所正確に伝達', '外国人登録証携帯', '保険カード確認', '応急室利用時本人負担金あり', '通訳サービス要請可能'],
      natural_disasters: {
        '地震': '頭保護、机下避難、ドア開けておく',
        '台風': '外出自制、窓テープ貼る、非常用品準備',
        '豪雨': '地下鉄、地下車道避ける、山崩れ危険地域注意'
      },
      crime_prevention: ['夜遅い時間一人で歩き回ること避ける', '高価な物露出注意', 'ドア施錠徹底', '変な人ついてきたら人多い所へ', 'クレジットカード紛失時即座停止'],
      insurance_info: ['国民健康保険加入必須', '留学生保険追加加入推奨', '保険恩恵範囲事前確認', '病院利用時保険カード携帯'],
      embassy_contacts: ['自国大使館連絡先保存', '領事サービス利用法', 'パスポート紛失時大使館申告', '長期滞在申告']
    }
  },
  {
    id: 'living-etiquette',
    title: '🤝 韓国生活規則及びマナー',
    category: '文化/マナー',
    description: '韓国で守るべき生活礼節と文化',
    details: {
      apartment_rules: ['夜10時以降騒音注意（TV、音楽、足音）', 'ゴミ分別収集徹底', '共用空間使用後整理', 'エレベーターで目上の人に挨拶', '駐車規則遵守'],
      noise_etiquette: ['夜遅い時間電話通話自制', 'ドア開閉時注意深く', 'ドライヤー、洗濯機使用時間考慮', '靴履いて室内歩き回らない'],
      garbage_disposal: {
        '一般ゴミ': '白色従量制袋（週2-3回収集）',
        'リサイクル品': '分別収集 - プラスチック、ガラス、紙、缶',
        '食べ物ゴミ': '黄色袋または専用容器',
        '大型廃棄物': '事前申告後ステッカー購入'
      },
      neighbor_relations: ['引越し挨拶（餅配り文化）', '階間騒音注意', '共同玄関ドア後ろに人いるか確認', '宅配代わり受け取り', '困った事ある時助け要請'],
      public_spaces: ['地下鉄で老弱者席譲歩', '大衆交通で大きな声で通話禁止', '道で喫煙時注意', '飲食店で残飯残さない', '公共場所でゴミ捨てない'],
      cultural_tips: ['大人に両手で物やり取り', '酒席文化理解', '年齢/序列文化理解', '家移り文化（新しい家にトイレットペーパー、洗剤プレゼント）', '祝日連休理解（設날、秋夕）']
    }
  }
];

// 중국어 거주 콘텐츠
// Chinese version (简体中文)
// ------------------------

export const chineseResidenceContent: FloatingBallContent[] = [
    {
      id: 'dormitory-guide',
      title: '🏫 外国留学生宿舍全攻略',
      category: '住宿/居所',
      description: '从申请到生活：韩国大学宿舍的一切',
      details: {
        application: [
          '在学校官网在线申请（通常在2~3月、8~9月）',
          '选拔标准：距离、成绩、经济状况、申请顺序',
          '所需材料：录取通知书、护照复印件、健康证明、财力证明'
        ],
        dormitory_types: [
          '国际馆（仅限外国人）— 文化交流项目众多',
          '普通宿舍（与韩国学生同住）— 提供韩语练习机会',
          '可选独居房、两人间或四人间'
        ],
        facilities: [
          '基本配备：床、书桌、衣柜、空调',
          '公共洗衣房、烘干室、休息室',
          '餐厅、便利店、咖啡厅（通常就在宿舍楼内）',
          '免费提供 Wi-Fi 和网络'
        ],
        cost: [
          '每学期 80万~150万韩元（以两人间为例）',
          '不含餐费（食堂用餐约每月 25 万韩元）',
          '押金 10万~30万韩元（退宿时返还）'
        ],
        living_tips: [
          '熟悉宿舍规定（禁酒、禁烟、外宿需报备等）',
          '与韩国室友多交流，学习韩国文化',
          '积极参加宿舍活动，结交朋友'
        ]
      }
    },
    {
      id: 'room-hunting',
      title: '🔍 单间/办公楼式公寓租房全攻略',
      category: '住宿/居所',
      description: '韩国月租系统和找房技巧',
      details: {
        housing_types: {
          '单间（원룸）': '居住空间与厨房、卫生间在同一间—通常押金 300万~1000万韩元，月租 40万~80万韩元',
          '两居（투룸）': '两间卧室 + 客厅 + 厨房 + 卫生间—押金 500万~2000万韩元，月租 60万~120万韩元',
          '办公楼式公寓（오피스텔）': '单间带管理处、安全—押金 500万~1500万韩元，月租 50万~100万韩元',
          '合租屋（셰어하우스）': '私人房间 + 共用空间—押金 50万~200万韩元，月租 30万~60万韩元'
        },
        search_platforms: [
          'Zigbang（직방）App（最流行）',
          'Dabang（다방）App',
          'Naver 地产（네이버 부동산）',
          'Hoobbang Nono（호갱노노，查看实交易价）',
          '实地走访房产中介'
        ],
        contract_tips: [
          '签约前务必实地查看房源',
          '查看登记簿（동기부등본）确认房主身份',
          '建议购买保证保险',
          '签约前仔细核对合同后再签字'
        ],
        location_guide: [
          '靠近大学：步行10分钟以内（租金较贵但方便）',
          '地铁1~2站：考虑交通费后更经济',
          '查看公交线路：是否有直达大学的班车'
        ]
      }
    },
    {
      id: 'rental-contract',
      title: '📋 租赁合同清单 - 防诈骗指南',
      category: '合同/法律',
      description: '保障安全租房的核心确认事项',
      details: {
        before_contract: [
          '核实房主身份证件',
          '查阅登记簿（동기부 등본）确认所有权及抵押情况',
          '检查房屋实际可居住状态',
          '检测周边噪音、采光、水压等情况'
        ],
        contract_checklist: [
          '租期（通常为1年）',
          '押金/月租金额及支付日期',
          '是否包含管理费项目',
          '维修与维护责任归属',
          '中途解约条件',
          '押金返还条件'
        ],
        required_docs: [
          '租赁合同（须有印章或签名）',
          '身份证件复印件',
          '外国人登记证复印件',
          '押金支付凭证'
        ],
        protection: [
          '建议购买国土与住居公社(LH)月租保证保险',
          '保留一份合同副本',
          '押金仅限银行转账支付',
          '发生纠纷可拨打1372（国民申告）投诉'
        ],
        red_flags: [
          '只接受现金交易',
          '拒绝签订合同',
          '不允许查阅登记簿',
          '价格远低于市场价'
        ]
      }
    },
    {
      id: 'housing-support',
      title: '🏠 外国留学生住房支持项目',
      category: '支持/福利',
      description: '政府与民间提供的住房支持制度',
      details: {
        government_support: {
          'K-Housing 项目': '韩国国土与住居公社(LH) — 面向外国留学生的专属住房，租金约为市场价80%',
          '首尔市外国人合租屋': '首尔市 — 月租 30~50 万韩元，押金最低',
          '大学合作宿舍项目': '各大学国际处 — 周边单间公寓优惠价格'
        },
        private_support: [
          '专门面向外国人的房产中介（支持多语言）',
          '国际合租屋公司',
          '大学生住宿社区'
        ],
        application: [
          '咨询各大学国际处',
          '访问 LH K-Housing 网站',
          '首尔全球中心住房咨询'
        ],
        tips: [
          '申请时间：入学前3个月即可申请',
          '建议提前加入候补名单',
          '可以同时申请多个项目'
        ]
      }
    },
    {
      id: 'living-essentials',
      title: '🛒 韩国生活必需品采购指南',
      category: '生活用品/购物',
      description: '如何以实惠价格购买生活必需品',
      details: {
        essential_items: [
          '寝具（被子、枕头、床单）',
          '厨具（锅、平底锅、餐具）',
          '生活用品（洗衣液、洗发水、卫生纸）',
          '家电（冰箱、洗衣机、微波炉）'
        ],
        shopping_places: {
          'Daiso（다이소）': '1000~5000韩元生活用品 — 全国连锁',
          'E-Mart/Homeplus': '大型超市 — 一站式批量购买',
          'Karrot 二手市场（당근마켓）': '二手家电低价交易',
          'Coupang（쿠팡）': '网购配送 — 重物送货到家',
          'IKEA（이케아）': '家具 — 虽需组装但价格实惠且设计美观'
        },
        money_saving_tips: [
          '入住前列出所需物品清单',
          '积极利用二手交易（尤其是家电）',
          '把握季节促销（夏季/冬季家电）',
          '关注大型超市特价日',
          '与朋友合伙批量购买'
        ],
        delivery_info: [
          'Coupang：次日达，查看是否满足免运费条件',
          'E-Mart Mall：同城配送，查看可达区域',
          '若不在家，可使用快递柜'
        ]
      }
    },
    {
      id: 'neighborhood-guide',
      title: '🗺️ 各地区生活环境指南（以首尔为中心）',
      category: '地区信息',
      description: '各大学周边特色及生活成本对比',
      details: {
        university_areas: {
          '新村/弘大（延世大学、西江大学）': '年轻文化浓厚，夜生活丰富 — 单间月租 60~100 万韩元',
          '江南（汉阳大学、崇实大学附近）': '交通便利，价格较高但配套优',
          '城北区（高丽大学、成均馆大学）': '生活区相对安静，租金较低 — 月租 50~80 万韩元',
          '麻浦区（弘益大学）': '艺术文化氛围浓厚，外国人多 — 月租 60~90 万韩元'
        },
        facilities_check: [
          '步行至地铁站的距离',
          '便利店、超市可达性',
          '医院、药店位置',
          '银行、邮局位置',
          '24 小时设施（网吧、投币洗衣房等）'
        ],
        safety_tips: [
          '深夜尽量避免独自走小巷',
          '选择 CCTV 多的地区',
          '熟悉附近警察局/派出所位置',
          '单身公寓优先选择 2 楼以上'
        ],
        transportation: [
          '熟悉地铁线路图',
          '下载公交 APP（Bus Tag, Subway Map 等）',
          '查看自行车道（使用骑骑等服务）',
          'T-money 卡购买方法'
        ]
      }
    },
    {
      id: 'foreigner-housing',
      title: '🌍 外国人专属住房服务',
      category: '住宿/居所',
      description: '无语言障碍的国际友好型住房解决方案',
      details: {
        global_sharehouses: {
          'BORDERLESS HOUSE': '韩籍与外籍人士混居，语言交换 — 月租 40~70 万韩元',
          'ZZIM HOUSE': '专为外国人提供的合租屋 — 月租 35~60 万韩元',
          'WJ STAY': '短租/长租皆可 — 月租 50~80 万韩元'
        },
        services_included: [
          '提供英/中/日等语言咨询支持',
          '家具齐全',
          '含网络与水电费',
          '24 小时管理中心',
          '国际社区活动'
        ],
        pros_cons: {
          '优点': '语言沟通无障碍，容易建立朋友圈，手续简单',
          '缺点': '比普通单间租金高，隐私有限，需要遵守宿舍规则'
        },
        application_process: [
          '填写在线申请表',
          '进行线上面试（韩语/英语）',
          '支付定金',
          '协调入住时间'
        ],
        tips: [
          '确认是否可灵活调整合同期限',
          '申请前可预约参观查看环境',
          '询问已有住户的国籍比例'
        ]
      }
    },
    {
      id: 'deposit-system',
      title: '💰 彻底了解韩国押金和月租系统',
      category: '合同/法律',
      description: '关于全租、月租、半全租的所有知识',
      details: {
        types_explained: {
          '全租（전세）': '只交大额押金，无月租（通常为房价的70~80%）— 2年合同',
          '月租（월세）': '押金 + 每月月租 — 1年合同',
          '半全租（반전세）': '低于全租的押金 + 少量月租 — 1~2年合同'
        },
        deposit_calculation: [
          '押金越高，月租越低',
          '押金 1000 万韩元 ≈ 月租 10~15 万韩元',
          '根据银行利率会有所浮动'
        ],
        payment_schedule: [
          '签约时：预付款（押金的10%）',
          '剩余押金：入住日一次付清',
          '月租：每月固定日期（通常月底或5日）'
        ],
        return_conditions: [
          '正常退租时押金全额返还',
          '若有损坏需扣除维修费',
          '清洁费另算（20~30 万韩元）',
          '押金返还时限：退租后1周内'
        ],
        negotiation_tips: [
          '可协商提高押金以降低月租',
          '确认是否包含管理费',
          '通过调整入住日期获得折扣',
          '签长租时可尝试要优惠'
        ]
      }
    },
    {
      id: 'address-registration',
      title: '📮 迁入登记与地址注册全攻略',
      category: '行政手续',
      description: '韩国居住必办行政手续',
      details: {
        address_registration: [
          '入住后30天内前往居民中心办理',
          '所需材料：租赁合同、外国人登记证、护照原件',
          '同时可申请更改身份证地址'
        ],
        procedures: [
          '前往居民中心民政窗口',
          '填写迁入登记表',
          '将材料交给工作人员',
          '同时更改外国人登记证上的地址（即时生效）',
          '如需可申请新的住址确认书'
        ],
        benefits: [
          '办理银行、手机、网络时可作为地址证明',
          '快递、邮政正常投递',
          '可享受当地居民优惠（如公共设施折扣）',
          '紧急情况时可快速救援'
        ],
        online_services: [
          '通过“정부24”App查看地址变更记录',
          '线上申请电子居民登记抄本',
          '使用邮政地址变更服务'
        ],
        tips: [
          '搬迁前先查好居民中心位置',
          '同时更改水、电、燃气等户号',
          '网购平台可一次性批量修改地址',
          '银行地址可线上或到柜台修改'
        ]
      }
    },
    {
      id: 'living-costs',
      title: '💸 韩国生活费省钱妙招',
      category: '生活费/省钱',
      description: '留学生实用省钱攻略',
      details: {
        monthly_budget: {
          '餐饮费': '自炊：20~30 万韩元；外食：40~50 万韩元',
          '交通费': '公交地铁月票：5~8 万韩元',
          '通信费': '手机套餐：3~5 万韩元',
          '生活用品': '5~10 万韩元',
          '娱乐费': '10~20 万韩元'
        },
        food_saving: [
          '使用校内食堂（每餐 3000~5000 韩元）',
          '便利店夜间折扣（晚上 10 点后）',
          '大型超市特价日（双周二）',
          '使用 Coupang Eats、Baedal Minjok 优惠券',
          '在家自己做饭（节省原材料费用）'
        ],
        shopping_tips: [
          '使用 Karrot 二手交易',
          '线上购物赚取积分',
          '关注信用卡折扣优惠',
          '大宗购买时与朋友分摊',
          '把握季节大促'
        ],
        utility_bills: [
          '节约能源（控制电费和燃气费）',
          '使用网络套餐捆绑优惠',
          '比较手机套餐后再选择',
          '选择免手续费银行账户'
        ],
        student_discounts: [
          '学生优惠（电影院、咖啡、交通）',
          '利用青年优惠政策',
          '部分地区可享外国人旅游折扣',
          '凭学生证享受多种优惠'
        ]
      }
    },
    {
      id: 'emergency-guide',
      title: '🚨 紧急情况应对与紧急联系电话',
      category: '安全/应急',
      description: '在韩国发生紧急情况时的应对方法',
      details: {
        emergency_numbers: [
          '119：火灾、急救',
          '112：报警',
          '1339：急救医疗信息中心',
          '1330：旅游翻译热线（专为外国人）',
          '1350：雇佣劳动部热线（多语言支持）'
        ],
        medical_emergency: [
          '拨打119时务必准确告知地址',
          '随身携带外国人登记证',
          '查看保险卡',
          '急诊就医需自付部分费用',
          '可要求翻译服务'
        ],
        natural_disasters: {
          '地震': '保护头部，躲到桌子下，保持门开',
          '台风': '尽量不要外出，贴窗防风，准备应急物资',
          '暴雨': '避开地铁、下穿道，注意山洪和山体滑坡'
        },
        crime_prevention: [
          '尽量避免深夜独自行走',
          '不要外露贵重物品',
          '务必锁好门窗',
          '如有可疑人员尾随，立即前往人多区域',
          '信用卡丢失后立刻挂失'
        ],
        insurance_info: [
          '务必加入国民健康保险',
          '建议另外购买留学生保险',
          '事先了解保险覆盖范围',
          '就医时随身携带保险卡'
        ],
        embassy_contacts: [
          '保存本国大使馆联系方式',
          '了解领事馆服务流程',
          '护照丢失要及时向大使馆报失',
          '办理长期居留申报'
        ]
      }
    },
    {
      id: 'living-etiquette',
      title: '🤝 韩国生活规则与礼仪',
      category: '文化/礼仪',
      description: '在韩生活应遵守的礼仪与文化',
      details: {
        apartment_rules: [
          '晚上10点后注意噪音（电视、音乐、脚步声）',
          '严格垃圾分类',
          '公共区域使用后请整理干净',
          '乘坐电梯时要给长辈留位置',
          '遵守停车规则'
        ],
        noise_etiquette: [
          '深夜避免大声通话',
          '开关门时动作轻',
          '使用吹风机、洗衣机要注意时间',
          '不要在室内戴鞋走动'
        ],
        garbage_disposal: {
          '一般垃圾': '白色计量袋（每周2~3次收取）',
          '可回收物': '分类投放—塑料、玻璃、纸张、易拉罐',
          '厨余垃圾': '使用黄色专用垃圾袋或分类桶',
          '大件垃圾': '需提前申报并购买贴纸'
        },
        neighbor_relations: [
          '搬家时向邻居打招呼（可送糕点）',
          '注意楼上楼下噪音',
          '进出大楼确认身后是否有人',
          '可帮忙代收快递',
          '遇到困难可向邻居求助'
        ],
        public_spaces: [
          '地铁上让座给老人和孕妇',
          '公共交通工具上避免大声通话',
          '公共场所吸烟请注意地点',
          '餐厅尽量不留剩菜',
          '不要乱丢垃圾'
        ],
        cultural_tips: [
          '给长辈递东西要用双手',
          '了解韩国酒桌文化',
          '理解年龄与辈分观念',
          '搬家时同学聚会送礼（如厕纸、洗涤剂）',
          '熟悉春节(설날)、中秋(추석)等节日习俗'
        ]
      }
    }
  ];
  
  
  
  // French version (Français)
  // ------------------------
  
  export const frenchResidenceContent: FloatingBallContent[] = [
    {
      id: 'dormitory-guide',
      title: '🏫 Guide complet des dortoirs pour étudiants étrangers',
      category: 'Logement/Hébergement',
      description: 'Tout ce qu’il faut savoir sur les dortoirs universitaires en Corée, de la demande à la vie quotidienne',
      details: {
        application: [
          'Candidature en ligne sur le site de l’université (généralement en février-mars et août-septembre)',
          'Critères de sélection : distance, résultats académiques, situation financière, ordre de candidature',
          'Documents nécessaires : lettre d’admission, copie du passeport, certificat de santé, preuve de moyens financiers'
        ],
        dormitory_types: [
          'Pavillon international (réservé aux étudiants étrangers) : nombreux programmes d’échanges culturels',
          'Dortoir standard (mixte Coréens et étrangers) : opportunités de pratiquer le coréen',
          'Possibilités de choisir chambre individuelle, chambre double ou chambre quadruple'
        ],
        facilities: [
          'Équipements de base : lit, bureau, armoire, climatisation',
          'Buanderie commune, salle de séchage, salle de détente',
          'Cantine, supérette, café (souvent à l’intérieur du bâtiment)',
          'Wi-Fi et Internet gratuits'
        ],
        cost: [
          '800 000 à 1 500 000 KRW par semestre (pour une chambre double)',
          'Frais de repas non inclus (environ 250 000 KRW par mois à la cantine)',
          'Dépôt de garantie : 100 000 à 300 000 KRW (remboursé au départ)'
        ],
        living_tips: [
          'Respecter le règlement du dortoir (interdiction d’alcool, interdiction de fumer, déclaration des absences nocturnes, etc.)',
          'Communiquer avec votre colocataire coréen pour découvrir la culture locale',
          'Participer activement aux événements du dortoir pour se faire des amis'
        ]
      }
    },
    {
      id: 'room-hunting',
      title: '🔍 Guide complet pour trouver un studio/오피스텔',
      category: 'Logement/Hébergement',
      description: 'Le système de loyer mensuel en Corée et les astuces pour chercher un logement',
      details: {
        housing_types: {
          'Studio (원룸)': 'Pièce unique avec cuisine et salle de bain : dépôt de garantie 3 000 000 à 10 000 000 KRW, loyer mensuel 400 000 à 800 000 KRW',
          'Deux-pièces (투룸)': 'Deux chambres + salon + cuisine + salle de bain : dépôt de garantie 5 000 000 à 20 000 000 KRW, loyer 600 000 à 1 200 000 KRW',
          '오피스텔': 'Studio + service de gestion, sécurité : dépôt 5 000 000 à 15 000 000 KRW, loyer 500 000 à 1 000 000 KRW',
          'Sharehouse (셰어하우스)': 'Chambre privée + espaces communs partagés : dépôt 500 000 à 2 000 000 KRW, loyer 300 000 à 600 000 KRW'
        },
        search_platforms: [
          'Application Zigbang (직방) – la plus populaire',
          'Application Dabang (다방)',
          'Naver Immobilier (네이버 부동산)',
          'Hoobbang Nono (호갱노노) – pour consulter les prix réels de transaction',
          'Visites directes auprès des agences immobilières'
        ],
        contract_tips: [
          'Toujours visiter le logement avant de signer',
          'Vérifier le registre foncier (등기부등본) pour confirmer le propriétaire',
          'Il est conseillé de souscrire à une assurance dépôt',
          'Lire attentivement le contrat avant de signer'
        ],
        location_guide: [
          'Proche de l’université : moins de 10 minutes à pied (plus cher mais plus pratique)',
          'À 1 à 2 stations de métro : parfois plus économique même en tenant compte des frais de transport',
          'Vérifier les lignes de bus : existence d’un bus direct vers l’université'
        ]
      }
    },
    {
      id: 'rental-contract',
      title: '📋 Liste de contrôle du contrat de location – Guide anti-arnaque',
      category: 'Contrat/Légal',
      description: 'Points essentiels pour sécuriser votre contrat de location',
      details: {
        before_contract: [
          'Vérifier la carte d’identité du propriétaire',
          'Consulter le registre foncier (등기부등본) : propriété et hypothèques éventuelles',
          'Vérifier l’état réel du logement (habitable)',
          'Tester le niveau de bruit, la luminosité, la pression d’eau, etc.'
        ],
        contract_checklist: [
          'Durée du bail (généralement 1 an)',
          'Montant du dépôt de garantie/loyer mensuel et date de paiement',
          'Vérifier les charges comprises',
          'Responsabilités pour les réparations et l’entretien',
          'Conditions de résiliation anticipée',
          'Conditions de restitution du dépôt de garantie'
        ],
        required_docs: [
          'Contrat de location (avec cachet ou signature)',
          'Copie de la pièce d’identité',
          'Copie de la carte d’enregistrement étranger',
          'Justificatif du versement du dépôt'
        ],
        protection: [
          'Souscrire à l’assurance dépôt du Korea Land & Housing Corporation (LH)',
          'Conserver une copie du contrat',
          'Transférer le dépôt uniquement par virement bancaire',
          'En cas de problème, appeler le 1372 (Gwangtong News) pour signaler'
        ],
        red_flags: [
          'Paiement en espèces uniquement',
          'Refus de rédiger un contrat',
          'Refus de consulter le registre foncier',
          'Prix anormalement bas'
        ]
      }
    },
    {
      id: 'housing-support',
      title: '🏠 Programmes de soutien au logement pour étudiants étrangers',
      category: 'Soutien/Avantages',
      description: 'Programmes de logement proposés par le gouvernement et le privé',
      details: {
        government_support: {
          'Programme K-Housing': 'Korea Land & Housing Corporation – logements réservés aux étudiants étrangers à environ 80 % du prix du marché',
          'Sharehouses de Séoul pour étrangers': 'Ville de Séoul – loyer mensuel 300 000 à 500 000 KRW, dépôt minimum',
          'Programmes universitaires de logement': 'Chaque bureau international d’université – studios à prix réduit à proximité'
        },
        private_support: [
          'Agences immobilières spécialisées pour étrangers (assistance multilingue)',
          'Compagnies de sharehouse internationales',
          'Communautés de logement pour étudiants'
        ],
        application: [
          'Contacter le bureau international de votre université',
          'Visiter le site K-Housing de la Korea Land & Housing Corporation',
          'Consulter le centre d’accueil mondial de Séoul (Seoul Global Center) pour conseils'
        ],
        tips: [
          'Période de candidature : possible dès 3 mois avant la rentrée',
          'S’inscrire sur liste d’attente recommandée',
          'Faire plusieurs demandes simultanément'
        ]
      }
    },
    {
      id: 'living-essentials',
      title: '🛒 Guide d’achat des articles de première nécessité en Corée',
      category: 'Articles ménagers/Achats',
      description: 'Comment acheter à petit prix les articles de première nécessité',
      details: {
        essential_items: [
          'Literie (couette, oreiller, draps)',
          'Articles de cuisine (casseroles, poêles, vaisselle)',
          'Produits d’hygiène (lessive, shampoing, papier toilette)',
          'Électroménager (réfrigérateur, lave-linge, micro-ondes)'
        ],
        shopping_places: {
          'Daiso (다이소)': 'Articles ménagers 1000~5000 KRW – présent dans tout le pays',
          'E-Mart/Homeplus': 'Hypermarchés – achats en vrac possibles',
          'Karrot Market (당근마켓)': 'Application d’achat d’occasion – meubles et électroménager pas chers',
          'Coupang': 'Livraison rapide – idéal pour objets lourds',
          'IKEA': 'Meubles – montage nécessaire mais design et prix attractifs'
        },
        money_saving_tips: [
          'Dresser une liste des articles nécessaires avant d’emménager',
          'Utiliser activement l’occasion (surtout pour l’électroménager)',
          'Cibler les soldes saisonniers (électroménager en été/hiver)',
          'Profiter des promotions en hypermarché',
          'Acheter en gros avec des amis'
        ],
        delivery_info: [
          'Coupang : livraison le lendemain, vérifier conditions de livraison gratuite',
          'E-Mart Mall : livraison le jour même selon la zone',
          'Si absent, utiliser les casiers automatiques'
        ]
      }
    },
    {
      id: 'neighborhood-guide',
      title: '🗺️ Guide de l’environnement de vie par quartier (centré sur Séoul)',
      category: 'Infos locales',
      description: 'Caractéristiques des quartiers universitaires et comparaison du coût de la vie',
      details: {
        university_areas: {
          'Sinchon/Hongdae (Yonsei, Sogang)': 'Culture jeune, vie nocturne animée – studio 600 000~1 000 000 KRW',
          'Gangnam (près de Hanyang, Soongsil)': 'Transports pratiques, plus cher mais installations de qualité – 800 000~1 500 000 KRW',
          'Seongbuk-gu (Korea, Sungkyunkwan)': 'Quartiers résidentiels calmes, loyer plus abordable – 500 000~800 000 KRW',
          'Mapo-gu (Hongik)': 'Culture artistique, nombreux étrangers – 600 000~900 000 KRW'
        },
        facilities_check: [
          'Distance à pied jusqu’à la station de métro',
          'Proximité des supérettes et supermarchés',
          'Emplacement des hôpitaux et pharmacies',
          'Disponibilité des banques et bureaux de poste',
          'Installations 24h/24 (PC bang, laverie automatique)'
        ],
        safety_tips: [
          'Éviter de rentrer seul en pleine nuit par des ruelles étroites',
          'Choisir des zones bien vidéosurveillées (CCTV)',
          'Repérer l’emplacement des postes de police',
          'Préférer un logement au-dessus du 1er étage'
        ],
        transportation: [
          'Connaître le plan du métro',
          'Télécharger des applications de bus (Bus Tag, Subway Map)',
          'Vérifier les pistes cyclables (services comme SsangSsang)',
          'Méthode d’achat de la carte T-money'
        ]
      }
    },
    {
      id: 'foreigner-housing',
      title: '🌍 Services de logement dédiés aux étrangers',
      category: 'Logement/Hébergement',
      description: 'Solutions d’hébergement conviviales et sans barrière linguistique',
      details: {
        global_sharehouses: {
          'BORDERLESS HOUSE': 'Co-habitation Coréens-étrangers, échange linguistique – 400 000~700 000 KRW/mois',
          'ZZIM HOUSE': 'Sharehouse pour étrangers uniquement – 350 000~600 000 KRW/mois',
          'WJ STAY': 'Courte/longue durée possible – 500 000~800 000 KRW/mois'
        },
        services_included: [
          'Assistance multilingue (anglais, chinois, japonais)',
          'Mobilier complet',
          'Internet et charges inclus',
          'Bureau de gestion 24h/24',
          'Programmes communautaires internationaux'
        ],
        pros_cons: {
          'Avantages': 'Communication aisée, faciliter les rencontres, procédures de contrat simplifiées',
          'Inconvénients': 'Plus cher qu’un studio normal, intimité limitée, obligations du règlement interne'
        },
        application_process: [
          'Remplir le formulaire en ligne',
          'Entretien vidéo (en coréen/anglais)',
          'Paiement du dépôt',
          'Coordonner la date d’emménagement'
        ],
        tips: [
          'Vérifier la flexibilité de la durée du contrat',
          'Faire un tour du logement avant de signer',
          'Demander la composition nationale des résidents'
        ]
      }
    },
    {
      id: 'deposit-system',
      title: '💰 Comprendre parfaitement le système de dépôt et de loyer en Corée',
      category: 'Contrat/Légal',
      description: 'Tout savoir sur le jeonse, le wolse et le banjeonse',
      details: {
        types_explained: {
          'Jeonse (전세)': 'Versement d’un dépôt important sans loyer mensuel (généralement 70~80 % du prix du bien) – bail de 2 ans',
          'Wolse (월세)': 'Dépôt + loyer mensuel – bail d’un an',
          'Banjeonse (반전세)': 'Dépôt moins élevé qu’en jeonse + loyer mensuel réduit – bail de 1 à 2 ans'
        },
        deposit_calculation: [
          'Plus le dépôt est élevé, plus le loyer mensuel est bas',
          'Dépôt de 10 000 000 KRW ≈ loyer mensuel 100 000~150 000 KRW',
          'Montant variable selon le taux d’intérêt bancaire'
        ],
        payment_schedule: [
          'À la signature : acompte (10 % du dépôt)',
          'Solde du dépôt : versement à la date d’emménagement',
          'Loyer : paiement mensuel à une date fixe (généralement fin de mois ou 5 du mois)'
        ],
        return_conditions: [
          'Dépôt entièrement restitué en cas de départ normal',
          'Frais de réparation déduits en cas de dégâts',
          'Frais de nettoyage en sus (200 000~300 000 KRW)',
          'Délai de restitution : dans la semaine suivant le départ'
        ],
        negotiation_tips: [
          'Négocier un dépôt plus élevé pour réduire le loyer',
          'Vérifier si les charges sont incluses',
          'Négocier un rabais en fonction de la date d’emménagement',
          'Demander une réduction pour contrat longue durée'
        ]
      }
    },
    {
      id: 'address-registration',
      title: '📮 Guide complet de déclaration de résidence et d’enregistrement d’adresse',
      category: 'Procédures administratives',
      description: 'Formalités administratives indispensables pour vivre en Corée',
      details: {
        address_registration: [
          'Se rendre au guichet communal (주민센터) dans les 30 jours suivant l’emménagement',
          'Documents nécessaires : contrat de location, carte d’enregistrement étranger, passeport',
          'En même temps, demander la mise à jour de l’adresse sur la carte d’enregistrement étranger'
        ],
        procedures: [
          'Visiter le guichet des affaires locales au 주민센터',
          'Remplir le formulaire de déclaration de résidence',
          'Remettre les documents au fonctionnaire',
          'Mise à jour immédiate de l’adresse sur la carte d’enregistrement étranger',
          'Obtenir si nécessaire un certificat de l’adresse mise à jour'
        ],
        benefits: [
          'Preuve d’adresse pour banque, téléphone, Internet',
          'Livraison normale du courrier et des colis',
          'Accès aux avantages locaux (réductions pour résidents)',
          'Réponse rapide en cas d’urgence'
        ],
        online_services: [
          'Consulter les modifications d’adresse via l’application Government24 (정부24)',
          'Télécharger un extrait de registre d’adresse électronique',
          'Utiliser le service de changement d’adresse postal'
        ],
        tips: [
          'Repérer l’emplacement du 주민센터 avant le déménagement',
          'Modifier en même temps les comptes de services (eau, électricité, gaz)',
          'Mettre à jour son adresse sur les plateformes de commerce en ligne',
          'Modifier l’adresse bancaire en ligne ou en agence'
        ]
      }
    },
    {
      id: 'living-costs',
      title: '💸 Astuces pour économiser sur le coût de la vie en Corée',
      category: 'Budget/Vie quotidienne',
      description: 'Conseils pratiques pour économiser pour les étudiants étrangers',
      details: {
        monthly_budget: {
          'Frais alimentaires': '20~30 万 KRW (cuisine maison), 40~50 万 KRW (manger à l’extérieur)',
          'Frais de transport': '50 000~80 000 KRW (carte de transport mensuelle)',
          'Frais de communication': '30 000~50 000 KRW (forfait mobile)',
          'Articles ménagers': '50 000~100 000 KRW',
          'Loisirs': '100 000~200 000 KRW'
        },
        food_saving: [
          'Manger à la cantine universitaire (3000~5000 KRW par repas)',
          'Profiter des réductions en fin de journée dans les supérettes (après 22h)',
          'Viser les jours de promotion des hypermarchés (tous les deux mardis)',
          'Utiliser des coupons Coupang Eats, Baedal Minjok',
          'Cuisiner à domicile pour économiser sur le coût des ingrédients'
        ],
        shopping_tips: [
          'Utiliser Karrot Market pour l’occasion',
          'Profiter des points de fidélité sur les sites électroniques',
          'Consulter les offres de carte de crédit',
          'Acheter en gros avec des amis',
          'Attendre les soldes saisonniers'
        ],
        utility_bills: [
          'Économiser l’énergie (électricité, gaz)',
          'Souscrire à des offres groupées Internet + téléphone',
          'Comparer les forfaits mobiles',
          'Ouvrir un compte bancaire sans frais'
        ],
        student_discounts: [
          'Réductions étudiants (cinéma, café, transport)',
          'Profiter des politiques de réduction pour les jeunes',
          'Quelques régions offrent des réductions pour touristes étrangers',
          'Présenter la carte étudiante pour diverses réductions'
        ]
      }
    },
    {
      id: 'emergency-guide',
      title: '🚨 Guide d’urgence et numéros utiles',
      category: 'Sécurité/Urgence',
      description: 'Comment réagir en cas d’urgence en Corée',
      details: {
        emergency_numbers: [
          '119 : incendie, secours médical',
          '112 : police',
          '1339 : centre d’information médicale d’urgence',
          '1330 : ligne de traduction pour touristes étrangers',
          '1350 : ministère du Travail et de l’Emploi (assistance multilingue)'
        ],
        medical_emergency: [
          'Indiquer une adresse précise en appelant le 119',
          'Avoir sa carte d’enregistrement étranger sur soi',
          'Vérifier sa carte d’assurance',
          'Frais à la charge du patient en cas d’urgence',
          'Possibilité de demander un service de traduction'
        ],
        natural_disasters: {
          'Tremblement de terre': 'Protéger la tête, se mettre sous une table, maintenir la porte ouverte',
          'Typhon': 'Éviter de sortir, protéger les fenêtres, préparer des fournitures d’urgence',
          'Fortes pluies': 'Éviter le métro, les passages souterrains, attention aux glissements de terrain'
        },
        crime_prevention: [
          'Éviter de se promener seul tard la nuit',
          'Ne pas exhiber d’objets de valeur',
          'Verrouiller soigneusement les portes et fenêtres',
          'Si vous êtes suivi, chercher un endroit fréquenté',
          'Bloquer immédiatement la carte bancaire en cas de perte'
        ],
        insurance_info: [
          'Souscrire à l’assurance santé nationale (국민건강보험)',
          'Recommander une assurance supplémentaire pour étudiants étrangers',
          'Vérifier les garanties de l’assurance à l’avance',
          'Présenter la carte d’assurance en cas de soins médicaux'
        ],
        embassy_contacts: [
          'Enregistrer les coordonnées de votre ambassade',
          'Connaître les services consulaires',
          'Signaler la perte de passeport à l’ambassade',
          'Procédure de déclaration de séjour longue durée'
        ]
      }
    },
    {
      id: 'living-etiquette',
      title: '🤝 Règles et savoir-vivre en Corée',
      category: 'Culture/Étiquette',
      description: 'Les bonnes manières et coutumes à respecter en Corée',
      details: {
        apartment_rules: [
          'Respecter le silence après 22h (TV, musique, pas)',
          'Se conformer à la séparation des déchets',
          'Nettoyer après utilisation des espaces communs',
          'Laisser la place dans l’ascenseur aux personnes âgées',
          'Respecter les règles de stationnement'
        ],
        noise_etiquette: [
          'Éviter de passer des appels à haute voix tard le soir',
          'Refermer les portes doucement',
          'Respecter les horaires pour l’usage du sèche-cheveux et de la machine à laver',
          'Ne pas marcher en chaussures à l’intérieur'
        ],
        garbage_disposal: {
          'Ordures ménagères': 'Sac blanc payant (collecte 2-3 fois/semaine)',
          'Recyclables': 'Tri sélectif : plastique, verre, papier, canettes',
          'Déchets alimentaires': 'Sac jaune dédié ou bac spécial',
          'Gros déchets': 'Déclarer à l’avance et acheter un autocollant spécifique'
        },
        neighbor_relations: [
          'Prévenir les voisins lors de votre emménagement (offrir du tteok)',
          'Faire attention au bruit entre étages',
          'Vérifier qu’il n’y a personne derrière en fermant la porte d’entrée',
          'Accepter de recevoir les colis des voisins',
          'Demander de l’aide en cas de besoin'
        ],
        public_spaces: [
          'Laisser votre siège dans le métro aux personnes âgées ou aux femmes enceintes',
          'Ne pas téléphoner à voix haute dans les transports en commun',
          'Faire attention aux endroits où fumer',
          'Ne pas laisser de restes de nourriture dans les restaurants',
          'Ne pas jeter d’ordures dans les lieux publics'
        ],
        cultural_tips: [
          'Présenter et recevoir les objets à deux mains devant les aînés',
          'Comprendre la culture des repas avec alcool',
          'Respecter les notions d’âge et de hiérarchie',
          'Offrir du papier toilette ou du détergent lors d’une pendaison de crémaillère',
          'Se familiariser avec les fêtes traditionnelles (Nouvel An, Chuseok)'
        ]
      }
    }
  ];
  
  
  
  // German version (Deutsch)
  // ------------------------
  
  export const germanResidenceContent: FloatingBallContent[] = [
    {
      id: 'dormitory-guide',
      title: '🏫 Komplett-Guide zum Wohnheim für internationale Studierende',
      category: 'Wohnen/Unterkunft',
      description: 'Alles über das Wohnheim an koreanischen Universitäten, von der Bewerbung bis zum Alltag',
      details: {
        application: [
          'Online-Bewerbung auf der Universitätswebsite (normalerweise Februar–März und August–September)',
          'Auswahlkriterien: Entfernung, Noten, finanzielle Lage, Reihenfolge der Bewerbung',
          'Benötigte Unterlagen: Zulassungsbescheid, Reisepasskopie, Gesundheitszeugnis, Finanzierungsnachweis'
        ],
        dormitory_types: [
          'Internationales Wohnheim (nur für internationale Studierende) – viele Kulturaustauschprogramme',
          'Normales Wohnheim (gemischt mit koreanischen Studierenden) – Möglichkeit, Koreanisch zu üben',
          'Auswahl zwischen Einzelzimmer, Doppelzimmer und Vierbettzimmer'
        ],
        facilities: [
          'Grundausstattung: Bett, Schreibtisch, Kleiderschrank, Klimaanlage',
          'Gemeinschafts-Waschraum, Trockenraum, Aufenthaltsraum',
          'Kantine, Convenience Store, Café (meist im selben Gebäude)',
          'Kostenloses WLAN und Internet'
        ],
        cost: [
          '800 000 bis 1 500 000 KRW pro Semester (Doppelzimmer)',
          'Verpflegung nicht enthalten (Kantine ca. 250 000 KRW/Monat)',
          'Kaution 100 000 bis 300 000 KRW (bei Auszug zurückerstattet)'
        ],
        living_tips: [
          'Wohnheimregeln einhalten (Alkohol- und Rauchverbot, Ausgehregeln melden etc.)',
          'Mit koreanischen Mitbewohnern sprechen, um die Kultur kennenzulernen',
          'Aktiv an Wohnheimveranstaltungen teilnehmen, um Freunde zu finden'
        ]
      }
    },
    {
      id: 'room-hunting',
      title: '🔍 Perfekter Leitfaden für die Suche nach Studio/Officetel',
      category: 'Wohnen/Unterkunft',
      description: 'Das koreanische Mietsystem und Tipps zum Wohnungsfinden',
      details: {
        housing_types: {
          'Studio (원룸)': 'Raum + Kochnische + Bad in einem – Kaution 3 000 000 bis 10 000 000 KRW, Miete 400 000 bis 800 000 KRW/Monat',
          'Zweizimmerwohnung (투룸)': '2 Schlafzimmer + Wohnzimmer + Küche + Bad – Kaution 5 000 000 bis 20 000 000 KRW, Miete 600 000 bis 1 200 000 KRW/Monat',
          'Officetel (오피스텔)': 'Studio + Verwaltung/Sicherheit – Kaution 5 000 000 bis 15 000 000 KRW, Miete 500 000 bis 1 000 000 KRW/Monat',
          'Sharehouse (셰어하우스)': 'Eigenes Zimmer + Gemeinschaftsbereich – Kaution 500 000 bis 2 000 000 KRW, Miete 300 000 bis 600 000 KRW/Monat'
        },
        search_platforms: [
          'Zigbang (직방) App – am beliebtesten',
          'Dabang (다방) App',
          'Naver Immobilien (네이버 부동산)',
          'Hoobbang Nono (호갱노노) – echte Transaktionspreise anzeigen',
          'Direktbesuch bei Immobilienmaklern'
        ],
        contract_tips: [
          'Unbedingt die Wohnung vor Vertragsunterzeichnung besichtigen',
          'Grundbuchauszug (등기부등본) prüfen, um den Eigentümer zu bestätigen',
          'Abschluss einer Kautionsversicherung empfohlen',
          'Vertrag sorgfältig lesen, bevor unterschrieben wird'
        ],
        location_guide: [
          'In Uni-Nähe: max. 10 Minuten zu Fuß (teurer, aber praktisch)',
          '1–2 U-Bahn-Stationen entfernt: häufig günstiger, auch bei Berücksichtigung der Transportkosten',
          'Buslinien prüfen: Gibt es eine Direktverbindung zur Uni?'
        ]
      }
    },
    {
      id: 'rental-contract',
      title: '📋 Mietvertrags-Checkliste – Betrugsprävention',
      category: 'Vertrag/Recht',
      description: 'Wichtige Punkte für einen sicheren Mietvertrag',
      details: {
        before_contract: [
          'Ausweis des Vermieters überprüfen',
          'Grundbuchauszug (등기부등본) ansehen (Eigentums- und Hypothekenlage prüfen)',
          'Wohnung auf Bewohnbarkeit prüfen',
          'Lärm, Beleuchtung, Wasserdruck in der Umgebung testen'
        ],
        contract_checklist: [
          'Mietdauer (in der Regel 1 Jahr)',
          'Höhe der Kaution/Miete und Fälligkeit',
          'Welche Nebenkosten sind enthalten?',
          'Verantwortung für Reparatur und Instandhaltung',
          'Bedingungen für vorzeitige Kündigung',
          'Bedingungen für Kautionsrückzahlung'
        ],
        required_docs: [
          'Mietvertrag (mit Stempel oder Unterschrift)',
          'Kopie des Ausweises',
          'Kopie der Ausländerregistrierungskarte',
          'Nachweis der Kautionszahlung'
        ],
        protection: [
          'Abschluss der LH-Mietkautionsversicherung (Korea Land & Housing Corporation)',
          'Vertrag kopieren und aufbewahren',
          'Kaution nur per Banküberweisung bezahlen',
          'Bei Problemen 1372 (Bürgerbeschwerdestelle) anrufen'
        ],
        red_flags: [
          'Nur Barzahlung akzeptiert',
          'Vermieter verweigert Vertragsabschluss',
          'Einsicht in Grundbuchauszug wird verweigert',
          'Unrealistisch niedriger Preis'
        ]
      }
    },
    {
      id: 'housing-support',
      title: '🏠 Wohnunterstützungsprogramme für internationale Studierende',
      category: 'Unterstützung/Leistungen',
      description: 'Regierungs- und Privatprogramme für Wohnraumförderung',
      details: {
        government_support: {
          'K-Housing Programm': 'Korea Land & Housing Corporation (LH) – Wohnraum für internationale Studierende zu etwa 80 % des Marktpreises',
          'Seouler Sharehouse für Ausländer': 'Stadt Seoul – monatliche Miete 300 000 bis 500 000 KRW, geringe Kaution',
          'Universitätsgebundene Wohnprogramme': 'Internationales Büro jeder Uni – ermäßigte Studios in Uni-Nähe'
        },
        private_support: [
          'Immobilienagenturen für Ausländer (mehrsprachige Unterstützung)',
          'Internationale Sharehouse-Unternehmen',
          'Studenten-Wohn-Communities'
        ],
        application: [
          'Kontaktaufnahme mit dem internationalen Büro der eigenen Universität',
          'Besuch der K-Housing-Website der LH',
          'Beratung im Seoul Global Center'
        ],
        tips: [
          'Bewerbung ab 3 Monate vor Semesterbeginn möglich',
          'Anmeldung auf Warteliste empfohlen',
          'Mehrere Programme gleichzeitig bewerben'
        ]
      }
    },
    {
      id: 'living-essentials',
      title: '🛒 Einkaufsführer für Alltagsgegenstände in Korea',
      category: 'Haushaltswaren/Einkaufen',
      description: 'Wie man notwendige Alltagsgegenstände günstig einkauft',
      details: {
        essential_items: [
          'Bettwäsche (Decke, Kissen, Bettlaken)',
          'Küchenutensilien (Töpfe, Pfannen, Geschirr)',
          'Alltagsartikel (Waschmittel, Shampoo, Toilettenpapier)',
          'Haushaltsgeräte (Kühlschrank, Waschmaschine, Mikrowelle)'
        ],
        shopping_places: {
          'Daiso (다이소)': 'Haushaltsartikel 1000~5000 KRW – landesweit',
          'E-Mart/Homeplus': 'Großmärkte – Großeinkauf möglich',
          'Karrot Market (당근마켓)': 'Second-Hand-App – günstiges Gebrauchtmöbel/-geräte',
          'Coupang': 'Online-Lieferservice – ideal für schwere Gegenstände',
          'IKEA': 'Möbel – Selbstmontage, aber preiswert und stilvoll'
        },
        money_saving_tips: [
          'Vor Einzug eine Liste benötigter Artikel erstellen',
          'Second-Hand-Käufe (besonders Haushaltsgeräte) aktiv nutzen',
          'Jahreszeitliche Angebote (z. B. Kühl-/Heizgeräte im Sommer/Winter) beachten',
          'Großhandelsangebote in Supermärkten nutzen',
          'Mit Freunden Sammelbestellungen aufgeben'
        ],
        delivery_info: [
          'Coupang : Lieferung am nächsten Tag, Bedingungen für Gratisversand prüfen',
          'E-Mart Mall : Same-Day-Lieferung je nach Region verfügbar',
          'Bei Abwesenheit Lieferung an Paketbox möglich'
        ]
      }
    },
    {
      id: 'neighborhood-guide',
      title: '🗺️ Stadtteil-Guide für die Umgebung (z. B. Seoul)',
      category: 'Regionale Infos',
      description: 'Charakteristika der Unistandorte und Vergleich der Lebenshaltungskosten',
      details: {
        university_areas: {
          'Sinchon/Hongdae (Yonsei, Sogang)': 'Junge Kultur, lebhaftes Nachtleben – Studio 600 000~1 000 000 KRW',
          'Gangnam (in der Nähe von Hanyang, Soongsil)': 'Gute Verkehrsanbindung, teurer, aber gute Ausstattung – 800 000~1 500 000 KRW',
          'Seongbuk-gu (Korea, Sungkyunkwan)': 'Ruhige Wohngegend, vergleichsweise günstiger – 500 000~800 000 KRW',
          'Mapo-gu (Hongik)': 'Künstlerisches Flair, viele Ausländer – 600 000~900 000 KRW'
        },
        facilities_check: [
          'Zu Fuß erreichbare Entfernung zur U-Bahn-Station',
          'Erreichbarkeit von Convenience Stores und Supermärkten',
          'Standort von Krankenhäusern und Apotheken',
          'Position von Banken und Postämtern',
          '24-Stunden-Einrichtungen (PC Bang, Münzwäscherei)'
        ],
        safety_tips: [
          'Vermeiden Sie es, spät nachts alleine durch schmale Gassen zu gehen',
          'Bevorzugen Sie Gegenden mit vielen CCTV-Kameras',
          'Informieren Sie sich über den Standort von Polizeistationen',
          'Bevorzugen Sie Wohnungen ab dem 2. Stockwerk bei Alleinwohnen'
        ],
        transportation: [
          'Studieren Sie den U-Bahn-Plan',
          'Laden Sie Bus-Apps herunter (Bus Tag, Subway Map)',
          'Informieren Sie sich über Fahrradwege (z. B. SsangSsang)',
          'Kauf einer T-money-Karte'
        ]
      }
    },
    {
      id: 'foreigner-housing',
      title: '🌍 Wohnungsangebote speziell für Ausländer',
      category: 'Wohnen/Unterkunft',
      description: 'Sprachbarrierefreie, ausländerfreundliche Wohnlösungen',
      details: {
        global_sharehouses: {
          'BORDERLESS HOUSE': 'Koreanische und internationale Bewohner, Sprachaustausch – 400 000~700 000 KRW/Monat',
          'ZZIM HOUSE': 'Sharehouse nur für Ausländer – 350 000~600 000 KRW/Monat',
          'WJ STAY': 'Kurz- und Langzeitmiete möglich – 500 000~800 000 KRW/Monat'
        },
        services_included: [
          'Mehrsprachige Beratung (Englisch/Chinesisch/Japanisch)',
          'Voll möbliert',
          'Internet und Nebenkosten inbegriffen',
          '24-Stunden-Verwaltung',
          'Internationale Community-Programme'
        ],
        pros_cons: {
          'Vorteile': 'Einfache Kommunikation, leichter Kontakt zu Mitbewohnern, unkomplizierte Vertragsabwicklung',
          'Nachteile': 'Höhere Miete als normales Studio, eingeschränkte Privatsphäre, Einhaltung der Hausregeln'
        },
        application_process: [
          'Online-Bewerbungsformular ausfüllen',
          'Video-Interview (Koreanisch/Englisch)',
          'Anzahlung leisten',
          'Einzugstermin abstimmen'
        ],
        tips: [
          'Prüfen Sie, ob die Vertragsdauer flexibel ist',
          'Vereinbaren Sie eine Wohnungsbesichtigung, um sich ein Bild zu machen',
          'Erkundigen Sie sich nach der Nationalitätenzusammensetzung der Bewohner'
        ]
      }
    },
    {
      id: 'deposit-system',
      title: '💰 Komplettes Verständnis des südkoreanischen Kautions- und Mietsystems',
      category: 'Vertrag/Recht',
      description: 'Alles über Jeonse, Wolse und Banjeonse',
      details: {
        types_explained: {
          'Jeonse (전세)': 'Hohe Kaution, keine monatliche Miete (in der Regel 70–80 % des Immobilienpreises) – 2-Jahres-Vertrag',
          'Wolse (월세)': 'Kaution + monatliche Miete – 1-Jahres-Vertrag',
          'Banjeonse (반전세)': 'Geringere Kaution als Jeonse + geringe monatliche Miete – 1–2-Jahres-Vertrag'
        },
        deposit_calculation: [
          'Je höher die Kaution, desto niedriger die monatliche Miete',
          '10 000 000 KRW Kaution ≈ 100 000–150 000 KRW monatliche Miete',
          'Betrag variiert je nach Bankzinssatz'
        ],
        payment_schedule: [
          'Bei Vertragsunterschrift : Anzahlung (10 % der Kaution)',
          'Restkaution : Zahlung am Einzugsdatum',
          'Monatsmiete : Zahlung an festem Datum (meist Monatsende oder 5.)'
        ],
        return_conditions: [
          'Vollständige Rückerstattung der Kaution bei ordnungsgemäßem Auszug',
          'Abzug der Reparaturkosten bei Beschädigungen',
          'Reinigungspauschale extra (200 000–300 000 KRW)',
          'Rückerstattungsfrist : innerhalb einer Woche nach Auszug'
        ],
        negotiation_tips: [
          'Nehmen Sie eine höhere Kaution in Kauf, um die Miete zu senken',
          'Überprüfen, ob Nebenkosten inkludiert sind',
          'Versuchen Sie, durch Anpassung des Einzugsdatums Rabatt zu erhalten',
          'Bei längerem Mietvertrag nach Rabatt fragen'
        ]
      }
    },
    {
      id: 'address-registration',
      title: '📮 Komplett-Guide zur Anmeldung des Wohnsitzes',
      category: 'Behördengänge',
      description: 'Unumgängliche Verwaltungsformalitäten für einen Aufenthalt in Korea',
      details: {
        address_registration: [
          'Innerhalb von 30 Tagen nach Einzug zum 주민센터 (Gemeindebüro) gehen',
          'Benötigte Unterlagen : Mietvertrag, Karte der Ausländerregistrierung, Reisepass',
          'Gleichzeitig die Adressänderung auf der Ausländerregistrierungskarte beantragen'
        ],
        procedures: [
          'Besuch des Verwaltungs­schalters im 주민센터',
          'Ausfüllen des Wohnsitzanmeldungsformulars',
          'Übergabe der Unterlagen an den Beamten',
          'Sofortige Adressänderung auf der Ausländerregistrierungskarte',
          'Auf Wunsch Ausstellung einer Adressbestätigung'
        ],
        benefits: [
          'Adresse als Nachweis für Bank, Telefon, Internet',
          'Normale Zustellung von Post und Paketen',
          'Örtliche Vergünstigungen für Anwohner (z. B. Ermäßigungen für öffentliche Einrichtungen)',
          'Schnelle Hilfe in Notfällen'
        ],
        online_services: [
          'Über die Government24-App (정부24) Adressänderungen abrufen',
          'Elektronische Wohnsitzbescheinigung online beantragen',
          'Postumleitungsdienst online nutzen'
        ],
        tips: [
          'Vor dem Umzug den Standort des 주민센터 recherchieren',
          'Auch die Konten für Strom, Gas und Wasser ummelden',
          'Adresse in Online-Shops gleichzeitig ändern',
          'Adresse bei der Bank online oder vor Ort ändern'
        ]
      }
    },
    {
      id: 'living-costs',
      title: '💸 Spartipps für die Lebenshaltungskosten in Korea',
      category: 'Lebenshaltungskosten/Sparen',
      description: 'Praktische Spartipps für internationale Studierende',
      details: {
        monthly_budget: {
          'Lebensmittel': '200 000–300 000 KRW (Selbstkochen), 400 000–500 000 KRW (Restaurantbesuche)',
          'Transport': '50 000–80 000 KRW (Monatskarte ÖPNV)',
          'Kommunikation': '30 000–50 000 KRW (Handytarif)',
          'Haushaltsartikel': '50 000–100 000 KRW',
          'Freizeit': '100 000–200 000 KRW'
        },
        food_saving: [
          'Mensacula an der Universität nutzen (3000–5000 KRW pro Mahlzeit)',
          'Spätabends Rabatte in Convenience Stores (nach 22 Uhr)',
          'Angebote in Supermärkten (alle zwei Wochen dienstags)',
          'Gutscheine von Coupang Eats, Baedal Minjok verwenden',
          'Zu Hause kochen, um Materialkosten zu sparen'
        ],
        shopping_tips: [
          'Second-Hand-Markt Karrot Market nutzen',
          'Treuepunkte bei Online-Shops sammeln',
          'Nach Rabatten von Kreditkarten schauen',
          'Mit Freunden Sammelbestellungen aufgeben',
          'Auf Saisonverkäufe warten'
        ],
        utility_bills: [
          'Energie sparen (Strom- & Gaskosten senken)',
          'Internet-Pakete mit Kombiangeboten nutzen',
          'Handytarife vergleichen',
          'Konto ohne Gebühren bei einer Bank eröffnen'
        ],
        student_discounts: [
          'Studentenermäßigungen (Kino, Café, Transport)',
          'Junge-Rabatte nutzen',
          'Manche Regionen bieten Touristenrabatte für Ausländer',
          'Ermäßigungen mit Studentenausweis'
        ]
      }
    },
    {
      id: 'emergency-guide',
      title: '🚨 Notfallleitfaden und wichtige Nummern',
      category: 'Sicherheit/Notfall',
      description: 'Wie man sich in Notfällen in Korea verhält',
      details: {
        emergency_numbers: [
          '119 – Feuerwehr, Rettungsdienst',
          '112 – Polizei',
          '1339 – Medizinische Notfall-Hotline',
          '1330 – Touristen-Übersetzungsdienst für Ausländer',
          '1350 – Ministerium für Arbeit und Beschäftigung (mehrsprachige Unterstützung)'
        ],
        medical_emergency: [
          'Beim Anruf 119 genaue Adresse angeben',
          'Ausländerregistrierungskarte mitführen',
          'Versicherungskarte überprüfen',
          'In der Notaufnahme Selbstbeteiligung möglich',
          'Übersetzungsdienste sind verfügbar'
        ],
        natural_disasters: {
          'Erdbeben': 'Schützen Sie Ihren Kopf, gehen Sie unter einen Tisch, halten Sie Türen offen',
          'Taifun': 'Vermeiden Sie das Freie, befestigen Sie Fenster, bereiten Sie Notfallkit vor',
          'Starkregen': 'Vermeiden Sie U-Bahnen und Unterführungen, achten Sie auf Erdrutschgefahr'
        },
        crime_prevention: [
          'Vermeiden Sie es, spät nachts allein unterwegs zu sein',
          'Zeigen Sie keine wertvollen Gegenstände offen',
          'Verriegeln Sie Türen und Fenster sorgfältig',
          'Wenn Sie verfolgt werden, gehen Sie in belebte Bereiche',
          'Sperren Sie Ihre Kreditkarte sofort bei Verlust'
        ],
        insurance_info: [
          'Nationale Krankenversicherung abschließen (국민건강보험)',
          'Zusätzliche Studierendenversicherung empfohlen',
          'Versicherungsschutz im Voraus prüfen',
          'Krankenhäusern Karte mitbringen'
        ],
        embassy_contacts: [
          'Kontaktdaten der eigenen Botschaft speichern',
          'Konsulardienste kennen',
          'Passverlust der Botschaft melden',
          'Langzeitaufenthalt bei den Behörden melden'
        ]
      }
    },
    {
      id: 'living-etiquette',
      title: '🤝 Lebensregeln und Etikette in Korea',
      category: 'Kultur/Etikette',
      description: 'Do’s & Don’ts und kulturelle Gepflogenheiten in Korea',
      details: {
        apartment_rules: [
          'Nach 22 Uhr Lärm vermeiden (Fernsehen, Musik, Schritte)',
          'Mülltrennung strikt einhalten',
          'Gemeinschaftsräume nach Benutzung reinigen',
          'Im Aufzug Älteren und Höherrangigen Platz machen',
          'Parkregeln beachten'
        ],
        noise_etiquette: [
          'Späte Telefonate vermeiden',
          'Türen leise schließen',
          'Zeitfenster für Haartrockner und Waschmaschine beachten',
          'Drinnen keine Straßenschuhe tragen'
        ],
        garbage_disposal: {
          'Restmüll': 'Weißer Müllbeutel (kostenpflichtig, 2–3 Mal/Woche Abholung)',
          'Recycling': 'Getrennte Entsorgung — Plastik, Glas, Papier, Dosen',
          'Bioabfall': 'Gelber Bioabfallbeutel oder spezielle Behälter',
          'Sperrmüll': 'Vorher anmelden und Sticker kaufen'
        },
        neighbor_relations: [
          'Beim Einzug Nachbarn grüßen (z. B. Reiskuchen schenken)',
          'Lärmbelästigung mit den Etagen darüber/darunter vermeiden',
          'Beim Verlassen des Hauses darauf achten, ob jemand hinter Ihnen ist',
          'Pakete der Nachbarn entgegennehmen',
          'Bei Bedarf Hilfe von Nachbarn erbitten'
        ],
        public_spaces: [
          'Im U-Bahn-Wagen älteren Menschen und Schwangeren Platz machen',
          'Keine lauten Telefongespräche in öffentlichen Verkehrsmitteln führen',
          'Auf Raucherzonen im Freien achten',
          'Reste von Speisen in Restaurants vermeiden',
          'Keinen Müll in öffentlichen Bereichen wegwerfen'
        ],
        cultural_tips: [
          'Gegenstände an Ältere mit beiden Händen übergeben und entgegennehmen',
          'Sich mit der koreanischen Trinkkultur vertraut machen',
          'Hierarchiedenken basierend auf Alter respektieren',
          'Bei einer Einweihungsparty (집들이) gerne Toilettenpapier oder Waschmittel als Geschenk mitbringen',
          'Traditionelle Feiertage wie Seollal (Neujahr) und Chuseok (Erntedankfest) beachten'
        ]
      }
    }
  ];
  
  
  
  // Spanish version (Español)
  // ------------------------
  
  export const spanishResidenceContent: FloatingBallContent[] = [
    {
      id: 'dormitory-guide',
      title: '🏫 Guía completa de dormitorios para estudiantes internacionales',
      category: 'Vivienda/Alojamiento',
      description: 'Todo sobre los dormitorios universitarios en Corea: desde la solicitud hasta la vida diaria',
      details: {
        application: [
          'Solicitud en línea en la página web de la universidad (generalmente en febrero-marzo y agosto-septiembre)',
          'Criterios de selección: distancia, calificaciones, situación económica, orden de solicitud',
          'Documentos necesarios: carta de admisión, copia del pasaporte, certificado médico, prueba de fondos'
        ],
        dormitory_types: [
          'Residencia internacional (solo para extranjeros) – numerosos programas de intercambio cultural',
          'Residencia general (con coreanos) – oportunidad de practicar coreano',
          'Opciones de dormitorio individual, habitación doble o dormitorio para cuatro'
        ],
        facilities: [
          'Equipamiento básico: cama, escritorio, armario, aire acondicionado',
          'Lavandería compartida, sala de secado, sala de descanso',
          'Comedor, tienda de conveniencia, cafetería (normalmente en el mismo edificio)',
          'Wi-Fi e internet gratuitos'
        ],
        cost: [
          '800,000 a 1,500,000 KRW por semestre (para habitación doble)',
          'Comida no incluida (aprox. 250,000 KRW al mes en el comedor)',
          'Depósito 100,000 a 300,000 KRW (se devuelve al desocupar)'
        ],
        living_tips: [
          'Familiarizarse con las reglas del dormitorio (prohibido beber, fumar, registro de salidas nocturnas, etc.)',
          'Comunicarte con tu compañero de habitación coreano para conocer la cultura local',
          'Participar en actividades del dormitorio para hacer amigos'
        ]
      }
    },
    {
      id: 'room-hunting',
      title: '🔍 Guía perfecta para buscar estudio/오피스텔',
      category: 'Vivienda/Alojamiento',
      description: 'Sistema de alquiler mensual en Corea y consejos para buscar vivienda',
      details: {
        housing_types: {
          'Estudio (원룸)': 'Espacio único con cocina y baño – depósito de 3,000,000 a 10,000,000 KRW, alquiler mensual 400,000 a 800,000 KRW',
          'Dpto. de dos habitaciones (투룸)': '2 recámaras + sala + cocina + baño – depósito de 5,000,000 a 20,000,000 KRW, alquiler mensual 600,000 a 1,200,000 KRW',
          '오피스텔': 'Estudio + servicio de administración, seguridad – depósito de 5,000,000 a 15,000,000 KRW, alquiler mensual 500,000 a 1,000,000 KRW',
          'Sharehouse (셰어하우스)': 'Habitación privada + espacios compartidos – depósito de 500,000 a 2,000,000 KRW, alquiler mensual 300,000 a 600,000 KRW'
        },
        search_platforms: [
          'Aplicación Zigbang (직방) – la más popular',
          'Aplicación Dabang (다방)',
          'Naver Real Estate (네이버 부동산)',
          'Hoobbang Nono (호갱노노) – ver precios reales de transacción',
          'Visitas directas a inmobiliarias'
        ],
        contract_tips: [
          'Visitar el inmueble antes de firmar el contrato',
          'Verificar la escritura (등기부등본) para confirmar al propietario',
          'Se recomienda contratar un seguro de depósito',
          'Revisar el contrato detenidamente antes de firmar'
        ],
        location_guide: [
          'Cerca de la universidad: a menos de 10 minutos caminando (más caro pero práctico)',
          '1-2 estaciones de metro: a veces más económico aun considerando el transporte',
          'Verificar rutas de autobús: si hay bus directo a la universidad'
        ]
      }
    },
    {
      id: 'rental-contract',
      title: '📋 Lista de verificación del contrato de alquiler – Guía antiestafa',
      category: 'Contrato/Legal',
      description: 'Puntos esenciales para un contrato de alquiler seguro',
      details: {
        before_contract: [
          'Verificar la identificación del propietario',
          'Consultar la escritura (등기부등본) para confirmar la propiedad y posibles hipotecas',
          'Comprobar que la vivienda esté en condiciones habitables',
          'Verificar el ruido, la iluminación, la presión del agua, etc.'
        ],
        contract_checklist: [
          'Duración del contrato (normalmente 1 año)',
          'Monto del depósito/alquiler y fecha de pago',
          'Verificar qué gastos incluyen las expensas',
          'Responsabilidad de reparaciones y mantenimiento',
          'Condiciones de rescisión anticipada',
          'Condiciones para la devolución del depósito'
        ],
        required_docs: [
          'Contrato de alquiler (con sello o firma)',
          'Copia de la identificación',
          'Copia de la tarjeta de registro de extranjero',
          'Comprobante de pago del depósito'
        ],
        protection: [
          'Contratar el seguro de depósito de LH (Korea Land & Housing Corporation)',
          'Guardar una copia del contrato',
          'Pagar el depósito solo por transferencia bancaria',
          'En caso de problemas, llamar al 1372 (Gwangtong News) para denunciar'
        ],
        red_flags: [
          'Solo aceptan efectivo',
          'Se niegan a redactar contrato',
          'No permiten ver la escritura',
          'Precio sospechosamente bajo'
        ]
      }
    },
    {
      id: 'housing-support',
      title: '🏠 Programas de apoyo de vivienda para estudiantes extranjeros',
      category: 'Apoyo/Beneficios',
      description: 'Programas de vivienda ofrecidos por el gobierno y el sector privado',
      details: {
        government_support: {
          'Programa K-Housing': 'Korea Land & Housing Corporation (LH) – viviendas para estudiantes extranjeros al 80 % del precio de mercado',
          'Sharehouse de Seúl para extranjeros': 'Ciudad de Seúl – alquiler mensual 300,000 a 500,000 KRW, depósito mínimo',
          'Programas universitarios de alojamiento': 'Oficina internacional de cada universidad – estudios con descuento cerca de la universidad'
        },
        private_support: [
          'Inmobiliarias especializadas en extranjeros (asistencia multilingüe)',
          'Empresas de Sharehouse internacionales',
          'Comunidades de vivienda para estudiantes'
        ],
        application: [
          'Contactar la oficina internacional de tu universidad',
          'Visitar la página web de K-Housing de LH',
          'Asesoría en el Seoul Global Center'
        ],
        tips: [
          'Periodo de solicitud: desde 3 meses antes del inicio del curso',
          'Registrar en lista de espera recomendado',
          'Solicitar en varios programas simultáneamente'
        ]
      }
    },
    {
      id: 'living-essentials',
      title: '🛒 Guía de compra de artículos de uso diario en Corea',
      category: 'Artículos de hogar/Compras',
      description: 'Cómo comprar artículos esenciales de manera económica',
      details: {
        essential_items: [
          'Ropa de cama (edredón, almohada, sábanas)',
          'Utensilios de cocina (ollas, sartenes, vajilla)',
          'Artículos de higiene (detergente, champú, papel higiénico)',
          'Electrodomésticos (refrigerador, lavadora, microondas)'
        ],
        shopping_places: {
          'Daiso (다이소)': 'Artículos de hogar 1000~5000 KRW – cadena en todo el país',
          'E-Mart/Homeplus': 'Hipermercados – compra a granel posible',
          'Karrot Market (당근마켓)': 'App de segunda mano – muebles y electrodomésticos baratos',
          'Coupang': 'Entrega rápida – ideal para objetos pesados',
          'IKEA': 'Muebles – requieren montaje, pero económicos y de buen diseño'
        },
        money_saving_tips: [
          'Antes de mudarte, haz una lista de artículos necesarios',
          'Aprovechar la segunda mano (especialmente electrodomésticos)',
          'Aprovechar ofertas estacionales (electrodomésticos en verano/invierno)',
          'Aprovechar días de oferta en grandes supermercados',
          'Comprar en grupo con amigos'
        ],
        delivery_info: [
          'Coupang : entrega al día siguiente, verifica requisitos para envío gratuito',
          'E-Mart Mall : entrega el mismo día en ciertas áreas',
          'Usar casilleros de entrega si no estás en casa'
        ]
      }
    },
    {
      id: 'neighborhood-guide',
      title: '🗺️ Guía del entorno por barrio (centrado en Seúl)',
      category: 'Información local',
      description: 'Características de las zonas universitarias y comparación del costo de vida',
      details: {
        university_areas: {
          'Sinchon/Hongdae (Yonsei, Sogang)': 'Cultura joven, vida nocturna animada – estudio 600,000~1,000,000 KRW',
          'Gangnam (cerca de Hanyang, Soongsil)': 'Transporte conveniente, más caro pero bien equipado – 800,000~1,500,000 KRW',
          'Seongbuk-gu (Korea, Sungkyunkwan)': 'Zona residencial tranquila, renta más económica – 500,000~800,000 KRW',
          'Mapo-gu (Hongik)': 'Ambiente artístico, muchos extranjeros – 600,000~900,000 KRW'
        },
        facilities_check: [
          'Distancia a pie hasta la estación de metro',
          'Acceso a tiendas de conveniencia y supermercados',
          'Ubicación de hospitales y farmacias',
          'Ubicación de bancos y oficinas de correos',
          'Instalaciones 24 horas (PC Bang, lavandería automática, etc.)'
        ],
        safety_tips: [
          'Evitar caminar solo por callejones estrechos a altas horas de la noche',
          'Preferir zonas con muchas cámaras de vigilancia (CCTV)',
          'Identificar la ubicación de estaciones de policía',
          'Para vivir solo, elegir preferiblemente un piso superior al primero'
        ],
        transportation: [
          'Familiarizarse con el mapa del metro',
          'Descargar apps de autobús (Bus Tag, Subway Map)',
          'Verificar rutas de carriles para bicicletas (Servicios como SsangSsang)',
          'Cómo comprar la tarjeta T-money'
        ]
      }
    },
    {
      id: 'foreigner-housing',
      title: '🌍 Servicios de vivienda para extranjeros',
      category: 'Vivienda/Alojamiento',
      description: 'Soluciones de alojamiento sin barrera idiomática y amigables para extranjeros',
      details: {
        global_sharehouses: {
          'BORDERLESS HOUSE': 'Conviven coreanos y extranjeros, intercambio de idiomas – 400,000~700,000 KRW/mes',
          'ZZIM HOUSE': 'Sharehouse solo para extranjeros – 350,000~600,000 KRW/mes',
          'WJ STAY': 'Disponible a corto/largo plazo – 500,000~800,000 KRW/mes'
        },
        services_included: [
          'Asistencia en inglés/chino/japonés',
          'Mobiliario completo',
          'Internet y servicios incluidos',
          'Oficina de administración 24 horas',
          'Programas comunitarios internacionales'
        ],
        pros_cons: {
          'Ventajas': 'Comunicación fácil, fácil hacer amigos, trámites de contrato sin complicaciones',
          'Desventajas': 'Más caro que un estudio normal, privacidad limitada, reglas internas'
        },
        application_process: [
          'Completar formulario en línea',
          'Entrevista por videollamada (coreano/inglés)',
          'Pago de depósito',
          'Coordinar la fecha de mudanza'
        ],
        tips: [
          'Verificar si la duración del contrato es flexible',
          'Solicitar recorrido por la vivienda antes de firmar',
          'Preguntar sobre la proporción de nacionalidades de los residentes'
        ]
      }
    },
    {
      id: 'deposit-system',
      title: '💰 Entender completamente el sistema de depósito y alquiler en Corea',
      category: 'Contrato/Legal',
      description: 'Todo sobre Jeonse, Wolse y Banjeonse',
      details: {
        types_explained: {
          'Jeonse (전세)': 'Depósito grande, sin alquiler mensual (normalmente 70–80 % del valor de la propiedad) – contrato de 2 años',
          'Wolse (월세)': 'Depósito + alquiler mensual – contrato de 1 año',
          'Banjeonse (반전세)': 'Depósito menor que Jeonse + alquiler mensual reducido – contrato de 1–2 años'
        },
        deposit_calculation: [
          'A mayor depósito, menor alquiler mensual',
          'Depósito de 10,000,000 KRW ≈ alquiler mensual 100,000–150,000 KRW',
          'Monto variable según la tasa de interés bancaria'
        ],
        payment_schedule: [
          'Al firmar el contrato : anticipo (10 % del depósito)',
          'Saldo del depósito : pago en la fecha de mudanza',
          'Alquiler mensual : pago el mismo día cada mes (normalmente fin de mes o día 5)'
        ],
        return_conditions: [
          'Depósito devuelto por completo si no hay daños al desocupar',
          'Costos de reparación deducidos si hay daños',
          'Tarifa de limpieza aparte (200,000–300,000 KRW)',
          'Plazo de devolución : dentro de 1 semana tras el desalojo'
        ],
        negotiation_tips: [
          'Negociar depósito más alto para reducir alquiler mensual',
          'Verificar si hay cargos adicionales incluidos',
          'Negociar descuento ajustando la fecha de mudanza',
          'Solicitar descuento por contrato de larga duración'
        ]
      }
    },
    {
      id: 'address-registration',
      title: '📮 Guía completa de registro de dirección',
      category: 'Trámites administrativos',
      description: 'Procedimientos administrativos imprescindibles para vivir en Corea',
      details: {
        address_registration: [
          'Visitar el 주민센터 (centro comunitario) dentro de 30 días tras la mudanza',
          'Documentos necesarios : contrato de alquiler, tarjeta de registro de extranjero, pasaporte',
          'Al mismo tiempo, solicitar el cambio de dirección en la tarjeta de registro de extranjero'
        ],
        procedures: [
          'Ir al mostrador de asuntos locales en el 주민센터',
          'Rellenar el formulario de registro de residencia',
          'Entregar los documentos al funcionario',
          'Cambio de dirección instantáneo en la tarjeta de registro de extranjero',
          'Solicitar certificado de dirección actualizado si se necesita'
        ],
        benefits: [
          'Prueba de dirección al abrir cuenta bancaria, contratar teléfono o Internet',
          'Entrega correcta de correspondencia y paquetes',
          'Acceso a ofertas y descuentos para residentes locales',
          'Respuesta rápida ante emergencias'
        ],
        online_services: [
          'Verificar cambios de dirección en la app Government24 (정부24)',
          'Obtener certificado de domicilio electrónico',
          'Usar servicio de cambio de dirección postal'
        ],
        tips: [
          'Identificar la ubicación del 주민센터 antes de mudarse',
          'Cambiar simultáneamente la titularidad de cuentas de servicios (agua, gas, electricidad)',
          'Actualizar dirección en plataformas de compras en línea de una vez',
          'Modificar dirección bancaria en línea o en sucursal'
        ]
      }
    },
    {
      id: 'living-costs',
      title: '💸 Consejos para ahorrar en el costo de vida en Corea',
      category: 'Presupuesto/Vida diaria',
      description: 'Consejos prácticos de ahorro para estudiantes internacionales',
      details: {
        monthly_budget: {
          'Comida': '200,000–300,000 KRW (cocinando en casa), 400,000–500,000 KRW (comiendo fuera)',
          'Transporte': '50,000–80,000 KRW (abono mensual de transporte)',
          'Comunicación': '30,000–50,000 KRW (plan de teléfono móvil)',
          'Artículos del hogar': '50,000–100,000 KRW',
          'Ocio': '100,000–200,000 KRW'
        },
        food_saving: [
          'Usar el comedor universitario (3,000–5,000 KRW por comida)',
          'Aprovechar descuentos en tiendas de conveniencia por la noche (después de las 22:00)',
          'Días con ofertas en hipermercados (cada dos semanas los martes)',
          'Usar cupones de Coupang Eats, Baedal Minjok',
          'Cocinar en casa para ahorrar en el costo de los ingredientes'
        ],
        shopping_tips: [
          'Usar Karrot Market para compras de segunda mano',
          'Aprovechar puntos de recompensa en tiendas en línea',
          'Verificar descuentos en tarjetas de crédito',
          'Compras al por mayor junto con amigos',
          'Esperar las ofertas de temporada'
        ],
        utility_bills: [
          'Ahorrar energía (facturas de luz y gas)',
          'Usar paquetes combinados de Internet',
          'Comparar planes de telefonía móvil antes de decidir',
          'Usar cuentas bancarias sin comisiones'
        ],
        student_discounts: [
          'Descuentos para estudiantes (cine, cafeterías, transporte)',
          'Aprovechar políticas de descuento para jóvenes',
          'Algunas zonas ofrecen descuentos a turistas extranjeros',
          'Presentar credencial estudiantil para descuentos'
        ]
      }
    },
    {
      id: 'emergency-guide',
      title: '🚨 Guía de emergencias y números útiles',
      category: 'Seguridad/Emergencia',
      description: 'Cómo actuar en caso de emergencia en Corea',
      details: {
        emergency_numbers: [
          '119 – Bomberos y emergencias médicas',
          '112 – Policía',
          '1339 – Centro de información médica de urgencia',
          '1330 – Línea de traducción para turistas extranjeros',
          '1350 – Ministerio de Trabajo y Empleo (asistencia multilingüe)'
        ],
        medical_emergency: [
          'Al llamar al 119, proporcionar una dirección exacta',
          'Tener la tarjeta de registro de extranjero a mano',
          'Verificar la tarjeta de seguro',
          'Hay un copago en caso de atención de emergencia',
          'Se puede solicitar servicio de traducción'
        ],
        natural_disasters: {
          'Terremoto': 'Proteger la cabeza, refugiarse bajo una mesa, mantener las puertas abiertas',
          'Tifón': 'Evitar salir, proteger ventanas, preparar suministros de emergencia',
          'Fuertes lluvias': 'Evitar el metro y pasos subterráneos, atención a posibles deslizamientos'
        },
        crime_prevention: [
          'Evitar caminar solo por callejones estrechos a altas horas de la noche',
          'No exhibir objetos de valor',
          'Asegurarse de cerrar bien puertas y ventanas',
          'Si alguien sospechoso te sigue, dirigirse a lugares concurridos',
          'Bloquear la tarjeta bancaria inmediatamente si se pierde'
        ],
        insurance_info: [
          'Suscribirse al seguro de salud nacional (국민건강보험)',
          'Recomendar un seguro adicional para estudiantes internacionales',
          'Verificar la cobertura del seguro de antemano',
          'Llevar la tarjeta de seguro al hospital'
        ],
        embassy_contacts: [
          'Guardar los contactos de tu embajada',
          'Conocer los servicios consulares',
          'Informar la pérdida del pasaporte en la embajada',
          'Declarar la residencia de larga duración ante las autoridades'
        ]
      }
    },
    {
      id: 'living-etiquette',
      title: '🤝 Reglas y etiqueta en Corea',
      category: 'Cultura/Etiqueta',
      description: 'Costumbres y buenos modales a respetar en Corea',
      details: {
        apartment_rules: [
          'Evitar el ruido después de las 22:00 (TV, música, pasos)',
          'Separar la basura correctamente',
          'Ordenar las áreas comunes tras su uso',
          'Ceder el asiento a personas mayores en el ascensor',
          'Respetar las normas de estacionamiento'
        ],
        noise_etiquette: [
          'Evitar llamadas telefónicas ruidosas tarde en la noche',
          'Cerrar las puertas con cuidado',
          'Respetar horarios para usar secadoras y lavadoras',
          'No caminar con zapatos dentro de la casa'
        ],
        garbage_disposal: {
          'Basura general': 'Bolsa blanca de pago (recogida 2–3 veces/semana)',
          'Reciclaje': 'Separar en plástico, vidrio, papel, latas',
          'Residuos de alimentos': 'Bolsa amarilla especial o contenedor dedicado',
          'Residuos voluminosos': 'Solicitarlo con antelación y comprar pegatina oficial'
        },
        neighbor_relations: [
          'Saludar a los vecinos al mudarse (por ejemplo, ofrecer tteok)',
          'Evitar hacer ruido entre pisos',
          'Al cerrar la puerta, asegurarse de que no haya nadie detrás',
          'Aceptar recibir paquetes de los vecinos',
          'Solicitar ayuda a los vecinos si es necesario'
        ],
        public_spaces: [
          'Ceder el asiento en el metro a ancianos y embarazadas',
          'No hablar en voz alta por teléfono en el transporte público',
          'Tener cuidado al fumar en espacios públicos',
          'No dejar restos de comida en restaurantes',
          'No tirar basura en lugares públicos'
        ],
        cultural_tips: [
          'Entregar y recibir objetos con ambas manos ante personas mayores',
          'Conocer la cultura de bebida en Corea',
          'Respetar la edad y el estatus jerárquico',
          'Regalos para inauguraciones de casa (종들이): pañuelos de papel, detergente',
          'Familiarizarse con festividades tradicionales como Seollal y Chuseok'
        ]
      }
    }
  ];
  
  
  
  // Russian version (Русский)
  // ------------------------
  
  export const russianResidenceContent: FloatingBallContent[] = [
    {
      id: 'dormitory-guide',
      title: '🏫 Полный гид по общежитиям для иностранных студентов',
      category: 'Проживание/Жильё',
      description: 'Всё о университетских общежитиях в Корее: от подачи заявки до проживания',
      details: {
        application: [
          'Онлайн-заявка на сайте университета (обычно в феврале–марте и августе–сентябре)',
          'Критерии отбора: удалённость, академическая успеваемость, финансовое состояние, порядок подачи заявки',
          'Необходимые документы: письмо о зачислении, копия паспорта, медицинская справка, подтверждение средств'
        ],
        dormitory_types: [
          'Международный корпус (только для иностранцев) – множество программ культурного обмена',
          'Обычное общежитие (совместное проживание с корейцами) – возможность практиковать корейский язык',
          'Можно выбрать студию (1-комнатка), двухместную или четырёхместную комнату'
        ],
        facilities: [
          'Базовая мебель: кровать, стол, шкаф, кондиционер',
          'Общая прачечная, комната для сушки, комната отдыха',
          'Столовая, магазин, кафе (обычно в том же здании)',
          'Бесплатный Wi-Fi и интернет'
        ],
        cost: [
          '800,000–1,500,000 KRW за семестр (для двухместной комнаты)',
          'Питание не включено (примерно 250,000 KRW в месяц в столовой)',
          'Залог: 100,000–300,000 KRW (возвращается при выезде)'
        ],
        living_tips: [
          'Изучите правила общежития (запрет алкоголя, курения, регистрация ночных выходов и т. д.)',
          'Общайтесь с корейским соседом по комнате, чтобы узнать культуру',
          'Активно участвуйте в мероприятиях общежития, чтобы заводить друзей'
        ]
      }
    },
    {
      id: 'room-hunting',
      title: '🔍 Полный гид по поиску студии/오피스텔',
      category: 'Проживание/Жильё',
      description: 'Система ежемесячной аренды в Корее и советы по поиску жилья',
      details: {
        housing_types: {
          'Студия (원룸)': 'Комната + кухня + ванная в одном — залог 3 000 000–10 000 000 KRW, аренда 400 000–800 000 KRW/мес',
          'Двухкомнатная (투룸)': '2 спальни + гостиная + кухня + ванная — залог 5 000 000–20 000 000 KRW, аренда 600 000–1 200 000 KRW/мес',
          '오피스텔': 'Студия + охрана/администрация — залог 5 000 000–15 000 000 KRW, аренда 500 000–1 000 000 KRW/мес',
          'Sharehouse (셰어하우스)': 'Личная комната + общие пространства — залог 500 000–2 000 000 KRW, аренда 300 000–600 000 KRW/мес'
        },
        search_platforms: [
          'Приложение Zigbang (직방) — самое популярное',
          'Приложение Dabang (다방)',
          'Naver Недвижимость (네이버 부동산)',
          'Hoobbang Nono (호갱노노) — проверка реальных сделок',
          'Личный визит в агентства недвижимости'
        ],
        contract_tips: [
          'Обязательно осмотреть жильё перед подписанием контракта',
          'Проверить выписку из реестра (등기부등본) для подтверждения права собственности',
          'Рекомендуется оформить страхование залога',
          'Внимательно читать контракт перед подписью'
        ],
        location_guide: [
          'Вблизи университета: не более 10 минут пешком (дороже, но удобно)',
          '1–2 станции метро: иногда дешевле даже с учётом стоимости транспорта',
          'Проверить автобусные маршруты: есть ли прямой автобус до университета'
        ]
      }
    },
    {
      id: 'rental-contract',
      title: '📋 Чеклист для договора аренды — защита от мошенничества',
      category: 'Договор/Право',
      description: 'Ключевые моменты для безопасной аренды жилья',
      details: {
        before_contract: [
          'Проверить удостоверение личности арендодателя',
          'Изучить выписку из реестра (등기부등본) — подтвердить собственника, проверить наличие обременений',
          'Проверить, что жильё в рабочем состоянии',
          'Проверить уровень шума, освещение, давление воды вокруг'
        ],
        contract_checklist: [
          'Срок аренды (обычно 1 год)',
          'Сумма залога/арендной платы и дата платежа',
          'Уточнить, какие коммунальные услуги включены',
          'Ответственность за ремонт и обслуживание',
          'Условия досрочного расторжения',
          'Условия возврата залога'
        ],
        required_docs: [
          'Договор аренды (с печатью или подписью)',
          'Копия удостоверения личности',
          'Копия карты регистрации иностранца',
          'Квитанция об оплате залога'
        ],
        protection: [
          'Оформить страхование залога в LH (Korea Land & Housing Corporation)',
          'Хранить копию договора',
          'Перечислять залог только банковским переводом',
          'В случае конфликтов звонить 1372 (национальная платформа обращений)'
        ],
        red_flags: [
          'Требуют оплату наличными',
          'Отказываются заключить договор',
          'Не позволяют просмотреть выписку из реестра',
          'Слишком низкая цена'
        ]
      }
    },
    {
      id: 'housing-support',
      title: '🏠 Программы поддержки жилья для иностранных студентов',
      category: 'Поддержка/Преимущества',
      description: 'Программы жилья, предлагаемые государством и частным сектором',
      details: {
        government_support: {
          'Программа K-Housing': 'Korea Land & Housing Corporation (LH) — жильё для иностранных студентов по цене 80 % от рыночной',
          'Сеульские Sharehouses для иностранцев': 'Город Сеул — аренда 300 000–500 000 KRW в месяц, минимальный залог',
          'Программы университетского жилья': 'Международный отдел университета — льготные апартаменты рядом с университетом'
        },
        private_support: [
          'Агентства по недвижимости для иностранцев (многоязычная поддержка)',
          'Международные компании Sharehouse',
          'Студенческие сообщества по жилью'
        ],
        application: [
          'Обратиться в международный отдел университета',
          'Посетить сайт K-Housing LH',
          'Консультация в Seoul Global Center'
        ],
        tips: [
          'Подача заявок возможна за 3 месяца до начала семестра',
          'Рекомендуется записаться в лист ожидания',
          'Можно подавать заявки одновременно в несколько программ'
        ]
      }
    },
    {
      id: 'living-essentials',
      title: '🛒 Гид по покупке предметов первой необходимости в Корее',
      category: 'Товары для дома/Покупки',
      description: 'Как недорого покупать необходимые предметы быта',
      details: {
        essential_items: [
          'Постельные принадлежности (одеяло, подушка, простыни)',
          'Кухонная утварь (кастрюли, сковородки, посуда)',
          'Предметы гигиены (стиральный порошок, шампунь, туалетная бумага)',
          'Бытовая техника (холодильник, стиральная машина, микроволновка)'
        ],
        shopping_places: {
          'Daiso (다이소)': 'Товары для дома 1000–5000 KRW — по всей стране',
          'E-Mart/Homeplus': 'Гипермаркеты — возможность одновременной оптовой покупки',
          'Karrot Market (당근마켓)': 'Приложение для покупки б/у — недорогая техника',
          'Coupang': 'Онлайн-доставка — идеально для тяжёлых предметов',
          'IKEA': 'Мебель — сборка обязательна, но цены выгодные и дизайн стильный'
        },
        money_saving_tips: [
          'Составить список нужных предметов до переезда',
          'Активно использовать вторичный рынок (особенно бытовую технику)',
          'Следить за сезонными акциями (бытовая техника летом/зимой)',
          'Покупать оптом в гипермаркетах',
          'Объединяться с друзьями для совместных покупок'
        ],
        delivery_info: [
          'Coupang — доставка на следующий день, проверить условия бесплатной доставки',
          'E-Mart Mall — доставка в тот же день в некоторых районах',
          'Если дома никого нет, использовать автоматические ячейки для посылок'
        ]
      }
    },
    {
      id: 'neighborhood-guide',
      title: '🗺️ Гид по районам (Сеул в центре внимания)',
      category: 'Информация по районам',
      description: 'Особенности университетских районов и сравнение стоимости жизни',
      details: {
        university_areas: {
          'Синчхон/Хонгдэ (Yonsei, Sogang)': 'Молодёжная культура, бурная ночная жизнь — студия 600,000–1,000,000 KRW',
          'Каннам (рядом с Hanyang, Soongsil)': 'Удобный транспорт, дороже, но хорошая инфраструктура — 800,000–1,500,000 KRW',
          'Сонбук-гу (Korea, Sungkyunkwan)': 'Тихий жилой район, относительно дешево — 500,000–800,000 KRW',
          'Мапхо-гу (Hongik)': 'Арт-культура, много иностранцев — 600,000–900,000 KRW'
        },
        facilities_check: [
          'Расстояние до станции метро пешком',
          'Близость магазинов и супермаркетов',
          'Расположение больниц и аптек',
          'Расположение банков и почты',
          'Доступность круглосуточных заведений (PC Bang, прачечная)'
        ],
        safety_tips: [
          'Не ходить одному по узким улочкам поздно ночью',
          'Предпочтительнее районы с большим количеством камер видеонаблюдения',
          'Узнать расположение полицейских участков',
          'Для одинокого проживания лучше выбирать второй этаж и выше'
        ],
        transportation: [
          'Изучить схему метро',
          'Установить приложения для автобусов (Bus Tag, Subway Map)',
          'Проверить велосипедные дорожки (приложения вроде SsangSsang)',
          'Как купить карту T-money'
        ]
      }
    },
    {
      id: 'foreigner-housing',
      title: '🌍 Жильё, ориентированное на иностранцев',
      category: 'Проживание/Жильё',
      description: 'Дружелюбные к иностранцам решения без языковых барьеров',
      details: {
        global_sharehouses: {
          'BORDERLESS HOUSE': 'Соседи корейцы и иностранцы, языковой обмен — 400,000–700,000 KRW/мес',
          'ZZIM HOUSE': 'Sharehouse только для иностранцев — 350,000–600,000 KRW/мес',
          'WJ STAY': 'Возможна краткосрочная и долгосрочная аренда — 500,000–800,000 KRW/мес'
        },
        services_included: [
          'Поддержка на английском/китайском/японском языках',
          'Полностью меблировано',
          'Включены интернет и коммунальные услуги',
          'Круглосуточная служба управления',
          'Международные общественные программы'
        ],
        pros_cons: {
          'Преимущества': 'Лёгкое общение, быстро найти друзей, упрощённые договорные процедуры',
          'Недостатки': 'Дороже, чем обычная студия, ограниченная приватность, правила внутреннего распорядка'
        },
        application_process: [
          'Заполнить онлайн-заявку',
          'Собеседование по видеосвязи (корейский/английский)',
          'Внести депозит',
          'Согласовать дату въезда'
        ],
        tips: [
          'Уточнить, возможна ли гибкая продолжительность договора',
          'Записаться на просмотр жилья заранее',
          'Узнать процентное соотношение национальностей жителей'
        ]
      }
    },
    {
      id: 'deposit-system',
      title: '💰 Полное понимание системы залога и аренды в Корее',
      category: 'Договор/Право',
      description: 'Всё о Jeonse, Wolse и Banjeonse',
      details: {
        types_explained: {
          'Jeonse (전세)': 'Высокий залог, никакой ежемесячной платы (обычно 70–80 % от стоимости недвижимости) — договор на 2 года',
          'Wolse (월세)': 'Залог + ежемесячная плата — договор на 1 год',
          'Banjeonse (반전세)': 'Ниже залог, чем при Jeonse + небольшая месячная плата — договор на 1–2 года'
        },
        deposit_calculation: [
          'Чем выше залог, тем ниже ежемесячная плата',
          'Залог 10,000,000 KRW ≈ плата 100,000–150,000 KRW/мес',
          'Сумма зависит от банковской процентной ставки'
        ],
        payment_schedule: [
          'При подписании договора : аванс (10 % от залога)',
          'Остаток залога : оплата в день въезда',
          'Месячная плата : оплата в фиксированную дату каждый месяц (обычно в конце месяца или 5-го числа)'
        ],
        return_conditions: [
          'Полное возвращение залога при нормальном выезде',
          'Вычет стоимости ремонта при наличии повреждений',
          'Отдельная плата за уборку (200,000–300,000 KRW)',
          'Срок возврата: в течение недели после выезда'
        ],
        negotiation_tips: [
          'Попробуйте увеличить залог, чтобы уменьшить месячную плату',
          'Уточнить, включены ли коммунальные платежи',
          'Согласовать скидку, изменив дату въезда',
          'Попросить скидку при заключении долгосрочного контракта'
        ]
      }
    },
    {
      id: 'address-registration',
      title: '📮 Полный гид по регистрации адреса',
      category: 'Административные процедуры',
      description: 'Необходимые административные процедуры для проживания в Корее',
      details: {
        address_registration: [
          'В течение 30 дней после въезда посетить 주민센터 (районный центр)',
          'Необходимые документы : договор аренды, карта регистрации иностранца, паспорт',
          'Одновременно изменить адрес на карте регистрации иностранца'
        ],
        procedures: [
          'Посетить окно для подачи заявлений в 주민센터',
          'Заполнить форму регистрации проживания',
          'Передать документы чиновнику',
          'Мгновенное изменение адреса на карте регистрации иностранца',
          'По желанию получить подтверждение нового адреса'
        ],
        benefits: [
          'Подтверждение адреса для банка, телефона, интернета',
          'Правильная доставка почты и посылок',
          'Местные льготы для жителей (скидки на общественные услуги)',
          'Быстрый отклик в экстренных ситуациях'
        ],
        online_services: [
          'Просмотр изменений адреса через приложение Government24 (정부24)',
          'Получение выписки о месте жительства в электронном виде',
          'Использование службы изменения адреса для почты'
        ],
        tips: [
          'Уточнить расположение 주민센터 до переезда',
          'Одновременно сменить владельца счетов за воду, газ и электричество',
          'Изменить адрес на платформах онлайн-покупок',
          'Изменить адрес в банке онлайн или через отделение'
        ]
      }
    },
    {
      id: 'living-costs',
      title: '💸 Советы по экономии жизненных расходов в Корее',
      category: 'Бюджет/Быт',
      description: 'Практические советы по экономии для иностранных студентов',
      details: {
        monthly_budget: {
          'Питание': '200,000–300,000 KRW (готовка дома), 400,000–500,000 KRW (питание вне дома)',
          'Транспорт': '50,000–80,000 KRW (месячный проездной)',
          'Связь': '30,000–50,000 KRW (мобильный тариф)',
          'Бытовые товары': '50,000–100,000 KRW',
          'Досуг': '100,000–200,000 KRW'
        },
        food_saving: [
          'Пользоваться студенческим столом (3,000–5,000 KRW за приём пищи)',
          'Скидки в магазинах после 22:00',
          'Дни распродаж в гипермаркетах (каждые две недели во вторник)',
          'Использовать купоны Coupang Eats, Baedal Minjok',
          'Готовить дома, чтобы экономить на ингредиентах'
        ],
        shopping_tips: [
          'Покупать на Karrot Market (б/у)',
          'Накопление бонусов в интернет-магазинах',
          'Проверять скидки по кредитным картам',
          'Объединяться в группу с друзьями для оптовых покупок',
          'Ждать сезонных распродаж'
        ],
        utility_bills: [
          'Экономить электроэнергию и газ',
          'Пользоваться пакетами со скидкой для интернета',
          'Сравнивать мобильные тарифы',
          'Открыть банковский счёт без комиссии'
        ],
        student_discounts: [
          'Скидки для студентов (кино, кафе, транспорт)',
          'Использовать молодежные скидки',
          'Некоторые регионы предлагают скидки для иностранных туристов',
          'Предъявлять студенческий билет для скидок'
        ]
      }
    },
    {
      id: 'emergency-guide',
      title: '🚨 Руководство по чрезвычайным ситуациям и экстренным номерам',
      category: 'Безопасность/Чрезвычайные ситуации',
      description: 'Как действовать в случае экстренных ситуаций в Корее',
      details: {
        emergency_numbers: [
          '119 — пожарная служба, скорая помощь',
          '112 — полиция',
          '1339 — центр неотложной медицинской помощи',
          '1330 — служба перевода для туристов',
          '1350 — Министерство труда и занятости (многоязычная поддержка)'
        ],
        medical_emergency: [
          'При вызове 119 сообщить точный адрес',
          'Иметь при себе карту иностранца',
          'Проверить карту страхования',
          'При обращении в скорую возможно частичное покрытие расходов самим пациентом',
          'Можно запросить услуги переводчика'
        ],
        natural_disasters: {
          'Землетрясение': 'Защитить голову, укрыться под столом, держать дверь открытой',
          'Тайфун': 'Избегать выхода на улицу, защищать окна, подготовить аварийный набор',
          'Сильные дожди': 'Избегать метро и подземных переходов, быть осторожным при угрозе оползней'
        },
        crime_prevention: [
          'Не ходить в одиночку по узким улочкам поздно ночью',
          'Не демонстрировать ценные вещи',
          'Тщательно запирать двери и окна',
          'Если замечен подозрительный человек, идти в людные места',
          'Немедленно заблокировать банковскую карту в случае её утраты'
        ],
        insurance_info: [
          'Обязательно иметь национальное медицинское страхование (국민건강보험)',
          'Рекомендуется дополнительное страхование для студентов',
          'Заранее уточнить условия страхового покрытия',
          'При обращении в больницу иметь при себе страховую карту'
        ],
        embassy_contacts: [
          'Сохранить контакты посольства своей страны',
          'Знать порядок пользования консульскими услугами',
          'Об утрате паспорта сообщать в посольство',
          'Проводить регистрацию для долгосрочного пребывания'
        ]
      }
    },
    {
      id: 'living-etiquette',
      title: '🤝 Правила жизни и этикет в Корее',
      category: 'Культура/Этикет',
      description: 'Правила поведения и культурные нормы, которые следует соблюдать в Корее',
      details: {
        apartment_rules: [
          'Избегать шума после 22:00 (телевизор, музыка, шаги)',
          'Строго соблюдать сортировку отходов',
          'Убирать за собой после использования общих пространств',
          'В лифте уступать место пожилым',
          'Соблюдать правила парковки'
        ],
        noise_etiquette: [
          'Избегать громких телефонных разговоров поздно вечером',
          'Осторожно закрывать двери',
          'Соблюдать время пользования феном и стиральной машиной',
          'Не ходить в помещении в уличной обуви'
        ],
        garbage_disposal: {
          'Бытовые отходы': 'Белый платный пакет (вывоз 2–3 раза в неделю)',
          'Перерабатываемые материалы': 'Сортировать — пластик, стекло, бумага, банки',
          'Пищевые отходы': 'Жёлтый пакет для пищевых отходов или специальный контейнер',
          'Крупногабаритный мусор': 'Нужно заранее заявить и купить марку'
        },
        neighbor_relations: [
          'При переезде поздороваться с соседями (например, подарить рисовые пирожные)',
          'Учитывать шум между этажами',
          'При выходе из дома убедиться, что за вами никто не идёт',
          'Принимать посылки от соседей',
          'Обращаться за помощью к соседям при необходимости'
        ],
        public_spaces: [
          'В метро уступать место пожилым и беременным',
          'Избегать громких разговоров по телефону в общественном транспорте',
          'Обращать внимание на зоны для курения на улице',
          'Не оставлять остатки еды в ресторанах',
          'Не разбрасывать мусор в общественных местах'
        ],
        cultural_tips: [
          'Передавать и принимать предметы обеими руками перед старшими',
          'Изучить традиции застолий с алкоголем',
          'Уважать возраст и иерархию',
          'На housewarming приносить гостинцы (туалетная бумага, моющее средство)',
          'Ознакомиться с праздниками Сольналь (Новый год) и Чусок (Праздник урожая)'
        ]
      }
    }
  ];
  