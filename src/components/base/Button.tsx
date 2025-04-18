import React from 'react';
import MuiButton, { ButtonProps as MuiButtonProps } from '@mui/material/Button';
import CircularProgress from '@mui/material/CircularProgress';

type CustomVariant = 'iconOnly' | 'submit' | 'exit';
type Size = 'sm' | 'md' | 'lg';

interface CustomButtonProps extends Omit<MuiButtonProps, 'variant' | 'size'> {
  variant?: CustomVariant;
  size?: Size;
  isLoading?: boolean;
  icon?: React.ReactNode;
  className?: string;
}

const variantMap: Record<CustomVariant, string> = {
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

const sizeClasses: Record<Size, string> = {
  sm: '!text-sm',
  md: '!text-base',
  lg: '!text-lg',
};

const Button = ({
  children,
  variant = 'submit',
  icon,
  isLoading = false,
  size = 'md',
  className = '',
  disabled,
  ...props
}: CustomButtonProps) => {
  const customClassName = `${variantMap[variant]} ${sizeClasses[size]} ${className}`;

  return (
    <MuiButton
      disableElevation
      disableRipple
      variant="text"
      disabled={disabled || isLoading}
      className={customClassName}
      {...props}
    >
      {isLoading ? (
        <CircularProgress size={20} color="inherit" />
      ) : variant === 'iconOnly' ? (
        icon
      ) : (
        children
      )}
    </MuiButton>
  );
};

export default Button;
