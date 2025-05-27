import React from 'react';

interface WriteButtonProps {
  onClick: () => void;
}

const WriteButton: React.FC<WriteButtonProps> = ({ onClick }) => {
  return (
    <button
      onClick={onClick}
      className="absolute right-0 top-0 translate-y-1 bg-blue-600 text-white px-4 py-1 rounded-lg hover:bg-blue-700"
    >
      글쓰기
    </button>
  );
};

export default WriteButton;
