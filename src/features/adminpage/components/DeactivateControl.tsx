import React, { useState } from 'react';
import styled from '@emotion/styled';
import useAdminpageStore from '../store/adminpageStore';
import { User } from '../types';

const Wrapper = styled.div`
  position: relative;
  display: flex;
  gap: 8px;
  align-items: center;
`;

const DeactivateButton = styled.button`
  padding: 6px 12px;
  background-color: #dc3545;
  color: white;
  border: none;
  border-radius: 4px;
  font-weight: 600;
  cursor: pointer;
`;

const DropdownToggle = styled.button`
  padding: 6px 12px;
  background-color: #f8f9fa;
  color: #343a40;
  border: 1px solid #ced4da;
  border-radius: 4px;
  cursor: pointer;
`;

const Dropdown = styled.ul`
  position: absolute;
  top: 40px;
  left: 100px;
  background: white;
  border: 1px solid #ddd;
  border-radius: 4px;
  width: 140px;
  padding: 8px 0;
  list-style: none;
  box-shadow: 0 2px 6px rgba(0, 0, 0, 0.15);
  z-index: 10;
`;

const DropdownItem = styled.li`
  padding: 8px 12px;
  font-size: 14px;
  cursor: pointer;
  &:hover {
    background-color: #f2f2f2;
  }
`;

interface DeactivateControlProps {
  user: User;
  onSelect: (days: number | 'permanent') => void;
}

const DeactivateControl: React.FC<DeactivateControlProps> = ({ user, onSelect }) => {
  const [isDropdownOpen, setDropdownOpen] = useState(false);
  const [selectedPeriod, setSelectedPeriod] = useState(0);
  const [selected, setSelected] = useState<number>(0);
  const { deactivateUser } = useAdminpageStore();

  const getLabel = (val: number) => {
    if (val === 600000) return '영구정지';
    return `${val}일 정지`;
  };

  const handleSelect = (value: number | 0) => {
    setSelected(value);
    onSelect(value);
    // setSelectedPeriod(value * 1440);
    setSelectedPeriod(value);
    setDropdownOpen(false);
  };

  return (
    <Wrapper>
      <DeactivateButton
        onClick={() => {
          const result = deactivateUser(user.userId, selected);

          alert(`정지 요청: ${getLabel(selected)}`);
        }}
      >
        정지
      </DeactivateButton>

      <DropdownToggle onClick={() => setDropdownOpen(prev => !prev)}>
        {selected ? getLabel(selected) : '기간 선택 ▼'}
      </DropdownToggle>

      {isDropdownOpen && (
        // <Dropdown>
        //   <DropdownItem onClick={() => handleSelect(1)}>1일 정지</DropdownItem>
        //   <DropdownItem onClick={() => handleSelect(5)}>5일 정지</DropdownItem>
        //   <DropdownItem onClick={() => handleSelect(10)}>10일 정지</DropdownItem>
        //   <DropdownItem onClick={() => handleSelect(30)}>30일 정지</DropdownItem>
        //   <DropdownItem onClick={() => handleSelect(600000)}>영구정지</DropdownItem>
        // </Dropdown>
        <Dropdown>
          <DropdownItem onClick={() => handleSelect(1)}>1분 정지</DropdownItem>
          <DropdownItem onClick={() => handleSelect(5)}>5분 정지</DropdownItem>
          <DropdownItem onClick={() => handleSelect(10)}>10분 정지</DropdownItem>
          <DropdownItem onClick={() => handleSelect(30)}>30분 정지</DropdownItem>
          <DropdownItem onClick={() => handleSelect(60)}>1시간 정지</DropdownItem>
        </Dropdown>
      )}
    </Wrapper>
  );
};

export default DeactivateControl;
