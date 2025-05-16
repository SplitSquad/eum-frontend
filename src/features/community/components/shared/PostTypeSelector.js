import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { Box, ToggleButtonGroup, ToggleButton, Typography, styled } from '@mui/material';
const StyledToggleButtonGroup = styled(ToggleButtonGroup)(({ theme }) => ({
    backgroundColor: 'rgba(255, 255, 255, 0.7)',
    borderRadius: '20px',
    border: '1px solid rgba(255, 235, 235, 0.8)',
    boxShadow: '0 2px 12px rgba(0, 0, 0, 0.05)',
    padding: '4px',
    '& .MuiToggleButtonGroup-grouped': {
        margin: '4px',
        border: 0,
        borderRadius: '16px !important',
        '&.Mui-selected': {
            backgroundColor: '#FFAAA5',
            color: '#fff',
            fontWeight: 'bold',
        },
        '&:hover': {
            backgroundColor: 'rgba(255, 170, 165, 0.2)',
        },
    },
}));
const StyledToggleButton = styled(ToggleButton)(({ theme }) => ({
    fontWeight: 500,
    textTransform: 'none',
    minWidth: '80px',
    color: '#666',
    '&.Mui-selected': {
        color: 'white',
        backgroundColor: '#FFAAA5',
        '&:hover': {
            backgroundColor: '#FF9999',
        },
    },
}));
/**
 * 게시글 타입(자유/모임) 선택 컴포넌트
 */
const PostTypeSelector = ({ selectedPostType, onChange }) => {
    const handleChange = (event, newPostType) => {
        if (newPostType !== null) {
            onChange(newPostType);
        }
    };
    return (_jsxs(Box, { sx: {
            mb: 3,
            display: 'flex',
            alignItems: 'center',
        }, children: [_jsx(Typography, { variant: "subtitle1", sx: {
                    fontWeight: 600,
                    mr: 2,
                    color: '#666',
                }, children: "\uAC8C\uC2DC\uAE00 \uC720\uD615:" }), _jsxs(StyledToggleButtonGroup, { value: selectedPostType, exclusive: true, onChange: handleChange, "aria-label": "\uAC8C\uC2DC\uAE00 \uC720\uD615", children: [_jsx(StyledToggleButton, { value: "\uC790\uC720", "aria-label": "\uC790\uC720 \uAC8C\uC2DC\uAE00", children: "\uC790\uC720" }), _jsx(StyledToggleButton, { value: "\uBAA8\uC784", "aria-label": "\uBAA8\uC784 \uAC8C\uC2DC\uAE00", children: "\uBAA8\uC784" }), _jsx(StyledToggleButton, { value: "\uC804\uCCB4", "aria-label": "\uC804\uCCB4 \uAC8C\uC2DC\uAE00", children: "\uC804\uCCB4" })] })] }));
};
export default PostTypeSelector;
