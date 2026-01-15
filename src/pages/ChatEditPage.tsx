// src/pages/ChatEditPage.tsx
import { useState, useRef, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { ArrowLeft, Send, Star, MapPin } from 'lucide-react';
import type { Place } from '../types';
import { useItinerary, type ChatSessionMsg } from '../context/ItineraryContext';
import DragScrollContainer from '../components/DragScrollContainer';
import { generateCourse, parseTags, type ApiPlaceResponse } from '../services/api';

// API 응답을 카드 형식으로 변환
const transformToCard = (data: ApiPlaceResponse) => ({
  id: `place_${data.step_order}_${Date.now()}`,
  name: data.place_name,
  category: data.category,
  courseType: data.course_type,
  region: data.region,
  tags: parseTags(data.tags),
  reviewCount: data.review_count,
  rating: data.rating,
  img: data.image_url,
  address: data.address,
  coordinates: data.coordinates,
  reason: data.reason,
});

const ChatEditPage = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { itinerary, chatSessions, saveChatSession } = useItinerary();

  const currentPlace = location.state?.place as Place;
  const scrollRef = useRef<HTMLDivElement>(null);

  const [input, setInput] = useState('');
  const [isTyping, setIsTyping] = useState(false);

  // 초기 메시지 로드
  const [chatHistory, setChatHistory] = useState<ChatSessionMsg[]>(() => {
    if (currentPlace && chatSessions[currentPlace.id]) {
      return chatSessions[currentPlace.id];
    }
    return [{ type: 'ai', text: `${currentPlace?.category} 장소가 마음에 안 드시나요? 원하시는 분위기나 메뉴를 말씀해주세요!` }];
  });

  // 채팅 내역 저장 & 스크롤
  useEffect(() => {
    if (currentPlace) {
      saveChatSession(currentPlace.id, chatHistory);
    }
    scrollRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [chatHistory, currentPlace]);

  const handleSend = async () => {
    if (!input.trim() || isTyping) return;

    // 유저 메시지 추가
    setChatHistory(prev => [...prev, { type: 'user', text: input }]);
    const userInput = input;
    setInput('');
    setIsTyping(true);

    try {
      // API 호출
      const apiResponse = await generateCourse({
        region: itinerary?.region || '서울',
        purpose: itinerary?.theme || '데이트',
        course_structure: [currentPlace.category], // 현재 장소의 카테고리만
        user_request: `${currentPlace.category} 장소를 변경하고 싶어요. ${userInput}`,
      });

      // API 응답을 카드로 변환 (image_url 포함)
      const cards = apiResponse.map(transformToCard);

      setChatHistory(prev => [
        ...prev,
        {
          type: 'ai',
          text: `"${userInput}" 의견을 반영해서 새로운 곳을 찾아봤어요.`,
          cards: cards
        }
      ]);
    } catch (error) {
      console.error('[ChatEdit] API 에러:', error);
      setChatHistory(prev => [
        ...prev,
        {
          type: 'ai',
          text: '죄송해요, 장소를 찾는 중 오류가 발생했어요. 다시 시도해주세요.'
        }
      ]);
    } finally {
      setIsTyping(false);
    }
  };

  // 한글 두 번 입력 방지
  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.nativeEvent.isComposing) return;
    if (e.key === 'Enter') {
      handleSend();
    }
  };

  const goToDetail = (newPlace: any) => {
    navigate('/place-detail', {
      state: {
        originalPlaceId: currentPlace.id,
        newPlaceData: newPlace
      }
    });
  };

  if (!currentPlace) return <div>잘못된 접근입니다.</div>;

  return (
    <div className="flex flex-col h-full bg-white relative">
      {/* 헤더 */}
      <div className="bg-white border-b border-gray-100 z-10">
        <div className="h-14 flex items-center px-4">
          <button onClick={() => navigate(-1)}><ArrowLeft className="w-6 h-6" /></button>
          <span className="font-bold text-lg ml-2">변경하기</span>
        </div>
        {/* 현재 장소 카드 */}
        <div className="px-4 pb-4">
          <div className="flex gap-4 p-3 bg-gray-50 rounded-xl border border-gray-100">
            <img src={currentPlace.imageUrl} className="w-16 h-16 rounded-lg object-cover" />
            <div>
              <span className="text-xs text-gray-500 font-bold">{currentPlace.category}</span>
              <h3 className="font-bold text-gray-800">{currentPlace.name}</h3>
              <p className="text-xs text-gray-400 mt-1 line-clamp-1">{currentPlace.intro}</p>
            </div>
          </div>
        </div>
      </div>

      {/* 채팅 영역 */}
      <div className="flex-1 overflow-y-auto p-4 bg-gray-50 flex flex-col gap-4 pb-20">
        {chatHistory.map((msg, idx) => (
          <div key={idx} className={`flex flex-col ${msg.type === 'user' ? 'items-end' : 'items-start'}`}>
            {msg.text && (
              <div className={`max-w-[80%] px-4 py-3 text-sm leading-relaxed shadow-sm ${
                msg.type === 'user'
                  ? 'bg-black text-white rounded-l-xl rounded-tr-xl rounded-br-sm'
                  : 'bg-white text-black border border-gray-200 rounded-r-xl rounded-tl-xl rounded-bl-sm'
              }`}>
                {msg.text}
              </div>
            )}

            {/* 추천 장소 카드 */}
            {msg.cards && (
              <DragScrollContainer className="flex gap-3 mt-3 overflow-x-auto w-full pb-2 px-1 snap-x scrollbar-hide">
                {msg.cards.map((card: any) => (
                  <div
                    key={card.id}
                    onClick={() => goToDetail(card)}
                    className="min-w-[240px] bg-white rounded-xl overflow-hidden shadow-md border border-gray-100 cursor-pointer active:scale-95 transition-transform snap-center"
                  >
                    {/* 이미지 */}
                    <div className="h-32 bg-gray-200 relative">
                      <img src={card.img} className="w-full h-full object-cover" />
                      <div className="absolute top-2 right-2 bg-black/60 text-white text-[10px] px-2 py-1 rounded-full">
                        {card.courseType}
                      </div>
                    </div>

                    {/* 정보 */}
                    <div className="p-3">
                      {/* 이름 & 카테고리 */}
                      <div className="flex items-center gap-2 mb-1">
                        <h4 className="font-bold text-sm">{card.name}</h4>
                        <span className="text-[10px] text-gray-400">{card.category}</span>
                      </div>

                      {/* 별점 & 리뷰 */}
                      <div className="flex items-center gap-1 mb-2">
                        <Star size={12} className="text-yellow-500 fill-yellow-500" />
                        <span className="text-xs font-medium">{card.rating}</span>
                        <span className="text-[10px] text-gray-400">리뷰 {card.reviewCount?.toLocaleString()}</span>
                      </div>

                      {/* 주소 */}
                      <div className="flex items-center gap-1 mb-2">
                        <MapPin size={10} className="text-gray-400" />
                        <span className="text-[10px] text-gray-500 truncate">{card.address}</span>
                      </div>

                      {/* 태그 */}
                      <div className="flex flex-wrap gap-1">
                        {card.tags?.slice(0, 3).map((t: string) => (
                          <span key={t} className="text-[10px] bg-gray-100 px-1.5 py-0.5 rounded text-gray-500">
                            #{t}
                          </span>
                        ))}
                      </div>

                      {/* 추천 이유 */}
                      {card.reason && (
                        <p className="text-[10px] text-blue-500 mt-2 line-clamp-2">
                          💡 {card.reason}
                        </p>
                      )}
                    </div>
                  </div>
                ))}
              </DragScrollContainer>
            )}
          </div>
        ))}

        {isTyping && (
          <div className="flex items-center gap-1 ml-2">
            <span className="w-2 h-2 bg-gray-300 rounded-full animate-bounce"></span>
            <span className="w-2 h-2 bg-gray-300 rounded-full animate-bounce delay-100"></span>
            <span className="w-2 h-2 bg-gray-300 rounded-full animate-bounce delay-200"></span>
          </div>
        )}
        <div ref={scrollRef} />
      </div>

      {/* 입력창 */}
      <div className="absolute bottom-0 w-full bg-white p-3 border-t border-gray-100">
        <div className="bg-gray-100 rounded-full px-4 py-2 flex items-center gap-2">
          <input
            type="text"
            className="flex-1 bg-transparent outline-none text-sm p-1"
            placeholder={isTyping ? "AI가 답변 중입니다..." : "바꾸고 싶은 조건을 입력하세요"}
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={handleKeyDown}
            disabled={isTyping}
          />
          <button
            onClick={handleSend}
            disabled={!input.trim() || isTyping}
            className={`p-2 rounded-full transition-colors ${
              input.trim() && !isTyping ? 'bg-black text-white' : 'bg-gray-300 text-gray-500'
            }`}
          >
            <Send size={16} />
          </button>
        </div>
      </div>
    </div>
  );
};

export default ChatEditPage;
