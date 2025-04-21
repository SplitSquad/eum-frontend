import React, { useState, useEffect, useRef } from 'react';
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

// 스프링 배경 컴포넌트 임포트
import SpringBackground from '../components/shared/SpringBackground';

// 게시글 작성/수정 페이지 스타일 컴포넌트
const ContentPaper = styled(Paper)(({ theme }) => ({
  padding: theme.spacing(3),
  marginTop: theme.spacing(3),
  position: 'relative',
  zIndex: 1,
  borderRadius: '16px',
  boxShadow: '0 8px 16px rgba(0,0,0,0.1)',
  border: '1px solid rgba(255, 170, 165, 0.5)',
  background: 'rgba(255, 255, 255, 0.9)',
  backdropFilter: 'blur(8px)',
}));

const FormBox = styled(Box)(({ theme }) => ({
  display: 'flex',
  flexDirection: 'column',
  gap: theme.spacing(3),
  marginTop: theme.spacing(2),
}));

const StyledButton = styled(Button)(({ theme }) => ({
  marginTop: theme.spacing(2),
  backgroundColor: 'rgba(255, 170, 165, 0.8)',
  color: '#7b1fa2',
  '&:hover': {
    backgroundColor: 'rgba(255, 107, 107, 0.7)',
  },
  borderRadius: '8px',
  padding: '10px 20px',
  fontWeight: 'bold',
  boxShadow: '0 4px 8px rgba(255, 170, 165, 0.3)',
  transition: 'all 0.3s ease',
}));

const PageTitle = styled(Typography)(({ theme }) => ({
  color: '#7b1fa2',
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
    background: 'linear-gradient(90deg, rgba(255, 170, 165, 0.8), rgba(206, 147, 216, 0.8))',
    borderRadius: '10px',
  },
}));

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
function getTagStyles(tagName: string, selectedTags: string[], theme: Theme) {
  return {
    fontWeight:
      selectedTags.indexOf(tagName) === -1
        ? theme.typography.fontWeightRegular
        : theme.typography.fontWeightMedium,
    color: selectedTags.indexOf(tagName) === -1 ? 'inherit' : '#7b1fa2',
  };
}

// 카테고리 및 태그 데이터 (실제로는 API에서 가져올 것)
const categories = ['모임', '자유'];

// 태그 대분류
const mainTags = ['여행', '주거', '유학', '취업'];

// 태그 소분류
const subTagsByMainTag = {
  여행: ['관광/체험', '식도락/맛집', '교통/이동', '숙소/지역정보', '대사관/응급'],
  주거: ['부동산/계약', '생활환경/편의', '문화/생활', '주거지 관리/유지', 'travel'],
  유학: ['학사/캠퍼스', '학업지원/시설', '행정/비자/서류', '기숙사/주거'],
  취업: ['이력/채용준비', '비자/법률/노동', '잡페어/네트워킹', '알바/파트타임'],
};

// 인터페이스 정의
interface PostFormData {
  title: string;
  content: string;
  category: string;
  mainTag: string;
  subTags: string[];
  isAnonymous: boolean;
}

