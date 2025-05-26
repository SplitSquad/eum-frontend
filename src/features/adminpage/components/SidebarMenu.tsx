import { NavLink } from 'react-router-dom';
import React, { useState } from 'react';
import styled from '@emotion/styled';
import { motion, AnimatePresence } from 'framer-motion';
import { Settings } from '@mui/icons-material';

const SidebarContainer = styled.div`
  width: 220px;
  border: 1px solid #ddd;
  padding: 8px;
  font-family: sans-serif;
`;

const MenuItem = styled.div`
  padding: 8px;
  cursor: pointer;
  font-weight: bold;
  display: flex;
  justify-content: space-between;

  &:hover {
    background-color: #f0f0f0;
  }
`;

const StyledNavLink = styled(NavLink)`
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 12px 16px;
  color: #555;
  text-decoration: none;
  border-radius: 12px;
  font-weight: 500;
  transition: all 0.25s cubic-bezier(0.4, 0, 0.2, 1);
  position: relative;
  overflow: hidden;

  &:hover {
    color: #ff6b6b;
    background-color: rgba(255, 182, 193, 0.1);
    transform: translateX(4px);
  }

  &.active {
    color: #ff4d4d;
    background-color: rgba(255, 182, 193, 0.2);
    font-weight: 600;

    &::before {
      content: '';
      position: absolute;
      left: 0;
      top: 0;
      height: 100%;
      width: 4px;
      background: linear-gradient(180deg, #ff9999, #ff6b6b);
      border-radius: 0 4px 4px 0;
      box-shadow: 2px 0 6px rgba(255, 155, 155, 0.3);
    }

    svg {
      filter: drop-shadow(0 1px 2px rgba(255, 155, 155, 0.4));
    }
  }

  svg {
    flex-shrink: 0;
    transition: all 0.3s ease;
  }
`;

const SidebarMenu: React.FC = () => {
  return (
    <SidebarContainer>
      <MenuItem>
        <StyledNavLink to="/adminpage" end>
          관리자 등록
        </StyledNavLink>
      </MenuItem>
      <MenuItem>
        <StyledNavLink to="/adminpage/userManage">유저 관리</StyledNavLink>
      </MenuItem>
      <MenuItem>
        <StyledNavLink to="/adminpage/communityManage">커뮤니티관리</StyledNavLink>
      </MenuItem>
      <MenuItem>
        <StyledNavLink to="/adminpage/debatemanage">토론관리</StyledNavLink>
      </MenuItem>
    </SidebarContainer>
  );
};

export default SidebarMenu;
