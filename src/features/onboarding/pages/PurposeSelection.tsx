import React, { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import {
  Box,
  Typography,
  Container,
  Card,
  CardContent,
  CardActionArea,
  useTheme,
  useMediaQuery,
  Paper,
  styled,
  Button,
  alpha,
} from '@mui/material';
import { useThemeStore } from '../../theme/store/themeStore';
import OnboardingLayout from '../components/common/OnboardingLayout';
import FormButtons from '../components/common/FormButtons';
import SchoolIcon from '@mui/icons-material/School';
import FlightIcon from '@mui/icons-material/Flight';
import HomeIcon from '@mui/icons-material/Home';
import WorkIcon from '@mui/icons-material/Work';
import ArrowForwardIcon from '@mui/icons-material/ArrowForward';
import { mainCategories } from '../components/common/CommonTags';
import { motion } from 'framer-motion';
import { useSnackbar } from 'notistack';
import { useTranslation } from '@/shared/i18n';

// Material UI의 Grid를 스타일링된 버전으로 재정의
//const Grid = styled(Box)(({ theme }) => ({}));
const { t } = useTranslation();
const MotionCard = styled(motion.div)(({ theme }) => ({
  height: '100%',
  width: '100%',
  perspective: '1000px',
}));

const StyledCard = styled(Card)(({ theme }) => ({
  borderRadius: theme.spacing(3),
  boxShadow: '0 8px 24px rgba(80, 80, 90, 0.08)',
  overflow: 'hidden',
  height: '100%',
  transition: 'all 0.3s ease',
  position: 'relative',
  border: '1px solid #e0e0e0',
  background: '#fafbfc',
}));

const CardOverlay = styled(Box)(({ theme }) => ({
  position: 'absolute',
  top: 0,
  left: 0,
  right: 0,
  bottom: 0,
  background: 'linear-gradient(180deg, rgba(0,0,0,0) 60%, rgba(0,0,0,0.04) 100%)',
  zIndex: 1,
  opacity: 0,
  transition: 'opacity 0.3s ease',
}));

const IconWrapper = styled(Box)(({ theme }) => ({
  width: 80,
  height: 80,
  borderRadius: '50%',
  display: 'flex',
  justifyContent: 'center',
  alignItems: 'center',
  marginBottom: theme.spacing(3),
  transition: 'all 0.3s ease',
  background: '#e0e0e0',
  color: '#636363',
}));

const PurposeCard: React.FC<{
  id: string;
  name: string;
  selected: boolean;
  onClick: () => void;
  icon: React.ReactNode;
  description: string;
  themeColor: string;
  imageSrc?: string;
}> = ({ id, name, selected, onClick, icon, description, themeColor, imageSrc }) => {
  const theme = useTheme();

  const cardVariants = {
    unselected: { scale: 1, y: 0 },
    selected: { scale: 1.03, y: -5 },
  };

  return (
    <MotionCard
      initial="unselected"
      animate={selected ? 'selected' : 'unselected'}
      variants={cardVariants}
      transition={{ type: 'spring', stiffness: 300, damping: 20 }}
      whileHover={{ scale: 1.02, y: -8 }}
    >
      <StyledCard
        elevation={selected ? 4 : 0}
        sx={{
          border: selected ? '1px solid #636363' : '1px solid #e0e0e0',
          '&:hover': {
            boxShadow: '0 12px 28px #bdbdbd',
          },
          background: imageSrc ? `url(${imageSrc})` : '#fafbfc',
          backgroundSize: 'cover',
          backgroundPosition: 'center',
        }}
      >
        <CardActionArea
          onClick={onClick}
          sx={{
            height: '100%',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            padding: { xs: 3, md: 4 },
            position: 'relative',
            zIndex: 2,
            backgroundColor: '#fafbfc',
          }}
        >
          <Box
            className="card-overlay"
            sx={{
              position: 'absolute',
              top: 0,
              left: 0,
              right: 0,
              bottom: 0,
              opacity: 0,
              transition: 'opacity 0.3s ease',
              background: '#e0e0e0',
            }}
          />

          <IconWrapper
            sx={{
              backgroundColor: selected ? '#636363' : '#e0e0e0',
              color: selected ? 'white' : '#636363',
              transform: selected ? 'scale(1.1)' : 'scale(1)',
              width: 70,
              height: 70,
            }}
          >
            {icon}
          </IconWrapper>

          <CardContent
            sx={{
              width: '100%',
              textAlign: 'center',
              padding: 2,
            }}
          >
            <Typography
              variant="h5"
              component="h2"
              fontWeight="600"
              gutterBottom
              sx={{
                color: selected ? '#636363' : 'text.primary',
                transition: 'color 0.3s ease',
                fontSize: { xs: '1.3rem', md: '1.5rem' },
                letterSpacing: '-0.01em',
              }}
            >
              {name}
            </Typography>

            <Typography
              variant="body2"
              color="text.secondary"
              sx={{
                mb: 2,
                display: '-webkit-box',
                WebkitLineClamp: 3,
                WebkitBoxOrient: 'vertical',
                overflow: 'hidden',
                textOverflow: 'ellipsis',
                height: '4.5em',
                lineHeight: 1.5,
                fontWeight: 400,
                opacity: 0.85,
              }}
            >
              {description}
            </Typography>

            {selected && (
              <Button
                variant="outlined"
                color="primary"
                size="small"
                endIcon={<ArrowForwardIcon />}
                sx={{
                  borderColor: '#636363',
                  color: '#636363',
                  '&:hover': {
                    borderColor: '#636363',
                    backgroundColor: '#e0e0e0',
                  },
                  fontWeight: 600,
                  borderRadius: '50px',
                  padding: '6px 16px',
                  textTransform: 'none',
                }}
              >
                {t('onboarding.purpose.select')}
              </Button>
            )}
          </CardContent>
        </CardActionArea>
      </StyledCard>
    </MotionCard>
  );
};

// 목적별 이미지 매핑
const purposeImageMap: Record<string, string> = {
  study: '/images/purpose/study-background.jpg',
  travel: '/images/purpose/travel-background.jpg',
  living: '/images/purpose/living-background.jpg',
  job: '/images/purpose/job-background.jpg',
};

// 배경 애니메이션 컴포넌트
const AnimatedBackground = styled(Box)(({ theme }) => ({
  position: 'absolute',
  top: 0,
  left: 0,
  right: 0,
  bottom: 0,
  overflow: 'hidden',
  zIndex: -1,
}));

// 애니메이션 원 컴포넌트
const AnimatedCircle = styled(motion.div)(({ theme }) => ({
  position: 'absolute',
  borderRadius: '50%',
  background: 'rgba(255, 255, 255, 0.03)',
}));

/**
 * 온보딩 목적 선택 페이지
 */
const PurposeSelection: React.FC = () => {
  const navigate = useNavigate();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
  const { season } = useThemeStore();
  const { enqueueSnackbar } = useSnackbar();
  const location = useLocation();

  const [selectedPurpose, setSelectedPurpose] = useState<string | null>(null);

  // 목적 아이콘 매핑
  const purposeIconMap: Record<string, React.ReactNode> = {
    study: <SchoolIcon sx={{ fontSize: 40 }} />,
    travel: <FlightIcon sx={{ fontSize: 40 }} />,
    living: <HomeIcon sx={{ fontSize: 40 }} />,
    job: <WorkIcon sx={{ fontSize: 40 }} />,
  };

  // 목적 설명 매핑
  const purposeDescriptionMap: Record<string, string> = {
    study: t('onboarding.purpose.study'),
    travel: t('onboarding.purpose.travel'),
    living: t('onboarding.purpose.living'),
    job: t('onboarding.purpose.job'),
  };

  // 다음 단계로 이동
  const handleNext = () => {
    setSelectedPurpose(null);
    if (selectedPurpose) {
      navigate(`/onboarding/${selectedPurpose}`);
    }
  };

  // 배경 애니메이션용 원 위치 생성
  const circleVariants = {
    animate: (i: number) => ({
      y: [0, -10, 0],
      transition: {
        duration: 4 + i,
        repeat: Infinity,
        ease: 'easeInOut',
        delay: i * 0.3,
      },
    }),
  };

  // onboarding 리다이렉트 시 스낵바 알림
  React.useEffect(() => {
    const params = new URLSearchParams(location.search);
    if (params.has('from')) {
      enqueueSnackbar('Please complete detailed information entry', { variant: 'info', autoHideDuration: 1500 });
    }
  }, [location.search, enqueueSnackbar]);

  return (
    <Box
      sx={{
        minHeight: '100%',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        position: 'relative',
        overflow: 'hidden',
        py: 6,
      }}
    >
      {/* 배경 애니메이션 */}
      <AnimatedBackground>
        {[...Array(6)].map((_, i) => (
          <AnimatedCircle
            key={i}
            custom={i}
            variants={circleVariants}
            animate="animate"
            style={{
              width: `${150 + i * 100}px`,
              height: `${150 + i * 100}px`,
              top: `${Math.random() * 80}%`,
              left: `${Math.random() * 80}%`,
              border: `1px solid rgba(255, 255, 255, 0.03)`,
              opacity: 0.3 - i * 0.04,
            }}
          />
        ))}
      </AnimatedBackground>

      <Container maxWidth="md" sx={{ py: 4, zIndex: 1 }}>
        <Box textAlign="center" mb={6}>
          <Typography
            variant="h3"
            component="h1"
            fontWeight="600"
            mb={2}
            sx={{
              color: 'text.primary',
              fontSize: { xs: '2rem', sm: '2.5rem', md: '2.8rem' },
              letterSpacing: '-0.02em',
            }}
          >
            {t('onboarding.purpose.welcome')}
          </Typography>
          <Typography
            variant="subtitle1"
            color="text.secondary"
            sx={{
              maxWidth: '700px',
              mx: 'auto',
              mb: 2,
              fontSize: { xs: '1rem', md: '1.1rem' },
              fontWeight: 400,
              letterSpacing: '-0.01em',
              opacity: 0.85,
            }}
          >
            {t('onboarding.purpose.description')}
          </Typography>
        </Box>

        {/* 2x2 그리드 레이아웃 */}
        <Box
          sx={{
            display: 'grid',
            gridTemplateColumns: { xs: '1fr', sm: '1fr 1fr' },
            gap: { xs: 3, md: 4 },
            width: '100%',
            maxWidth: '900px',
            mx: 'auto',
          }}
        >
          {mainCategories.map(category => (
            <Box
              key={category.id}
              sx={{
                height: { xs: '280px', md: '330px' },
              }}
            >
              <PurposeCard
                id={category.id}
                name={category.name}
                selected={selectedPurpose === category.id}
                onClick={() => {
                  setSelectedPurpose(category.id);
                  navigate(`/onboarding/${category.id}`);
                }}
                icon={purposeIconMap[category.id]}
                description={purposeDescriptionMap[category.id]}
                themeColor={category.id}
                imageSrc={purposeImageMap[category.id]}
              />
            </Box>
          ))}
        </Box>
      </Container>
    </Box>
  );
};

export default PurposeSelection;
