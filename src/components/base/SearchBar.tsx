import React from 'react';
import { Search } from 'lucide-react';

type Props = {
  value: string;
  onChange: (value: string) => void;
  placeHolder?: string;
  onSearch?: () => void;
  className?: string;
};

const SearchBar = ({
  value,
  onChange,
  placeHolder = '검색어를 입력하세요',
  onSearch,
  className,
}: Props) => {
  return (
    <div
      className={`flex items-center border rounded-md px-3 py-2 shadow-sm bg-white ${className}`}
    >
      <input
        type="text"
        value={value}
        onChange={e => onChange(e.target.value)}
        placeholder={placeHolder}
        className="flex-1 outline-none text-sm text-gray-700"
      />
      <button onClick={onSearch} className="ml-2 text-gray-500 hover:text-primary">
        <Search size={18} />
      </button>
    </div>
  );
};

export default SearchBar;
