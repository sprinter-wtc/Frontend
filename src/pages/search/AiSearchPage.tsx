// src/pages/search/cafe/AiSearchPage.tsx
import "../../styles/search/AiSearchPage.css";
import React, { useState, useEffect, KeyboardEvent } from "react";
import axios from "axios";
import BottomNav from "../../components/BottomNav";
import { useNavigate } from "react-router-dom";
import { getAiTags } from "../../api/cafeApi"; // AI 태그 가져오기
import CafeCard from "../../components/card/CafeCard";

import { normalizeCafe, CafeCardData } from "../../components/utils/normalizeCafe";
import { API_BASE_URL } from "../../config/api";

const RECOMMENDED_SENTENCES = [
  "✨ 조용하고 밝은 카페 추천해줘",
  "📚 공부 집중 잘 되는 곳 알려줘",
  "☕️ 커피 맛있는 카페 추천해줘",
  "💺 좌석 편한 카페 있을까?",
  "💬 대화하기 좋은 카페 알려줘",
  "🌿 분위기 좋은 힐링 카페 알려줘",
  "🎶 음악 감상하기 좋은 카페 추천해줘",
  "🖥️ 노트북 작업하기 좋은 카페 있을까?",
  "🍰 디저트 맛있는 카페 추천해줘",
  "🏞️ 창가 자리 있는 카페 알려줘",
  "👩‍💻 혼자 공부하기 좋은 카페 추천해줘",
  "📷 사진 찍기 좋은 포토스팟 카페 알려줘",
  "🌸 봄날에 가기 좋은 카페 알려줘",
  "🥤 다양한 음료 메뉴 있는 카페 추천해줘",
  "🛋️ 편안한 소파 자리 있는 카페 알려줘",
  "🎨 아기자기한 인테리어 카페 추천해줘",
  "🌅 일몰 보기 좋은 카페 알려줘",
  "🍵 차 종류가 다양한 카페 추천해줘",
  "🧁 케이크 맛있는 카페 알려줘",
  "🏡 조용한 동네 카페 추천해줘",
  "🐶 반려동물 출입 가능한 카페 알려줘",
  "📖 책 읽기 좋은 카페 추천해줘",
  "🎧 혼자 음악 들으며 작업하기 좋은 카페 알려줘",
  "🕯️ 분위기 있는 밤카페 추천해줘",
  "🍩 간단한 브런치 먹기 좋은 카페 알려줘",
  "🏙️ 전망 좋은 루프탑 카페 추천해줘",
  "🖼️ 전시와 함께 즐길 수 있는 카페 추천해줘",
  "🌻 사진찍기 좋은 플라워 카페 알려줘",
  "🎯 집중력 높여주는 스터디카페 추천해줘",
  "🚶‍♂️ 산책 후 들르기 좋은 카페 알려줘",
];

const TAG_TO_QUERY_KEY: { [tag: string]: string } = {
  "카페": "category",
  "스터디카페": "category",
  "독서실": "category",
  "어두움": "lightning_level",
  "중간": "lightning_level",
  "밝음": "lightning_level",
  "조용함": "noise_level",
  "적당한 소음": "noise_level",
  "시끌벅적": "noise_level",
  "콘센트 없음": "power_outlet_level",
  "콘센트 있음": "power_outlet_level",
  "콘센트 많음": "power_outlet_level",
  "시간제한 있음": "stay_duration_policy",
  "시간제한 없음": "stay_duration_policy",
  "주차 가능": "parking_level",
  "유료 주차": "parking_level",
  "주차 불가": "parking_level",
  "지하철 근처": "transport_level",
  "버스정류장 근처": "transport_level",
  "접근성 좋음": "transport_level",
  "번화가": "surrounding_environment",
  "조용한 골목": "surrounding_environment",
  "공원 근처": "surrounding_environment",
  "캠퍼스 근처": "surrounding_environment",
  "애견동반 가능": "pet_friendly",
  "애견동반 불가능": "pet_friendly",
};

const MOCK_SERVER = "https://studyspot.kr/api";
const DEBOUNCE_DELAY = 400;

