import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { Search } from 'lucide-react';
const SearchBar = ({ value, onChange, placeHolder = '검색어를 입력하세요', onSearch, className, }) => {
    return (_jsxs("div", { className: `flex items-center border rounded-md px-3 py-2 shadow-sm bg-white ${className}`, children: [_jsx("input", { type: "text", value: value, onChange: e => onChange(e.target.value), placeholder: placeHolder, className: "flex-1 outline-none text-sm text-gray-700" }), _jsx("button", { onClick: onSearch, className: "ml-2 text-gray-500 hover:text-primary", children: _jsx(Search, { size: 18 }) })] }));
};
export default SearchBar;
