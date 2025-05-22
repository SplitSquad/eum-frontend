import React, { useState, useEffect, useMemo, useCallback, memo } from 'react';
import { Paper, Box, Typography, Tab, Tabs, Avatar, Divider, Chip, IconButton, Button, CircularProgress, Alert } from '@mui/material';
import LocationOnIcon from '@mui/icons-material/LocationOn';
import ThumbUpAltIcon from '@mui/icons-material/ThumbUpAlt';
import CommentIcon from '@mui/icons-material/Comment';
import BookmarkBorderIcon from '@mui/icons-material/BookmarkBorder';
import ShareIcon from '@mui/icons-material/Share';
import MoreHorizIcon from '@mui/icons-material/MoreHoriz';
import FilterListIcon from '@mui/icons-material/FilterList';
import PersonIcon from '@mui/icons-material/Person';
import AccessTimeIcon from '@mui/icons-material/AccessTime';
import VisibilityIcon from '@mui/icons-material/Visibility';
import RefreshIcon from '@mui/icons-material/Refresh';
import ErrorOutlineIcon from '@mui/icons-material/ErrorOutline';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import CommunityService, { Post } from '../../services/community/communityService';
import { widgetPaperBase, widgetGradients, widgetTabsBase, widgetCardBase, widgetChipBase } from './theme/dashboardWidgetTheme';
import { useNavigate } from 'react-router-dom';
import WeatherService from '../../services/weather/weatherService';
import DebateApi from '../../features/debate/api/debateApi';
import { Debate } from '../../features/debate/types';
import apiClient from '../../features/debate/api/apiClient';

// 배열을 랜덤하게 섞는 유틸리티 함수
const shuffleArray = <T,>(array: T[]): T[] => {
  const shuffled = [...array];
  for (let i = shuffled.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
  }
  return shuffled;
};

// 포스트 소스별 라벨 매핑
const sourceLabels: Record<string, string> = {
  'community': '커뮤니티',
  'discussion': '모임',
  'debate': '토론',
  'information': '정보'
};

// 소스별 색상 매핑
const sourceColors: Record<string, string> = {
  'community': '#2196f3',
  'discussion': '#9c27b0',
  'debate': '#3f51b5',
  'information': '#4caf50'
};

interface TabPanelProps {
  children?: React.ReactNode;
  index: number;
  value: number;
}

const TabPanel = (props: TabPanelProps) => {
  const { children, value, index, ...other } = props;

  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`tabpanel-${index}`}
      aria-labelledby={`tab-${index}`}
      {...other}
    >
      {value === index && (
        <Box sx={{ pt: 2 }}>
          {children}
        </Box>
      )}
    </div>
  );
};

// 시간 포맷팅 유틸리티 함수
const formatTimeAgo = (dateString: string): string => {
  const date = new Date(dateString);
  const now = new Date();
  const diffMs = now.getTime() - date.getTime();
  const diffSec = Math.floor(diffMs / 1000);
  const diffMin = Math.floor(diffSec / 60);
  const diffHour = Math.floor(diffMin / 60);
  const diffDay = Math.floor(diffHour / 24);

  if (diffDay > 0) {
    return diffDay === 1 ? '1일 전' : `${diffDay}일 전`;
  } else if (diffHour > 0) {
    return diffHour === 1 ? '1시간 전' : `${diffHour}시간 전`;
  } else if (diffMin > 0) {
    return diffMin === 1 ? '1분 전' : `${diffMin}분 전`;
  } else {
    return '방금 전';
  }
};

// 주소 정제 함수: '서울특별시 중구 장충동 2가' -> '서울특별시 중구 장충동', '서울특별시 양천구 목2동' -> '서울특별시 양천구 목동' 
const formatAddress = (address: string): string => {
  if (!address || address === '자유') return '자유';
  
  // 주소에서 구성 요소 추출
  const parts = address.split(' ');
  
  // 주소 단계에 따라 처리
  if (parts.length >= 3) {
    // 시/도 처리 (특별시, 광역시 등은 그대로 유지)
    const city = parts[0]; // 예: 서울특별시
    const district = parts[1]; // 예: 중구, 양천구
    
    // 동 이름 처리 (숫자 제거)
    let dong = parts[2]; // 예: 장충동, 목2동
    // 숫자 제거하고 '동', '가' 등의 접미사 앞 부분만 추출
    dong = dong.replace(/\d+/, ''); // 숫자 제거 (목2동 -> 목동)
    
    return `${city} ${district} ${dong}`;
  } else if (parts.length >= 2) {
    // 시/도와 구/군만 있는 경우
    return `${parts[0]} ${parts[1]}`;
  }
  
  return address;
};

