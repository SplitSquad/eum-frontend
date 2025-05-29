import React, { useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useEditor } from '@tiptap/react';
import { SimpleEditor } from '@tiptap-editor/components/tiptap-templates/simple/simple-editor';
import { useInfoFormStore } from '@/features/info/store/InfoFormStore';
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
import { createInfo, updateInfo, uploadInfoImage, getInfoDetail } from '../api/infoApi';
import { useTranslation } from '@/shared/i18n';
import Button from '@mui/material/Button';
import IconButton from '@mui/material/IconButton';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import { seasonalColors } from '@/components/layout/springTheme';
import { useThemeStore } from '@/features/theme/store/themeStore';

const API_BASE = import.meta.env.VITE_API_BASE_URL || 'http://localhost:8080';

const getCategoryColor = (category: string) => {
  const colorMap: { [key: string]: string } = {
    '비자/법률': '#4CAF50',
    '취업/직장': '#2196F3',
    '주거/부동산': '#FF9800',
    교육: '#9C27B0',
    '의료/건강': '#F44336',
    '금융/세금': '#607D8B',
    교통: '#795548',
    쇼핑: '#E91E63',
  };
  return colorMap[category] || '#6B7280';
};

// 한국어 카테고리를 영어 키로 변환
const getCategoryKey = (koreanCategory: string): string => {
  const categoryMap: { [key: string]: string } = {
    '비자/법률': 'visa',
    '취업/직장': 'employment',
    '주거/부동산': 'housing',
    교육: 'education',
    '의료/건강': 'healthcare',
    '금융/세금': 'finance',
    교통: 'transportation',
    쇼핑: 'shopping',
  };
  return categoryMap[koreanCategory] || 'all';
};

// InfoListPage와 동일하게 카테고리 키 선언
const categoryKeys = [
  'education',
  'transportation',
  'finance',
  'visa',
  'shopping',
  'healthcare',
  'housing',
  'employment',
];

