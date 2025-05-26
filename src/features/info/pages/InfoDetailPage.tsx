import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
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
import { useTranslation } from '@/shared/i18n/index';
import koTranslations from '@/shared/i18n/translations/ko';

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

const API_BASE = import.meta.env.VITE_API_BASE_URL || 'http://localhost:8080';

export default function InfoDetailPage() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [detail, setDetail] = useState<InfoDetail | null>(null);
  const [isAdmin, setIsAdmin] = useState(false);
  const { t } = useTranslation();

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

  // 상세 데이터 fetch 및 웹로그 발송
  useEffect(() => {
    if (!id) return;
    (async () => {
      try {
        const token = localStorage.getItem('auth_token') || '';
        const res = await fetch(`${API_BASE}/information/${id}`, {
          headers: { Authorization: token },
        });
        if (!res.ok) throw new Error(res.statusText);
        const data: InfoDetail = await res.json();

        // 웹로그 전송
        const userId = getUserId() || 0;
        const logPayload = {
          UID: userId,
          ClickPath: window.location.pathname,
          TAG: data.category,
          CurrentPath: window.location.pathname,
          Event: 'click',
          Content: null,
          Timestamp: new Date().toISOString(),
        };
        sendWebLog({ userId, content: JSON.stringify(logPayload) });

        setDetail(data);
      } catch (err) {
        console.error('상세 정보 조회 실패:', err);
      }
    })();
  }, [id]);

  // 에디터에 콘텐츠 설정
  useEffect(() => {
    if (editor && detail) {
      const doc = JSON.parse(detail.content) as JSONContent;
      queueMicrotask(() => {
        editor.commands.setContent(doc);
      });
    }
  }, [editor, detail]);

  const handleEdit = () => {
    navigate(`/info/edit/${id}`);
  };

  const handleDelete = async () => {
    if (!window.confirm(t('info.deleteConfirm'))) return;
    try {
      const token = localStorage.getItem('auth_token') || '';
      const res = await fetch(`${API_BASE}/information/${id}`, {
        method: 'DELETE',
        headers: { Authorization: token },
      });
      if (!res.ok) throw new Error(`삭제 실패: ${res.status}`);
      navigate('..');
    } catch (err) {
      console.error('삭제 중 오류 발생:', err);
      alert(t('info.deleteFailed'));
    }
  };

  if (!detail) return <div>로딩 중…</div>;

  return (
    <div className="mt-4 max-w-3xl mx-auto p-6 bg-white rounded-lg shadow max-h-[80vh] overflow-auto">
      <div className="flex justify-end space-x-2 mb-4">
        {isAdmin && (
          <>
            <button
              onClick={handleEdit}
              className="px-3 py-1 bg-yellow-500 hover:bg-yellow-600 text-white rounded"
            >
              {t('info.edit')}
            </button>
            <button
              onClick={handleDelete}
              className="px-3 py-1 bg-red-500 hover:bg-red-600 text-white rounded"
            >
              {t('info.delete')}
            </button>
          </>
        )}
      </div>

      <h1 className="text-2xl font-bold mb-2">{detail.title}</h1>
      <p className="text-sm text-gray-500 mb-4">
        {detail.userName} · {detail.createdAt} · {t('info.view')} {detail.views}
      </p>

      <div className="prose">
        <EditorContent editor={editor} />
      </div>
    </div>
  );
}
