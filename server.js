// server.js
console.log('📢 Running server from:', __filename);

const express = require('express');
console.log('[DEBUG] express required');
const path = require('path');
console.log('[DEBUG] path required');
const app = express();
console.log('[DEBUG] app created');
const DIST_DIR = path.join(__dirname, 'dist');

// ① 빌드된 정적 파일 제공
app.use(express.static(DIST_DIR));

// ② 모든 요청을 index.html 로 전달
console.log('[ROUTE REGISTER] pattern:', '*');
app.all('/*splat', (req, res) => {
  res.sendFile(path.join(__dirname, 'dist', 'index.html'));
});

// ③ 서버 실행
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`SSR 아닌 CSR 테스트 서버 실행 중: http://localhost:${PORT}`);
});
