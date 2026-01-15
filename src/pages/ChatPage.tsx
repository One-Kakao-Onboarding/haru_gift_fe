// // src/pages/ChatPage.tsx
// import React, { useState, useEffect, useRef } from 'react';
// import { useNavigate } from 'react-router-dom';
// import { useItinerary } from '../context/ItineraryContext';
// import type { ChatMessage, Itinerary } from '../types';
// import { Send, ArrowLeft, Menu } from 'lucide-react';

// // ⭐️ 시연용 가짜 데이터 (나중에 AI가 만들어줄 데이터)
// const MOCK_RESULT: Itinerary = {
//   id: 'trip_001',
//   theme: '힐링',
//   targetName: '지민',
//   places: [
//     {
//       id: 'p1',
//       order: 1,
//       name: '초당 할머니 순두부',
//       category: '아점',
//       location: '강원 강릉시 초당순두부길',
//       rating: 4.5,
//       reviewCount: 1203,
//       intro: '자극적이지 않고 고소한 찐 순두부 맛집',
//       imageUrl: 'https://images.unsplash.com/photo-1626645738196-c2a7c87a8f58?q=80&w=800&auto=format&fit=crop', // 순두부 느낌
//       userMemo: ''
//     },
//     {
//       id: 'p2',
//       order: 2,
//       name: '테라로사 경포호수점',
//       category: '카페',
//       location: '강원 강릉시 난설헌로',
//       rating: 4.8,
//       reviewCount: 890,
//       intro: '창가 자리에서 호수가 보이는 뷰맛집',
//       imageUrl: 'https://images.unsplash.com/photo-1509042239860-f550ce710b93?q=80&w=800&auto=format&fit=crop', // 커피
//       userMemo: ''
//     }
//   ],
//   finalLetter: '지민아, 지난주에 파스타 먹었으니까 이번엔 속 편한 한식으로 준비했어. 호수 보면서 물멍 때리자!'
// };

// const ChatPage = () => {
//   const navigate = useNavigate();
//   const { setItinerary } = useItinerary();
//   const scrollRef = useRef<HTMLDivElement>(null);

//   const [input, setInput] = useState('');
//   const [isTyping, setIsTyping] = useState(false); // AI가 입력중인지?
//   const [messages, setMessages] = useState<ChatMessage[]>([
//     { id: '1', sender: 'ai', text: '안녕하세요! 누구와 어떤 여행을 떠나시나요? (예: 여자친구랑 강릉 힐링 여행)', timestamp: '오전 10:00' }
//   ]);

//   // 메시지 올 때마다 스크롤 아래로
//   useEffect(() => {
//     scrollRef.current?.scrollIntoView({ behavior: 'smooth' });
//   }, [messages, isTyping]);

//   const handleSend = () => {
//     if (!input.trim()) return;

//     // 1. 내 메시지 추가
//     const userMsg: ChatMessage = {
//       id: Date.now().toString(),
//       sender: 'me',
//       text: input,
//       timestamp: new Date().toLocaleTimeString('ko-KR', { hour: '2-digit', minute: '2-digit' })
//     };
//     setMessages(prev => [...prev, userMsg]);
//     setInput('');
//     setIsTyping(true); // 로딩 시작

//     // 2. (가짜) AI 생각하는 척 지연시간 주기
//     setTimeout(() => {
//       // 3. 데이터 저장 (Context에 Mock Data 주입)
//       setItinerary(MOCK_RESULT);
      
//       setIsTyping(false);
      
//       // 4. 결과 페이지로 이동
//       navigate('/result');
//     }, 2000); // 2초 뒤 이동
//   };

//   const handleKeyDown = (e: React.KeyboardEvent) => {
//     if (e.key === 'Enter' && !e.nativeEvent.isComposing) {
//       handleSend();
//     }
//   };

//   return (
//     <div className="flex flex-col h-full bg-[#bacee0]"> {/* 카카오톡 채팅방 배경색 */}
      
//       {/* 상단 헤더 */}
//       <div className="bg-[#bacee0] p-3 flex items-center justify-between shadow-sm z-10 opacity-90">
//         <ArrowLeft className="w-6 h-6 text-black" />
//         <span className="font-semibold text-lg">여행 요정 🧚</span>
//         <Menu className="w-6 h-6 text-black" />
//       </div>