// 위치 이름을 더 예쁘게 표시하는 함수
const formatLocationName = (address: string): string => {
  if (!address) return '지역 정보 없음';
  
  const parts = address.split(' ');
  
  // 서울특별시 양천구 목동 형태인 경우
  if (parts.length >= 3) {
    // 마지막 부분 (동/읍/면)을 강조
    const lastPart = parts[parts.length - 1];
    return `${parts[0]} ${parts[1]} 「${lastPart}」`;
  }
  
  // 두 부분으로 이루어진 경우 (시/도 구/군)
  if (parts.length === 2) {
    return `${parts[0]} 「${parts[1]}」`;
  }
  
  // 그 외는 그대로 반환
  return address;
};

// 최적화를 위해 PostItem 컴포넌트 분리 및 메모이제이션
const PostItem = memo(({ post, onClick }: { post: Post, onClick?: () => void }) => {
  // 소스에 따라 다른 스타일 적용
  const sourceColor = sourceColors[post.source] || '#757575';
  
  // 카테고리 색상
  const categoryColor = post.categoryColor || '#757575';
  
  // 매칭 점수 색상 계산
  const matchScoreColor = useMemo(() => {
    if (!post.matchScore) return '#757575';
    if (post.matchScore > 90) return '#388e3c';
    if (post.matchScore > 80) return '#1976d2';
    return '#f57c00';
  }, [post.matchScore]);
  
  // 매칭 점수 배경색 계산
  const matchScoreBgColor = useMemo(() => {
    if (!post.matchScore) return 'rgba(0,0,0,0.04)';
    if (post.matchScore > 90) return 'rgba(76, 175, 80, 0.1)';
    if (post.matchScore > 80) return 'rgba(33, 150, 243, 0.1)';
    return 'rgba(255, 152, 0, 0.1)';
  }, [post.matchScore]);

  // 게시글 유형에 따른 아이콘 결정
  const getSourceIcon = () => {
    switch(post.source) {
      case 'community':
        return <PersonIcon sx={{ fontSize: 14, mr: 0.5 }} />;
      case 'discussion':
        return <LocationOnIcon sx={{ fontSize: 14, mr: 0.5 }} />;
      case 'debate':
        return <CommentIcon sx={{ fontSize: 14, mr: 0.5 }} />;
      case 'information':
        return <ErrorOutlineIcon sx={{ fontSize: 14, mr: 0.5 }} />;
      default:
        return null;
    }
  };

  return (
    <Box 
      sx={{ 
        mb: 2,
        p: 2,
        borderRadius: 2,
        bgcolor: 'background.paper',
        boxShadow: '0 1px 3px rgba(0,0,0,0.08)',
        border: '1px solid',
        borderColor: 'divider',
        position: 'relative',
        overflow: 'hidden',
        '&:hover': {
          boxShadow: '0 3px 8px rgba(0,0,0,0.12)',
          borderColor: `${sourceColor}40`,
        },
        cursor: onClick ? 'pointer' : 'default',
        // 소스에 따라 왼쪽 테두리 색상 변경
        borderLeft: `4px solid ${sourceColor}`
      }}
      onClick={onClick}
    >
      {/* 소스 표시 배지 */}
      <Box
        sx={{
          position: 'absolute',
          top: 0,
          right: 20,
          bgcolor: `${sourceColor}15`,
          color: sourceColor,
          px: 1,
          py: 0.2,
          borderBottomLeftRadius: 4,
          borderBottomRightRadius: 4,
          fontSize: '0.65rem',
          fontWeight: 500,
        }}
      >
        {sourceLabels[post.source] || post.source}
      </Box>

      {/* 헤더: 작성자 정보, 카테고리 */}
      <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 1.5 }}>
        {/* 작성자 정보 - 커뮤니티/모임 글일 경우만 표시 */}
        <Box sx={{ display: 'flex', alignItems: 'center' }}>
          {(post.source === 'community' || post.source === 'discussion') ? (
            <>
              <Avatar 
                src={post.author?.profileImagePath} 
                sx={{ width: 28, height: 28, mr: 1 }}
              >
                {!post.author?.profileImagePath && <PersonIcon fontSize="small" />}
              </Avatar>
              <Box>
                <Typography variant="body2" fontWeight={500}>
                  {post.author?.name || '익명'}
                </Typography>
                <Box sx={{ display: 'flex', alignItems: 'center' }}>
                  <AccessTimeIcon sx={{ fontSize: 12, mr: 0.5, color: 'text.secondary' }} />
                  <Typography variant="caption" color="text.secondary">
                    {formatTimeAgo(post.createdAt)}
                  </Typography>
                </Box>
              </Box>
            </>
          ) : (
            // 토론/정보의 경우 소스 표시
            <Box sx={{ display: 'flex', alignItems: 'center' }}>
              {getSourceIcon()}
              <Typography variant="caption" color="text.secondary">
                {formatTimeAgo(post.createdAt)}
              </Typography>
            </Box>
          )}
        </Box>
        
        <Box sx={{ display: 'flex', alignItems: 'center' }}>
          {post.matchScore && (
            <Chip 
              label={`${post.matchScore}% 매치`} 
              size="small"
              sx={{ 
                height: 20, 
                fontSize: '0.65rem',
                mr: 1,
                bgcolor: matchScoreBgColor,
                color: matchScoreColor
              }}
            />
          )}
          <Chip 
            label={post.category} 
            size="small"
            sx={{ 
              height: 20, 
              fontSize: '0.7rem',
              bgcolor: `${categoryColor}15`,
              color: categoryColor,
            }}
          />
          <IconButton size="small" sx={{ ml: 0.5 }}>
            <MoreHorizIcon fontSize="small" />
          </IconButton>
        </Box>
      </Box>
      
      {/* 콘텐츠 제목 및 내용 */}
      <Box sx={{ mb: 1.5 }}>
        <Typography variant="subtitle1" fontWeight={600} sx={{ mb: 0.5 }}>
          {post.title}
        </Typography>
        
        {/* 모임 게시글인 경우 위치 정보 표시 */}
        {post.source === 'discussion' && (
          <Box sx={{ 
            display: 'flex', 
            alignItems: 'center',
            mb: 0.5, 
            color: 'text.secondary',
            bgcolor: 'rgba(156, 39, 176, 0.1)', // 모임 색상에 맞춤
            px: 1,
            py: 0.5,
            borderRadius: 1,
            width: 'fit-content'
          }}>
            <LocationOnIcon sx={{ fontSize: 16, mr: 0.5, color: sourceColors.discussion }} />
            <Typography variant="caption" fontWeight={500}>
              {post.address ? 
                formatLocationName(post.address) : 
                '지역 정보 없음'}
            </Typography>
          </Box>
        )}
        
        <Typography variant="body2" color="text.secondary" sx={{ mb: 1 }}>
          {post.content}
        </Typography>
        
        {/* 이미지가 있으면 표시 */}
        {post.images && post.images.length > 0 && (
          <Box 
            sx={{ 
              height: 120, 
              borderRadius: 1.5, 
              bgcolor: 'action.hover',
              overflow: 'hidden',
              mb: 1.5,
              display: 'flex',
              justifyContent: 'center',
              alignItems: 'center',
              background: `url(${post.images[0]}) center/cover no-repeat`,
            }}
          />
        )}

        {/* 토론 게시글이고 debateStats 있을 경우 찬성/반대 비율 표시 */}
        {post.source === 'debate' && post.debateStats && (
          <Box sx={{ mb: 1.5, mt: 1.5 }}>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 0.5 }}>
              <Typography variant="caption" color="primary">
                찬성 {post.debateStats.agreePercent.toFixed(1)}%
              </Typography>
              <Typography variant="caption" color="error">
                반대 {post.debateStats.disagreePercent.toFixed(1)}%
              </Typography>
            </Box>
            <Box sx={{ 
              width: '100%', 
              height: 8,
              display: 'flex',
              borderRadius: 4,
              overflow: 'hidden',
              bgcolor: 'divider'
            }}>
              {/* 찬성 부분 */}
              <Box sx={{ 
                width: `${post.debateStats.agreePercent}%`, 
                height: '100%', 
                bgcolor: 'primary.main',
                borderTopLeftRadius: 4,
                borderBottomLeftRadius: 4
              }} />
              {/* 반대 부분 */}
              <Box sx={{ 
                width: `${post.debateStats.disagreePercent}%`, 
                height: '100%', 
                bgcolor: 'error.main',
                borderTopRightRadius: 4,
                borderBottomRightRadius: 4
              }} />
            </Box>
            <Typography variant="caption" sx={{ display: 'block', mt: 0.5, textAlign: 'right', color: 'text.secondary' }}>
              투표 {post.debateStats.voteCnt}명
            </Typography>
          </Box>
        )}

        {/* 태그가 있으면 표시 */}
        {post.tags && post.tags.length > 0 && (
          <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5, mb: 1.5 }}>
            {post.tags.map((tag, index) => (
              <Chip
                key={index}
                label={`#${tag}`}
                size="small"
                sx={{
                  height: 20,
                  fontSize: '0.65rem',
                  bgcolor: 'rgba(0,0,0,0.04)',
                }}
              />
            ))}
          </Box>
        )}
      </Box>
      
      {/* 액션 버튼들 */}
      <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <Box sx={{ display: 'flex', alignItems: 'center' }}>
          <Button 
            startIcon={<ThumbUpAltIcon />}
            size="small"
            sx={{ 
              mr: 1, 
              color: 'text.secondary',
              fontSize: '0.75rem',
              textTransform: 'none',
              '&:hover': { bgcolor: 'rgba(0,0,0,0.04)' }
            }}
          >
            {post.likeCount}
          </Button>
          <Button 
            startIcon={<CommentIcon />}
            size="small"
            sx={{ 
              mr: 1,
              color: 'text.secondary',
              fontSize: '0.75rem',
              textTransform: 'none',
              '&:hover': { bgcolor: 'rgba(0,0,0,0.04)' }
            }}
          >
            {post.commentCount}
          </Button>
          <Button 
            startIcon={<VisibilityIcon />}
            size="small"
            sx={{ 
              color: 'text.secondary',
              fontSize: '0.75rem',
              textTransform: 'none',
              '&:hover': { bgcolor: 'rgba(0,0,0,0.04)' }
            }}
          >
            {post.viewCount}
          </Button>
        </Box>
        <Box>
          <IconButton 
            size="small" 
            sx={{ 
              color: 'text.secondary',
              '&:hover': { color: 'primary.main' }
            }}
          >
            <BookmarkBorderIcon fontSize="small" />
          </IconButton>
          <IconButton 
            size="small" 
            sx={{ 
              color: 'text.secondary',
              '&:hover': { color: 'primary.main' }
            }}
          >
            <ShareIcon fontSize="small" />
          </IconButton>
        </Box>
      </Box>
    </Box>
  );
});

