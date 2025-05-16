import { jsx as _jsx } from "react/jsx-runtime";
import { TextField, Box } from '@mui/material';
import { usePostFormStore } from '@/features/community/store/postFormStore';
const MAX_TITLE_LENGTH = 100;
const PostTitleField = () => {
    const title = usePostFormStore(state => state.title);
    const setTitle = usePostFormStore(state => state.setTitle);
    const changeHandler = (e) => {
        const newTitle = e.target.value;
        if (newTitle.length <= MAX_TITLE_LENGTH) {
            setTitle(newTitle);
        }
    };
    return (_jsx(Box, { sx: { mt: 2 }, children: _jsx(TextField, { fullWidth: true, variant: "outlined", value: title, onChange: changeHandler, inputProps: { maxLength: 100 }, helperText: `${title.length} / ${MAX_TITLE_LENGTH}`, sx: {
                mt: 2,
                borderRadius: '12px',
                '& .MuiOutlinedInput-root': {
                    borderRadius: '12px',
                    '& fieldset': {
                        borderColor: 'rgba(255, 170, 165, 0.5)',
                    },
                    '&:hover fieldset': {
                        borderColor: 'rgba(255, 107, 107, 0.7)',
                    },
                    '&.Mui-focused fieldset': {
                        borderColor: 'rgba(255, 107, 107, 0.7)',
                    },
                },
            } }) }));
};
export default PostTitleField;
