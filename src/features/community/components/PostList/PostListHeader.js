import { jsx as _jsx } from "react/jsx-runtime";
import { Box, Tabs, Tab, styled } from '@mui/material';
// 카테고리 목록
const categories = ['전체', 'travel', 'living', 'study', 'job'];
// 스타일이 적용된 탭
const StyledTab = styled(Tab)(({ theme }) => ({
    padding: '8px 16px',
    minWidth: '80px',
    textTransform: 'none',
    fontWeight: 600,
    color: '#666',
    '&.Mui-selected': {
        color: '#FF6B6B',
    },
}));
/**
 * 게시글 목록 상단의 카테고리 탭 컴포넌트
 */
const PostListHeader = ({ selectedCategory, onCategoryChange }) => {
    // 탭 변경 이벤트 핸들러
    const handleTabChange = (event, newValue) => {
        onCategoryChange(newValue);
    };
    return (_jsx(Box, { sx: { borderBottom: 1, borderColor: 'divider', mb: 2 }, children: _jsx(Tabs, { value: selectedCategory, onChange: handleTabChange, variant: "scrollable", scrollButtons: "auto", TabIndicatorProps: {
                style: {
                    backgroundColor: '#FF6B6B',
                }
            }, children: categories.map((category) => (_jsx(StyledTab, { label: category, value: category }, category))) }) }));
};
export default PostListHeader;
