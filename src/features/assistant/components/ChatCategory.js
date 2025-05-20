'use client';
import { jsx as _jsx } from "react/jsx-runtime";
import { Box } from '@mui/material';
/**
 * CategorySidebar 컴포넌트
 * - 카테고리 목록을 사이드바 형태로 렌더링
 * - 클릭 비활성화: 시각적 피드백만 제공
 */
export default function CategorySidebar({ categories, selectedKey }) {
    return (_jsx(Box, { className: "w-64 bg-white rounded-lg shadow p-4 space-y-2", height: "auto", children: categories.map(cat => {
            const isSelected = cat.key === selectedKey;
            return (_jsx("div", { className: `
              flex items-center w-full text-left px-3 py-2 rounded-lg select-none
              ${isSelected ? 'bg-indigo-100 text-indigo-700 font-semibold' : 'text-gray-700'}
            `, children: _jsx("span", { className: "ml-2", children: cat.label }) }, cat.key));
        }) }));
}
