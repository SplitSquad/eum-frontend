import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { useEffect, useRef } from 'react';
import Button from '@/components/base/Button';
const Modal = ({ isOpen, onClose, children, anchorEl }) => {
    const modalRef = useRef(null);
    useEffect(() => {
        const handleClickOutside = (event) => {
            if (modalRef.current && !modalRef.current.contains(event.target)) {
                onClose();
            }
        };
        if (isOpen) {
            document.addEventListener('mousedown', handleClickOutside);
        }
        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
        };
    }, [isOpen, onClose]);
    if (!isOpen)
        return null;
    const getPosition = () => {
        if (!anchorEl)
            return {};
        const rect = anchorEl.getBoundingClientRect();
        return {
            position: 'absolute',
            top: `${rect.bottom + 10}px`,
            right: `${window.innerWidth - rect.right}px`,
        };
    };
    return (_jsx("div", { className: "fixed inset-0 z-50 flex items-start justify-end px-4", children: _jsxs("div", { ref: modalRef, className: "bg-white/40 backdrop-blur-sm rounded-lg shadow-lg w-[250px] max-w-md max-h-[300px] overflow-y-auto p-6 relative scrollbar-thin scrollbar-thumb-gray-300 scrollbar-track-transparent", style: getPosition(), children: [_jsx("div", { className: "absolute top-4 right-4", children: _jsx(Button, { variant: "exit", size: "lg", onClick: onClose, className: "!bg-white !text-gray-600 !border-gray-300 hover:!bg-gray-100 hover:!text-gray-800 hover:!border-gray-400 !p-2 !min-w-0 !w-8 !h-8", "aria-label": "\uBAA8\uB2EC \uB2EB\uAE30", children: "x" }) }), _jsx("div", { className: "truncate", children: children })] }) }));
};
export default Modal;
