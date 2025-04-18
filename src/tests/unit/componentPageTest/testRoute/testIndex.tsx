import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Home from '@/tests/unit/componentPageTest/testPages/Home';
import AiAssistant from '@/tests/unit/componentPageTest/testPages/AiAssistant';
import Community from '@/tests/unit/componentPageTest/testPages/Community';
import Debate from '@/tests/unit/componentPageTest/testPages/Debate';
import Info from '@/tests/unit/componentPageTest/testPages/Info';
import MyPage from '@/tests/unit/componentPageTest/testPages/MyPage';
import NotFound from '../testPages/NotFound';

//import Search from '@/tests/unit/componentPageTest/testPages/Search';
//import TranslationLoading from '@/tests/unit/componentPageTest/testPages/TranslationLoading';

const TestAppRoutes = () => {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/home" element={<Home />} />
        <Route path="/community" element={<Community />} />
        <Route path="/debate" element={<Debate />} />
        <Route path="/info" element={<Info />} />
        <Route path="/ai-assistant" element={<AiAssistant />} />
        <Route path="/mypage" element={<MyPage />} />
        <Route path="/*" element={<NotFound />} />
      </Routes>
    </BrowserRouter>
  );
};

export default TestAppRoutes;
