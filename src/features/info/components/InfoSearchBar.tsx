import React from 'react';
import { useTranslation } from '@/shared/i18n';

interface InfoSearchBarProps {
  inputValue: string;
  onInputChange: (v: string) => void;
  onSearch: () => void;
  sortOrder: 'latest' | 'views';
  onSortChange: (order: 'latest' | 'views') => void;
}
const { t } = useTranslation();
const InfoSearchBar: React.FC<InfoSearchBarProps> = ({
  inputValue,
  onInputChange,
  onSearch,
  sortOrder,
  onSortChange,
}) => {
  return (
    <div className="flex justify-between items-center mb-6 space-x-4">
      <div className="flex flex-1 border border-gray-300 rounded-lg overflow-hidden">
        <input
          type="text"
          placeholder={t('community.posts.enterTitle')}
          value={inputValue}
          onChange={e => onInputChange(e.target.value)}
          className="flex-1 h-10 px-4 focus:outline-none"
        />
        <button onClick={onSearch} className="px-4 bg-gray-100 hover:bg-gray-200">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-5 w-5 text-gray-600"
            viewBox="0 0 24 24"
          >
            <path
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M21 21l-4.35-4.35m1.2-5.15a7 7 0 1 1-14 0 7 7 0 0 1 14 0z"
            />
          </svg>
        </button>
      </div>
      <div className="flex space-x-2">
        <button
          onClick={() => onSortChange('latest')}
          className={`px-3 py-1 rounded ${
            sortOrder === 'latest'
              ? 'bg-blue-100 text-blue-600 font-semibold'
              : 'bg-white text-gray-600 hover:bg-gray-100'
          }`}
        >
          {t('community.filters.latest')}
        </button>
        <button
          onClick={() => onSortChange('views')}
          className={`px-3 py-1 rounded ${
            sortOrder === 'views'
              ? 'bg-blue-100 text-blue-600 font-semibold'
              : 'bg-white text-gray-600 hover:bg-gray-100'
          }`}
        >
          {t('community.filters.popular')}
        </button>
      </div>
    </div>
  );
};

export default InfoSearchBar;
