import React, { useState } from 'react';
import {
  Box,
  Chip,
  Typography,
  Accordion,
  AccordionSummary,
  AccordionDetails,
  useTheme,
  useMediaQuery,
} from '@mui/material';
import styled from '@emotion/styled';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import { useThemeStore } from '../../../theme/store/themeStore';
import { useTranslation } from '@/shared/i18n';

const { t } = useTranslation();
// 태그 인터페이스
interface Tag {
  id: string;
  name: string;
}

// 카테고리 인터페이스
interface Category {
  id: string;
  name: string;
}

// 스타일드 컴포넌트
const ThemedAccordion = styled(Accordion)<{ season: string }>`
  background: rgba(255, 255, 255, 0.9);
  border-radius: 12px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.05);
  margin-bottom: 8px;
  border: 1px solid
    ${props =>
      props.season === 'spring'
        ? 'rgba(255, 235, 235, 0.8)'
        : props.season === 'summer'
          ? 'rgba(230, 240, 255, 0.8)'
          : props.season === 'autumn'
            ? 'rgba(255, 235, 215, 0.8)'
            : 'rgba(230, 235, 250, 0.8)'};

  &:before {
    display: none;
  }

  &.Mui-expanded {
    margin-bottom: 16px;
    box-shadow: 0 6px 16px
      ${props =>
        props.season === 'spring'
          ? 'rgba(255, 170, 180, 0.15)'
          : props.season === 'summer'
            ? 'rgba(100, 170, 220, 0.15)'
            : props.season === 'autumn'
              ? 'rgba(230, 130, 110, 0.15)'
              : 'rgba(135, 149, 181, 0.15)'};
  }
`;

const ThemedSummary = styled(AccordionSummary)<{ season: string }>`
  border-radius: 12px;
  background: linear-gradient(
    135deg,
    ${props =>
      props.season === 'spring'
        ? 'rgba(255, 245, 245, 0.7) 0%, rgba(255, 235, 235, 0.7) 100%'
        : props.season === 'summer'
          ? 'rgba(230, 245, 255, 0.7) 0%, rgba(210, 235, 255, 0.7) 100%'
          : props.season === 'autumn'
            ? 'rgba(255, 245, 230, 0.7) 0%, rgba(255, 235, 220, 0.7) 100%'
            : 'rgba(245, 250, 255, 0.7) 0%, rgba(235, 240, 255, 0.7) 100%'}
  );

  .MuiAccordionSummary-content {
    margin: 10px 0;
  }
`;

const ThemedChip = styled(Chip)<{ season: string; selected?: boolean }>`
  margin: 4px;
  background-color: ${props => {
    if (props.selected) {
      return props.season === 'spring'
        ? '#FFAAA5'
        : props.season === 'summer'
          ? '#77AADD'
          : props.season === 'autumn'
            ? '#E8846B'
            : '#8795B5';
    } else {
      return props.season === 'spring'
        ? '#FFF5F5'
        : props.season === 'summer'
          ? '#F0F8FF'
          : props.season === 'autumn'
            ? '#FFF5EE'
            : '#F5F8FF';
    }
  }};
  color: ${props => (props.selected ? '#FFF' : '#666')};
  border: 1px solid
    ${props => {
      if (props.selected) {
        return props.season === 'spring'
          ? '#FFAAA5'
          : props.season === 'summer'
            ? '#77AADD'
            : props.season === 'autumn'
              ? '#E8846B'
              : '#8795B5';
      } else {
        return props.season === 'spring'
          ? '#FFD7D7'
          : props.season === 'summer'
            ? '#A9D7F6'
            : props.season === 'autumn'
              ? '#FFDAC1'
              : '#D6E1FF';
      }
    }};
  box-shadow: ${props =>
    props.selected
      ? props.season === 'spring'
        ? '0 2px 8px rgba(255, 170, 165, 0.3)'
        : props.season === 'summer'
          ? '0 2px 8px rgba(100, 170, 220, 0.3)'
          : props.season === 'autumn'
            ? '0 2px 8px rgba(230, 130, 110, 0.3)'
            : '0 2px 8px rgba(135, 149, 181, 0.3)'
      : 'none'};

  &:hover {
    background-color: ${props => {
      if (props.selected) {
        return props.season === 'spring'
          ? '#FF9999'
          : props.season === 'summer'
            ? '#5599CC'
            : props.season === 'autumn'
              ? '#D66E59'
              : '#768AAA';
      } else {
        return props.season === 'spring'
          ? '#FFE5E5'
          : props.season === 'summer'
            ? '#E6F2FF'
            : props.season === 'autumn'
              ? '#FFEEDD'
              : '#E6EEFF';
      }
    }};
  }

  &:active {
    box-shadow: 0 1px 4px rgba(0, 0, 0, 0.2);
  }

  transition: all 0.3s ease;
`;

