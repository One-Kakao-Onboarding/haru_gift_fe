// // src/context/ItineraryContext.tsx
// import React, { createContext, useContext, useState, useEffect, type ReactNode } from 'react';
// import type { Itinerary, Place } from '../types';

// interface ItineraryContextType {
//   itinerary: Itinerary | null;
//   setItinerary: (data: Itinerary) => void;
//   updatePlace: (placeId: string, newPlaceData: Place) => void; // 장소 갈아끼우기 함수
//   updateLetter: (text: string) => void; // 편지 저장 함수
//   resetData: () => void;
// }

// const ItineraryContext = createContext<ItineraryContextType | undefined>(undefined);

// // 로컬 스토리지 키 이름
// const STORAGE_KEY = 'KAKAO_DAY_GIFT_DATA';

// export const ItineraryProvider = ({ children }: { children: ReactNode }) => {
//   const [itinerary, setItineraryState] = useState<Itinerary | null>(() => {
//     // 1. 앱이 켜질 때 로컬 스토리지 확인
//     const saved = localStorage.getItem(STORAGE_KEY);
//     return saved ? JSON.parse(saved) : null;
//   });

//   // 2. 데이터가 변할 때마다 로컬 스토리지에 자동 저장
//   useEffect(() => {
//     if (itinerary) {
//       localStorage.setItem(STORAGE_KEY, JSON.stringify(itinerary));
//     }
//   }, [itinerary]);

//   const setItinerary = (data: Itinerary) => {
//     setItineraryState(data);
//   };

//   // 핵심 기능: 특정 장소만 쏙 빼서 교체하기
//   const updatePlace = (placeId: string, newPlaceData: Place) => {
//     setItineraryState((prev) => {
//       if (!prev) return null;
//       return {
//         ...prev,
//         places: prev.places.map((p) => (p.id === placeId ? newPlaceData : p)),
//       };
//     });
//   };

//   const updateLetter = (text: string) => {
//     setItineraryState((prev) => {
//       if (!prev) return null;
//       return { ...prev, finalLetter: text };
//     });
//   };

//   const resetData = () => {
//     localStorage.removeItem(STORAGE_KEY);
//     setItineraryState(null);
//   };

//   return (
//     <ItineraryContext.Provider value={{ itinerary, setItinerary, updatePlace, updateLetter, resetData }}>
//       {children}
//     </ItineraryContext.Provider>
//   );
// };

// // 사용하기 편하게 Hook으로 만듦
// export const useItinerary = () => {
//   const context = useContext(ItineraryContext);
//   if (!context) throw new Error('useItinerary must be used within a Provider');
//   return context;
// };
// src/context/ItineraryContext.tsx
import { createContext, useContext, useState, useEffect, type ReactNode } from 'react';
import type { Itinerary, Place } from '../types';

// 채팅 메시지 타입 재정의 (ChatEditPage에서 쓰는 것과 통일)
export interface ChatSessionMsg {
  type: 'user' | 'ai';
  text?: string;
  cards?: any[];
}

interface ItineraryContextType {
  itinerary: Itinerary | null;
  setItinerary: (data: Itinerary) => void;
  updatePlace: (placeId: string, newPlaceData: Place) => void;

  // 👇 채팅 내역 저장소 추가
  chatSessions: Record<string, ChatSessionMsg[]>;
  saveChatSession: (placeId: string, messages: ChatSessionMsg[]) => void;

  // 👇 편지 내용 저장
  letter: string;
  setLetter: (text: string) => void;

  // 👇 선물 전송 완료 상태
  giftSent: boolean;
  setGiftSent: (sent: boolean) => void;

  resetData: () => void;
}

const ItineraryContext = createContext<ItineraryContextType | undefined>(undefined);
const STORAGE_KEY = 'KAKAO_DAY_GIFT_DATA';

export const ItineraryProvider = ({ children }: { children: ReactNode }) => {
  const [itinerary, setItineraryState] = useState<Itinerary | null>(() => {
    const saved = localStorage.getItem(STORAGE_KEY);
    return saved ? JSON.parse(saved) : null;
  });

  // 👇 채팅 세션 상태 (새로고침하면 채팅은 날아가도 됨. 원하면 이것도 localStorage 저장 가능)
  const [chatSessions, setChatSessions] = useState<Record<string, ChatSessionMsg[]>>({});

  // 👇 편지 내용 상태
  const [letter, setLetterState] = useState<string>('');

  // 👇 선물 전송 완료 상태
  const [giftSent, setGiftSentState] = useState<boolean>(false);

  useEffect(() => {
    if (itinerary) {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(itinerary));
    }
  }, [itinerary]);

  const setItinerary = (data: Itinerary) => setItineraryState(data);

  const updatePlace = (placeId: string, newPlaceData: Place) => {
    setItineraryState((prev) => {
      if (!prev) return null;
      return {
        ...prev,
        places: prev.places.map((p) => (p.id === placeId ? newPlaceData : p)),
      };
    });
  };

  // 👇 특정 장소에 대한 채팅 내역 저장
  const saveChatSession = (placeId: string, messages: ChatSessionMsg[]) => {
    setChatSessions(prev => ({
      ...prev,
      [placeId]: messages
    }));
  };

  // 👇 편지 내용 저장
  const setLetter = (text: string) => {
    setLetterState(text);
  };

  // 👇 선물 전송 완료
  const setGiftSent = (sent: boolean) => {
    setGiftSentState(sent);
  };

  const resetData = () => {
    localStorage.removeItem(STORAGE_KEY);
    setItineraryState(null);
    setChatSessions({});
    setLetterState('');
    setGiftSentState(false);
  };

  return (
    <ItineraryContext.Provider value={{
      itinerary, setItinerary, updatePlace,
      chatSessions, saveChatSession,
      letter, setLetter,
      giftSent, setGiftSent,
      resetData
    }}>
      {children}
    </ItineraryContext.Provider>
  );
};

export const useItinerary = () => {
  const context = useContext(ItineraryContext);
  if (!context) throw new Error('useItinerary must be used within a Provider');
  return context;
};