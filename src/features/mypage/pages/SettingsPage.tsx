import React, { useState, useEffect } from 'react';
import { PageLayout, InfoCard, FormField, StyledInput, StyledSelect, Button } from '../components';
import styled from '@emotion/styled';
import { useAuthStore } from '../../auth/store/authStore';
import { useMypageStore } from '../store/mypageStore';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogContentText,
  DialogActions,
  Alert,
  Snackbar,
} from '@mui/material';
import apiClient from '../../../config/axios';

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

const ActionButtonContainer = styled.div`
  display: flex;
  margin-top: 16px;
`;

const DangerButton = styled(Button)`
  background-color: #dc3545;
  color: white;
  border: 1px solid #dc3545;

  &:hover {
    background-color: #c82333;
    border-color: #bd2130;
  }

  &:disabled {
    background-color: #6c757d;
    border-color: #6c757d;
  }
`;

// 회원탈퇴 확인 다이얼로그 스타일
const StyledDialog = styled(Dialog)`
  .MuiDialog-paper {
    border-radius: 12px;
    padding: 8px;
  }
`;

/**
 * 마이페이지 - 설정 페이지
 * 사용자의 계정, 알림, 개인정보 등의 설정을 관리합니다.
 */
const SettingsPage: React.FC = () => {
  const { user } = useAuthStore();
  const { profile, fetchProfile } = useMypageStore();

  // 상태 관리
  const [settings, setSettings] = useState({
    emailNotifications: true,
    activityUpdates: false,
    marketingEmails: false,
    darkMode: false,
    language: 'ko',
    timezone: 'Asia/Seoul',
  });

  // 회원탈퇴 관련 상태
  const [withdrawDialogOpen, setWithdrawDialogOpen] = useState(false);
  const [confirmText, setConfirmText] = useState('');
  const [withdrawLoading, setWithdrawLoading] = useState(false);
  const [withdrawError, setWithdrawError] = useState<string | null>(null);
  const [withdrawSuccess, setWithdrawSuccess] = useState(false);

  // 프로필 정보 로드
  useEffect(() => {
    if (user?.userId && !profile) {
      fetchProfile();
    }
  }, [user?.userId, profile, fetchProfile]);

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

  // 회원탈퇴 처리
  const handleWithdraw = async () => {
    if (confirmText !== '회원탈퇴') {
      setWithdrawError('확인 텍스트를 정확히 입력해주세요.');
      return;
    }

    setWithdrawLoading(true);
    setWithdrawError(null);

    try {
      // 회원탈퇴 API 호출 - apiClient 사용
      await apiClient.delete('/auth/delete');

      // 성공 시 처리
      setWithdrawSuccess(true);
      setWithdrawDialogOpen(false);

      // 로컬 데이터 정리
      localStorage.removeItem('auth_token');
      localStorage.removeItem('refresh_token');
      localStorage.removeItem('userEmail');
      localStorage.removeItem('userName');
      localStorage.removeItem('userRole');

      // 로그인 페이지로 리다이렉트
      setTimeout(() => {
        window.location.href = '/google-login';
      }, 2000);
    } catch (error: any) {
      console.error('회원탈퇴 실패:', error);

      // 에러 응답에서 메시지 추출
      const errorMessage =
        error.response?.data?.message ||
        error.response?.data?.error ||
        error.message ||
        '회원탈퇴 처리에 실패했습니다.';

      setWithdrawError(errorMessage);
    } finally {
      setWithdrawLoading(false);
    }
  };

  return (
    <PageLayout title="설정">
      <PageContainer>
        <InfoCard title="계정 관리">
          <SettingItem>
            <FormField label="이메일 주소" htmlFor="email">
              <StyledInput
                id="email"
                type="email"
                placeholder="이메일 주소"
                disabled
                value={profile?.email || user?.email || ''}
              />
              <SettingDescription>이메일 주소는 현재 변경할 수 없습니다.</SettingDescription>
            </FormField>
          </SettingItem>

          <DangerZone>
            <DangerTitle>회원탈퇴</DangerTitle>
            <DangerDescription>
              계정을 영구적으로 삭제합니다. 이 작업은 되돌릴 수 없으며, 모든 데이터가 삭제됩니다.
            </DangerDescription>
            <ActionButtonContainer>
              <DangerButton
                type="button"
                variant="outline"
                onClick={() => setWithdrawDialogOpen(true)}
                disabled={withdrawLoading}
              >
                회원탈퇴
              </DangerButton>
            </ActionButtonContainer>
          </DangerZone>
        </InfoCard>

        {/* 회원탈퇴 확인 다이얼로그 */}
        <StyledDialog
          open={withdrawDialogOpen}
          onClose={() => setWithdrawDialogOpen(false)}
          maxWidth="sm"
          fullWidth
        >
          <DialogTitle sx={{ color: '#dc3545', fontWeight: 600 }}>
            정말로 회원탈퇴를 하시겠습니까?
          </DialogTitle>
          <DialogContent>
            <DialogContentText sx={{ mb: 2 }}>
              이 작업은 되돌릴 수 없습니다. 계정과 모든 데이터가 영구적으로 삭제됩니다:
            </DialogContentText>
            <DialogContentText sx={{ mb: 2, color: '#dc3545' }}>
              • 프로필 정보 및 설정
              <br />
              • 작성한 게시글 및 댓글
              <br />
              • 북마크 및 활동 기록
              <br />• 모든 개인 데이터
            </DialogContentText>
            <DialogContentText sx={{ mb: 2, fontWeight: 600 }}>
              계속하려면 아래에 "회원탈퇴"를 정확히 입력해주세요:
            </DialogContentText>
            <StyledInput
              value={confirmText}
              onChange={e => setConfirmText(e.target.value)}
              placeholder="회원탈퇴"
              disabled={withdrawLoading}
              style={{ width: '100%' }}
            />
            {withdrawError && (
              <Alert severity="error" sx={{ mt: 2 }}>
                {withdrawError}
              </Alert>
            )}
          </DialogContent>
          <DialogActions>
            <Button
              onClick={() => {
                setWithdrawDialogOpen(false);
                setConfirmText('');
                setWithdrawError(null);
              }}
              variant="outline"
              disabled={withdrawLoading}
            >
              취소
            </Button>
            <DangerButton
              onClick={handleWithdraw}
              disabled={withdrawLoading || confirmText !== '회원탈퇴'}
              isLoading={withdrawLoading}
            >
              {withdrawLoading ? '처리 중...' : '회원탈퇴'}
            </DangerButton>
          </DialogActions>
        </StyledDialog>

        {/* 성공 메시지 */}
        <Snackbar
          open={withdrawSuccess}
          autoHideDuration={6000}
          onClose={() => setWithdrawSuccess(false)}
          anchorOrigin={{ vertical: 'top', horizontal: 'center' }}
        >
          <Alert severity="success" sx={{ width: '100%' }}>
            회원탈퇴가 완료되었습니다. 로그인 페이지로 이동합니다.
          </Alert>
        </Snackbar>
      </PageContainer>
    </PageLayout>
  );
};

export default SettingsPage;
