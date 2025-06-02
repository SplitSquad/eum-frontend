import React, { useState, useEffect, useRef, ChangeEvent, useCallback } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import {
  Container,
  Box,
  TextField,
  Button,
  Typography,
  Paper,
  Select,
  MenuItem,
  Chip,
  FormControl,
  InputLabel,
  OutlinedInput,
  Checkbox,
  ListItemText,
  SelectChangeEvent,
  FormHelperText,
  CircularProgress,
  IconButton,
  Stack,
  List,
  ListItem,
  ListItemIcon,
  ListItemButton,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  DialogContentText,
} from '@mui/material';
import { Theme, useTheme } from '@mui/material/styles';
import { styled } from '@mui/system';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import AddIcon from '@mui/icons-material/Add';
import DeleteIcon from '@mui/icons-material/Delete';
import InsertDriveFileIcon from '@mui/icons-material/InsertDriveFile';
import CloudUploadIcon from '@mui/icons-material/CloudUpload';
import useCommunityStore from '../store/communityStore';
import { useSnackbar } from 'notistack';
import { Post } from '../types';
import RegionSelector from '../components/shared/RegionSelector';
import { useRegionStore } from '../store/regionStore';
import { debugLog } from '../../../shared/utils/debug';
import { detectLanguage, detectPostLanguage } from '../utils/languageUtils';
import { useTranslation } from '../../../shared/i18n';
import { useLanguageContext } from '../../../features/theme/components/LanguageProvider';
import { usePostStore } from '../store/postStore';

// 스프링 배경 컴포넌트 임포트

// Type definitions
export interface FileInfo {
  fileId: number;
  originalName: string;
  url: string;
  contentType: string;
  size: number;
}

export interface Tag {
  tagId: number;
  name: string;
  description?: string;
  category: string;
}

// Form data type definition
export type PostFormData = {
  title: string;
  content: string;
  category?: string;
  subTags: string[];
  postType: string;
  address: string;
  files?: File[];
  removedFileIds?: number[];
};

// 게시글 작성/수정 페이지 스타일 컴포넌트
const ContentPaper = styled(Paper)(({ theme }) => ({
  padding: theme.spacing(3),
  marginTop: theme.spacing(3),
  position: 'relative',
  zIndex: 1,
  borderRadius: '16px',
  boxShadow: '0 8px 16px rgba(60,60,60,0.08)',
  border: '1px solid #e0e0e0',
  background: 'rgba(245, 245, 245, 0.97)',
  backdropFilter: 'blur(6px)',
}));

const FormBox = styled(Box)(({ theme }) => ({
  display: 'flex',
  flexDirection: 'column',
  gap: theme.spacing(3),
  marginTop: theme.spacing(2),
}));

const StyledButton = styled(Button)(({ theme }) => ({
  marginTop: theme.spacing(2),
  backgroundColor: '#444',
  color: '#fff',
  '&:hover': {
    backgroundColor: '#222',
  },
  borderRadius: '8px',
  padding: '10px 20px',
  fontWeight: 'bold',
  boxShadow: '0 4px 8px rgba(60,60,60,0.10)',
  transition: 'all 0.3s ease',
}));

const PageTitle = styled(Typography)(({ theme }) => ({
  color: '#333',
  fontWeight: 'bold',
  marginBottom: theme.spacing(2),
  position: 'relative',
  '&::after': {
    content: '""',
    position: 'absolute',
    bottom: -8,
    left: 0,
    width: '100px',
    height: '3px',
    background: 'linear-gradient(90deg, #bdbdbd, #e0e0e0)',
    borderRadius: '10px',
  },
}));

// File upload related styled components
const FileUploadBox = styled(Box)(({ theme }) => ({
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'center',
  justifyContent: 'center',
  border: '2px dashed #bdbdbd',
  borderRadius: '12px',
  padding: theme.spacing(3),
  cursor: 'pointer',
  transition: 'background-color 0.3s, border-color 0.3s',
  backgroundColor: '#f5f5f5',
  '&:hover': {
    backgroundColor: '#ededed',
    borderColor: '#757575',
  },
  height: '180px',
}));

const VisuallyHiddenInput = styled('input')({
  clip: 'rect(0 0 0 0)',
  clipPath: 'inset(50%)',
  height: 1,
  overflow: 'hidden',
  position: 'absolute',
  bottom: 0,
  left: 0,
  whiteSpace: 'nowrap',
  width: 1,
});

// 태그 선택을 위한 ITEM_HEIGHT, ITEM_PADDING_TOP 정의
const ITEM_HEIGHT = 48;
const ITEM_PADDING_TOP = 8;
const MenuProps = {
  PaperProps: {
    style: {
      maxHeight: ITEM_HEIGHT * 4.5 + ITEM_PADDING_TOP,
      width: 250,
    },
  },
};

// 선택된 태그의 스타일을 정의하는 함수
const getTagStyles = (tag: string, selectedTags: string[], theme: Theme) => {
  return {
    fontWeight: selectedTags.indexOf(tag) === -1 ? 'normal' : 'bold',
    backgroundColor: selectedTags.indexOf(tag) === -1 ? 'transparent' : 'rgba(255, 170, 165, 0.1)',
  };
};

// 카테고리 및 태그 데이터 (대분류)
const categories = ['travel', 'living', 'study', 'job'];

// 게시글 타입 (자유/모임) - 번역 키 사용
const getPostTypes = (t: any) => [
  { key: '자유', label: t('community.postTypes.freeBoard') },
  { key: '모임', label: t('community.postTypes.groupMeeting') },
];

// 카테고리 라벨을 번역으로 가져오는 함수
const getCategoryLabels = (t: any): Record<string, string> => ({
  travel: t('community.categories.travelCategory'),
  living: t('community.categories.livingCategory'),
  study: t('community.categories.studyCategory'),
  job: t('community.categories.jobCategory'),
});

// 지역 목록
const regions = [
  '서울',
  '부산',
  '인천',
  '대구',
  '광주',
  '대전',
  '울산',
  '세종',
  '경기',
  '강원',
  '충북',
  '충남',
  '전북',
  '전남',
  '경북',
  '경남',
  '제주',
  '해외/기타',
];

