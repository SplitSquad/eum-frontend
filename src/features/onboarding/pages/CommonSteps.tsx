import React from 'react';
import { Box } from '@mui/material';
import LanguageLevelSelector from '../components/common/LanguageLevelSelector';
import EmergencyInfoForm from '../components/common/EmergencyInfoForm';
import OnboardingTagSelector from '../components/common/TagSelector';
import { interestTags, debateCategories } from '../components/common/CommonTags';

// 공통 스텝에서 사용할 언어 레벨 데이터
export interface LanguageData {
  koreanLevel: string;
  englishLevel?: string;
}

// 공통 스텝에서 사용할 응급 정보 데이터
export interface EmergencyData {
  contact: string;
  medicalConditions: string;
  foodAllergies: string;
  receiveEmergencyAlerts: boolean;
}

// 공통 스텝 타입 (언어, 관심사, 응급상황)
export type CommonStepType = 'language' | 'interests' | 'emergency';

// 공통 단계 컴포넌트 Props
interface CommonStepProps {
  stepType: CommonStepType;
  languageData: LanguageData;
  emergencyData: EmergencyData;
  interests: string[];
  onLanguageChange: (data: LanguageData) => void;
  onEmergencyChange: (data: EmergencyData) => void;
  onInterestsChange: (interests: string[]) => void;
}

/**
 * 온보딩 공통 단계 컴포넌트
 * 언어 능력, 관심사 선택, 응급 상황 설정 단계를 포함
 */
const CommonStep: React.FC<CommonStepProps> = ({
  stepType,
  languageData,
  emergencyData,
  interests,
  onLanguageChange,
  onEmergencyChange,
  onInterestsChange,
}) => {
  // 한국어 레벨 변경 핸들러
  const handleKoreanLevelChange = (level: string) => {
    onLanguageChange({
      ...languageData,
      koreanLevel: level,
    });
  };

  // 응급 연락처 변경 핸들러
  const handleEmergencyContactChange = (contact: string) => {
    onEmergencyChange({
      ...emergencyData,
      contact,
    });
  };

  // 응급 의료 정보 변경 핸들러
  const handleMedicalConditionsChange = (medicalConditions: string) => {
    onEmergencyChange({
      ...emergencyData,
      medicalConditions,
    });
  };

  // 음식 알레르기 변경 핸들러
  const handleFoodAllergiesChange = (foodAllergies: string) => {
    onEmergencyChange({
      ...emergencyData,
      foodAllergies,
    });
  };

  // 알림 수신 여부 변경 핸들러
  const handleReceiveAlertsChange = (receiveEmergencyAlerts: boolean) => {
    onEmergencyChange({
      ...emergencyData,
      receiveEmergencyAlerts,
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
            title="한국어 능력"
            subtitle="본인의 한국어 능력 수준을 선택해주세요. 이 정보는 맞춤형 콘텐츠 추천에 활용됩니다."
          />
        );

      case 'interests':
        // 관심사 태그 준비
        const interestCategories = [
          { id: 'info', name: '정보 관심사' },
          { id: 'community', name: '커뮤니티 주제' },
          { id: 'debate', name: '토론 주제' },
        ];

        return (
          <OnboardingTagSelector
            categories={interestCategories}
            tags={interestTags}
            selectedTags={interests}
            onChange={onInterestsChange}
            maxSelection={10}
            title="관심사 선택"
            description="관심 있는 주제를 선택해주세요. 최대 10개까지 선택 가능합니다."
            grouped={true}
            groupMapping={{
              info: interestTags.slice(23, 31).map(tag => tag.id),
              community: interestTags.slice(0, 17).map(tag => tag.id),
              debate: interestTags.slice(17, 23).map(tag => tag.id),
            }}
          />
        );

      case 'emergency':
        return (
          <EmergencyInfoForm
            emergencyContact={emergencyData.contact}
            medicalConditions={emergencyData.medicalConditions}
            foodAllergies={emergencyData.foodAllergies}
            receiveEmergencyAlerts={emergencyData.receiveEmergencyAlerts}
            onEmergencyContactChange={handleEmergencyContactChange}
            onMedicalConditionsChange={handleMedicalConditionsChange}
            onFoodAllergiesChange={handleFoodAllergiesChange}
            onReceiveEmergencyAlertsChange={handleReceiveAlertsChange}
            title="응급 상황 설정"
            subtitle="한국 체류 중 응급 상황에 대비하기 위한 정보를 입력해주세요. 이 정보는 응급 상황 발생 시 도움을 드리는 데 사용됩니다."
          />
        );

      default:
        return null;
    }
  };

  return <Box>{renderStepContent()}</Box>;
};

export default CommonStep;
