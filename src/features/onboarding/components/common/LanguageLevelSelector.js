import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { Box, Typography, FormControl, RadioGroup, FormControlLabel, Radio, Paper, useTheme, useMediaQuery, } from '@mui/material';
import { useThemeStore } from '../../../theme/store/themeStore';
import { languageLevels } from '../../components/common/CommonTags';
import styled from '@emotion/styled';
// 스타일드 컴포넌트
const LevelCard = styled(Paper) `
  padding: 16px;
  border-radius: 8px;
  margin-bottom: 12px;
  border: 2px solid 
    ${props => props.isSelected ?
    props.season === 'spring' ? '#FFAAA5' :
        props.season === 'summer' ? '#77AADD' :
            props.season === 'autumn' ? '#E8846B' :
                '#8795B5' : 'transparent'};
  
  background-color: ${props => props.isSelected ?
    props.season === 'spring' ? 'rgba(255, 170, 165, 0.05)' :
        props.season === 'summer' ? 'rgba(119, 170, 221, 0.05)' :
            props.season === 'autumn' ? 'rgba(232, 132, 107, 0.05)' :
                'rgba(135, 149, 181, 0.05)' : 'white'};
      
  transition: all 0.3s ease;
  
  &:hover {
    border-color: ${props => props.season === 'spring' ? '#FFAAA5' :
    props.season === 'summer' ? '#77AADD' :
        props.season === 'autumn' ? '#E8846B' :
            '#8795B5'};
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.05);
  }
`;
/**
 * 한국어 수준 선택 컴포넌트
 */
const LanguageLevelSelector = ({ value, onChange, title = '한국어 능력', subtitle = '본인의 한국어 수준을 선택해주세요.', }) => {
    const theme = useTheme();
    const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
    const { season } = useThemeStore();
    // 계절에 따른 색상 가져오기
    const getColorByTheme = () => {
        switch (season) {
            case 'spring': return '#FFAAA5';
            case 'summer': return '#77AADD';
            case 'autumn': return '#E8846B';
            case 'winter': return '#8795B5';
            default: return '#FFAAA5';
        }
    };
    const primaryColor = getColorByTheme();
    return (_jsxs(Box, { sx: { mb: 4 }, children: [title && (_jsx(Typography, { variant: "h6", sx: { mb: 1, fontWeight: 600 }, children: title })), subtitle && (_jsx(Typography, { variant: "body2", sx: { mb: 3, color: 'text.secondary' }, children: subtitle })), _jsx(FormControl, { component: "fieldset", fullWidth: true, children: _jsx(RadioGroup, { value: value, onChange: (e) => onChange(e.target.value), children: languageLevels.map(level => (_jsx(LevelCard, { season: season, isSelected: value === level.id, elevation: value === level.id ? 2 : 0, children: _jsx(FormControlLabel, { value: level.id, control: _jsx(Radio, { sx: {
                                    color: theme.palette.grey[400],
                                    '&.Mui-checked': { color: primaryColor },
                                } }), label: _jsxs(Box, { children: [_jsx(Typography, { variant: "subtitle1", fontWeight: 600, children: level.name }), _jsx(Typography, { variant: "body2", color: "text.secondary", children: level.description })] }), sx: { width: '100%', m: 0 } }) }, level.id))) }) })] }));
};
export default LanguageLevelSelector;
