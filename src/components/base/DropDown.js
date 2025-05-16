import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
const DropDown = ({ label, items, defaultPath, isTopNav = false, onSelect }) => {
    const [isOpen, setIsOpen] = useState(false);
    const navigate = useNavigate();
    const dropIn = {
        hidden: { opacity: 0, y: -10 },
        visible: { opacity: 1, y: 0, transition: { duration: 0.2, ease: 'easeOut' } },
        exit: { opacity: 0, y: -10, transition: { duration: 0.15, ease: 'easeIn' } },
    };
    const LabelClickHandler = () => {
        if (isTopNav && defaultPath) {
            navigate(defaultPath);
        }
        else if (!isTopNav) {
            setIsOpen(prev => !prev);
        }
    };
    const ItemClickHandelr = (item) => {
        if (item.path)
            navigate(item.path);
        else if (item.value && onSelect)
            onSelect(item.value);
        setIsOpen(false);
    };
    return (_jsxs("div", { className: "relative group", onMouseEnter: () => isTopNav && setIsOpen(true), onMouseLeave: () => isTopNav && setIsOpen(false), children: [_jsx("button", { className: "text-gray-800 font-medium hover:text-primary", onClick: LabelClickHandler, children: label }), isOpen && (_jsx(motion.div, { variants: dropIn, initial: "hidden", animate: "visible", exit: "exit", className: "absolute left-0 top-full w-44 bg-white \n          border border-gray-200 shadow-lg rounded-md z-50", children: items.map(item => (_jsx("div", { onClick: () => ItemClickHandelr(item), className: "px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 cursor-pointer", children: item.label }, item.label + (item.value || item.path)))) }))] }));
};
export default DropDown;
