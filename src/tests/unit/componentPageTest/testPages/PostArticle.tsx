import AppLayout from '@/components/layout/AppLayout';
import PageWrapper from '@/components/layout/PageWrapper';
import Container from '@/components/layout/Contianer';
import Grid from '@/components/layout/Grid';

import PostTitleField from '@/features/community/components/forms/PostTitleField';
import PostTypeSelector from '@/features/community/components/forms/PostTypeSelector';
import PostRegionSelector from '@/features/community/components/forms/PostRegionSelector';
import PostTagSelector from '@/features/community/components/forms/PostTagSelector';
import PostBodyField from '@/features/community/components/forms/PostBodyField';
import { usePostFormStore } from '@/features/community/store/postFormStore';
import Button from '@/components/base/Button'; // 저장 버튼 스타일
import { useState, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { useSnackbar } from 'notistack';

import apiClient from '@/features/community/api/apiClient';

interface FileWithMetadata {
  id: number;
  fileName: string;
  fileUrl: string;
}

const PostArticle = () => {
  const navigate = useNavigate();
  const { enqueueSnackbar } = useSnackbar();

  const [isLoading, setIsLoading] = useState(false);
  const [isSaving, setIsSaving] = useState(false);

  // 파일 업로드 관련 상태

  const fileInputRef = useRef<HTMLInputElement>(null);

  const { title, postType, city, district, neighborhood, category, tag, content, isAnonymous } =
    usePostFormStore();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      setIsSaving(true);
      // 폼 데이터 준비 - API 형식에 맞게 변환
      const postData = {
        title: title,
        content: content,
        category: category,
        language: 'ko', // 기본값
      };

      console.log('서버로 전송할 데이터:', postData);
      // 게시글 목록 페이지로 이동
      const response = await apiClient.post<any>('/infomation', postData);
      console.log('게시글 저장 성공:', response.data);
    } catch (error) {
      console.error('게시글 저장 오류:', error);
      enqueueSnackbar('게시글 저장 중 오류가 발생했습니다.', { variant: 'error' });
    } finally {
      setIsSaving(false);
    }
  };
  /*
  const handleSubmit = () => {
    const payload = {
      title,
      postType,
      address: postType === '자유' ? '모임' : `${city} ${district} ${neighborhood}`,
      category,
      tag,
      content, // TipTap JSON 그대로
      language: 'KO', // (일단 기본 한글 고정, 나중에 선택 추가 가능)
    };

    console.log('최종 제출 데이터:', payload);
    // TODO: 여기서 API 호출 (axios.post('/api/posts', payload))
  };*/

  return (
    <AppLayout>
      <PageWrapper>
        <Container as="main">
          <h1 className="text-2xl font-bold mb-6">게시글 작성</h1>

          {/* Title */}
          <div className="mb-6">
            <PostTitleField />
          </div>

          {/* Type */}
          <div className="mb-6">
            <PostTypeSelector />
          </div>

          {/* Region */}
          {postType === '모임' && (
            <div className="mb-6">
              <PostRegionSelector />
            </div>
          )}

          {/* Category */}
          <div className="mb-6">
            <PostTagSelector />
          </div>

          {/* Body */}
          <div className="mb-6">
            <PostBodyField />
          </div>

          {/* Submit Button */}
          <div className="flex justify-end">
            <Button variant="submit" size="lg" onClick={handleSubmit}>
              저장하기
            </Button>
          </div>
        </Container>
      </PageWrapper>
    </AppLayout>
  );
};

export default PostArticle;
