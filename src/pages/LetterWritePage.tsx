// src/pages/LetterWritePage.tsx
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useItinerary } from '../context/ItineraryContext';
import { X } from 'lucide-react';

// 더미 키워드 (나중에 LLM이 대화에서 추출)
const HISTORY_KEYWORDS = [
  '조용한 곳을 좋아해서',
  '많이 걷지 않도록',
  '양식보다는 한식',
  '고즈넉한 서촌 골목',
  '1주년',
  '특별한 데이트',
  '닭요리 제외',
];

const LetterWritePage = () => {
  const navigate = useNavigate();
  const { itinerary, letter, setLetter } = useItinerary();

  // 로컬 상태로 편집 (완료 시 저장)
  const [localLetter, setLocalLetter] = useState(letter);

  const handleComplete = () => {
    setLetter(localLetter);
    navigate(-1);
  };

  if (!itinerary) return <div className="p-10 text-center">데이터가 없습니다 :(</div>;

  return (
    <div className="flex flex-col h-full bg-white">

      {/* 헤더 */}
      <div className="h-14 flex items-center justify-between px-4 border-b border-gray-100 bg-white sticky top-0 z-20">
        <button onClick={() => navigate(-1)} className="p-1">
          <X className="w-6 h-6 text-black" />
        </button>
        <span className="font-bold text-lg">편지쓰기</span>
        <button
          onClick={handleComplete}
          className="text-blue-500 font-bold text-sm"
        >
          완료
        </button>
      </div>

      {/* 메인 컨텐츠 */}
      <div className="flex-1 flex flex-col p-6 overflow-y-auto">

        {/* 타이틀 */}
        <h1 className="text-xl font-bold text-gray-900 mb-2">
          {itinerary.targetName}에게
        </h1>
        <p className="text-gray-400 text-sm mb-6">
          소중한 하루에 대한 설명과 마음이 담긴 편지를 작성해보세요
        </p>

        {/* 편지 입력 영역 */}
        <textarea
          value={localLetter}
          onChange={(e) => setLocalLetter(e.target.value)}
          placeholder="여기에 마음을 담아 편지를 써보세요..."
          className="flex-1 w-full bg-gray-50 border border-gray-100 rounded-xl p-4 text-sm resize-none focus:outline-none focus:ring-2 focus:ring-yellow-300 leading-relaxed min-h-[200px]"
        />

        {/* 하단 키워드 섹션 */}
        <div className="mt-6 pt-4 border-t border-gray-100">
          <p className="text-xs text-gray-400 mb-3">
            {itinerary.targetName}님의 고민의 과정, 히스토리 키워드
          </p>
          <div className="flex flex-wrap gap-2">
            {HISTORY_KEYWORDS.map((keyword, idx) => (
              <span
                key={idx}
                className="px-3 py-1.5 bg-gray-100 text-gray-600 text-xs rounded-full"
              >
                {keyword}
              </span>
            ))}
          </div>
        </div>

      </div>

    </div>
  );
};

export default LetterWritePage;
