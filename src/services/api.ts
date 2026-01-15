// src/services/api.ts
// 하루선물 API 서비스 레이어

// ============================================
// 1. 타입 정의
// ============================================

// API 요청 타입
export interface CourseGenerateRequest {
  sessionId: string;
  region: string;
  purpose: string;
  course_structure: string[];  // ["음식점", "카페", "문화시설"]
  user_request: string;
}

// API 응답 - 개별 장소 타입
export interface ApiPlaceResponse {
  step_order: number;
  course_type: string;        // "음식점", "카페", "문화시설", "숙소"
  place_name: string;
  region: string;
  category: string;           // "이탈리안", "베이커리" 등
  tags: string;               // 쉼표로 구분된 문자열
  review_count: number;
  rating: number;
  image_url: string;          // AI 생성 이미지 URL
  address: string;
  coordinates: string;        // "37.5665, 126.9884" 형태
  reason: string;             // AI 추천 사유
}

// API 응답 전체 타입
export type CourseGenerateResponse = ApiPlaceResponse[];

// 에러 타입
export class ApiError extends Error {
  statusCode?: number;
  isTimeout: boolean;

  constructor(
    message: string,
    statusCode?: number,
    isTimeout: boolean = false
  ) {
    super(message);
    this.name = 'ApiError';
    this.statusCode = statusCode;
    this.isTimeout = isTimeout;
  }
}

// ============================================
// 2. 설정
// ============================================

const API_CONFIG = {
  baseUrl: 'https://dev.harukakao.life',
  endpoint: '/webhook/3cdeb798-a639-4962-82a6-cf92469c752d',
  timeout: 60000, // 60초 타임아웃 (테스트용, AI 응답 5~15초 + 여유)
};

// ============================================
// 3. 유틸리티 함수
// ============================================

// 세션 ID 생성 (브라우저 세션 동안 유지)
export const getSessionId = (): string => {
  const STORAGE_KEY = 'HARU_SESSION_ID';

  let sessionId = sessionStorage.getItem(STORAGE_KEY);

  if (!sessionId) {
    sessionId = `session-${Date.now()}-${Math.random().toString(36).substring(2, 9)}`;
    sessionStorage.setItem(STORAGE_KEY, sessionId);
  }

  return sessionId;
};

// 좌표 문자열 파싱 ("37.5665, 126.9884" → { lat: 37.5665, lng: 126.9884 })
export const parseCoordinates = (coordString: string): { lat: number; lng: number } | null => {
  try {
    const [lat, lng] = coordString.split(',').map(s => parseFloat(s.trim()));
    if (isNaN(lat) || isNaN(lng)) return null;
    return { lat, lng };
  } catch {
    return null;
  }
};

// 태그 문자열 파싱 ("분위기깡패, 기념일추천" → ["분위기깡패", "기념일추천"])
export const parseTags = (tagString: string): string[] => {
  if (!tagString) return [];
  return tagString.split(',').map(t => t.trim()).filter(Boolean);
};

// ============================================
// 4. API 호출 함수
// ============================================

export const generateCourse = async (
  request: Omit<CourseGenerateRequest, 'sessionId'>
): Promise<CourseGenerateResponse> => {
  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), API_CONFIG.timeout);

  try {
    const fullRequest: CourseGenerateRequest = {
      ...request,
      sessionId: getSessionId(),
    };

    const url = `${API_CONFIG.baseUrl}${API_CONFIG.endpoint}`;
    const body = JSON.stringify(fullRequest);

    console.log('='.repeat(50));
    console.log('[API] 코스 생성 요청 시작');
    console.log('[API] URL:', url);
    console.log('[API] Body:', body);
    console.log('='.repeat(50));

    const response = await fetch(url, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: body,
      signal: controller.signal,
    });

    clearTimeout(timeoutId);

    console.log('[API] Response Status:', response.status);
    console.log('[API] Response OK:', response.ok);

    // HTTP 에러 처리
    if (!response.ok) {
      const errorText = await response.text();
      console.error('[API] Error Response:', errorText);
      throw new ApiError(
        `서버 오류가 발생했습니다. (${response.status})`,
        response.status
      );
    }

    const rawText = await response.text();
    console.log('[API] Raw Response:', rawText);

    // 1. 먼저 외부 JSON 파싱 ({ reply: "..." })
    const outerJson = JSON.parse(rawText);
    console.log('[API] Outer JSON:', outerJson);

    // 2. reply 필드에서 마크다운 코드블록 내 JSON 추출
    const reply = outerJson.reply || rawText;
    const jsonMatch = reply.match(/```json\s*([\s\S]*?)\s*```/);

    let data: CourseGenerateResponse;
    if (jsonMatch && jsonMatch[1]) {
      data = JSON.parse(jsonMatch[1]);
    } else {
      // 코드 블록 없이 바로 JSON인 경우
      data = JSON.parse(reply);
    }

    console.log('[API] Parsed Places:', data);

    // 빈 배열 응답 처리
    if (!Array.isArray(data) || data.length === 0) {
      throw new ApiError('적합한 장소를 찾지 못했습니다. 다른 조건으로 시도해주세요.');
    }

    return data;

  } catch (error) {
    clearTimeout(timeoutId);

    console.error('[API] 에러 발생:', error);

    // AbortError (타임아웃)
    if (error instanceof Error && error.name === 'AbortError') {
      console.error('[API] 타임아웃 발생 (30초 초과)');
      throw new ApiError(
        '요청 시간이 초과되었습니다. 다시 시도해주세요.',
        undefined,
        true
      );
    }

    // 이미 ApiError인 경우 그대로 throw
    if (error instanceof ApiError) {
      throw error;
    }

    // 네트워크 에러 등
    console.error('[API] 네트워크 에러:', error instanceof Error ? error.message : error);
    throw new ApiError(
      '네트워크 오류가 발생했습니다. 인터넷 연결을 확인해주세요.'
    );
  }
};

