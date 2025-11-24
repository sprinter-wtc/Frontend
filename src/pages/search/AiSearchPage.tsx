// src/pages/search/cafe/AiSearchPage.tsx
import "../../styles/search/AiSearchPage.css";
import React, { useState, useEffect, KeyboardEvent } from "react";
import axios from "axios";
import BottomNav from "../../components/BottomNav";
import { useNavigate } from "react-router-dom";
import { getAiTags } from "../../api/cafeApi"; // AI 태그 가져오기
import CafeCard from "../../components/card/CafeCard";
import {
  normalizeCafe,
  CafeCardData,
} from "../../components/utils/normalizeCafe";
import { API_BASE_URL } from "../../config/api";


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
  averageStarRating?: number;
  address?: string;
  imageUrl?: string;
}

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
    if (!aiQuery.trim() && aiGeneratedTags.length === 0) return;

    setIsLoading(true);
    try {
      const params = new URLSearchParams();
      if (aiQuery.trim()) params.append("nameOfCafe", aiQuery);

      // AI 태그를 서버 파라미터로 전달
      aiGeneratedTags.forEach((tag) => {
        // 공간 종류는 category로, 나머지는 tags로
        if (TAG_MAP["☕️ 공간종류"].includes(tag)) params.append("category", tag);
        else params.append("tags", tag);
      });

      const res = await axios.get<{ data: { cafes: Cafe[] } }>(
        `${MOCK_SERVER}/cafes?${params.toString()}`
      );

      const cafes = Array.isArray(res.data.data?.cafes) ? res.data.data.cafes : [];
      const normalized = cafes.map(normalizeCafe);

      setSearchResults(normalized);

      // 최근 검색어 저장
      if (aiQuery.trim() && !recentQueries.includes(aiQuery)) {
        const newRecent = [aiQuery, ...recentQueries].slice(0, 10);
        setRecentQueries(newRecent);
        localStorage.setItem("recentQueries", JSON.stringify(newRecent));
      }
    } catch (err) {
      console.error("[ERROR] 카페 검색 실패:", err);
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

      <div className="results scroll-area">
        {isLoading ? (
          <p>로딩 중...</p>
        ) : searchResults.length > 0 ? (
          searchResults.map((cafe) => <CafeCard key={cafe.id} cafe={cafe} />)
        ) : (
          aiQuery.trim() !== "" && <p>검색 결과가 없습니다.</p>
        )}
      </div>

      <BottomNav />
    </div>
  );
};

export default AiSearchPage;