const AiSearchPage: React.FC = () => {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState<"AI" | "CHOICE">("AI");
  const [aiQuery, setAiQuery] = useState("");
  const [debouncedQuery, setDebouncedQuery] = useState("");
  const [aiGeneratedTags, setAiGeneratedTags] = useState<string[]>([]);
  const [searchResults, setSearchResults] = useState<CafeCardData[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [recentQueries, setRecentQueries] = useState<string[]>(() =>
    JSON.parse(localStorage.getItem("recentQueries") || "[]")
  );
  const [randomSentences, setRandomSentences] = useState<string[]>([]);

  // 추천 문장 랜덤 3개
  useEffect(() => {
    const shuffled = [...RECOMMENDED_SENTENCES].sort(() => 0.5 - Math.random());
    setRandomSentences(shuffled.slice(0, 3));
  }, []);

  // 입력 디바운스
  useEffect(() => {
    const handler = setTimeout(() => setDebouncedQuery(aiQuery), DEBOUNCE_DELAY);
    return () => clearTimeout(handler);
  }, [aiQuery]);

  // AI 태그 요청
  useEffect(() => {
    const fetchTags = async () => {
      if (!debouncedQuery.trim()) {
        setAiGeneratedTags([]);
        return;
      }
      try {
        const tags = await getAiTags(debouncedQuery);
        setAiGeneratedTags(tags);
      } catch (err) {
        console.error("[ERROR] AI 태그 요청 실패:", err);
        setAiGeneratedTags([]);
      }
    };
    fetchTags();
  }, [debouncedQuery]);

  // 검색 실행
const executeSearch = async () => {
  if (!aiQuery.trim()) return;
  
  setIsLoading(true);
  try {
    // 최신 AI 태그 가져오기
    const tags = await getAiTags(aiQuery); 
    setAiGeneratedTags(tags);

    const params = new URLSearchParams();
    const queryMap: { [key: string]: string[] } = {};

    tags.forEach((tag) => {
      const key = TAG_TO_QUERY_KEY[tag];
      if (!key) return;
      if (!queryMap[key]) queryMap[key] = [];
      queryMap[key].push(tag);
    });

    Object.entries(queryMap).forEach(([key, values]) => {
      values.forEach((v) => params.append(key, v));
    });

    // 태그에 매핑이 없는 입력어만 nameOfCafe로
    const unmapped = tags.filter((tag) => !TAG_TO_QUERY_KEY[tag]);
    if (unmapped.length === 0) {
      // 모든 태그가 매핑됨 → nameOfCafe 사용 안함
    } else {
      params.append("nameOfCafe", aiQuery);
    }

    const res = await axios.get(`${MOCK_SERVER}/cafes`, { params });
    const cafes = Array.isArray(res.data.data?.cafes) ? res.data.data.cafes : [];
    setSearchResults(cafes.map(normalizeCafe));

    // 최근 검색어
    if (!recentQueries.includes(aiQuery)) {
      const newRecent = [aiQuery, ...recentQueries].slice(0, 10);
      setRecentQueries(newRecent);
      localStorage.setItem("recentQueries", JSON.stringify(newRecent));
    }
  } catch (err) {
    console.error(err);
    setSearchResults([]);
  } finally {
    setIsLoading(false);
  }
};


  const handleKeyPress = (e: KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      executeSearch();
    }
  };

  const switchTab = (tab: "AI" | "CHOICE") => {
    setActiveTab(tab);
    if (tab === "CHOICE") navigate("/tag-search");
  };

  return (
    <div className="search-container">
      <div className="search-tabs">
        <button className={activeTab === "AI" ? "active" : ""} onClick={() => switchTab("AI")}>
          문자 추출형
        </button>
        <button className={activeTab === "CHOICE" ? "active" : ""} onClick={() => switchTab("CHOICE")}>
          선택형
        </button>
      </div>

      <div className="ai-input-wrapper">
        <textarea
          placeholder="예: 밝고 조용한 카페 추천해줘"
          value={aiQuery}
          onChange={(e) => setAiQuery(e.target.value)}
          onKeyDown={handleKeyPress}
          rows={4}
          className="ai-input"
        />
        <button type="button" className="ai-search-button" onClick={executeSearch}>
          🔍
        </button>
      </div>

      <div className="recommend-sentences">
        {aiGeneratedTags.length > 0 ? aiGeneratedTags.map((tag) => <span key={tag}>{tag}</span>) : <p className="tag-placeholder">&nbsp;</p>}
      </div>

      {aiQuery.trim() === "" && (
        <div className="ai-suggest-box">
          <div className="suggest-section-recommend">
            <p className="suggest-section-recommend-title">추천 문장</p>
            <div className="suggest-section-recommend-list">
              {randomSentences.map((s, i) => (
                <button key={i} className="suggest-section-recommend-item" onClick={() => setAiQuery(s)}>
                  {s}
                </button>
              ))}
            </div>
          </div>
          {recentQueries.length > 0 && (
            <div className="suggest-section-last">
              <p className="suggest-section-last-title">이전에 작성한 문장</p>
              <div className="suggest-section-last-list">
                {recentQueries.slice(0,5).map((q, i) => (
                  <div key={i} className="suggest-section-last-item-wrapper">
                    <button
                      className="suggest-section-last-item-delete"
                      onClick={() => {
                        const newList = recentQueries.filter((item) => item !== q);
                        setRecentQueries(newList);
                        localStorage.setItem("recentQueries", JSON.stringify(newList));
                      }}
                    >
                      ✕ &nbsp;
                    </button>
                    <p className="suggest-section-last-item" onClick={() => setAiQuery(q)}>
                      {q}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      )}

      {/* 검색 결과 영역 */}
      <div className="results">
        {isLoading && <p>⏳ 검색 중...</p>}

        {!isLoading && searchResults.length === 0 && (
          <p>🔍 검색 결과가 없습니다.</p>
        )}

        {!isLoading &&
          searchResults.length > 0 &&
          searchResults.map((cafe) => (
            <CafeCard key={cafe.id} cafe={cafe} />
          ))}
      </div>

      <BottomNav />
    </div>
  );
};

export default AiSearchPage;
