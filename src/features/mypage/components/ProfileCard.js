import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import styled from '@emotion/styled';
// 스타일링된 컴포넌트 - 나중에 디자인 변경 시 이 부분만 수정
const CardContainer = styled.div `
  background: white;
  border-radius: 12px;
  overflow: hidden;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.05);
  width: 100%;
  position: relative;
  z-index: 1;
  transition: all 0.3s ease;
  
  &:hover {
    box-shadow: 0 8px 20px rgba(0, 0, 0, 0.1);
    transform: translateY(-3px);
  }
`;
const CardHeader = styled.div `
  background: linear-gradient(135deg, #FFD1D1 0%, #FF9999 100%);
  height: 80px;
  position: relative;
`;
const ProfileContent = styled.div `
  padding: 60px 20px 20px;
  display: flex;
  flex-direction: column;
  align-items: center;
  text-align: center;
`;
const ProfileImage = styled.div `
  width: 100px;
  height: 100px;
  border-radius: 50%;
  overflow: hidden;
  border: 4px solid white;
  box-shadow: 0 4px 10px rgba(0, 0, 0, 0.1);
  position: absolute;
  top: 30px;
  left: 50%;
  transform: translateX(-50%);
  background: white;
  transition: all 0.3s ease;
  
  &:hover {
    transform: translateX(-50%) scale(1.05);
    box-shadow: 0 6px 15px rgba(0, 0, 0, 0.15);
  }
`;
const Image = styled.img `
  width: 100%;
  height: 100%;
  object-fit: cover;
`;
const Name = styled.h2 `
  font-size: 1.5rem;
  font-weight: 600;
  margin: 0 0 4px;
  color: #333;
`;
const Role = styled.div `
  font-size: 0.875rem;
  color: white;
  background-color: #FF9999;
  padding: 2px 10px;
  border-radius: 12px;
  display: inline-block;
  margin-bottom: 8px;
  transition: all 0.3s ease;
  
  &:hover {
    background-color: #FF7777;
    transform: translateY(-2px);
  }
`;
const Email = styled.div `
  font-size: 0.875rem;
  color: #888;
  margin-bottom: 16px;
`;
const ChildrenWrapper = styled.div `
  width: 100%;
  margin-top: 4px;
`;
const ProfileCard = ({ profileImage = 'https://i.pravatar.cc/150?img=12', name, role, email, children, className }) => {
    return (_jsxs(CardContainer, { className: className, children: [_jsx(CardHeader, {}), _jsxs(ProfileContent, { children: [_jsx(ProfileImage, { children: _jsx(Image, { src: profileImage, alt: `${name}의 프로필 이미지` }) }), _jsx(Name, { children: name }), _jsx(Role, { children: role }), _jsx(Email, { children: email }), children && _jsx(ChildrenWrapper, { children: children })] })] }));
};
export default ProfileCard;
