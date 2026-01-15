// src/pages/CourseMapPage.tsx
import { useState, useRef } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useItinerary } from '../context/ItineraryContext';
import { useDragScroll } from '../hooks/useDragScroll';
import { ArrowLeft, Star, Calendar, RefreshCw, MapPin, Lightbulb } from 'lucide-react';
import uljiroMap from '../assets/uljiro_map.png';
// import { parseCoordinates } from '../services/api.ts';

const CourseMapPage = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { itinerary } = useItinerary();

  // 보기 전용 모드 (gift-view에서 온 경우)
  const isViewOnly = location.state?.viewOnly ?? false;

  // 드래그 스크롤 ref
  const cardScrollRef = useDragScroll<HTMLDivElement>();

  // 카드 refs (스크롤용)
  const cardRefs = useRef<(HTMLDivElement | null)[]>([]);

  // 현재 선택된 장소 인덱스
  const [selectedPlaceIndex, setSelectedPlaceIndex] = useState(0);

  // 마커 클릭 시 해당 카드로 스크롤
  const handleMarkerClick = (idx: number) => {
    setSelectedPlaceIndex(idx);
    cardRefs.current[idx]?.scrollIntoView({
      behavior: 'smooth',
      block: 'nearest',
      inline: 'center'
    });
  };

  if (!itinerary) return <div className="p-10 text-center">데이터가 없습니다 :(</div>;

  return (
    <div className="flex flex-col h-full bg-white relative">

      {/* 지도 + 하단 카드 */}
      <div className="flex-1 relative">

        {/* 뒤로가기 버튼 (floating) */}
        <button
          onClick={() => navigate(isViewOnly ? '/gift-view' : '/result')}
          className="absolute top-4 left-4 z-30 w-10 h-10 bg-white rounded-full shadow-md flex items-center justify-center hover:bg-gray-50"
        >
          <ArrowLeft className="w-5 h-5 text-gray-700" />
        </button>

        {/* 지도 영역 (더미) - 전체 화면 */}
        <div className="absolute inset-0 bg-gray-200 overflow-hidden">
          {/* 을지로 지도 이미지 */}
          <img
            src={uljiroMap}
            alt="을지로 지도"
            className="w-full h-full object-cover"
          />

          {/* 지도 위 마커들 (더미 위치) */}
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="relative w-64 h-64">
              {itinerary.places.map((place, idx) => {
                // 마커 위치 (더미로 원형 배치)
                const angle = (idx / itinerary.places.length) * 2 * Math.PI - Math.PI / 2;
                const radius = 80;
                const x = 50 + Math.cos(angle) * radius / 2;
                const y = 50 + Math.sin(angle) * radius / 2;

                return (
                  <div
                    key={place.id}
                    onClick={() => handleMarkerClick(idx)}
                    className={`absolute w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold cursor-pointer transition-all ${
                      selectedPlaceIndex === idx
                        ? 'bg-blue-500 text-white scale-125 shadow-lg'
                        : 'bg-white text-blue-500 border-2 border-blue-500 shadow-md'
                    }`}
                    style={{ left: `${x}%`, top: `${y}%`, transform: 'translate(-50%, -50%)' }}
                  >
                    {idx + 1}
                  </div>
                );
              })}

              {/* 경로선 (SVG) */}
              <svg className="absolute inset-0 w-full h-full pointer-events-none" style={{ overflow: 'visible' }}>
                {itinerary.places.map((_, idx) => {
                  if (idx === itinerary.places.length - 1) return null;

                  const angle1 = (idx / itinerary.places.length) * 2 * Math.PI - Math.PI / 2;
                  const angle2 = ((idx + 1) / itinerary.places.length) * 2 * Math.PI - Math.PI / 2;
                  const radius = 80;

                  const x1 = 128 + Math.cos(angle1) * radius;
                  const y1 = 128 + Math.sin(angle1) * radius;
                  const x2 = 128 + Math.cos(angle2) * radius;
                  const y2 = 128 + Math.sin(angle2) * radius;

                  return (
                    <line
                      key={idx}
                      x1={x1} y1={y1} x2={x2} y2={y2}
                      stroke="#8B5CF6"
                      strokeWidth="3"
                      strokeDasharray="8,4"
                    />
                  );
                })}
              </svg>
            </div>
          </div>

          
        </div>

        {/* 하단 장소 카드 - 횡스크롤 (floating) */}
        <div className="absolute bottom-4 left-0 right-0 px-2 z-10">
          <div
            ref={cardScrollRef}
            className="overflow-x-auto snap-x snap-mandatory scrollbar-hide cursor-grab py-2"
          >
            <div className="flex gap-3 px-2" style={{ width: 'max-content' }}>
              {itinerary.places.map((place, index) => (
                <div
                  key={place.id}
                  ref={(el) => { cardRefs.current[index] = el; }}
                  onClick={() => setSelectedPlaceIndex(index)}
                  className={`w-[80vw] max-w-[360px] min-h-[160px] bg-white rounded-xl p-3 snap-center flex-shrink-0 transition-all cursor-pointer shadow-xl ${
                    selectedPlaceIndex === index
                      ? 'ring-2 ring-blue-500'
                      : 'border border-gray-100'
                  }`}
                >
                  {/* 카드 상단: 번호 + 이름 + 카테고리 */}
                  <div className="flex items-start gap-2 mb-2">
                    <div className="w-6 h-6 bg-blue-500 text-white rounded-md flex items-center justify-center font-bold text-xs flex-shrink-0">
                      {index + 1}
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-baseline gap-2">
                        <h4 className="font-bold text-gray-900 truncate text-sm">{place.name}</h4>
                        <span className="text-[10px] text-gray-400 flex-shrink-0">
                          {place.detailCategory || place.category}
                        </span>
                      </div>

                      {/* 별점 + 리뷰 */}
                      <div className="flex items-center gap-1.5 mt-0.5">
                        <span className="text-red-500 font-bold text-xs">{place.rating}</span>
                        <div className="flex">
                          {[...Array(5)].map((_, i) => (
                            <Star
                              key={i}
                              size={10}
                              className={i < Math.floor(place.rating) ? 'text-red-500 fill-red-500' : 'text-gray-200'}
                            />
                          ))}
                        </div>
                        <span className="text-[10px] text-gray-400">리뷰 {place.reviewCount?.toLocaleString()}</span>
                      </div>
                    </div>
                  </div>

                  {/* 주소 */}
                  <div className="flex items-center gap-1 text-[10px] text-gray-500 mb-2">
                    <MapPin size={10} className="text-gray-400 flex-shrink-0" />
                    <span className="truncate">{place.location}</span>
                  </div>

                  {/* 태그 */}
                  {place.tags && place.tags.length > 0 && (
                    <div className="flex flex-wrap gap-1 mb-2">
                      {place.tags.slice(0, 3).map((tag, i) => (
                        <span key={i} className="text-[10px] bg-gray-100 text-gray-500 px-1.5 py-0.5 rounded">
                          #{tag}
                        </span>
                      ))}
                    </div>
                  )}

                  {/* AI 추천 사유 */}
                  {place.intro && (
                    <div className="flex items-start gap-1 mb-2 p-2 bg-blue-50 rounded-lg">
                      <Lightbulb size={12} className="text-blue-500 flex-shrink-0 mt-0.5" />
                      <p className="text-[10px] text-blue-600 line-clamp-2">{place.intro}</p>
                    </div>
                  )}

                  {/* 버튼 그룹 */}
                  <div className="flex gap-2">
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        alert('예약 기능은 준비중입니다!');
                      }}
                      className="flex-1 py-2 border border-gray-200 rounded-lg text-xs font-medium text-gray-600 hover:bg-gray-50 flex justify-center items-center gap-1 transition-colors"
                    >
                      <Calendar size={14} className="text-gray-400" />
                      예약
                    </button>
                    {!isViewOnly && (
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          navigate('/chat-edit', { state: { place } });
                        }}
                        className="flex-1 py-2 border border-gray-200 rounded-lg text-xs font-medium text-gray-600 hover:bg-gray-50 flex justify-center items-center gap-1 transition-colors"
                      >
                        <RefreshCw size={14} className="text-gray-400" />
                        변경
                      </button>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

    </div>
  );
};

export default CourseMapPage;
