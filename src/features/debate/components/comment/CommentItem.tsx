import React, { useState } from 'react';
import { DebateComment } from '../../types';
import { useDebateStore } from '../../store';
import ReactionButtons from '../shared/ReactionButtons';
import ReplyItem from './ReplyItem';
import ReplyForm from './ReplyForm';

interface CommentItemProps {
  comment: DebateComment;
  onUpdate: () => void;
}

const CommentItem: React.FC<CommentItemProps> = ({ comment, onUpdate }) => {
  const { 
    id, 
    userId, 
    userName, 
    userProfileImage, 
    content, 
    createdAt, 
    updatedAt,
    reactions,
    stance,
    replyCount,
    countryCode,
    countryName
  } = comment;

  const { 
    replies, 
    getReplies, 
    deleteComment, 
    updateComment 
  } = useDebateStore();

  // 로컬 상태
  const [isEditing, setIsEditing] = useState(false);
  const [editText, setEditText] = useState(content);
  const [showReplies, setShowReplies] = useState(false);
  const [showReplyForm, setShowReplyForm] = useState(false);

  // 댓글 수정 핸들러
  const handleEdit = () => {
    if (editText.trim() && editText !== content) {
      updateComment(id, editText);
      setIsEditing(false);
      onUpdate();
    } else {
      setIsEditing(false);
      setEditText(content);
    }
  };

  // 댓글 삭제 핸들러
  const handleDelete = () => {
    if (window.confirm('정말 댓글을 삭제하시겠습니까?')) {
      deleteComment(id);
      onUpdate();
    }
  };

  // 대댓글 토글 핸들러
  const handleToggleReplies = () => {
    const newState = !showReplies;
    setShowReplies(newState);
    
    if (newState && (!replies[id] || replies[id].length === 0)) {
      getReplies(id);
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
    <div className="border rounded-lg p-4">
      {/* 댓글 헤더 */}
      <div className="flex justify-between items-start mb-2">
        <div className="flex items-center gap-2">
          {/* 작성자 프로필 이미지 */}
          <div className="w-10 h-10 rounded-full overflow-hidden bg-gray-200">
            {userProfileImage ? (
              <img src={userProfileImage} alt={userName} className="w-full h-full object-cover" />
            ) : (
              <div className="w-full h-full flex items-center justify-center text-gray-500">
                {userName.charAt(0)}
              </div>
            )}
          </div>
          
          {/* 작성자 정보 */}
          <div>
            <div className="flex items-center gap-2">
              <span className="font-medium">{userName}</span>
              {countryName && (
                <span className="text-xs px-2 py-0.5 bg-gray-100 rounded-full">
                  {countryName}
                </span>
              )}
              {/* 찬반 뱃지 */}
              <span className={`
                text-xs px-2 py-0.5 rounded-full
                ${stance === 'pro' ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}
              `}>
                {stance === 'pro' ? '찬성' : '반대'}
              </span>
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
            className="text-sm text-gray-500 hover:text-gray-700"
          >
            수정
          </button>
          <button
            onClick={handleDelete}
            className="text-sm text-gray-500 hover:text-red-500"
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
            className="w-full p-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-primary"
            rows={3}
          />
          <div className="flex justify-end gap-2 mt-2">
            <button
              onClick={() => {
                setIsEditing(false);
                setEditText(content);
              }}
              className="px-3 py-1.5 text-sm text-gray-600 border rounded"
            >
              취소
            </button>
            <button
              onClick={handleEdit}
              className="px-3 py-1.5 text-sm bg-primary text-white rounded"
            >
              저장
            </button>
          </div>
        </div>
      ) : (
        <p className="text-gray-700 whitespace-pre-wrap break-words">{content}</p>
      )}
      
      {/* 감정표현 및 기능 버튼 */}
      <div className="flex justify-between items-center mt-3">
        <ReactionButtons 
          targetId={id} 
          targetType="comment" 
          reactions={reactions}
          size="sm"
        />
        
        <div className="flex gap-3">
          <button
            onClick={() => setShowReplyForm(!showReplyForm)}
            className="text-sm text-gray-600 hover:text-primary"
          >
            {showReplyForm ? '취소' : '답글 작성'}
          </button>
          {replyCount > 0 && (
            <button
              onClick={handleToggleReplies}
              className="text-sm text-gray-600 hover:text-primary"
            >
              {showReplies ? '답글 숨기기' : `답글 ${replyCount}개 보기`}
            </button>
          )}
        </div>
      </div>
      
      {/* 답글 작성 폼 */}
      {showReplyForm && (
        <div className="mt-3 ml-10">
          <ReplyForm 
            commentId={id} 
            onSuccess={() => {
              setShowReplyForm(false);
              setShowReplies(true);
              getReplies(id);
              onUpdate();
            }} 
          />
        </div>
      )}
      
      {/* 답글 목록 */}
      {showReplies && (
        <div className="mt-3 ml-10 space-y-3">
          {replies[id] && replies[id].length > 0 ? (
            replies[id].map(reply => (
              <ReplyItem 
                key={reply.id} 
                reply={reply} 
                onUpdate={() => {
                  getReplies(id);
                  onUpdate();
                }} 
              />
            ))
          ) : (
            <div className="text-center py-3 text-sm text-gray-500">
              <div className="animate-spin inline-block h-4 w-4 border-b-2 border-primary mr-2"></div>
              답글을 불러오는 중...
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default CommentItem; 