// ============================================
// 5. 데이터 변환 함수 (API 응답 → 앱 내부 타입)
// ============================================

import type { Place } from '../types';

// 카테고리별 로컬 이미지 (import.meta.glob으로 동적 로드)
const koreanFoodImages = Object.values(
  import.meta.glob('../assets/images/korean_food/*.jpg', { eager: true, import: 'default' })
) as string[];

const americanFoodImages = Object.values(
  import.meta.glob('../assets/images/american_food/*.jpg', { eager: true, import: 'default' })
) as string[];

const cafeteriaImages = Object.values(
  import.meta.glob('../assets/images/cafeteria/*.jpg', { eager: true, import: 'default' })
) as string[];

const cultureImages = Object.values(
  import.meta.glob('../assets/images/culture/*.jpg', { eager: true, import: 'default' })
) as string[];

const cinemaImages = Object.values(
  import.meta.glob('../assets/images/cinema/*.jpg', { eager: true, import: 'default' })
) as string[];

const houseImages = Object.values(
  import.meta.glob('../assets/images/house/*.jpg', { eager: true, import: 'default' })
) as string[];

// 카테고리별 이미지 풀
const CATEGORY_IMAGES: Record<string, string[]> = {
  '음식점': [...koreanFoodImages, ...americanFoodImages],
  '카페': cafeteriaImages,
  '문화시설': [...cultureImages, ...cinemaImages],
  '숙소': houseImages,
};

// 카테고리별 인덱스 카운터 (순차적으로 돌려쓰기)
const categoryIndexCounter: Record<string, number> = {
  '음식점': 0,
  '카페': 0,
  '문화시설': 0,
  '숙소': 0,
};

// 카테고리에 맞는 로컬 이미지 반환 (순차적으로 돌려씀)
export const getLocalImage = (category: string): string => {
  const images = CATEGORY_IMAGES[category] || CATEGORY_IMAGES['음식점'];
  const currentIndex = categoryIndexCounter[category] || 0;
  const image = images[currentIndex % images.length];
  categoryIndexCounter[category] = currentIndex + 1;
  return image;
};

// 인덱스 카운터 리셋 (새로운 코스 생성 시 호출)
export const resetImageCounters = () => {
  Object.keys(categoryIndexCounter).forEach(key => {
    categoryIndexCounter[key] = 0;
  });
};

export const transformApiResponseToPlace = (apiPlace: ApiPlaceResponse): Place => {
  return {
    id: `place_${apiPlace.step_order}_${Date.now()}`,
    order: apiPlace.step_order,
    name: apiPlace.place_name,
    category: apiPlace.course_type,
    detailCategory: apiPlace.category,
    location: apiPlace.address,
    coordinates: apiPlace.coordinates,
    rating: apiPlace.rating,
    reviewCount: apiPlace.review_count,
    intro: apiPlace.reason,
    imageUrl: getLocalImage(apiPlace.course_type),
    tags: parseTags(apiPlace.tags),
  };
};

export const transformApiResponseToPlaces = (response: CourseGenerateResponse): Place[] => {
  resetImageCounters(); // 새 코스 생성 시 카운터 리셋
  return response.map(transformApiResponseToPlace);
};
