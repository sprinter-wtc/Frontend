export interface CafeBase {
  id: number;
  name: string;
  category: string;
  address?: string;
  location?: number[] | string[]; // 상세보기: 좌표 / 추천: 주소 배열
  imageUrl?: string; // 대표 이미지
  imageList?: { imageUrl: string; index: number }[]; // 상세보기 이미지
  averageStarRating?: number; // 추천 카페용
  rating?: number; // 상세보기 페이지용
  startingTime?: string;
  closingTime?: string;
  isWork?: boolean;
  tags?: string[] | Record<string, string | boolean>;
  // 추천 카페용
  purpose?: string[]; // 상세보기용
  menuList?: {
    // 상세보기용
    name: string;
    price: number;
    description: string;
    imageUrl: string;
  }[];
  phoneNumber?: string; // 상세보기용
  limitTime?: number; // 상세보기용
}
