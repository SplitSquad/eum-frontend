import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { usePostFormStore } from '../../store/postFormStore';
import { tagCategories } from '@/constants/tagCategories';
import { FormControl, InputLabel, MenuItem, Select, Box, FormHelperText, OutlinedInput, } from '@mui/material';
const PostTagSelector = () => {
    const { category, tag, setCategory, setTag } = usePostFormStore();
    const selectedMainCategory = tagCategories.find(c => c.id === category);
    const availableSubTags = selectedMainCategory
        ? selectedMainCategory.subCategories.flatMap(sub => sub.tags)
        : [];
    return (_jsxs(Box, { display: "flex", flexDirection: "column", gap: 2, children: [_jsxs(FormControl, { fullWidth: true, children: [_jsx(InputLabel, { id: "main-category-label", children: "\uCE74\uD14C\uACE0\uB9AC" }), _jsx(Select, { labelId: "main-category-label", value: category, onChange: e => setCategory(e.target.value), input: _jsx(OutlinedInput, { label: "\uCE74\uD14C\uACE0\uB9AC" }), children: tagCategories.map(cat => (_jsx(MenuItem, { value: cat.id, children: cat.title }, cat.id))) }), _jsx(FormHelperText, { children: "\uAC8C\uC2DC\uAE00\uC758 \uB300\uBD84\uB958 \uCE74\uD14C\uACE0\uB9AC\uB97C \uC120\uD0DD\uD558\uC138\uC694" })] }), category && (_jsxs(FormControl, { fullWidth: true, children: [_jsx(InputLabel, { id: "subtag-label", children: "\uC138\uBD80 \uD0DC\uADF8" }), _jsx(Select, { labelId: "subtag-label", value: tag, onChange: e => setTag(e.target.value), input: _jsx(OutlinedInput, { label: "\uC138\uBD80 \uD0DC\uADF8" }), children: availableSubTags.map(tag => (_jsx(MenuItem, { value: tag, children: tag }, tag))) }), _jsx(FormHelperText, { children: "\uC138\uBD80 \uD0DC\uADF8\uB97C \uD558\uB098 \uC120\uD0DD\uD558\uC138\uC694" })] }))] }));
};
export default PostTagSelector;
