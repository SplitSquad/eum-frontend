// 감정표현 요청 타입
export var ReactionType;
(function (ReactionType) {
    ReactionType["LIKE"] = "like";
    ReactionType["DISLIKE"] = "dislike";
    ReactionType["HAPPY"] = "happy";
    ReactionType["ANGRY"] = "angry";
    ReactionType["SAD"] = "sad";
    ReactionType["UNSURE"] = "unsure";
})(ReactionType || (ReactionType = {}));
// API 응답을 프론트엔드 타입으로 변환하는 유틸리티 함수
export function mapDebateResToFrontend(dto) {
    // 백엔드에서 제공하는 필드가 다양할 수 있으므로 안전하게 처리
    // 필수 필드가 없을 경우 기본값 사용
    const voteCnt = dto.voteCnt || 0;
    const agreePercent = dto.agreePercent || 0;
    const disagreePercent = dto.disagreePercent || 0;
    // 백엔드 응답에 따라 필드 이름이 다를 수 있음
    const debateId = dto.debateId || dto.id || 0;
    const views = dto.views || dto.viewCount || 0;
    const commentCnt = dto.commentCnt || dto.commentCount || 0;
    return {
        id: debateId,
        title: dto.title || '',
        content: dto.content || '',
        createdAt: dto.createdAt || new Date().toISOString(),
        viewCount: views,
        source: dto.source || undefined,
        imageUrl: dto.imageUrl || undefined,
        proCount: Math.round(voteCnt * (agreePercent / 100)),
        conCount: Math.round(voteCnt * (disagreePercent / 100)),
        reactions: {
            like: dto.like || 0,
            dislike: dto.dislike || 0,
            sad: dto.sad || 0,
            angry: dto.angry || 0,
            happy: dto.happy || 0, // 백엔드에 없을 수 있음
            unsure: dto.hm || 0 // 백엔드에서는 hm으로 표현
        },
        countryStats: dto.countryStats || undefined,
        commentCount: commentCnt,
        isVotedState: dto.isVotedState,
        isState: dto.isState,
        category: dto.category || undefined
    };
}
export function mapCommentResToFrontend(dto, debateId) {
    return {
        id: dto.commentId,
        debateId: debateId,
        userId: 0, // 백엔드에서 제공하지 않음
        userName: dto.userName || '익명',
        content: dto.content || '',
        createdAt: dto.createdAt || new Date().toISOString(),
        reactions: {
            like: dto.like || 0,
            dislike: dto.dislike || 0,
            happy: 0, // 백엔드에 없음
            angry: 0, // 백엔드에 없음
            sad: 0, // 백엔드에 없음
            unsure: 0, // 백엔드에 없음
        },
        stance: dto.stance || 'pro', // 백엔드에서 제공하지 않을 수 있음, 기본값 설정
        replyCount: dto.reply || 0,
        isState: dto.isState
    };
}
export function mapReplyResToFrontend(dto, commentId) {
    return {
        id: dto.replyId,
        commentId: commentId,
        userId: 0, // 백엔드에서 제공하지 않음
        userName: dto.userName,
        content: dto.content,
        createdAt: dto.createdAt,
        reactions: {
            like: dto.like,
            dislike: dto.dislike,
            happy: 0, // 백엔드에 없음
            angry: 0, // 백엔드에 없음
            sad: 0, // 백엔드에 없음
            unsure: 0, // 백엔드에 없음
        },
        isState: dto.isState
    };
}
/**
 * 백엔드의 isVotedState 값을 프론트엔드의 VoteType으로 변환
 * @param isVotedState 백엔드에서 전달받은 투표 상태 ('찬성' | '반대' | null)
 * @returns 프론트엔드에서 사용하는 VoteType ('pro' | 'con' | null)
 */
export function mapIsVotedStateToVoteType(isVotedState) {
    if (!isVotedState)
        return null;
    switch (isVotedState) {
        case '찬성':
            return 'pro';
        case '반대':
            return 'con';
        default:
            return null;
    }
}
/**
 * 백엔드의 isState 값을 프론트엔드의 EmotionType으로 변환
 * @param isState 백엔드에서 전달받은 감정 상태
 * @returns 프론트엔드에서 사용하는 EmotionType
 */
export function mapIsStateToEmotionType(isState) {
    if (!isState)
        return null;
    switch (isState) {
        case '좋아요':
            return 'like';
        case '싫어요':
            return 'dislike';
        case '슬퍼요':
            return 'sad';
        case '화나요':
            return 'angry';
        case '글쎄요':
            return 'confused';
        default:
            return null;
    }
}
