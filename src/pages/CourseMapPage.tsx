// src/pages/CourseMapPage.tsx
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useItinerary } from '../context/ItineraryContext';
import { useDragScroll } from '../hooks/useDragScroll';
import { ArrowLeft, Star, Calendar, RefreshCw, MapPin } from 'lucide-react';

const CourseMapPage = () => {
  const navigate = useNavigate();
  const { itinerary } = useItinerary();

  // 드래그 스크롤 ref
  const cardScrollRef = useDragScroll<HTMLDivElement>();

  // 현재 선택된 장소 인덱스
  const [selectedPlaceIndex, setSelectedPlaceIndex] = useState(0);

  if (!itinerary) return <div className="p-10 text-center">데이터가 없습니다 :(</div>;

  return (
    <div className="flex flex-col h-full bg-white relative">

      {/* 헤더 */}
      <div className="h-14 flex items-center px-4 bg-white/90 backdrop-blur-sm sticky top-0 z-20 border-b border-gray-100">
        <button onClick={() => navigate(-1)} className="p-1">
          <ArrowLeft className="w-6 h-6 text-black" />
        </button>
        <span className="font-bold text-lg ml-2">코스 상세</span>
      </div>

      {/* 지도 + 하단 카드 */}
      <div className="flex-1 relative">

        {/* 지도 영역 (더미) - 전체 화면 */}
        <div className="absolute inset-0 bg-gray-200 overflow-hidden">
          {/* 실제 지도 대신 더미 이미지 */}
          <img
            src="https://images.unsplash.com/photo-1524661135-423995f22d0b?q=80&w=1000&auto=format&fit=crop"
            alt="map placeholder"
            className="w-full h-full object-cover opacity-30"
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
                    onClick={() => setSelectedPlaceIndex(idx)}
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

          {/* 지도 안내 텍스트 */}
          <div className="absolute top-4 left-4 bg-white/90 backdrop-blur-sm px-3 py-2 rounded-lg shadow-sm">
            <div className="flex items-center gap-2 text-sm text-gray-600">
              <MapPin size={16} className="text-blue-500" />
              <span>장소를 탭해서 상세 정보를 확인하세요</span>
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
                  onClick={() => setSelectedPlaceIndex(index)}
                  className={`w-[280px] bg-white rounded-xl p-3 snap-center flex-shrink-0 transition-all cursor-pointer shadow-xl ${
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
                        <span className="text-[10px] text-gray-400 flex-shrink-0">{place.category}</span>
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
                        <span className="text-[10px] text-gray-400">리뷰 {place.reviewCount}</span>
                      </div>
                    </div>
                  </div>

                  {/* 주소 + 상태 */}
                  <div className="text-[10px] text-gray-500 mb-2 truncate">
                    {place.location} · <span className="text-green-500">영업중</span>
                  </div>

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