PostItem.displayName = 'PostItem';

const DynamicFeedWidget: React.FC = () => {
  const [mainTab, setMainTab] = useState<'추천'|'커뮤니티'|'토론'|'정보'>('추천');
  const [isCommunitySubTabOpen, setIsCommunitySubTabOpen] = useState(false);
  const [communitySubTab, setCommunitySubTab] = useState<'자유'|'모임'>('자유');
  const [jaYuPosts, setJaYuPosts] = useState<Post[]>([]);
  const [moimPosts, setMoimPosts] = useState<Post[]>([]);
  const [infoPosts, setInfoPosts] = useState<Post[]>([]);
  const [debatePosts, setDebatePosts] = useState<Post[]>([]);
  const [recommendedPosts, setRecommendedPosts] = useState<Post[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [userLocation, setUserLocation] = useState<string>('');
  const navigate = useNavigate();

  // 유저 위치 정보 가져오기
  const getUserLocation = useCallback(async (): Promise<string> => {
    try {
      // 기존에 저장된 위치 정보가 있으면 사용
      if (userLocation) return userLocation;
      
      // 현재 위치 정보 가져오기
      const position = await WeatherService.getCurrentPosition();
      
      // 카카오맵 API 사용 준비
      await new Promise<void>((resolve, reject) => {
        if (window.kakao && window.kakao.maps) {
          resolve();
          return;
        }
        
        const script = document.createElement('script');
        script.src = `https://dapi.kakao.com/v2/maps/sdk.js?appkey=${import.meta.env.VITE_KAKAO_MAP_KEY}&libraries=services&autoload=false`;
        script.onload = () => {
          window.kakao.maps.load(() => resolve());
        };
        script.onerror = reject;
        document.head.appendChild(script);
      });
      
      // 위치를 주소로 변환
      const geocoder = new window.kakao.maps.services.Geocoder();
      const address = await new Promise<string>((resolve) => {
        geocoder.coord2RegionCode(
          position.longitude,
          position.latitude,
          (result: any, status: any) => {
            if (status === window.kakao.maps.services.Status.OK && result[0]) {
              // 동까지 포함한 주소 추출
              const city = result[0].region_1depth_name; // 시/도 (예: 서울특별시)
              const district = result[0].region_2depth_name; // 구/군 (예: 양천구)
              const dong = result[0].region_3depth_name || ''; // 동/읍/면 (예: 목동)
              
              // 동 정보가 있으면 포함, 없으면 시/구만 사용
              const address = dong ? `${city} ${district} ${dong}` : `${city} ${district}`;
              
              // 가공 처리된 주소 반환
              const formattedAddress = formatAddress(address);
              setUserLocation(formattedAddress); // 상태 업데이트
              resolve(formattedAddress);
            } else {
              resolve('자유'); // 변환 실패 시 기본값
            }
          }
        );
      });
      
      return address;
    } catch (error) {
      console.error('위치 정보 가져오기 실패:', error);
      return '자유'; // 오류 발생 시 기본값으로 '자유' 사용
    }
  }, [userLocation]);

  const handleTabChange = (event: React.SyntheticEvent, newValue: string) => {
    setMainTab(newValue as '추천'|'커뮤니티'|'토론'|'정보');
  };

  // 토론 API를 통해 토론 게시글 가져오기
  const fetchDebatePosts = useCallback(async (): Promise<Post[]> => {
    try {
      // 추천 토론 목록 가져오기
      const result = await DebateApi.getRecommendedDebates();
      console.log('추천 토론 응답:', result);
      
      if (result && result.debates && result.debates.length > 0) {
        // 이미 올바르게 변환된 Debate 객체 사용
        return result.debates.map(debate => {
          // debate는 이미 Debate 타입으로 변환된 객체
          return {
            id: String(debate.id),
            title: debate.title || '',
            content: debate.content || '내용이 없습니다.',
            source: 'debate',
            createdAt: debate.createdAt,
            author: {
              id: '0',
              name: '토론 작성자',
              profileImagePath: ''
            },
            likeCount: debate.proCount + debate.conCount, // 찬성수 + 반대수를 좋아요 수로 표시
            commentCount: debate.commentCount,
            viewCount: 0, // 토론에서는 조회수 표시 안 함
            images: debate.imageUrl ? [debate.imageUrl] : [],
            category: debate.category || '토론',
            categoryColor: getCategoryColor(debate.category || '토론'),
            address: '',
            matchScore: debate.matchScore || Math.floor(Math.random() * 15) + 80,
            tags: [debate.category || '토론'].filter(Boolean),
            // 토론 통계 정보 추가
            debateStats: {
              // 변환된 Debate 객체는 이미 계산된 값을 가지고 있음
              agreePercent: debate.proCount > 0 ? 
                Math.round((debate.proCount / (debate.proCount + debate.conCount)) * 100) : 0,
              disagreePercent: debate.conCount > 0 ? 
                Math.round((debate.conCount / (debate.proCount + debate.conCount)) * 100) : 0,
              voteCnt: debate.proCount + debate.conCount
            }
          };
        });
      }
      
      // 변환된 Debate 객체가 없을 경우 직접 API 응답으로부터 가져오기 시도
      // API 응답이 예상과 다르게 올 수 있으므로 대비
      const response = await apiClient.get<any>('/debate/recommendation');
      const data = response.data || response;
      
      if (data && data.debateList && Array.isArray(data.debateList)) {
        // 2차원 배열 구조 처리
        const allDebates: Post[] = [];
        
        data.debateList.forEach((debateGroup: any[]) => {
          if (Array.isArray(debateGroup)) {
            // 각 그룹의 토론을 Post 형식으로 변환하여 추가
            const posts = debateGroup.map((item: any) => {
              return {
                id: String(item.debateId),
                title: item.title || '',
                content: item.content || '내용이 없습니다.',
                source: 'debate' as const, // 리터럴 타입으로 처리
                createdAt: item.createdAt,
                author: {
                  id: '0',
                  name: '토론 작성자',
                  profileImagePath: ''
                },
                likeCount: item.voteCnt || 0,
                commentCount: item.commentCnt || 0,
                viewCount: 0, // 토론에서는 조회수 표시 안 함
                images: [], // 이미지 필드가 없을 경우 빈 배열
                category: item.category || '토론',
                categoryColor: getCategoryColor(item.category || '토론'),
                address: '',
                matchScore: Math.floor(Math.random() * 15) + 80, // 임의 값 생성
                tags: [item.category].filter(Boolean),
                // 토론 통계 정보 추가
                debateStats: {
                  agreePercent: item.agreePercent || 0,
                  disagreePercent: item.disagreePercent || 0,
                  voteCnt: item.voteCnt || 0
                }
              };
            });
            
            allDebates.push(...posts);
          }
        });
        
        return allDebates;
      }
      
      return [];
    } catch (error) {
      console.error('토론 게시글 가져오기 실패:', error);
      return [];
    }
  }, []);

  // 정보 게시글 가져오는 임시 함수 (추후 실제 API로 대체)
  const fetchInfoPosts = useCallback(async (): Promise<Post[]> => {
    try {
      // 임시 더미 데이터 - 추후 실제 정보 API로 대체
      const dummyData: Post[] = [
        {
          id: 'info-1',
          title: '해외취업 성공 가이드',
          content: '해외취업을 위한 이력서 준비부터 인터뷰까지, 성공적인 해외취업을 위한 모든 과정을 안내합니다.',
          author: { id: 'info-author-1', name: '정보제공자', profileImagePath: '' },
          category: '취업/이직',
          categoryColor: '#2196f3',
          createdAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(),
          likeCount: 42,
          commentCount: 15,
          viewCount: 230,
          source: 'information',
          matchScore: 89,
          tags: ['해외취업', '이력서', '인터뷰']
        },
        {
          id: 'info-2',
          title: '비자 종류별 신청 안내',
          content: '유학, 취업, 워킹홀리데이 등 목적별 비자 신청 방법과 필요 서류를 상세히 안내합니다.',
          author: { id: 'info-author-2', name: '비자전문가', profileImagePath: '' },
          category: '비자/법률',
          categoryColor: '#f44336',
          createdAt: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000).toISOString(),
          likeCount: 37,
          commentCount: 23,
          viewCount: 185,
          source: 'information',
          matchScore: 92,
          tags: ['비자', '법률', '해외생활']
        },
        {
          id: 'info-3',
          title: '대륙별 생활비 비교 분석',
          content: '아시아, 유럽, 북미, 남미, 오세아니아 등 대륙별 생활비를 항목별로 비교 분석했습니다.',
          author: { id: 'info-author-3', name: '글로벌라이프', profileImagePath: '' },
          category: '생활정보',
          categoryColor: '#4caf50',
          createdAt: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString(),
          likeCount: 28,
          commentCount: 9,
          viewCount: 142,
          source: 'information',
          matchScore: 85,
          tags: ['생활비', '해외생활', '비교분석']
        }
      ];
      
      return dummyData;
    } catch (error) {
      console.error('정보 게시글 가져오기 실패:', error);
      return [];
    }
  }, []);

  // 카테고리별 색상 코드 반환
  const getCategoryColor = (category: string): string => {
    const categoryColors: Record<string, string> = {
      '여행': '#2196f3',
      '맛집': '#f44336',
      '사진': '#9c27b0',
      '음악': '#4caf50',
      '역사': '#ff9800',
      '영화': '#795548',
      '독서': '#607d8b',
      '예술': '#e91e63',
      '스포츠': '#00bcd4',
      '취미': '#673ab7',
      '토론': '#3f51b5',
      '질문': '#009688',
      // 토론 카테고리
      '정치/사회': '#3f51b5',
      '경제': '#009688',
      '과학/기술': '#2196f3',
      '생활/문화': '#f44336',
      '스포츠/레저': '#4caf50',
      '엔터테인먼트': '#9c27b0',
      // 정보 카테고리
      '취업/이직': '#2196f3',
      '비자/법률': '#f44336',
      '생활정보': '#4caf50',
      '학업/교육': '#9c27b0',
      '부동산/주거': '#ff9800',
    };

    return categoryColors[category] || '#757575'; // 매핑이 없으면 기본 색상 반환
  };

  // 데이터 로딩 함수
  const loadData = useCallback(async () => {
    setIsLoading(true);
    setError(null);

    try {
      // 유저 위치 정보 가져오기
      const userAddress = await getUserLocation();
      
      // 병렬로 모든 종류의 게시글을 가져오기
      try {
        // 자유/모임 게시글 주소 설정
        const jaYuAddress = '자유';
        const moimAddress = userAddress;
        
        // 병렬로 API 호출
        const [jaYuPostsData, moimPostsData, debatePostsData, infoPostsData] = await Promise.all([
          // 자유 게시글 - address를 '자유'로 설정
          CommunityService.getRecommendedPosts(jaYuAddress, 4),
          
          // 모임 게시글 - 현재 위치 정보 사용
          CommunityService.getRecommendedPosts(moimAddress, 4),
          
          // 토론 게시글 - 추천 API 사용
          fetchDebatePosts(),
          
          // 정보 게시글 (임시)
          fetchInfoPosts()
        ]);
        
        // 자유 게시글 필터링 및 설정 - source가 community인 글만
        const filteredJaYuPosts = jaYuPostsData.filter(
          post => post.source === 'community'
        );
        setJaYuPosts(filteredJaYuPosts.length > 0 ? filteredJaYuPosts : []);
        
        // 모임 게시글 필터링 및 설정 - source가 discussion인 글만
        const filteredMoimPosts = moimPostsData.filter(
          post => post.source === 'discussion'
        );
        setMoimPosts(filteredMoimPosts.length > 0 ? filteredMoimPosts : []);
        
        // 토론 게시글 설정
        setDebatePosts(debatePostsData);
        
        // 정보 게시글 설정
        setInfoPosts(infoPostsData);
        
        // 추천 탭용 게시글 - 모든 소스의 게시글을 매칭 점수로 정렬하여 혼합
        const allPosts = [
          ...filteredJaYuPosts,
          ...filteredMoimPosts,
          ...debatePostsData,
          ...infoPostsData
        ];
        
        // 매칭 점수 기준으로 내림차순 정렬
        const sortedPosts = allPosts.sort((a, b) => {
          // 매칭 점수가 없는 경우 기본값 설정
          const scoreA = a.matchScore || 0;
          const scoreB = b.matchScore || 0;
          return scoreB - scoreA;
        });
        
        // 상위 10개만 사용
        setRecommendedPosts(sortedPosts.slice(0, 10));
        
      } catch (err) {
        console.error('게시글 데이터 가져오기 실패:', err);
        throw err;
      }
    } catch (err) {
      console.error('Feed 데이터 로딩 실패:', err);
      setError('데이터를 불러오는 중 오류가 발생했습니다.');
    } finally {
      setIsLoading(false);
    }
  }, [getUserLocation, fetchDebatePosts, fetchInfoPosts]);

  // 컴포넌트 마운트 시 데이터 로딩
  useEffect(() => {
    loadData();
  }, [loadData]);

  // communitySubTab이 변경될 때 데이터 다시 로드
  useEffect(() => {
    if (isCommunitySubTabOpen) {
      loadData();
    }
  }, [communitySubTab, isCommunitySubTabOpen, loadData]);

  // 로딩 컴포넌트
  const renderLoading = useCallback(() => (
    <Box sx={{ display: 'flex', justifyContent: 'center', py: 4 }}>
      <CircularProgress size={28} />
    </Box>
  ), []);

  // 에러 컴포넌트
  const renderError = useCallback(() => (
    <Alert 
      severity="error" 
      icon={<ErrorOutlineIcon />}
      sx={{ mt: 2 }}
      action={
        <Button 
          color="inherit" 
          size="small" 
          startIcon={<RefreshIcon />}
          onClick={loadData}
        >
          다시 시도
        </Button>
      }
    >
      {error}
    </Alert>
  ), [error, loadData]);

  // 데이터 없음 컴포넌트
  const renderEmpty = useCallback((message: string) => (
    <Box sx={{ 
      py: 4, 
      display: 'flex', 
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center',
      bgcolor: 'action.hover',
      borderRadius: 2,
      textAlign: 'center'
    }}>
      <Box sx={{ 
        p: 1.5, 
        bgcolor: 'background.paper', 
        borderRadius: '50%',
        mb: 1,
        boxShadow: '0 2px 8px rgba(0,0,0,0.05)'
      }}>
        <ErrorOutlineIcon color="action" />
      </Box>
      <Typography variant="body2" color="text.secondary">
        {message}
      </Typography>
    </Box>
  ), []);

  // 탭 렌더링
  const renderTabs = useCallback(() => {
    if (!isCommunitySubTabOpen) {
      return (
        <Tabs value={mainTab} onChange={(_, v) => {
          if (v === '커뮤니티') setIsCommunitySubTabOpen(true);
          else setMainTab(v);
        }} variant="fullWidth" sx={widgetTabsBase}>
          <Tab label="추천" value="추천" />
          <Tab label="커뮤니티" value="커뮤니티" />
          <Tab label="토론" value="토론" />
          <Tab label="정보" value="정보" />
        </Tabs>
      );
    } else {
      return (
        <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
          <IconButton onClick={() => setIsCommunitySubTabOpen(false)}>
            <ArrowBackIcon />
          </IconButton>
          <Tabs value={communitySubTab} onChange={(_, v) => setCommunitySubTab(v)} sx={{ ...widgetTabsBase, flex: 1 }}>
            <Tab label="모임" value="모임" />
            <Tab label="자유" value="자유" />
          </Tabs>
        </Box>
      );
    }
  }, [mainTab, isCommunitySubTabOpen, communitySubTab]);

  // 현재 탭에 따른 컨텐츠 렌더링
  const renderTabContent = useMemo(() => {
    if (isLoading) return renderLoading();
    
    if (error) return renderError();
    
    if (isCommunitySubTabOpen) {
      // 커뮤니티 하위 탭 컨텐츠
      const posts = communitySubTab === '자유' ? jaYuPosts : moimPosts;
      
      return posts.length > 0 
        ? posts.map(post => (
            <PostItem 
              key={post.id} 
              post={post} 
              onClick={() => navigate(`/community/${post.id}`)} 
            />
          ))
        : renderEmpty(`${communitySubTab} 게시글이 없습니다`);
    } else {
      // 메인 탭 컨텐츠
      switch (mainTab) {
        case '추천':
          return recommendedPosts.length > 0 
            ? recommendedPosts.map(post => (
                <PostItem 
                  key={post.id} 
                  post={post} 
                  onClick={() => {
                    // 소스에 따라 다른 경로로 라우팅
                    let route;
                    switch (post.source) {
                      case 'debate':
                        route = `/debate/${post.id}`;
                        break;
                      case 'information':
                        route = `/info/${post.id}`;
                        break;
                      case 'community':
                      case 'discussion':
                      default:
                        route = `/community/${post.id}`;
                        break;
                    }
                    navigate(route);
                  }} 
                />
              ))
            : renderEmpty('추천 게시글이 없습니다');
            
        case '토론':
          return debatePosts.length > 0 
            ? debatePosts.map(post => (
                <PostItem 
                  key={post.id} 
                  post={post} 
                  onClick={() => navigate(`/debate/${post.id}`)} 
                />
              ))
            : renderEmpty('토론 게시글이 없습니다');
            
        case '정보':
          return infoPosts.length > 0 
            ? infoPosts.map(post => (
                <PostItem 
                  key={post.id} 
                  post={post} 
                  onClick={() => navigate(`/info/${post.id}`)} 
                />
              ))
            : renderEmpty('정보 게시글이 없습니다');
            
        default:
          return (
            <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: 200, color: 'text.secondary' }}>
              커뮤니티 탭에서 모임/자유를 선택하세요.
            </Box>
          );
      }
    }
  }, [
    isLoading, 
    error, 
    isCommunitySubTabOpen, 
    communitySubTab, 
    mainTab, 
    jaYuPosts, 
    moimPosts, 
    recommendedPosts, 
    debatePosts, 
    infoPosts, 
    renderLoading, 
    renderError, 
    renderEmpty, 
    navigate
  ]);

  return (
    <Paper
      elevation={0}
      sx={{
        ...widgetPaperBase,
        background: widgetGradients.pink,
      }}
    >
      {/* 헤더 영역 */}
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 1 }}>
        <Typography variant="h6" fontWeight={600}>
          탐색
        </Typography>
        <Box>
          <IconButton 
            size="small" 
            onClick={loadData}
            sx={{ 
              bgcolor: 'action.hover',
              mr: 1
            }}
          >
            <RefreshIcon fontSize="small" />
          </IconButton>
          <IconButton 
            size="small" 
            sx={{ 
              bgcolor: 'action.hover' 
            }}
          >
            <FilterListIcon fontSize="small" />
          </IconButton>
        </Box>
      </Box>
      
      {/* 상단 탭/소탭 */}
      {renderTabs()}
      
      {/* 탭별 컨텐츠 */}
      <Box sx={{ overflowY: 'auto', maxHeight: 340, flex: 1, pb: 2 }}>
        {renderTabContent}
      </Box>
      
      {/* 더보기 버튼 */}
      <Box sx={{ display: 'flex', justifyContent: 'center', mt: 'auto', pt: 2 }}>
        <Button variant="outlined" size="small" sx={{ borderRadius: 2, textTransform: 'none', px: 3 }}>
          {!isCommunitySubTabOpen ? (mainTab + ' 더 보기') : (communitySubTab + ' 더 보기')}
        </Button>
      </Box>
    </Paper>
  );
};

export default DynamicFeedWidget;