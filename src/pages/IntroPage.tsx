// src/pages/IntroPage.tsx
import { useNavigate } from 'react-router-dom';
import { X, Gift } from 'lucide-react';

const IntroPage = () => {
  const navigate = useNavigate();

  return (
    <div className="flex flex-col h-full bg-white relative animate-fade-in">
      
      {/* 1. 상단 헤더 (모달 느낌) */}
      <div className="h-14 flex items-center justify-center relative border-b border-gray-100">
        <button 
          onClick={() => navigate(-1)} 
          className="absolute left-4 p-1 hover:bg-gray-100 rounded-full"
        >
          <X size={24} className="text-black" />
        </button>
        <span className="font-bold text-lg">하루선물</span>
      </div>

      {/* 2. 메인 컨텐츠 영역 */}
      <div className="flex-1 flex flex-col items-center justify-center p-8 pb-20">
        
        {/* 카드 이미지 영역 */}
        <div className="w-full aspect-[4/5] bg-gray-50 rounded-2xl mb-8 shadow-lg overflow-hidden relative group">
          <img 
            src="https://images.unsplash.com/photo-1513201099705-a9746e1e201f?q=80&w=1000&auto=format&fit=crop" 
            alt="Gift" 
            className="w-full h-full object-cover opacity-90 group-hover:scale-105 transition-transform duration-700"
          />
          <div className="absolute inset-0 bg-black/10"></div>
          
          {/* 중앙 아이콘/텍스트 */}
          <div className="absolute inset-0 flex flex-col items-center justify-center text-white text-center p-6">
            <div className="w-16 h-16 bg-white/20 backdrop-blur-md rounded-full flex items-center justify-center mb-4 border border-white/30">
              <Gift size={32} className="text-white" />
            </div>
            <h2 className="text-2xl font-bold mb-2 shadow-sm">특별한 하루를<br/>선물하세요</h2>
            <p className="text-sm opacity-90 font-light">
              평범한 데이트가 고민이신가요?<br/>
              상대방의 취향을 분석해<br/>
              완벽한 코스를 짜드립니다.
            </p>
          </div>
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