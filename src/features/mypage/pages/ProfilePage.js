import { jsx as _jsx, jsxs as _jsxs, Fragment as _Fragment } from "react/jsx-runtime";
import { useEffect, useState } from 'react';
import { PageLayout, ProfileCard, InfoCard, FormField, StyledInput, StyledTextarea, Button, } from '../components';
import { useMypageStore } from '../store/mypageStore';
import styled from '@emotion/styled';
import { useAuthStore } from '../../auth/store/authStore';
import { Alert, Snackbar, Typography, Box, Chip, Container } from '@mui/material';
import EmojiEventsIcon from '@mui/icons-material/EmojiEvents';
import ForumIcon from '@mui/icons-material/Forum';
import ChatBubbleOutlineIcon from '@mui/icons-material/ChatBubbleOutline';
import HowToVoteIcon from '@mui/icons-material/HowToVote';
import BookmarkIcon from '@mui/icons-material/Bookmark';
import PublicIcon from '@mui/icons-material/Public';
import TranslateIcon from '@mui/icons-material/Translate';
import CakeIcon from '@mui/icons-material/Cake';
import TravelExploreIcon from '@mui/icons-material/TravelExplore';
// TODO : 실제 유저 정보 및 활동 연결(유저 정보, 유저가 투표한 토론, 유저가 작성한 게시글, 유저가 작성한 댓글)
// 스타일링된 컴포넌트
const PageContainer = styled.div `
  padding: 20px 0;
`;
const ProfileSection = styled.div `
  display: grid;
  grid-template-columns: 1fr 2fr;
  gap: 24px;
  margin-bottom: 24px;

  @media (max-width: 768px) {
    grid-template-columns: 1fr;
    gap: 40px;
  }
`;
const ProfileActions = styled.div `
  width: 100%;
  margin-top: 16px;
`;
const ProfileInfoSection = styled.div `
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 16px;

  @media (max-width: 768px) {
    grid-template-columns: 1fr;
  }
`;
const FieldGroup = styled.div `
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 16px;

  @media (max-width: 768px) {
    grid-template-columns: 1fr;
  }
`;
const StyledFormField = styled(FormField) `
  margin-bottom: 16px;
`;
const ReadOnlyValue = styled.div `
  padding: 12px 16px;
  border: 1px solid #f0f0f0;
  border-radius: 8px;
  font-size: 0.875rem;
  background-color: #f9f9f9;
`;
const LoadingWrapper = styled.div `
  display: flex;
  justify-content: center;
  align-items: center;
  height: 200px;
`;
const Spinner = styled.div `
  width: 40px;
  height: 40px;
  border: 3px solid rgba(0, 0, 0, 0.1);
  border-radius: 50%;
  border-top-color: #ff9999;
  animation: spin 1s linear infinite;

  @keyframes spin {
    to {
      transform: rotate(360deg);
    }
  }
`;
const ErrorMessage = styled.div `
  text-align: center;
  padding: 20px;
  color: #e53e3e;
  margin: 20px 0;
`;
const StatsSection = styled.div `
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 16px;
  margin: 24px 0;

  @media (max-width: 768px) {
    grid-template-columns: repeat(2, 1fr);
  }

  @media (max-width: 480px) {
    grid-template-columns: 1fr;
  }
`;
const StatCard = styled.div `
  background: white;
  border-radius: 12px;
  padding: 16px;
  display: flex;
  flex-direction: column;
  align-items: center;
  text-align: center;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.05);
  transition: all 0.3s ease;

  &:hover {
    transform: translateY(-5px);
    box-shadow: 0 6px 12px rgba(0, 0, 0, 0.1);
  }
`;
const StatIcon = styled.div `
  width: 48px;
  height: 48px;
  border-radius: 50%;
  background: linear-gradient(135deg, #ffd1d1 0%, #ff9999 100%);
  display: flex;
  align-items: center;
  justify-content: center;
  margin-bottom: 8px;
  color: white;
`;
const StatValue = styled.div `
  font-size: 1.5rem;
  font-weight: 600;
  color: #333;
  margin: 4px 0;
`;
const StatLabel = styled.div `
  font-size: 0.875rem;
  color: #666;
`;
const ActivitySection = styled.div `
  margin-top: 32px;
`;
const ActivityContainer = styled.div `
  margin-top: 16px;
`;
const ActivityItem = styled.div `
  padding: 16px;
  border-radius: 8px;
  background: white;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.05);
  margin-bottom: 12px;
  transition: all 0.2s ease;

  &:hover {
    box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
  }
`;
const ActivityTitle = styled.div `
  font-weight: 600;
  margin-bottom: 4px;
  color: #333;
`;
const ActivityMeta = styled.div `
  display: flex;
  align-items: center;
  justify-content: space-between;
  font-size: 0.75rem;
  color: #888;
  margin-top: 8px;
`;
const NoBadge = styled.div `
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 32px 0;
  color: #999;
  text-align: center;
`;
const BadgeGrid = styled.div `
  display: grid;
  grid-template-columns: repeat(5, 1fr);
  gap: 16px;
  margin-top: 16px;

  @media (max-width: 768px) {
    grid-template-columns: repeat(3, 1fr);
  }

  @media (max-width: 480px) {
    grid-template-columns: repeat(2, 1fr);
  }
`;
const Badge = styled.div `
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 16px;
  border-radius: 8px;
  background: #fff;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.05);
  transition: all 0.3s ease;

  &:hover {
    transform: translateY(-5px);
    box-shadow: 0 8px 16px rgba(0, 0, 0, 0.1);
  }
`;
const BadgeIcon = styled.div `
  width: 64px;
  height: 64px;
  border-radius: 50%;
  background: #f5f5f5;
  display: flex;
  align-items: center;
  justify-content: center;
  margin-bottom: 8px;
  color: #ff9999;
  font-size: 32px;
`;
const BadgeName = styled.div `
  font-weight: 600;
  font-size: 0.875rem;
  text-align: center;
`;
const BadgeDescription = styled.div `
  font-size: 0.75rem;
  color: #666;
  text-align: center;
  margin-top: 4px;
`;
const IconWithText = styled.div `
  display: flex;
  align-items: center;
  gap: 8px;
  margin-bottom: 8px;
`;
// 방문 목적에 따른 한국어 변환 함수
const translateVisitPurpose = (purpose) => {
    if (!purpose)
        return '미지정';
    const purposeMap = {
        travel: '여행',
        study: '유학',
        work: '취업',
        living: '거주',
        business: '사업',
        other: '기타',
    };
    return purposeMap[purpose] || purpose;
};
/**
 * 마이페이지 - 프로필 페이지
 * 사용자 프로필 정보를 표시하고 수정할 수 있습니다.
 */
