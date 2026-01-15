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

// 컬러 팔레트
const COLOR_PALETTE = [
  '#019C59', // green
  '#7C3EB1', // purple
  '#FFC332', // yellow
  '#FE6400', // orange
  '#FF77D8', // pink
];

const LetterWritePage = () => {
  const navigate = useNavigate();
  const { itinerary, letter, setLetter, setLetterColor } = useItinerary();

  // 로컬 상태
  const [localLetter, setLocalLetter] = useState(letter);
  const [selectedColor, setSelectedColor] = useState(COLOR_PALETTE[0]);

  const handleComplete = () => {
    setLetter(localLetter);
    setLetterColor(selectedColor);
    navigate(-1);
  };

  if (!itinerary) return <div className="p-10 text-center">데이터가 없습니다 :(</div>;

  return (
    <div className="flex flex-col h-full bg-white">

      {/* 상단 컬러 영역 */}
      <div
        className="flex-1 flex flex-col transition-colors duration-300"
        style={{ backgroundColor: selectedColor }}
      >
        {/* 헤더 */}
        <div className="h-14 flex items-center justify-between px-4">
          <button onClick={() => navigate(-1)} className="p-1">
            <X className="w-6 h-6 text-white" />
          </button>
          <span className="font-bold text-lg text-white">편지쓰기</span>
          <button
            onClick={handleComplete}
            className="text-white font-bold text-sm"
          >
            완료
          </button>
        </div>

        {/* 편지 내용 영역 */}
        <div className="flex-1 flex flex-col px-6 pb-6">
          {/* 타이틀 */}
          <h1 className="text-3xl font-bold text-white mb-2">
            {itinerary.targetName}에게
          </h1>
          <p className="text-white/60 text-sm mb-4 leading-relaxed">
            소중한 하루에 대한 설명과 함께<br/>
            마음이 담긴 편지를 작성해보세요
          </p>

          {/* 편지 입력 영역 */}
          <textarea
            value={localLetter}
            onChange={(e) => setLocalLetter(e.target.value)}
            placeholder="여기에 마음을 담아 편지를 써보세요..."
            className="flex-1 w-full bg-transparent text-white placeholder:text-white/40 text-sm resize-none focus:outline-none leading-relaxed"
          />

          {/* 컬러 팔레트 */}
          <div className="flex gap-3 mt-4">
            {COLOR_PALETTE.map((color, idx) => (
              <button
                key={idx}
                onClick={() => setSelectedColor(color)}
                className={`w-8 h-8 rounded-full border-2 transition-transform ${
                  selectedColor === color
                    ? 'border-white scale-110 shadow-lg'
                    : 'border-white/50'
                }`}
                style={{ backgroundColor: color }}
              />
            ))}
          </div>
        </div>
      </div>

      {/* 하단 흰색 키워드 섹션 */}
      <div className="bg-white px-6 py-6">
        <p className="text-sm text-gray-400 mb-4">
          {itinerary.targetName}의 고민의 과정, 히스토리 키워드
        </p>
        <div className="flex flex-wrap gap-3">
          {HISTORY_KEYWORDS.map((keyword, idx) => (
            <button
              key={idx}
              onClick={() => setLocalLetter(prev => prev ? `${prev} ${keyword}` : keyword)}
              className="px-5 py-3 bg-gray-100 hover:bg-gray-200 text-gray-700 text-sm font-medium rounded-full transition-colors active:scale-95"
            >
              {keyword}
            </button>
          ))}
        </div>
      </div>

    </div>
  );
};

export default LetterWritePage;
