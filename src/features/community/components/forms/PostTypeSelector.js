import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { usePostFormStore } from '../../store/postFormStore';
import { FormControl, InputLabel, Select, MenuItem } from '@mui/material';
const PostTypeSelector = () => {
    const postType = usePostFormStore(state => state.postType);
    const setPostType = usePostFormStore(state => state.setPostType);
    return (_jsxs(FormControl, { fullWidth: true, margin: "normal", children: [_jsx(InputLabel, { id: "post-type-label", children: "\uAC8C\uC2DC\uAE00 \uD0C0\uC785 \uC120\uD0DD " }), _jsxs(Select, { labelId: "post-type-label", value: postType, onChange: e => setPostType(e.target.value), label: "\uAC8C\uC2DC\uAE00 \uD0C0\uC785", children: [_jsx(MenuItem, { value: "\uC790\uC720", children: "\uC790\uC720 \uAC8C\uC2DC\uAE00" }), _jsx(MenuItem, { value: "\uBAA8\uC784", children: "\uBAA8\uC784 \uAC8C\uC2DC\uAE00" })] })] }));
};
export default PostTypeSelector;
