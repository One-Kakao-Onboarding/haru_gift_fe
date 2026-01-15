// src/pages/PlaceDetailPage.tsx
import { useLocation, useNavigate } from 'react-router-dom';
import { useItinerary } from '../context/ItineraryContext';
import { ArrowLeft, Star, MapPin, Share2 } from 'lucide-react';
import uljiroMap from '../assets/uljiro_map.png';
import type { Place } from '../types';

const PlaceDetailPage = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { updatePlace } = useItinerary();
  
  const { originalPlaceId, newPlaceData } = location.state || {};

  const handleConfirmChange = () => {
    if (!originalPlaceId || !newPlaceData) return;

    // 1. 새로운 장소 데이터 포맷 맞추기 (Context용)
    const updatedPlace: Place = {
      id: originalPlaceId, // ID는 유지하거나 새로 따거나 (여기선 ID 유지하며 내용만 교체)
      order: 0, // 기존 순서 유지 로직은 Context에서 처리됨
      name: newPlaceData.name,
      category: '식사', // 예시
      location: '서울 종로구 자하문로',
      rating: 4.8,
      reviewCount: 152,
      intro: newPlaceData.desc,
      imageUrl: newPlaceData.img,
      userMemo: 'AI 추천으로 변경함'
    };

    // 2. 전역 상태 업데이트
    updatePlace(originalPlaceId, updatedPlace);

    // 3. CourseMapPage로 복귀 (히스토리 교체로 chat-edit, place-detail 제거)
    navigate('/course-map', { replace: true });
  };

  if (!newPlaceData) return <div>데이터가 없습니다.</div>;

  return (
    <div className="flex flex-col h-full bg-white relative animate-fade-in">
      
      {/* 헤더 */}
      <div className="absolute top-0 w-full p-4 flex justify-between z-10 text-white">
        <button onClick={() => navigate(-1)} className="p-2 bg-black/20 backdrop-blur-md rounded-full">
          <ArrowLeft size={20} />
        </button>
        <button className="p-2 bg-black/20 backdrop-blur-md rounded-full">
          <Share2 size={20} />
        </button>
      </div>

      {/* 대문 이미지 */}
      <div className="h-[40vh] bg-gray-200 relative">
        <img src={newPlaceData.img} className="w-full h-full object-cover" />
        <div className="absolute bottom-0 w-full bg-gradient-to-t from-black/60 to-transparent h-20"></div>
      </div>

      {/* 상세 정보 */}
      <div className="flex-1 -mt-6 bg-white rounded-t-3xl relative z-0 p-6 flex flex-col">
        <div className="w-12 h-1 bg-gray-300 rounded-full mx-auto mb-6"></div>
        
        <span className="text-yellow-600 font-bold text-sm mb-1">한식 • 파인다이닝</span>
        <h1 className="text-2xl font-bold text-gray-900 mb-2">{newPlaceData.name}</h1>
        
        <div className="flex items-center gap-4 text-sm text-gray-500 mb-6 border-b border-gray-100 pb-6">
          <div className="flex items-center gap-1">
            <Star size={16} className="text-yellow-400 fill-current" />
            <span className="font-bold text-black">4.9</span>
            <span>(342)</span>
          </div>
          <div className="flex items-center gap-1">
             <MapPin size={16} /> 서촌 도보 5분
          </div>
        </div>

        <div className="space-y-4 mb-8">
          <h3 className="font-bold text-gray-900">상세 설명</h3>
          <p className="text-gray-600 text-sm leading-7">
            {newPlaceData.desc}. 서촌의 고즈넉한 골목에 위치하여 조용하고 프라이빗한 식사가 가능합니다. 
            매일 아침 공수하는 신선한 재료로 셰프가 직접 요리합니다.
          </p>
          
          {/* 지도 영역 */}
          <div className="w-full h-40 rounded-xl overflow-hidden">
            <img src={uljiroMap} alt="을지로 지도" className="w-full h-full object-cover" />
          </div>
        </div>
      </div>

      {/* 하단 버튼 */}
      <div className="p-4 border-t border-gray-100 bg-white sticky bottom-0">
        <button 
          onClick={handleConfirmChange}
          className="w-full bg-black text-white font-bold py-4 rounded-xl text-lg hover:bg-gray-800 transition-colors shadow-lg"
        >
          이 장소로 변경하기
        </button>
      </div>

    </div>
  );
};

export default PlaceDetailPage;