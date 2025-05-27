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

const API_BASE = import.meta.env.VITE_API_BASE_URL || 'http://localhost:8080';
const categoryOptions = [
  '관광/체험',
  '교통/이동',
  '부동산/계약',
  '문화/생활',
  '학사/캠퍼스',
  '비자/법률',
  '잡페어',
  '숙소/지역정보',
];

export default function InfoCreatePage() {
  const navigate = useNavigate();
  const { id } = useParams<{ id?: string }>();
  const isEdit = Boolean(id);

  const { title, setTitle, category, setCategory, content, setContent } = useInfoFormStore();

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
    <div className="max-w-3xl mx-auto bg-white p-6 rounded-lg shadow-lg">
      <h2 className="text-xl font-semibold mb-4">{isEdit ? '정보글 수정' : '정보글 작성'}</h2>

      {/* 제목 */}
      <input
        type="text"
        value={title}
        onChange={e => setTitle(e.target.value)}
        placeholder="제목을 입력하세요"
        className="w-full border border-gray-300 rounded-md px-4 py-2 mb-4 focus:outline-none focus:ring-2 focus:ring-blue-400"
      />

      {/* 카테고리 */}
      <select
        value={category || ''}
        onChange={e => setCategory(e.target.value)}
        className="w-full border border-gray-300 rounded-md px-4 py-2 mb-6 focus:outline-none focus:ring-2 focus:ring-blue-400"
      >
        <option value="" disabled>
          카테고리를 선택하세요
        </option>
        {categoryOptions.map(opt => (
          <option key={opt} value={opt}>
            {opt}
          </option>
        ))}
      </select>

      {/* 본문 에디터 */}
      <div className="border border-gray-200 rounded-md p-4 mb-6 min-h-[400px]">
        <SimpleEditor editor={editor} />
      </div>

      {/* 제출 버튼 */}
      <button
        onClick={handleSubmit}
        className="w-full bg-blue-600 hover:bg-blue-700 text-white font-medium py-2 rounded-md transition"
      >
        {isEdit ? '수정하기' : '작성하기'}
      </button>
    </div>
  );
}
