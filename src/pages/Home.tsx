import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import "../styles/Home.css";
import BottomNav from "../components/BottomNav";
import { CafeBase } from "./cafe/cafecard/CafeBase";
import { getRecommendedCafes, getCategories } from "../api/cafeApi";
import CafeCard from "./cafe/cafecard/CafeCard";
//카페 데이터 타입
interface Cafe {
  id: number;
  name: string;
  address?: string;
  location?: string[]; // 여러 지역 정보일 수도 있으니 배열
  thumbnail?: string; // imageUrl
  tags?: string[];
  averageStarRating?: number;
  startingTime?: string;
  closingTime?: string;
}

//카테고리 타입
interface Category {
  id: number;
  name: string;
  imgUrl?: string;
}

//카페 이용 목적 타입
interface Purpose {
  id: number;
  name: string;
  imgUrl: string;
}

const Home: React.FC = () => {
  const navigate = useNavigate();

  // -------------------------------
  //상태 정의
  // -------------------------------
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

  // const [recommendedCafes, setRecommendedCafes] = useState<Cafe[]>([
  //   {
  //     id: 1,
  //     name: "루시드커피",
  //     location: "홍대입구역 2번 출구",
  //     thumbnail: "https://placehold.co/100x100",
  //     tags: ["#조용한", "#디저트맛집"],
  //   },
  //   {
  //     id: 2,
  //     name: "카페어라운드",
  //     location: "신촌역 3번 출구",
  //     thumbnail: "https://placehold.co/100x100",
  //     tags: ["#스터디", "#24시간"],
  //   },
  // ]);

  // -------------------------------
  // API 데이터 가져오기
  // -------------------------------
  // useEffect(() => {
  //   const fetchData = async () => {
  //     try {
  //       // 카테고리 + 추천 카페 동시 요청
  //       const [catData, cafeData] = await Promise.all([
  //         getCategories(),
  //         getRecommendedCafes(),
  //       ]);

  //       if (catData.length > 0) setCategories(catData);
  //       if (cafeData.length > 0) setRecommendedCafes(cafeData);
  //     } catch (err) {
  //       console.error("홈 데이터 불러오기 실패:", err);
  //     }
  //   };

  //   fetchData();
  // }, []);
  // -------------------------------
  // 서버 데이터 가져오기
  // -------------------------------
  const [recommendedCafes, setRecommendedCafes] = useState<Cafe[]>([]);

  useEffect(() => {
    const fetchRecommendedCafes = async () => {
      try {
        const res = await fetch(
          "https://c765212b-1c21-4d14-98d9-56dd58cc5d3d.mock.pstmn.io/cafes/recommended"
        );
        const json = await res.json();
        if (json.status === "success") {
          const cafesFromServer = json.data.map((c: any) => ({
            id: c.id,
            name: c.name,
            address: c.address,
            location: [c.address],
            thumbnail: c.imageUrl,
            tags: c.tags,
            averageStarRating: c.averageStarRating,
            startingTime: c.startingTime,
            closingTime: c.closingTime,
          }));
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
            {recommendedCafes.map((cafe) => (
              <div
                key={cafe.id}
                className="cafe-card"
                onClick={() => navigate(`/cafes/${cafe.id}`)}
              >
                <img src={cafe.thumbnail} alt={cafe.name} />
                <div className="cafe-info">
                  <h3>{cafe.name}</h3>
                  <p>{cafe.location}</p>
                  <div className="tag-list">
                    {cafe.tags?.map((tag: string, idx: number) => (
                      <span key={idx} className="hometag">
                        {tag}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </section>
      </div>
      {/* 하단 네비게이션 */}
      <BottomNav />
    </div>
  );
};

export default Home;