export default function InfoCreatePage() {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const { id } = useParams<{ id?: string }>();
  const isEdit = Boolean(id);
  const season = useThemeStore(state => state.season);

  const { title, setTitle, category, setCategory, content, setContent } = useInfoFormStore();

  // ADMIN 권한 체크
  useEffect(() => {
    const checkAdminPermission = () => {
      try {
        const stored = localStorage.getItem('auth-storage');
        if (!stored) {
          alert('로그인이 필요합니다.');
          navigate('/info');
          return;
        }

        const parsed = JSON.parse(stored);
        const role = parsed?.state?.user?.role;

        if (role !== 'ROLE_ADMIN') {
          alert('관리자만 접근할 수 있습니다.');
          navigate('/info');
          return;
        }
      } catch (error) {
        console.error('권한 확인 중 오류:', error);
        alert('권한 확인에 실패했습니다.');
        navigate('/info');
      }
    };

    checkAdminPermission();
  }, [navigate]);

  // 초기화: 새 글 작성 모드일 때만 빈 상태로
  useEffect(() => {
    if (!isEdit) {
      setTitle('');
      setCategory('');
      setContent(JSON.stringify({ type: 'doc', content: [] }));
    }
  }, [isEdit, setTitle, setCategory, setContent]);

  // 수정 모드일 때: 기존 데이터를 불러와 Zustand 스토어에 세팅
  useEffect(() => {
    if (!isEdit) return;
    (async () => {
      try {
        const data = await getInfoDetail(id!);
        setTitle(data.title);
        setCategory(data.category);
        setContent(data.content); // JSON 문자열
      } catch (err) {
        console.error('기존 글 불러오기 실패:', err);
      }
    })();
  }, [isEdit, id, setTitle, setCategory, setContent]);

  // Tiptap 에디터 설정
  const editor = useEditor({
    immediatelyRender: false,
    editable: true,
    content: content ? JSON.parse(content) : '',
    editorProps: {
      attributes: {
        autocomplete: 'off',
        autocorrect: 'off',
        autocapitalize: 'off',
        'aria-label': '본문 입력 영역',
        class: 'prose focus:outline-none',
      },
      handleDOMEvents: {
        keydown: (view, event) => {
          if (event.key === 'Enter') {
            setTimeout(() => {
              document.body.scrollTo({ top: document.body.scrollHeight / 2, behavior: 'smooth' });
            }, 150);
          }
          return false;
        },
      },
    },
    extensions: [
      StarterKit,
      TextAlign.configure({ types: ['heading', 'paragraph'] }),
      Underline,
      TaskList,
      TaskItem.configure({ nested: true }),
      Highlight.configure({ multicolor: true }),
      Image,
      Typography,
      Superscript,
      Subscript,
      Selection,
      ImageUploadNode.configure({
        accept: 'image/*',
        maxSize: MAX_FILE_SIZE,
        limit: 3,
        upload: uploadInfoImage,
      }),
      TrailingNode,
      Link.configure({ openOnClick: false }),
    ],
    onUpdate({ editor }) {
      setContent(JSON.stringify(editor.getJSON()));
    },
  });

  // `content`가 바뀌면 에디터에 반영
  useEffect(() => {
    if (editor && content) {
      editor.commands.setContent(JSON.parse(content));
    }
  }, [editor, content]);

  if (!editor) return null;

  // 제출 핸들러: POST vs PATCH 분기
  const handleSubmit = async () => {
    try {
      // 에디터 JSON에서 이미지 URL만 뽑아서 배열로
      const doc = JSON.parse(content) as {
        type: string;
        content: Array<{ type: string; attrs?: { src?: string } }>;
      };
      const imgs = doc.content
        .filter(node => node.type === 'image' && node.attrs?.src)
        .map(node => node.attrs!.src!);

      if (isEdit) {
        await updateInfo({ id: id!, title, content, files: imgs });
        navigate(`/info/${id}`);
      } else {
        await createInfo({ title, content, category, files: imgs });
        navigate('/info');
      }
    } catch (err) {
      console.error(isEdit ? '게시글 수정 실패:' : '게시글 등록 실패:', err);
      alert(isEdit ? '수정에 실패했습니다.' : '등록에 실패했습니다.');
    }
  };

  return (
    <div
      style={{
        maxWidth: '48rem',
        margin: '0 auto',
        background: seasonalColors[season].background,
        padding: '2rem',
        borderRadius: '1rem',
        boxShadow: '0 8px 32px 0 rgba(60,60,60,0.10)',
        marginTop: '2.5rem',
      }}
    >
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          marginBottom: '1.5rem',
        }}
      >
        <IconButton
          aria-label={t('infoPage.detail.back')}
          onClick={() => navigate(-1)}
          sx={{ color: '#888', mr: 2 }}
        >
          <ArrowBackIcon />
        </IconButton>
        <h2
          style={{
            fontSize: '2rem',
            fontWeight: 700,
            color: seasonalColors[season].primary,
            textAlign: 'center',
            flex: 1,
          }}
        >
          {isEdit ? t('infoPage.editTitle') : t('infoPage.createTitle')}
        </h2>
        <div style={{ width: 48 }} />
      </div>
      {/* 제목 */}
      <input
        type="text"
        value={title}
        onChange={e => setTitle(e.target.value)}
        placeholder={t('infoPage.form.titlePlaceholder')}
        className="w-full border border-gray-300 rounded-lg px-4 py-3 mb-5 focus:outline-none focus:ring-2 focus:ring-blue-400 text-lg"
      />
      {/* 카테고리 */}
      <select
        value={category || ''}
        onChange={e => setCategory(e.target.value)}
        className="w-full border border-gray-300 rounded-lg px-4 py-3 mb-6 focus:outline-none focus:ring-2 focus:ring-blue-400 text-base"
      >
        <option value="" disabled>
          {t('infoPage.form.categoryPlaceholder')}
        </option>
        {categoryKeys.map(key => (
          <option key={key} value={key}>
            {t(`infoPage.categories.${key}`)}
          </option>
        ))}
      </select>
      {/* 카테고리 뱃지 */}
      {category && (
        <div
          style={{
            display: 'flex',
            justifyContent: 'flex-start',
            alignItems: 'center',
            marginBottom: '1.5rem',
          }}
        >
          <span
            style={{
              background: seasonalColors[season].primary,
              color: '#fff',
              borderRadius: '999px',
              padding: '0.35em 1.2em',
              fontWeight: 600,
              fontSize: '1rem',
              letterSpacing: '0.01em',
              boxShadow: '0 1px 4px rgba(60,60,60,0.08)',
              display: 'inline-block',
            }}
          >
            {t(`infoPage.categories.${category}`)}
          </span>
        </div>
      )}
      {/* 본문 에디터 */}
      <div className="border border-gray-200 rounded-lg p-4 mb-8 min-h-[400px] bg-gray-50">
        <SimpleEditor editor={editor} />
      </div>
      {/* 제출 버튼 */}
      <div style={{ display: 'flex', justifyContent: 'flex-end', marginTop: '2rem' }}>
        <Button
          variant="contained"
          color="primary"
          size="large"
          onClick={handleSubmit}
          sx={{
            borderRadius: 2,
            fontWeight: 600,
            fontSize: '1.125rem',
            py: 1.5,
            boxShadow: 'none',
            textTransform: 'none',
            minWidth: 160,
          }}
        >
          {isEdit ? t('infoPage.form.editButton') : t('infoPage.form.createButton')}
        </Button>
      </div>
    </div>
  );
}
