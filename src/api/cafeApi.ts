// src/api/cafeApi.ts
import axios from "axios";

const BASE_URL = "https://studyspot.kr/api";
// ----------------------
// 타입 정의
// ----------------------
export interface Cafe {
  id: number;
  name: string;
  location: string;
  tags: string[];
  thumbnail?: string;
  rating?: number;
  hours?: string;
}

export interface Category {
  id: number;
  name: string;
}

export interface CafeReview {
  id: number;
  rating: number;
  comment: string;
  author?: string;
  createdAt?: string;
}

export interface NewReview {
  rating: number;
  comment: string;
}

// ----------------------
// 추천 카페
// ----------------------
export const getRecommendedCafes = async (): Promise<Cafe[]> => {
  try {
    const res = await axios.get<{ cafes: Cafe[] }>(
      `${BASE_URL}/cafes/recommended`
    );
    return res.data.cafes;
  } catch (err) {
    console.error("[ERROR] 추천 카페 불러오기 실패:", err);
    return [];
  }
};

// ----------------------
// 카테고리
// ----------------------
export const getCategories = async (): Promise<Category[]> => {
  try {
    const res = await axios.get<{ categories: Category[] }>(
      `${BASE_URL}/categories`
    );
    return res.data.categories;
  } catch (err) {
    console.error("[ERROR] 카테고리 불러오기 실패:", err);
    return [];
  }
};

// ----------------------
// AI 태그 (기존 TAG_KEYWORDS 기반)
// ----------------------
const TAG_KEYWORDS: { [tag: string]: string[] } = {
  카페: ["카페", "커피", "디저트", "케이크", "쿠키", "노트북"],
  스터디카페: ["스터디카페", "공부", "집중"],
  독서실: ["독서실", "책", "혼공", "조용한"],
  어두움: ["조명 어두움", "어두움", "어두운", "컴컴"],
  중간: ["조명 중간", "적당한 조명", "중간"],
  밝음: ["조 명 밝음", "밝은 조명", "햇빛", "밝음", "밝은"],
  조용함: ["조용함", "조용한", "차분", "집중", "혼자", "시험", "조용", "집중"],
  "적당한 소음": ["적당한소음", "보통"],
  "시끌벅적": ["시끌벅적", "북적", "떠들썩"],
  "콘센트 있음": ["콘센트", "있음", "전원", "노트북", "코딩"],
  "시간제한 있음": ["2시간 이하", "시간제한 있음", "빈자리"],
  "시간제한 없음": ["시간제한 없음", "오래있기좋음"],
  "주차 가능": ["주차 가능", "주차여유", "주차", "차", "차량"],
  "유료 주차": ["유료주차", "주차비"],
  "주차 불가": ["주차불가", "주차없음"],
  "지하철 근처": ["지하철", "역근ㄴ처", "역세권", "역", "뚜벅이"],
  "버스정류장 근처": ["버스정류장", "버스근처"],
  "접근성 좋음": ["접근성좋음", "편리", "오가기편함"],
  "번화가": ["번화가", "상권좋음", "역근처"],
  "조용한 골목": ["조용한골목", "한적"],
  "공원 근처": ["공원근처", "산책", "공원"],
  "캠퍼스 근처": ["캠퍼스근처", "학교근처", "학교"],
  "애견동반 가능": ["애견동반", "반려견", "강아지", "애카", "동물"],
  "애견동반 불가능": ["애견동반불가", "반려견불가", "강아지불가"],
};

export const getAiTags = async (query: string): Promise<string[]> => {
  if (!query.trim()) return [];
  const lowerQuery = query.toLowerCase();
  const matchedTags = Object.entries(TAG_KEYWORDS)
    .filter(([tag, keywords]) =>
      keywords.some((keyword) => lowerQuery.includes(keyword.toLowerCase()))
    )
    .map(([tag]) => tag);
  return Array.from(new Set(matchedTags)).slice(0, 5);
};

// ----------------------
// 카페 검색
// ----------------------
export const searchCafes = async (
  keyword: string,
  tags: string[]
): Promise<Cafe[]> => {
  try {
    const res = await axios.get<{ cafes: Cafe[] }>(`${BASE_URL}/cafes`);
    return res.data.cafes.filter(
      (cafe) =>
        (!keyword || cafe.name.includes(keyword)) &&
        tags.every((t) => cafe.tags.includes(t))
    );
  } catch (err) {
    console.error("[ERROR] 카페 검색 실패:", err);
    return [];
  }
};

// ----------------------
// 카페 상세
// ----------------------
export const getCafeDetail = async (cafeId: string): Promise<Cafe> => {
  try {
    const res = await axios.get<{ cafe: Cafe }>(`${BASE_URL}/cafes/${cafeId}`);
    return res.data.cafe;
  } catch (err) {
    console.error("[ERROR] 카페 상세 정보 불러오기 실패:", err);
    throw err;
  }
};

// ----------------------
// 카페 리뷰
// ----------------------
export const getCafeReviews = async (cafeId: string): Promise<CafeReview[]> => {
  try {
    const res = await axios.get<{ reviews: CafeReview[] }>(
      `${BASE_URL}/cafes/${cafeId}/reviews`
    );
    return res.data.reviews;
  } catch (err) {
    console.error("[ERROR] 리뷰 불러오기 실패:", err);
    return [];
  }
};

export const postCafeReview = async (
  cafeId: string,
  review: NewReview
): Promise<CafeReview> => {
  try {
    const res = await axios.post<{ review: CafeReview }>(
      `${BASE_URL}/cafes/${cafeId}/reviews`,
      review
    );
    return res.data.review;
  } catch (err) {
    console.error("[ERROR] 리뷰 등록 실패:", err);
    throw err;
  }
};

// ----------------------
// 카테고리별 태그 가져오기
// ----------------------
// export const getTags = async (category: string): Promise<string[]> => {
//   try {
//     const res = await axios.get<{
//       tags: { id: number; category: string; items: string[] }[];
//     }>(`${BASE_URL}/tags`);
//     const found = res.data.tags.find((t) => t.category === category);
//     return found ? found.items : [];
//   } catch (err) {
//     console.error("[ERROR] 태그 불러오기 실패:", err);
//     return [];
//   }
// };
// src/api/cafeApi.ts
export const getTags = async (searchPhrase: string): Promise<string[]> => {
  try {
    const res = await axios.get<{ data: string[] }>(
      `https://studyspot.kr/api/tags?searchPhrase=${encodeURIComponent(searchPhrase)}`
    );
    return res.data.data;
  } catch (err) {
    console.error("[ERROR] 태그 불러오기 실패:", err);
    return []; // 실패 시 빈 배열 반환
  }
};

