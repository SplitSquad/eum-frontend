import { jsx as _jsx } from "react/jsx-runtime";
import { ChevronLeft, ChevronRight } from 'lucide-react';
const ArrowButton = ({ direction, onClick, disabled = false }) => {
    const baseStyle = 'flex items-center justify-center w-8 h-8 md:w-10 md:h-10 border rounded-full transition-all duration-150';
    const activeStyle = 'bg-white text-gray-700 border-gray-300 hover:bg-gray-200 hover:scale-105';
    const disabledStyle = 'bg-gray-100 text-gray-400 cursor-not-allowed border-gray-200';
    const icon = direction === 'left' ? _jsx(ChevronLeft, { size: 16 }) : _jsx(ChevronRight, { size: 16 });
    return (_jsx("button", { onClick: onClick, disabled: disabled, className: `${baseStyle} ${disabled ? disabledStyle : activeStyle}`, children: icon }));
};
export default ArrowButton;
