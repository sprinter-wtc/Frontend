import React, { useState, useEffect, KeyboardEvent } from "react";
import BottomNav from "../../components/BottomNav";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import "../../styles/search/TagSearchPage.css";
import { getTags } from "../../api/cafeApi"; // 카테고리별 태그 API

const TAG_MAP: { [key: string]: string[] } = {
  "☕️ 공간종류": ["카페", "스터디카페", "독서실"],
  "💡 조명 밝기": ["어두움", "중간", "밝음"],
  "👂 소음정도": ["조용함", "적당한소음", "시끌벅적"],
  "🔌 콘센트": ["없음", "적당히있음", "자리마다있음"],
  "⌛️ 시간제한": ["시간제한 있음", "시간제한 없음"],
  "🚗 주차": ["주차 가능", "유료주차", "주차불가"],
  "🚥 교통접근성": ["지하철근처", "버스정류장 근처", "접근성좋음"],
  "🌳 주변환경": ["번화가", "조용한골목", "공원근처", "캠퍼스근처"],
  "🐶 애견동반": ["애견동반 가능"],
};

interface Cafe {
  id: number;
  name: string;
  category: string;
  purpose: string[];
  tags: { [key: string]: any };
  imageList: { imageUrl: string; index: number }[];
  location: number[];
  rating?: number;
}

