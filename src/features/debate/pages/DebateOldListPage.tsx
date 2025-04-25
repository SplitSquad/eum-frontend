import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { useDebateStore } from '../store';
import { Debate } from '../types';
import { formatDate } from '../utils/dateUtils';
import DebateLayout from '../components/common/DebateLayout';
import { 
  Box, 
  Typography, 
  Paper, 
  List, 
  ListItem, 
  ListItemText, 
  Checkbox, 
  FormControlLabel, 
  Button,
  InputBase,
  IconButton,
  Pagination,
  Divider,
  styled,
  ListItemButton
} from '@mui/material';
import SearchIcon from '@mui/icons-material/Search';

// 스타일 컴포넌트
const SearchContainer = styled(Paper)(({ theme }) => ({
  padding: '2px 4px',
  display: 'flex',
  alignItems: 'center',
  width: '100%',
  borderRadius: 20,
  marginBottom: theme.spacing(2),
}));

const DebateItemCard = styled(Paper)(({ theme }) => ({
  display: 'flex',
  marginBottom: theme.spacing(2),
  overflow: 'hidden',
  borderRadius: 8,
  backgroundColor: 'rgba(255, 255, 255, 0.85)',
  backdropFilter: 'blur(8px)',
  boxShadow: '0 2px 8px rgba(0,0,0,0.08)',
}));

const CategoryIndicator = styled(Box, {
  shouldForwardProp: (prop) => prop !== 'color',
})<{ color: string }>(({ color }) => ({
  width: 6,
  backgroundColor: color,
  position: 'absolute',
  top: 0,
  bottom: 0,
  left: 0,
}));

const ContentSection = styled(Box)(({ theme }) => ({
  padding: theme.spacing(2),
  width: '100%',
  position: 'relative',
  paddingLeft: theme.spacing(3),
}));

const VoteButtonsContainer = styled(Box)(({ theme }) => ({
  display: 'flex',
  gap: theme.spacing(1),
  marginTop: theme.spacing(1),
}));

const VoteButton = styled(Button, {
  shouldForwardProp: (prop) => prop !== 'voteType',
})<{ voteType: 'pro' | 'con' }>(({ theme, voteType }) => ({
  flex: 1,
  fontSize: '0.75rem',
  fontWeight: 500,
  backgroundColor: voteType === 'pro' ? 'rgba(76, 175, 80, 0.1)' : 'rgba(244, 67, 54, 0.1)',
  color: voteType === 'pro' ? '#4caf50' : '#f44336',
  '&:hover': {
    backgroundColor: voteType === 'pro' ? 'rgba(76, 175, 80, 0.2)' : 'rgba(244, 67, 54, 0.2)',
  },
}));

const CategoryTitle = styled(Typography)(({ theme }) => ({
  fontWeight: 500,
  padding: theme.spacing(1, 2),
  backgroundColor: theme.palette.primary.main,
  color: theme.palette.primary.contrastText,
  borderTopLeftRadius: 4,
  borderTopRightRadius: 4,
  textAlign: 'center',
}));

const FilterItem = styled(ListItemButton)(({ theme }) => ({
  padding: theme.spacing(0.5, 2),
  '&:hover': {
    backgroundColor: 'rgba(0, 0, 0, 0.04)',
  },
}));

