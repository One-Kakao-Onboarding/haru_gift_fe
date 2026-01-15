// src/pages/IntroPage.tsx
import { useNavigate } from 'react-router-dom';
import { X, Menu } from 'lucide-react';
import introPoster from '../assets/intro_poster.svg';

const IntroPage = () => {
  const navigate = useNavigate();

  return (
    <div className="flex flex-col h-full bg-white relative animate-fade-in font-kakao">
      
      {/* 1. 상단 헤더 (모달 느낌) */}
      <div className="h-14 flex items-center justify-center relative">
        <button
          onClick={() => navigate(-1)}
          className="absolute left-4 p-1 hover:bg-gray-100 rounded-full"
        >
          <X size={24} className="text-black" />
        </button>
        <span className="font-bold text-lg">하루선물</span>
        <button
          onClick={() => {}}
          className="absolute right-4 p-1 hover:bg-gray-100 rounded-full"
        >
          <Menu size={24} className="text-black" />
        </button>
      </div>

      {/* 2. 메인 컨텐츠 영역 */}
      <div className="flex-1 flex flex-col items-center justify-center p-8 pb-20">
        
        {/* 카드 이미지 영역 */}
        <div className="w-full mb-8">
          <img
            src={introPoster}
            alt="하루선물 소개"
            className="w-full h-auto"
          />
        </div>

      </div>

      {/* 3. 하단 CTA 버튼 */}
      <div className="p-4 pb-8 absolute bottom-0 w-full bg-white">
        <button 
          onClick={() => navigate('/planner')} // 다음 단계(입력)로 이동
          className="w-full bg-[#FEE500] text-black font-bold py-4 rounded-xl text-lg hover:bg-yellow-400 transition-colors shadow-sm"
        >
          시작하기
        </button>
      </div>

    </div>
  );
};

export default IntroPage;