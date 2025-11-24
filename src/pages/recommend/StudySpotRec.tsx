import React, { useEffect, useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import BottomNav from "../../components/BottomNav";
import CafeCard from "../../components/card/CafeCard";
import "./StudySpotRec.css";
import {
  normalizeCafe,
  CafeCardData,
} from "../../components/utils/normalizeCafe";

interface Tag {
  id: number;
  name: string;
  emoji: string;
  type: "category" | "purpose";
}

interface Category {
  id: number;
  name: string;
  emoji: string;
}

interface Purpose {
  id: number;
  name: string;
  emoji: string;
}

const StudySpotRec: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();

  const [tags] = useState<Tag[]>([
    { id: 1, name: "카페", emoji: "☕️", type: "category" },
    { id: 2, name: "스터디카페", emoji: "✏️", type: "category" },
    { id: 3, name: "독서실", emoji: "🪑", type: "category" },
    { id: 4, name: "책", emoji: "📖", type: "purpose" },
    { id: 5, name: "노트북", emoji: "💻", type: "purpose" },
    { id: 6, name: "데이트", emoji: "💘", type: "purpose" },
    { id: 7, name: "휴식", emoji: "😌", type: "purpose" },
    { id: 8, name: "포토스팟", emoji: "📸", type: "purpose" },
    { id: 9, name: "단체", emoji: "👥", type: "purpose" },
  ]);

  const [selectedTag, setSelectedTag] = useState<Tag | null>(
    location.state?.filterTag
      ? tags.find((t) => t.name === location.state.filterTag) || null
      : null
  );

  const [recommendedCafes, setRecommendedCafes] = useState<CafeCardData[]>([]);
  const [showMore, setShowMore] = useState(false);

  const [categories] = useState<Category[]>([
    { id: 1, name: "카페", emoji: "☕️" },
    { id: 2, name: "스터디카페", emoji: "✏️" },
    { id: 3, name: "독서실", emoji: "🪑" },
  ]);

  const [purposes] = useState<Purpose[]>([
    { id: 1, name: "책", emoji: "📖" },
    { id: 2, name: "노트북", emoji: "💻" },
    { id: 3, name: "데이트", emoji: "💘" },
    { id: 4, name: "휴식", emoji: "😌" },
    { id: 5, name: "포토스팟", emoji: "📸" },
    { id: 6, name: "단체", emoji: "👥" },
  ]);

  useEffect(() => {
    const fetchCafes = async () => {
      try {
        let apiUrl = "https://studyspot.kr/api/cafes/recommended";

        if (selectedTag) {
          if (selectedTag.type === "category") {
            apiUrl = `https://studyspot.kr/api/cafes?category=${selectedTag.name}`;
          } else if (selectedTag.type === "purpose") {
            apiUrl = `https://studyspot.kr/api/cafes?purpose=${selectedTag.name}`;
          }
        }

        const res = await fetch(apiUrl);
        const json = await res.json();

        if (json.status === "success" && Array.isArray(json.data.cafes)) {
          const normalized: CafeCardData[] = json.data.cafes.map(
            (cafe: any) => ({
              id: cafe.id,
              name: cafe.name,
              category: cafe.category,
              purpose: [],
              imageList: cafe.imageUrl
                ? [{ imageUrl: cafe.imageUrl, index: 0 }]
                : [],
              location: cafe.address ? [cafe.address] : [],
              rating: cafe.averageStarRating,
              startingTime: cafe.startingTime,
              closingTime: cafe.closingTime,
              tags: cafe.tags || [],
            })
          );

          setRecommendedCafes(normalized);
        } else {
          setRecommendedCafes([]);
        }
      } catch (err) {
        console.error("[ERROR] 카페 불러오기 실패:", err);
        setRecommendedCafes([]);
      }
    };

    fetchCafes();
  }, [selectedTag]);

  return (
    <div className="studyspotrec-container">
      {/* 헤더 */}
      <div className="header-back">
          <span className="material-symbols-outlined" onClick={() => navigate(-1)}>arrow_back_ios</span>
        <div className="header-back-title">&nbsp; 장소추천</div>
      </div>

      {/* 상단 태그 + 더보기 버튼 */}
      <div className="studyspotrec-top-select">
        {/* 더보기 버튼 */}
        <div className="dropdown-btn-outside">
          <button
            className="dropdown-btn"
            onClick={() => setShowMore(!showMore)}
          >
            {showMore ? "▲" : "▼"}
          </button>
        </div>

        {/* 태그 영역 */}
        {showMore ? (
          <div className="hidden-tags-grid">
            {tags.map((tag) => (
              <div
                key={tag.id}
                className={`tag-item ${
                  selectedTag?.id === tag.id ? "selected" : ""
                }`}
                onClick={() => setSelectedTag(tag)}
              >
                <span className="emoji">{tag.emoji}</span>
                <span>{tag.name}</span>
              </div>
            ))}
          </div>
        ) : (
          <div className="tag-scroll-wrapper">
            {tags.map((tag) => (
              <div
                key={tag.id}
                className={`tag-item ${
                  selectedTag?.id === tag.id ? "selected" : ""
                }`}
                onClick={() => setSelectedTag(tag)}
              >
                <span className="emoji">{tag.emoji}</span>
                <span>{tag.name}</span>
              </div>
            ))}
          </div>
        )}
      </div>

      <hr />

      {/* 추천 카페 리스트 */}
      <div className="study-recommend-section">
        <section className="study-recommend-section">
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

      <BottomNav />
    </div>
  );
};

export default StudySpotRec;