// 태그 소분류 - 원본 한국어 태그 (API 전달용)
const getOriginalSubTagsByCategory = (): { [key: string]: string[] } => ({
  travel: ['관광/체험', '식도락/맛집', '교통/이동', '숙소/지역정보', '대사관/응급'],
  living: ['부동산/계약', '생활환경/편의', '문화/생활', '주거지 관리/유지'],
  study: ['학사/캠퍼스', '학업지원/시설', '행정/비자/서류', '기숙사/주거'],
  job: ['이력/채용준비', '비자/법률/노동', '잡페어/네트워킹', '알바/파트타임'],
});

// 태그 소분류 - 번역된 텍스트 (UI 표시용)
const getSubTagsByCategory = (t: any): { [key: string]: string[] } => ({
  travel: [
    t('communityTags.travel.0') || '관광/체험',
    t('communityTags.travel.1') || '식도락/맛집',
    t('communityTags.travel.2') || '교통/이동',
    t('communityTags.travel.3') || '숙소/지역정보',
    t('communityTags.travel.4') || '대사관/응급',
  ],
  living: [
    t('communityTags.living.0') || '부동산/계약',
    t('communityTags.living.1') || '생활환경/편의',
    t('communityTags.living.2') || '문화/생활',
    t('communityTags.living.3') || '주거지 관리/유지',
  ],
  study: [
    t('communityTags.study.0') || '학사/캠퍼스',
    t('communityTags.study.1') || '학업지원/시설',
    t('communityTags.study.2') || '행정/비자/서류',
    t('communityTags.study.3') || '기숙사/주거',
  ],
  job: [
    t('communityTags.job.0') || '이력/채용준비',
    t('communityTags.job.1') || '비자/법률/노동',
    t('communityTags.job.2') || '잡페어/네트워킹',
    t('communityTags.job.3') || '알바/파트타임',
  ],
});

// 번역된 태그를 원본 한국어 태그로 변환하는 함수
const convertTranslatedTagsToOriginal = (
  translatedTags: string[],
  category: string,
  t: any
): string[] => {
  const originalTags = getOriginalSubTagsByCategory()[category] || [];
  const translatedTagsMap = getSubTagsByCategory(t)[category] || [];

  return translatedTags.map(translatedTag => {
    const index = translatedTagsMap.indexOf(translatedTag);
    return index !== -1 ? originalTags[index] : translatedTag;
  });
};

// Define a FileWithMetadata interface for file objects with metadata
interface FileWithMetadata {
  id: number;
  fileName: string;
  fileUrl: string;
}

// Custom Post interface that extends the imported Post type with our own properties
interface CustomPost extends Omit<Post, 'tags'> {
  files?: string[] | FileInfo[] | FileWithMetadata[];
  isAnonymous?: boolean;
  category?: string;
  postType?: string;
  address?: string;
  tags?: Tag[];
}

