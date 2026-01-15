// src/pages/ResultPage.tsx
import { useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useItinerary } from '../context/ItineraryContext';
import { useDragScroll } from '../hooks/useDragScroll';
import { X, Pencil, Menu } from 'lucide-react';
import resultCardBg from '../assets/result_card.svg';

const ResultPage = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { itinerary, letter, setLetter, letterColor, setGiftSent } = useItinerary();

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
    <div className="flex flex-col h-full bg-white relative font-kakao">

      {/* 헤더 */}
      <div className="h-14 flex items-center justify-center px-4 bg-white sticky top-0 z-20 relative">
        <button
          onClick={() => navigate('/')}
          className="absolute left-4 p-1 hover:bg-gray-100 rounded-full"
        >
          <X className="w-6 h-6 text-black" />
        </button>
        <span className="font-bold text-lg">하루선물</span>
        <button
          onClick={() => {}}
          className="absolute right-4 p-1 hover:bg-gray-100 rounded-full"
        >
          <Menu className="w-6 h-6 text-black" />
        </button>
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
              className="w-[70vw] max-w-[296px] aspect-[296/478] relative snap-center flex-shrink-0 transition-transform cursor-pointer active:scale-[0.98] drop-shadow-lg"
            >
              {/* 배경 SVG */}
              <img
                src={resultCardBg}
                alt="card background"
                className="w-full h-full"
              />

              {/* 텍스트 오버레이 */}
              <div className="absolute top-8 left-6 right-6">
                <h2 className="text-4xl font-kakao font-extrabold text-black leading-snug">
                  {itinerary.theme}<br/>
                  {itinerary.region}<br/>
                  나들이
                </h2>
              </div>
            </div>

            {/* 2. 편지 카드 */}
            {isViewOnly ? (
              // 보기 전용 모드 - 편지 내용 표시
              <div
                className="w-[70vw] max-w-[296px] aspect-[296/478] rounded-2xl p-6 snap-center flex-shrink-0 shadow-lg flex flex-col"
                style={{ backgroundColor: letterColor }}
              >
                <h3 className="text-2xl font-bold text-white mb-2">
                  {itinerary.targetName}에게
                </h3>
                <p className="text-white/60 text-sm mb-4">함께 온 메시지</p>
                <div className="flex-1 w-full rounded-xl text-sm leading-relaxed text-white overflow-y-auto whitespace-pre-wrap">
                  {letter || '편지가 없습니다.'}
                </div>
              </div>
            ) : (
              // 편집 모드 - 클릭하면 편지 작성 페이지로 이동
              <div
                onClick={() => navigate('/letter-write')}
                className="w-[70vw] max-w-[296px] aspect-[296/478] rounded-2xl p-6 snap-center flex-shrink-0 shadow-lg flex flex-col cursor-pointer active:scale-[0.98] transition-transform relative"
                style={{ backgroundColor: letterColor }}
              >
                <h3 className="text-3xl font-bold text-white mb-2">
                  {itinerary.targetName}에게
                </h3>
                <p className="text-white/60 text-sm leading-relaxed">
                  소중한 하루에 대한 설명과 마음이<br/>
                  담긴 편지를 작성해보세요
                </p>

                {/* 편지 미리보기 (작성된 경우) */}
                {letter && (
                  <div className="mt-4 flex-1 overflow-hidden">
                    <p className="text-sm text-white/80 line-clamp-4 leading-relaxed">
                      {letter}
                    </p>
                  </div>
                )}

                {/* 연필 아이콘 */}
                <div className="absolute bottom-5 right-5">
                  <Pencil className="w-5 h-5 text-white" />
                </div>
              </div>
            )}

          </div>
        </div>

        {/* 하단 버튼 영역 */}
        <div className="p-4 pb-8 flex gap-3">
          {isViewOnly ? (
            <></>
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
