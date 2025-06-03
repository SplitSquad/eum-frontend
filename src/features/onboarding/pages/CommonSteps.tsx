import React from 'react';
import { Box } from '@mui/material';
import LanguageLevelSelector from '../components/common/LanguageLevelSelector';
import OnboardingTagSelector from '../components/common/TagSelector';
import { interestTags } from '../components/common/CommonTags';
import { useTranslation } from '@/shared/i18n';

// 공통 스텝에서 사용할 언어 레벨 데이터
export interface LanguageData {
  koreanLevel: string;
  englishLevel?: string;
}

// 공통 스텝 타입 (언어, 관심사)
export type CommonStepType = 'language' | 'interests';

// 공통 단계 컴포넌트 Props
interface CommonStepProps {
  stepType: CommonStepType;
  languageData: LanguageData;
  interests: string[];
  onLanguageChange: (data: LanguageData) => void;
  onInterestsChange: (interests: string[]) => void;
}

/**
 * 온보딩 공통 단계 컴포넌트
 * 언어 능력, 관심사 선택 단계를 포함
 */
const CommonStep: React.FC<CommonStepProps> = ({
  stepType,
  languageData,
  interests,
  onLanguageChange,
  onInterestsChange,
}) => {
  const { t } = useTranslation();
  
  // 한국어 레벨 변경 핸들러
  const handleKoreanLevelChange = (level: string) => {
    onLanguageChange({
      ...languageData,
      koreanLevel: level,
    });
  };

  // 현재 스텝에 따라 다른 컴포넌트 렌더링
  const renderStepContent = () => {
    switch (stepType) {
      case 'language':
        return (
          <LanguageLevelSelector
            value={languageData.koreanLevel}
            onChange={handleKoreanLevelChange}
            title={t('onboarding.common.language.title')}
            subtitle={t('onboarding.common.language.subtitle')}
          />
        );

      case 'interests':
        // 관심사 태그 준비
        const interestCategories = [
          { id: 'info', name: t('onboarding.common.interests.categories.info') },
          { id: 'community', name: t('onboarding.common.interests.categories.community') },
          { id: 'debate', name: t('onboarding.common.interests.categories.debate') },
        ];

        return (
          <OnboardingTagSelector
            categories={interestCategories}
            tags={interestTags}
            selectedTags={interests}
            onChange={onInterestsChange}
            maxSelection={10}
            title={t('onboarding.common.interests.title')}
            description={t('onboarding.common.interests.description')}
            grouped={true}
            groupMapping={{
              info: interestTags.slice(23, 31).map(tag => tag.id),
              community: interestTags.slice(0, 17).map(tag => tag.id),
              debate: interestTags.slice(17, 23).map(tag => tag.id),
            }}
          />
        );

      default:
        return null;
    }
  };

  return <Box>{renderStepContent()}</Box>;
};

export default CommonStep;
