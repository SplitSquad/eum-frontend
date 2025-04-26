import { usePostFormStore } from '../../store/postFormStore';
import { FormControl, InputLabel, Select, MenuItem } from '@mui/material';

const PostTypeSelector = () => {
  const postType = usePostFormStore(state => state.postType);
  const setPostType = usePostFormStore(state => state.setPostType);

  return (
    <FormControl fullWidth margin="normal">
      <InputLabel id="post-type-label">게시글 타입 선택 </InputLabel>
      <Select
        labelId="post-type-label"
        value={postType}
        onChange={e => setPostType(e.target.value)}
        label="게시글 타입"
      >
        <MenuItem value="자유">자유 게시글</MenuItem>
        <MenuItem value="모임">모임 게시글</MenuItem>
      </Select>
    </FormControl>
  );
};
export default PostTypeSelector;