// 파일 업로드 관련 스타일 컴포넌트
const FileUploadBox = styled(Box)(({ theme }) => ({
  border: '2px dashed rgba(255, 170, 165, 0.5)',
  borderRadius: '8px',
  padding: theme.spacing(2),
  textAlign: 'center',
  backgroundColor: 'rgba(255, 255, 255, 0.6)',
  cursor: 'pointer',
  transition: 'all 0.3s ease',
  marginTop: theme.spacing(2),
  '&:hover': {
    backgroundColor: 'rgba(255, 235, 235, 0.8)',
    borderColor: 'rgba(255, 107, 107, 0.5)',
  },
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

const PostCreateEditPage: React.FC = () => {
  const navigate = useNavigate();
  const { postId } = useParams<{ postId: string }>();
  const theme = useTheme();
  const isEditMode = !!postId;
  const { enqueueSnackbar } = useSnackbar();

  // 커뮤니티 스토어에서 필요한 상태와 액션 가져오기
  const communityStore = useCommunityStore();
  const { createPost, updatePost, fetchPostById } = communityStore;
  const storePostLoading = communityStore.postLoading;
  const storePostError = communityStore.postError;

  const [formData, setFormData] = useState<PostFormData>({
    title: '',
    content: '',
    category: '자유',
    mainTag: '',
    subTags: [],
    isAnonymous: false,
  });

  const [errors, setErrors] = useState({
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

  // 편집 모드일 경우 기존 게시글 데이터 불러오기
  useEffect(() => {
    const fetchPostData = async () => {
      if (isEditMode && postId) {
        setIsLoading(true);
        try {
          // fetchPostById 함수는 Post 객체 또는 undefined를 반환하므로 타입 단언을 사용합니다
          const post = (await fetchPostById(parseInt(postId))) as Post | undefined;
          if (post) {
            setFormData({
              title: post.title,
              content: post.content,
              category: post.category,
              // 백엔드 API에서 mainTag와 subTags를 제공하지 않을 수 있으므로 기본값 처리
              mainTag: '', // 실제 데이터가 있을 경우 수정
              subTags: post.tags?.map(tag => tag.name) || [],
              isAnonymous: false, // API에 맞게 수정
            });
          }
        } catch (error) {
          console.error('게시글을 불러오는 중 오류가 발생했습니다:', error);
          enqueueSnackbar('게시글을 불러오는데 실패했습니다.', { variant: 'error' });
        } finally {
          setIsLoading(false);
        }
      }
    };

    fetchPostData();
  }, [isEditMode, postId, fetchPostById, enqueueSnackbar]);

  // 카테고리 변경 시 메인 태그 초기화
  useEffect(() => {
    // 카테고리가 변경되면 태그 초기화
    setFormData(prev => ({ ...prev, mainTag: '', subTags: [] }));
  }, [formData.category]);

  // 메인 태그가 변경될 때 소분류 태그 초기화
  useEffect(() => {
    if (formData.mainTag) {
      setFormData(prev => ({ ...prev, subTags: [] }));
    }
  }, [formData.mainTag]);

  // 입력 필드 변경 핸들러
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));

    // 에러 메시지 지우기
    if (errors[name as keyof typeof errors]) {
      setErrors(prev => ({ ...prev, [name]: '' }));
    }
  };

  // 카테고리 변경 핸들러
  const handleCategoryChange = (e: SelectChangeEvent<string>) => {
    setFormData(prev => ({ ...prev, category: e.target.value }));
  };

  // 메인 태그 변경 핸들러
  const handleMainTagChange = (e: SelectChangeEvent<string>) => {
    setFormData(prev => ({ ...prev, mainTag: e.target.value, subTags: [] }));
  };

  // 서브 태그 변경 핸들러
  const handleSubTagChange = (event: SelectChangeEvent<string[]>) => {
    const { value } = event.target;
    setFormData(prev => ({
      ...prev,
      subTags: typeof value === 'string' ? value.split(',') : value,
    }));
  };

  // 익명 체크박스 변경 핸들러
  const handleAnonymousChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData(prev => ({ ...prev, isAnonymous: e.target.checked }));
  };

  // 파일 선택 핸들러
  const handleFileSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.files) {
      const fileList = Array.from(event.target.files);
      setSelectedFiles(prev => [...prev, ...fileList]);
    }
  };
  
  // 파일 삭제 핸들러
  const handleFileRemove = (fileIndex: number) => {
    setSelectedFiles(prev => prev.filter((_, index) => index !== fileIndex));
  };
  
  // 파일 드롭 영역 클릭 핸들러
  const handleUploadBoxClick = () => {
    fileInputRef.current?.click();
  };

  // 기존 파일 삭제 핸들러
  const handleExistingFileRemove = (fileId: number) => {
    if (!fileId) return;
    
    // 삭제할 파일 ID 목록에 추가
    setRemovedFileIds(prev => [...prev, fileId]);
    
    // UI에서 파일 숨기기 (선택 사항)
    // 여기서는 communityStore의 currentPost를 직접 변경하지 않고
    // UI 상에서만 숨기는 방식을 선택할 수 있습니다
    enqueueSnackbar('파일이 삭제 목록에 추가되었습니다. 저장 시 반영됩니다.', { variant: 'info' });
  };

  // 폼 제출 핸들러
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    console.log('폼 제출 시작:', { ...formData, selectedFiles, removedFileIds });

    // 유효성 검사
    let newErrors = {
      title: '',
      content: '',
    };

    let hasError = false;

    if (!formData.title.trim()) {
      newErrors.title = '제목을 입력해주세요.';
      hasError = true;
    }

    if (!formData.content.trim()) {
      newErrors.content = '내용을 입력해주세요.';
      hasError = true;
    }

    if (hasError) {
      setErrors(newErrors);
      enqueueSnackbar('필수 항목을 입력해주세요.', { variant: 'error' });
      return;
    }

    // 저장 시작
    setIsSaving(true);

    try {
      // 파일 업로드 진행 상태 표시
      setUploadProgress(selectedFiles.length > 0);

      if (isEditMode && postId) {
        // 수정 모드
        const updatePostDto = {
          title: formData.title,
          content: formData.content,
          category: formData.category,
          tags: formData.subTags,
          language: 'KO',
          emotion: 'NONE',
        };

        await updatePost(parseInt(postId), updatePostDto, selectedFiles, removedFileIds);
        enqueueSnackbar('게시글이 성공적으로 수정되었습니다.', { variant: 'success' });
        
        // 수정 후 해당 게시글 상세 페이지로 이동
        navigate(`/community/post/${postId}`);
      } else {
        // 신규 작성 모드
        const createPostDto = {
          title: formData.title,
          content: formData.content,
          category: formData.category,
          tags: formData.subTags,
          language: 'KO',
          emotion: 'NONE',
        };

        await createPost(createPostDto, selectedFiles);
        enqueueSnackbar('게시글이 성공적으로 작성되었습니다.', { variant: 'success' });
        
        // 일단 목록으로 이동 (API가 생성된 게시글 ID를 반환하지 않음)
        navigate('/community');
      }
    } catch (error) {
      console.error('게시글 저장 중 오류가 발생했습니다:', error);
      enqueueSnackbar('게시글 저장에 실패했습니다. 다시 시도해주세요.', { variant: 'error' });
    } finally {
      setIsSaving(false);
      setUploadProgress(false);
    }
  };

  // 취소 버튼 핸들러
  const handleCancel = () => {
    navigate(-1); // 이전 페이지로 이동
  };

  if (isLoading) {
    return (
      <SpringBackground>
        <Container maxWidth="md">
          <Box
            sx={{
              display: 'flex',
              justifyContent: 'center',
              alignItems: 'center',
              minHeight: '60vh',
            }}
          >
            <CircularProgress sx={{ color: '#FF9999' }} />
          </Box>
        </Container>
      </SpringBackground>
    );
  }

  return (
    <SpringBackground>
      <Container maxWidth="md" sx={{ py: 4 }}>
        <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
          <IconButton
            onClick={handleCancel}
            sx={{
              mr: 2,
              color: '#7b1fa2',
              backgroundColor: 'rgba(255, 255, 255, 0.7)',
              '&:hover': {
                backgroundColor: 'rgba(255, 170, 165, 0.2)',
              },
            }}
          >
            <ArrowBackIcon />
          </IconButton>
          <PageTitle variant="h4">
            {isEditMode ? '게시글 수정하기' : '새 게시글 작성하기'}
          </PageTitle>
        </Box>

        <ContentPaper elevation={3}>
          <form onSubmit={handleSubmit}>
            <FormBox>
              {/* 카테고리 선택 */}
              <FormControl fullWidth>
                <InputLabel id="category-label">카테고리</InputLabel>
                <Select
                  labelId="category-label"
                  id="category"
                  name="category"
                  value={formData.category}
                  onChange={handleCategoryChange}
                  label="카테고리"
                  sx={{
                    borderRadius: '12px',
                    '& .MuiOutlinedInput-notchedOutline': {
                      borderColor: 'rgba(255, 170, 165, 0.5)',
                    },
                    '&:hover .MuiOutlinedInput-notchedOutline': {
                      borderColor: 'rgba(255, 107, 107, 0.7)',
                    },
                    '&.Mui-focused .MuiOutlinedInput-notchedOutline': {
                      borderColor: 'rgba(255, 107, 107, 0.7)',
                    },
                  }}
                >
                  {categories.map(category => (
                    <MenuItem key={category} value={category}>
                      {category}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>

              {/* 태그 대분류 선택 */}
              <FormControl fullWidth>
                <InputLabel id="main-tag-label">태그 대분류</InputLabel>
                <Select
                  labelId="main-tag-label"
                  id="mainTag"
                  name="mainTag"
                  value={formData.mainTag}
                  onChange={handleMainTagChange}
                  label="태그 대분류"
                  sx={{
                    borderRadius: '12px',
                    '& .MuiOutlinedInput-notchedOutline': {
                      borderColor: 'rgba(255, 170, 165, 0.5)',
                    },
                    '&:hover .MuiOutlinedInput-notchedOutline': {
                      borderColor: 'rgba(255, 107, 107, 0.7)',
                    },
                    '&.Mui-focused .MuiOutlinedInput-notchedOutline': {
                      borderColor: 'rgba(255, 107, 107, 0.7)',
                    },
                  }}
                >
                  {mainTags.map(tag => (
                    <MenuItem key={tag} value={tag}>
                      {tag}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>

              {/* 태그 소분류 선택 */}
              {formData.mainTag && (
                <FormControl fullWidth>
                  <InputLabel id="sub-tags-label">태그 소분류</InputLabel>
                  <Select
                    labelId="sub-tags-label"
                    id="subTags"
                    multiple
                    value={formData.subTags}
                    onChange={handleSubTagChange}
                    input={<OutlinedInput label="태그 소분류" />}
                    renderValue={selected => (
                      <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5 }}>
                        {(selected as string[]).map(value => (
                          <Chip
                            key={value}
                            label={value}
                            sx={{
                              backgroundColor: 'rgba(255, 170, 165, 0.7)',
                              color: '#7b1fa2',
                              fontWeight: 'bold',
                              '&:hover': {
                                backgroundColor: 'rgba(255, 107, 107, 0.6)',
                              },
                            }}
                          />
                        ))}
                      </Box>
                    )}
                    MenuProps={MenuProps}
                    sx={{
                      borderRadius: '12px',
                      '& .MuiOutlinedInput-notchedOutline': {
                        borderColor: 'rgba(255, 170, 165, 0.5)',
                      },
                      '&:hover .MuiOutlinedInput-notchedOutline': {
                        borderColor: 'rgba(255, 107, 107, 0.7)',
                      },
                      '&.Mui-focused .MuiOutlinedInput-notchedOutline': {
                        borderColor: 'rgba(255, 107, 107, 0.7)',
                      },
                    }}
                  >
                    {subTagsByMainTag[formData.mainTag as keyof typeof subTagsByMainTag].map(
                      tag => (
                        <MenuItem
                          key={tag}
                          value={tag}
                          style={getTagStyles(tag, formData.subTags, theme)}
                        >
                          <Checkbox
                            checked={formData.subTags.indexOf(tag) > -1}
                            sx={{
                              color: 'rgba(255, 170, 165, 0.7)',
                              '&.Mui-checked': {
                                color: 'rgba(255, 107, 107, 0.7)',
                              },
                            }}
                          />
                          <ListItemText primary={tag} />
                        </MenuItem>
                      )
                    )}
                  </Select>
                  <FormHelperText>태그는 최대 3개까지 선택 가능합니다</FormHelperText>
                </FormControl>
              )}

              {/* 제목 입력 */}
              <TextField
                label="제목"
                name="title"
                value={formData.title}
                onChange={handleInputChange}
                fullWidth
                required
                error={!!errors.title}
                helperText={errors.title}
                InputProps={{
                  sx: {
                    borderRadius: '12px',
                  },
                }}
                sx={{
                  '& .MuiOutlinedInput-root': {
                    '& fieldset': {
                      borderColor: 'rgba(255, 170, 165, 0.5)',
                    },
                    '&:hover fieldset': {
                      borderColor: 'rgba(255, 107, 107, 0.7)',
                    },
                    '&.Mui-focused fieldset': {
                      borderColor: 'rgba(255, 107, 107, 0.7)',
                    },
                  },
                }}
              />

              {/* 내용 입력 */}
              <TextField
                label="내용"
                name="content"
                value={formData.content}
                onChange={handleInputChange}
                multiline
                rows={15}
                fullWidth
                required
                error={!!errors.content}
                helperText={errors.content}
                InputProps={{
                  sx: {
                    borderRadius: '12px',
                  },
                }}
                sx={{
                  '& .MuiOutlinedInput-root': {
                    '& fieldset': {
                      borderColor: 'rgba(255, 170, 165, 0.5)',
                    },
                    '&:hover fieldset': {
                      borderColor: 'rgba(255, 107, 107, 0.7)',
                    },
                    '&.Mui-focused fieldset': {
                      borderColor: 'rgba(255, 107, 107, 0.7)',
                    },
                  },
                }}
              />

              {/* 파일 업로드 영역 */}
              <Box>
                <Typography variant="subtitle1" gutterBottom>
                  파일 첨부
                </Typography>
                
                <FileUploadBox onClick={handleUploadBoxClick}>
                  <CloudUploadIcon sx={{ fontSize: 40, color: 'rgba(255, 107, 107, 0.7)', mb: 1 }} />
                  <Typography variant="body1" gutterBottom>
                    파일을 여기에 끌어다 놓거나 클릭하여 업로드하세요
                  </Typography>
                  <Typography variant="caption" color="text.secondary">
                    최대 10MB, 이미지 및 문서 파일 지원
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
                    <Typography variant="subtitle2" gutterBottom>
                      선택된 파일 ({selectedFiles.length})
                    </Typography>
                    <List disablePadding>
                      {selectedFiles.map((file, index) => (
                        <ListItem
                          key={index}
                          secondaryAction={
                            <IconButton 
                              edge="end" 
                              onClick={() => handleFileRemove(index)}
                              sx={{ color: 'rgba(255, 107, 107, 0.7)' }}
                            >
                              <DeleteIcon />
                            </IconButton>
                          }
                          sx={{
                            bgcolor: 'rgba(255, 240, 240, 0.5)',
                            borderRadius: '8px',
                            mb: 1,
                          }}
                        >
                          <ListItemIcon>
                            <InsertDriveFileIcon sx={{ color: 'rgba(255, 107, 107, 0.7)' }} />
                          </ListItemIcon>
                          <ListItemText 
                            primary={file.name} 
                            secondary={`${(file.size / 1024).toFixed(2)} KB`} 
                          />
                        </ListItem>
                      ))}
                    </List>
                  </Box>
                )}

                {/* 편집 모드에서 기존 파일 표시 */}
                {isEditMode && communityStore.currentPost?.files && communityStore.currentPost.files.length > 0 && (
                  <Box sx={{ mt: 2 }}>
                    <Typography variant="subtitle2" gutterBottom>
                      기존 첨부 파일
                    </Typography>
                    <List disablePadding>
                      {communityStore.currentPost.files.map((file: any, index: number) => {
                        const fileUrl = typeof file === 'string' ? file : file.url;
                        const fileName = typeof file === 'string' 
                          ? `첨부파일 ${index + 1}` 
                          : file.originalName || `첨부파일 ${index + 1}`;
                        
                        return (
                          <ListItem
                            key={index}
                            secondaryAction={
                              <IconButton 
                                edge="end" 
                                onClick={() => handleExistingFileRemove(file.fileId || file.postFileId)}
                                sx={{ color: 'rgba(255, 107, 107, 0.7)' }}
                              >
                                <DeleteIcon />
                              </IconButton>
                            }
                            sx={{
                              bgcolor: 'rgba(255, 240, 240, 0.5)',
                              borderRadius: '8px',
                              mb: 1,
                            }}
                          >
                            <ListItemIcon>
                              <InsertDriveFileIcon sx={{ color: 'rgba(255, 107, 107, 0.7)' }} />
                            </ListItemIcon>
                            <ListItemText 
                              primary={
                                <Box component="a" href={fileUrl} target="_blank" sx={{ textDecoration: 'none', color: 'inherit' }}>
                                  {fileName}
                                </Box>
                              }
                            />
                          </ListItem>
                        );
                      })}
                    </List>
                  </Box>
                )}
              </Box>

              {/* 익명 체크박스 */}
              <FormControl>
                <Box sx={{ display: 'flex', alignItems: 'center' }}>
                  <Checkbox
                    checked={formData.isAnonymous}
                    onChange={handleAnonymousChange}
                    id="anonymous-checkbox"
                    sx={{
                      color: 'rgba(255, 170, 165, 0.7)',
                      '&.Mui-checked': {
                        color: 'rgba(255, 107, 107, 0.7)',
                      },
                    }}
                  />
                  <Typography component="label" htmlFor="anonymous-checkbox">
                    익명으로 게시하기
                  </Typography>
                </Box>
              </FormControl>

              {/* 버튼 영역 */}
              <Box sx={{ display: 'flex', justifyContent: 'space-between', mt: 3 }}>
                <Button
                  variant="outlined"
                  onClick={handleCancel}
                  sx={{
                    color: '#7b1fa2',
                    borderColor: 'rgba(255, 170, 165, 0.7)',
                    '&:hover': {
                      borderColor: 'rgba(255, 107, 107, 0.7)',
                      backgroundColor: 'rgba(255, 170, 165, 0.1)',
                    },
                    borderRadius: '8px',
                    padding: '10px 20px',
                  }}
                >
                  취소
                </Button>

                <StyledButton
                  type="submit"
                  variant="contained"
                  disabled={isSaving}
                  startIcon={isSaving && <CircularProgress size={20} sx={{ color: 'white' }} />}
                >
                  {isSaving ? '저장 중...' : isEditMode ? '수정하기' : '게시하기'}
                </StyledButton>
              </Box>
            </FormBox>
          </form>
        </ContentPaper>
      </Container>
    </SpringBackground>
  );
};

export default PostCreateEditPage;
