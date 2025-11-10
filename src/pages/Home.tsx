import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom"; // 페이지 이동용 훅
import "../styles/Home.css"; // CSS 분리 파일

// 카페 데이터 타입 정의
interface Cafe {
  id: number;
  name: string;
  location: string;
  thumbnail: string;
  tags: string[];
}

// 카테고리 타입 정의
interface Category {
  id: number;
  name: string;
}

// 카페 이용 목적 타입 정의
interface Purpose {
  id: number;
  name: string;
  imgUrl: string;
}

const Home: React.FC = () => {
  const navigate = useNavigate(); // 페이지 이동 훅

  // ===============================
  // 1️⃣ 더미 데이터 상태
  // ===============================
  const [categories, setCategories] = useState<Category[]>([
    { id: 1, name: "스터디카페" },
    { id: 2, name: "대형카페" },
    { id: 3, name: "조용한 카페" },
  ]);

  const [purposes, setPurposes] = useState<Purpose[]>([
    { id: 1, name: "책", imgUrl: "https://placehold.co/80x80" },
    { id: 2, name: "노트북", imgUrl: "https://placehold.co/80x80" },
    { id: 3, name: "데이트", imgUrl: "https://placehold.co/80x80" },
    { id: 4, name: "휴식", imgUrl: "https://placehold.co/80x80" },
    { id: 5, name: "포토스팟", imgUrl: "https://placehold.co/80x80" },
    { id: 6, name: "단체", imgUrl: "https://placehold.co/80x80" },
  ]);

  const [recommendedCafes, setRecommendedCafes] = useState<Cafe[]>([
    {
      id: 1,
      name: "루시드커피",
      location: "홍대입구역 2번 출구",
      thumbnail: "https://placehold.co/100x100",
      tags: ["#조용한", "#디저트맛집"],
    },
    {
      id: 2,
      name: "카페어라운드",
      location: "신촌역 3번 출구",
      thumbnail: "https://placehold.co/100x100",
      tags: ["#스터디", "#24시간"],
    },
  ]);

  // ===============================
  // 2️⃣ 나중에 API 연결용 useEffect
  // ===============================
  useEffect(() => {
    // 예시: axios로 API 호출 가능
    /*
    axios
      .get("http://121.168.23.135:8082/categories") // 카테고리 API
      .then((res) => setCategories(res.data))
      .catch((err) => console.error("카테고리 불러오기 실패:", err));

    axios
      .get("http://121.168.23.135:8082/cafes/recommended") // 추천 카페 API
      .then((res) => setRecommendedCafes(res.data))
      .catch((err) => console.error("추천 카페 불러오기 실패:", err));
    */
  }, []); // 컴포넌트 처음 렌더링될 때만 실행

  // ===============================
  // 3️⃣ JSX 렌더링
  // ===============================
  return (
    <div className="home-container">
      {/* --------------------------
          검색창
          클릭 시 Search 페이지로 이동
      -------------------------- */}
      <div
        className="search-bar"
        onClick={() => navigate("/search")} // 검색창 클릭 시 페이지 이동
      >
        <input type="text" placeholder="카페를 검색해보세요 ☕" readOnly />
        <button className="search-btn">🔍</button>
      </div>

      {/* --------------------------
          공부 장소 추천 (가운데 정렬)
      -------------------------- */}
      <section className="category-section center">
        <h2>공부 장소 추천</h2>
        <div className="category-grid center">
          {categories.map((cat) => (
            <button key={cat.id} className="category-item">
              {cat.name}
            </button>
          ))}
        </div>
      </section>

      {/* --------------------------
          카페 이용 목적 (정사각형 이미지 + 글씨)
      -------------------------- */}
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

      {/* --------------------------
          추천 카페 리스트
      -------------------------- */}
      <section className="recommend-section">
        <h2>추천 카페 리스트</h2>
        <div className="cafe-list">
          {recommendedCafes.map((cafe) => (
            <div key={cafe.id} className="cafe-card">
              <img src={cafe.thumbnail} alt={cafe.name} />
              <div className="cafe-info">
                <h3>{cafe.name}</h3>
                <p>{cafe.location}</p>
                <div className="tag-list">
                  {cafe.tags.map((tag, idx) => (
                    <span key={idx} className="tag">
                      {tag}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* --------------------------
          하단 네비게이션
      -------------------------- */}
      <nav className="bottom-nav">
        <div>타이머</div>
        <div className="active">홈</div>
        <div>검색</div>
      </nav>
    </div>
  );
};

export default Home;
