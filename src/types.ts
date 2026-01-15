// src/types.ts

// 1. 장소 (Place) - 변경 가능한 최소 단위
export interface Place {
  id: string;             
  order: number;          // 1, 2, 3... 순서
  name: string;           
  category: string;       // "식사", "카페", "관광"
  location: string;       
  rating: number;         
  reviewCount: number;    
  intro: string;          // "줄서서 먹는 맛집"
  imageUrl: string;       
  userMemo?: string;      // 사용자가 남길 메모
}

// 2. 전체 여행 데이터 (Itinerary)
export interface Itinerary {
  id: string;
  theme: string;          // "100일 기념", "힐링" 등 (목적)
  region: string;         // "을지로", "서촌" 등 (지역)
  targetName: string;     // 누구에게 줄 선물인가? (ex: "루아")
  places: Place[];
  finalLetter?: string;   // 마지막 편지 내용
}

// 3. 채팅 메시지 (UI용)
export interface ChatMessage {
  id: string;
  sender: 'me' | 'ai';
  text: string;
  timestamp: string;
}