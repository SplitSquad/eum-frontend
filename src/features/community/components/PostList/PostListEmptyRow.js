import { jsx as _jsx } from "react/jsx-runtime";
import { TableCell, TableRow } from '@mui/material';
/**
 * 게시글이 없을 때 표시되는 빈 행 컴포넌트
 */
const PostListEmptyRow = () => {
    return (_jsx(TableRow, { children: _jsx(TableCell, { colSpan: 7, align: "center", sx: { py: 4 }, children: "\uAC8C\uC2DC\uAE00\uC774 \uC5C6\uC2B5\uB2C8\uB2E4. \uCCAB \uBC88\uC9F8 \uAC8C\uC2DC\uAE00\uC744 \uC791\uC131\uD574\uBCF4\uC138\uC694!" }) }));
};
export default PostListEmptyRow;
