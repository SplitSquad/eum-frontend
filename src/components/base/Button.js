import { jsx as _jsx } from "react/jsx-runtime";
import MuiButton from '@mui/material/Button';
import CircularProgress from '@mui/material/CircularProgress';
const variantMap = {
    submit: `
  !bg-transparent 
  !text-[#64b5f6] 
  !border-2 
  !border-[#64b5f6] 
  hover:!text-[#1976d2] 
  hover:!border-[#1976d2] 
  hover:!bg-[#e3f2fd] 
  hover:!shadow-md 
  disabled:!border-gray-300 
  disabled:!text-gray-400 
  disabled:!cursor-not-allowed 
  !px-[16px] 
  !py-[4px] 
  rounded-md 
  transition-colors
`
        .replace(/\s+/g, ' ')
        .trim(),
    exit: `
  !bg-transparent 
  !text-[#ef5350] 
  !border-2 
  !border-[#ef5350] 
  hover:!text-[#c62828] 
  hover:!border-[#c62828] 
  hover:!bg-[#fdecea] 
  hover:!shadow-sm 
  disabled:!text-gray-400 
  disabled:!border-gray-300 
  disabled:!cursor-not-allowed 
  !px-[14px] 
  !py-[4px] 
  rounded-md 
  text-sm 
  transition-all
`
        .replace(/\s+/g, ' ')
        .trim(),
    iconOnly: `
  !bg-transparent 
  !text-[#64b5f6] 
  !border 
  !border-[#64b5f6] 
  hover:!text-[#1976d2] 
  hover:!border-[#1976d2] 
  hover:!bg-[#e3f2fd] 
  hover:!shadow-sm 
  disabled:!text-gray-400 
  disabled:!border-gray-300 
  disabled:!cursor-not-allowed 
  w-8 h-8 
  p-0 
  rounded-full 
  flex items-center justify-center 
  transition-all
`
        .replace(/\s+/g, ' ')
        .trim(),
};
const sizeClasses = {
    sm: '!text-sm',
    md: '!text-base',
    lg: '!text-lg',
};
const Button = ({ children, variant = 'submit', icon, isLoading = false, size = 'md', className = '', disabled, ...props }) => {
    const customClassName = `${variantMap[variant]} ${sizeClasses[size]} ${className}`;
    return (_jsx(MuiButton, { disableElevation: true, disableRipple: true, variant: "text", disabled: disabled || isLoading, className: customClassName, ...props, children: isLoading ? (_jsx(CircularProgress, { size: 20, color: "inherit" })) : variant === 'iconOnly' ? (icon) : (children) }));
};
export default Button;
