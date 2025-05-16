import React, { ButtonHTMLAttributes, ReactNode } from 'react';
import styled from '@emotion/styled';

export type ButtonVariant = 'primary' | 'secondary' | 'outline' | 'ghost' | 'danger';
export type ButtonSize = 'sm' | 'md' | 'lg';

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: ButtonVariant;
  size?: ButtonSize;
  isLoading?: boolean;
  leftIcon?: ReactNode;
  rightIcon?: ReactNode;
  fullWidth?: boolean;
  className?: string;
}

// 스타일링된 컴포넌트 - 나중에 디자인 변경 시 이 부분만 수정
const StyledButton = styled.button<{
  variant: ButtonVariant;
  size: ButtonSize;
  isLoading?: boolean;
  fullWidth?: boolean;
}>`
  display: inline-flex;
  align-items: center;
  justify-content: center;
  border-radius: 8px;
  font-weight: 500;
  transition: all 0.2s ease;
  cursor: ${props => (props.disabled || props.isLoading ? 'not-allowed' : 'pointer')};
  opacity: ${props => (props.disabled ? 0.6 : 1)};
  width: ${props => (props.fullWidth ? '100%' : 'auto')};
  
  /* 크기 */
  ${props => {
    switch (props.size) {
      case 'sm':
        return `
          font-size: 0.75rem;
          padding: 8px 16px;
          height: 32px;
        `;
      case 'lg':
        return `
          font-size: 1rem;
          padding: 12px 24px;
          height: 48px;
        `;
      default: // md
        return `
          font-size: 0.875rem;
          padding: 10px 20px;
          height: 40px;
        `;
    }
  }}
  
  /* 스타일 변형 */
  ${props => {
    switch (props.variant) {
      case 'primary':
        return `
          background-color: #FF9999;
          color: white;
          border: none;
          
          &:hover:not(:disabled) {
            background-color: #FF7777;
            transform: translateY(-1px);
            box-shadow: 0 4px 8px rgba(255, 153, 153, 0.3);
          }
          
          &:active:not(:disabled) {
            background-color: #FF6666;
            transform: translateY(0);
          }
        `;
      case 'secondary':
        return `
          background-color: #FEF0F0;
          color: #FF6666;
          border: none;
          
          &:hover:not(:disabled) {
            background-color: #FFDCDC;
            transform: translateY(-1px);
          }
          
          &:active:not(:disabled) {
            background-color: #FFD0D0;
            transform: translateY(0);
          }
        `;
      case 'outline':
        return `
          background-color: transparent;
          color: #FF9999;
          border: 1px solid #FF9999;
          
          &:hover:not(:disabled) {
            background-color: rgba(255, 153, 153, 0.05);
            transform: translateY(-1px);
          }
          
          &:active:not(:disabled) {
            background-color: rgba(255, 153, 153, 0.1);
            transform: translateY(0);
          }
        `;
      case 'ghost':
        return `
          background-color: transparent;
          color: #333;
          border: none;
          
          &:hover:not(:disabled) {
            background-color: rgba(0, 0, 0, 0.05);
          }
          
          &:active:not(:disabled) {
            background-color: rgba(0, 0, 0, 0.1);
          }
        `;
      case 'danger':
        return `
          background-color: #F56565;
          color: white;
          border: none;
          
          &:hover:not(:disabled) {
            background-color: #E53E3E;
            transform: translateY(-1px);
            box-shadow: 0 4px 8px rgba(245, 101, 101, 0.3);
          }
          
          &:active:not(:disabled) {
            background-color: #C53030;
            transform: translateY(0);
          }
        `;
      default:
        return '';
    }
  }}
  
  /* 로딩 상태 */
  ${props =>
    props.isLoading &&
    `
    position: relative;
    color: transparent;
    
    &::after {
      content: '';
      position: absolute;
      width: 16px;
      height: 16px;
      border: 2px solid transparent;
      border-top-color: currentColor;
      border-radius: 50%;
      animation: spin 0.7s linear infinite;
    }
    
    @keyframes spin {
      to {
        transform: rotate(360deg);
      }
    }
  `}
`;

const IconWrapper = styled.span<{ isLeftIcon: boolean }>`
  display: inline-flex;
  align-items: center;
  margin-right: ${props => (props.isLeftIcon ? '8px' : '0')};
  margin-left: ${props => (!props.isLeftIcon ? '8px' : '0')};
  font-size: 1.2em;
`;

const Button: React.FC<ButtonProps> = ({
  variant = 'primary',
  size = 'md',
  isLoading = false,
  leftIcon,
  rightIcon,
  fullWidth = false,
  className,
  children,
  ...rest
}) => {
  return (
    <StyledButton
      variant={variant}
      size={size}
      isLoading={isLoading}
      fullWidth={fullWidth}
      className={className}
      disabled={rest.disabled || isLoading}
      {...rest}
    >
      {leftIcon && !isLoading && <IconWrapper isLeftIcon>{leftIcon}</IconWrapper>}
      {children}
      {rightIcon && !isLoading && <IconWrapper isLeftIcon={false}>{rightIcon}</IconWrapper>}
    </StyledButton>
  );
};

export default Button; 