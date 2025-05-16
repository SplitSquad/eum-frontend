import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { useState, useRef } from 'react';
import { useDebateStore } from '../../store';
import { Box, TextField, Button, Typography, Paper } from '@mui/material';
const ReplyForm = ({ commentId, onSuccess }) => {
    const { createReply } = useDebateStore();
    const [content, setContent] = useState('');
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [error, setError] = useState('');
    const textFieldRef = useRef(null);
    // 대댓글 제출 함수 - Promise 반환 및 비동기 처리 개선
    const submitReply = async (e) => {
        // 이벤트 차단 강화 - 리다이렉션 방지
        if (e) {
            e.preventDefault();
            e.stopPropagation();
            if (e.nativeEvent) {
                e.nativeEvent.preventDefault();
                e.nativeEvent.stopImmediatePropagation();
            }
        }
        // 유효성 검사
        if (!content.trim()) {
            setError('답글 내용을 입력해주세요.');
            return;
        }
        if (content.length > 500) {
            setError('답글은 최대 500자까지 입력 가능합니다.');
            return;
        }
        setIsSubmitting(true);
        setError('');
        try {
            // 비동기 요청 실행 및 await로 완료 대기
            const result = await createReply(commentId, content);
            console.log('답글 작성 결과:', result);
            // 성공 시 입력창 초기화
            setContent('');
            // 성공 콜백 호출
            if (onSuccess) {
                console.log('ReplyForm: 성공 콜백 호출 전');
                onSuccess();
                console.log('ReplyForm: 성공 콜백 호출 후');
            }
        }
        catch (err) {
            console.error('답글 작성 실패:', err);
            setError('답글 작성 중 오류가 발생했습니다. 다시 시도해주세요.');
        }
        finally {
            setIsSubmitting(false);
        }
    };
    // 취소 핸들러
    const handleCancel = (e) => {
        e.preventDefault();
        e.stopPropagation();
        if (e.nativeEvent) {
            e.nativeEvent.preventDefault();
            e.nativeEvent.stopImmediatePropagation();
        }
        setContent('');
        setError('');
        if (onSuccess)
            onSuccess();
    };
    // Ctrl+Enter로 제출
    const handleKeyDown = (e) => {
        if (e.key === 'Enter' && e.ctrlKey) {
            e.preventDefault();
            e.stopPropagation();
            if (e.nativeEvent) {
                e.nativeEvent.preventDefault();
                e.nativeEvent.stopImmediatePropagation();
            }
            submitReply(e);
        }
    };
    // 클릭 이벤트 핸들러 - 버블링 방지
    const handleClick = (e) => {
        e.preventDefault();
        e.stopPropagation();
        if (e.nativeEvent) {
            e.nativeEvent.preventDefault();
            e.nativeEvent.stopImmediatePropagation();
        }
    };
    return (_jsx(Paper, { elevation: 0, sx: {
            p: 2,
            mb: 2,
            backgroundColor: 'rgba(245, 245, 245, 0.8)',
            position: 'relative'
        }, onClick: handleClick, children: _jsxs(Box, { sx: { mb: 2 }, onClick: handleClick, children: [_jsx(TextField, { ref: textFieldRef, fullWidth: true, multiline: true, minRows: 3, maxRows: 5, placeholder: "\uB2F5\uAE00\uC744 \uC785\uB825\uD558\uC138\uC694...", value: content, onChange: (e) => setContent(e.target.value), onKeyDown: handleKeyDown, disabled: isSubmitting, error: !!error, helperText: error, sx: { mb: 1 }, InputProps: {
                        sx: { borderRadius: 1.5 }
                    }, onClick: handleClick }), _jsxs(Box, { sx: {
                        display: 'flex',
                        justifyContent: 'space-between',
                        alignItems: 'center',
                        mt: 1
                    }, onClick: handleClick, children: [_jsxs(Typography, { variant: "caption", color: "text.secondary", children: [content.length, "/500\uC790"] }), _jsxs(Box, { sx: { display: 'flex', gap: 1 }, onClick: handleClick, children: [_jsx(Button, { variant: "outlined", color: "inherit", size: "small", onClick: handleCancel, disabled: isSubmitting, type: "button", children: "\uCDE8\uC18C" }), _jsx(Button, { variant: "contained", color: "primary", size: "small", onClick: (e) => submitReply(e), disabled: isSubmitting || !content.trim(), type: "button", children: isSubmitting ? '저장 중...' : '답글 작성' })] })] })] }) }));
};
export default ReplyForm;
