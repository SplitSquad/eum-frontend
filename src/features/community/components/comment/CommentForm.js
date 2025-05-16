import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { Box, TextField, Button, CircularProgress } from '@mui/material';
import { useCommentForm } from '../../hooks';
const CommentForm = ({ initialValue, onSubmit, onCancel, buttonText = '등록', autoFocus = false, }) => {
    const commentForm = useCommentForm(initialValue, async (content) => {
        const result = await onSubmit(content);
        return result;
    });
    return (_jsxs(Box, { sx: { mb: 2 }, children: [_jsx(TextField, { fullWidth: true, multiline: true, rows: 3, placeholder: "\uB313\uAE00\uC744 \uC791\uC131\uD574\uC8FC\uC138\uC694", value: commentForm.content, onChange: e => commentForm.handleChange(e.target.value), variant: "outlined", autoFocus: autoFocus, error: !!commentForm.error, helperText: commentForm.error, sx: { mb: 1 } }), _jsxs(Box, { sx: { display: 'flex', justifyContent: 'flex-end', gap: 1 }, children: [onCancel && (_jsx(Button, { size: "small", onClick: onCancel, children: "\uCDE8\uC18C" })), _jsxs(Button, { size: "small", variant: "contained", onClick: commentForm.handleSubmit, disabled: commentForm.isEmpty || commentForm.isSubmitting, children: [commentForm.isSubmitting ? (_jsx(CircularProgress, { size: 16, color: "inherit", sx: { mr: 1 } })) : null, buttonText] })] })] }));
};
export default CommentForm;
