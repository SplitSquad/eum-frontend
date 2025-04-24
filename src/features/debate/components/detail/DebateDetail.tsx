import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { useDebateStore } from '../../store';
import CountryStats from '../shared/CountryStats';
import ReactionButtons from '../shared/ReactionButtons';
import CommentSection from '../comment/CommentSection';
import { formatDate } from '../../utils/dateUtils';

const DebateDetail: React.FC = () => {
  // URL 파라미터에서 토론 ID 가져오기
  const { id } = useParams<{ id: string }>();
  const debateId = parseInt(id || '0');
  
  // 투표 현황 태그를 보여줄지 여부
  const [showVoteLabel, setShowVoteLabel] = useState(false);
  
  // 상태 및 액션 가져오기
  const {
    currentDebate,
    isLoading,
    error,
    getDebateById,
    getComments,
    voteOnDebate,
    resetDebateState
  } = useDebateStore();

  // 컴포넌트 마운트 시 데이터 로드
  useEffect(() => {
    if (debateId) {
      getDebateById(debateId);
      getComments(debateId);
    }
    
    // 컴포넌트 언마운트 시 상태 리셋
    return () => {
      resetDebateState();
    };
  }, [debateId, getDebateById, getComments, resetDebateState]);

  // 찬반 투표 핸들러
  const handleVote = (stance: 'pro' | 'con') => {
    if (debateId) {
      voteOnDebate(debateId, stance);
      // 투표 성공 시 결과를 3초간 표시
      setShowVoteLabel(true);
      setTimeout(() => setShowVoteLabel(false), 3000);
    }
  };

  // 로딩 상태 표시
  if (isLoading && !currentDebate) {
    return (
      <div className="bg-white rounded-lg shadow">
        <div className="flex justify-center items-center p-10">
          <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-primary"></div>
        </div>
      </div>
    );
  }

  // 에러 상태 표시
  if (error && !currentDebate) {
    return (
      <div className="bg-white rounded-lg shadow">
        <div className="text-center p-10 text-red-500">
          <p>토론 주제를 불러오는 중 오류가 발생했습니다.</p>
          <p className="text-sm mt-2">{error}</p>
          <button
            onClick={() => getDebateById(debateId)}
            className="mt-4 px-4 py-2 bg-primary text-white rounded hover:bg-primary-dark transition"
          >
            다시 시도
          </button>
          <Link to="/debate" className="block mt-2 text-primary hover:underline">
            토론 목록으로 돌아가기
          </Link>
        </div>
      </div>
    );
  }

  // 토론 주제가 없는 경우
  if (!currentDebate) {
    return (
      <div className="bg-white rounded-lg shadow">
        <div className="text-center p-10 text-gray-500">
          <p>존재하지 않는 토론 주제입니다.</p>
          <Link to="/debate" className="block mt-2 text-primary hover:underline">
            토론 목록으로 돌아가기
          </Link>
        </div>
      </div>
    );
  }

  // 토론 상세 정보
  const {
    title,
    content,
    createdAt,
    viewCount,
    proCount,
    conCount,
    commentCount,
    reactions,
    countryStats,
    source
  } = currentDebate;

  // 찬반 비율 계산
  const total = proCount + conCount;
  const proPercentage = total > 0 ? Math.round((proCount / total) * 100) : 0;
  const conPercentage = total > 0 ? Math.round((conCount / total) * 100) : 0;

  // 예제 통계 데이터
  const exampleStats = [
    { countryCode: 'kr', countryName: '대한민국', percentage: 60, count: 200 },
    { countryCode: 'us', countryName: '미국', percentage: 20, count: 70 },
    { countryCode: 'jp', countryName: '일본', percentage: 10, count: 30 },
    { countryCode: 'cn', countryName: '중국', percentage: 5, count: 15 },
    { countryCode: 'eu', countryName: '유럽', percentage: 5, count: 15 }
  ];

  return (
    <div className="bg-white rounded-lg shadow-lg overflow-hidden max-w-4xl mx-auto">
      {/* 헤더 - 토론 주제 */}
      <div className="p-5 relative">
        <div className="absolute right-4 top-3">
          <span className="text-xs font-bold text-orange-500 px-2 py-1 bg-orange-50 rounded-full">HOT 토론</span>
        </div>
        <h1 className="text-xl font-bold text-gray-800 pr-20">{title}</h1>
        <div className="flex flex-wrap items-center gap-2 text-xs text-gray-500 mt-2">
          <span>{formatDate(createdAt)}</span>
          <span className="w-1 h-1 bg-gray-300 rounded-full"></span>
          <span>조회 {viewCount}</span>
          <span className="w-1 h-1 bg-gray-300 rounded-full"></span>
          <span>댓글 {commentCount}</span>
        </div>
      </div>

      {/* 본문 콘텐츠 */}
      <div className="px-5 py-4 text-gray-700 leading-relaxed">
        <p className="text-sm">{content}</p>
      </div>

      {/* 찬반 투표 섹션 */}
      <div className="px-5 py-4 bg-gray-50 border-t border-b">
        {/* 투표 결과 표시 */}
        {showVoteLabel && (
          <div className="mb-4 text-center text-xs font-medium text-green-600 bg-green-50 py-2 rounded-lg">
            투표가 완료되었습니다. 현재 참여자 {total}명
          </div>
        )}
        
        {/* 투표 진행바 */}
        <div className="flex h-9 rounded-lg overflow-hidden mb-3">
          <div 
            className="bg-green-500 text-white font-medium flex items-center justify-center text-sm" 
            style={{ width: `${proPercentage}%` }}
          >
            {proPercentage}%
          </div>
          <div 
            className="bg-red-500 text-white font-medium flex items-center justify-center text-sm" 
            style={{ width: `${conPercentage}%` }}
          >
            {conPercentage}%
          </div>
        </div>
        
        <div className="flex gap-2">
          <button
            onClick={() => handleVote('pro')}
            className="flex-1 py-2 rounded-lg bg-green-500 text-white font-medium hover:bg-green-600 transition text-sm"
          >
            찬성합니다 ({proCount})
          </button>
          <button
            onClick={() => handleVote('con')}
            className="flex-1 py-2 rounded-lg bg-red-500 text-white font-medium hover:bg-red-600 transition text-sm"
          >
            반대합니다 ({conCount})
          </button>
        </div>
      </div>

      {/* 참여 통계 */}
      <div className="px-5 py-4 border-b">
        <div className="grid grid-cols-12 gap-4">
          {/* 국가별 통계 */}
          <div className="col-span-7">
            <h3 className="text-sm font-bold mb-3 text-gray-600">국가별 참여율</h3>
            <div className="grid grid-cols-12 text-xs">
              {/* 범례 - 컬러 박스 */}
              <div className="col-span-2">
                <div className="flex flex-col gap-1.5">
                  <div className="w-full h-3 bg-blue-500"></div>
                  <div className="w-full h-3 bg-green-500"></div>
                  <div className="w-full h-3 bg-yellow-500"></div>
                  <div className="w-full h-3 bg-red-500"></div>
                  <div className="w-full h-3 bg-purple-500"></div>
                </div>
              </div>
              
              {/* 범례 - 텍스트 */}
              <div className="col-span-4">
                <div className="flex flex-col gap-1.5 text-gray-600">
                  <div className="h-3 flex items-center">대한민국</div>
                  <div className="h-3 flex items-center">미국</div>
                  <div className="h-3 flex items-center">일본</div>
                  <div className="h-3 flex items-center">중국</div>
                  <div className="h-3 flex items-center">기타</div>
                </div>
              </div>
              
              {/* 범례 - 퍼센트 */}
              <div className="col-span-3">
                <div className="flex flex-col gap-1.5 text-gray-600">
                  <div className="h-3 flex items-center">60%</div>
                  <div className="h-3 flex items-center">20%</div>
                  <div className="h-3 flex items-center">10%</div>
                  <div className="h-3 flex items-center">5%</div>
                  <div className="h-3 flex items-center">5%</div>
                </div>
              </div>
              
              {/* 범례 - 숫자 */}
              <div className="col-span-3">
                <div className="flex flex-col gap-1.5 text-gray-600">
                  <div className="h-3 flex items-center">(200명)</div>
                  <div className="h-3 flex items-center">(70명)</div>
                  <div className="h-3 flex items-center">(30명)</div>
                  <div className="h-3 flex items-center">(15명)</div>
                  <div className="h-3 flex items-center">(15명)</div>
                </div>
              </div>
            </div>
          </div>
          
          {/* 그래프 - 도넛 차트 */}
          <div className="col-span-5">
            <h3 className="text-sm font-bold mb-2 text-gray-600">찬반 비율</h3>
            <div className="relative w-24 h-24 mx-auto">
              {/* 도넛 차트 SVG */}
              <svg viewBox="0 0 100 100" className="transform -rotate-90 w-full h-full">
                {/* 찬성 부분 */}
                <circle
                  cx="50"
                  cy="50"
                  r="40"
                  fill="transparent"
                  stroke="#22c55e" // green-500
                  strokeWidth="20"
                  strokeDasharray={`${proPercentage * 2.51} ${251 - proPercentage * 2.51}`}
                  strokeLinecap="round"
                />
                {/* 반대 부분 */}
                <circle
                  cx="50"
                  cy="50"
                  r="40"
                  fill="transparent"
                  stroke="#ef4444" // red-500
                  strokeWidth="20"
                  strokeDasharray={`${conPercentage * 2.51} ${251 - conPercentage * 2.51}`}
                  strokeDashoffset={`${-proPercentage * 2.51}`}
                  strokeLinecap="round"
                />
              </svg>
              {/* 중앙 텍스트 */}
              <div className="absolute inset-0 flex flex-col items-center justify-center text-center">
                <span className="text-xs text-gray-500">전체</span>
                <span className="text-sm font-bold">{total}명</span>
              </div>
            </div>
            
            {/* 범례 */}
            <div className="flex justify-center mt-2 gap-4 text-xs">
              <div className="flex items-center">
                <div className="w-2 h-2 bg-green-500 rounded-full mr-1"></div>
                <span>찬성 {proPercentage}%</span>
              </div>
              <div className="flex items-center">
                <div className="w-2 h-2 bg-red-500 rounded-full mr-1"></div>
                <span>반대 {conPercentage}%</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* 감정표현 */}
      <div className="px-5 py-4 border-b">
        <div className="flex justify-center gap-3">
          <div className="flex flex-col items-center">
            <button className="w-10 h-10 rounded-full bg-gray-100 hover:bg-gray-200 flex items-center justify-center mb-1">
              👍
            </button>
            <span className="text-xs">{reactions.like}</span>
          </div>
          <div className="flex flex-col items-center">
            <button className="w-10 h-10 rounded-full bg-gray-100 hover:bg-gray-200 flex items-center justify-center mb-1">
              👎
            </button>
            <span className="text-xs">{reactions.dislike}</span>
          </div>
          <div className="flex flex-col items-center">
            <button className="w-10 h-10 rounded-full bg-gray-100 hover:bg-gray-200 flex items-center justify-center mb-1">
              😊
            </button>
            <span className="text-xs">{reactions.happy}</span>
          </div>
          <div className="flex flex-col items-center">
            <button className="w-10 h-10 rounded-full bg-gray-100 hover:bg-gray-200 flex items-center justify-center mb-1">
              😠
            </button>
            <span className="text-xs">{reactions.angry}</span>
          </div>
          <div className="flex flex-col items-center">
            <button className="w-10 h-10 rounded-full bg-gray-100 hover:bg-gray-200 flex items-center justify-center mb-1">
              😢
            </button>
            <span className="text-xs">{reactions.sad}</span>
          </div>
        </div>
      </div>

      {/* 댓글 섹션 */}
      <div className="px-5 py-4">
        <div className="flex justify-between items-center mb-3">
          <h3 className="font-bold text-gray-800">댓글 {commentCount}개</h3>
          <button className="text-xs text-blue-500">최신순</button>
        </div>

        {/* 댓글 작성 폼 */}
        <div className="mb-5">
          <textarea 
            placeholder="댓글을 남겨주세요" 
            className="w-full border rounded-lg p-3 text-sm resize-none focus:outline-none focus:ring-1 focus:ring-blue-300"
            rows={3}
          ></textarea>
          <div className="flex justify-end mt-2">
            <button className="bg-blue-500 text-white rounded px-4 py-1.5 text-sm">등록</button>
          </div>
        </div>

        {/* 댓글 목록 대신 CommentSection 컴포넌트 */}
        <CommentSection debateId={debateId} />
      </div>
    </div>
  );
};

export default DebateDetail; 