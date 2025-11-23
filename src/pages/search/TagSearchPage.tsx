// src/pages/search/cafe/TagSearchPage.tsx
import "../../styles/search/TagSearchPage.css";
import React, { useState, useEffect, KeyboardEvent } from "react";
import BottomNav from "../../components/BottomNav";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import CafeCard from "../../components/cafe/CafeCard";
import {
  normalizeCafe,
  CafeCardData,
} from "../../components/utils/normalizeCafe";

const TAG_MAP: { [key: string]: string[] } = {
  "☕️ 공간종류": ["카페", "스터디카페", "독서실"],
  "💡 조명 밝기": ["어두움", "중간", "밝음"],
  "👂 소음정도": ["조용함", "적당한 소음", "시끌벅적"],
  "🔌 콘센트": ["콘센트 없음", "콘센트 있음", "콘센트 많음"],
  "⌛️ 시간제한": ["시간제한 있음", "시간제한 없음"],
  "🚗 주차": ["주차 가능", "유료 주차", "주차 불가"],
  "🚥 교통접근성": ["지하철 근처", "버스정류장 근처", "접근성 좋음"],
  "🌳 주변환경": ["번화가", "조용한 골목", "공원 근처", "캠퍼스 근처"],
  "🐶 애견동반": ["애견동반 가능", "애견동반 불가능"],
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
  startingTime?: string;
  closingTime?: string;
  isWork?: boolean;
  averageStarRating?: number;
  address?: string;
  imageUrl?: string;
}

const TagSearchPage: React.FC = () => {
  const navigate = useNavigate();

  const [activeTab, setActiveTab] = useState<"AI" | "CHOICE">("CHOICE");
  const [selectedTags, setSelectedTags] = useState<string[]>([]);
  const [storeQuery, setStoreQuery] = useState("");
  const [showResult, setShowResult] = useState(false);
  const [results, setResults] = useState<CafeCardData[]>([]);
  const [showAddTags, setShowAddTags] = useState(false);

  const tagsMap = TAG_MAP; // API 없이 TAG_MAP만 사용
  const SPACE_TAGS = new Set(tagsMap["☕️ 공간종류"]);

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
      if (!storeQuery && selectedTags.length === 0) {
        console.log("[INFO] 검색 조건 없음");
        setResults([]);
        setShowResult(false);
        return;
      }

      const params = new URLSearchParams();
      if (storeQuery) params.append("nameOfCafe", storeQuery);
      if (selectedTags.length)
        selectedTags.forEach((tag) => params.append("tags", tag));

      console.log("[DEBUG] 검색 파라미터:", params.toString());

      const res = await axios.get<{ data: { cafes: Cafe[] } }>(
        `https://studyspot.kr/api/cafes?${params.toString()}`
      );

      console.log("[DEBUG] API 응답 데이터:", res.data);

      const cafes = Array.isArray(res.data.data?.cafes)
        ? res.data.data.cafes
        : [];

      const normalized = cafes.map(normalizeCafe);

      console.log("[DEBUG] 정규화된 결과:", normalized);

      const filtered = selectedTags.length
        ? normalized.filter((cafe) =>
            selectedTags.every((tag) => {
              if (SPACE_TAGS.has(tag)) return cafe.category === tag;
              // cafe.tags가 객체일 경우 Object.values 사용
              return Object.values(cafe.tags || {}).includes(tag);
            })
          )
        : normalized;

      console.log("[DEBUG] 필터링된 결과:", filtered);

      setResults(filtered);
      setShowResult(true);
    } catch (err) {
      console.error("[ERROR] 카페 검색 실패:", err);
      setResults([]);
      setShowResult(false);
    }
  };

  const handleKeyDown = (e: KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") executeSearch();
  };

  useEffect(() => {
    if (showResult) executeSearch();
  }, [selectedTags]);

  const checkOpenStatus = (start?: string, end?: string) => {
    if (!start || !end) return "정보없음";
    const now = new Date();
    const current = now.getHours() * 60 + now.getMinutes();
    const [sh, sm] = start.split(":").map(Number);
    const [eh, em] = end.split(":").map(Number);
    const startMin = sh * 60 + sm;
    const endMin = eh * 60 + em;

    if (endMin < startMin) {
      if (current >= startMin || current < endMin) return "OPEN";
      return "CLOSED";
    }

    return current >= startMin && current < endMin ? "OPEN" : "CLOSED";
  };

  return (
    <div className="search-container">
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

          <div>
            <div>
              <p>🌳 상호명 </p>
              <input
                type="text"
                placeholder="상호명 검색"
                value={storeQuery}
                onChange={(e) => setStoreQuery(e.target.value)}
                onKeyDown={handleKeyDown}
                className="ai-input w-full p-2 border rounded mb-2"
              />
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
          </div>

          <button type="button" className="ai-input" onClick={executeSearch}>
            검색
          </button>
        </>
      ) : (
        <>
          <div className="w-full text-left">
            <button type="button" onClick={() => setShowResult(false)}>
              <span className="material-symbols-outlined">arrow_back_ios</span>
            </button>
          </div>

          <div className="cafe-name-search-bar mb-2">
            🌳 상호명
            <input
              type="text"
              value={storeQuery}
              onChange={(e) => setStoreQuery(e.target.value)}
              onKeyDown={handleKeyDown}
              className="ai-input"
            />
          </div>

          <div className="selected-tags">
            <div>
              <span className="material-symbols-outlined">tag</span>태그를
              선택해 주세요.
            </div>
            <div>
              {selectedTags.map((tag) => (
                <span
                  key={tag}
                  className={tagClassName(tag)}
                  onClick={() => toggleTag(tag)}
                >
                  {tag}
                </span>
              ))}
            </div>
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
            {results.map((cafe) => (
              <CafeCard key={cafe.id} cafe={cafe} />
            ))}
          </div>
        </>
      )}

      <BottomNav />
    </div>
  );
};

export default TagSearchPage;