const DebateOldListPage: React.FC = () => {
  const { debates, getDebates } = useDebateStore();
  const [currentPage, setCurrentPage] = useState(1);
  const pageSize = 4;

  useEffect(() => {
    // 지난 토론 데이터 로드
    getDebates(currentPage, pageSize);
  }, [getDebates, currentPage]);

  // 색상을 cyclic하게 할당하는 함수
  const getColorForIndex = (index: number) => {
    const colors = ['#4caf50', '#f44336', '#2196f3', '#ff9800', '#9c27b0'];
    return colors[index % colors.length];
  };

  // 사이드바 렌더링
  const renderSidebar = () => (
    <Box>
      <Paper sx={{ mb: 2, overflow: 'hidden', backgroundColor: 'rgba(255, 255, 255, 0.85)', backdropFilter: 'blur(8px)' }}>
        <CategoryTitle variant="subtitle1">
          테마별 찾기
        </CategoryTitle>
        <List disablePadding>
          <FilterItem>
            <ListItemText primary="• 정치/사회" />
          </FilterItem>
          <FilterItem>
            <ListItemText primary="• 경제" />
          </FilterItem>
          <FilterItem>
            <ListItemText primary="• 세계/국제" />
          </FilterItem>
          <FilterItem>
            <ListItemText primary="• 문화" />
          </FilterItem>
          <FilterItem>
            <ListItemText primary="• IT/과학" />
          </FilterItem>
          <FilterItem>
            <ListItemText primary="• 스포츠" />
          </FilterItem>
        </List>
      </Paper>
      
      <Paper sx={{ overflow: 'hidden', backgroundColor: 'rgba(255, 255, 255, 0.85)', backdropFilter: 'blur(8px)' }}>
        <Typography variant="subtitle1" sx={{ p: 2, fontWeight: 600 }}>
          테마에 맞게 찾기
        </Typography>
        <Box sx={{ px: 2, pb: 2 }}>
          <FormControlLabel control={<Checkbox size="small" />} label="인기도순" />
          <FormControlLabel control={<Checkbox size="small" />} label="최신순" />
          <FormControlLabel control={<Checkbox size="small" />} label="균형순" />
        </Box>
      </Paper>
    </Box>
  );

  // 메인 컨텐츠 렌더링
  const renderContent = () => (
    <Box sx={{ display: 'flex', flexDirection: 'column' }}>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
        <Typography variant="h6" fontWeight={600}>
          지난 이슈 살펴보기
        </Typography>
        
        <SearchContainer elevation={1}>
          <InputBase
            sx={{ ml: 1, flex: 1 }}
            placeholder="검색어를 입력하세요"
            inputProps={{ 'aria-label': '검색어를 입력하세요' }}
          />
          <IconButton type="button" sx={{ p: '10px' }} aria-label="search">
            <SearchIcon />
          </IconButton>
        </SearchContainer>
      </Box>

      <Box sx={{ mb: 4 }}>
        <Link to="/debate" style={{ color: '#1976d2', textDecoration: 'none' }}>
          ← 최신 토론으로 돌아가기
        </Link>
      </Box>

      {debates.map((debate, index) => {
        const total = debate.proCount + debate.conCount;
        const proPercentage = total > 0 ? Math.round((debate.proCount / total) * 100) : 0;
        const conPercentage = total > 0 ? Math.round((debate.conCount / total) * 100) : 0;
        
        return (
          <DebateItemCard key={debate.id} elevation={index === 0 ? 3 : 1}>
            <Box sx={{ position: 'relative', width: '100%' }}>
              <CategoryIndicator color={getColorForIndex(index)} />
              <ContentSection>
                <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                  <Box>
                    <Typography variant="h6" component={Link} to={`/debate/${debate.id}`} sx={{ color: 'inherit', textDecoration: 'none', fontWeight: 600 }}>
                      {debate.title}
                    </Typography>
                    <Typography variant="body2" color="text.secondary" sx={{ mt: 1, mb: 2 }}>
                      {debate.content && debate.content.length > 80
                        ? `${debate.content.substring(0, 80)}...`
                        : debate.content}
                    </Typography>
                    <Typography variant="caption" color="text.secondary">
                      {`${formatDate(debate.createdAt)} • 조회 ${debate.viewCount} • 댓글 ${debate.commentCount}`}
                    </Typography>
                  </Box>
                </Box>
                
                <Divider sx={{ my: 2 }} />
                
                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <Box sx={{ display: 'flex', alignItems: 'center' }}>
                    {debate.countryStats && debate.countryStats.length > 0 && (
                      <>
                        <img 
                          src={`/flags/${debate.countryStats[0].countryCode.toLowerCase()}.svg`}
                          alt="국가 국기" 
                          style={{ height: 16, width: 24, marginRight: 8 }}
                        />
                        <Typography variant="body2" color="text.secondary">
                          {debate.countryStats[0].countryName}
                        </Typography>
                      </>
                    )}
                  </Box>
                  
                  <VoteButtonsContainer>
                    <VoteButton variant="contained" disableElevation voteType="pro">
                      찬성 {proPercentage}%
                    </VoteButton>
                    <VoteButton variant="contained" disableElevation voteType="con">
                      반대 {conPercentage}%
                    </VoteButton>
                  </VoteButtonsContainer>
                </Box>
              </ContentSection>
            </Box>
          </DebateItemCard>
        );
      })}

      <Box sx={{ display: 'flex', justifyContent: 'center', mt: 4 }}>
        <Pagination 
          count={10} 
          page={currentPage} 
          onChange={(_, page) => setCurrentPage(page)}
          color="primary" 
        />
      </Box>
    </Box>
  );

  return (
    <DebateLayout
      sidebar={renderSidebar()}
      headerProps={{
        title: '지난 토론',
        showUserIcons: true
      }}
    >
      {renderContent()}
    </DebateLayout>
  );
};

export default DebateOldListPage; 