const TagSearchPage: React.FC = () => {
  const navigate = useNavigate();

  const [activeTab, setActiveTab] = useState<"AI" | "CHOICE">("CHOICE");
  const [selectedTags, setSelectedTags] = useState<string[]>([]);
  const [storeQuery, setStoreQuery] = useState("");
  const [showResult, setShowResult] = useState(false);
  const [results, setResults] = useState<Cafe[]>([]);
  const [showAddTags, setShowAddTags] = useState(false);

  const [tagsMap, setTagsMap] = useState<{ [key: string]: string[] }>(TAG_MAP);

  useEffect(() => {
    const fetchTags = async () => {
      try {
        const categories = Object.keys(TAG_MAP);
        const newTagsMap: { [key: string]: string[] } = {};

        for (const category of categories) {
          const tagsFromApi = await getTags(category);
          newTagsMap[category] = tagsFromApi.length
            ? tagsFromApi
            : TAG_MAP[category];
        }

        setTagsMap(newTagsMap);
      } catch (err) {
        console.error("[ERROR] 태그 불러오기 실패:", err);
        setTagsMap(TAG_MAP);
      }
    };

    fetchTags();
  }, []);

  const SPACE_TAGS = new Set(tagsMap["☕️ 공간종류"] || []);

  const toggleTag = (tag: string) => {
    setSelectedTags((prev) =>
      prev.includes(tag) ? prev.filter((t) => t !== tag) : [...prev, tag]
    );
  };

  const isSpaceType = (tag: string) => SPACE_TAGS.has(tag);

  const tagClassName = (tag: string) => {
    const classes = ["tag"];
    if (isSpaceType(tag)) classes.push("space-type");
    if (selectedTags.includes(tag)) classes.push("active");
    return classes.join(" ");
  };

  const switchTab = (tab: "CHOICE" | "AI") => {
    setActiveTab(tab);
    if (tab === "AI") navigate("/ai-search");
  };

  // ---------------------
  // 검색 실행
  // ---------------------
  const executeSearch = async () => {
    try {
      const listRes = await axios.get<{
        data: { id: number }[];
      }>(
        "https://c765212b-1c21-4d14-98d9-56dd58cc5d3d.mock.pstmn.io/cafes/recommended"
      );
      const cafeList = listRes.data.data || [];
      const cafeIds = cafeList.map((cafe) => cafe.id);

      const requests = cafeIds.map((id) =>
        axios.get<{ data: Cafe }>(
          `https://c765212b-1c21-4d14-98d9-56dd58cc5d3d.mock.pstmn.io/cafes/details/${id}`
        )
      );
      const responses = await Promise.all(requests);
      const cafes = responses.map((res) => res.data.data);

      const filtered = cafes.filter(
        (cafe) =>
          (!storeQuery || cafe.name.includes(storeQuery)) &&
          selectedTags.every(
            (tag) =>
              cafe.purpose.includes(tag) ||
              cafe.tags[tag] ||
              cafe.category === tag
          )
      );

      setResults(filtered);
      setShowResult(true);
    } catch (err) {
      console.error("[ERROR] 카페 검색 실패:", err);
      setResults([]);
      setShowResult(true);
    }
  };

  const handleKeyDown = (e: KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      executeSearch();
    }
  };

  useEffect(() => {
    if (showResult) executeSearch();
  }, [selectedTags]);

  return (
    <div className="search-container no-scroll">
      {/* 상단 탭 */}
      <div className="search-tabs">
        <button
          className={activeTab === "AI" ? "active" : ""}
          onClick={() => switchTab("AI")}
        >
          AI 검색형
        </button>
        <button
          className={activeTab === "CHOICE" ? "active" : ""}
          onClick={() => switchTab("CHOICE")}
        >
          선택형
        </button>
      </div>

      {!showResult ? (
        <>
          <input
            type="text"
            placeholder="상호명 검색"
            value={storeQuery}
            onChange={(e) => setStoreQuery(e.target.value)}
            onKeyDown={handleKeyDown}
            className="ai-input w-full p-2 border rounded mb-2"
          />

          <div className="selected-tags">
            {selectedTags.length === 0 ? (
              <p style={{ color: "#aaa" }}>태그를 선택해주세요</p>
            ) : (
              selectedTags.map((tag) => (
                <span
                  key={tag}
                  className={tagClassName(tag)}
                  onClick={() => toggleTag(tag)}
                >
                  {tag}
                </span>
              ))
            )}
          </div>

          <div className="tag-options">
            {Object.entries(tagsMap).map(([category, options]) => (
              <div key={category} className="filter-section">
                <label>{category}</label>
                <div className="tag-grid">
                  {options.map((opt) => (
                    <button
                      key={opt}
                      type="button"
                      className={tagClassName(opt)}
                      onClick={() => toggleTag(opt)}
                    >
                      {opt}
                    </button>
                  ))}
                </div>
              </div>
            ))}
          </div>

          <button type="button" className="ai-input" onClick={executeSearch}>
            검색
          </button>
        </>
      ) : (
        <>
          <button type="button" onClick={() => setShowResult(false)}>
            ← 다시 검색하기
          </button>

          <input
            type="text"
            value={storeQuery}
            onChange={(e) => setStoreQuery(e.target.value)}
            onKeyDown={handleKeyDown}
            className="ai-input"
          />

          <div className="selected-tags">
            {selectedTags.map((tag) => (
              <span
                key={tag}
                className={tagClassName(tag)}
                onClick={() => toggleTag(tag)}
              >
                {tag}
              </span>
            ))}

            <button
              type="button"
              onClick={() => setShowAddTags((s) => !s)}
              className="plus-btn"
            >
              {showAddTags ? "－" : "＋"}
            </button>
          </div>

          {showAddTags && (
            <div className="tag-selector">
              {Object.entries(tagsMap).map(([category, tags]) => (
                <div key={category} className="tag-group">
                  <h4>{category}</h4>
                  <div className="tag-list">
                    {tags.map((tag) => (
                      <span
                        key={tag}
                        className={tagClassName(tag)}
                        onClick={() => toggleTag(tag)}
                      >
                        {tag}
                      </span>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          )}

          <div className="results scroll-area">
            {results.length > 0 ? (
              results.map((cafe) => (
                <div
                  key={cafe.id}
                  className="cafe-card cursor-pointer"
                  onClick={() => navigate(`/cafe/${cafe.id}`)}
                >
                  <img
                    src={cafe.imageList[0]?.imageUrl || ""}
                    alt={cafe.name}
                    className="cafe-thumbnail"
                  />
                  <div className="cafe-info">
                    <h3>{cafe.name}</h3>
                    <p className="cafe-rating">⭐ {cafe.rating || 0}</p>
                    <p className="cafe-meta">📍 {cafe.location.join(", ")}</p>
                    <div className="cafe-card-tag-list">
                      {cafe.purpose.map((t: string) => (
                        <span key={t} className="cafe-card-tag">
                          {t}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>
              ))
            ) : (
              <p>검색 결과가 없습니다.</p>
            )}
          </div>
        </>
      )}

      <BottomNav />
    </div>
  );
};

export default TagSearchPage;
