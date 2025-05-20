/**
 * 온보딩에서 사용할 관심사 태그 데이터
 */
// 대분류
export const mainCategories = [
    { id: 'travel', name: '여행' },
    { id: 'living', name: '주거' },
    { id: 'study', name: '유학' },
    { id: 'job', name: '취업' },
];
// 커뮤니티 관련 태그 (소분류)
export const communityTags = {
    travel: ['관광/체험', '식도락/맛집', '교통/이동', '숙소/지역정보', '대사관/응급'],
    living: ['부동산/계약', '생활환경/편의', '문화/생활', '주거지 관리/유지'],
    study: ['학사/캠퍼스', '학업지원/시설', '행정/비자/서류', '기숙사/주거'],
    job: ['이력/채용준비', '비자/법률/노동', '잡페어/네트워킹', '알바/파트타임'],
};
// 토론/뉴스 관련 카테고리
export const debateCategories = [
    { id: 'politics', name: '정치/사회' },
    { id: 'economy', name: '경제' },
    { id: 'culture', name: '생활/문화' },
    { id: 'science', name: '과학/기술' },
    { id: 'sports', name: '스포츠' },
    { id: 'entertainment', name: '엔터테인먼트' },
];
// 언어 능력 레벨
export const languageLevels = [
    { id: 'none', name: '전혀 모름', description: '한국어를 전혀 모릅니다' },
    { id: 'basic', name: '기초', description: '인사와 간단한 표현 정도만 할 수 있습니다' },
    { id: 'intermediate', name: '중급', description: '일상 대화가 가능합니다' },
    { id: 'advanced', name: '고급', description: '복잡한 대화도 가능합니다' },
    { id: 'fluent', name: '유창함', description: '한국어를 능숙하게 구사합니다' },
];
// 온보딩에서 사용할 모든 관심사 태그 (커뮤니티 + 토론 + 일반)
export const interestTags = [
    // 일반 관심사
    { id: 'food', name: '한국 음식' },
    { id: 'language', name: '한국어 배우기' },
    { id: 'culture', name: '문화 체험' },
    { id: 'travel', name: '국내 여행' },
    { id: 'kpop', name: 'K-pop/엔터테인먼트' },
    { id: 'friends', name: '친구 사귀기' },
    { id: 'history', name: '역사/전통' },
    { id: 'technology', name: '기술/스타트업' },
    { id: 'art', name: '예술/디자인' },
    { id: 'sports', name: '스포츠/레저' },
    { id: 'fashion', name: '패션/뷰티' },
    { id: 'business', name: '비즈니스/취업' },
    { id: 'education', name: '교육' },
    { id: 'healthcare', name: '의료/건강' },
    { id: 'housing', name: '주거/부동산' },
    { id: 'finance', name: '금융/법률' },
    { id: 'transportation', name: '교통/여행' },
    { id: 'shopping', name: '쇼핑' },
    { id: 'events', name: '축제/이벤트' },
    { id: 'nightlife', name: '나이트라이프' },
    // 커뮤니티 태그 추가
    { id: 'tourism', name: '관광/체험' },
    { id: 'food_tour', name: '식도락/맛집' },
    { id: 'transportation', name: '교통/이동' },
    { id: 'accommodation', name: '숙소/지역정보' },
    { id: 'embassy', name: '대사관/응급' },
    { id: 'realestate', name: '부동산/계약' },
    { id: 'living_env', name: '생활환경/편의' },
    { id: 'cultural_living', name: '문화/생활' },
    { id: 'housing_mgmt', name: '주거지 관리/유지' },
    { id: 'academic', name: '학사/캠퍼스' },
    { id: 'study_support', name: '학업지원/시설' },
    { id: 'admin_visa', name: '행정/비자/서류' },
    { id: 'dormitory', name: '기숙사/주거' },
    { id: 'resume', name: '이력/채용준비' },
    { id: 'visa_law', name: '비자/법률/노동' },
    { id: 'job_networking', name: '잡페어/네트워킹' },
    { id: 'part_time', name: '알바/파트타임' },
    // 토론 카테고리 추가
    { id: 'politics', name: '정치/사회' },
    { id: 'economy', name: '경제' },
    { id: 'life_culture', name: '생활/문화' },
    { id: 'science_tech', name: '과학/기술' },
    { id: 'sports_news', name: '스포츠' },
    { id: 'entertainment_news', name: '엔터테인먼트' },
];
