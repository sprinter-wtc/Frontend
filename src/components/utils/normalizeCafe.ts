// 서버에서 받은 데이터(c: any)를 CafeCardData 형태로 변환
export const normalizeCafe = (c: any) => {
  return {
    id: c.id,
    name: c.name,

    // 카테고리 (없으면 기본값)
    category: c.category || "기타",

    // 목적(purpose는 추천카페 API에는 없음 → 기본 [])
    purpose: c.purpose || [],

    // 이미지 처리
    // 추천카페 API → imageUrl
    // 상세페이지 API → imageList: [{ imageUrl, sequence }]
    imageList: c.imageList
      ? c.imageList.map((img: any, idx: number) => ({
          imageUrl: img.imageUrl,
          index: img.sequence ?? idx,
        }))
      : c.imageUrl
      ? [{ imageUrl: c.imageUrl, index: 0 }]
      : [],

    // 위치 처리 (추천카페는 address, 상세페이지는 location [lat, lng])
    location: Array.isArray(c.location)
      ? c.location.map((l: any) => String(l))
      : c.address
      ? [c.address]
      : [],

    // 평점
    rating: c.averageStarRating ?? c.rating ?? 0,

    startingTime: c.startingTime,
    closingTime: c.closingTime,

    // 태그
    // 추천카페 → tags: ["콘센트 많음", "주차 가능"]
    // 상세페이지 → tags: { powerOutletLevel: "...", ... }
    tags: Array.isArray(c.tags)
      ? c.tags // 추천카페
      : c.tags
      ? Object.values(c.tags) // 상세페이지
      : [],

    // 상세페이지용 값들 추가 (추천카페에는 없지만 있어도 문제X)
    phoneNumber: c.phoneNumber || "",
    limitTime: c.limitTime ?? null,
    menuList: c.menuList || [],
  };
};


export interface CafeCardData {
  id: number;
  name: string;
  category: string;
  purpose: string[];
  imageList: { imageUrl: string; index: number }[];
  location?: string[];
  rating?: number;
  startingTime?: string;
  closingTime?: string;
  tags?: string[];
}