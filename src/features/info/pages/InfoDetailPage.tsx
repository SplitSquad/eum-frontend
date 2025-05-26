import React, { useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import InfoDetailHeader from '../components/InfoDetailHeader';
import InfoDetailBody from '../components/InfoDetailBody';
import { useInfoFormStore } from '../store/InfoFormStore';
import { deleteInfo } from '../api/infoApi';
import { Divider } from '@mui/material';

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

export default function InfoDetailPage() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { fetchAndSetDetail } = useInfoFormStore();

  // Fetch detail and set to store
  useEffect(() => {
    if (id) fetchAndSetDetail(id);
  }, [id, fetchAndSetDetail]);

  const handleEdit = () => {
    navigate(`/info/edit/${id}`);
  };

  const handleDelete = async () => {
    if (!window.confirm('정말 이 글을 삭제하시겠습니까?')) return;
    try {
      await deleteInfo(id!);
      navigate('..');
    } catch (err) {
      console.error('삭제 중 오류 발생:', err);
      alert('삭제에 실패했습니다.');
    }
  };

  return (
    <div className="h-auto w-auto bg-[rgba(255,255,255,0.95)] backdrop-blur-md mb-4">
      <InfoDetailHeader onEdit={handleEdit} onDelete={handleDelete} />
      <Divider sx={{ borderColor: '#e0e0e0' }} />
      <InfoDetailBody />
    </div>
  );
}
