import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { useState, useEffect, useRef } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { Container, Box, TextField, Button, Typography, Paper, Select, MenuItem, Chip, FormControl, InputLabel, OutlinedInput, Checkbox, ListItemText, FormHelperText, CircularProgress, IconButton, List, ListItem, ListItemIcon, } from '@mui/material';
import { useTheme } from '@mui/material/styles';
import { styled } from '@mui/system';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import DeleteIcon from '@mui/icons-material/Delete';
import InsertDriveFileIcon from '@mui/icons-material/InsertDriveFile';
import CloudUploadIcon from '@mui/icons-material/CloudUpload';
import useCommunityStore from '../store/communityStore';
import { useSnackbar } from 'notistack';
import RegionSelector from '../components/shared/RegionSelector';
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
// File upload related styled components
const FileUploadBox = styled(Box)(({ theme }) => ({
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    border: '2px dashed rgba(255, 170, 165, 0.5)',
    borderRadius: '12px',
    padding: theme.spacing(3),
    cursor: 'pointer',
    transition: 'background-color 0.3s, border-color 0.3s',
    backgroundColor: 'rgba(255, 240, 240, 0.2)',
    '&:hover': {
        backgroundColor: 'rgba(255, 240, 240, 0.5)',
        borderColor: 'rgba(255, 107, 107, 0.7)',
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
const getTagStyles = (tag, selectedTags, theme) => {
    return {
        fontWeight: selectedTags.indexOf(tag) === -1 ? 'normal' : 'bold',
        backgroundColor: selectedTags.indexOf(tag) === -1 ? 'transparent' : 'rgba(255, 170, 165, 0.1)',
    };
};
// 카테고리 및 태그 데이터 (대분류)
const categories = ['travel', 'living', 'study', 'job'];
const categoryLabels = {
    travel: '여행',
    living: '주거',
    study: '유학',
    job: '취업',
};
// 게시글 타입 (자유/모임)
const postTypes = ['자유', '모임'];
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
// 태그 소분류 - TagSelector.tsx와 일치하도록 수정
const subTagsByCategory = {
    travel: ['관광/체험', '식도락/맛집', '교통/이동', '숙소/지역정보', '대사관/응급'],
    living: ['부동산/계약', '생활환경/편의', '문화/생활', '주거지 관리/유지'],
    study: ['학사/캠퍼스', '학업지원/시설', '행정/비자/서류', '기숙사/주거'],
    job: ['이력/채용준비', '비자/법률/노동', '잡페어/네트워킹', '알바/파트타임'],
};
const PostCreateEditPage = () => {
    const navigate = useNavigate();
    const { postId } = useParams();
    const theme = useTheme();
    const isEditMode = !!postId;
    const { enqueueSnackbar } = useSnackbar();
    // 커뮤니티 스토어에서 필요한 상태와 액션 가져오기
    const communityStore = useCommunityStore();
    const { createPost, updatePost, fetchPostById } = communityStore;
    const storePostLoading = communityStore.postLoading;
    const storePostError = communityStore.postError;
    const [formData, setFormData] = useState({
        title: '',
        content: '',
        category: '', // 대분류 (여행, 취업, 유학, 거주)
        subTags: [],
        isAnonymous: false,
        postType: '자유', // 기본값은 '자유' 게시글
        address: '자유', // 자유 게시글은 address가 '자유'
    });
    const [errors, setErrors] = useState({
        title: '',
        content: '',
    });
    const [isLoading, setIsLoading] = useState(false);
    const [isSaving, setIsSaving] = useState(false);
    // 파일 업로드 관련 상태
    const [selectedFiles, setSelectedFiles] = useState([]);
    const [uploadProgress, setUploadProgress] = useState(false);
    const [removedFileIds, setRemovedFileIds] = useState([]);
    const fileInputRef = useRef(null);
    // 게시글의 파일 목록 상태 추가
    const [postFiles, setPostFiles] = useState([]);
    // 세부 지역 선택을 처리하기 위한 상태 추가
    const [selectedSubRegion, setSelectedSubRegion] = useState('');
    // 편집 모드일 경우 기존 게시글 데이터 불러오기
    useEffect(() => {
        const fetchPostData = async () => {
            if (!postId)
                return;
            try {
                setIsLoading(true);
                const post = (await fetchPostById(Number(postId)));
                if (post) {
                    // 기존 게시글 데이터로 폼 초기화
                    setFormData({
                        title: post.title || '',
                        content: post.content || '',
                        category: post.category || '',
                        subTags: post.tags?.map((tag) => tag.name) || [],
                        isAnonymous: post.isAnonymous || false,
                        postType: post.postType || '자유',
                        address: post.address || '자유',
                    });
                    // 게시글에 첨부된 파일이 있으면 파일 목록 설정
                    if (post.files && post.files.length > 0) {
                        // Post.files가 string[] 타입인 경우 처리
                        if (typeof post.files[0] === 'string') {
                            const fileUrls = post.files;
                            // string[] 를 FileWithMetadata[] 로 변환
                            const filesWithMetadata = fileUrls.map((url, index) => ({
                                id: index,
                                fileName: url.split('/').pop() || `file-${index}`,
                                fileUrl: url,
                            }));
                            setPostFiles(filesWithMetadata);
                        }
                        // Post.files가 FileInfo[] 타입인 경우 처리
                        else if ('fileId' in post.files[0]) {
                            const fileInfos = post.files;
                            // FileInfo[] 를 FileWithMetadata[] 로 변환
                            const filesWithMetadata = fileInfos.map(file => ({
                                id: file.fileId,
                                fileName: file.originalName,
                                fileUrl: file.url,
                            }));
                            setPostFiles(filesWithMetadata);
                        }
                        // 이미 FileWithMetadata[] 타입인 경우는 그대로 사용
                        else {
                            setPostFiles(post.files);
                        }
                    }
                }
            }
            catch (error) {
                console.error('게시글 로드 오류:', error);
                enqueueSnackbar('게시글을 불러오는 중 오류가 발생했습니다.', { variant: 'error' });
            }
            finally {
                setIsLoading(false);
            }
        };
        if (isEditMode) {
            fetchPostData();
        }
    }, [postId, fetchPostById, isEditMode, enqueueSnackbar]);
    // 카테고리 변경 핸들러
    const handleCategoryChange = (e) => {
        const category = e.target.value;
        setFormData(prev => ({
            ...prev,
            category,
            subTags: [], // 카테고리가 변경되면 서브태그 초기화
        }));
        console.log(`카테고리 변경: ${category} (${categoryLabels[category]})`);
    };
    // 일반 입력 필드 핸들러
    const handleInputChange = (e) => {
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
    const handleSubTagChange = (event) => {
        const { value } = event.target;
        setFormData(prev => ({
            ...prev,
            subTags: typeof value === 'string' ? value.split(',') : value,
        }));
    };
    // 익명 체크박스 핸들러
    const handleAnonymousChange = (e) => {
        setFormData(prev => ({
            ...prev,
            isAnonymous: e.target.checked,
        }));
    };
    // 파일 선택 핸들러
    const handleFileSelect = (event) => {
        if (event.target.files) {
            setSelectedFiles(prev => [...prev, ...Array.from(event.target.files || [])]);
        }
    };
    // 선택한 파일 제거 핸들러
    const handleFileRemove = (fileIndex) => {
        setSelectedFiles(prev => prev.filter((_, index) => index !== fileIndex));
    };
    // 파일 업로드 박스 클릭 핸들러
    const handleUploadBoxClick = () => {
        fileInputRef.current?.click();
    };
    // 기존 파일 제거 핸들러
    const handleExistingFileRemove = (fileId) => {
        setPostFiles(prev => prev.filter(file => file.id !== fileId));
        setRemovedFileIds(prev => [...prev, fileId]);
    };
    // 게시글 타입 변경 핸들러 (자유/모임)
    const handlePostTypeChange = (e) => {
        const newPostType = e.target.value;
        setFormData(prev => ({
            ...prev,
            postType: newPostType,
            // 자유 게시글이면 address를 '자유'로 설정
            address: newPostType === '자유' ? '자유' : prev.address,
        }));
    };
    // 지역 변경 핸들러 - RegionSelector 컴포넌트로 대체
    const handleRegionChange = (region) => {
        console.log('지역 변경:', region);
        setFormData(prev => ({
            ...prev,
            address: region,
        }));
        // 시/도 선택 시 하위 지역 초기화
        setSelectedSubRegion('');
    };
    // 폼 제출 핸들러
    const handleSubmit = async (e) => {
        e.preventDefault();
        // 필수 필드 검증
        let isValid = true;
        const newErrors = { ...errors };
        if (!formData.title.trim()) {
            newErrors.title = '제목을 입력해주세요.';
            isValid = false;
        }
        if (!formData.content.trim()) {
            newErrors.content = '내용을 입력해주세요.';
            isValid = false;
        }
        if (!isValid) {
            setErrors(newErrors);
            return;
        }
        try {
            setIsSaving(true);
            // 폼 데이터 준비 - API 형식에 맞게 변환
            const postData = {
                title: formData.title,
                content: formData.content,
                category: formData.category,
                tags: formData.subTags, // subTags를 tags로 변환
                postType: formData.postType,
                address: formData.address,
                isAnonymous: formData.isAnonymous,
                language: 'ko', // 기본값
                emotion: 'NONE', // 기본값
            };
            console.log('서버로 전송할 데이터:', postData);
            // 게시글 생성 또는 수정
            if (isEditMode && postId) {
                await updatePost(Number(postId), {
                    ...postData,
                    removedFileIds: removedFileIds,
                }, selectedFiles);
                enqueueSnackbar('게시글이 성공적으로 수정되었습니다.', { variant: 'success' });
            }
            else {
                await createPost(postData, selectedFiles);
                enqueueSnackbar('게시글이 성공적으로 작성되었습니다.', { variant: 'success' });
            }
            // 게시글 목록 페이지로 이동
            navigate('/community');
        }
        catch (error) {
            console.error('게시글 저장 오류:', error);
            enqueueSnackbar('게시글 저장 중 오류가 발생했습니다.', { variant: 'error' });
        }
        finally {
            setIsSaving(false);
        }
    };
    // 취소 버튼 핸들러
    const handleCancel = () => {
        if (window.confirm('작성 중인 내용이 저장되지 않습니다. 정말 취소하시겠습니까?')) {
            navigate('/community');
        }
    };
    // 로딩 중일 때 로딩 표시
    if (isLoading) {
        return (_jsx(SpringBackground, { children: _jsx(Container, { maxWidth: "md", sx: { py: 4 }, children: _jsx(Box, { sx: { display: 'flex', justifyContent: 'center', py: 8 }, children: _jsx(CircularProgress, { sx: { color: 'rgba(255, 107, 107, 0.7)' } }) }) }) }));
    }
    return (_jsx(SpringBackground, { children: _jsxs(Container, { maxWidth: "md", sx: { py: 4 }, children: [_jsx(Box, { sx: { mb: 2 }, children: _jsx(Button, { startIcon: _jsx(ArrowBackIcon, {}), onClick: () => navigate('/community'), sx: {
                            color: '#666',
                            '&:hover': {
                                backgroundColor: 'rgba(255, 240, 240, 0.2)',
                            },
                        }, children: "\uBAA9\uB85D\uC73C\uB85C \uB3CC\uC544\uAC00\uAE30" }) }), _jsxs(ContentPaper, { elevation: 3, children: [_jsx(PageTitle, { variant: "h5", children: isEditMode ? '게시글 수정' : '새 게시글 작성' }), _jsx("form", { onSubmit: handleSubmit, children: _jsxs(FormBox, { children: [_jsx(TextField, { label: "\uC81C\uBAA9", variant: "outlined", fullWidth: true, name: "title", value: formData.title, onChange: handleInputChange, error: !!errors.title, helperText: errors.title, sx: {
                                            '& .MuiOutlinedInput-root': {
                                                borderRadius: '12px',
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
                                        } }), _jsxs(FormControl, { sx: { minWidth: 200 }, children: [_jsx(InputLabel, { id: "post-type-label", children: "\uAC8C\uC2DC\uAE00 \uD0C0\uC785" }), _jsx(Select, { labelId: "post-type-label", id: "post-type", value: formData.postType, onChange: handlePostTypeChange, label: "\uAC8C\uC2DC\uAE00 \uD0C0\uC785", sx: {
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
                                                }, children: postTypes.map(type => (_jsxs(MenuItem, { value: type, children: [type, " \uAC8C\uC2DC\uAE00"] }, type))) }), _jsx(FormHelperText, { children: "\uC790\uC720 \uAC8C\uC2DC\uAE00 \uB610\uB294 \uBAA8\uC784 \uAC8C\uC2DC\uAE00\uC744 \uC120\uD0DD\uD558\uC138\uC694" })] }), formData.postType === '모임' && (_jsxs(FormControl, { fullWidth: true, sx: { mt: 2 }, children: [_jsx(InputLabel, { id: "region-label", children: "\uC9C0\uC5ED" }), _jsx(RegionSelector, { selectedRegion: formData.address, onChange: handleRegionChange }), _jsx(FormHelperText, { children: "\uBAA8\uC784\uC774 \uC9C4\uD589\uB420 \uC9C0\uC5ED\uC744 \uC120\uD0DD\uD558\uC138\uC694" })] })), _jsxs(FormControl, { fullWidth: true, variant: "outlined", margin: "normal", children: [_jsx(InputLabel, { id: "category-label", children: "\uCE74\uD14C\uACE0\uB9AC" }), _jsx(Select, { labelId: "category-label", id: "category", name: "category", value: formData.category || '', onChange: handleCategoryChange, label: "\uCE74\uD14C\uACE0\uB9AC", required: true, sx: {
                                                    bgcolor: 'white',
                                                    '& .MuiOutlinedInput-notchedOutline': {
                                                        borderColor: 'rgba(255, 170, 165, 0.5)',
                                                    },
                                                    '&:hover .MuiOutlinedInput-notchedOutline': {
                                                        borderColor: 'rgba(255, 107, 107, 0.7)',
                                                    },
                                                    '&.Mui-focused .MuiOutlinedInput-notchedOutline': {
                                                        borderColor: 'rgba(255, 107, 107, 0.9)',
                                                    },
                                                }, children: categories.map(category => (_jsx(MenuItem, { value: category, children: categoryLabels[category] }, category))) }), _jsx(FormHelperText, { children: "\uAC8C\uC2DC\uAE00\uC758 \uC8FC\uC81C \uCE74\uD14C\uACE0\uB9AC\uB97C \uC120\uD0DD\uD558\uC138\uC694" })] }), formData.category && (_jsxs(FormControl, { fullWidth: true, variant: "outlined", margin: "normal", children: [_jsx(InputLabel, { id: "subtags-label", children: "\uC138\uBD80 \uD0DC\uADF8" }), _jsx(Select, { labelId: "subtags-label", id: "subtags", multiple: true, value: formData.subTags, onChange: handleSubTagChange, input: _jsx(OutlinedInput, { id: "select-multiple-chip", label: "\uC138\uBD80 \uD0DC\uADF8" }), renderValue: selected => (_jsx(Box, { sx: { display: 'flex', flexWrap: 'wrap', gap: 0.5 }, children: selected.map(value => (_jsx(Chip, { label: value, sx: {
                                                            bgcolor: 'rgba(255, 170, 165, 0.2)',
                                                            borderColor: 'rgba(255, 107, 107, 0.3)',
                                                            border: '1px solid',
                                                            color: '#7b1fa2',
                                                            fontWeight: 'medium',
                                                        } }, value))) })), MenuProps: MenuProps, sx: {
                                                    bgcolor: 'white',
                                                    '& .MuiOutlinedInput-notchedOutline': {
                                                        borderColor: 'rgba(255, 170, 165, 0.5)',
                                                    },
                                                    '&:hover .MuiOutlinedInput-notchedOutline': {
                                                        borderColor: 'rgba(255, 107, 107, 0.7)',
                                                    },
                                                    '&.Mui-focused .MuiOutlinedInput-notchedOutline': {
                                                        borderColor: 'rgba(255, 107, 107, 0.9)',
                                                    },
                                                }, children: formData.category &&
                                                    subTagsByCategory[formData.category]?.map(tag => (_jsxs(MenuItem, { value: tag, style: getTagStyles(tag, formData.subTags, theme), children: [_jsx(Checkbox, { checked: formData.subTags.indexOf(tag) > -1 }), _jsx(ListItemText, { primary: tag })] }, tag))) }), _jsx(FormHelperText, { children: "\uAD00\uB828\uB41C \uC138\uBD80 \uD0DC\uADF8\uB97C \uC120\uD0DD\uD558\uC138\uC694 (\uCD5C\uB300 3\uAC1C)" })] })), _jsx(TextField, { label: "\uB0B4\uC6A9", variant: "outlined", multiline: true, rows: 8, fullWidth: true, name: "content", value: formData.content, onChange: handleInputChange, error: !!errors.content, helperText: errors.content, sx: {
                                            '& .MuiOutlinedInput-root': {
                                                borderRadius: '12px',
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
                                        } }), _jsxs(Box, { children: [_jsx(Typography, { variant: "subtitle1", gutterBottom: true, children: "\uD30C\uC77C \uCCA8\uBD80" }), _jsxs(FileUploadBox, { onClick: handleUploadBoxClick, children: [_jsx(CloudUploadIcon, { sx: { fontSize: 40, color: 'rgba(255, 107, 107, 0.7)', mb: 1 } }), _jsx(Typography, { variant: "body1", gutterBottom: true, children: "\uD30C\uC77C\uC744 \uC5EC\uAE30\uC5D0 \uB04C\uC5B4\uB2E4 \uB193\uAC70\uB098 \uD074\uB9AD\uD558\uC5EC \uC5C5\uB85C\uB4DC\uD558\uC138\uC694" }), _jsx(Typography, { variant: "caption", color: "text.secondary", children: "\uCD5C\uB300 10MB, \uC774\uBBF8\uC9C0 \uBC0F \uBB38\uC11C \uD30C\uC77C \uC9C0\uC6D0" }), _jsx(VisuallyHiddenInput, { type: "file", ref: fileInputRef, onChange: handleFileSelect, multiple: true })] }), selectedFiles.length > 0 && (_jsxs(Box, { sx: { mt: 2 }, children: [_jsxs(Typography, { variant: "subtitle2", gutterBottom: true, children: ["\uC120\uD0DD\uB41C \uD30C\uC77C (", selectedFiles.length, ")"] }), _jsx(List, { disablePadding: true, children: selectedFiles.map((file, index) => (_jsxs(ListItem, { secondaryAction: _jsx(IconButton, { edge: "end", onClick: () => handleFileRemove(index), sx: { color: 'rgba(255, 107, 107, 0.7)' }, children: _jsx(DeleteIcon, {}) }), sx: {
                                                                bgcolor: 'rgba(255, 240, 240, 0.5)',
                                                                borderRadius: '8px',
                                                                mb: 1,
                                                            }, children: [_jsx(ListItemIcon, { children: _jsx(InsertDriveFileIcon, { sx: { color: 'rgba(255, 107, 107, 0.7)' } }) }), _jsx(ListItemText, { primary: file.name, secondary: `${(file.size / 1024).toFixed(2)} KB` })] }, index))) })] })), isEditMode && postFiles.length > 0 && (_jsxs(Box, { sx: { mt: 2 }, children: [_jsx(Typography, { variant: "subtitle2", gutterBottom: true, children: "\uAE30\uC874 \uCCA8\uBD80 \uD30C\uC77C" }), _jsx(List, { disablePadding: true, children: postFiles.map((file, index) => (_jsxs(ListItem, { secondaryAction: _jsx(IconButton, { edge: "end", onClick: () => handleExistingFileRemove(file.id), sx: { color: 'rgba(255, 107, 107, 0.7)' }, children: _jsx(DeleteIcon, {}) }), sx: {
                                                                bgcolor: 'rgba(255, 240, 240, 0.5)',
                                                                borderRadius: '8px',
                                                                mb: 1,
                                                            }, children: [_jsx(ListItemIcon, { children: _jsx(InsertDriveFileIcon, { sx: { color: 'rgba(255, 107, 107, 0.7)' } }) }), _jsx(ListItemText, { primary: _jsx(Box, { component: "a", href: file.fileUrl, target: "_blank", sx: { textDecoration: 'none', color: 'inherit' }, children: file.fileName }) })] }, index))) })] }))] }), _jsx(FormControl, { children: _jsxs(Box, { sx: { display: 'flex', alignItems: 'center' }, children: [_jsx(Checkbox, { checked: formData.isAnonymous, onChange: handleAnonymousChange, id: "anonymous-checkbox", sx: {
                                                        color: 'rgba(255, 170, 165, 0.7)',
                                                        '&.Mui-checked': {
                                                            color: 'rgba(255, 107, 107, 0.7)',
                                                        },
                                                    } }), _jsx(Typography, { component: "label", htmlFor: "anonymous-checkbox", children: "\uC775\uBA85\uC73C\uB85C \uAC8C\uC2DC\uD558\uAE30" })] }) }), _jsxs(Box, { sx: { display: 'flex', gap: 2, justifyContent: 'flex-end', mt: 2 }, children: [_jsx(Button, { variant: "outlined", onClick: handleCancel, sx: {
                                                    borderColor: '#FFAAA5',
                                                    color: '#666',
                                                    '&:hover': {
                                                        borderColor: '#FF9999',
                                                        backgroundColor: 'rgba(255, 240, 240, 0.2)',
                                                    },
                                                    borderRadius: '8px',
                                                }, children: "\uCDE8\uC18C" }), _jsx(StyledButton, { type: "submit", variant: "contained", disabled: isSaving, startIcon: isSaving ? _jsx(CircularProgress, { size: 20, sx: { color: 'white' } }) : null, children: isSaving ? '저장 중...' : isEditMode ? '수정하기' : '작성하기' })] })] }) })] })] }) }));
};
export default PostCreateEditPage;
