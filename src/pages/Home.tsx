import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import "../styles/Home.css";
import BottomNav from "../components/BottomNav";
import CafeCard, { CafeCardData } from "../components/cafe/CafeCard";
import { normalizeCafe } from "../components/utils/normalizeCafe";

interface Category { id: number; name: string; imgUrl?: string; }
interface Purpose { id: number; name: string; imgUrl?: string; }

const Home: React.FC = () => {
  const navigate = useNavigate();

  const [categories, setCategories] = useState<Category[]>([
    { id: 1, name: "스터디카페", imgUrl: "https://placehold.co/80x80" },
    { id: 2, name: "대형카페", imgUrl: "https://placehold.co/80x80" },
    { id: 3, name: "조용한 카페", imgUrl: "https://placehold.co/80x80" },
  ]);

  const [purposes, setPurposes] = useState<Purpose[]>([
    { id: 1, name: "책", imgUrl: "https://placehold.co/80x80" },
    { id: 2, name: "노트북", imgUrl: "https://placehold.co/80x80" },
    { id: 3, name: "데이트", imgUrl: "https://placehold.co/80x80" },
    { id: 4, name: "휴식", imgUrl: "https://placehold.co/80x80" },
    { id: 5, name: "포토스팟", imgUrl: "https://placehold.co/80x80" },
    { id: 6, name: "단체", imgUrl: "https://placehold.co/80x80" },
  ]);

const [recommendedCafes, setRecommendedCafes] = useState<CafeCardData[]>([]);

  // -------------------------------
  // 추천 카페 API fetch
  // -------------------------------
  useEffect(() => {
    const fetchRecommendedCafes = async () => {
      try {
        const res = await fetch(
          "https://c765212b-1c21-4d14-98d9-56dd58cc5d3d.mock.pstmn.io/cafes/recommended"
        );
        const json = await res.json();
        if (json.status === "success") {
          const cafesFromServer = json.data.map(normalizeCafe);
          setRecommendedCafes(cafesFromServer);
        }
      } catch (err) {
        console.error("추천 카페 불러오기 실패:", err);
      }
    };
    fetchRecommendedCafes();
  }, []);

  // -------------------------------
  // JSX 렌더링
  // -------------------------------
  return (
    <div>
      <div className="home-container">
        {/* 검색창 */}
        <div className="search-bar" onClick={() => navigate("ai-search")}>
          <input
            type="text"
            placeholder="카페를 검색해보세요 ☕  🔍"
            readOnly
          />
        </div>

          {/* 공부 장소 추천 */}
        <section className="category-section">
          <h2>공부 장소 추천</h2>
          <div className="category-grid">
            {categories.map((cat) => (
              <div key={cat.id} className="category-item">
                <img src={cat.imgUrl} alt={cat.name} />
                <span>{cat.name}</span>
              </div>
            ))}
          </div>
        </section>

       {/* 카페 이용 목적 */}
        <section className="purpose-section">
          <h2>카페 이용 목적</h2>
          <div className="purpose-grid">
            {purposes.map((p) => (
              <div key={p.id} className="purpose-item">
                <img src={p.imgUrl} alt={p.name} />
                <span>{p.name}</span>
              </div>
            ))}
          </div>
        </section>

        {/* 추천 카페 리스트 */}
        <section className="recommend-section">
          <h2>추천 카페 리스트</h2>
          <div className="cafe-list">
            {recommendedCafes.length > 0 ? (
              recommendedCafes.map((cafe) => (
                <CafeCard key={cafe.id} cafe={cafe} />
              ))
            ) : (
              <p>추천 카페가 없습니다.</p>
            )}
          </div>
        </section>
      </div>

      {/* 하단 네비게이션 */}
      <BottomNav />
    </div>
  );
};

export default Home;
