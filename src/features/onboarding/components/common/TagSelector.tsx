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
const ThemedAccordion = styled(Accordion)`
  background: #fafbfc;
  border-radius: 12px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.04);
  margin-bottom: 8px;
  border: 1px solid #e0e0e0;
  &:before {
    display: none;
  }
  &.Mui-expanded {
    margin-bottom: 16px;
    box-shadow: 0 6px 16px rgba(173, 173, 173, 0.1);
  }
`;

const ThemedSummary = styled(AccordionSummary)`
  border-radius: 12px;
  background: linear-gradient(135deg, #f5f6f7 0%, #e9e9e9 100%);
  .MuiAccordionSummary-content {
    margin: 10px 0;
  }
`;

const ThemedChip = styled(Chip)<{ selected?: boolean }>`
  margin: 4px;
  background-color: ${props => (props.selected ? '#636363' : '#e6e6e6')};
  color: ${props => (props.selected ? '#fff' : '#666')};
  border: 1px solid ${props => (props.selected ? '#636363' : '#d6d6d6')};
  box-shadow: ${props => (props.selected ? '0 2px 8px rgba(135,149,181,0.15)' : 'none')};
  &:hover {
    background-color: ${props => (props.selected ? '#636363' : '#ededed')};
  }
  &:active {
    box-shadow: 0 1px 4px rgba(0, 0, 0, 0.12);
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

  // 고정된 그레이 컬러
  const primaryColor = '#636363';

  // 태그를 카테고리별로 그룹화 (grouped가 true이고 groupMapping이 제공된 경우)
  const renderGroupedTags = () => {
    return categories.map(category => (
      <ThemedAccordion
        key={category.id}
        expanded={expanded === category.id}
        onChange={handleAccordionChange(category.id)}
      >
        <ThemedSummary expandIcon={<ExpandMoreIcon sx={{ color: primaryColor }} />}>
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
