import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { useState } from 'react';
import { Box, TextField, Button } from '@mui/material';
import useCommunityStore from '../store/communityStore';
const ReplyForm = ({ postId, commentId, onClose }) => {
    const [content, setContent] = useState('');
    const [submitting, setSubmitting] = useState(false);
    const { addReply } = useCommunityStore();
    const handleSubmit = async () => {
        if (!content.trim())
            return;
        try {
            setSubmitting(true);
            await addReply(postId, commentId, content);
            setContent('');
            if (onClose)
                onClose();
        }
        catch (error) {
            console.error('답글 작성 실패:', error);
        }
        finally {
            setSubmitting(false);
        }
    };
    return (_jsxs(Box, { sx: { mt: 2, mb: 2 }, children: [_jsx(TextField, { fullWidth: true, size: "small", placeholder: "\uB2F5\uAE00\uC744 \uC785\uB825\uD558\uC138\uC694...", value: content, onChange: e => setContent(e.target.value), multiline: true, rows: 2, sx: {
                    mb: 1,
                    '& .MuiOutlinedInput-root': {
                        backgroundColor: 'rgba(255, 255, 255, 0.8)',
                        '& fieldset': {
                            borderColor: '#FFD7D7',
                        },
                        '&:hover fieldset': {
                            borderColor: '#FFAAA5',
                        },
                        '&.Mui-focused fieldset': {
                            borderColor: '#FF9999',
                        },
                    },
                } }), _jsxs(Box, { sx: { display: 'flex', justifyContent: 'flex-end', gap: 1 }, children: [_jsx(Button, { size: "small", variant: "outlined", onClick: onClose, sx: {
                            borderColor: '#FFD7D7',
                            color: '#888',
                            '&:hover': {
                                borderColor: '#FFAAA5',
                                backgroundColor: 'rgba(255, 170, 165, 0.05)',
                            },
                        }, children: "\uCDE8\uC18C" }), _jsx(Button, { size: "small", variant: "contained", onClick: handleSubmit, disabled: !content.trim() || submitting, sx: {
                            backgroundColor: '#FFAAA5',
                            '&:hover': {
                                backgroundColor: '#FF9999',
                            },
                            boxShadow: '0 2px 4px rgba(255, 170, 165, 0.3)',
                        }, children: "\uB2F5\uAE00 \uC791\uC131" })] })] }));
};
export default ReplyForm;