//       {/* 채팅 영역 */}
//       <div className="flex-1 overflow-y-auto p-4 flex flex-col gap-3">
//         {messages.map((msg) => (
//           <div key={msg.id} className={`flex ${msg.sender === 'me' ? 'justify-end' : 'justify-start'}`}>
//             {msg.sender === 'ai' && (
//               <div className="w-9 h-9 rounded-[14px] bg-yellow-200 flex items-center justify-center mr-2 text-xl overflow-hidden shadow-sm">
//                 🧚
//               </div>
//             )}
//             <div className="flex flex-col gap-1 max-w-[70%]">
//               {msg.sender === 'ai' && <span className="text-xs text-gray-500 ml-1">여행 요정</span>}
//               <div
//                 className={`px-3 py-2 text-sm shadow-sm ${
//                   msg.sender === 'me'
//                     ? 'bg-[#FEE500] text-black rounded-l-xl rounded-br-sm rounded-tr-xl' // 카톡 노란 말풍선
//                     : 'bg-white text-black rounded-r-xl rounded-bl-sm rounded-tl-xl' // 흰색 말풍선
//                 }`}
//               >
//                 {msg.text}
//               </div>
//             </div>
//           </div>
//         ))}
        
//         {/* 로딩 인디케이터 */}
//         {isTyping && (
//            <div className="flex justify-start">
//              <div className="w-9 h-9 rounded-[14px] bg-yellow-200 flex items-center justify-center mr-2 text-xl">🧚</div>
//              <div className="bg-white px-4 py-3 rounded-r-xl rounded-bl-sm rounded-tl-xl shadow-sm">
//                <div className="flex gap-1">
//                  <span className="w-1.5 h-1.5 bg-gray-400 rounded-full animate-bounce"></span>
//                  <span className="w-1.5 h-1.5 bg-gray-400 rounded-full animate-bounce [animation-delay:0.2s]"></span>
//                  <span className="w-1.5 h-1.5 bg-gray-400 rounded-full animate-bounce [animation-delay:0.4s]"></span>
//                </div>
//              </div>
//            </div>
//         )}
//         <div ref={scrollRef} />
//       </div>

//       {/* 하단 입력창 */}
//       <div className="bg-white p-2 pb-5"> {/* 아이폰 하단 바 고려해서 pb-5 */}
//         <div className="bg-gray-100 rounded-full px-4 py-2 flex items-center gap-2">
//           <input
//             type="text"
//             className="flex-1 bg-transparent outline-none text-sm placeholder:text-gray-400"
//             placeholder="메시지 보내기"
//             value={input}
//             onChange={(e) => setInput(e.target.value)}
//             onKeyDown={handleKeyDown}
//           />
//           <button 
//             onClick={handleSend}
//             disabled={!input.trim()}
//             className={`p-2 rounded-full transition-colors ${
//               input.trim() ? 'bg-[#FEE500] text-black' : 'bg-gray-200 text-gray-400'
//             }`}
//           >
//             <Send size={18} />
//           </button>
//         </div>
//       </div>
//     </div>
//   );
// };

// export default ChatPage;

