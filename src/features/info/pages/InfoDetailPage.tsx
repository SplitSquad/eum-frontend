import React, { useEffect, useState, useRef } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useTranslation } from '../../../shared/i18n';
import { useInfoStore } from '../store/infoStore';
import { useEditor, EditorContent, JSONContent } from '@tiptap/react';
import StarterKit from '@tiptap/starter-kit';
import TextAlign from '@tiptap/extension-text-align';
import Underline from '@tiptap/extension-underline';
import TaskList from '@tiptap/extension-task-list';
import TaskItem from '@tiptap/extension-task-item';
import Highlight from '@tiptap/extension-highlight';
import Image from '@tiptap/extension-image';
import Typography from '@tiptap/extension-typography';
import Superscript from '@tiptap/extension-superscript';
import Subscript from '@tiptap/extension-subscript';
import Link from '@tiptap/extension-link';
import { Selection } from '@tiptap-editor/components/tiptap-extension/selection-extension';
import { ImageUploadNode } from '@tiptap-editor/components/tiptap-node/image-upload-node/image-upload-node-extension';
import { TrailingNode } from '@tiptap-editor/components/tiptap-extension/trailing-node-extension';
import { handleImageUpload, MAX_FILE_SIZE } from '@tiptap-editor/lib/tiptap-utils';
import {
  Box,
  Paper,
  Typography as MuiTypography,
  Button,
  Chip,
  Divider,
  IconButton,
  CircularProgress,
  Alert,
  useTheme,
  useMediaQuery,
  Breadcrumbs,
  Link as MuiLink,
} from '@mui/material';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import VisibilityIcon from '@mui/icons-material/Visibility';
import PersonIcon from '@mui/icons-material/Person';
import AccessTimeIcon from '@mui/icons-material/AccessTime';
import CategoryIcon from '@mui/icons-material/Category';

// userId 꺼내오는 헬퍼
export function getUserId(): number | null {
  try {
    const raw = localStorage.getItem('auth-storage');
    if (!raw) return null;
    const parsed = JSON.parse(raw);
    return parsed?.state?.user?.userId ?? null;
  } catch {
    return null;
  }
}

// 로그 전송 타입 정의
interface WebLog {
  userId: number;
  content: string;
}

// BASE URL에 엔드포인트 설정
const BASE = import.meta.env.VITE_API_BASE_URL;

// 로그 전송 함수
export function sendWebLog(log: WebLog) {
  const token = localStorage.getItem('auth_token');
  if (!token) throw new Error('인증 토큰이 없습니다. 다시 로그인해주세요.');
  fetch(`${BASE}/logs`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', Authorization: token },
    body: JSON.stringify(log),
  }).catch(err => console.error('WebLog 전송 실패:', err));
  console.log('WebLog 전송 성공:', log);
}

interface InfoDetail {
  informationId: number;
  title: string;
  content: string;
  userName: string;
  createdAt: string;
  views: number;
  category: string;
}

// API_BASE는 스토어에서 사용하므로 제거

// 카테고리별 색상 매핑 (한국어 카테고리명을 키로 사용)
const getCategoryColor = (category: string) => {
  const colorMap: { [key: string]: string } = {
    '비자/법률': '#4CAF50',
    '취업/직장': '#2196F3',
    '주거/부동산': '#FF9800',
    '교육': '#9C27B0',
    '의료/건강': '#F44336',
    '금융/세금': '#607D8B',
    '교통': '#795548',
    '쇼핑': '#E91E63',
  };
  return colorMap[category] || '#6B7280';
};

// 한국어 카테고리를 영어 키로 변환
const getCategoryKey = (koreanCategory: string): string => {
  const categoryMap: { [key: string]: string } = {
    '비자/법률': 'visa',
    '취업/직장': 'employment',
    '주거/부동산': 'housing',
    '교육': 'education',
    '의료/건강': 'healthcare',
    '금융/세금': 'finance',
    '교통': 'transportation',
    '쇼핑': 'shopping',
  };
  return categoryMap[koreanCategory] || 'all';
};

