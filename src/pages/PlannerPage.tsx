// src/pages/PlannerPage.tsx
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useItinerary } from '../context/ItineraryContext';
import { ArrowLeft, X, Plus, GripVertical, Utensils, Coffee, Clapperboard, BedDouble, Ticket } from 'lucide-react';
import { motion, Reorder, AnimatePresence } from 'framer-motion';
import { getRandomPlace } from '../mockData.ts';
import type { Place, Itinerary } from '../types.ts';

// 선택 가능한 카테고리 목록
const CATEGORY_OPTIONS = [
  { label: '음식점', icon: <Utensils size={20} />, type: '식사' },
  { label: '카페', icon: <Coffee size={20} />, type: '카페' },
  { label: '문화시설', icon: <Clapperboard size={20} />, type: '문화시설' },
  { label: '관광명소', icon: <Ticket size={20} />, type: '관광명소' },
  { label: '숙소', icon: <BedDouble size={20} />, type: '숙소' },
];

// 사용자가 추가한 일정 아이템 타입
interface PlanItem {
  id: string;
  label: string;
  type: string;
}

// 대화에서 추출된 키 포인트 (더미 데이터 - 나중에 LLM이 생성)
const EXTRACTED_INSIGHTS = [
  { id: '1', text: '추운 날씨 걱정 → 실내 데이트 위주' },
  { id: '2', text: '루아가 밀가루 끊음 → 한식 위주' },
  { id: '3', text: '핫플보다 조용한 곳 선호' },
  { id: '4', text: '바다 보고 싶어함' },
  { id: '5', text: '100일 기념 특별한 하루' },
];

