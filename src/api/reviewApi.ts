import axios from "axios";

const BASE_URL = "https://test.studyspot.kr/api";

// 베스트 리뷰
export const getBestReviews = async (cafeId: number) => {
  const response = await axios.get(`${BASE_URL}/reviews/best/${cafeId}`);
  return response.data.data;
};

// 전체 리뷰
export const getReviews = async (cafeId: number) => {
  const response = await axios.get(`${BASE_URL}/reviews/${cafeId}`);
  return response.data.data;
};
