/**
 * 온보딩에서 사용할 관심사 태그 데이터
 */
import { useTranslation } from '@/shared/i18n';
const { t } = useTranslation();
// 대분류
export const mainCategories = [
  { id: 'travel', name: t('mainCategories.travel') },
  { id: 'living', name: t('mainCategories.living') },
  { id: 'study', name: t('mainCategories.study') },
  { id: 'job', name: t('mainCategories.job') },
];

// 커뮤니티 관련 태그 (소분류)
export const communityTags: Record<string, string[]> = {
  travel: [
    t('communityTags.travel.0'),
    t('communityTags.travel.1'),
    t('communityTags.travel.2'),
    t('communityTags.travel.3'),
    t('communityTags.travel.4'),
  ],
  living: [
    t('communityTags.living.0'),
    t('communityTags.living.1'),
    t('communityTags.living.2'),
    t('communityTags.living.3'),
  ],
  study: [
    t('communityTags.study.0'),
    t('communityTags.study.1'),
    t('communityTags.study.2'),
    t('communityTags.study.3'),
  ],
  job: [
    t('communityTags.job.0'),
    t('communityTags.job.1'),
    t('communityTags.job.2'),
    t('communityTags.job.3'),
  ],
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
  {
    id: 'none',
    name: t('languageLevels.none.name'),
    description: t('languageLevels.none.description'),
  },
  {
    id: 'basic',
    name: t('languageLevels.basic.name'),
    description: t('languageLevels.basic.description'),
  },
  {
    id: 'intermediate',
    name: t('languageLevels.intermediate.name'),
    description: t('languageLevels.intermediate.description'),
  },
  {
    id: 'advanced',
    name: t('languageLevels.advanced.name'),
    description: t('languageLevels.advanced.description'),
  },
  {
    id: 'fluent',
    name: t('languageLevels.fluent.name'),
    description: t('languageLevels.fluent.description'),
  },
];

// 온보딩에서 사용할 모든 관심사 태그 (커뮤니티 + 토론 + 정보)
export const interestTags = [
  // Community
  { id: 'tourism', name: t('interestTags.tourism') },
  { id: 'food_tour', name: t('interestTags.food_tour') },
  { id: 'transportation', name: t('interestTags.transportation') },
  { id: 'accommodation', name: t('interestTags.accommodation') },
  { id: 'embassy', name: t('interestTags.embassy') },
  { id: 'realestate', name: t('interestTags.realestate') },
  { id: 'living_env', name: t('interestTags.living_env') },
  { id: 'cultural_living', name: t('interestTags.cultural_living') },
  { id: 'housing_mgmt', name: t('interestTags.housing_mgmt') },
  { id: 'academic', name: t('interestTags.academic') },
  { id: 'study_support', name: t('interestTags.study_support') },
  { id: 'admin_visa', name: t('interestTags.admin_visa') },
  { id: 'dormitory', name: t('interestTags.dormitory') },
  { id: 'resume', name: t('interestTags.resume') },
  { id: 'visa_law', name: t('interestTags.visa_law') },
  { id: 'job_networking', name: t('interestTags.job_networking') },
  { id: 'part_time', name: t('interestTags.part_time') },

  // Debate
  { id: 'politics', name: t('interestTags.politics') },
  { id: 'economy', name: t('interestTags.economy') },
  { id: 'life_culture', name: t('interestTags.life_culture') },
  { id: 'science_tech', name: t('interestTags.science_tech') },
  { id: 'sports_news', name: t('interestTags.sports_news') },
  { id: 'entertainment_news', name: t('interestTags.entertainment_news') },

  // Info
  { id: 'transportation_info', name: t('interestTags.transportation_info') },
  { id: 'visa_legal', name: t('interestTags.visa_legal') },
  { id: 'finance_tax', name: t('interestTags.finance_tax') },
  { id: 'education_info', name: t('interestTags.education_info') },
  { id: 'housing_realestate', name: t('interestTags.housing_realestate') },
  { id: 'healthcare', name: t('interestTags.healthcare') },
  { id: 'shopping_info', name: t('interestTags.shopping_info') },
  { id: 'employment_workplace', name: t('interestTags.employment_workplace') },
];
