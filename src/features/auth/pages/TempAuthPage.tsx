// src/features/auth/TempAuthPage.tsx
import React, { useState } from 'react';
import { tempJoin, tempLogin } from '../api';
import { useNavigate } from 'react-router-dom';
import { Button, TextField, Box, Typography } from '@mui/material';

export default function TempAuthPage() {
  const [name, setName] = useState<string>('');
  const [nation, setNation] = useState<string>('KR');
  const [language, setLanguage] = useState<string>('KO');
  const [address, setAddress] = useState<string>('');
  // 문자열로 입력값 관리
  const [userId, setUserId] = useState<string>('');
  const navigate = useNavigate();

  const handleJoin = async () => {
    const id = Number(userId);
    console.log(id, nation, language, address, name);
    if (isNaN(id) || id <= 0) {
      return alert('유효한 userId(숫자)를 입력해주세요.');
    }
    try {
      await tempJoin(id, nation, language, address, name);
      alert('가입 완료! 발급된 userId로 로그인해주세요.');
    } catch (e) {
      console.error(e);

      alert('회원가입 실패');
    }
  };

  const handleLogin = async () => {
    const id = Number(userId);
    if (isNaN(id) || id <= 0) {
      return alert('유효한 userId(숫자)를 입력해주세요.');
    }

    try {
      await tempLogin(id);
      navigate('/community');
    } catch (e) {
      console.error(e);
      alert('로그인 실패');
    }
  };

  return (
    <Box
      sx={{
        maxWidth: 400,
        mx: 'auto',
        mt: 5,
        display: 'flex',
        flexDirection: 'column',
        gap: 2,
      }}
    >
      {/* 회원가입 섹션 */}
      <Typography variant="h5">임시 회원가입</Typography>
      <TextField label="이름" value={name} onChange={e => setName(e.target.value)} fullWidth />
      <TextField
        label="유저id (숫자)"
        type="number"
        value={userId}
        onChange={e => setUserId(e.target.value)}
        fullWidth
      />
      <TextField
        label="국가 (nation)"
        value={nation}
        onChange={e => setNation(e.target.value)}
        fullWidth
      />
      <TextField
        label="언어 (language)"
        value={language}
        onChange={e => setLanguage(e.target.value)}
        fullWidth
      />
      <TextField
        label="주소 (address)"
        value={address}
        onChange={e => setAddress(e.target.value)}
        fullWidth
      />
      <Button variant="contained" onClick={handleJoin}>
        회원가입
      </Button>

      {/* 로그인 섹션 */}
      <Typography variant="h5" sx={{ mt: 4 }}>
        임시 로그인
      </Typography>
      <TextField
        label="User ID"
        type="number"
        value={userId}
        onChange={e => setUserId(e.target.value)}
        fullWidth
      />
      <Button variant="contained" onClick={handleLogin}>
        로그인
      </Button>
    </Box>
  );
}