const PostCreateEditPage: React.FC = () => {
  const navigate = useNavigate();
  const { postId } = useParams<{ postId: string }>();
  const theme = useTheme();
  const isEditMode = !!postId;
  const { enqueueSnackbar } = useSnackbar();
  const { t } = useTranslation();
  const { currentLanguage } = useLanguageContext();

  // 커뮤니티 스토어에서 필요한 상태와 액션 가져오기
  const communityStore = useCommunityStore();
  const { createPost, updatePost, fetchPostById } = communityStore;
  const storePostLoading = communityStore.postLoading;
  const storePostError = communityStore.postError;

  const [formData, setFormData] = useState<PostFormData>({
    title: '',
    content: '',
    category: '', // 대분류 (여행, 취업, 유학, 거주)
    subTags: [],
    postType: '자유', // 기본값은 '자유' 게시글
    address: '자유', // 자유 게시글은 address가 '자유'
  });

  const [errors, setErrors] = useState<Record<string, string>>({
    title: '',
    content: '',
  });

  const [isLoading, setIsLoading] = useState(false);
  const [isSaving, setIsSaving] = useState(false);

  // 파일 업로드 관련 상태
  const [selectedFiles, setSelectedFiles] = useState<File[]>([]);
  const [uploadProgress, setUploadProgress] = useState<boolean>(false);
  const [removedFileIds, setRemovedFileIds] = useState<number[]>([]);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // 게시글의 파일 목록 상태 추가
  const [postFiles, setPostFiles] = useState<FileWithMetadata[]>([]);

  // 세부 지역 선택을 처리하기 위한 상태 추가
  const [selectedSubRegion, setSelectedSubRegion] = useState<string>('');

  const resetRegion = useRegionStore(state => state.resetRegion);

  // 편집 모드일 경우 기존 게시글 데이터 불러오기
  useEffect(() => {
    const fetchPostData = async () => {
      if (!postId) return;

      try {
        setIsLoading(true);
        const post = (await fetchPostById(Number(postId))) as CustomPost;

        if (post) {
          // 기존 게시글 데이터로 폼 초기화
          setFormData({
            title: post.title || '',
            content: post.content || '',
            category: post.category || '',
            subTags: post.tags?.map((tag: Tag) => tag.name) || [],
            postType: (post.postType as string) || '자유',
            address: post.address || '자유',
          });

          // 게시글에 첨부된 파일이 있으면 파일 목록 설정
          if (post.files && post.files.length > 0) {
            // Post.files가 string[] 타입인 경우 처리
            if (typeof post.files[0] === 'string') {
              const fileUrls = post.files as string[];
              // string[] 를 FileWithMetadata[] 로 변환
              const filesWithMetadata: FileWithMetadata[] = fileUrls.map((url, index) => ({
                id: index,
                fileName: url.split('/').pop() || `file-${index}`,
                fileUrl: url,
              }));
              setPostFiles(filesWithMetadata);
            }
            // Post.files가 FileInfo[] 타입인 경우 처리
            else if ('fileId' in (post.files[0] as FileInfo)) {
              const fileInfos = post.files as FileInfo[];
              // FileInfo[] 를 FileWithMetadata[] 로 변환
              const filesWithMetadata: FileWithMetadata[] = fileInfos.map(file => ({
                id: file.fileId,
                fileName: file.originalName,
                fileUrl: file.url,
              }));
              setPostFiles(filesWithMetadata);
            }
            // 이미 FileWithMetadata[] 타입인 경우는 그대로 사용
            else {
              setPostFiles(post.files as FileWithMetadata[]);
            }
          }
        }
      } catch (error) {
        console.error('게시글 로드 오류:', error);
        enqueueSnackbar(t('community.posts.form.messages.loadError'), { variant: 'error' });
      } finally {
        setIsLoading(false);
      }
    };

    if (isEditMode) {
      fetchPostData();
    }
  }, [postId, fetchPostById, isEditMode, enqueueSnackbar]);

  // 카테고리 변경 핸들러
  const handleCategoryChange = (e: SelectChangeEvent<string>) => {
    const category = e.target.value;
    setFormData(prev => ({
      ...prev,
      category,
      subTags: [], // 카테고리가 변경되면 서브태그 초기화
    }));
    console.log(`카테고리 변경: ${category} (${getCategoryLabels(t)[category]})`);
  };

  // 일반 입력 필드 핸들러
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value,
    }));

    // 에러 초기화
    if (name in errors) {
      setErrors(prev => ({
        ...prev,
        [name]: '',
      }));
    }
  };

  // 소분류 태그 변경 핸들러
  const handleSubTagChange = (event: SelectChangeEvent<string[]>) => {
    const { value } = event.target;
    setFormData(prev => ({
      ...prev,
      subTags: typeof value === 'string' ? value.split(',') : value,
    }));
  };

  // 파일 선택 핸들러
  const handleFileSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.files) {
      // 수정 모드에서 기존 파일이 있고 새 파일을 선택하는 경우 경고
      if (isEditMode && postFiles.length > 0) {
        const confirmMessage = `⚠️ 경고: 새 파일을 추가하면 기존 첨부파일 ${postFiles.length}개가 모두 삭제됩니다.\n\n정말로 계속하시겠습니까?\n\n기존 파일을 유지하려면 '취소'를 선택하세요.`;

        if (!window.confirm(confirmMessage)) {
          // 파일 입력 초기화
          if (event.target) {
            event.target.value = '';
          }
          return;
        }
      }

      setSelectedFiles(prev => [...prev, ...Array.from(event.target.files || [])]);
    }
  };

  // 선택한 파일 제거 핸들러
  const handleFileRemove = (fileIndex: number) => {
    setSelectedFiles(prev => prev.filter((_, index) => index !== fileIndex));
  };

  // 파일 업로드 박스 클릭 핸들러
  const handleUploadBoxClick = () => {
    fileInputRef.current?.click();
  };

  // 기존 파일 제거 핸들러
  const handleExistingFileRemove = (fileId: number) => {
    const file = postFiles.find(f => f.id === fileId);
    const fileName = file?.fileName || '파일';

    if (
      window.confirm(
        `"${fileName}"을(를) 삭제하시겠습니까?\n\n⚠️ 주의: 게시글 저장 시 이 파일이 영구적으로 삭제됩니다.`
      )
    ) {
      setPostFiles(prev => prev.filter(file => file.id !== fileId));
      setRemovedFileIds(prev => [...prev, fileId]);
    }
  };

  // 게시글 타입 변경 핸들러 (자유/모임)
  const handlePostTypeChange = (e: SelectChangeEvent<string>) => {
    const newPostType = e.target.value;
    setFormData(prev => ({
      ...prev,
      postType: newPostType,
      // 자유 게시글이면 address를 '자유'로 설정
      address: newPostType === '자유' ? '자유' : prev.address,
    }));
  };

  // 지역 변경 핸들러 - RegionSelector 컴포넌트로 대체
  const handleRegionChange = useCallback(
    (city: string | null, district: string | null, neighborhood: string | null) => {
      const region = [city, district, neighborhood].filter(Boolean).join(' ');
      setFormData(prev => {
        if (prev.address === region) return prev;
        return { ...prev, address: region };
      });
      setSelectedSubRegion('');
    },
    [setFormData, setSelectedSubRegion]
  );

  // 폼 제출 핸들러
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // 폼 유효성 검사
    const newErrors: Record<string, string> = {};
    if (!formData.title.trim()) {
      newErrors.title = t('community.posts.form.validation.titleRequired');
    }
    if (!formData.content.trim()) {
      newErrors.content = t('community.posts.form.validation.contentRequired');
    }
    if (!formData.category) {
      newErrors.category = t('community.posts.form.validation.categoryRequired');
    }
    if (!formData.subTags) {
      newErrors.subTags = t('community.posts.form.validation.subTagsRequired');
    }
    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    try {
      setIsSaving(true);

      // 언어 감지 - 제목과 본문을 분리하여 더 정확한 언어 감지
      const detectedLanguage = await detectPostLanguage(formData.title, formData.content);

      console.log('🌍 개선된 언어 감지 결과:', {
        currentUILanguage: currentLanguage,
        title: formData.title.substring(0, 50) + (formData.title.length > 50 ? '...' : ''),
        content: formData.content.substring(0, 50) + (formData.content.length > 50 ? '...' : ''),
        detectedLanguage,
        detectedLanguageUpperCase: detectedLanguage.toUpperCase(),
        titleLength: formData.title.length,
        contentLength: formData.content.length,
        isUILanguageSameAsDetected: currentLanguage === detectedLanguage,
        note: '⚡ 백엔드에서 제목과 내용을 각각 분리하여 번역합니다'
      });

      // 폼 데이터 준비 - API 형식에 맞게 변환
      const basePostData = {
        title: formData.title,
        content: formData.content,
        category: formData.category,
        postType: formData.postType,
        address: formData.address,
        isAnonymous: false, // 항상 false로 설정
        language: detectedLanguage.toUpperCase(), // 감지된 언어를 대문자로 변환
        emotion: 'NONE', // 기본값
      };

      // 수정 모드가 아닐 때만 태그 정보 추가 (원본 한국어 태그로 변환)
      const postData = isEditMode
        ? basePostData
        : {
            ...basePostData,
            tags: convertTranslatedTagsToOriginal(formData.subTags, formData.category || '', t),
          };

      console.log('태그 변환 결과:', {
        원본번역된태그: formData.subTags,
        변환된한국어태그: isEditMode
          ? '수정모드-태그변환안함'
          : convertTranslatedTagsToOriginal(formData.subTags, formData.category || '', t),
        카테고리: formData.category,
      });

      console.log('서버로 전송할 최종 데이터:', {
        ...postData,
        content: postData.content.substring(0, 100) + '...',
        tagsCount: 'tags' in postData && postData.tags ? postData.tags.length : 0,
      });

      // 게시글 생성 또는 수정
      if (isEditMode && postId) {
        // 수정 모드에서 새 파일이 있는 경우 최종 확인
        if (selectedFiles.length > 0) {
          const confirmMessage = `📝 최종 확인\n\n새로 선택한 파일: ${selectedFiles.length}개\n기존 첨부파일: ${postFiles.length}개\n\n⚠️ 저장하면 기존 첨부파일이 모두 삭제되고 새 파일만 남습니다.\n\n정말로 저장하시겠습니까?`;

          if (!window.confirm(confirmMessage)) {
            setIsSaving(false);
            return;
          }
        }

        await updatePost(Number(postId), postData, selectedFiles, removedFileIds);
        enqueueSnackbar(t('community.posts.saveSuccess'), { variant: 'success' });

        // 수정된 게시글로 바로 이동
        navigate(`/community/${postId}`);
      } else {
        try {
          // 게시글 생성 시도
          const result = await createPost(postData, selectedFiles);
          enqueueSnackbar(t('community.posts.saveSuccess'), { variant: 'success' });

          // 생성 결과 확인
          console.log('게시글 생성 결과:', result);

          // eum-frontend와 동일한 방식: 약간의 지연 후 전체 페이지 새로고침
          // 이렇게 하면 서버에서 데이터가 완전히 처리될 시간을 확보하고 최신 게시글이 바로 표시됨
          setTimeout(() => {
            // 새 게시글 생성됨을 localStorage에 기록 (목록 페이지에서 강제 새로고침용)
            localStorage.setItem('newPostCreated', Date.now().toString());
            localStorage.setItem('newPostType', postData.postType);

            // eum-frontend와 완전히 동일: window.location.href 사용
            if (postData.postType === '모임') {
              window.location.href = '/community/groups';
            } else {
              window.location.href = '/community/board';
            }
          }, 500); // eum-frontend와 동일한 500ms
        } catch (error) {
          console.error('게시글 생성 오류:', error);
          enqueueSnackbar(t('community.posts.saveFailed'), { variant: 'error' });
          // 에러 발생 시에도 목록 페이지로 이동
          setTimeout(() => {
            window.location.href = '/community';
          }, 1000);
        }
      }
    } catch (error) {
      console.error('게시글 저장 오류:', error);
      enqueueSnackbar(t('community.posts.saveFailed'), { variant: 'error' });
    } finally {
      setIsSaving(false);
    }
  };

  // 취소 버튼 핸들러
  const handleCancel = () => {
    if (window.confirm(t('community.posts.cancelPost'))) {
      resetRegion();
      navigate('/community');
    }
  };

  // 로딩 중일 때 로딩 표시
  if (isLoading) {
    return (
      <Container maxWidth="md" sx={{ py: 4 }}>
        <Box sx={{ display: 'flex', justifyContent: 'center', py: 8 }}>
          <CircularProgress sx={{ color: 'rgba(255, 107, 107, 0.7)' }} />
        </Box>
      </Container>
    );
  }

  return (
    <Container maxWidth="md" sx={{ py: 4 }}>
      {/* 뒤로 가기 버튼 */}
      <Box sx={{ mb: 2 }}>
        <Button
          startIcon={<ArrowBackIcon />}
          onClick={() => navigate('/community')}
          sx={{
            color: '#666',
            '&:hover': {
              backgroundColor: 'rgba(255, 240, 240, 0.2)',
            },
          }}
        >
          {t('common.backToList')}
        </Button>
      </Box>

      <ContentPaper elevation={3}>
        <PageTitle variant="h5">
          {isEditMode ? t('community.editPost') : t('community.createPost')}
        </PageTitle>

        <form onSubmit={handleSubmit}>
          <FormBox>
            {/* 제목 입력 필드 */}
            <TextField
              label={t('community.posts.form.title')}
              placeholder={t('community.posts.form.titlePlaceholder')}
              variant="outlined"
              fullWidth
              name="title"
              value={formData.title}
              onChange={handleInputChange}
              error={!!errors.title}
              helperText={errors.title}
              sx={{
                backgroundColor: '#fff',
                '& .MuiOutlinedInput-root': {
                  borderRadius: '12px',
                  '& fieldset': {
                    borderColor: '#bdbdbd',
                  },
                  '&:hover fieldset': {
                    borderColor: '#757575',
                  },
                  '&.Mui-focused fieldset': {
                    borderColor: '#333',
                  },
                },
              }}
            />

            {/* 게시글 타입 선택 (자유/모임) - 수정 모드에서는 비활성화 */}
            <FormControl sx={{ minWidth: 200, backgroundColor: '#fff', borderRadius: '12px' }}>
              <InputLabel id="post-type-label">{t('community.posts.form.postType')}</InputLabel>
              <Select
                labelId="post-type-label"
                id="post-type"
                value={formData.postType}
                onChange={handlePostTypeChange}
                label={t('community.posts.form.postType')}
                disabled={isEditMode}
                sx={{
                  backgroundColor: '#fff',
                  borderRadius: '12px',
                  '& .MuiOutlinedInput-notchedOutline': {
                    borderColor: '#bdbdbd',
                  },
                  '&:hover .MuiOutlinedInput-notchedOutline': {
                    borderColor: '#757575',
                  },
                  '&.Mui-focused .MuiOutlinedInput-notchedOutline': {
                    borderColor: '#333',
                  },
                }}
              >
                {getPostTypes(t).map(type => (
                  <MenuItem key={type.key} value={type.key}>
                    {type.label}
                  </MenuItem>
                ))}
              </Select>
              <FormHelperText>
                {isEditMode
                  ? t('community.postTypeCannotModify')
                  : t('community.chooseFreeOrGroupPost')}
              </FormHelperText>
            </FormControl>

            {/* 게시글 타입이 '모임'일 때만 지역 선택 표시 */}
            {formData.postType === '모임' && (
              <FormControl fullWidth sx={{ mt: 2, backgroundColor: '#fff', borderRadius: '12px' }}>
                <InputLabel>지역</InputLabel>
                <RegionSelector onChange={handleRegionChange} />
                <FormHelperText>모임이 진행될 지역을 선택하세요</FormHelperText>
              </FormControl>
            )}

            {/* 카테고리 선택 - 수정 모드에서는 비활성화 */}
            <FormControl
              fullWidth
              variant="outlined"
              margin="normal"
              sx={{ backgroundColor: '#fff', borderRadius: '12px' }}
            >
              <InputLabel id="category-label">{t('community.posts.form.category')}</InputLabel>
              <Select
                labelId="category-label"
                id="category"
                name="category"
                value={formData.category || ''}
                onChange={handleCategoryChange}
                label={t('community.posts.form.category')}
                required
                disabled={isEditMode}
                sx={{
                  backgroundColor: '#fff',
                  borderRadius: '12px',
                  '& .MuiOutlinedInput-notchedOutline': {
                    borderColor: '#bdbdbd',
                  },
                  '&:hover .MuiOutlinedInput-notchedOutline': {
                    borderColor: '#757575',
                  },
                  '&.Mui-focused .MuiOutlinedInput-notchedOutline': {
                    borderColor: '#333',
                  },
                }}
              >
                {categories.map(category => (
                  <MenuItem key={category} value={category}>
                    {getCategoryLabels(t)[category]}
                  </MenuItem>
                ))}
              </Select>
              <FormHelperText>
                {isEditMode
                  ? t('community.categoryCannotModify')
                  : t('community.choosePostSubjectCategory')}
              </FormHelperText>
            </FormControl>

            {/* 소분류(태그) 선택 - 수정 모드에서는 비활성화 */}
            {formData.category && !isEditMode && (
              <FormControl
                fullWidth
                variant="outlined"
                margin="normal"
                sx={{ backgroundColor: '#fff', borderRadius: '12px' }}
              >
                <InputLabel id="subtags-label">{t('community.posts.form.tags')}</InputLabel>
                <Select
                  labelId="subtags-label"
                  id="subtags"
                  multiple
                  value={formData.subTags}
                  onChange={handleSubTagChange}
                  input={
                    <OutlinedInput
                      id="select-multiple-chip"
                      label={t('community.posts.form.tags')}
                    />
                  }
                  renderValue={selected => (
                    <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5 }}>
                      {(selected as string[]).map(value => (
                        <Chip
                          key={value}
                          label={value}
                          sx={{
                            bgcolor: 'rgba(255, 170, 165, 0.2)',
                            borderColor: 'rgba(255, 107, 107, 0.3)',
                            border: '1px solid',
                            color: '#7b1fa2',
                            fontWeight: 'medium',
                          }}
                        />
                      ))}
                    </Box>
                  )}
                  MenuProps={MenuProps}
                  sx={{
                    backgroundColor: '#fff',
                    borderRadius: '12px',
                    '& .MuiOutlinedInput-notchedOutline': {
                      borderColor: '#bdbdbd',
                    },
                    '&:hover .MuiOutlinedInput-notchedOutline': {
                      borderColor: '#757575',
                    },
                    '&.Mui-focused .MuiOutlinedInput-notchedOutline': {
                      borderColor: '#333',
                    },
                  }}
                >
                  {formData.category &&
                    getSubTagsByCategory(t)[formData.category]?.map(tag => (
                      <MenuItem
                        key={tag}
                        value={tag}
                        style={getTagStyles(tag, formData.subTags, theme)}
                      >
                        <Checkbox checked={formData.subTags.indexOf(tag) > -1} />
                        <ListItemText primary={tag} />
                      </MenuItem>
                    ))}
                </Select>
                <FormHelperText>{t('community.chooseRelatedSubTags')} (최대 3개)</FormHelperText>
              </FormControl>
            )}

            {/* 수정 모드에서 태그 안내 메시지 */}
            {isEditMode && (
              <Box
                sx={{
                  p: 2,
                  bgcolor: 'rgba(255, 193, 7, 0.1)',
                  borderRadius: '8px',
                  border: '1px solid rgba(255, 193, 7, 0.3)',
                  mb: 2,
                }}
              >
                <Typography variant="body2" color="text.secondary">
                  {t('community.editPostNote')}
                </Typography>
              </Box>
            )}

            {/* 파일 업로드 안내 메시지 - 수정 모드 전용 */}
            {isEditMode && (
              <Box
                sx={{
                  p: 2,
                  bgcolor: 'rgba(244, 67, 54, 0.1)',
                  borderRadius: '8px',
                  border: '1px solid rgba(244, 67, 54, 0.3)',
                  mb: 2,
                }}
              ></Box>
            )}

            {/* 내용 입력 필드 */}
            <TextField
              label={t('community.posts.form.content')}
              placeholder={t('community.posts.form.contentPlaceholder')}
              variant="outlined"
              multiline
              rows={8}
              fullWidth
              name="content"
              value={formData.content}
              onChange={handleInputChange}
              error={!!errors.content}
              helperText={errors.content}
              sx={{
                backgroundColor: '#fff',
                '& .MuiOutlinedInput-root': {
                  borderRadius: '12px',
                  '& fieldset': {
                    borderColor: '#bdbdbd',
                  },
                  '&:hover fieldset': {
                    borderColor: '#757575',
                  },
                  '&.Mui-focused fieldset': {
                    borderColor: '#333',
                  },
                },
              }}
            />

            {/* 파일 업로드 영역 */}
            <Box>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 1 }}>
                <Typography variant="subtitle1">{t('community.fileUpload.fileUpload')}</Typography>
                {!isEditMode && (
                  <Typography
                    variant="caption"
                    color="text.secondary"
                    sx={{
                      bgcolor: 'rgba(33, 150, 243, 0.1)',
                      px: 1,
                      py: 0.5,
                      borderRadius: 1,
                      border: '1px solid rgba(33, 150, 243, 0.2)',
                    }}
                  >
                    {t('community.fileUpload.imageHint')}
                  </Typography>
                )}
                {isEditMode && (
                  <Typography
                    variant="caption"
                    color="error"
                    sx={{
                      bgcolor: 'rgba(244, 67, 54, 0.1)',
                      px: 1,
                      py: 0.5,
                      borderRadius: 1,
                      border: '1px solid rgba(244, 67, 54, 0.3)',
                      fontWeight: 500,
                    }}
                  >
                    {t('community.fileUpload.editModeWarning')}
                  </Typography>
                )}
              </Box>

              <FileUploadBox onClick={handleUploadBoxClick} sx={{ backgroundColor: '#fff' }}>
                <CloudUploadIcon sx={{ fontSize: 40, color: 'rgba(255, 107, 107, 0.7)', mb: 1 }} />
                <Typography variant="body1" gutterBottom sx={{ fontWeight: 500 }}>
                  {isEditMode
                    ? t('community.fileUpload.editModeDragOrClick')
                    : t('community.fileUpload.dragOrClick')}
                </Typography>
                <Typography variant="caption" color="text.secondary" sx={{ textAlign: 'center' }}>
                  {isEditMode
                    ? t('community.fileUpload.editModeHint')
                    : t('community.fileUpload.imageHint2')}
                </Typography>
                <VisuallyHiddenInput
                  type="file"
                  ref={fileInputRef}
                  onChange={handleFileSelect}
                  multiple
                />
              </FileUploadBox>

              {/* 선택된 파일 목록 */}
              {selectedFiles.length > 0 && (
                <Box sx={{ mt: 2 }}>
                  <Typography variant="subtitle2" gutterBottom sx={{ mb: 2 }}>
                    {t('community.selectedFiles')} ({selectedFiles.length})
                  </Typography>

                  {/* 선택된 파일을 이미지와 일반 파일로 분리 */}
                  {(() => {
                    const imageFiles = selectedFiles.filter(file => {
                      return /\.(jpg|jpeg|png|gif|webp|bmp|svg)$/i.test(file.name);
                    });

                    const nonImageFiles = selectedFiles.filter(file => {
                      return !/\.(jpg|jpeg|png|gif|webp|bmp|svg)$/i.test(file.name);
                    });

                    return (
                      <>
                        {/* 새 이미지 미리보기 */}
                        {imageFiles.length > 0 && (
                          <Box mb={nonImageFiles.length > 0 ? 3 : 2}>
                            <Typography variant="body2" color="text.secondary" sx={{ mb: 1.5 }}>
                              {t('community.fileUpload.newImage', {
                                count: imageFiles.length.toString(),
                              })}
                            </Typography>
                            <Box
                              sx={{
                                display: 'grid',
                                gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))',
                                gap: 2,
                                maxHeight: '300px',
                                overflowY: 'auto',
                              }}
                            >
                              {imageFiles.map((file, index) => {
                                const originalIndex = selectedFiles.indexOf(file);
                                const imageUrl = URL.createObjectURL(file);

                                return (
                                  <Box
                                    key={index}
                                    sx={{
                                      position: 'relative',
                                      borderRadius: 2,
                                      overflow: 'hidden',
                                      boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
                                      transition: 'all 0.3s ease',
                                      border: '2px solid #e3f2fd',
                                      '&:hover': {
                                        transform: 'translateY(-2px)',
                                        boxShadow: '0 4px 12px rgba(0,0,0,0.15)',
                                        borderColor: '#2196f3',
                                      },
                                    }}
                                  >
                                    <img
                                      src={imageUrl}
                                      alt={file.name}
                                      style={{
                                        width: '100%',
                                        height: '120px',
                                        objectFit: 'cover',
                                        display: 'block',
                                      }}
                                      onLoad={() => {
                                        // 메모리 누수 방지를 위해 URL 해제를 지연
                                        setTimeout(() => URL.revokeObjectURL(imageUrl), 1000);
                                      }}
                                    />

                                    {/* 이미지 정보 오버레이 */}
                                    <Box
                                      sx={{
                                        position: 'absolute',
                                        bottom: 0,
                                        left: 0,
                                        right: 0,
                                        background: 'linear-gradient(transparent, rgba(0,0,0,0.7))',
                                        color: 'white',
                                        p: 1,
                                        fontSize: '0.75rem',
                                      }}
                                    >
                                      <Typography
                                        variant="caption"
                                        sx={{ fontWeight: 500, display: 'block' }}
                                      >
                                        {file.name.length > 20
                                          ? file.name.substring(0, 20) + '...'
                                          : file.name}
                                      </Typography>
                                      <Typography variant="caption" sx={{ opacity: 0.8 }}>
                                        {(file.size / 1024).toFixed(1)} KB
                                      </Typography>
                                    </Box>

                                    {/* 삭제 버튼 */}
                                    <Box
                                      sx={{
                                        position: 'absolute',
                                        top: 4,
                                        right: 4,
                                        zIndex: 10,
                                      }}
                                    >
                                      <IconButton
                                        size="small"
                                        onClick={() => handleFileRemove(originalIndex)}
                                        sx={{
                                          backgroundColor: 'rgba(244, 67, 54, 0.8)',
                                          color: 'white',
                                          width: 24,
                                          height: 24,
                                          '&:hover': {
                                            backgroundColor: 'rgba(244, 67, 54, 0.9)',
                                          },
                                        }}
                                      >
                                        <DeleteIcon sx={{ fontSize: 14 }} />
                                      </IconButton>
                                    </Box>

                                    {/* 새 파일 뱃지 */}
                                    <Box
                                      sx={{
                                        position: 'absolute',
                                        top: 4,
                                        left: 4,
                                        backgroundColor: 'rgba(76, 175, 80, 0.9)',
                                        color: 'white',
                                        px: 1,
                                        py: 0.5,
                                        borderRadius: 1,
                                        fontSize: '0.7rem',
                                        fontWeight: 600,
                                      }}
                                    >
                                      NEW
                                    </Box>
                                  </Box>
                                );
                              })}
                            </Box>
                          </Box>
                        )}

                        {/* 새 일반 파일 목록 */}
                        {nonImageFiles.length > 0 && (
                          <Box>
                            <Typography variant="body2" color="text.secondary" sx={{ mb: 1.5 }}>
                              {t('community.fileUpload.newFile', {
                                count: nonImageFiles.length.toString(),
                              })}
                            </Typography>
                            <List disablePadding sx={{ bgcolor: '#e8f5e8', borderRadius: 2, p: 1 }}>
                              {nonImageFiles.map((file, index) => {
                                const originalIndex = selectedFiles.indexOf(file);

                                return (
                                  <ListItem
                                    key={index}
                                    secondaryAction={
                                      <IconButton
                                        edge="end"
                                        onClick={() => handleFileRemove(originalIndex)}
                                        sx={{
                                          color: 'rgba(244, 67, 54, 0.7)',
                                          '&:hover': {
                                            color: 'rgba(244, 67, 54, 0.9)',
                                            backgroundColor: 'rgba(244, 67, 54, 0.1)',
                                          },
                                        }}
                                      >
                                        <DeleteIcon />
                                      </IconButton>
                                    }
                                    sx={{
                                      bgcolor: 'white',
                                      borderRadius: '8px',
                                      mb: 1,
                                      '&:last-child': { mb: 0 },
                                      border: '1px solid #c8e6c9',
                                      '&:hover': {
                                        borderColor: '#4caf50',
                                        backgroundColor: '#f9f9f9',
                                      },
                                      transition: 'all 0.2s ease',
                                    }}
                                  >
                                    <ListItemIcon>
                                      <InsertDriveFileIcon
                                        sx={{ color: 'rgba(76, 175, 80, 0.8)' }}
                                      />
                                    </ListItemIcon>
                                    <ListItemText
                                      primary={
                                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                                          <span style={{ fontWeight: 500 }}>{file.name}</span>
                                          <Box
                                            component="span"
                                            sx={{
                                              backgroundColor: 'rgba(76, 175, 80, 0.9)',
                                              color: 'white',
                                              px: 1,
                                              py: 0.2,
                                              borderRadius: 0.5,
                                              fontSize: '0.7rem',
                                              fontWeight: 600,
                                            }}
                                          >
                                            NEW
                                          </Box>
                                        </Box>
                                      }
                                      secondary={`${(file.size / 1024).toFixed(2)} KB`}
                                    />
                                  </ListItem>
                                );
                              })}
                            </List>
                          </Box>
                        )}
                      </>
                    );
                  })()}
                </Box>
              )}

              {/* 편집 모드에서 기존 파일 표시 */}
              {isEditMode && postFiles.length > 0 && (
                <Box sx={{ mt: 2 }}>
                  <Typography variant="subtitle2" gutterBottom sx={{ mb: 2 }}>
                    {t('community.existingAttachedFiles')}
                  </Typography>

                  {/* 이미지 파일과 일반 파일 분리 */}
                  {(() => {
                    const imageFiles = postFiles.filter(file => {
                      const fileName = file.fileName || '';
                      return /\.(jpg|jpeg|png|gif|webp|bmp|svg)$/i.test(fileName);
                    });

                    const nonImageFiles = postFiles.filter(file => {
                      const fileName = file.fileName || '';
                      return !/\.(jpg|jpeg|png|gif|webp|bmp|svg)$/i.test(fileName);
                    });

                    return (
                      <>
                        {/* 기존 이미지 갤러리 */}
                        {imageFiles.length > 0 && (
                          <Box mb={nonImageFiles.length > 0 ? 3 : 2}>
                            <Typography variant="body2" color="text.secondary" sx={{ mb: 1.5 }}>
                              {t('community.fileUpload.existingImage', {
                                count: imageFiles.length.toString(),
                              })}
                            </Typography>
                            <Box
                              sx={{
                                display: 'grid',
                                gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))',
                                gap: 2,
                                maxHeight: '300px',
                                overflowY: 'auto',
                              }}
                            >
                              {imageFiles.map((file, index) => (
                                <Box
                                  key={index}
                                  sx={{
                                    position: 'relative',
                                    borderRadius: 2,
                                    overflow: 'hidden',
                                    boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
                                    transition: 'all 0.3s ease',
                                    border: '2px solid #f0f0f0',
                                    '&:hover': {
                                      transform: 'translateY(-2px)',
                                      boxShadow: '0 4px 12px rgba(0,0,0,0.15)',
                                      borderColor: '#ff9999',
                                    },
                                  }}
                                >
                                  <img
                                    src={file.fileUrl}
                                    alt={file.fileName}
                                    style={{
                                      width: '100%',
                                      height: '120px',
                                      objectFit: 'cover',
                                      display: 'block',
                                    }}
                                    onError={e => {
                                      e.currentTarget.style.display = 'none';
                                      const parent = e.currentTarget.parentElement;
                                      if (parent) {
                                        parent.innerHTML = `
                                            <div style="
                                              width: 100%;
                                              height: 120px;
                                              background: #f5f5f5;
                                              display: flex;
                                              flex-direction: column;
                                              align-items: center;
                                              justify-content: center;
                                              color: #999;
                                            ">
                                              <svg width="24" height="24" fill="currentColor" viewBox="0 0 24 24">
                                                <path d="M21 19V5c0-1.1-.9-2-2-2H5c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2v-7h-2v7zM14 3v2h3.59l-9.83 9.83 1.41 1.41L19 6.41V10h2V3h-7z"/>
                                              </svg>
                                              <span style="margin-top: 4px; font-size: 10px;">이미지 로드 실패</span>
                                            </div>
                                          `;
                                      }
                                    }}
                                  />

                                  {/* 이미지 정보 오버레이 */}
                                  <Box
                                    sx={{
                                      position: 'absolute',
                                      bottom: 0,
                                      left: 0,
                                      right: 0,
                                      background: 'linear-gradient(transparent, rgba(0,0,0,0.7))',
                                      color: 'white',
                                      p: 1,
                                      fontSize: '0.75rem',
                                    }}
                                  >
                                    <Typography
                                      variant="caption"
                                      sx={{ fontWeight: 500, display: 'block' }}
                                    >
                                      {file.fileName.length > 20
                                        ? file.fileName.substring(0, 20) + '...'
                                        : file.fileName}
                                    </Typography>
                                  </Box>

                                  {/* 삭제 버튼 */}
                                  <Box
                                    sx={{
                                      position: 'absolute',
                                      top: 4,
                                      right: 4,
                                      zIndex: 10,
                                    }}
                                  >
                                    <IconButton
                                      size="small"
                                      onClick={() => handleExistingFileRemove(file.id)}
                                      sx={{
                                        backgroundColor: 'rgba(244, 67, 54, 0.8)',
                                        color: 'white',
                                        width: 24,
                                        height: 24,
                                        '&:hover': {
                                          backgroundColor: 'rgba(244, 67, 54, 0.9)',
                                        },
                                      }}
                                    >
                                      <DeleteIcon sx={{ fontSize: 14 }} />
                                    </IconButton>
                                  </Box>

                                  {/* 새 탭에서 열기 버튼 */}
                                  <Box
                                    sx={{
                                      position: 'absolute',
                                      top: 4,
                                      left: 4,
                                      zIndex: 10,
                                    }}
                                  >
                                    <IconButton
                                      size="small"
                                      onClick={() => window.open(file.fileUrl, '_blank')}
                                      sx={{
                                        backgroundColor: 'rgba(33, 150, 243, 0.8)',
                                        color: 'white',
                                        width: 24,
                                        height: 24,
                                        '&:hover': {
                                          backgroundColor: 'rgba(33, 150, 243, 0.9)',
                                        },
                                      }}
                                    >
                                      <svg
                                        width="12"
                                        height="12"
                                        fill="currentColor"
                                        viewBox="0 0 24 24"
                                      >
                                        <path d="M19 19H5V5h7V3H5c-1.11 0-2 .9-2 2v14c0 1.1.89 2 2 2h14c1.1 0 2-.9 2-2v-7h-2v7zM14 3v2h3.59l-9.83 9.83 1.41 1.41L19 6.41V10h2V3h-7z" />
                                      </svg>
                                    </IconButton>
                                  </Box>
                                </Box>
                              ))}
                            </Box>
                          </Box>
                        )}

                        {/* 기존 일반 파일 목록 */}
                        {nonImageFiles.length > 0 && (
                          <Box>
                            <Typography variant="body2" color="text.secondary" sx={{ mb: 1.5 }}>
                              {t('community.fileUpload.existingFile', {
                                count: nonImageFiles.length.toString(),
                              })}
                            </Typography>
                            <List disablePadding sx={{ bgcolor: '#f9f9f9', borderRadius: 2, p: 1 }}>
                              {nonImageFiles.map((file, index) => (
                                <ListItem
                                  key={index}
                                  secondaryAction={
                                    <IconButton
                                      edge="end"
                                      onClick={() => handleExistingFileRemove(file.id)}
                                      sx={{
                                        color: 'rgba(175, 175, 175, 0.9)',
                                        '&:hover': {
                                          color: 'rgba(175, 175, 175, 0.9)',
                                          backgroundColor: 'rgba(175, 175, 175, 0.1)',
                                        },
                                      }}
                                    >
                                      <DeleteIcon />
                                    </IconButton>
                                  }
                                  sx={{
                                    bgcolor: 'white',
                                    borderRadius: '8px',
                                    mb: 1,
                                    '&:last-child': { mb: 0 },
                                    border: '1px solid #e0e0e0',
                                    '&:hover': {
                                      borderColor: '#ff9999',
                                      backgroundColor: '#fafafa',
                                    },
                                    transition: 'all 0.2s ease',
                                  }}
                                >
                                  <ListItemIcon>
                                    <InsertDriveFileIcon
                                      sx={{ color: 'rgba(171, 171, 171, 0.7)' }}
                                    />
                                  </ListItemIcon>
                                  <ListItemText
                                    primary={
                                      <Box
                                        component="a"
                                        href={file.fileUrl}
                                        target="_blank"
                                        sx={{
                                          textDecoration: 'none',
                                          color: 'rgba(171, 171, 171, 0.8)',
                                          fontWeight: 500,
                                          '&:hover': {
                                            color: 'rgba(171, 171, 171, 1)',
                                            textDecoration: 'underline',
                                          },
                                        }}
                                      >
                                        {file.fileName}
                                      </Box>
                                    }
                                  />
                                </ListItem>
                              ))}
                            </List>
                          </Box>
                        )}
                      </>
                    );
                  })()}
                </Box>
              )}
            </Box>

            {/* 제출 및 취소 버튼 */}
            <Box sx={{ display: 'flex', gap: 2, justifyContent: 'flex-end', mt: 2 }}>
              <Button
                onClick={handleCancel}
                sx={{
                  backgroundColor: '#e0e0e0',
                  color: '#333',
                  borderRadius: '8px',
                  fontWeight: 'bold',
                  padding: '10px 20px',
                  boxShadow: '0 2px 6px rgba(60,60,60,0.08)',
                  transition: 'all 0.2s',
                  height: 44,
                  '&:hover': {
                    backgroundColor: '#bdbdbd',
                  },
                  '&:focus': {
                    outline: '2px solid #757575',
                  },
                }}
              >
                {t('common.cancel')}
              </Button>
              <Button
                type="submit"
                disabled={isSaving}
                startIcon={isSaving ? <CircularProgress size={20} sx={{ color: '#333' }} /> : null}
                sx={{
                  backgroundColor: '#bdbdbd',
                  color: '#222',
                  borderRadius: '8px',
                  fontWeight: 'bold',
                  padding: '10px 20px',
                  boxShadow: '0 2px 6px rgba(60,60,60,0.08)',
                  transition: 'all 0.2s',
                  height: 44,
                  '&:hover': {
                    backgroundColor: '#757575',
                    color: '#fff',
                  },
                  '&:focus': {
                    outline: '2px solid #757575',
                  },
                }}
              >
                {isSaving
                  ? t('common.saving')
                  : isEditMode
                    ? t('community.edit')
                    : t('community.create')}
              </Button>
            </Box>
          </FormBox>
        </form>
      </ContentPaper>
    </Container>
  );
};

export default PostCreateEditPage;
