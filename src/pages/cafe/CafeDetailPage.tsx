// src/pages/search/cafe/CafeDetailPage.tsx

import { CafeBase } from "./cafecard/CafeBase"; // CafeBase 인터페이스 가져오기
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

// 운영 정보 포함 CafeDetail 타입
export interface CafeDetail extends CafeBase {
  purpose: string[];          // 목적 태그
  limitTime: number;          // 시간 제한
  phoneNumber: string;        // 전화번호
  tags: {
    petFriendly: boolean;     // 반려견 동반 가능 여부
    power_outlet_level: string; // 콘센트 수준
  };
  menuList: Menu[];           // 메뉴 리스트
  imageList: ImageData[];     // 이미지 리스트
  location: number[];         // [lng, lat]
}

// 리뷰 타입
interface Review {
  starRating: number;
  name: string;
  content: string;
  imageUrl?: string | null;
}

interface CafeReviews {
  averageStarRating?: number; // 평균 별점
  reviewCount?: number;       // 리뷰 개수
  reviews?: Review[];
}

// ----------------------
// 글로벌 window 타입 선언 필요 (naver 지도)
// ----------------------
declare global {
  interface Window {
    naver: any; // naver.maps 타입 정의 가능, 일단 any로
  }
}

// ----------------------
// 컴포넌트 시작
// ----------------------
export default function CafeDetailPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const mapRef = useRef<HTMLDivElement>(null);

  // 상태 관리
  const [cafe, setCafe] = useState<CafeDetail | null>(null);
  const [reviews, setReviews] = useState<CafeReviews | null>(null);
  const [currentImage, setCurrentImage] = useState(0);

  // ----------------------
  // 카페 상세 정보 불러오기
  // ----------------------
  useEffect(() => {
    const fetchCafe = async () => {
      try {
        const res = await axios.get<{ data: CafeDetail }>(
          `https://test.studyspot.kr/api/cafes/details/${id}`
        );
        setCafe(res.data.data);
      } catch (err) {
        console.error("❌ 카페 정보를 불러올 수 없습니다:", err);
      }
    };
    fetchCafe();
  }, [id]);

  // ----------------------
  // 리뷰 불러오기
  // ----------------------
  useEffect(() => {
    const fetchReviews = async () => {
      try {
        const res = await axios.get<{ data: CafeReviews }>(
          `https://test.studyspot.kr/api/cafes/reviews/best/${id}`
        );
        setReviews(res.data.data);
      } catch (err) {
        console.error("❌ 리뷰 정보를 불러올 수 없습니다:", err);
      }
    };
    fetchReviews();
  }, [id]);

  // ----------------------
  // 네이버 지도 초기화
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
          src={cafe.imageList[currentImage]?.imageUrl}
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
            <img src={m.imageUrl} alt={m.name} className="menu-img" />
            <h3 className="menu-title">{m.name}</h3>
            <p className="menu-desc">{m.description}</p>
            <p className="menu-price">{m.price}원</p>
          </div>
        ))}
      </div>

      {/* 평가 & 리뷰 */}
      <div className="reviews-section">
        <h2 className="section-title">평가 & 리뷰</h2>

        <div className="rating-section">
          <div className="avg-rating">
            {/* undefined 체크 + 기본값 0.0 */}
            {(reviews?.averageStarRating ?? 0).toFixed(1)} ⭐
          </div>
          <div className="review-count">
            ({reviews?.reviewCount ?? 0}개 리뷰)
          </div>
        </div>

        <div className="review-list">
          {reviews?.reviews?.map((r: Review, i: number) => (
            <div key={i} className="review-card">
              <b>{r.name}</b> ⭐ {r.starRating}
              <p>{r.content}</p>
              {r.imageUrl && <img src={r.imageUrl} alt="리뷰 이미지" />}
            </div>
          ))}
        </div>
      </div>

      {/* 지도 */}
      <h2 className="section-title">위치</h2>
      <div ref={mapRef} className="naver-map"></div>

       <BottomNav />
    </div>

  );
}
