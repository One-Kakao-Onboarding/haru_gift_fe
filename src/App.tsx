// src/App.tsx
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import ChatPage from './pages/ChatPage.tsx';
import ResultPage from './pages/ResultPage.tsx';
import IntroPage from './pages/IntroPage.tsx';
import PlannerPage from './pages/PlannerPage.tsx';
import ChatEditPage from './pages/ChatEditPage.tsx';
import PlaceDetailPage from './pages/PlaceDetailPage.tsx';
import CourseMapPage from './pages/CourseMapPage.tsx';
import LetterWritePage from './pages/LetterWritePage.tsx';

function App() {
  return (
    // 배경은 어둡게, 앱은 중앙 정렬
    <div className="min-h-screen bg-gray-100 flex justify-center items-center">
      <div className="w-full max-w-[430px] h-[100vh] bg-white shadow-2xl overflow-hidden relative flex flex-col">
        
        {/* 상단 상태바 (가짜) */}
        <div className="h-6 bg-white flex justify-between px-4 text-xs items-center font-bold">
          <span>9:41</span>
          <div className="flex gap-1">
            <span>LTE</span>
            <span>🔋</span>
          </div>
        </div>

        {/* <BrowserRouter>
          <Routes>
            <Route path="/" element={<ChatPage />} />
            <Route path="/result" element={<ResultPage />} />
          </Routes>
        </BrowserRouter> */}
        <BrowserRouter>
          <Routes>
            <Route path="/" element={<ChatPage />} />
            <Route path="/intro" element={<IntroPage />} />
            <Route path="/planner" element={<PlannerPage />} />
            <Route path="/chat-edit" element={<ChatEditPage />} />
            <Route path="/place-detail" element={<PlaceDetailPage />} />
            <Route path="/result" element={<ResultPage />} />
            <Route path="/course-map" element={<CourseMapPage />} />
            <Route path="/letter-write" element={<LetterWritePage />} />
            <Route path="/gift-view" element={<ResultPage />} />
          </Routes>
        </BrowserRouter>
      
      </div>
    </div>
  );
}

export default App;