const PlannerPage = () => {
  const navigate = useNavigate();
  const { setItinerary } = useItinerary();

  // 1. 상태 관리 (Wizard State)
  const [step, setStep] = useState(1); // 1, 2, 3 단계
  const [region, setRegion] = useState('을지로');
  const [purpose, setPurpose] = useState('100일 기념');
  const [additionalReq, setAdditionalReq] = useState('');

  // 드래그 앤 드롭을 위한 리스트 상태
  const [planItems, setPlanItems] = useState<PlanItem[]>([
    { id: 'default-1', label: '음식점', type: '식사' },
    { id: 'default-2', label: '카페', type: '카페' }
  ]);

  const [isBottomSheetOpen, setIsBottomSheetOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  // 2. 기능 핸들러
  const handleNext = () => {
    if (step < 3) setStep(step + 1);
    else handleSubmit();
  };

  const handleBack = () => {
    if (step > 1) setStep(step - 1);
    else navigate(-1);
  };

  const addCategory = (option: typeof CATEGORY_OPTIONS[0]) => {
    const newItem: PlanItem = {
      id: Date.now().toString(), // 유니크 ID
      label: option.label,
      type: option.type
    };
    setPlanItems([...planItems, newItem]);
    setIsBottomSheetOpen(false);
  };

  const removeCategory = (id: string) => {
    setPlanItems(planItems.filter(item => item.id !== id));
  };

//   const handleSubmit = () => {
//     // 1. 디버그용 데이터 확인 팝업
//     const debugData = {
//       step1_region: region,
//       step1_purpose: purpose,
//       step2_schedule: planItems,
//       step3_request: additionalReq
//     };
    
//     const isConfirmed = window.confirm(
//       `[DEBUG: 데이터 확인]\n\n${JSON.stringify(debugData, null, 2)}\n\n이대로 코스를 생성할까요?`
//     );

//     if (isConfirmed) {
//       // 2. 확인 누르면 결과 페이지로 이동
//       navigate('/result');
//     }
//   };
  const handleSubmit = () => {
    // 로딩 시작
    setIsLoading(true);

    // 2.5초 후 실행
    setTimeout(() => {
      // 1. 사용자 입력(schedule)을 기반으로 실제 데이터(Random) 매핑
      const generatedPlaces: Place[] = planItems.map((item, index) => {
        const mockData = getRandomPlace(item.label); // '식사', '카페' 등으로 조회

        return {
          id: item.id, // ID 유지
          order: index + 1,
          name: mockData.name || item.label, // 더미 데이터 없으면 기본 라벨
          category: item.label,
          location: mockData.location || region || '서울',
          rating: mockData.rating || 4.5,
          reviewCount: 100 + Math.floor(Math.random() * 500),
          intro: mockData.intro || 'AI가 추천하는 핫플레이스',
          imageUrl: mockData.imageUrl || 'https://source.unsplash.com/random/400x300/?korea,travel',
          userMemo: ''
        };
      });

      // 2. 전체 코스 데이터 생성
      const newItinerary: Itinerary = {
        id: `trip_${Date.now()}`,
        theme: purpose || '힐링 여행',
        region: region || '서울',
        targetName: '루아',
        places: generatedPlaces,
        finalLetter: ''
      };

      // 3. 저장 후 이동
      setItinerary(newItinerary);
      setIsLoading(false);
      navigate('/result');
    }, 2500);
  };

  // 3. 단계별 화면 렌더링
  return (
    <div className="flex flex-col h-full bg-white relative">
      
      {/* 상단 네비게이션 */}
      <div className="h-14 flex items-center px-4 border-b border-gray-100">
        <button onClick={handleBack} className="p-2 -ml-2">
          <ArrowLeft className="w-6 h-6" />
        </button>
        <span className="font-bold text-lg ml-2">하루 만들기</span>
        <div className="ml-auto text-sm text-gray-400 font-medium">
          <span className="text-black">{step}</span> / 3
        </div>
      </div>

      {/* 진행바 (Progress Bar) */}
      <div className="w-full h-1 bg-gray-100">
        <div 
          className="h-full bg-[#FEE500] transition-all duration-300 ease-out"
          style={{ width: `${(step / 3) * 100}%` }}
        />
      </div>

      {/* 메인 컨텐츠 영역 */}
      <div className="flex-1 overflow-y-auto p-6 pb-24">
        
        {/* Step 1: 지역 & 목적 */}
        {step === 1 && (
          <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} className="flex flex-col gap-8">
            <div>
              <span className="text-yellow-500 font-bold text-sm mb-1 block">Step 1</span>
              <h2 className="text-2xl font-bold mb-6">어떤 하루를<br/>보내고 싶으신가요?</h2>
              
              <label className="block mb-6">
                <span className="text-gray-600 text-sm font-medium mb-2 block">지역</span>
                <input 
                  type="text" 
                  className="w-full bg-gray-50 border border-gray-100 rounded-xl p-4 text-lg focus:outline-none focus:ring-2 focus:ring-yellow-300"
                  placeholder="예: 서촌, 강릉, 홍대"
                  value={region}
                  onChange={(e) => setRegion(e.target.value)}
                />
              </label>

              <label className="block">
                <span className="text-gray-600 text-sm font-medium mb-2 block">목적</span>
                <input 
                  type="text" 
                  className="w-full bg-gray-50 border border-gray-100 rounded-xl p-4 text-lg focus:outline-none focus:ring-2 focus:ring-yellow-300"
                  placeholder="예: 2주년 데이트, 힐링"
                  value={purpose}
                  onChange={(e) => setPurpose(e.target.value)}
                />
              </label>
            </div>
          </motion.div>
        )}

        {/* Step 2: 일정 구성 (Drag & Drop) */}
        {step === 2 && (
          <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }}>
             <span className="text-yellow-500 font-bold text-sm mb-1 block">Step 2</span>
             <h2 className="text-2xl font-bold mb-2">오늘의 계획을<br/>알려주세요</h2>
             <p className="text-gray-400 text-sm mb-6">순서를 자유롭게 바꿀 수 있어요</p>

             {/* 드래그 앤 드롭 리스트 */}
             <Reorder.Group axis="y" values={planItems} onReorder={setPlanItems} className="flex flex-col gap-3">
               {planItems.map((item, index) => (
                 <Reorder.Item key={item.id} value={item} id={item.id}>
                   <div className="bg-white border border-gray-100 shadow-sm rounded-xl p-4 flex items-center justify-between active:scale-[1.02] active:shadow-md transition-all cursor-grab active:cursor-grabbing">
                     <div className="flex items-center gap-4">
                       <div className="text-gray-300">
                         <GripVertical size={20} />
                       </div>
                       <div className="flex items-center justify-center w-10 h-10 rounded-full bg-yellow-50 text-yellow-600">
                          {/* 아이콘 매핑 (간단히) */}
                          {item.label === '음식점' && <Utensils size={18} />}
                          {item.label === '카페' && <Coffee size={18} />}
                          {item.label === '영화관' && <Clapperboard size={18} />}
                          {item.label === '전시' && <Ticket size={18} />}
                          {item.label === '숙소' && <BedDouble size={18} />}
                       </div>
                       <div className="flex flex-col">
                         <span className="font-bold text-gray-800">{item.label}</span>
                         <span className="text-xs text-gray-400">{index + 1}번째 순서</span>
                       </div>
                     </div>
                     <button onClick={() => removeCategory(item.id)} className="text-gray-300 hover:text-red-500 p-2">
                       <X size={18} />
                     </button>
                   </div>
                 </Reorder.Item>
               ))}
             </Reorder.Group>

             {/* 추가 버튼 */}
             <button 
               onClick={() => setIsBottomSheetOpen(true)}
               className="w-full mt-4 py-4 rounded-xl border-2 border-dashed border-gray-200 text-gray-400 font-bold flex items-center justify-center gap-2 hover:bg-gray-50 hover:border-gray-300 transition-all"
             >
               <Plus size={20} /> 장소 추가하기
             </button>
          </motion.div>
        )}

        {/* Step 3: 추가 요청 사항 */}
        {step === 3 && (
          <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }}>
            <span className="text-yellow-500 font-bold text-sm mb-1 block">Step 3</span>
            <h2 className="text-2xl font-bold mb-6">AI에게 부탁할<br/>특별한 점이 있나요?</h2>
            
            <div className="bg-gray-50 rounded-xl p-4 h-[30vh] border border-gray-100 focus-within:ring-2 focus-within:ring-yellow-300 transition-all">
              <textarea
                className="w-full h-full bg-transparent resize-none outline-none text-base placeholder:text-gray-400 leading-relaxed"
                placeholder="추가로 알려줄 내용이 있다면 자유롭게 적어주세요..."
                value={additionalReq}
                onChange={(e) => setAdditionalReq(e.target.value)}
              />
            </div>

            {/* 대화에서 추출된 키 포인트 */}
            <div className="mt-6">
              <p className="text-xs text-gray-500 mb-2">대화에서 파악한 내용</p>
              <ul className="flex flex-col gap-1.5 text-sm text-gray-600">
                {EXTRACTED_INSIGHTS.map((insight) => (
                  <li key={insight.id} className="flex items-start gap-2">
                    <span className="text-gray-400">•</span>
                    <span>{insight.text}</span>
                  </li>
                ))}
              </ul>
            </div>
          </motion.div>
        )}

      </div>

      {/* 하단 고정 버튼 */}
      <div className="absolute bottom-0 w-full bg-white p-4 border-t border-gray-50">
        <button 
          onClick={handleNext}
          disabled={step === 1 && (!region || !purpose)} // 1단계 유효성 검사
          className="w-full bg-[#FEE500] text-black font-bold py-4 rounded-xl text-lg hover:bg-yellow-400 transition-colors disabled:bg-gray-200 disabled:text-gray-400"
        >
          {step === 3 ? '코스 생성하기' : '다음'}
        </button>
      </div>

      {/* 로딩 오버레이 */}
      <AnimatePresence>
        {isLoading && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="absolute inset-0 bg-white z-50 flex flex-col items-center justify-center"
          >
            {/* 로딩 애니메이션 */}
            <div className="flex gap-2 mb-6">
              <motion.div
                animate={{ y: [0, -12, 0] }}
                transition={{ duration: 0.6, repeat: Infinity, delay: 0 }}
                className="w-4 h-4 bg-[#FEE500] rounded-full"
              />
              <motion.div
                animate={{ y: [0, -12, 0] }}
                transition={{ duration: 0.6, repeat: Infinity, delay: 0.15 }}
                className="w-4 h-4 bg-[#FEE500] rounded-full"
              />
              <motion.div
                animate={{ y: [0, -12, 0] }}
                transition={{ duration: 0.6, repeat: Infinity, delay: 0.3 }}
                className="w-4 h-4 bg-[#FEE500] rounded-full"
              />
            </div>
            <p className="text-lg font-bold text-gray-800 mb-2">코스를 만들고 있어요</p>
            <p className="text-sm text-gray-400">잠시만 기다려주세요...</p>
          </motion.div>
        )}
      </AnimatePresence>

      {/* 바텀 시트 (Step 2 - 추가하기) */}
      <AnimatePresence>
        {isBottomSheetOpen && (
          <>
            {/* 배경 (Backdrop) */}
            <motion.div 
              initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
              onClick={() => setIsBottomSheetOpen(false)}
              className="absolute inset-0 bg-black/40 z-40"
            />
            {/* 시트 내용 */}
            <motion.div 
              initial={{ y: "100%" }} animate={{ y: 0 }} exit={{ y: "100%" }}
              transition={{ type: "spring", damping: 25, stiffness: 500 }}
              className="absolute bottom-0 w-full bg-white z-50 rounded-t-2xl p-6 pb-10 shadow-2xl"
            >
              <div className="flex justify-between items-center mb-6">
                <h3 className="font-bold text-lg">어떤 장소를 추가할까요?</h3>
                <button onClick={() => setIsBottomSheetOpen(false)}><X /></button>
              </div>
              
              <div className="grid grid-cols-2 gap-3">
                {CATEGORY_OPTIONS.map((option) => (
                  <button 
                    key={option.label}
                    onClick={() => addCategory(option)}
                    className="flex flex-col items-center justify-center gap-2 p-4 bg-gray-50 rounded-xl hover:bg-yellow-50 hover:ring-2 hover:ring-yellow-300 transition-all"
                  >
                    <div className="text-gray-700">{option.icon}</div>
                    <span className="font-medium text-sm">{option.label}</span>
                  </button>
                ))}
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>

    </div>
  );
};

export default PlannerPage;