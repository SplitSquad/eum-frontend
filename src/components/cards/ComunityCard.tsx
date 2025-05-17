import React from 'react';
import { useNavigate } from 'react-router-dom';

export type CommunityCardProps = {
  postId: number;
  title?: string;
  views?: number;
  dislike?: number;
  like?: number;
  userName: string;
  createdAt?: string;
  defaultLink?: string;
};

const CommunityCard = ({
  postId,
  title = '',
  views = 0,
  dislike = 0,
  like = 0,
  userName = '',
  createdAt = '',
  defaultLink = '',
}: CommunityCardProps) => {
  const navigate = useNavigate();
  const clickHandler = () => {
    if (postId) {
      navigate(`${defaultLink}/${postId}`);
    }
  };

  return (
    <div
      onClick={clickHandler}
      className="cursor-pointer bg-white shadow-md hover:shadow-lg rounded-lg p-4 transition duration-200 border border-gray-100"
    >
      <h3 className="text-lg font-semibold text-gray-800 truncate mb-2">{title || '제목 없음'}</h3>
      <div className="text-sm text-gray-500 mb-2 flex justify-between">
        <span>{userName || '익명'}</span>
        <span>{createdAt || '-'}</span>
      </div>
      <div className="flex gap-4 text-xs text-gray-600">
        <span>👍 {like ?? 0}</span>
        <span>👎 {dislike ?? 0}</span>
        <span>👁 {views ?? 0}</span>
      </div>
    </div>
  );
};

export default CommunityCard;
