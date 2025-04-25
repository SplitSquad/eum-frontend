import React, { useEffect, useState } from 'react';
import {
  PageLayout,
  ProfileCard,
  InfoCard,
  FormField,
  StyledInput,
  StyledTextarea,
  Button
} from '../components';
import { useMypageStore } from '../store/mypageStore';
import styled from '@emotion/styled';

// 스타일링된 컴포넌트 - 나중에 디자인 변경 시 이 부분만 수정
const PageContainer = styled.div`
  padding: 20px 0;
`;

const ProfileSection = styled.div`
  display: grid;
  grid-template-columns: 1fr 2fr;
  gap: 24px;
  margin-bottom: 24px;
  
  @media (max-width: 768px) {
    grid-template-columns: 1fr;
    gap: 40px;
  }
`;

const ProfileActions = styled.div`
  width: 100%;
  margin-top: 16px;
`;

const ProfileInfoSection = styled.div`
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 16px;
  
  @media (max-width: 768px) {
    grid-template-columns: 1fr;
  }
`;

const FieldGroup = styled.div`
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 16px;
  
  @media (max-width: 768px) {
    grid-template-columns: 1fr;
  }
`;

const StyledFormField = styled(FormField)`
  margin-bottom: 16px;
`;

const ReadOnlyValue = styled.div`
  padding: 12px 16px;
  border: 1px solid #f0f0f0;
  border-radius: 8px;
  font-size: 0.875rem;
  background-color: #f9f9f9;
`;

const LoadingWrapper = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  height: 200px;
`;

const Spinner = styled.div`
  width: 40px;
  height: 40px;
  border: 3px solid rgba(0, 0, 0, 0.1);
  border-radius: 50%;
  border-top-color: #FF9999;
  animation: spin 1s linear infinite;
  
  @keyframes spin {
    to {
      transform: rotate(360deg);
    }
  }
`;

const ErrorMessage = styled.div`
  text-align: center;
  padding: 20px;
  color: #e53e3e;
  margin: 20px 0;
