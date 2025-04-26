import { TextField, Box } from '@mui/material';
import { usePostFormStore } from '@/features/community/store/postFormStore';

const MAX_TITLE_LENGTH = 100;

const PostTitleField = () => {
  const title = usePostFormStore(state => state.title);
  const setTitle = usePostFormStore(state => state.setTitle);

  const changeHandler = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newTitle = e.target.value;
    if (newTitle.length <= MAX_TITLE_LENGTH) {
      setTitle(newTitle);
    }
  };

  return (
    <Box sx={{ mt: 2 }}>
      <TextField
        fullWidth
        variant="outlined"
        value={title}
        onChange={changeHandler}
        inputProps={{ maxLength: 100 }}
        helperText={`${title.length} / ${MAX_TITLE_LENGTH}`}
        sx={{
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
        }}
      />
    </Box>
  );
};

export default PostTitleField;
