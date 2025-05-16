import { jsxs as _jsxs, jsx as _jsx } from "react/jsx-runtime";
import { useState } from 'react';
import { Box, Chip, Typography, Accordion, AccordionSummary, AccordionDetails, useTheme, useMediaQuery, } from '@mui/material';
import styled from '@emotion/styled';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
// 봄 테마 스타일
const SpringThemedAccordion = styled(Accordion) `
  background: rgba(255, 255, 255, 0.9);
  border-radius: 12px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.05);
  margin-bottom: 8px;
  border: 1px solid rgba(255, 235, 235, 0.8);

  &:before {
    display: none;
  }

  &.Mui-expanded {
    margin-bottom: 16px;
    box-shadow: 0 6px 16px rgba(255, 170, 180, 0.15);
  }
`;
const SpringThemedSummary = styled(AccordionSummary) `
  border-radius: 12px;
  background: linear-gradient(135deg, rgba(255, 245, 245, 0.7) 0%, rgba(255, 235, 235, 0.7) 100%);

  .MuiAccordionSummary-content {
    margin: 10px 0;
  }
`;
const SpringThemedChip = styled(Chip) `
  margin: 4px;
  background-color: ${props => (props.selected ? '#FFAAA5' : '#FFF5F5')};
  color: ${props => (props.selected ? '#FFF' : '#666')};
  border: 1px solid ${props => (props.selected ? '#FFAAA5' : '#FFD7D7')};
  box-shadow: ${props => (props.selected ? '0 2px 8px rgba(255, 170, 165, 0.3)' : 'none')};

  &:hover {
    background-color: ${props => (props.selected ? '#FF9999' : '#FFE5E5')};
  }

  &:active {
    box-shadow: 0 1px 4px rgba(255, 170, 165, 0.4);
  }

  transition: all 0.3s ease;
`;
// tag
// 대분류
const mainCategories = [
    { id: 'travel', name: '여행' },
    { id: 'living', name: '주거' },
    { id: 'study', name: '유학' },
    { id: 'job', name: '취업' },
];
// 대분류별 하위 태그
const subTags = {
    travel: ['관광/체험', '식도락/맛집', '교통/이동', '숙소/지역정보', '대사관/응급'],
    living: ['부동산/계약', '생활환경/편의', '문화/생활', '주거지 관리/유지'],
    study: ['학사/캠퍼스', '학업지원/시설', '행정/비자/서류', '기숙사/주거'],
    job: ['이력/채용준비', '비자/법률/노동', '잡페어/네트워킹', '알바/파트타임'],
};
const TagSelector = ({ selectedTags = [], onChange, maxSelection = 1, // 태그 수 1개로 제한
 }) => {
    const theme = useTheme();
    const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
    const [expanded, setExpanded] = useState('travel');
    const handleAccordionChange = (panel) => (event, isExpanded) => {
        setExpanded(isExpanded ? panel : false);
    };
    const handleTagToggle = (tag) => {
        if (selectedTags.includes(tag)) {
            // 태그가 이미 선택되어 있으면 제거
            onChange(selectedTags.filter(t => t !== tag));
        }
        else {
            // 최대 선택 가능 개수 확인
            if (selectedTags.length < maxSelection) {
                // 태그가 선택되어 있지 않으면 추가
                onChange([...selectedTags, tag]);
            }
        }
    };
    return (_jsxs(Box, { sx: { width: '100%' }, children: [maxSelection > 0 && (_jsxs(Typography, { variant: "body2", sx: {
                    mb: 1,
                    color: '#888',
                    fontSize: '0.85rem',
                    textAlign: 'right',
                }, children: ["\uD0DC\uADF8\uB294 \uCD5C\uB300 ", maxSelection, "\uAC1C\uAE4C\uC9C0 \uC120\uD0DD \uAC00\uB2A5\uD569\uB2C8\uB2E4 (", selectedTags.length, "/", maxSelection, ")"] })), mainCategories.map(category => (_jsxs(SpringThemedAccordion, { expanded: expanded === category.id, onChange: handleAccordionChange(category.id), children: [_jsx(SpringThemedSummary, { expandIcon: _jsx(ExpandMoreIcon, { sx: { color: '#FF9999' } }), children: _jsxs(Typography, { variant: "subtitle1", sx: {
                                fontWeight: 600,
                                color: '#555',
                                display: 'flex',
                                alignItems: 'center',
                            }, children: [_jsx(Box, { component: "span", sx: {
                                        display: 'inline-block',
                                        width: 8,
                                        height: 8,
                                        borderRadius: '50%',
                                        bgcolor: '#FFAAA5',
                                        mr: 1,
                                    } }), category.name] }) }), _jsx(AccordionDetails, { sx: { pt: 1 }, children: _jsx(Box, { sx: {
                                display: 'flex',
                                flexWrap: 'wrap',
                                gap: 0.5,
                            }, children: subTags[category.id].map(tag => (_jsx(SpringThemedChip, { label: tag, clickable: true, selected: selectedTags.includes(tag), onClick: () => handleTagToggle(tag), size: isMobile ? 'small' : 'medium' }, tag))) }) })] }, category.id)))] }));
};
export default TagSelector;
