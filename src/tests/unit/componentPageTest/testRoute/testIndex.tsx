import { BrowserRouter, Routes, Route, Outlet } from 'react-router-dom';
import Home from '@/tests/unit/componentPageTest/testPages/Home';
import AiAssistant from '@/tests/unit/componentPageTest/testPages/AiAssistant';
import Community from '@/tests/unit/componentPageTest/testPages/Community';
import Debate from '@/tests/unit/componentPageTest/testPages/Debate';
import Info from '@/tests/unit/componentPageTest/testPages/Info';
import MyPage from '@/tests/unit/componentPageTest/testPages/MyPage';
import NotFound from '../testPages/NotFound';
import TempAuthPage from '@/features/auth/pages/TempAuthPage';
import CommunityCreate from '@/features/community/pages/PostCreateEditPage';
import CommunityDetail from '@/features/community/pages/PostDetailPage';
import AppLayout from '@/components/layout/AppLayout';

//import Search from '@/tests/unit/componentPageTest/testPages/Search';
//import TranslationLoading from '@/tests/unit/componentPageTest/testPages/TranslationLoading';

const AllLayout = () => (
  <AppLayout>
    <Outlet />
  </AppLayout>
);

const TestAppRoutes = () => {
  return (
    <BrowserRouter>
      <Routes>
        <Route element={<AllLayout />}>
          <Route path="/home" element={<Home />} />
          <Route path="/login" element={<TempAuthPage />} />

          {/* 커뮤니티 목록 */}
          <Route path="/community" element={<Community />} />
          {/* 게시글 작성 페이지 */}
          <Route path="/community/create" element={<CommunityCreate />} />
          {/* 게시글 상세 페이지 (/community/123 혹은 /community/post/123) */}
          <Route path="/community/:postId" element={<CommunityDetail />} />

          <Route path="/debate" element={<Debate />} />
          <Route path="/info" element={<Info />} />
          <Route path="/ai-assistant" element={<AiAssistant />} />
          <Route path="/mypage" element={<MyPage />} />
        </Route>
        {/*  그 외는 404 */}
        <Route path="/*" element={<NotFound />} />
      </Routes>
    </BrowserRouter>
  );
};

export default TestAppRoutes;
