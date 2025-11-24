import axios from "axios";

const BASE_URL = "https://studyspot.kr/api";

export const getBestReviews = async (cafeId: number) => {
  const response = await axios.get(`${BASE_URL}/reviews/best/${cafeId}`);
  return response.data.data; 
};
