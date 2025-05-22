import React from 'react';
import { Link } from 'react-router-dom';
import { MyPost } from '../types';

interface PostItemProps {
  post: MyPost;
}

/**
 * 내가 작성한 게시글 항목 컴포넌트
 */
const PostItem: React.FC<PostItemProps> = ({ post }) => {
  return (
    <div className="border-b last:border-b-0 py-4">
      <div className="flex justify-between items-start mb-2">
        <Link 
          to={`/community/post/${post.id}`}
          className="text-lg font-medium text-gray-800 hover:text-primary-600 transition-colors"
        >
          {post.title}
        </Link>
        <span className="text-sm text-gray-500">{post.createdAt}</span>
      </div>
      
      <p className="text-gray-600 mb-2 line-clamp-2 text-sm">
        {post.content}
      </p>
      
      <div className="flex items-center text-sm text-gray-500">
        <span className="flex items-center">
          <span className="mr-1">👁️</span> {post.viewCount}
        </span>
        <span className="mx-2">•</span>
        <span className="flex items-center">
          <span className="mr-1">❤️</span> {post.likeCount}
        </span>
        <span className="mx-2">•</span>
        <span className="flex items-center">
          <span className="mr-1">💬</span> {post.commentCount}
        </span>
        <span className="mx-2">•</span>
        <span className="bg-gray-100 px-2 py-0.5 rounded-full text-xs">
          {post.category}
        </span>
      </div>
    </div>
  );
};

export default PostItem; 