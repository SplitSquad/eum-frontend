import React from 'react';
import { Link } from 'react-router-dom';
import { MyBookmark } from '../types';

interface BookmarkItemProps {
  bookmark: MyBookmark;
}

/**
 * 내가 북마크한 정보글 항목 컴포넌트
 */
const BookmarkItem: React.FC<BookmarkItemProps> = ({ bookmark }) => {
  return (
    <div className="border-b last:border-b-0 py-4">
      <div className="flex justify-between items-start mb-2">
        <Link 
          to={`/info/${bookmark.id}`}
          className="text-lg font-medium text-gray-800 hover:text-primary-600 transition-colors"
        >
          {bookmark.title}
        </Link>
        <span className="text-sm text-gray-500">{bookmark.createdAt}</span>
      </div>
      
      <div className="flex items-center text-sm text-gray-500">
        <span className="bg-gray-100 px-2 py-0.5 rounded-full text-xs">
          {bookmark.category}
        </span>
        <span className="mx-2">•</span>
        <span>출처: {bookmark.source}</span>
      </div>
    </div>
  );
};

export default BookmarkItem; 