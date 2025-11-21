import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { getCafeDetail, getCafeReviews, postCafeReview } from "../api/cafeApi";
import "../styles/CafeDetail.css";

interface Cafe {
  id: number;
  name: string;
  location: string;
  tags: string[];
  thumbnail?: string;
}

interface Review {
  id: number;
  rating: number;
  comment: string;
  author: string;
  createdAt?: string;
}

const CafeDetail: React.FC = () => {
  const { cafeId } = useParams<{ cafeId: string }>();
  const [cafe, setCafe] = useState<Cafe | null>(null);
  const [reviews, setReviews] = useState<Review[]>([]);
  const [newRating, setNewRating] = useState(0);
  const [newComment, setNewComment] = useState("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!cafeId) return;

    const fetchData = async () => {
  try {
    const [cafeData, reviewData] = await Promise.all([
      getCafeDetail(cafeId!),       // string 그대로 전달, !로 undefined 제외
      getCafeReviews(cafeId!),
    ]);

    setCafe(cafeData);
    setReviews(
      reviewData.map((r: any) => ({ ...r, author: r.author ? r.author : "익명" }))
    );
  } catch (err) {
    console.error("카페 상세정보 불러오기 실패:", err);
  } finally {
    setLoading(false);
  }
};


    fetchData();
  }, [cafeId]);

 const handleReviewSubmit = async (e: React.FormEvent) => {
  e.preventDefault();
  if (!cafeId) return;

  try {
    await postCafeReview(cafeId!, { rating: newRating, comment: newComment });

    const updatedReviews = await getCafeReviews(cafeId!);
    setReviews(
      updatedReviews.map((r: any) => ({ ...r, author: r.author ? r.author : "익명" }))
    );

    setNewRating(0);
    setNewComment("");
  } catch (err) {
    console.error("리뷰 등록 실패:", err);
  }
};


  if (loading) return <div>로딩 중...</div>;
  if (!cafe) return <div>카페 정보를 불러오지 못했습니다.</div>;

  return (
    <div className="cafe-detail-container">
      <h2>{cafe.name}</h2>
      {cafe.thumbnail && <img src={cafe.thumbnail} alt={cafe.name} />}
      <p>{cafe.location}</p>
      <div className="cafe-tags">{cafe.tags.map((tag, i) => <span key={i}>#{tag}</span>)}</div>

      <h3>리뷰</h3>
      <ul>
        {reviews.map((review) => (
          <li key={review.id}>
            ⭐ {review.rating} - {review.comment} <span>- {review.author}</span>
          </li>
        ))}
      </ul>

      <form onSubmit={handleReviewSubmit}>
        <h4>리뷰 남기기</h4>
        <label>
          평점:
          <input
            type="number"
            min={1}
            max={5}
            value={newRating}
            onChange={(e) => setNewRating(Number(e.target.value))}
            required
          />
        </label>
        <label>
          댓글:
          <textarea value={newComment} onChange={(e) => setNewComment(e.target.value)} required />
        </label>
        <button type="submit">등록</button>
      </form>
    </div>
  );
};

export default CafeDetail;
