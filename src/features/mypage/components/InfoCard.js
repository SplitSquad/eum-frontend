import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import styled from '@emotion/styled';
// 스타일링된 컴포넌트 - 나중에 디자인 변경 시 이 부분만 수정
const CardContainer = styled.div `
  background: white;
  border-radius: 12px;
  overflow: hidden;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.05);
  padding: ${props => (props.noPadding ? '0' : '20px')};
  margin-bottom: 24px;
  transition: all 0.2s ease;
  position: relative;
  z-index: 1;
  
  &:hover {
    box-shadow: 0 6px 16px rgba(0, 0, 0, 0.08);
  }
`;
const CardHeader = styled.div `
  display: flex;
  align-items: center;
  margin-bottom: ${props => (props.noPadding ? '0' : '16px')};
  padding: ${props => (props.noPadding ? '16px 20px' : '0')};
  border-bottom: ${props => (props.noPadding ? '1px solid rgba(0, 0, 0, 0.05)' : 'none')};
`;
const CardTitle = styled.h3 `
  font-size: 1.125rem;
  font-weight: 600;
  color: #333;
  margin: 0;
  position: relative;
  padding-left: 8px;
  
  &::before {
    content: '';
    position: absolute;
    left: 0;
    top: 50%;
    transform: translateY(-50%);
    width: 3px;
    height: 14px;
    background: #FF9999;
    border-radius: 1px;
  }
`;
const IconWrapper = styled.div `
  margin-right: 8px;
  display: flex;
  align-items: center;
  justify-content: center;
  color: #FF9999;
  font-size: 1rem;
`;
const CardContent = styled.div `
  ${props => props.noPadding && 'padding: 16px 20px;'}
`;
const CardFooter = styled.div `
  margin-top: 16px;
  padding-top: 16px;
  border-top: 1px solid rgba(0, 0, 0, 0.05);
  display: flex;
  justify-content: flex-end;
`;
const InfoCard = ({ title, icon, children, className, noPadding = false, footer }) => {
    return (_jsxs(CardContainer, { className: className, noPadding: noPadding, children: [_jsxs(CardHeader, { noPadding: noPadding, children: [icon && _jsx(IconWrapper, { children: icon }), _jsx(CardTitle, { children: title })] }), _jsx(CardContent, { noPadding: noPadding, children: children }), footer && _jsx(CardFooter, { children: footer })] }));
};
export default InfoCard;
