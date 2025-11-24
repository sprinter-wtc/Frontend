// src/pages/cafe/CafeReviewsPage.tsx
import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";
import BottomNav from "../../components/BottomNav";
import "./CafeDetail.css"; // 리뷰 카드 스타일 포함

interface Review {
  starRating: number;
  name: string | null;
  content: string;
  imageUrl?: string | null;
  createdAt: string;
}

interface CafeReviews {
  reviews: Review[];
}

const BASE_IMAGE_URL = "https://tmp.studyspot.kr";
const getFullImageUrl = (url?: string | null) =>
  url ? (url.startsWith("http") ? url : `${BASE_IMAGE_URL}${url}`) : "";

export default function CafeReviewsPage() {
  const { cafeId } = useParams(); // URL에서 cafeId 추출
  const navigate = useNavigate();
  const [reviews, setReviews] = useState<Review[]>([]);
  const [loading, setLoading] = useState(true);
  useEffect(() => {
    if (!cafeId) return;

    const fetchReviews = async () => {
      try {
        const res = await axios.get<Review[]>(
          `https://studyspot.kr/api/reviews/${cafeId}`
        );
        console.log("전체 리뷰 API 응답:", res.data); // 배열 확인
        setReviews(res.data ?? []);
      } catch (err) {
        console.error("❌ 전체 리뷰를 불러올 수 없습니다:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchReviews();
  }, [cafeId]);

  if (loading) return <div className="loading">불러오는 중...</div>;

  return (
    <div className="cafe-detail-page">
      <button type="button" onClick={() => navigate(-1)}>
        <span className="material-symbols-outlined">arrow_back_ios</span>
      </button>

      <h2 className="section-title">전체 리뷰</h2>

      {reviews.length === 0 && <p>아직 등록된 리뷰가 없습니다.</p>}

      <div className="review-list">
        {reviews.map((r, i) => (
          <div key={i} className="review-card horizontal">
            {r.imageUrl && (
              <img
                className="review-img"
                src={getFullImageUrl(r.imageUrl)}
                alt="리뷰 이미지"
              />
            )}
            <div className="review-content">
              <b>{r.name ?? "익명"}</b> ⭐ {r.starRating}
              <p>{r.content}</p>
              <small>{new Date(r.createdAt).toLocaleDateString()}</small>
            </div>
          </div>
        ))}
      </div>

    </div>
  );
}
