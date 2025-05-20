import { jsx as _jsx } from "react/jsx-runtime";
import { useThemeStore } from '../store/themeStore';
import SpringBackground from './SeasonalBackground/SpringBackground';
import SummerBackground from './SeasonalBackground/SummerBackground';
import AutumnBackground from './SeasonalBackground/AutumnBackground';
import WinterBackground from './SeasonalBackground/WinterBackground';
/**
 * 현재 선택된 계절에 따라 적절한 배경 컴포넌트를 렌더링하는 컴포넌트
 */
const SeasonalBackground = ({ children, noPadding = false }) => {
    const { season } = useThemeStore();
    // 현재 계절에 따라 적절한 배경 컴포넌트 선택
    switch (season) {
        case 'summer':
            return _jsx(SummerBackground, { noPadding: noPadding, children: children });
        case 'autumn':
            return _jsx(AutumnBackground, { noPadding: noPadding, children: children });
        case 'winter':
            return _jsx(WinterBackground, { noPadding: noPadding, children: children });
        case 'spring':
        default:
            // 기본값은 봄 테마
            return _jsx(SpringBackground, { noPadding: noPadding, children: children });
    }
};
export default SeasonalBackground;
