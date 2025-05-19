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
    background-color: #ff9999;
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
  border: 1px solid #ffcccc;
  border-radius: 8px;
  padding: 16px;
  background-color: #fff8f8;
  margin-top: 16px;
`;

const DangerTitle = styled.h3`
  color: #e53935;
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
const DebateManagePage: React.FC = () => {
  return 'Debate Manage Page';
};

export default DebateManagePage;
