import React, { useState } from 'react';
import { PageLayout, InfoCard, FormField, StyledInput, StyledSelect, Button } from '../components';
import styled from '@emotion/styled';
import LogoutButton from '../../auth/components/LogoutButton';

// 스타일 컴포넌트
const PageContainer = styled.div`
  padding: 20px 0;
`;

const SettingItem = styled.div`
  margin-bottom: 24px;
`;

const ToggleSwitch = styled.label`
  position: relative;
  display: inline-block;
  width: 48px;
  height: 24px;
  margin-right: 10px;
`;

const ToggleInput = styled.input`
  opacity: 0;
  width: 0;
  height: 0;

  &:checked + span {
    background-color: rgb(179, 179, 179);
  }

  &:checked + span:before {
    transform: translateX(24px);
  }
`;

const ToggleSlider = styled.span`
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
    content: '';
    height: 18px;
    width: 18px;
    left: 3px;
    bottom: 3px;
    background-color: white;
    transition: 0.4s;
    border-radius: 50%;
  }
`;

const SettingLabel = styled.span`
  font-weight: 500;
  margin-right: 8px;
  display: inline-block;
  vertical-align: middle;
`;

const SettingDescription = styled.p`
  color: #666;
  margin: 8px 0 0 0;
  font-size: 0.875rem;
`;

const ButtonGroup = styled.div`
  display: flex;
  justify-content: flex-end;
  margin-top: 32px;
  gap: 12px;
`;

const DangerZone = styled.div`
  border: 1px solid #e5e7eb;
  border-radius: 8px;
  padding: 16px;
  background-color: #fafafa;
  margin-top: 16px;
`;

const DangerTitle = styled.h3`
  color: #222;
  margin-top: 0;
  margin-bottom: 12px;
  font-size: 1.1rem;
`;

const DangerDescription = styled.p`
  color: #666;
  margin: 8px 0 16px 0;
  font-size: 0.875rem;
`;

const LogoutButtonContainer = styled.div`
  display: flex;
  margin-top: 16px;
`;

/**
 * 마이페이지 - 설정 페이지
 * 사용자의 계정, 알림, 개인정보 등의 설정을 관리합니다.
 */
const SettingsPage: React.FC = () => {
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
  const handleToggleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, checked } = e.target;
    setSettings({
      ...settings,
      [name]: checked,
    });
  };

  // 선택 설정 변경 핸들러
  const handleSelectChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
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

  return (
    <PageLayout title="설정">
      <PageContainer>
        <InfoCard title="알림 설정">
          <SettingItem>
            <ToggleSwitch>
              <ToggleInput
                type="checkbox"
                name="emailNotifications"
                checked={settings.emailNotifications}
                onChange={handleToggleChange}
              />
              <ToggleSlider />
            </ToggleSwitch>
            <SettingLabel>이메일 알림</SettingLabel>
            <SettingDescription>중요 알림 및 업데이트 정보를 이메일로 받습니다.</SettingDescription>
          </SettingItem>

          <SettingItem>
            <ToggleSwitch>
              <ToggleInput
                type="checkbox"
                name="activityUpdates"
                checked={settings.activityUpdates}
                onChange={handleToggleChange}
              />
              <ToggleSlider />
            </ToggleSwitch>
            <SettingLabel>활동 업데이트</SettingLabel>
            <SettingDescription>
              내 게시물에 댓글이나 좋아요가 달릴 때 알림을 받습니다.
            </SettingDescription>
          </SettingItem>

          <SettingItem>
            <ToggleSwitch>
              <ToggleInput
                type="checkbox"
                name="marketingEmails"
                checked={settings.marketingEmails}
                onChange={handleToggleChange}
              />
              <ToggleSlider />
            </ToggleSwitch>
            <SettingLabel>마케팅 이메일</SettingLabel>
            <SettingDescription>
              특별 이벤트, 추천 콘텐츠 및 프로모션 정보를 받습니다.
            </SettingDescription>
          </SettingItem>
        </InfoCard>

        <InfoCard title="표시 설정">
          <SettingItem>
            <ToggleSwitch>
              <ToggleInput
                type="checkbox"
                name="darkMode"
                checked={settings.darkMode}
                onChange={handleToggleChange}
              />
              <ToggleSlider />
            </ToggleSwitch>
            <SettingLabel>다크 모드</SettingLabel>
            <SettingDescription>어두운 테마를 사용합니다. (미리보기)</SettingDescription>
          </SettingItem>

          <SettingItem>
            <FormField label="언어" htmlFor="language">
              <StyledSelect
                id="language"
                name="language"
                value={settings.language}
                onChange={handleSelectChange}
              >
                <option value="ko">한국어</option>
                <option value="en">English</option>
                <option value="ja">日本語</option>
                <option value="zh">中文</option>
              </StyledSelect>
            </FormField>
          </SettingItem>

          <SettingItem>
            <FormField label="시간대" htmlFor="timezone">
              <StyledSelect
                id="timezone"
                name="timezone"
                value={settings.timezone}
                onChange={handleSelectChange}
              >
                <option value="Asia/Seoul">서울 (GMT+9)</option>
                <option value="America/New_York">뉴욕 (GMT-5)</option>
                <option value="Europe/London">런던 (GMT+0)</option>
                <option value="Asia/Tokyo">도쿄 (GMT+9)</option>
              </StyledSelect>
            </FormField>
          </SettingItem>
        </InfoCard>

        <InfoCard title="계정 관리">
          <SettingItem>
            <FormField label="이메일 주소" htmlFor="email">
              <StyledInput
                id="email"
                type="email"
                placeholder="이메일 주소"
                disabled
                value="user@example.com" // This should be the actual user's email
              />
              <SettingDescription>이메일 주소는 변경할 수 없습니다.</SettingDescription>
            </FormField>
          </SettingItem>

          <DangerZone>
            <DangerTitle>로그아웃</DangerTitle>
            <DangerDescription>
              현재 계정에서 로그아웃합니다. 다시 로그인하려면 인증 정보가 필요합니다.
            </DangerDescription>
            <LogoutButtonContainer>
              <LogoutButton variant="button" size="medium" />
            </LogoutButtonContainer>
          </DangerZone>
        </InfoCard>

        <ButtonGroup>
          <Button type="button" variant="outline">
            취소
          </Button>
          <Button type="button" onClick={handleSave} variant="primary">
            저장
          </Button>
        </ButtonGroup>
      </PageContainer>
    </PageLayout>
  );
};

export default SettingsPage;
