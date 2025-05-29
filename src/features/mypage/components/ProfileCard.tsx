import React, { useRef } from 'react';
import styled from '@emotion/styled';
import { IconButton, CircularProgress, Box } from '@mui/material';
import PhotoCameraIcon from '@mui/icons-material/PhotoCamera';
import DeleteIcon from '@mui/icons-material/Delete';
import PersonIcon from '@mui/icons-material/Person';

interface ProfileCardProps {
  profileImage?: string;
  name: string;
  role: string;
  email: string;
  children?: React.ReactNode;
  className?: string;
  onImageUpload?: (file: File) => Promise<void>;
  onImageDelete?: () => Promise<void>;
  isImageLoading?: boolean;
  isEditing?: boolean;
}

// 스타일링된 컴포넌트 - 나중에 디자인 변경 시 이 부분만 수정
const CardContainer = styled.div`
  background: white;
  border-radius: 12px;
  overflow: hidden;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.05);
  width: 100%;
  position: relative;
  z-index: 1;
  transition: all 0.3s ease;
  
  &:hover {
    box-shadow: 0 8px 20px rgba(0, 0, 0, 0.1);
    transform: translateY(-3px);
  }
`;

const CardHeader = styled.div`
  background: linear-gradient(135deg, #FFD1D1 0%, #FF9999 100%);
  height: 80px;
  position: relative;
`;

const ProfileContent = styled.div`
  padding: 60px 20px 20px;
  display: flex;
  flex-direction: column;
  align-items: center;
  text-align: center;
`;

const ProfileImageContainer = styled.div`
  position: absolute;
  top: 30px;
  left: 50%;
  transform: translateX(-50%);
`;

const ProfileImageWrapper = styled.div<{ isEditing: boolean }>`
  position: relative;
  display: inline-block;
  
  ${props => props.isEditing && `
    &:hover .image-overlay {
      opacity: 1;
    }
    
    &:hover .action-buttons {
      opacity: 1;
      transform: translateY(0);
    }
  `}
`;

const ProfileImage = styled.div<{ hasImage: boolean }>`
  width: 100px;
  height: 100px;
  border-radius: 50%;
  overflow: hidden;
  border: 4px solid white;
  box-shadow: 0 4px 10px rgba(0, 0, 0, 0.1);
  background: ${props => props.hasImage ? 'white' : '#f5f5f5'};
  transition: all 0.3s ease;
  position: relative;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  
  &:hover {
    transform: scale(1.02);
    box-shadow: 0 6px 15px rgba(0, 0, 0, 0.15);
  }
`;

const Image = styled.img`
  width: 100%;
  height: 100%;
  object-fit: cover;
`;

const DefaultAvatar = styled.div`
  width: 100%;
  height: 100%;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  background: linear-gradient(135deg, #f0f0f0 0%, #e0e0e0 100%);
  color: #999;
  transition: all 0.3s ease;
`;

const ImageOverlay = styled.div`
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.4);
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 50%;
  opacity: 0;
  transition: opacity 0.3s ease;
  color: white;
  font-size: 12px;
  font-weight: 500;
`;

const ActionButtons = styled(Box)`
  position: absolute;
  bottom: -45px;
  left: 50%;
  transform: translateX(-50%) translateY(10px);
  display: flex;
  gap: 8px;
  opacity: 0;
  transition: all 0.3s ease;
  z-index: 10;
`;

const ActionButton = styled(IconButton)`
  background: white !important;
  border: 2px solid #FF9999 !important;
  color: #FF9999 !important;
  width: 36px !important;
  height: 36px !important;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.15) !important;
  transition: all 0.2s ease !important;
  
  &:hover {
    background: #FF9999 !important;
    color: white !important;
    transform: scale(1.1);
    box-shadow: 0 4px 12px rgba(255, 153, 153, 0.4) !important;
  }
  
  &:disabled {
    background: #f5f5f5 !important;
    border-color: #ddd !important;
    color: #999 !important;
  }
  
  &.delete-button {
    border-color: #f44336 !important;
    color: #f44336 !important;
    
    &:hover {
      background: #f44336 !important;
      color: white !important;
    }
  }
`;

const LoadingOverlay = styled.div`
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(255, 255, 255, 0.9);
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  border-radius: 50%;
  z-index: 20;
`;

