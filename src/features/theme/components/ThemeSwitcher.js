import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { Box, IconButton, Tooltip } from '@mui/material';
import styled from '@emotion/styled';
import { useThemeStore } from '../store/themeStore';
// 계절별 아이콘 SVG 컴포넌트
const SpringIcon = () => (_jsx("svg", { width: "24", height: "24", viewBox: "0 0 24 24", fill: "none", xmlns: "http://www.w3.org/2000/svg", children: _jsx("path", { d: "M12 1C8.13 1 5 4.13 5 8c0 6 7 15 7 15s7-9 7-15c0-3.87-3.13-7-7-7z", fill: "#FFD7D7" }) }));
const SummerIcon = () => (_jsxs("svg", { width: "24", height: "24", viewBox: "0 0 24 24", fill: "none", xmlns: "http://www.w3.org/2000/svg", children: [_jsx("circle", { cx: "12", cy: "12", r: "5", fill: "#FFD700" }), _jsx("path", { d: "M12 2v2M12 20v2M2 12h2M20 12h2M4.93 4.93l1.41 1.41M17.66 17.66l1.41 1.41M4.93 19.07l1.41-1.41M17.66 6.34l1.41-1.41", stroke: "#FFD700", strokeWidth: "2", strokeLinecap: "round" })] }));
const AutumnIcon = () => (_jsx("svg", { width: "24", height: "24", viewBox: "0 0 24 24", fill: "none", xmlns: "http://www.w3.org/2000/svg", children: _jsx("path", { d: "M12 2C9.5 2 7.26 3.23 6 5.14c-2.5 3.77-1.76 11.74 5.76 15.62h0.16c0.04 0 0.08 0 0.12 0s0.08 0 0.12 0h0.16c7.53-3.87 8.26-11.84 5.76-15.62C16.74 3.23 14.5 2 12 2z", fill: "#D2691E" }) }));
const WinterIcon = () => (_jsx("svg", { width: "24", height: "24", viewBox: "0 0 24 24", fill: "none", xmlns: "http://www.w3.org/2000/svg", children: _jsx("path", { d: "M22 11h-4.17l3.24-3.24-1.41-1.41L15 11h-2V9l4.66-4.66-1.41-1.41L13 6.17V2h-2v4.17L7.76 2.93 6.34 4.34 11 9v2H9L4.34 6.34 2.93 7.76 6.17 11H2v2h4.17l-3.24 3.24 1.41 1.41L9 13h2v2l-4.66 4.66 1.41 1.41L11 17.83V22h2v-4.17l3.24 3.24 1.41-1.41L13 15v-2h2l4.66 4.66 1.41-1.41L17.83 13H22v-2z", fill: "#E0F7FF" }) }));
// 스위처 컨테이너
const SwitcherContainer = styled(Box) `
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
  padding: ${props => (props.positionType === 'floating' ? '8px 12px' : '0')};
  background-color: ${props => (props.positionType === 'floating' ? 'rgba(255, 255, 255, 0.8)' : 'transparent')};
  backdrop-filter: ${props => (props.positionType === 'floating' ? 'blur(5px)' : 'none')};
  border-radius: ${props => (props.positionType === 'floating' ? '20px' : '0')};
  box-shadow: ${props => (props.positionType === 'floating' ? '0 2px 10px rgba(0, 0, 0, 0.1)' : 'none')};
  position: ${props => (props.positionType === 'floating' ? 'fixed' : 'relative')};
  bottom: ${props => (props.positionType === 'floating' ? '20px' : 'auto')};
  right: ${props => (props.positionType === 'floating' ? '20px' : 'auto')};
  z-index: ${props => (props.positionType === 'floating' ? '9999' : '1')};
`;
// 스위처 아이콘 버튼
const ThemeButton = styled(IconButton) `
  padding: 8px;
  transition: all 0.3s ease;
  transform: ${props => (props.active ? 'scale(1.15)' : 'scale(1)')};
  opacity: ${props => (props.active ? '1' : '0.7')};
  position: relative;
  
  &:after {
    content: '';
    position: absolute;
    bottom: 0;
    left: 50%;
    transform: translateX(-50%);
    width: ${props => (props.active ? '12px' : '0')};
    height: 3px;
    border-radius: 3px;
    background-color: ${props => {
    switch (props.season) {
        case 'spring':
            return '#FFD7D7';
        case 'summer':
            return '#FFD700';
        case 'autumn':
            return '#D2691E';
        case 'winter':
            return '#B0C4DE';
        default:
            return '#FFD7D7';
    }
}};
    transition: all 0.3s ease;
  }

  &:hover {
    transform: scale(1.15);
    opacity: 1;
  }
`;
const ThemeSwitcher = ({ position = 'header' }) => {
    const { season, setSeason } = useThemeStore();
    const handleSeasonChange = (newSeason) => {
        setSeason(newSeason);
    };
    const getTooltipText = (s) => {
        switch (s) {
            case 'spring':
                return '봄 테마';
            case 'summer':
                return '여름 테마';
            case 'autumn':
                return '가을 테마';
            case 'winter':
                return '겨울 테마';
            default:
                return '';
        }
    };
    return (_jsxs(SwitcherContainer, { positionType: position, children: [_jsx(Tooltip, { title: getTooltipText('spring'), children: _jsx(ThemeButton, { active: season === 'spring', season: "spring", onClick: () => handleSeasonChange('spring'), "aria-label": "\uBD04 \uD14C\uB9C8", children: _jsx(SpringIcon, {}) }) }), _jsx(Tooltip, { title: getTooltipText('summer'), children: _jsx(ThemeButton, { active: season === 'summer', season: "summer", onClick: () => handleSeasonChange('summer'), "aria-label": "\uC5EC\uB984 \uD14C\uB9C8", children: _jsx(SummerIcon, {}) }) }), _jsx(Tooltip, { title: getTooltipText('autumn'), children: _jsx(ThemeButton, { active: season === 'autumn', season: "autumn", onClick: () => handleSeasonChange('autumn'), "aria-label": "\uAC00\uC744 \uD14C\uB9C8", children: _jsx(AutumnIcon, {}) }) }), _jsx(Tooltip, { title: getTooltipText('winter'), children: _jsx(ThemeButton, { active: season === 'winter', season: "winter", onClick: () => handleSeasonChange('winter'), "aria-label": "\uACA8\uC6B8 \uD14C\uB9C8", children: _jsx(WinterIcon, {}) }) })] }));
};
export default ThemeSwitcher;
