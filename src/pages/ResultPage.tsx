// src/pages/ResultPage.tsx
import { useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useItinerary } from '../context/ItineraryContext';
import { useDragScroll } from '../hooks/useDragScroll';
import { X } from 'lucide-react';

const ResultPage = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { itinerary, letter, setLetter, setGiftSent } = useItinerary();

  // 보기 전용 모드 (gift-view 경로일 때)
  const isViewOnly = location.pathname === '/gift-view';

  // 드래그 스크롤 ref
  const cardScrollRef = useDragScroll<HTMLDivElement>();

  // 편지 초기값 설정 (itinerary의 finalLetter가 있고 letter가 비어있으면)
  useEffect(() => {
    if (itinerary?.finalLetter && !letter) {
      setLetter(itinerary.finalLetter);
    }
  }, [itinerary?.finalLetter]);

  if (!itinerary) return <div className="p-10 text-center">데이터가 없습니다 :(</div>;

  // 코스 카드 클릭 → 코스 맵 페이지로 이동
  const handleCourseCardClick = () => {
    navigate('/course-map', { state: { viewOnly: isViewOnly } });
  };

  return (
    <div className="flex flex-col h-full bg-white relative">

      {/* 헤더 */}
      <div className="h-14 flex items-center justify-center px-4 border-b border-gray-100 bg-white sticky top-0 z-20 relative">
        <button
          onClick={() => navigate('/')}
          className="absolute left-4 p-1"
        >
          <X className="w-6 h-6 text-black" />
        </button>
        <span className="font-bold text-lg">하루선물</span>
      </div>

      {/* 카드 뷰 */}
      <div className="flex-1 flex flex-col">

        {/* 카드 컨테이너 - 가로 스크롤 (스크롤바 숨김, 드래그 가능) */}
        <div
          ref={cardScrollRef}
          className="flex-1 overflow-x-auto overflow-y-hidden snap-x snap-mandatory scrollbar-hide cursor-grab flex items-center"
        >
          <div className="flex px-4 gap-4" style={{ width: 'max-content' }}>

            {/* 1. 코스 카드 */}
            <div
              onClick={handleCourseCardClick}
              className="w-[80vw] max-w-[340px] h-[50vh] bg-gray-100 rounded-2xl overflow-hidden relative snap-center flex-shrink-0 shadow-lg transition-transform cursor-pointer active:scale-[0.98]"
            >
              {/* 배경 이미지 */}
              <img
                src={itinerary.places[0]?.imageUrl || 'https://images.unsplash.com/photo-1583307687252-4013d6a99284?q=80&w=800'}
                alt="course"
                className="w-full h-full object-cover"
              />

              {/* 하단 그라데이션 + 텍스트 */}
              <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent" />
              <div className="absolute bottom-0 left-0 right-0 p-5">
                {/* 진행 바 */}
                <div className="w-12 h-1 bg-red-500 rounded-full mb-4" />

                <h2 className="text-white text-xl font-bold leading-tight mb-2">
                  {itinerary.theme || '특별한 날'}의<br/>
                  조용한 {itinerary.places[0]?.location?.split(' ')[0] || '서촌'} 나들이
                </h2>
                <p className="text-white/80 text-sm leading-relaxed">
                  함께여서 더 의미 있는,<br/>
                  낭만이고 소박한 {itinerary.targetName}과의 하루
                </p>
              </div>
            </div>

            {/* 2. 편지 카드 */}
            <div className="w-[80vw] max-w-[340px] h-[50vh] bg-gray-50 rounded-2xl p-6 snap-center flex-shrink-0 shadow-lg flex flex-col">
              <h3 className="text-xl font-bold text-gray-900 mb-2">
                {itinerary.targetName}에게
              </h3>
              <p className="text-gray-400 text-sm mb-4">
                {isViewOnly
                  ? '함께 온 메시지'
                  : '소중한 하루에 대한 설명과 마음이 담긴 편지를 작성해보세요'}
              </p>

              {/* 편지 영역 - 보기 전용 or 편집 가능 */}
              {isViewOnly ? (
                <div className="flex-1 w-full bg-white border border-gray-200 rounded-xl p-4 text-sm leading-relaxed text-gray-700 overflow-y-auto whitespace-pre-wrap">
                  {letter || '편지가 없습니다.'}
                </div>
              ) : (
                <textarea
                  value={letter}
                  onChange={(e) => setLetter(e.target.value)}
                  placeholder="여기에 마음을 담아 편지를 써보세요..."
                  className="flex-1 w-full bg-white border border-gray-200 rounded-xl p-4 text-sm resize-none focus:outline-none focus:ring-2 focus:ring-yellow-300 leading-relaxed"
                />
              )}
            </div>

          </div>
        </div>

        {/* 하단 버튼 영역 */}
        <div className="p-4 pb-8 flex gap-3 border-t border-gray-100">
          {isViewOnly ? (
            <button
              onClick={() => alert('예약 기능은 준비중입니다!')}
              className="flex-1 py-4 bg-kakao-yellow text-black font-bold rounded-xl text-base hover:bg-yellow-400 transition-colors"
            >
              코스 예약하기
            </button>
          ) : (
            <>
              <button
                onClick={() => alert('저장되었습니다!')}
                className="flex-1 py-4 bg-gray-100 text-gray-700 font-bold rounded-xl text-base hover:bg-gray-200 transition-colors"
              >
                저장하기
              </button>
              <button
                onClick={() => {
                  setGiftSent(true);
                  navigate('/');
                }}
                className="flex-1 py-4 bg-kakao-yellow text-black font-bold rounded-xl text-base hover:bg-yellow-400 transition-colors"
              >
                선물하기
              </button>
            </>
          )}
        </div>
      </div>

    </div>
  );
};

export default ResultPage;
