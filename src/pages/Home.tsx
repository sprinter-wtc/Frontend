import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import "../styles/Home.css";
import BottomNav from "../components/BottomNav";
import CafeCard, { CafeCardData } from "../components/card/CafeCard";
import { normalizeCafe } from "../components/utils/normalizeCafe";
import { API_BASE_URL } from "../config/api";

interface Category {
  id: number;
  name: string;
  emoji?: string;
}
interface Purpose {
  id: number;
  name: string;
  emoji?: string;
}

const Home: React.FC = () => {
  const navigate = useNavigate();

  const [categories, setCategories] = useState<Category[]>([
    { id: 1, name: "스터디카페", emoji: "📚" },
    { id: 2, name: "대형카페", emoji: "☕️" },
    { id: 3, name: "조용한 카페", emoji: "🤫" },
  ]);

  const [purposes, setPurposes] = useState<Purpose[]>([
    { id: 1, name: "책", emoji: "📖" },
    { id: 2, name: "노트북", emoji: "💻" },
    { id: 3, name: "데이트", emoji: "💘" },
    { id: 4, name: "휴식", emoji: "😌" },
    { id: 5, name: "포토스팟", emoji: "📸" },
    { id: 6, name: "단체", emoji: "👥" },
  ]);

  const [recommendedCafes, setRecommendedCafes] = useState<CafeCardData[]>([]);

  // -------------------------------
  // 추천 카페 API fetch
  // -------------------------------

  useEffect(() => {
    const fetchRecommendedCafes = async () => {
      try {
        const res = await fetch(
          "https://studyspot.kr/api/cafes/recommended"
        );
        const json = await res.json();
        console.log("카페추천데이터:", json.data); // 확인용
        if (json.status === "success") {
          const cafesFromServer =
            json.data.recommendationCafes.map(normalizeCafe);
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
                <span className="emoji">{cat.emoji}</span>
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
                <span className="emoji">{p.emoji}</span>
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
