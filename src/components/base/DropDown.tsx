import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { AnimatePresence, motion } from 'framer-motion';

export type DropDownItem = {
  label: string;
  value?: string;
  path?: string;
};

export type Props = {
  label: string;
  items: DropDownItem[];
  defaultPath?: string;
  isTopNav?: boolean;
  onSelect?: (value: string) => void;
};

const DropDown = ({ label, items, defaultPath, isTopNav = false, onSelect }: Props) => {
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
    } else if (!isTopNav) {
      setIsOpen(prev => !prev);
    }
  };

  const ItemClickHandelr = (item: DropDownItem) => {
    if (item.path) navigate(item.path);
    else if (item.value && onSelect) onSelect(item.value);
    setIsOpen(false);
  };

  return (
    <div
      className="relative group"
      onMouseEnter={() => isTopNav && setIsOpen(true)}
      onMouseLeave={() => isTopNav && setIsOpen(false)}
    >
      <button className="text-gray-800 font-medium hover:text-primary" onClick={LabelClickHandler}>
        {label}
      </button>
      {isOpen && (
        <motion.div
          variants={dropIn}
          initial="hidden"
          animate="visible"
          exit="exit"
          className="absolute left-0 top-full w-44 bg-white 
          border border-gray-200 shadow-lg rounded-md z-50"
        >
          {items.map(item => (
            <div
              key={item.label + (item.value || item.path)}
              onClick={() => ItemClickHandelr(item)}
              className="px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 cursor-pointer"
            >
              {item.label}
            </div>
          ))}
        </motion.div>
      )}
    </div>
  );
};

export default DropDown;
