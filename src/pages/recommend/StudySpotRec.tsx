import React, { useEffect, useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import BottomNav from "../../components/BottomNav";
import CafeCard from "../../components/card/CafeCard";
import "./StudySpotRec.css";
import {
  normalizeCafe,
  CafeCardData,
} from "../../components/utils/normalizeCafe";

const StudySpotRec: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();

  interface Tag {
    id: number;
    name: string;
    emoji: string;
    type: "category" | "purpose";
  }

  const initialTag = location.state?.filterTag || null;

  const [tags, setTags] = useState<Tag[]>([
    { id: 1, name: "스터디카페", emoji: "📚", type: "category" },
    { id: 2, name: "대형카페", emoji: "☕️", type: "category" },
    { id: 3, name: "조용한 카페", emoji: "🤫", type: "category" },
    { id: 4, name: "책", emoji: "📖", type: "purpose" },
    { id: 5, name: "노트북", emoji: "💻", type: "purpose" },
    { id: 6, name: "데이트", emoji: "💘", type: "purpose" },
    { id: 7, name: "휴식", emoji: "😌", type: "purpose" },
    { id: 8, name: "포토스팟", emoji: "📸", type: "purpose" },
    { id: 9, name: "단체", emoji: "👥", type: "purpose" },
  ]);

  const [selectedTag, setSelectedTag] = useState<string | null>(initialTag);
  const [recommendedCafes, setRecommendedCafes] = useState<CafeCardData[]>([]);
  const [showMore, setShowMore] = useState(false);

  useEffect(() => {
    const fetchCafes = async () => {
      try {
        const apiUrl = selectedTag
          ? `https://studyspot.kr/api/cafes?tags=${selectedTag}`
          : `https://studyspot.kr/api/cafes/recommended`;

        const res = await fetch(apiUrl);
        const json = await res.json();

        if (json.status === "success") {
          const normalized = json.data.map(normalizeCafe);
          setRecommendedCafes(normalized);
        }
      } catch (err) {
        console.error("[ERROR] 카페 불러오기 실패:", err);
      }
    };

    fetchCafes();
  }, [selectedTag]);

  return (
    <div className="studyspotrec-container">
      <div>
        {/* 헤더 */}
        <div className="header-back">
          <button type="button" onClick={() => navigate(-1)}>
            <span className="material-symbols-outlined">arrow_back_ios</span>
          </button>
          <div className="header-back-title">&nbsp; 장소추천</div>
        </div>

        {/* 상단 태그 + 더보기 버튼 */}
        <div className="studyspotrec-top-select">
          {/* 더보기 버튼: studyspotrec-top-select 내부 오른쪽 상단 */}
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
                <div key={tag.id} className="tag-item">
                  <span className="emoji">{tag.emoji}</span>
                  <span>{tag.name}</span>
                </div>
              ))}
            </div>
          ) : (
            <div className="tag-scroll-wrapper">
              {tags.map((tag) => (
                <div key={tag.id} className="tag-item">
                  <span className="emoji">{tag.emoji}</span>
                  <span>{tag.name}</span>
                </div>
              ))}
            </div>
          )}
        </div>
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
