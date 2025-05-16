import { jsx as _jsx } from "react/jsx-runtime";
import { Box } from '@mui/material';
import LanguageLevelSelector from '../components/common/LanguageLevelSelector';
import EmergencyInfoForm from '../components/common/EmergencyInfoForm';
import OnboardingTagSelector from '../components/common/TagSelector';
import { interestTags } from '../components/common/CommonTags';
/**
 * 온보딩 공통 단계 컴포넌트
 * 언어 능력, 관심사 선택, 응급 상황 설정 단계를 포함
 */
const CommonStep = ({ stepType, languageData, emergencyData, interests, onLanguageChange, onEmergencyChange, onInterestsChange, }) => {
    // 한국어 레벨 변경 핸들러
    const handleKoreanLevelChange = (level) => {
        onLanguageChange({
            ...languageData,
            koreanLevel: level,
        });
    };
    // 응급 연락처 변경 핸들러
    const handleEmergencyContactChange = (contact) => {
        onEmergencyChange({
            ...emergencyData,
            contact,
        });
    };
    // 응급 의료 정보 변경 핸들러
    const handleMedicalConditionsChange = (medicalConditions) => {
        onEmergencyChange({
            ...emergencyData,
            medicalConditions,
        });
    };
    // 음식 알레르기 변경 핸들러
    const handleFoodAllergiesChange = (foodAllergies) => {
        onEmergencyChange({
            ...emergencyData,
            foodAllergies,
        });
    };
    // 알림 수신 여부 변경 핸들러
    const handleReceiveAlertsChange = (receiveEmergencyAlerts) => {
        onEmergencyChange({
            ...emergencyData,
            receiveEmergencyAlerts,
        });
    };
    // 현재 스텝에 따라 다른 컴포넌트 렌더링
    const renderStepContent = () => {
        switch (stepType) {
            case 'language':
                return (_jsx(LanguageLevelSelector, { value: languageData.koreanLevel, onChange: handleKoreanLevelChange, title: "\uD55C\uAD6D\uC5B4 \uB2A5\uB825", subtitle: "\uBCF8\uC778\uC758 \uD55C\uAD6D\uC5B4 \uB2A5\uB825 \uC218\uC900\uC744 \uC120\uD0DD\uD574\uC8FC\uC138\uC694. \uC774 \uC815\uBCF4\uB294 \uB9DE\uCDA4\uD615 \uCF58\uD150\uCE20 \uCD94\uCC9C\uC5D0 \uD65C\uC6A9\uB429\uB2C8\uB2E4." }));
            case 'interests':
                // 관심사 태그 준비
                const interestCategories = [
                    { id: 'basic', name: '일반 관심사' },
                    { id: 'community', name: '커뮤니티 주제' },
                    { id: 'debate', name: '토론 주제' },
                ];
                return (_jsx(OnboardingTagSelector, { categories: interestCategories, tags: interestTags, selectedTags: interests, onChange: onInterestsChange, maxSelection: 10, title: "\uAD00\uC2EC\uC0AC \uC120\uD0DD", description: "\uAD00\uC2EC \uC788\uB294 \uC8FC\uC81C\uB97C \uC120\uD0DD\uD574\uC8FC\uC138\uC694. \uCD5C\uB300 10\uAC1C\uAE4C\uC9C0 \uC120\uD0DD \uAC00\uB2A5\uD569\uB2C8\uB2E4.", grouped: true, groupMapping: {
                        basic: interestTags.slice(0, 20).map(tag => tag.id),
                        community: interestTags.slice(20, 37).map(tag => tag.id),
                        debate: interestTags.slice(37).map(tag => tag.id),
                    } }));
            case 'emergency':
                return (_jsx(EmergencyInfoForm, { emergencyContact: emergencyData.contact, medicalConditions: emergencyData.medicalConditions, foodAllergies: emergencyData.foodAllergies, receiveEmergencyAlerts: emergencyData.receiveEmergencyAlerts, onEmergencyContactChange: handleEmergencyContactChange, onMedicalConditionsChange: handleMedicalConditionsChange, onFoodAllergiesChange: handleFoodAllergiesChange, onReceiveEmergencyAlertsChange: handleReceiveAlertsChange, title: "\uC751\uAE09 \uC0C1\uD669 \uC124\uC815", subtitle: "\uD55C\uAD6D \uCCB4\uB958 \uC911 \uC751\uAE09 \uC0C1\uD669\uC5D0 \uB300\uBE44\uD558\uAE30 \uC704\uD55C \uC815\uBCF4\uB97C \uC785\uB825\uD574\uC8FC\uC138\uC694. \uC774 \uC815\uBCF4\uB294 \uC751\uAE09 \uC0C1\uD669 \uBC1C\uC0DD \uC2DC \uB3C4\uC6C0\uC744 \uB4DC\uB9AC\uB294 \uB370 \uC0AC\uC6A9\uB429\uB2C8\uB2E4." }));
            default:
                return null;
        }
    };
    return _jsx(Box, { children: renderStepContent() });
};
export default CommonStep;
