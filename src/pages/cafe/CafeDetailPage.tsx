// src/pages/search/cafe/CafeDetailPage.tsx

import { CafeBase } from "./cafecard/CafeBase";
import { useEffect, useState, useRef } from "react";
import BottomNav from "../../components/BottomNav";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";
import "./CafeDetail.css";

// ----------------------
// TypeScript 타입 정의
// ----------------------
interface Menu {
  name: string;
  price: number;
  description: string;
  imageUrl: string;
}

interface ImageData {
  imageUrl: string;
  index: number;
}

interface Tags {
  petFriendly: boolean;
  power_outlet_level: string;
}

export interface CafeDetail extends CafeBase {
  purpose: string[];
  limitTime: number;
  phoneNumber: string;
  tags: {
    petFriendly: boolean;
    power_outlet_level: string;
  };
  menuList: Menu[];
  imageList: ImageData[];
  location: number[];
}

interface Review {
  starRating: number;
  name?: string | null;
  content: string;
  imageUrl?: string | null;
  createdAt?: string | number;
}

// ----------------------
// 이미지 url 처리 함수
// ----------------------
const BASE_IMAGE_URL = "https://tmp.studyspot.kr";
const getFullImageUrl = (url?: string | null) => {
  if (!url) return "";
  return url.startsWith("http") ? url : `${BASE_IMAGE_URL}${url}`;
};

// ----------------------
// 글로벌 window 타입
// ----------------------
declare global {
  interface Window {
    naver: any;
  }
}

// ----------------------
// 컴포넌트 시작
// ----------------------
export default function CafeDetailPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const mapRef = useRef<HTMLDivElement>(null);

  const [cafe, setCafe] = useState<CafeDetail | null>(null);
  const [currentImage, setCurrentImage] = useState(0);

  const [bestReview, setBestReview] = useState<Review[]>([]);
  const [reviews, setReviews] = useState<Review[]>([]);
  const [loading, setLoading] = useState(true);

  // ----------------------
  // 카페 상세 정보
  // ----------------------
  useEffect(() => {
    const fetchCafe = async () => {
      try {
        const res = await axios.get<{ data: CafeDetail }>(
          `https://studyspot.kr/api/cafes/details/${id}`
        );
        setCafe(res.data.data);
      } catch (err) {
        console.error("❌ 카페 정보를 불러올 수 없습니다:", err);
      }
    };
    fetchCafe();
  }, [id]);

  // ----------------------
  // 베스트 리뷰 / 전체 리뷰
  // ----------------------
  useEffect(() => {
    const fetchReviewData = async () => {
      try {
        // 베스트 리뷰
        const bestRes = await axios.get<{ data: { reviews: Review[] } }>(
          `https://studyspot.kr/api/reviews/best/${id}`
        );
        setBestReview(bestRes.data.data?.reviews ?? []);

        // 전체 리뷰
        const listRes = await axios.get<Review[]>(`https://studyspot.kr/api/reviews/${id}`);
        setReviews(listRes.data ?? []);
      } catch (err) {
        console.error("❌ 리뷰 정보를 불러올 수 없습니다:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchReviewData();
  }, [id]);

  // ----------------------
  // 네이버 지도
  // ----------------------
  useEffect(() => {
    if (!cafe || !mapRef.current || !window.naver?.maps) return;

    const map = new window.naver.maps.Map(mapRef.current, {
      center: new window.naver.maps.LatLng(cafe.location[1], cafe.location[0]),
      zoom: 15,
    });

    new window.naver.maps.Marker({
      position: new window.naver.maps.LatLng(cafe.location[1], cafe.location[0]),
      map,
    });
  }, [cafe]);

  if (!cafe) return <div className="loading">불러오는 중...</div>;

  return (
    <div className="cafe-detail-page">
      {/* 뒤로가기 */}
      <button className="back-btn" onClick={() => navigate(-1)}>
        ← 뒤로가기
      </button>

      {/* 이미지 슬라이더 */}
      <div className="slider">
        <img
          src={getFullImageUrl(cafe.imageList[currentImage]?.imageUrl)}
          alt="카페 이미지"
          className="slider-img"
        />
        <button
          className="slider-btn left"
          onClick={() =>
            setCurrentImage((prev) =>
              prev === 0 ? cafe.imageList.length - 1 : prev - 1
            )
          }
        >
          ‹
        </button>
        <button
          className="slider-btn right"
          onClick={() =>
            setCurrentImage((prev) =>
              prev === cafe.imageList.length - 1 ? 0 : prev + 1
            )
          }
        >
          ›
        </button>
      </div>

      {/* 카페 이름 & 카테고리 */}
      <h1 className="cafe-title">{cafe.name}</h1>
      <p className="category">{cafe.category}</p>

      {/* 목적 태그 */}
      <div className="tag-section">
        {cafe.purpose.map((p: string, i: number) => (
          <span key={i} className="tag-blue">
            #{p}
          </span>
        ))}
      </div>

      {/* 카페 정보 */}
      <h2 className="section-title">카페 정보</h2>
      <ul className="info-list">
        <li>⏱ 시간 제한: {cafe.limitTime}시간</li>
        <li>📞 전화번호: {cafe.phoneNumber}</li>
        <li>🔌 콘센트: {cafe.tags.power_outlet_level}</li>
        <li>🐶 반려견 동반: {cafe.tags.petFriendly ? "가능" : "불가"}</li>
      </ul>

      {/* 메뉴 리스트 */}
      <h2 className="section-title">메뉴 & 가격</h2>
      <div className="menu-grid">
        {cafe.menuList.map((m: Menu, i: number) => (
          <div key={i} className="menu-card">
            <img
              src={getFullImageUrl(m.imageUrl)}
              alt={m.name}
              className="menu-img"
            />
            <h3 className="menu-title">{m.name}</h3>
            <p className="menu-desc">{m.description}</p>
            <p className="menu-price">{m.price}원</p>
          </div>
        ))}
      </div>

      {/* 베스트 리뷰 */}
      {bestReview.length > 0 && (
        <div className="best-review-block">
          <h3>🔥 BEST 리뷰</h3>
          {bestReview.map((r, i) => (
            <div key={i} className="review-card best">
              <b>{r.name ?? "익명"}</b> ⭐ {r.starRating}
              <p>{r.content}</p>
              {r.imageUrl && (
                <img src={getFullImageUrl(r.imageUrl)} alt="리뷰 이미지" />
              )}
            </div>
          ))}
        </div>
      )}

      {/* 전체 리뷰 */}
      {reviews.length > 0 && (
        <div className="all-review-block">
          <h3>💬 리뷰 목록</h3>
          {reviews.map((r, i) => (
            <div key={i} className="review-card">
              <b>{r.name ?? "익명"}</b> ⭐ {r.starRating}
              <p>{r.content}</p>
              {r.imageUrl && (
                <img src={getFullImageUrl(r.imageUrl)} alt="리뷰 이미지" />
              )}
            </div>
          ))}
        </div>
      )}

      {/* 지도 */}
      <h2 className="section-title">위치</h2>
      <div ref={mapRef} className="naver-map"></div>

      <BottomNav />
    </div>
  );
}
