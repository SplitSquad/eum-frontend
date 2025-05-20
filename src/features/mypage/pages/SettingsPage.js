import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { useState } from 'react';
import { PageLayout, InfoCard, FormField, StyledInput, StyledSelect, Button } from '../components';
import styled from '@emotion/styled';
import LogoutButton from '../../auth/components/LogoutButton';
// 스타일 컴포넌트
const PageContainer = styled.div `
  padding: 20px 0;
`;
const SettingItem = styled.div `
  margin-bottom: 24px;
`;
const ToggleSwitch = styled.label `
  position: relative;
  display: inline-block;
  width: 48px;
  height: 24px;
  margin-right: 10px;
`;
const ToggleInput = styled.input `
  opacity: 0;
  width: 0;
  height: 0;

  &:checked + span {
    background-color: #FF9999;
  }

  &:checked + span:before {
    transform: translateX(24px);
  }
`;
const ToggleSlider = styled.span `
  position: absolute;
  cursor: pointer;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-color: #ccc;
  transition: 0.4s;
  border-radius: 24px;

  &:before {
    position: absolute;
    content: "";
    height: 18px;
    width: 18px;
    left: 3px;
    bottom: 3px;
    background-color: white;
    transition: 0.4s;
    border-radius: 50%;
  }
`;
const SettingLabel = styled.span `
  font-weight: 500;
  margin-right: 8px;
  display: inline-block;
  vertical-align: middle;
`;
const SettingDescription = styled.p `
  color: #666;
  margin: 8px 0 0 0;
  font-size: 0.875rem;
`;
const ButtonGroup = styled.div `
  display: flex;
  justify-content: flex-end;
  margin-top: 32px;
  gap: 12px;
`;
const DangerZone = styled.div `
  border: 1px solid #ffcccc;
  border-radius: 8px;
  padding: 16px;
  background-color: #fff8f8;
  margin-top: 16px;
`;
const DangerTitle = styled.h3 `
  color: #e53935;
  margin-top: 0;
  margin-bottom: 12px;
  font-size: 1.1rem;
`;
const DangerDescription = styled.p `
  color: #666;
  margin: 8px 0 16px 0;
  font-size: 0.875rem;
`;
const LogoutButtonContainer = styled.div `
  display: flex;
  margin-top: 16px;
`;
/**
 * 마이페이지 - 설정 페이지
 * 사용자의 계정, 알림, 개인정보 등의 설정을 관리합니다.
 */