// 카테고리 아이콘 매핑
const getCategoryIcon = (category: string) => {
  const categoryKey = getCategoryKey(category);
  const iconMap: { [key: string]: string } = {
    'visa': '⚖️',
    'employment': '💼',
    'housing': '🏠',
    'education': '🎓',
    'healthcare': '🏥',
    'finance': '🏦',
    'transportation': '🚗',
    'shopping': '🛍️',
  };
  return iconMap[categoryKey] || '📄';
};

export default function InfoDetailPage() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { t, language } = useTranslation();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));

  // 정보 스토어에서 상태와 함수 가져오기
  const { currentPost, fetchPostDetail } = useInfoStore();

  // 디버깅을 위한 로그
  console.log('InfoDetailPage - Current language:', language);
  console.log('InfoDetailPage - Translation test:', t('infoPage.title'));
  console.log('InfoDetailPage - Detail test:', t('infoPage.detail.back'));
  
  const [detail, setDetail] = useState<InfoDetail | null>(null);
  const [isAdmin, setIsAdmin] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [tableOfContents, setTableOfContents] = useState<{id: string, text: string, level: number}[]>([]);
  const [activeHeading, setActiveHeading] = useState<string>('');
  const [isBookmarked, setIsBookmarked] = useState<boolean>(false);

  // Tiptap 에디터 설정
  const editor = useEditor({
    editable: false,
    extensions: [
      StarterKit,
      TextAlign.configure({ types: ['heading', 'paragraph'] }),
      Underline,
      TaskList,
      TaskItem,
      Highlight.configure({ multicolor: true }),
      Image,
      ImageUploadNode.configure({
        accept: 'image/*',
        maxSize: MAX_FILE_SIZE,
        limit: 3,
        upload: handleImageUpload,
      }),
      TrailingNode,
      Typography,
      Superscript,
      Subscript,
      Selection,
      Link.configure({ openOnClick: false }),
    ],
    content: '',
  });

  // 관리자 권한 판별
  useEffect(() => {
    const raw = localStorage.getItem('auth-storage');
    if (raw) {
      try {
        const parsed = JSON.parse(raw);
        setIsAdmin(parsed?.state?.user?.role === 'ROLE_ADMIN');
      } catch {
        setIsAdmin(false);
      }
    }
  }, []);

  // 상세 데이터 fetch 함수 (스토어 사용)
  const fetchDetail = async (skipViewIncrement = false) => {
    if (!id) return;
    
    setLoading(true);
    setError(null);
    
    try {
      const data = await fetchPostDetail(id);

      // 웹로그 전송 (언어 변경 시에는 스킵)
      if (!skipViewIncrement && data) {
        const userId = getUserId() || 0;
        const logPayload = {
          UID: userId,
          ClickPath: window.location.pathname,
          TAG: data.category,
          CurrentPath: window.location.pathname,
          Event: 'click',
          Content: { title: data.title },
          Timestamp: new Date().toISOString(),
        };
        sendWebLog({ userId, content: JSON.stringify(logPayload) });
      }

      setDetail(data);
      
      // 북마크 상태 확인 (목록 페이지와 동일한 키 사용)
      if (data) {
        const bookmarks = JSON.parse(localStorage.getItem('bookmarkedIds') || '[]');
        setIsBookmarked(bookmarks.includes(data.informationId));
      }
    } catch (err) {
      console.error('상세 정보 조회 실패:', err);
      setError(err instanceof Error ? err.message : '정보를 불러오는데 실패했습니다.');
    } finally {
      setLoading(false);
    }
  };

  // 초기 상세 데이터 fetch
  useEffect(() => {
    fetchDetail();
  }, [id]);

  // 스토어의 currentPost와 로컬 detail 동기화
  useEffect(() => {
    if (currentPost) {
      setDetail(currentPost);
      console.log('[InfoDetailPage] 스토어에서 상세 데이터 업데이트:', currentPost);
    }
  }, [currentPost]);

  // 언어 변경 감지는 스토어에서 자동으로 처리되므로 제거

  // 에디터에 콘텐츠 설정
  useEffect(() => {
    if (editor && detail) {
      try {
      const doc = JSON.parse(detail.content) as JSONContent;
      queueMicrotask(() => {
        editor.commands.setContent(doc);
      });
      } catch (err) {
        console.error('콘텐츠 파싱 실패:', err);
        editor.commands.setContent(`<p>${detail.content}</p>`);
      }
    }
  }, [editor, detail]);

  // JSON에서 직접 목차 추출하는 함수
  const extractTOCFromJSON = (content: string): {id: string, text: string, level: number}[] => {
    try {
      const doc = JSON.parse(content) as JSONContent;
      const toc: {id: string, text: string, level: number}[] = [];
      let headingIndex = 0;

      const traverse = (node: any) => {
        if (node.type && node.type.startsWith('heading') && node.content) {
          const level = parseInt(node.type.replace('heading', ''));
          const text = node.content.map((textNode: any) => textNode.text || '').join('').trim();
          
          if (text) {
            const id = `heading-${headingIndex}`;
            toc.push({ id, text, level });
            headingIndex++;
          }
        }
        
        if (node.content && Array.isArray(node.content)) {
          node.content.forEach(traverse);
        }
      };

      if (doc.content) {
        doc.content.forEach(traverse);
      }

      return toc;
    } catch (err) {
      console.error('JSON에서 목차 추출 실패:', err);
      return [];
    }
  };

  // 목차 생성 (JSON 및 DOM 방식 모두 시도)
  useEffect(() => {
    if (!detail) return;

    // 방법 1: JSON에서 직접 추출
    const jsonTOC = extractTOCFromJSON(detail.content);
    if (jsonTOC.length > 0) {
      setTableOfContents(jsonTOC);
      console.log('JSON에서 목차 추출 성공:', jsonTOC);
      return;
    }

    // 방법 2: DOM에서 추출 (에디터가 준비된 후)
    if (!editor) return;

    const generateTOCFromDOM = () => {
      const headings = document.querySelectorAll('.article-content h1, .article-content h2, .article-content h3, .article-content h4, .article-content h5, .article-content h6');
      const toc: {id: string, text: string, level: number}[] = [];
      
      console.log('DOM에서 헤딩 요소 발견:', headings.length);
      
      headings.forEach((heading, index) => {
        const id = `heading-${index}`;
        heading.id = id;
        const level = parseInt(heading.tagName.charAt(1));
        const text = heading.textContent || '';
        
        if (text.trim()) {
          toc.push({ id, text: text.trim(), level });
          console.log(`DOM에서 목차 항목 추가: ${text} (레벨 ${level})`);
        }
      });
      
      if (toc.length > 0) {
        setTableOfContents(toc);
        console.log('DOM에서 최종 목차:', toc);
      }
    };

    // 에디터 업데이트 이벤트 리스너
    const handleEditorUpdate = () => {
      setTimeout(generateTOCFromDOM, 500);
    };

    editor.on('update', handleEditorUpdate);
    
    // 초기 목차 생성 (여러 번 시도)
    setTimeout(generateTOCFromDOM, 300);
    setTimeout(generateTOCFromDOM, 1000);
    setTimeout(generateTOCFromDOM, 2000);

    return () => {
      editor.off('update', handleEditorUpdate);
    };
  }, [editor, detail]);

  // DOM 헤딩에 ID 설정 및 스크롤 시 활성 헤딩 업데이트
  useEffect(() => {
    if (tableOfContents.length === 0) return;

    // DOM 헤딩에 ID 설정
    const setHeadingIds = () => {
      const headings = document.querySelectorAll('.article-content h1, .article-content h2, .article-content h3, .article-content h4, .article-content h5, .article-content h6');
      
      headings.forEach((heading, index) => {
        if (!heading.id) {
          heading.id = `heading-${index}`;
        }
      });
    };

    setHeadingIds();
    setTimeout(setHeadingIds, 500); // 한 번 더 시도

    const handleScroll = () => {
      const headings = document.querySelectorAll('.article-content h1, .article-content h2, .article-content h3, .article-content h4, .article-content h5, .article-content h6');
      let current = '';
      
      headings.forEach((heading) => {
        const rect = heading.getBoundingClientRect();
        if (rect.top <= 100) {
          current = heading.id;
        }
      });
      
      setActiveHeading(current);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, [tableOfContents]);

  const handleEdit = () => {
    navigate(`/info/edit/${id}`);
  };

  const handleDelete = async () => {
    if (!window.confirm('정말 이 글을 삭제하시겠습니까?')) return;
    
    try {
      const token = localStorage.getItem('auth_token') || '';
      const res = await fetch(`${BASE}/information/${id}`, {
        method: 'DELETE',
        headers: { Authorization: token },
      });
      
      if (!res.ok) throw new Error(`삭제 실패: ${res.status}`);
      
      navigate('/info');
    } catch (err) {
      console.error('삭제 중 오류 발생:', err);
      alert('삭제에 실패했습니다.');
    }
  };

  const handleBack = () => {
    navigate('/info');
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">정보를 불러오는 중...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 p-6">
        <div className="max-w-4xl mx-auto">
          <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-6">
            <p className="text-red-800">{error}</p>
          </div>
          <button
            onClick={handleBack}
            className="px-4 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition-colors"
          >
            ← 목록으로 돌아가기
          </button>
        </div>
      </div>
    );
  }

  if (!detail) {
    return (
      <div className="min-h-screen bg-gray-50 p-6">
        <div className="max-w-4xl mx-auto">
          <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
            <p className="text-yellow-800">{t('infoPage.content.noData')}</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* 상단 네비게이션 */}
      <div className="bg-white border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 py-3">
          <div className="flex items-center justify-between">
            <button
              onClick={handleBack}
              className="flex items-center text-gray-600 hover:text-gray-800 transition-colors text-sm"
            >
← {t('infoPage.detail.back')}
            </button>
            
            {/* 관리자 액션 버튼 */}
            {isAdmin && (
              <div className="flex gap-2">
                <button
                  onClick={handleEdit}
                  className="px-3 py-1 text-sm bg-blue-600 text-white rounded hover:bg-blue-700 transition-colors"
                >
{t('common.edit')}
            </button>
            <button
              onClick={handleDelete}
                  className="px-3 py-1 text-sm bg-red-600 text-white rounded hover:bg-red-700 transition-colors"
            >
{t('common.delete')}
            </button>
              </div>
        )}
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 py-8">
        <div className="flex gap-8">
          {/* 메인 콘텐츠 */}
          <div className="flex-1">
            <div className="bg-white rounded-lg border border-gray-200 overflow-hidden">
              {/* 대표 이미지 영역 */}
              <div 
                className="h-64 flex items-center justify-center text-white"
                style={{ 
                  background: `linear-gradient(135deg, ${getCategoryColor(detail.category)}dd, ${getCategoryColor(detail.category)}88)` 
                }}
              >
                <div className="text-center">
                  <div className="text-6xl mb-4 opacity-90">
                    {getCategoryIcon(detail.category)}
                  </div>
                  <p className="text-lg font-medium opacity-95">{detail.title}</p>
                </div>
              </div>

              {/* 글 정보 */}
              <div className="p-8">
                <div className="mb-6">
                  <span 
                    className="inline-block px-3 py-1 text-sm font-medium text-white rounded-full mb-3"
                    style={{ backgroundColor: getCategoryColor(detail.category) }}
                  >
                    {t(`infoPage.categories.${getCategoryKey(detail.category)}`)}
                  </span>
                  <h1 className="text-3xl font-bold text-gray-900 mb-4 leading-tight">
                    {detail.title}
                  </h1>
                  
                  {/* 작성자 정보 */}
                  <div className="flex items-center gap-1 text-sm text-gray-600 mb-4">
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                    </svg>
                    <span className="font-medium">{detail.userName}</span>
                    <span className="mx-2">•</span>
                    <span>{new Date(detail.createdAt).toLocaleDateString('ko-KR', {
                      year: 'numeric',
                      month: 'long',
                      day: 'numeric',
                    })}</span>
                    <span className="mx-2">•</span>
                    <span className="flex items-center gap-1">
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                      </svg>
                      {detail.views.toLocaleString()} {t('infoPage.content.views')}
                    </span>
                  </div>
                </div>

                {/* 본문 콘텐츠 */}
                <div className="prose prose-lg max-w-none">
                  <div className="article-content">
                    <EditorContent editor={editor} />
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* 오른쪽 사이드바 */}
          <aside className="w-80 space-y-6">
            {/* 목차 */}
            {tableOfContents.length > 0 && (
              <div className="bg-white rounded-lg border border-gray-200 p-6 sticky top-8">
                <h3 className="text-lg font-semibold text-gray-900 mb-4 pb-2 border-b border-gray-200">
📋 {t('infoPage.detail.tableOfContents')}
                </h3>
                <nav className="space-y-1 max-h-64 overflow-y-auto">
                  {tableOfContents.map((item) => (
                    <button
                      key={item.id}
                      onClick={() => {
                        // 먼저 DOM에서 헤딩 요소를 찾아보기
                        let element = document.getElementById(item.id);
                        
                        // ID로 찾을 수 없으면 텍스트로 찾기
                        if (!element) {
                          const headings = document.querySelectorAll('.article-content h1, .article-content h2, .article-content h3, .article-content h4, .article-content h5, .article-content h6');
                          headings.forEach((heading, index) => {
                            if (heading.textContent?.trim() === item.text) {
                              heading.id = item.id; // ID 설정
                              element = heading as HTMLElement;
                            }
                          });
                        }
                        
                        if (element) {
                          const yOffset = -80;
                          const y = element.getBoundingClientRect().top + window.pageYOffset + yOffset;
                          window.scrollTo({ top: y, behavior: 'smooth' });
                        } else {
                          console.warn('헤딩 요소를 찾을 수 없습니다:', item.text);
                        }
                      }}
                      className={`block w-full text-left py-2 px-3 rounded text-sm transition-all duration-200 ${
                        activeHeading === item.id
                          ? 'bg-blue-100 text-blue-700 font-medium border-l-2 border-blue-500'
                          : 'text-gray-600 hover:text-gray-900 hover:bg-gray-50'
                      }`}
                      style={{
                        paddingLeft: `${(item.level - 1) * 12 + 12}px`,
                      }}
                    >
                      <div className="flex items-center gap-2">
                        <span className="opacity-50">
                          {item.level === 1 && '●'}
                          {item.level === 2 && '○'}
                          {item.level === 3 && '▸'}
                          {item.level >= 4 && '·'}
                        </span>
                        <span className="truncate">{item.text}</span>
                      </div>
                    </button>
                  ))}
                </nav>
              </div>
            )}

            {/* 이 글 정보 */}
            <div className="bg-white rounded-lg border border-gray-200 p-6" style={{ position: 'sticky', top: tableOfContents.length > 0 ? '24rem' : '2rem' }}>
                              <h3 className="text-lg font-semibold text-gray-900 mb-4 pb-2 border-b border-gray-200">
                  {t('infoPage.detail.usefulFeatures')}
              </h3>
              
              <div className="space-y-4">
                <div>
                  <p className="text-sm font-medium text-gray-700 mb-1">{t('infoPage.categories.title')}</p>
                  <span 
                    className="inline-block px-2 py-1 text-xs font-medium text-white rounded"
                    style={{ backgroundColor: getCategoryColor(detail.category) }}
                  >
                    {t(`infoPage.categories.${getCategoryKey(detail.category)}`)}
                  </span>
                </div>
                
                <div>
                  <p className="text-sm font-medium text-gray-700 mb-1">{t('infoPage.content.author')}</p>
                  <p className="text-sm text-gray-600">{detail.userName}</p>
                </div>
                
                <div>
                  <p className="text-sm font-medium text-gray-700 mb-1">{t('infoPage.content.createdAt')}</p>
                  <p className="text-sm text-gray-600">
                    {new Date(detail.createdAt).toLocaleDateString('ko-KR', {
                      year: 'numeric',
                      month: 'long',
                      day: 'numeric',
                    })}
                  </p>
                </div>
                
                <div>
                  <p className="text-sm font-medium text-gray-700 mb-1">{t('infoPage.content.views')}</p>
                  <p className="text-sm text-gray-600">{detail.views.toLocaleString()}</p>
                </div>
              </div>



              {/* 북마크 및 유용한 기능들 */}
              <div className="mt-6 pt-6 border-t border-gray-200">
                <h4 className="font-medium text-gray-900 mb-3">{t('infoPage.detail.usefulFeatures')}</h4>
                <div className="space-y-2">
                  <button 
                    onClick={() => {
                      // 북마크 기능 (목록 페이지와 동일한 로컬스토리지 키 사용)
                      const bookmarks = JSON.parse(localStorage.getItem('bookmarkedIds') || '[]');
                      const currentId = detail.informationId;
                      
                      if (isBookmarked) {
                        const newBookmarks = bookmarks.filter((id: number) => id !== currentId);
                        localStorage.setItem('bookmarkedIds', JSON.stringify(newBookmarks));
                        setIsBookmarked(false);
                        alert(t('infoPage.detail.bookmarkRemoved'));
                      } else {
                        bookmarks.push(currentId);
                        localStorage.setItem('bookmarkedIds', JSON.stringify(bookmarks));
                        setIsBookmarked(true);
                        alert(t('infoPage.detail.bookmarkAdded'));
                      }
                    }}
                    className={`w-full py-2 px-3 rounded text-sm transition-colors flex items-center justify-center gap-2 ${
                      isBookmarked 
                        ? 'bg-yellow-100 text-yellow-800 hover:bg-yellow-200' 
                        : 'bg-yellow-50 text-yellow-700 hover:bg-yellow-100'
                    }`}
                  >
                    <svg className="w-4 h-4" fill={isBookmarked ? "currentColor" : "none"} stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 5a2 2 0 012-2h10a2 2 0 012 2v16l-7-3.5L5 21V5z" />
                    </svg>
                    {isBookmarked ? `✅ ${t('infoPage.actions.bookmark')}` : `🔖 ${t('infoPage.actions.bookmark')}`}
                  </button>
                  
                  <button 
                    onClick={() => {
                      const text = `${detail.title}\n\n${window.location.href}\n\n한국 생활 정보 - EUM 커뮤니티에서 공유`;
                      if (navigator.share) {
                        navigator.share({
                          title: detail.title,
                          text: '유용한 한국 생활 정보입니다.',
                          url: window.location.href
                        });
                      } else {
                        navigator.clipboard.writeText(text);
                        alert(t('infoPage.detail.shareSuccess'));
                      }
                    }}
                    className="w-full py-2 px-3 bg-blue-50 text-blue-700 rounded text-sm hover:bg-blue-100 transition-colors flex items-center justify-center gap-2"
                  >
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.316a3 3 0 105.367 2.684 3 3 0 00-5.367-2.684z" />
                    </svg>
                    {t('infoPage.actions.share')}
                  </button>
                  
                  <button 
                    onClick={() => {
                      const printContent = document.querySelector('.article-content')?.innerHTML || '';
                      const printWindow = window.open('', '_blank');
                      if (printWindow) {
                        printWindow.document.write(`
                          <html>
                            <head>
                              <title>${detail.title}</title>
                              <style>
                                body { font-family: 'Noto Sans KR', sans-serif; line-height: 1.6; margin: 40px; }
                                h1, h2, h3 { color: #1f2937; margin-top: 2em; margin-bottom: 1em; }
                                p { margin-bottom: 1em; }
                                img { max-width: 100%; height: auto; }
                                .header { border-bottom: 2px solid #e5e7eb; padding-bottom: 20px; margin-bottom: 30px; }
                                .meta { color: #6b7280; font-size: 14px; margin-top: 10px; }
                              </style>
                            </head>
                            <body>
                              <div class="header">
                                <h1>${detail.title}</h1>
                                <div class="meta">
                                  카테고리: ${detail.category} | 작성자: ${detail.userName} | 
                                  작성일: ${new Date(detail.createdAt).toLocaleDateString('ko-KR')}
                                </div>
                              </div>
                              <div class="content">${printContent}</div>
                            </body>
                          </html>
                        `);
                        printWindow.document.close();
                        printWindow.print();
                      }
                    }}
                    className="w-full py-2 px-3 bg-green-50 text-green-700 rounded text-sm hover:bg-green-100 transition-colors flex items-center justify-center gap-2"
                  >
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 17h2a2 2 0 002-2v-4a2 2 0 00-2-2H5a2 2 0 00-2 2v4a2 2 0 002 2h2m2 4h6a2 2 0 002-2v-6a2 2 0 00-2-2H9a2 2 0 00-2 2v6a2 2 0 002 2z" />
                    </svg>
                    {t('infoPage.actions.print')}
                  </button>
                </div>
              </div>

              {/* 관련 카테고리 정보 */}
              <div className="mt-6 pt-6 border-t border-gray-200">
                <h4 className="font-medium text-gray-900 mb-3">
                  <span className="flex items-center gap-2">
                    📂 {t('infoPage.detail.relatedInfo')}
                  </span>
                </h4>
                <div className="space-y-3">
                  <div className="bg-gray-50 rounded-lg p-3">
                    <p className="text-sm text-gray-700 mb-2">
                      {t('infoPage.detail.moreInfoNeeded', { category: t(`infoPage.categories.${getCategoryKey(detail.category)}`) })}
                    </p>
                                         <button 
                       onClick={() => {
                         // URL을 통해 카테고리 필터링하여 이동
                         navigate('/info', { 
                           state: { selectedCategory: getCategoryKey(detail.category) }
                         });
                       }}
                       className="text-sm text-blue-600 hover:text-blue-800 font-medium"
                     >
                       → {t('infoPage.detail.viewAllCategory', { category: t(`infoPage.categories.${getCategoryKey(detail.category)}`) })}
                     </button>
                  </div>
                  
                  {getCategoryKey(detail.category) === 'visa' && (
                    <div className="bg-blue-50 rounded-lg p-3">
                      <p className="text-sm font-medium text-blue-800 mb-1">💡 {t('infoPage.detail.recommendedSites')}</p>
                      <a 
                        href="https://www.hikorea.go.kr" 
                        target="_blank" 
                        rel="noopener noreferrer"
                        className="text-sm text-blue-600 hover:underline"
                      >
                        {t('infoPage.sidebar.hikorea.title')} ({t('infoPage.sidebar.hikorea.subtitle')})
                      </a>
                    </div>
                  )}
                  
                  {getCategoryKey(detail.category) === 'healthcare' && (
                    <div className="bg-red-50 rounded-lg p-3">
                      <p className="text-sm font-medium text-red-800 mb-1">🏥 {t('infoPage.detail.emergencyInfo')}</p>
                      <p className="text-sm text-red-600">{t('infoPage.detail.emergencyNumbers')}</p>
                    </div>
                  )}
                  
                  {getCategoryKey(detail.category) === 'employment' && (
                    <div className="bg-green-50 rounded-lg p-3">
                      <p className="text-sm font-medium text-green-800 mb-1">💼 {t('infoPage.detail.employmentSupport')}</p>
                      <a 
                        href="https://www.work.go.kr" 
                        target="_blank" 
                        rel="noopener noreferrer"
                        className="text-sm text-green-600 hover:underline"
                      >
                        {t('infoPage.sidebar.worknet.title')} ({t('infoPage.sidebar.worknet.subtitle')})
                      </a>
                    </div>
                  )}
                  
                  {getCategoryKey(detail.category) === 'housing' && (
                    <div className="bg-orange-50 rounded-lg p-3">
                      <p className="text-sm font-medium text-orange-800 mb-1">🏠 {t('infoPage.detail.housingSupport')}</p>
                      <p className="text-sm text-orange-600">{t('infoPage.detail.housingDispute')}</p>
                    </div>
                  )}
                  
                  {getCategoryKey(detail.category) === 'education' && (
                    <div className="bg-purple-50 rounded-lg p-3">
                      <p className="text-sm font-medium text-purple-800 mb-1">🎓 {t('infoPage.detail.educationSupport')}</p>
                      <p className="text-sm text-purple-600">{t('infoPage.detail.koreanLearning')}</p>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </aside>
        </div>
      </div>

      <style>{`
        .article-content .ProseMirror {
          outline: none;
          font-size: 16px;
          line-height: 1.8;
          color: #374151;
        }
        
        .article-content h1,
        .article-content h2,
        .article-content h3,
        .article-content h4,
        .article-content h5,
        .article-content h6 {
          font-weight: 600;
          margin-top: 2em;
          margin-bottom: 1em;
          color: #1f2937;
          scroll-margin-top: 100px;
          border-left: 4px solid transparent;
          padding-left: 16px;
          transition: border-color 0.3s ease;
        }
        
        .article-content h1:target,
        .article-content h2:target,
        .article-content h3:target,
        .article-content h4:target,
        .article-content h5:target,
        .article-content h6:target {
          border-left-color: #3b82f6;
          background-color: #eff6ff;
          margin-left: -16px;
          padding-left: 32px;
          border-radius: 0 8px 8px 0;
        }
        
        .article-content h1 { font-size: 2em; }
        .article-content h2 { font-size: 1.5em; }
        .article-content h3 { font-size: 1.25em; }
        
        .article-content p {
          margin-bottom: 1.5em;
        }
        
        .article-content ul,
        .article-content ol {
          padding-left: 1.5em;
          margin-bottom: 1.5em;
        }
        
        .article-content li {
          margin-bottom: 0.5em;
        }
        
        .article-content blockquote {
          border-left: 4px solid #3b82f6;
          padding-left: 1em;
          margin-left: 0;
          font-style: italic;
          color: #6b7280;
          background-color: #f8fafc;
          padding: 1.5em;
          border-radius: 0 8px 8px 0;
          margin: 2em 0;
        }
        
        .article-content code {
          background-color: #f3f4f6;
          padding: 0.2em 0.4em;
          border-radius: 4px;
          font-size: 0.9em;
          font-family: 'Monaco', 'Menlo', 'Ubuntu Mono', monospace;
        }
        
        .article-content pre {
          background-color: #f3f4f6;
          padding: 1.5em;
          border-radius: 8px;
          overflow: auto;
          margin: 2em 0;
        }
        
        .article-content pre code {
          background-color: transparent;
          padding: 0;
        }
        
        .article-content img {
          max-width: 100%;
          height: auto;
          border-radius: 8px;
          box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1);
          margin: 2em 0;
        }
        
        .article-content a {
          color: #3b82f6;
          text-decoration: none;
        }
        
        .article-content a:hover {
          text-decoration: underline;
        }
        
        .article-content table {
          width: 100%;
          border-collapse: collapse;
          margin: 2em 0;
        }
        
        .article-content th,
        .article-content td {
          border: 1px solid #d1d5db;
          padding: 0.75em;
          text-align: left;
        }
        
        .article-content th {
          background-color: #f9fafb;
          font-weight: 600;
        }
      `}</style>
    </div>
  );
}
