import { CafeBase } from "./cafecard/CafeBase";
import { useEffect, useState, useRef } from "react";
import BottomNav from "../../components/BottomNav";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";
import "./CafeDetail.css";

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
export interface CafeDetail extends CafeBase {
  purpose: string[];
  limitTime: number;
  phoneNumber: string;
  tags: { petFriendly: boolean; power_outlet_level: string };
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

const BASE_IMAGE_URL = "https://tmp.studyspot.kr";
const getFullImageUrl = (url?: string | null) =>
  url ? (url.startsWith("http") ? url : `${BASE_IMAGE_URL}${url}`) : "";

declare global {
  interface Window {
    naver: any;
  }
}

export default function CafeDetailPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const mapRef = useRef<HTMLDivElement>(null);

  const [cafe, setCafe] = useState<CafeDetail | null>(null);
  const [currentImage, setCurrentImage] = useState(0);
  const [bestReview, setBestReview] = useState<Review[]>([]);

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

  // 베스트 리뷰만 불러오기
  useEffect(() => {
    const fetchBestReview = async () => {
      try {
        const res = await axios.get<{ data: { reviews: Review[] } }>(
          `https://studyspot.kr/api/reviews/best/${id}`
        );
        setBestReview(res.data.data?.reviews ?? []);
      } catch (err) {
        console.error("❌ 베스트 리뷰를 불러올 수 없습니다:", err);
      }
    };
    fetchBestReview();
  }, [id]);

  // 네이버 지도
  useEffect(() => {
    if (!cafe || !mapRef.current || !window.naver?.maps) return;
    const map = new window.naver.maps.Map(mapRef.current, {
      center: new window.naver.maps.LatLng(cafe.location[1], cafe.location[0]),
      zoom: 15,
    });
    new window.naver.maps.Marker({
      position: new window.naver.maps.LatLng(
        cafe.location[1],
        cafe.location[0]
      ),
      map,
    });
  }, [cafe]);

  if (!cafe) return <div className="loading">불러오는 중...</div>;

  return (
    <div className="cafe-detail-page">
      <button type="button" onClick={() => navigate(-1)}>
        <span className="material-symbols-outlined">arrow_back_ios</span>
      </button>

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

      <h1 className="cafe-title">{cafe.name}</h1>
      <p className="category">{cafe.category}</p>

      <div className="tag-section">
        {cafe.purpose.map((p, i) => (
          <span key={i} className="tag-blue">
            #{p}
          </span>
        ))}
      </div>

      <h2 className="section-title">카페 정보</h2>
      <ul className="info-list">
        <li>⏱ 시간 제한: {cafe.limitTime}시간</li>
        <li>📞 전화번호: {cafe.phoneNumber}</li>
        <li>🔌 콘센트: {cafe.tags.power_outlet_level}</li>
        <li>🐶 반려견 동반: {cafe.tags.petFriendly ? "가능" : "불가"}</li>
      </ul>

      <h2 className="section-title">메뉴 & 가격</h2>
      <div className="menu-grid">
        {cafe.menuList.map((m, i) => (
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

      {/* 베스트 리뷰 + 전체 리뷰 페이지 이동 버튼 */}

      {/* ⭐️ 베스트 리뷰 표시 */}
      {bestReview && (
        <div className="best-review-block">
          <div className="best-review-header">
            <h3 className="best-review-title">🔥 BEST 리뷰</h3>
            <p className="see-all-reviews"
              onClick={() => navigate(`/reviews/${id}`)} // 전체 리뷰 페이지로 이동
            >
              {" "}
              더보기{" "}
            </p>
          </div>

          {bestReview.map((r: Review, i: number) => (
            <div key={i} className="review-card best">
              {r.imageUrl && (
                <img src={getFullImageUrl(r.imageUrl)} alt="리뷰 이미지" />
              )}
              <div className="review-content">
                <div>
                  <b>{r.name}</b> ⭐ {r.starRating}
                </div>
                <div>
                  <hr></hr>
                  <p>{r.content}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      <h2 className="section-title">위치</h2>
      <div ref={mapRef} className="naver-map"></div>

      <BottomNav />
    </div>
  );
}