const ProfilePage = () => {
    const { profile, profileLoading, profileError, profileUpdateLoading, profileUpdateError, profileUpdated, fetchProfile, updateProfile, resetProfileUpdateStatus, posts, comments, debates, bookmarks, fetchMyPosts, fetchMyComments, fetchMyDebates, fetchMyBookmarks, } = useMypageStore();
    const { user } = useAuthStore();
    // 로컬 상태
    const [isEditing, setIsEditing] = useState(false);
    const [showSuccess, setShowSuccess] = useState(false);
    const [activeTab, setActiveTab] = useState('posts'); // 'posts', 'comments', 'debates', 'badges'
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        introduction: '',
        country: '',
        language: '',
    });
    // 프로필 데이터 로드
    useEffect(() => {
        console.log('프로필 로드 시작, 현재 인증 사용자:', user);
        fetchProfile();
        // 사용자 활동 데이터 로드
        if (user?.userId) {
            const userId = Number(user.userId);
            fetchMyPosts(0, 5); // 최근 5개만 로드
            fetchMyComments(0, 5);
            fetchMyDebates(0, 5);
            fetchMyBookmarks(0, 5);
        }
    }, [fetchProfile, fetchMyPosts, fetchMyComments, fetchMyDebates, fetchMyBookmarks, user]);
    // 프로필 데이터가 로드되면 폼 데이터 업데이트
    useEffect(() => {
        if (profile) {
            console.log('가져온 프로필 데이터:', profile);
            setFormData({
                name: profile.name,
                email: profile.email,
                introduction: profile.introduction || '',
                country: profile.country || '',
                language: profile.language || '',
            });
        }
    }, [profile]);
    // 프로필 업데이트 성공 시 편집 모드 종료 및 성공 메시지 표시
    useEffect(() => {
        if (profileUpdated) {
            setIsEditing(false);
            setShowSuccess(true);
            resetProfileUpdateStatus();
        }
    }, [profileUpdated, resetProfileUpdateStatus]);
    // 입력 핸들러
    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };
    // 폼 제출 핸들러
    const handleSubmit = (e) => {
        e.preventDefault();
        updateProfile({
            ...formData,
            userId: profile?.userId, // 기존 userId 유지
        });
    };
    // 편집 취소 핸들러
    const handleCancel = () => {
        if (profile) {
            setFormData({
                name: profile.name,
                email: profile.email,
                introduction: profile.introduction || '',
                country: profile.country || '',
                language: profile.language || '',
            });
        }
        setIsEditing(false);
    };
    // 로딩 상태
    if (profileLoading === 'loading' && !profile) {
        return (_jsx(PageLayout, { title: "\uB0B4 \uD504\uB85C\uD544", children: _jsx(LoadingWrapper, { children: _jsx(Spinner, {}) }) }));
    }
    // 에러 상태
    if (profileError && profileLoading === 'error') {
        return (_jsx(PageLayout, { title: "\uB0B4 \uD504\uB85C\uD544", children: _jsxs(ErrorMessage, { children: [_jsx("p", { children: profileError }), _jsx(Button, { onClick: () => fetchProfile(), variant: "primary", className: "mt-4", children: "\uB2E4\uC2DC \uC2DC\uB3C4" })] }) }));
    }
    // 방문 목적 표시 (여행, 유학, 취업 등)
    const visitPurpose = translateVisitPurpose(profile?.role);
    // 통계 데이터 계산
    const postsCount = posts?.totalElements || 0;
    const commentsCount = comments?.totalElements || 0;
    const debatesCount = debates?.totalElements || 0;
    const bookmarksCount = bookmarks?.totalElements || 0;
    const totalActivities = postsCount + commentsCount + debatesCount;
    // 배지 정보 (임시 데이터)
    const badges = [
        {
            id: 1,
            name: '첫 게시글',
            icon: '📝',
            description: '첫 번째 게시글을 작성했습니다!',
            unlocked: postsCount > 0,
        },
        {
            id: 2,
            name: '소통왕',
            icon: '💬',
            description: '10개 이상의 댓글을 작성했습니다!',
            unlocked: commentsCount >= 10,
        },
        {
            id: 3,
            name: '토론 참여자',
            icon: '🗳️',
            description: '토론에 참여하여 의견을 표현했습니다!',
            unlocked: debatesCount > 0,
        },
        {
            id: 4,
            name: '지식 수집가',
            icon: '📚',
            description: '첫 번째 북마크를 추가했습니다!',
            unlocked: bookmarksCount > 0,
        },
        {
            id: 5,
            name: '활발한 활동가',
            icon: '🌟',
            description: '10개 이상의 활동을 완료했습니다!',
            unlocked: totalActivities >= 10,
        },
    ];
    // 사용자 레벨 계산 (임시 로직)
    const userLevel = Math.min(Math.floor(totalActivities / 5) + 1, 10);
    const maxLevel = 10;
    const levelProgress = (userLevel / maxLevel) * 100;
    return (_jsx(Container, { maxWidth: "lg", sx: {
            py: 3,
            display: 'flex',
            flexDirection: 'column',
            flexGrow: 1,
            position: 'relative',
            zIndex: 5,
        }, children: _jsxs(PageLayout, { title: "\uB0B4 \uD504\uB85C\uD544", children: [_jsx("form", { onSubmit: handleSubmit, children: _jsxs(ProfileSection, { children: [_jsxs(ProfileCard, { profileImage: profile?.profileImage, name: profile?.name || '', role: visitPurpose || '사용자', email: profile?.email || '', children: [_jsx(ProfileActions, { children: isEditing ? (_jsxs(_Fragment, { children: [_jsx(Button, { type: "button", variant: "outline", onClick: handleCancel, disabled: profileUpdateLoading === 'loading', children: "\uCDE8\uC18C" }), _jsx(Button, { type: "submit", variant: "primary", isLoading: profileUpdateLoading === 'loading', className: "ml-2", children: profileUpdateLoading === 'loading' ? '저장 중...' : '저장하기' })] })) : (_jsx(Button, { type: "button", variant: "primary", onClick: () => setIsEditing(true), fullWidth: true, children: "\uD504\uB85C\uD544 \uC218\uC815" })) }), _jsxs(Box, { mt: 2, p: 2, bgcolor: "#f9f9f9", borderRadius: 2, children: [_jsxs(Typography, { variant: "body2", color: "text.secondary", align: "center", children: ["\uD65C\uB3D9 \uB808\uBCA8: ", userLevel, "/", maxLevel] }), _jsx(Box, { mt: 1, width: "100%", height: 8, bgcolor: "#e0e0e0", borderRadius: 4, overflow: "hidden", position: "relative", children: _jsx(Box, { width: `${levelProgress}%`, height: "100%", bgcolor: "#FF9999", borderRadius: 4 }) })] })] }), _jsx(InfoCard, { title: "\uAC1C\uC778 \uC815\uBCF4", children: _jsxs(ProfileInfoSection, { children: [_jsx(StyledFormField, { label: "\uC774\uB984", htmlFor: "name", children: isEditing ? (_jsx(StyledInput, { id: "name", name: "name", value: formData.name, onChange: handleChange, placeholder: "\uC774\uB984\uC744 \uC785\uB825\uD558\uC138\uC694" })) : (_jsx(ReadOnlyValue, { children: profile?.name || '이름 없음' })) }), _jsx(StyledFormField, { label: "\uC774\uBA54\uC77C", htmlFor: "email", children: _jsx(ReadOnlyValue, { children: profile?.email || '이메일 없음' }) }), _jsx(StyledFormField, { label: "\uC790\uAE30\uC18C\uAC1C", htmlFor: "introduction", children: isEditing ? (_jsx(StyledTextarea, { id: "introduction", name: "introduction", value: formData.introduction, onChange: handleChange, placeholder: "\uC790\uAE30\uC18C\uAC1C\uB97C \uC785\uB825\uD558\uC138\uC694", rows: 4 })) : (_jsx(ReadOnlyValue, { children: profile?.introduction || '자기소개가 없습니다.' })) }), _jsx(Box, { gridColumn: "span 2", children: _jsxs(Box, { display: "flex", flexDirection: "column", gap: 1, children: [_jsxs(IconWithText, { children: [_jsx(PublicIcon, { fontSize: "small", sx: { color: '#FF9999' } }), _jsxs(Typography, { variant: "body2", children: [_jsx("strong", { children: "\uAD6D\uAC00:" }), " ", profile?.country || '국가 정보 없음'] })] }), _jsxs(IconWithText, { children: [_jsx(TranslateIcon, { fontSize: "small", sx: { color: '#FF9999' } }), _jsxs(Typography, { variant: "body2", children: [_jsx("strong", { children: "\uC5B8\uC5B4:" }), " ", profile?.language || '언어 정보 없음'] })] }), _jsxs(IconWithText, { children: [_jsx(CakeIcon, { fontSize: "small", sx: { color: '#FF9999' } }), _jsxs(Typography, { variant: "body2", children: [_jsx("strong", { children: "\uAC00\uC785\uC77C:" }), " ", profile?.joinDate || '가입일 정보 없음'] })] }), _jsxs(IconWithText, { children: [_jsx(TravelExploreIcon, { fontSize: "small", sx: { color: '#FF9999' } }), _jsxs(Typography, { variant: "body2", children: [_jsx("strong", { children: "\uBC29\uBB38 \uBAA9\uC801:" }), " ", visitPurpose] })] })] }) })] }) })] }) }), _jsx(Typography, { variant: "h6", component: "h2", sx: { mb: 2, mt: 4 }, children: "\uD65C\uB3D9 \uD1B5\uACC4" }), _jsxs(StatsSection, { children: [_jsxs(StatCard, { children: [_jsx(StatIcon, { children: _jsx(ForumIcon, {}) }), _jsx(StatValue, { children: postsCount }), _jsx(StatLabel, { children: "\uC791\uC131\uD55C \uAC8C\uC2DC\uAE00" })] }), _jsxs(StatCard, { children: [_jsx(StatIcon, { children: _jsx(ChatBubbleOutlineIcon, {}) }), _jsx(StatValue, { children: commentsCount }), _jsx(StatLabel, { children: "\uC791\uC131\uD55C \uB313\uAE00" })] }), _jsxs(StatCard, { children: [_jsx(StatIcon, { children: _jsx(HowToVoteIcon, {}) }), _jsx(StatValue, { children: debatesCount }), _jsx(StatLabel, { children: "\uCC38\uC5EC\uD55C \uD1A0\uB860" })] }), _jsxs(StatCard, { children: [_jsx(StatIcon, { children: _jsx(BookmarkIcon, {}) }), _jsx(StatValue, { children: bookmarksCount }), _jsx(StatLabel, { children: "\uC800\uC7A5\uD55C \uBD81\uB9C8\uD06C" })] })] }), _jsx(Typography, { variant: "h6", component: "h2", sx: { mb: 2, mt: 4 }, children: "\uB098\uC758 \uBC30\uC9C0" }), badges.some(badge => badge.unlocked) ? (_jsx(BadgeGrid, { children: badges.map(badge => badge.unlocked && (_jsxs(Badge, { children: [_jsx(BadgeIcon, { children: badge.icon }), _jsx(BadgeName, { children: badge.name }), _jsx(BadgeDescription, { children: badge.description })] }, badge.id))) })) : (_jsxs(NoBadge, { children: [_jsx(EmojiEventsIcon, { sx: { fontSize: 48, color: '#ddd', mb: 2 } }), _jsx(Typography, { variant: "body1", color: "text.secondary", children: "\uC544\uC9C1 \uD68D\uB4DD\uD55C \uBC30\uC9C0\uAC00 \uC5C6\uC2B5\uB2C8\uB2E4." }), _jsx(Typography, { variant: "body2", color: "text.secondary", children: "\uD65C\uB3D9\uC744 \uD1B5\uD574 \uB2E4\uC591\uD55C \uBC30\uC9C0\uB97C \uC218\uC9D1\uD574 \uBCF4\uC138\uC694!" })] })), _jsxs(ActivitySection, { children: [_jsx(Typography, { variant: "h6", component: "h2", sx: { mb: 2 }, children: "\uCD5C\uADFC \uD65C\uB3D9" }), _jsxs(Box, { sx: { display: 'flex', mb: 2, gap: 1 }, children: [_jsx(Chip, { label: "\uAC8C\uC2DC\uAE00", onClick: () => setActiveTab('posts'), color: activeTab === 'posts' ? 'primary' : 'default', variant: activeTab === 'posts' ? 'filled' : 'outlined' }), _jsx(Chip, { label: "\uB313\uAE00", onClick: () => setActiveTab('comments'), color: activeTab === 'comments' ? 'primary' : 'default', variant: activeTab === 'comments' ? 'filled' : 'outlined' }), _jsx(Chip, { label: "\uD1A0\uB860", onClick: () => setActiveTab('debates'), color: activeTab === 'debates' ? 'primary' : 'default', variant: activeTab === 'debates' ? 'filled' : 'outlined' })] }), _jsxs(ActivityContainer, { children: [activeTab === 'posts' && (_jsx(_Fragment, { children: posts?.content?.length ? (posts.content.map(post => (_jsxs(ActivityItem, { children: [_jsx(ActivityTitle, { children: post.title }), _jsxs(Typography, { variant: "body2", color: "text.secondary", noWrap: true, children: [post.content.substring(0, 100), post.content.length > 100 ? '...' : ''] }), _jsxs(ActivityMeta, { children: [_jsxs("span", { children: ["\uCE74\uD14C\uACE0\uB9AC: ", post.category] }), _jsxs("span", { children: ["\uC791\uC131\uC77C: ", post.createdAt] })] })] }, post.id)))) : (_jsx(Typography, { variant: "body2", color: "text.secondary", align: "center", sx: { py: 4 }, children: "\uC791\uC131\uD55C \uAC8C\uC2DC\uAE00\uC774 \uC5C6\uC2B5\uB2C8\uB2E4." })) })), activeTab === 'comments' && (_jsx(_Fragment, { children: comments?.content?.length ? (comments.content.map(comment => (_jsxs(ActivityItem, { children: [_jsxs(Typography, { variant: "body2", sx: { mb: 1 }, children: ["\uAC8C\uC2DC\uAE00: ", _jsx("strong", { children: comment.postTitle })] }), _jsx(Typography, { variant: "body1", children: comment.content }), _jsx(ActivityMeta, { children: _jsxs("span", { children: ["\uC791\uC131\uC77C: ", comment.createdAt] }) })] }, comment.id)))) : (_jsx(Typography, { variant: "body2", color: "text.secondary", align: "center", sx: { py: 4 }, children: "\uC791\uC131\uD55C \uB313\uAE00\uC774 \uC5C6\uC2B5\uB2C8\uB2E4." })) })), activeTab === 'debates' && (_jsx(_Fragment, { children: debates?.content?.length ? (debates.content.map(debate => (_jsxs(ActivityItem, { children: [_jsx(ActivityTitle, { children: debate.title }), _jsx(Box, { sx: { mt: 1 }, children: _jsx(Chip, { label: `투표: ${debate.votedOption}`, size: "small", color: "primary", variant: "outlined" }) }), _jsxs(ActivityMeta, { children: [_jsxs("span", { children: ["\uD22C\uD45C \uC218: ", debate.totalVotes] }), _jsxs("span", { children: ["\uCC38\uC5EC\uC77C: ", debate.createdAt] })] })] }, debate.id)))) : (_jsx(Typography, { variant: "body2", color: "text.secondary", align: "center", sx: { py: 4 }, children: "\uCC38\uC5EC\uD55C \uD1A0\uB860\uC774 \uC5C6\uC2B5\uB2C8\uB2E4." })) }))] })] }), _jsx(Snackbar, { open: showSuccess, autoHideDuration: 3000, onClose: () => setShowSuccess(false), anchorOrigin: { vertical: 'top', horizontal: 'center' }, children: _jsx(Alert, { onClose: () => setShowSuccess(false), severity: "success", sx: { width: '100%' }, children: "\uD504\uB85C\uD544\uC774 \uC131\uACF5\uC801\uC73C\uB85C \uC5C5\uB370\uC774\uD2B8\uB418\uC5C8\uC2B5\uB2C8\uB2E4." }) })] }) }));
};
export default ProfilePage;
