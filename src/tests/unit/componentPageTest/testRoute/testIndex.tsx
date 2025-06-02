import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Home from '@/tests/unit/componentPageTest/testPages/Home';
import AiAssistant from '@/tests/unit/componentPageTest/testPages/AiAssistant';
import Community from '@/tests/unit/componentPageTest/testPages/Community';
import Debate from '@/tests/unit/componentPageTest/testPages/Debate';
import Info from '@/tests/unit/componentPageTest/testPages/Info';
import MyPage from '@/tests/unit/componentPageTest/testPages/MyPage';
import AdminPage from '@/tests/unit/componentPageTest/testPages/AdminPage';
import NotFound from '../testPages/NotFound';
import LoadingOverLay from '@/components/feedback/LoadingOverLay';
import Login from '@/tests/unit/componentPageTest/testPages/Login';
import Onboarding from '@/tests/unit/componentPageTest/testPages/Onboarding';
import CommunityGroup from '../testPages/CommunityGroup';
import CommunityGroupDetail from '../testPages/CommunityGroupDetail';
import CommunityBoard from '../testPages/CommunityBoard';
import CommunityBoardDetail from '../testPages/CommunityBoardDetail';
import PostArticle from '../testPages/PostArticle';

//import Search from '@/tests/unit/componentPageTest/testPages/Search';
//import TranslationLoading from '@/tests/unit/componentPageTest/testPages/TranslationLoading';

const TestAppRoutes = () => {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<LoadingOverLay isLoaded={false} />} />
        <Route path="/onboarding" element={<Onboarding />} />
        <Route path="/login" element={<Login />} />
        <Route path="/home" element={<Home />} />
        <Route path="/community" element={<Community />} />
        <Route path="/debate" element={<Debate />} />
        <Route path="/info" element={<Info />} />
        <Route path="/ai-assistant" element={<AiAssistant />} />
        <Route path="/mypage" element={<MyPage />} />
        <Route path="/adminpage" element={<AdminPage />} />
        <Route path="/*" element={<NotFound />} />
        <Route path="/community/write" element={<PostArticle />} />
        <Route path="/community/groups" element={<CommunityGroup />} />
        <Route path="/community/groups/:id" element={<CommunityGroupDetail />} />
        <Route path="/community/board" element={<CommunityBoard />} />
        <Route path="/community/board/:id" element={<CommunityBoardDetail />} />
      </Routes>
    </BrowserRouter>
  );
};

export default TestAppRoutes;
