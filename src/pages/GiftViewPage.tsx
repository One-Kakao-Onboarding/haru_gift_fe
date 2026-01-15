// src/pages/GiftViewPage.tsx
import { useNavigate } from 'react-router-dom';
import { useItinerary } from '../context/ItineraryContext';
import { ArrowLeft, Star, MapPin, Heart } from 'lucide-react';

const GiftViewPage = () => {
  const navigate = useNavigate();
  const { itinerary, letter } = useItinerary();

  if (!itinerary) {
    return (
      <div className="flex flex-col h-full bg-white items-center justify-center">
        <p className="text-gray-400">선물 데이터가 없습니다</p>
      </div>
    );
  }

  return (
    <div className="flex flex-col h-full bg-gradient-to-b from-pink-50 to-white">

      {/* 헤더 */}
      <div className="h-14 flex items-center px-4 bg-white/80 backdrop-blur-sm sticky top-0 z-20">
        <button onClick={() => navigate(-1)} className="p-1">
          <ArrowLeft className="w-6 h-6 text-gray-700" />
        </button>
        <span className="font-bold text-lg ml-2">하루선물</span>
      </div>

      {/* 메인 컨텐츠 */}
      <div className="flex-1 overflow-y-auto">

        {/* 상단 카드 이미지 */}
        <div className="relative h-[45vh] overflow-hidden">
          <img
            src={itinerary.places[0]?.imageUrl || 'https://images.unsplash.com/photo-1513201099705-a9746e1e201f?q=80&w=1000'}
            alt="gift cover"
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />

          {/* 하단 타이틀 */}
          <div className="absolute bottom-0 left-0 right-0 p-6 text-white">
            <div className="flex items-center gap-2 mb-2">
              <Heart className="w-5 h-5 text-pink-400 fill-pink-400" />
              <span className="text-sm opacity-80">특별한 하루를 선물받았어요</span>
            </div>
            <h1 className="text-2xl font-bold leading-tight">
              {itinerary.theme || '로맨틱'}한<br/>
              {itinerary.places[0]?.location?.split(' ')[0] || '서촌'} 나들이
            </h1>
          </div>
        </div>

        {/* 편지 섹션 */}
        {letter && (
          <div className="mx-4 -mt-4 relative z-10">
            <div className="bg-white rounded-2xl p-5 shadow-lg border border-gray-100">
              <div className="flex items-center gap-2 mb-3">
                <span className="text-pink-500 text-lg">💌</span>
                <span className="font-bold text-gray-800">함께 온 메시지</span>
              </div>
              <p className="text-gray-600 text-sm leading-relaxed whitespace-pre-wrap">
                "{letter}"
              </p>
            </div>
          </div>
        )}

        {/* 코스 리스트 */}
        <div className="p-4 pt-6">
          <h2 className="font-bold text-gray-800 mb-4 flex items-center gap-2">
            <MapPin className="w-5 h-5 text-blue-500" />
            오늘의 코스
          </h2>

          <div className="flex flex-col gap-3">
            {itinerary.places.map((place, index) => (
              <div
                key={place.id}
                className="bg-white rounded-xl p-4 shadow-sm border border-gray-100 flex gap-4"
              >
                {/* 순서 번호 */}
                <div className="w-8 h-8 bg-blue-500 text-white rounded-lg flex items-center justify-center font-bold text-sm flex-shrink-0">
                  {index + 1}
                </div>

                {/* 장소 정보 */}
                <div className="flex-1 min-w-0">
                  <div className="flex items-baseline gap-2 mb-1">
                    <h3 className="font-bold text-gray-900 truncate">{place.name}</h3>
                    <span className="text-xs text-gray-400">{place.category}</span>
                  </div>

                  <div className="flex items-center gap-2 text-sm">
                    <span className="text-red-500 font-bold">{place.rating}</span>
                    <div className="flex">
                      {[...Array(5)].map((_, i) => (
                        <Star
                          key={i}
                          size={12}
                          className={i < Math.floor(place.rating) ? 'text-red-500 fill-red-500' : 'text-gray-200'}
                        />
                      ))}
                    </div>
                  </div>

                  <p className="text-xs text-gray-400 mt-1 truncate">{place.location}</p>
                </div>

                {/* 썸네일 */}
                <div className="w-16 h-16 rounded-lg overflow-hidden flex-shrink-0">
                  <img
                    src={place.imageUrl}
                    alt={place.name}
                    className="w-full h-full object-cover"
                  />
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* 하단 여백 */}
        <div className="h-8" />
      </div>

      {/* 하단 버튼 */}
      <div className="p-4 pb-8 bg-white border-t border-gray-100">
        <button
          onClick={() => alert('예약 기능은 준비중입니다!')}
          className="w-full py-4 bg-kakao-yellow text-black font-bold rounded-xl text-base hover:bg-yellow-400 transition-colors"
        >
          코스 예약하기
        </button>
      </div>
    </div>
  );
};

export default GiftViewPage;
