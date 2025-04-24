import React from 'react';
import DropDown from '@/components/base/DropDown';

type Props = {
  labels: string[];
  itemsList: string[][];
  selected: string[];
  onSelect: (level: number, value: string) => void;
};

const DropDownGroup = ({ labels, itemsList, selected, onSelect }: Props) => {
  return (
    <div className="flex flex-wrap gap-4">
      {labels.map((label, index) => (
        <DropDown
          key={label}
          label={`${label}: ${selected[index] || '선택'}`}
          items={itemsList[index].map(value => ({ label: value, value }))}
          onSelect={value => onSelect(index, value)}
          isTopNav={false}
        />
      ))}
    </div>
  );
};

export default DropDownGroup;
