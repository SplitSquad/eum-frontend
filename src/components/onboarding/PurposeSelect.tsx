import React from 'react';
import { useEffect, useState } from 'react';
import Container from '@/components/layout/Contianer';
import Button from '@/components/base/Button';
import Grid from '@/components/layout/Grid';
import Flex from '@/components/layout/Flex';
import { useUserStore } from '@/shared/store/UserStore';
import Study from '@/components/animations/Study';
import Travel from '@/components/animations/Travel';
import Settle from '@/components/animations/Settle';
import Employ from '@/components/animations/Employ';

type PurposeOption = {
  id: string;
  value: string;
  info: string;
  icon: React.ReactNode;
};

const purposeOptions: PurposeOption[] = [
  { id: 'travel', value: '여행', info: '관광과 체험을 위해 방문했어요', icon: <Travel /> },
  { id: 'study', value: '유학', info: '유학 또는 어학연수를 하고 싶어요', icon: <Study /> },
  { id: 'work', value: '취업', info: '취업 또는 인턴십을 하고 싶어요', icon: <Settle /> },
  { id: 'settle', value: '거주', info: '장기 거주 또는 정착을 하고 싶어요', icon: <Employ /> },
];

type Props = {
  onSelect: (purposeId: string) => void;
};

function PurposeSelect({ onSelect }: Props) {
  return (
    <Container className="py-12 max-w-xl mx-auto text-center">
      <h2 className="text-2xl font-bold text-gray-800 mb-6">방문 목적을 선택해주세요</h2>

      <Grid className="grid-cols-2 gap-4">
        {purposeOptions.map(option => (
          <Button
            key={option.id}
            variant="submit"
            size="lg"
            onClick={() => onSelect(option.id)}
            className="flex flex-col items-center gap-2 py-6"
          >
            <div className="w-20 h-20">{option.icon}</div>
            <div className="text-lg font-semibold">{option.value}</div>
            <div className="text-xs text-gray-500">{option.info}</div>
          </Button>
        ))}
      </Grid>
    </Container>
  );
}

export default PurposeSelect;
