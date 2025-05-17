import { usePostFormStore } from '../../store/postFormStore';
import { tagCategories } from '@/constants/tagCategories';
import {
  FormControl,
  InputLabel,
  MenuItem,
  Select,
  Chip,
  Box,
  FormHelperText,
  OutlinedInput,
} from '@mui/material';

const PostTagSelector = () => {
  const { category, tag, setCategory, setTag } = usePostFormStore();
  const selectedMainCategory = tagCategories.find(c => c.id === category);

  const availableSubTags = selectedMainCategory
    ? selectedMainCategory.subCategories.flatMap(sub => sub.tags)
    : [];

  return (
    <Box display="flex" flexDirection="column" gap={2}>
      <FormControl fullWidth>
        <InputLabel id="main-category-label">카테고리</InputLabel>
        <Select
          labelId="main-category-label"
          value={category}
          onChange={e => setCategory(e.target.value)}
          input={<OutlinedInput label="카테고리" />}
        >
          {tagCategories.map(cat => (
            <MenuItem key={cat.id} value={cat.id}>
              {cat.title}
            </MenuItem>
          ))}
        </Select>
        <FormHelperText>게시글의 대분류 카테고리를 선택하세요</FormHelperText>
      </FormControl>

      {/* 서브 태그 */}
      {category && (
        <FormControl fullWidth>
          <InputLabel id="subtag-label">세부 태그</InputLabel>
          <Select
            labelId="subtag-label"
            value={tag}
            onChange={e => setTag(e.target.value)}
            input={<OutlinedInput label="세부 태그" />}
          >
            {availableSubTags.map(tag => (
              <MenuItem key={tag} value={tag}>
                {tag}
              </MenuItem>
            ))}
          </Select>
          <FormHelperText>세부 태그를 하나 선택하세요</FormHelperText>
        </FormControl>
      )}
    </Box>
  );
};

export default PostTagSelector;
