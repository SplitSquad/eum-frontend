import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Home from '@/pages/Home';
import Login from '@/pages/Login';
import AiAssistant from '@/pages/AiAssistant';
import Community from '@/pages/Community';
import CommunityDetail from '@/pages/CommunityDetail';
import Debate from '@/pages/Debate';
import DebateDetail from '@/pages/DebateDetail';
import Info from '@/pages/Info';
import InfoDetail from '@/pages/InfoDetail';
import Loading from '@/pages/Loading';
import MyPage from '@/pages/MyPage';
import NotFound from '@/pages/NotFound';
import Onboarding from '@/pages/Onboarding';
//import Search from '@/pages/Search';
//import TranslationLoading from '@/pages/TranslationLoading';

const AppRoutes = () => {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Loading />} />
        <Route path="/home" element={<Home />} />
        <Route path="/login" element={<Login />} />
        <Route path="/community" element={<Community />} />
        <Route path="/community/:id" element={<CommunityDetail />} />
        <Route path="/debate" element={<Debate />} />
        <Route path="/debate/:id" element={<DebateDetail />} />
        <Route path="/info" element={<Info />} />
        <Route path="/info/:id" element={<InfoDetail />} />
        <Route path="/onboarding" element={<Onboarding />} />
        <Route path="/ai-assistant" element={<AiAssistant />} />
        <Route path="/mypage" element={<MyPage />} />
        <Route path="*" element={<NotFound />} />
      </Routes>
    </BrowserRouter>
  );
};

export default AppRoutes;
