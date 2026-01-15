// src/types.ts

// 1. 장소 (Place) - 변경 가능한 최소 단위
export interface Place {
  id: string;
  order: number;              // 1, 2, 3... 순서
  name: string;
  category: string;           // 코스 타입: "음식점", "카페", "문화시설", "숙소"
  detailCategory?: string;    // 세부 카테고리: "이탈리안", "베이커리" 등
  location: string;           // 주소
  coordinates?: string;       // 좌표: "37.5665, 126.9884"
  rating: number;
  reviewCount: number;
  intro: string;              // 설명 또는 AI 추천 사유
  imageUrl: string;
  tags?: string[];            // 태그 배열: ["분위기깡패", "기념일추천"]
  userMemo?: string;          // 사용자가 남길 메모
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