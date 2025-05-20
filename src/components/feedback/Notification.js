import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { useEffect, useState, useRef } from 'react';
import Bell from '@/components/animations/Bell';
import Modal from '@/components/feedback/Modal';
import NotificationList from './NotificationList';
import useModal from '@/shared/hooks/UseModal';
const Notification = ({ items }) => {
    const { isOpen, toggleModal } = useModal();
    const [isHovered, setIsHovered] = useState(false);
    const [isPlaying, setIsPlaying] = useState(false);
    const [prevCount, setPrevCount] = useState(items.length);
    const bellRef = useRef(null);
    const timeoutRefs = useRef([]);
    const countAnimation = () => {
        timeoutRefs.current.forEach(clearTimeout);
        timeoutRefs.current = [];
        let repeat = 3;
        for (let i = 0; i < repeat; i++) {
            const on = setTimeout(() => setIsPlaying(true), 1.5 * i * 1000);
            const off = setTimeout(() => setIsPlaying(false), (1.5 * i + 1) * 1000);
            timeoutRefs.current.push(on, off);
        }
    };
    useEffect(() => {
        if (items.length !== prevCount) {
            setPrevCount(items.length);
            countAnimation();
        }
    }, [items.length, prevCount]);
    useEffect(() => {
        setIsPlaying(isHovered);
    }, [isHovered]);
    return (_jsxs("div", { className: "relative flex items-center", children: [_jsx("div", { ref: bellRef, onClick: toggleModal, onMouseEnter: () => setIsHovered(true), onMouseLeave: () => setIsHovered(false), className: "cursor-pointer", children: _jsx(Bell, { isPlaying: isPlaying }) }), items.length > 0 && (_jsx("div", { className: "absolute top-1 right-1 w-5 h-5 bg-red-500 rounded-full flex items-center justify-center text-white text-[10px] font-bold", children: items.length > 99 ? '99+' : items.length })), _jsx(Modal, { isOpen: isOpen, onClose: toggleModal, anchorEl: bellRef.current, children: _jsxs("div", { className: "text-gray-800", children: [_jsx("h2", { className: "text-lg font-semibold mb-4", children: "\uC54C\uB9BC" }), _jsx(NotificationList, { items: items })] }) })] }));
};
export default Notification;