const SettingsPage = () => {
    // 상태 관리
    const [settings, setSettings] = useState({
        emailNotifications: true,
        activityUpdates: false,
        marketingEmails: false,
        darkMode: false,
        language: 'ko',
        timezone: 'Asia/Seoul',
    });
    // 설정 변경 핸들러
    const handleToggleChange = (e) => {
        const { name, checked } = e.target;
        setSettings({
            ...settings,
            [name]: checked,
        });
    };
    // 선택 설정 변경 핸들러
    const handleSelectChange = (e) => {
        const { name, value } = e.target;
        setSettings({
            ...settings,
            [name]: value,
        });
    };
    // 설정 저장 핸들러
    const handleSave = () => {
        console.log('설정 저장:', settings);
        // TODO: API 호출로 설정 저장
        alert('설정이 저장되었습니다.');
    };
    return (_jsx(PageLayout, { title: "\uC124\uC815", children: _jsxs(PageContainer, { children: [_jsxs(InfoCard, { title: "\uC54C\uB9BC \uC124\uC815", children: [_jsxs(SettingItem, { children: [_jsxs(ToggleSwitch, { children: [_jsx(ToggleInput, { type: "checkbox", name: "emailNotifications", checked: settings.emailNotifications, onChange: handleToggleChange }), _jsx(ToggleSlider, {})] }), _jsx(SettingLabel, { children: "\uC774\uBA54\uC77C \uC54C\uB9BC" }), _jsx(SettingDescription, { children: "\uC911\uC694 \uC54C\uB9BC \uBC0F \uC5C5\uB370\uC774\uD2B8 \uC815\uBCF4\uB97C \uC774\uBA54\uC77C\uB85C \uBC1B\uC2B5\uB2C8\uB2E4." })] }), _jsxs(SettingItem, { children: [_jsxs(ToggleSwitch, { children: [_jsx(ToggleInput, { type: "checkbox", name: "activityUpdates", checked: settings.activityUpdates, onChange: handleToggleChange }), _jsx(ToggleSlider, {})] }), _jsx(SettingLabel, { children: "\uD65C\uB3D9 \uC5C5\uB370\uC774\uD2B8" }), _jsx(SettingDescription, { children: "\uB0B4 \uAC8C\uC2DC\uBB3C\uC5D0 \uB313\uAE00\uC774\uB098 \uC88B\uC544\uC694\uAC00 \uB2EC\uB9B4 \uB54C \uC54C\uB9BC\uC744 \uBC1B\uC2B5\uB2C8\uB2E4." })] }), _jsxs(SettingItem, { children: [_jsxs(ToggleSwitch, { children: [_jsx(ToggleInput, { type: "checkbox", name: "marketingEmails", checked: settings.marketingEmails, onChange: handleToggleChange }), _jsx(ToggleSlider, {})] }), _jsx(SettingLabel, { children: "\uB9C8\uCF00\uD305 \uC774\uBA54\uC77C" }), _jsx(SettingDescription, { children: "\uD2B9\uBCC4 \uC774\uBCA4\uD2B8, \uCD94\uCC9C \uCF58\uD150\uCE20 \uBC0F \uD504\uB85C\uBAA8\uC158 \uC815\uBCF4\uB97C \uBC1B\uC2B5\uB2C8\uB2E4." })] })] }), _jsxs(InfoCard, { title: "\uD45C\uC2DC \uC124\uC815", children: [_jsxs(SettingItem, { children: [_jsxs(ToggleSwitch, { children: [_jsx(ToggleInput, { type: "checkbox", name: "darkMode", checked: settings.darkMode, onChange: handleToggleChange }), _jsx(ToggleSlider, {})] }), _jsx(SettingLabel, { children: "\uB2E4\uD06C \uBAA8\uB4DC" }), _jsx(SettingDescription, { children: "\uC5B4\uB450\uC6B4 \uD14C\uB9C8\uB97C \uC0AC\uC6A9\uD569\uB2C8\uB2E4. (\uBBF8\uB9AC\uBCF4\uAE30)" })] }), _jsx(SettingItem, { children: _jsx(FormField, { label: "\uC5B8\uC5B4", htmlFor: "language", children: _jsxs(StyledSelect, { id: "language", name: "language", value: settings.language, onChange: handleSelectChange, children: [_jsx("option", { value: "ko", children: "\uD55C\uAD6D\uC5B4" }), _jsx("option", { value: "en", children: "English" }), _jsx("option", { value: "ja", children: "\u65E5\u672C\u8A9E" }), _jsx("option", { value: "zh", children: "\u4E2D\u6587" })] }) }) }), _jsx(SettingItem, { children: _jsx(FormField, { label: "\uC2DC\uAC04\uB300", htmlFor: "timezone", children: _jsxs(StyledSelect, { id: "timezone", name: "timezone", value: settings.timezone, onChange: handleSelectChange, children: [_jsx("option", { value: "Asia/Seoul", children: "\uC11C\uC6B8 (GMT+9)" }), _jsx("option", { value: "America/New_York", children: "\uB274\uC695 (GMT-5)" }), _jsx("option", { value: "Europe/London", children: "\uB7F0\uB358 (GMT+0)" }), _jsx("option", { value: "Asia/Tokyo", children: "\uB3C4\uCFC4 (GMT+9)" })] }) }) })] }), _jsxs(InfoCard, { title: "\uACC4\uC815 \uAD00\uB9AC", children: [_jsx(SettingItem, { children: _jsxs(FormField, { label: "\uC774\uBA54\uC77C \uC8FC\uC18C", htmlFor: "email", children: [_jsx(StyledInput, { id: "email", type: "email", placeholder: "\uC774\uBA54\uC77C \uC8FC\uC18C", disabled: true, value: "user@example.com" // This should be the actual user's email
                                     }), _jsx(SettingDescription, { children: "\uC774\uBA54\uC77C \uC8FC\uC18C\uB294 \uBCC0\uACBD\uD560 \uC218 \uC5C6\uC2B5\uB2C8\uB2E4." })] }) }), _jsxs(DangerZone, { children: [_jsx(DangerTitle, { children: "\uB85C\uADF8\uC544\uC6C3" }), _jsx(DangerDescription, { children: "\uD604\uC7AC \uACC4\uC815\uC5D0\uC11C \uB85C\uADF8\uC544\uC6C3\uD569\uB2C8\uB2E4. \uB2E4\uC2DC \uB85C\uADF8\uC778\uD558\uB824\uBA74 \uC778\uC99D \uC815\uBCF4\uAC00 \uD544\uC694\uD569\uB2C8\uB2E4." }), _jsx(LogoutButtonContainer, { children: _jsx(LogoutButton, { variant: "button", size: "medium" }) })] })] }), _jsxs(ButtonGroup, { children: [_jsx(Button, { type: "button", variant: "outline", children: "\uCDE8\uC18C" }), _jsx(Button, { type: "button", onClick: handleSave, variant: "primary", children: "\uC800\uC7A5" })] })] }) }));
};
export default SettingsPage;
