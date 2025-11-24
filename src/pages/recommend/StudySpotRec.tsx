import React, { useEffect, useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import BottomNav from "../../components/BottomNav";
import CafeCard from "../../components/cafe/CafeCard";
import "./StudySpotRec.css";
import {
  normalizeCafe,
  CafeCardData,
} from "../../components/utils/normalizeCafe";
import { API_BASE_URL } from "../../config/api";

const StudySpotRec: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();

  interface Tag {
    id: number;
    name: string;
    emoji: string;
    type: "category" | "purpose";
  }

  // Home에서 넘어온 선택 태그
  const initialTag = location.state?.filterTag || null;

  // 고정된 필터 태그 목록
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
  // const [showFilterMore, setShowFilterMore] = useState(false);
  const [recommendedCafes, setRecommendedCafes] = useState<CafeCardData[]>([]);
  const [showMore, setShowMore] = useState(false);
  // 태그 배열 합치기

  // -------------------------------
  // 선택된 태그 기반으로 API 요청
  // -------------------------------
  useEffect(() => {
    const fetchCafes = async () => {
      try {
        // 태그가 있을 경우 -> 태그 기반 검색 API 사용
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

  // -------------------------------
  // JSX 렌더링
  // -------------------------------
  return (
    <div>
      <div className="studyspotrec-container">
        <div className="studyspotrec-top-section">
          {/* 뒤로가기 */}
          <div className="header-back">
            <button type="button" onClick={() => navigate(-1)}>
              <span className="material-symbols-outlined">arrow_back_ios</span>
            </button>
            <div className="header-back-title">&nbsp; 장소추천</div>
          </div>
          <div className="studyspotrec-top-select">
            {/* 공부 장소 추천 */}
            <section>
              <div className="tag-row">
                {tags.slice(0, 4).map((tag) => (
                  <div key={tag.id} className="tag-item">
                    <span className="emoji">{tag.emoji}</span>
                    <span>{tag.name}</span>
                  </div>
                ))}

                {/* 더보기 버튼 */}
                {tags.length > 4 && (
                  <button
                    className="dropdown-btn"
                    onClick={() => setShowMore(!showMore)}
                  >
                    {showMore ? "▲" : "▼"}
                  </button>
                )}

                {showMore &&
                  tags.slice(4).map((tag) => (
                    <div key={tag.id} className="tag-item hidden-inline">
                      <span className="emoji">{tag.emoji}</span>
                      <span>{tag.name}</span>
                    </div>
                  ))}
              </div>
            </section>
          </div>
        </div>
        <hr></hr>

        {/*     추천 카페 리스트       */}
        {/* <div className="recommend-section">
          <section>
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
        </div> */}
      </div>

      <BottomNav />
    </div>
  );
};

export default StudySpotRec;