`;

/**
 * 마이페이지 - 프로필 페이지
 * 사용자 프로필 정보를 표시하고 수정할 수 있습니다.
 */
const ProfilePage: React.FC = () => {
  const { 
    profile,
    profileLoading,
    profileError,
    profileUpdateLoading,
    profileUpdateError,
    profileUpdated,
    fetchProfile,
    updateProfile,
    resetProfileUpdateStatus
  } = useMypageStore();

  // 로컬 상태
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    introduction: '',
    country: '',
    language: ''
  });

  // 프로필 데이터 로드
  useEffect(() => {
    fetchProfile();
  }, [fetchProfile]);

  // 프로필 데이터가 로드되면 폼 데이터 업데이트
  useEffect(() => {
    if (profile) {
      setFormData({
        name: profile.name,
        email: profile.email,
        introduction: profile.introduction || '',
        country: profile.country || '',
        language: profile.language || ''
      });
    }
  }, [profile]);

  // 프로필 업데이트 성공 시 편집 모드 종료
  useEffect(() => {
    if (profileUpdated) {
      setIsEditing(false);
      resetProfileUpdateStatus();
    }
  }, [profileUpdated, resetProfileUpdateStatus]);

  // 입력 핸들러
  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  // 폼 제출 핸들러
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    updateProfile(formData);
  };

  // 편집 취소 핸들러
  const handleCancel = () => {
    if (profile) {
      setFormData({
        name: profile.name,
        email: profile.email,
        introduction: profile.introduction || '',
        country: profile.country || '',
        language: profile.language || ''
      });
    }
    setIsEditing(false);
  };

  // 로딩 상태
  if (profileLoading === 'loading' && !profile) {
    return (
      <PageLayout title="내 프로필">
        <LoadingWrapper>
          <Spinner />
        </LoadingWrapper>
      </PageLayout>
    );
  }

  // 에러 상태
  if (profileError && profileLoading === 'error') {
    return (
      <PageLayout title="내 프로필">
        <ErrorMessage>
          <p>{profileError}</p>
          <Button 
            onClick={() => fetchProfile()}
            variant="primary"
            className="mt-4"
          >
            다시 시도
          </Button>
        </ErrorMessage>
      </PageLayout>
    );
  }

  return (
    <PageLayout title="내 프로필">
      <PageContainer>
        <form onSubmit={handleSubmit}>
          <ProfileSection>
            {/* 왼쪽: 프로필 카드 */}
            <ProfileCard
              profileImage={profile?.profileImage}
              name={profile?.name || ''}
              role={profile?.role || '사용자'}
              email={profile?.email || ''}
            >
              <ProfileActions>
                {isEditing ? (
                  <>
                    <Button 
                      type="button" 
                      variant="outline" 
                      onClick={handleCancel}
                      disabled={profileUpdateLoading === 'loading'}
                    >
                      취소
                    </Button>
                    <Button 
                      type="submit" 
                      variant="primary" 
                      isLoading={profileUpdateLoading === 'loading'}
                      className="ml-2"
                    >
                      {profileUpdateLoading === 'loading' ? '저장 중...' : '저장하기'}
                    </Button>
                  </>
                ) : (
                  <Button 
                    type="button" 
                    variant="primary" 
                    onClick={() => setIsEditing(true)}
                    fullWidth
                  >
                    프로필 수정
                  </Button>
                )}
              </ProfileActions>
            </ProfileCard>

            {/* 오른쪽: 상세 정보 */}
            <InfoCard title="기본 정보" noPadding>
              <ProfileInfoSection>
                <StyledFormField label="이름" htmlFor="name">
                  {isEditing ? (
                    <StyledInput
                      id="name"
                      name="name"
                      value={formData.name}
                      onChange={handleChange}
                    />
                  ) : (
                    <ReadOnlyValue>{profile?.name}</ReadOnlyValue>
                  )}
                </StyledFormField>

                <StyledFormField label="이메일" htmlFor="email">
                  <ReadOnlyValue>{profile?.email}</ReadOnlyValue>
                </StyledFormField>

                <StyledFormField label="가입일" htmlFor="joinDate">
                  <ReadOnlyValue>{profile?.joinDate}</ReadOnlyValue>
                </StyledFormField>

                <StyledFormField label="역할" htmlFor="role">
                  <ReadOnlyValue>{profile?.role || '일반 사용자'}</ReadOnlyValue>
                </StyledFormField>
              </ProfileInfoSection>
            </InfoCard>
          </ProfileSection>

          {/* 추가 정보 */}
          <InfoCard title="추가 정보" noPadding>
            <FieldGroup>
              <StyledFormField label="국적" htmlFor="country">
                {isEditing ? (
                  <StyledInput
                    id="country"
                    name="country"
                    value={formData.country}
                    onChange={handleChange}
                    placeholder="국적을 입력하세요"
                  />
                ) : (
                  <ReadOnlyValue>
                    {profile?.country || '설정되지 않음'}
                  </ReadOnlyValue>
                )}
              </StyledFormField>

              <StyledFormField label="주 사용 언어" htmlFor="language">
                {isEditing ? (
                  <StyledInput
                    id="language"
                    name="language"
                    value={formData.language}
                    onChange={handleChange}
                    placeholder="주 사용 언어를 입력하세요"
                  />
                ) : (
                  <ReadOnlyValue>
                    {profile?.language || '설정되지 않음'}
                  </ReadOnlyValue>
                )}
              </StyledFormField>
            </FieldGroup>

            <StyledFormField label="자기소개" htmlFor="introduction">
              {isEditing ? (
                <StyledTextarea
                  id="introduction"
                  name="introduction"
                  value={formData.introduction}
                  onChange={handleChange}
                  placeholder="자기소개를 입력하세요"
                  rows={4}
                />
              ) : (
                <ReadOnlyValue>
                  {profile?.introduction || '자기소개가 없습니다.'}
                </ReadOnlyValue>
              )}
            </StyledFormField>
          </InfoCard>

          {/* 업데이트 에러 메시지 */}
          {profileUpdateError && (
            <ErrorMessage>
              {profileUpdateError}
            </ErrorMessage>
          )}
        </form>
      </PageContainer>
    </PageLayout>
  );
};

export default ProfilePage; 