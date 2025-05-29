import React, { ReactNode } from 'react';
import styled from '@emotion/styled';

interface FormFieldProps {
  label: string;
  htmlFor?: string;
  required?: boolean;
  error?: string;
  children: ReactNode;
  helpText?: string;
  className?: string;
}

// 스타일링된 컴포넌트 - 나중에 디자인 변경 시 이 부분만 수정
const FieldContainer = styled.div`
  margin-bottom: 20px;
`;

const Label = styled.label`
  display: block;
  margin-bottom: 8px;
  font-size: 0.875rem;
  font-weight: 500;
  color: #444;
`;

const Required = styled.span`
  color: rgba(219, 219, 219, 0.95);
  margin-left: 4px;
`;

const HelpText = styled.div`
  font-size: 0.75rem;
  color: #666;
  margin-top: 4px;
`;

const ErrorText = styled.div`
  font-size: 0.75rem;
  color: rgb(252, 154, 154);
  margin-top: 4px;
`;

// 기본 Input 스타일 (다른 파일에서 확장 가능)
export const StyledInput = styled.input`
  width: 100%;
  padding: 12px 16px;
  border: 1px solid #e2e8f0;
  border-radius: 8px;
  font-size: 0.875rem;
  color: #333;
  background-color: white;
  transition: all 0.2s ease;

  &:focus {
    outline: none;
    border-color: #e5e7eb;
    box-shadow: 0 0 0 3px rgba(255, 192, 203, 0.2);
  }

  &:hover:not(:focus) {
    border-color: rgb(214, 214, 214);
  }

  &:disabled {
    background-color: #f7fafc;
    cursor: not-allowed;
  }
`;

export const StyledTextarea = styled.textarea`
  width: 100%;
  padding: 12px 16px;
  border: 1px solid #e2e8f0;
  border-radius: 8px;
  font-size: 0.875rem;
  color: #333;
  background-color: white;
  transition: all 0.2s ease;
  resize: vertical;
  min-height: 120px;

  &:focus {
    outline: none;
    border-color: #e5e7eb;
    box-shadow: 0 0 0 3px rgba(255, 192, 203, 0.2);
  }

  &:hover:not(:focus) {
    border-color: rgb(214, 214, 214);
  }

  &:disabled {
    background-color: #f7fafc;
    cursor: not-allowed;
  }
`;

export const StyledSelect = styled.select`
  width: 100%;
  padding: 12px 16px;
  border: 1px solid #e2e8f0;
  border-radius: 8px;
  font-size: 0.875rem;
  color: #333;
  background-color: white;
  transition: all 0.2s ease;

  &:focus {
    outline: none;
    border-color: #e5e7eb;
    box-shadow: 0 0 0 3px rgba(227, 227, 227, 0.55);
  }

  &:hover:not(:focus) {
    border-color: rgb(214, 214, 214);
  }

  &:disabled {
    background-color: #f7fafc;
    cursor: not-allowed;
  }
`;

const FormField: React.FC<FormFieldProps> = ({
  label,
  htmlFor,
  required = false,
  error,
  children,
  helpText,
  className,
}) => {
  return (
    <FieldContainer className={className}>
      <Label htmlFor={htmlFor}>
        {label}
        {required && <Required>*</Required>}
      </Label>
      {children}
      {helpText && <HelpText>{helpText}</HelpText>}
      {error && <ErrorText>{error}</ErrorText>}
    </FieldContainer>
  );
};

export default FormField;
