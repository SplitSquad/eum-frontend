import Button from '@/components/base/Button';
import DeleteIcon from '@mui/icons-material/Delete';
import AddIcon from '@mui/icons-material/Add';
import Badge from '@/components/base/Badge';
import Checkbox from '@/components/base/Checkbox';
import Divider from '@/components/base/Divider';
import Icon from '@/components/base/Icon';
import Input from '@/components/base/Input';
import Radio from '@/components/base/Radio';
import Select from '@/components/base/Select';
import Tooltip from '@/components/base/Tooltip';
import { useState } from 'react';
import MenuItem from '@mui/material/MenuItem';

function ComponentTest() {
  const [selected, setSelected] = useState('option1');
  const [checked, setChecked] = useState(false);

  return (
    <div className="flex flex-col gap-6 p-6 max-w-md mx-auto">
      <Button variant="submit" size="sm">
        등록1
      </Button>
      <Button variant="submit" size="md">
        등록2
      </Button>
      <Button variant="submit" size="lg">
        등록3
      </Button>
      <Button variant="exit" size="lg" onClick={() => alert('닫기')}>
        ✕
      </Button>

      <Button variant="iconOnly" size="sm" icon={<DeleteIcon />} aria-label="삭제" />

      <Button variant="submit" isLoading>
        저장 중...
      </Button>

      <Button variant="iconOnly" icon={<AddIcon />} isLoading />
      <h2 className="text-lg font-semibold">Input</h2>
      <Input placeholder="이름을 입력하세요" />
      <Input placeholder="비활성화된 입력창" disabled />

      <h2 className="text-lg font-semibold">Select</h2>
      <Select value={selected} onChange={e => setSelected(e.target.value)}>
        <MenuItem value="option1">옵션 1</MenuItem>
        <MenuItem value="option2">옵션 2</MenuItem>
      </Select>
      <Select value="option2" disabled>
        <MenuItem value="option1">옵션 1</MenuItem>
        <MenuItem value="option2">옵션 2</MenuItem>
      </Select>

      <h2 className="text-lg font-semibold">Checkbox</h2>
      <Checkbox checked={checked} onChange={e => setChecked(e.target.checked)} />
      <Checkbox disabled />

      <h2 className="text-lg font-semibold">Radio</h2>
      <Radio checked />
      <Radio disabled />

      <h2 className="text-lg font-semibold">Tooltip</h2>
      <Tooltip title="삭제">
        <button className="w-fit p-2 border rounded">툴팁 테스트</button>
      </Tooltip>

      <h2 className="text-lg font-semibold">Badge</h2>
      <Badge badgeContent={3} color="primary">
        <button className="p-2 border rounded">알림</button>
      </Badge>

      <h2 className="text-lg font-semibold">Divider</h2>
      <Divider />

      <h2 className="text-lg font-semibold">Icon</h2>
      <Icon>
        <DeleteIcon />
      </Icon>
      <Icon>
        <AddIcon />
      </Icon>
    </div>
  );
}

export default ComponentTest;
