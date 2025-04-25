import React, { useState } from 'react';
import { DebateReply } from '../../types';
import { useDebateStore } from '../../store';
import ReactionButtons from '../shared/ReactionButtons';

interface ReplyItemProps {
  reply: DebateReply;
  onUpdate: () => void;
}

const ReplyItem: React.FC<ReplyItemProps> = ({ reply, onUpdate }) => {
  const {
    id,
    userId,
    userName,
    userProfileImage,
    content,
    createdAt,
    updatedAt,
    reactions,
    countryCode,
    countryName
  } = reply;

  const { updateReply, deleteReply } = useDebateStore();

  // 로컬 상태
  const [isEditing, setIsEditing] = useState(false);
  const [editText, setEditText] = useState(content);

  // 대댓글 수정 핸들러
  const handleEdit = () => {
    if (editText.trim() && editText !== content) {
      updateReply(id, editText);
      setIsEditing(false);
      onUpdate();
    } else {
      setIsEditing(false);
      setEditText(content);
    }
  };

  // 대댓글 삭제 핸들러
  const handleDelete = () => {
    if (window.confirm('정말 답글을 삭제하시겠습니까?')) {
      deleteReply(id);
      onUpdate();
    }
  };

  // 날짜 포맷
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    
    // 오늘 날짜인지 확인
    const today = new Date();
    const isToday = date.getDate() === today.getDate() &&
                    date.getMonth() === today.getMonth() &&
                    date.getFullYear() === today.getFullYear();
    
    if (isToday) {
      return `오늘 ${date.getHours().toString().padStart(2, '0')}:${date.getMinutes().toString().padStart(2, '0')}`;
    }
    
    return date.toLocaleDateString('ko-KR', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  return (
    <div className="border-t pt-3">
      {/* 댓글 헤더 */}
      <div className="flex justify-between items-start mb-2">
        <div className="flex items-center gap-2">
          {/* 작성자 프로필 이미지 */}
          <div className="w-8 h-8 rounded-full overflow-hidden bg-gray-200">
            {userProfileImage ? (
              <img src={userProfileImage} alt={userName} className="w-full h-full object-cover" />
            ) : (
              <div className="w-full h-full flex items-center justify-center text-gray-500 text-xs">
                {userName.charAt(0)}
              </div>
            )}
          </div>
          
          {/* 작성자 정보 */}
          <div>
            <div className="flex items-center gap-2">
              <span className="font-medium text-sm">{userName}</span>
              {countryName && (
                <span className="text-xs px-1.5 py-0.5 bg-gray-100 rounded-full">
                  {countryName}
                </span>
              )}
            </div>
            <div className="text-xs text-gray-500">
              {formatDate(createdAt)}
              {updatedAt && updatedAt !== createdAt && ' (수정됨)'}
            </div>
          </div>
        </div>
        
        {/* 댓글 관리 버튼 */}
        <div className="flex gap-2">
          <button
            onClick={() => setIsEditing(true)}
            className="text-xs text-gray-500 hover:text-gray-700"
          >
            수정
          </button>
          <button
            onClick={handleDelete}
            className="text-xs text-gray-500 hover:text-red-500"
          >
            삭제
          </button>
        </div>
      </div>
      
      {/* 댓글 내용 */}
      {isEditing ? (
        <div className="mt-2">
          <textarea
            value={editText}
            onChange={(e) => setEditText(e.target.value)}
            className="w-full p-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-primary text-sm"
            rows={2}
          />
          <div className="flex justify-end gap-2 mt-2">
            <button
              onClick={() => {
                setIsEditing(false);
                setEditText(content);
              }}
              className="px-2 py-1 text-xs text-gray-600 border rounded"
            >
              취소
            </button>
            <button
              onClick={handleEdit}
              className="px-2 py-1 text-xs bg-primary text-white rounded"
            >
              저장
            </button>
          </div>
        </div>
      ) : (
        <p className="text-gray-700 text-sm whitespace-pre-wrap break-words">{content}</p>
      )}
      
      {/* 감정표현 */}
      <div className="mt-2">
        <ReactionButtons 
          targetId={id} 
          targetType="reply" 
          reactions={reactions}
          size="sm"
        />
      </div>
    </div>
  );
};

export default ReplyItem; 