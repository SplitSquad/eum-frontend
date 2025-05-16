import { jsx as _jsx } from "react/jsx-runtime";
import DropDown from '@/components/base/DropDown';
const DropDownGroup = ({ labels, itemsList, selected, onSelect }) => {
    return (_jsx("div", { className: "flex flex-wrap gap-4", children: labels.map((label, index) => (_jsx(DropDown, { label: `${label}: ${selected[index] || '선택'}`, items: itemsList[index].map(value => ({ label: value, value })), onSelect: value => onSelect(index, value), isTopNav: false }, label))) }));
};
export default DropDownGroup;