const UploadHint = styled.div`
  font-size: 10px;
  margin-top: 4px;
  opacity: 0.8;
`;

const Name = styled.h2`
  font-size: 1.5rem;
  font-weight: 600;
  margin: 0 0 4px;
  color: #333;
`;

const Role = styled.div`
  font-size: 0.875rem;
  color: white;
  background-color: #FF9999;
  padding: 2px 10px;
  border-radius: 12px;
  display: inline-block;
  margin-bottom: 8px;
  transition: all 0.3s ease;
  
  &:hover {
    background-color: #FF7777;
    transform: translateY(-2px);
  }
`;

const Email = styled.div`
  font-size: 0.875rem;
  color: #888;
  margin-bottom: 16px;
`;

const ChildrenWrapper = styled.div`
  width: 100%;
  margin-top: 4px;
`;

const HiddenFileInput = styled.input`
  display: none;
`;

const ProfileCard: React.FC<ProfileCardProps> = ({
  profileImage,
  name,
  role,
  email,
  children,
  className,
  onImageUpload,
  onImageDelete,
  isImageLoading = false,
  isEditing = false
}) => {
  const fileInputRef = useRef<HTMLInputElement>(null);

  const hasImage = Boolean(profileImage && profileImage.trim());

  const handleImageUploadClick = () => {
    fileInputRef.current?.click();
  };

  const handleFileChange = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file && onImageUpload) {
      try {
        await onImageUpload(file);
      } catch (error) {
        console.error('업로드에 실패했습니다. 다시 시도해 주세요', error);
      }
    }
    
    // 파일 input 초기화
    event.target.value = '';
  };

  const handleImageDelete = async () => {
    if (onImageDelete) {
      try {
        await onImageDelete();
      } catch (error) {
        console.error('삭제에 실패했습니다. 다시 시도해 주세요', error);
      }
    }
  };

  return (
    <CardContainer className={className}>
      <CardHeader />
      
      <ProfileContent>
        <ProfileImageContainer>
          <ProfileImageWrapper isEditing={isEditing}>
            <ProfileImage 
              hasImage={hasImage}
              onClick={isEditing ? handleImageUploadClick : undefined}
            >
              {hasImage ? (
                <Image 
                  src={profileImage} 
                  alt={`${name}의 프로필 이미지`}
                  onError={(e) => {
                    console.error('프로필 이미지 로드 실패:', profileImage);
                  }}
                />
              ) : (
                <DefaultAvatar>
                  <PersonIcon sx={{ fontSize: 32 }} />
                  {isEditing && (
                    <UploadHint>클릭하여 업로드</UploadHint>
                  )}
                </DefaultAvatar>
              )}
              
              {isImageLoading && (
                <LoadingOverlay>
                  <CircularProgress size={20} sx={{ color: '#FF9999', mb: 1 }} />
                  <div style={{ fontSize: '10px', color: '#666' }}>업로드 중...</div>
                </LoadingOverlay>
              )}
              
              {isEditing && hasImage && (
                <ImageOverlay className="image-overlay">
                  클릭하여 변경
                </ImageOverlay>
              )}
            </ProfileImage>
            
            {isEditing && !isImageLoading && (
              <ActionButtons className="action-buttons">
                <ActionButton
                  onClick={handleImageUploadClick}
                  disabled={isImageLoading}
                  title={hasImage ? "이미지 변경" : "이미지 업로드"}
                >
                  <PhotoCameraIcon sx={{ fontSize: 18 }} />
                </ActionButton>
                
                {hasImage && (
                  <ActionButton
                    className="delete-button"
                    onClick={handleImageDelete}
                    disabled={isImageLoading}
                    title="이미지 삭제"
                  >
                    <DeleteIcon sx={{ fontSize: 18 }} />
                  </ActionButton>
                )}
              </ActionButtons>
            )}
          </ProfileImageWrapper>
        </ProfileImageContainer>
        
        <Name>{name}</Name>
        <Role>{role}</Role>
        <Email>{email}</Email>
        {children && <ChildrenWrapper>{children}</ChildrenWrapper>}
      </ProfileContent>

      {/* 숨겨진 파일 입력 */}
      <HiddenFileInput
        ref={fileInputRef}
        type="file"
        accept="image/*"
        onChange={handleFileChange}
      />
    </CardContainer>
  );
};

export default ProfileCard; 