interface OnboardingTagSelectorProps {
  categories: Category[];
  tags: Tag[];
  selectedTags: string[];
  onChange: (tags: string[]) => void;
  maxSelection?: number;
  title?: string;
  description?: string;
  grouped?: boolean;
  groupMapping?: Record<string, string[]>;
}

/**
 * 온보딩에서 사용할 태그 선택 컴포넌트
 */
const OnboardingTagSelector: React.FC<OnboardingTagSelectorProps> = ({
  categories,
  tags,
  selectedTags = [],
  onChange,
  maxSelection = 5,
  title = '관심 태그 선택',
  description = '관심 있는 주제를 선택해주세요.',
  grouped = false,
  groupMapping,
}) => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
  const { season } = useThemeStore();
  const [expanded, setExpanded] = useState<string | false>(
    categories.length > 0 ? categories[0].id : false
  );

  const handleAccordionChange =
    (panel: string) => (event: React.SyntheticEvent, isExpanded: boolean) => {
      setExpanded(isExpanded ? panel : false);
    };

  const handleTagToggle = (tagId: string) => {
    if (selectedTags.includes(tagId)) {
      // 태그가 이미 선택되어 있으면 제거
      onChange(selectedTags.filter(t => t !== tagId));
    } else {
      // 최대 선택 가능 개수 확인
      if (selectedTags.length < maxSelection) {
        // 태그가 선택되어 있지 않으면 추가
        onChange([...selectedTags, tagId]);
      }
    }
  };

  // 계절에 따른 색상 가져오기
  const getColorByTheme = () => {
    switch (season) {
      case 'spring':
        return '#FFAAA5';
      case 'summer':
        return '#77AADD';
      case 'autumn':
        return '#E8846B';
      case 'winter':
        return '#8795B5';
      default:
        return '#FFAAA5';
    }
  };

  const primaryColor = getColorByTheme();

  // 태그를 카테고리별로 그룹화 (grouped가 true이고 groupMapping이 제공된 경우)
  const renderGroupedTags = () => {
    return categories.map(category => (
      <ThemedAccordion
        key={category.id}
        expanded={expanded === category.id}
        onChange={handleAccordionChange(category.id)}
        season={season}
      >
        <ThemedSummary expandIcon={<ExpandMoreIcon sx={{ color: primaryColor }} />} season={season}>
          <Typography
            variant="subtitle1"
            sx={{
              fontWeight: 600,
              color: '#555',
              display: 'flex',
              alignItems: 'center',
            }}
          >
            <Box
              component="span"
              sx={{
                display: 'inline-block',
                width: 8,
                height: 8,
                borderRadius: '50%',
                bgcolor: primaryColor,
                mr: 1,
              }}
            />
            {category.name}
          </Typography>
        </ThemedSummary>
        <AccordionDetails sx={{ pt: 1 }}>
          <Box
            sx={{
              display: 'flex',
              flexWrap: 'wrap',
              gap: 0.5,
            }}
          >
            {groupMapping &&
              groupMapping[category.id]?.map(tagId => {
                const tag = tags.find(t => t.id === tagId);
                if (!tag) return null;

                return (
                  <ThemedChip
                    key={tag.id}
                    label={tag.name}
                    clickable
                    season={season}
                    selected={selectedTags.includes(tag.id)}
                    onClick={() => handleTagToggle(tag.id)}
                    size={isMobile ? 'small' : 'medium'}
                  />
                );
              })}
          </Box>
        </AccordionDetails>
      </ThemedAccordion>
    ));
  };

  // 태그를 그룹화 없이 일괄 표시
  const renderAllTags = () => {
    return (
      <Box
        sx={{
          display: 'flex',
          flexWrap: 'wrap',
          gap: 0.5,
          mt: 2,
        }}
      >
        {tags.map(tag => (
          <ThemedChip
            key={tag.id}
            label={tag.name}
            clickable
            season={season}
            selected={selectedTags.includes(tag.id)}
            onClick={() => handleTagToggle(tag.id)}
            size={isMobile ? 'small' : 'medium'}
          />
        ))}
      </Box>
    );
  };

  return (
    <Box sx={{ width: '100%' }}>
      {title && (
        <Typography variant="h6" sx={{ mb: 1, fontWeight: 600 }}>
          {title}
        </Typography>
      )}

      {description && (
        <Typography variant="body2" sx={{ mb: 2, color: 'text.secondary' }}>
          {description}
        </Typography>
      )}

      {maxSelection > 0 && (
        <Typography
          variant="body2"
          sx={{
            mb: 1,
            color: '#888',
            fontSize: '0.85rem',
            textAlign: 'right',
          }}
        >
          {t('tagDes.0')} {maxSelection} {t('tagDes.1')} ({selectedTags.length}/{maxSelection})
        </Typography>
      )}

      {grouped && groupMapping ? renderGroupedTags() : renderAllTags()}
    </Box>
  );
};

export default OnboardingTagSelector;