// src/pages/ChatPage.tsx
import { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { useItinerary } from '../context/ItineraryContext';
import type { ChatMessage } from '../types';
import {
  ArrowLeft, Menu, Search, Plus,
  Image as ImageIcon, Camera, Phone, Gift,
  CreditCard, Gamepad2, MapPin, Smile
} from 'lucide-react';

// ⭐️ 리얼한 커플 대화 데이터 (20~30마디)
const INITIAL_MESSAGES: ChatMessage[] = [
  { id: '1', sender: 'me', text: '자기야 이번 주말에 우리 뭐할까?', timestamp: '어제' },
  { id: '2', sender: 'ai', text: '음 글쎄.. 자기는 뭐 하고 싶은데?', timestamp: '어제' }, // ai = partner (편의상)
  { id: '3', sender: 'me', text: '나야 뭐 자기 좋은 거면 다 좋지 ㅋㅋ 어디 가고 싶은 데 없어?', timestamp: '어제' },
  { id: '4', sender: 'ai', text: '아 몰라잉 ㅠㅠ 요즘 너무 바빠서 찾아볼 시간이 없었어', timestamp: '어제' },
  { id: '5', sender: 'ai', text: '그냥 좀 힐링? 할 수 있는 데면 좋겠는데..', timestamp: '어제' },
  { id: '6', sender: 'me', text: '그럼 호캉스 갈까? 서울 시내에서?', timestamp: '어제' },
  { id: '7', sender: 'ai', text: '아니 서울은 좀 답답해.. 차 타고 좀 나가고 싶어', timestamp: '어제' },
  { id: '8', sender: 'me', text: '그럼 가평 쪽으로 글램핑?', timestamp: '어제' },
  { id: '9', sender: 'ai', text: '지금 날씨에? 너무 춥지 않을까? 🥶', timestamp: '어제' },
  { id: '10', sender: 'me', text: '아 그렇네.. 그럼 실내 데이트 위주로 찾아볼까?', timestamp: '어제' },
  { id: '11', sender: 'ai', text: '음.. 근데 또 바다는 보고 싶기도 하고..', timestamp: '어제' },
  { id: '12', sender: 'me', text: 'ㅋㅋㅋㅋㅋ 바다 보고 싶은데 춥기는 싫고 서울은 싫고?', timestamp: '어제' },
  { id: '13', sender: 'ai', text: '웅 ㅋㅋㅋㅋ 너무 까다롭나? 미안해 🥺', timestamp: '어제' },
  { id: '14', sender: 'me', text: '아냐아냐 내가 기가 막힌 데 찾아올게 기다려봐', timestamp: '어제' },
  { id: '15', sender: 'ai', text: '진짜? 기대한다? 맛있는 것도 사줘', timestamp: '어제' },
  { id: '16', sender: 'ai', text: '아 맞다 나 요즘 밀가루 끊은 거 알지? 파스타 이런 거 안돼', timestamp: '오늘 오전 10:20' },
  { id: '17', sender: 'me', text: '오케이 접수. 한식 위주로 알아볼게', timestamp: '오늘 오전 10:21' },
  { id: '18', sender: 'ai', text: '웅 그리고 사람 너무 많은 핫플은 기빨려.. 조용한 데가 좋아', timestamp: '오늘 오전 10:22' },
  { id: '19', sender: 'me', text: '알겠어 ㅋㅋ (조건이 점점 늘어나네)', timestamp: '오늘 오전 10:23' },
  { id: '20', sender: 'ai', text: '빨리 정해서 알려줘~~ 나 짐 싸야돼 ❤️', timestamp: '오늘 오전 10:25' },
];

const ChatPage = () => {
  const navigate = useNavigate();
  const { giftSent, itinerary, letter } = useItinerary();
  const scrollRef = useRef<HTMLDivElement>(null);

  const [input, setInput] = useState('');
  const [messages] = useState<ChatMessage[]>(INITIAL_MESSAGES);
  const [isMenuOpen, setIsMenuOpen] = useState(false); // + 버튼 메뉴 토글
  const isLoading = false; // 로딩 상태 (현재 미사용)

  // 스크롤 자동 이동
  useEffect(() => {
    scrollRef.current?.scrollIntoView({ behavior: 'auto' });
  }, [messages, isMenuOpen, isLoading]);

  // "하루선물" 버튼 클릭 시 실행
//   const handleStartGift = () => {
//     // 1. 메뉴 닫기 및 로딩 시작
//     setIsMenuOpen(false);
    
//     // 2. 시스템 메시지 추가 (선물 생성 중...)
//     const loadingMsg: ChatMessage = {
//       id: 'loading',
//       sender: 'me', // 내 말풍선으로 처리하거나 시스템 메시지로
//       text: '🎁 여친님을 위한 맞춤 코스를 생성하고 있어요...',
//       timestamp: '방금'
//     };
//     setMessages(prev => [...prev, loadingMsg]);
//     setIsLoading(true);

//     // 3. 3초 뒤 결과 페이지 이동
//     setTimeout(() => {
//       setItinerary(MOCK_RESULT);
//       navigate('/result');
//     }, 3000);
//   };
  const handleStartGift = () => {
    // 메뉴 닫기
    setIsMenuOpen(false);
    
    // 바로 온보딩 페이지로 이동 (로딩 X)
    navigate('/intro');
  };

  return (
    <div className="flex flex-col h-full bg-[#bacee0]">
      
      {/* 1. 상단 헤더 (여친님) */}
      <div className="bg-[#bacee0] p-3 px-4 flex items-center justify-between z-10">
        <div className="flex items-center gap-3">
          <ArrowLeft className="w-6 h-6 text-black cursor-pointer" />
          <div className="flex items-center gap-2">
            <span className="font-bold text-lg">여친님❤️</span>
            <span className="text-gray-500 text-xs">2</span>
          </div>
        </div>
        <div className="flex gap-4">
          <Search className="w-6 h-6 text-black" />
          <Menu className="w-6 h-6 text-black" />
        </div>
      </div>

      {/* 2. 채팅 영역 */}
      <div className="flex-1 overflow-y-auto p-4 flex flex-col gap-3 pb-4">
        {/* 날짜 구분선 */}
        <div className="flex justify-center my-2">
          <span className="bg-black/10 text-white text-xs px-3 py-1 rounded-full">
            2026년 1월 15일 목요일
          </span>
        </div>

        {messages.map((msg) => (
          <div key={msg.id} className={`flex ${msg.sender === 'me' ? 'justify-end' : 'justify-start'}`}>
            {msg.sender === 'ai' && (
              <div className="w-10 h-10 rounded-[16px] bg-gray-200 overflow-hidden mr-2 border border-gray-100 flex-shrink-0">
                <img 
                   src="https://api.dicebear.com/7.x/avataaars/svg?seed=Felix" 
                   alt="profile" 
                   className="w-full h-full object-cover"
                />
              </div>
            )}
            <div className="flex flex-col gap-1 max-w-[70%]">
              {msg.sender === 'ai' && <span className="text-xs text-gray-500 ml-1">여친님❤️</span>}
              <div className="flex items-end gap-1">
                {msg.sender === 'me' && (
                   <span className="text-[10px] text-gray-500 min-w-max mb-1">{msg.timestamp}</span>
                )}
                <div
                  className={`px-3 py-2 text-sm shadow-sm leading-relaxed ${
                    msg.sender === 'me'
                      ? 'bg-[#FEE500] text-black rounded-l-xl rounded-br-sm rounded-tr-xl' 
                      : 'bg-white text-black rounded-r-xl rounded-bl-sm rounded-tl-xl'
                  }`}
                >
                  {msg.text}
                </div>
                {msg.sender === 'ai' && (
                   <span className="text-[10px] text-gray-500 min-w-max mb-1">{msg.timestamp}</span>
                )}
              </div>
            </div>
          </div>
        ))}
        
        {/* 로딩 애니메이션 (여행 생성 중일 때) */}
        {isLoading && (
           <div className="flex justify-center my-4 animate-pulse">
             <span className="bg-black/20 text-white text-xs px-4 py-2 rounded-full flex items-center gap-2">
               ✨ 대화 내용을 분석해서 코스를 짜는 중...
             </span>
           </div>
        )}

        {/* 🎁 선물 카드 (선물 완료 시 표시) */}
        {giftSent && itinerary && (
          <div className="flex justify-end my-2">
            <div
              onClick={() => navigate('/gift-view')}
              className="w-[280px] bg-white rounded-2xl overflow-hidden shadow-lg border border-gray-100 cursor-pointer active:scale-[0.98] transition-transform"
            >
              {/* 상단 이미지 영역 */}
              <div className="h-[160px] bg-gradient-to-br from-emerald-400 to-teal-500 relative overflow-hidden">
                {/* 일러스트 배경 */}
                <div className="absolute inset-0 flex items-center justify-center">
                  <div className="text-white/20 text-8xl">🌳</div>
                </div>
                <div className="absolute top-4 left-4 text-white">
                  <p className="text-lg font-bold leading-tight">
                    조금 쉬었다가도<br/>괜찮아
                  </p>
                </div>
                {/* 나무 이모지들 */}
                <div className="absolute bottom-0 left-0 right-0 flex justify-center gap-2 pb-2 text-3xl">
                  🌲🌳🌲
                </div>
              </div>

              {/* 장소 썸네일 */}
              <div className="flex items-center gap-3 p-3 border-b border-gray-100">
                <img
                  src={itinerary.places[0]?.imageUrl}
                  alt="place"
                  className="w-12 h-12 rounded-lg object-cover"
                />
                <div className="flex-1 min-w-0">
                  <p className="text-xs text-gray-400">하루선물</p>
                  <p className="text-sm font-medium truncate">
                    {itinerary.theme || '특별한'} {itinerary.places[0]?.location?.split(' ')[0] || '서촌'} 코스
                  </p>
                </div>
              </div>

              {/* 메시지 영역 */}
              <div className="p-4">
                <div className="flex items-start gap-2 mb-3">
                  <span className="text-pink-500">💌</span>
                  <div>
                    <p className="text-sm font-medium text-gray-800">함께 온 메시지</p>
                    <p className="text-xs text-gray-500 mt-1 line-clamp-2">
                      "{letter || itinerary.finalLetter || '특별한 하루를 선물해요'}"
                    </p>
                  </div>
                </div>

                <p className="text-[10px] text-gray-400 mb-3">
                  1월 15일 까지 확인해주세요.
                </p>

                {/* 버튼들 */}
                <div className="flex flex-col gap-2">
                  <button className="w-full py-2.5 bg-gray-100 rounded-lg text-sm font-medium text-gray-700">
                    주문내역 보기
                  </button>
                  <button className="w-full py-2.5 bg-gray-100 rounded-lg text-sm font-medium text-gray-700 flex items-center justify-center gap-1">
                    <span className="text-pink-500">💌</span> 메시지카드 열기
                  </button>
                </div>
              </div>

              {/* 하단 */}
              <div className="px-4 py-3 border-t border-gray-100 flex items-center justify-between">
                <div className="flex items-center gap-1.5 text-xs text-gray-400">
                  <span>🎁</span>
                  <span>카카오톡 선물하기</span>
                </div>
                <span className="text-gray-300">›</span>
              </div>
            </div>
          </div>
        )}

        <div ref={scrollRef} />
      </div>

      {/* 3. 하단 입력바 & 메뉴 Drawer */}
      <div className={`bg-white transition-all duration-300 ${isMenuOpen ? 'pb-0' : 'pb-5'}`}>
        
        {/* 입력창 */}
        <div className="p-2 flex items-center gap-2">
          <button 
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            className={`p-2 rounded-full transition-colors ${isMenuOpen ? 'bg-gray-200 rotate-45' : 'hover:bg-gray-100'}`}
          >
            <Plus size={24} className="text-gray-500 transition-transform duration-200" />
          </button>
          
          <div className="flex-1 bg-gray-100 rounded-full px-4 py-2 flex items-center justify-between">
             <input
              type="text"
              className="bg-transparent outline-none text-sm placeholder:text-gray-400 w-full"
              placeholder="메시지 입력"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              disabled={isLoading}
            />
            <Smile size={20} className="text-gray-400" />
          </div>
          
          <button className="p-2 bg-[#FEE500] rounded-full text-black">
             {/* 전송 버튼 아이콘만 간단히 */}
             <ArrowLeft size={20} className="rotate-180 fill-current" />
          </button>
        </div>

        {/* 4. 확장 메뉴 (Drawer) - 카카오톡 스타일 */}
        {isMenuOpen && (
          <div className="grid grid-cols-4 gap-y-6 px-4 pt-6 pb-8 border-t border-gray-100 bg-white h-64 animate-slide-up">
            {/* 1. 하루선물 (핵심 기능) */}
            <div className="flex flex-col items-center gap-2 cursor-pointer group" onClick={handleStartGift}>
              <div className="w-12 h-12 rounded-full bg-pink-100 flex items-center justify-center border-2 border-pink-200 group-hover:scale-105 transition-transform">
                <Gift className="text-pink-500 w-6 h-6" />
              </div>
              <span className="text-xs text-gray-700 font-medium">하루선물</span>
            </div>

            {/* 나머지 더미 아이콘들 */}
            <MenuIconBox icon={<ImageIcon />} label="앨범" />
            <MenuIconBox icon={<Camera />} label="카메라" />
            <MenuIconBox icon={<Gift />} label="선물하기" />
            <MenuIconBox icon={<CreditCard />} label="송금" />
            <MenuIconBox icon={<Phone />} label="통화" />
            <MenuIconBox icon={<MapPin />} label="지도" />
            <MenuIconBox icon={<Gamepad2 />} label="미니게임" />
          </div>
        )}
      </div>
    </div>
  );
};

// 메뉴 아이콘 컴포넌트 (반복 줄이기용)
const MenuIconBox = ({ icon, label }: { icon: React.ReactNode, label: string }) => (
  <div className="flex flex-col items-center gap-2 cursor-pointer opacity-70 hover:opacity-100">
    <div className="w-12 h-12 rounded-full bg-[#f2f2f2] flex items-center justify-center text-gray-600">
      {icon}
    </div>
    <span className="text-xs text-gray-600">{label}</span>
  </div>
);

export default ChatPage;