import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
/**
 * @deprecated This component is for testing purposes only.
 * The actual post creation/editing functionality is implemented in PostCreateEditPage.tsx
 * This component should only be used in test files.
 */
import AppLayout from '@/components/layout/LegacyAppLayout';
import PageWrapper from '@/components/layout/PageWrapper';
import Container from '@/components/layout/Contianer';
import PostTitleField from '@/features/community/components/forms/PostTitleField';
import PostTypeSelector from '@/features/community/components/forms/PostTypeSelector';
import PostRegionSelector from '../components/forms/PostRegionSelector';
import PostTagSelector from '../components/forms/PostTagSelector';
import PostBodyField from '@/features/community/components/forms/PostBodyField';
import { usePostFormStore } from '../store/postFormStore';
import Button from '@/components/base/Button'; // 저장 버튼 스타일
/**
 * @deprecated This is a test component. Use PostCreateEditPage instead for actual post creation/editing.
 */
const PostArticle = () => {
    const { title, postType, city, district, neighborhood, category, tag, content } = usePostFormStore();
    const handleSubmit = () => {
        const payload = {
            title,
            postType,
            address: postType === '자유' ? '모임' : `${city} ${district} ${neighborhood}`,
            category,
            tag,
            content, // TipTap JSON 그대로
            language: 'KO', // (일단 기본 한글 고정, 나중에 선택 추가 가능)
        };
        console.log('최종 제출 데이터:', payload);
        // TODO: 여기서 API 호출 (axios.post('/api/posts', payload))
    };
    return (_jsx(AppLayout, { children: _jsx(PageWrapper, { children: _jsxs(Container, { as: "main", children: [_jsx("h1", { className: "text-2xl font-bold mb-6", children: "\uAC8C\uC2DC\uAE00 \uC791\uC131" }), _jsx("div", { className: "mb-6", children: _jsx(PostTitleField, {}) }), _jsx("div", { className: "mb-6", children: _jsx(PostTypeSelector, {}) }), postType === '모임' && (_jsx("div", { className: "mb-6", children: _jsx(PostRegionSelector, {}) })), _jsx("div", { className: "mb-6", children: _jsx(PostTagSelector, {}) }), _jsx("div", { className: "mb-6", children: _jsx(PostBodyField, {}) }), _jsx("div", { className: "flex justify-end", children: _jsx(Button, { variant: "submit", size: "lg", onClick: handleSubmit, children: "\uC800\uC7A5\uD558\uAE30" }) })] }) }) }));
};
export default PostArticle;
