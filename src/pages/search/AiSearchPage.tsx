import "../../styles/search/AiSearchPage.css";
import React, { useState, useEffect, KeyboardEvent } from "react";
import axios from "axios";
import BottomNav from "../../components/BottomNav";
import { useNavigate } from "react-router-dom";
import { getAiTags } from "../../api/cafeApi"; // AI 태그 가져오기

// -----------------------------
// 타입 정의
// -----------------------------
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
  imageUrl?: string; // API 기본 이미지
}


//-----------------------------
// 검색 전 추천 문장 보여주기
//-----------------------------

const RECOMMENDED_SENTENCES = [
  "조용하고 밝은 카페 추천해줘",
  "공부 집중 잘 되는 곳 알려줘",
  "커피 맛있는 카페 추천해줘",
  "좌석 편한 카페 있을까?",
  "대화하기 좋은 카페 알려줘",
];

// -----------------------------
const MOCK_SERVER =
  "https://c765212b-1c21-4d14-98d9-56dd58cc5d3d.mock.pstmn.io";
const RECOMMENDED_URL = `${MOCK_SERVER}/cafes/recommended`;
const CAFE_DETAIL_URL = `${MOCK_SERVER}/cafes/details`;
const DEBOUNCE_DELAY = 400;

// -----------------------------
const AiSearchPage: React.FC = () => {
  const [activeTab, setActiveTab] = useState<"AI" | "CHOICE">("AI");
  const [aiQuery, setAiQuery] = useState("");
  const [debouncedQuery, setDebouncedQuery] = useState("");
  const [aiGeneratedTags, setAiGeneratedTags] = useState<string[]>([]);
  const [searchResults, setSearchResults] = useState<Cafe[] | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();
  const [recentQueries, setRecentQueries] = useState<string[]>(() => {
    return JSON.parse(localStorage.getItem("recentQueries") || "[]");
  });

  // -----------------
  // 검색 전 추천 문장 보여주기
  // -----------------

  // -----------------
  // 입력 디바운스 처리
  // -----------------
  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedQuery(aiQuery);
    }, DEBOUNCE_DELAY);
    return () => clearTimeout(handler);
  }, [aiQuery]);

  // -----------------
  // AI 태그 요청
  // -----------------
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

  // -----------------
  // 검색 실행 (AI 태그 + 검색어)
  // -----------------
  // 검색 실행
  const executeSearch = async () => {
    if (!aiQuery.trim()) return;

    // 최근 검색어 업데이트 (한 번만)
    setRecentQueries((prev: string[]) => {
      // 이미 존재하면 추가 안함
      if (prev.includes(aiQuery)) return prev;

      const newList = [aiQuery, ...prev].slice(0, 5);
      localStorage.setItem("recentQueries", JSON.stringify(newList));
      return newList;
    });
    setIsLoading(true);
    try {
      const listRes = await axios.get<{ data: { id: number }[] }>(
        RECOMMENDED_URL
      );
      const cafeList = listRes.data.data || [];
      const requests = cafeList.map((cafe) =>
        axios.get<{ data: Cafe }>(`${CAFE_DETAIL_URL}/${cafe.id}`)
      );
      const responses = await Promise.all(requests);
      const cafes: Cafe[] = responses.map((res) => res.data.data);

      // AI 태그 + 입력어 필터링
      const filtered = cafes.filter((cafe) => {
        const tagMatch =
          aiGeneratedTags.length === 0 ||
          aiGeneratedTags.every(
            (tag) =>
              cafe.purpose.includes(tag) ||
              Object.values(cafe.tags).includes(tag) ||
              cafe.category === tag
          );
        const queryMatch =
          aiQuery.trim() === "" ||
          cafe.name.includes(aiQuery) ||
          cafe.purpose.some((p) => p.includes(aiQuery)) ||
          cafe.category.includes(aiQuery);
        return tagMatch && queryMatch;
      });

      setSearchResults(filtered);
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
      {/* 탭 버튼  */}
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

      {/* 입력창 */}
      {/* 입력창 + 버튼 래퍼 */}
      <div className="ai-input-wrapper">
        <div>
          <textarea
            placeholder="예: 밝고 조용한 카페 추천해줘"
            value={aiQuery}
            onChange={(e) => setAiQuery(e.target.value)}
            onKeyDown={handleKeyPress}
            rows={4}
            className="ai-input"
          />
        </div>
        <div>
          <button
            type="button"
            className="ai-search-button"
            onClick={executeSearch}
          >
            🔍
          </button>
        </div>
      </div>

      {/* AI 추천 태그 */}
      <div className="recommend-sentences">
        {aiGeneratedTags.length > 0 ? (
          aiGeneratedTags.map((tag) => <span key={tag}>{tag}</span>)
        ) : (
          <p className="tag-placeholder">  &nbsp; </p>
        )}
      </div>

      {/* 추천문장이랑 이전에 작성한 문장 작업하기   */}
      {aiQuery.trim() === "" && (
        <div className="ai-suggest-box">
          {/* 추천 문장 */}
          <div className="suggest-section-recommend">
            <p className="suggest-section-recommend-title">
              추천 문장
            </p>
            <div className="suggest-section-recommend-list">
              {RECOMMENDED_SENTENCES.map((s, i) => (
                <button
                  key={i}
                  className="suggest-section-recommend-item"
                  onClick={() => setAiQuery(s)}
                >
                  {s}
                </button>
              ))}
            </div>
          </div>

          {/* 최근 검색 */}
          {recentQueries.length > 0 && (
            <div className="suggest-section-last">
              <p className="suggest-section-last-title">이전에 작성한 문장</p>
              <div className="suggest-section-last-list">
                {recentQueries.map((q: string, i: number) => (
                  <div key={i} className="suggest-section-last-item-wrapper">
                     <button
                      className="suggest-section-last-item-delete"
                      onClick={() => {
                        const newList = recentQueries.filter(
                          (item) => item !== q
                        );
                        setRecentQueries(newList);
                        localStorage.setItem(
                          "recentQueries",
                          JSON.stringify(newList)
                        );
                      }}
                    >
                      ✕ &nbsp;
                    </button>
                    <p
                      className="suggest-section-last-item"
                      onClick={() => setAiQuery(q)}
                    >
                      {q}
                    </p>
                   
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      )}

      {/* 검색 결과 */}
      <div className="results">
        {isLoading ? (
          <p>로딩 중...</p>
        ) : searchResults === null ? (
          <p></p>
        ) : searchResults.length > 0 ? (
          searchResults.map((cafe) => (
            <div
              key={cafe.id}
              className="cafe-card cursor-pointer"
              onClick={() => navigate(`/cafe/${cafe.id}`)}
            >
              <img
                src={
                  cafe.imageList[0]?.imageUrl ||
                  "https://via.placeholder.com/80"
                }
                alt={cafe.name}
                className="cafe-thumbnail"
              />
              <div className="cafe-info">
                <h3>{cafe.name}</h3>
                <p>📍 {cafe.location.join(", ")}</p>
                <div className="cafe-card-tag-list">
                  {cafe.purpose.map((t) => (
                    <span key={t} className="cafe-card-tag">
                      {t}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          ))
        ) : (
          <p></p>
          // <p>검색 결과가 없습니다.</p>
        )}
      </div>
      <BottomNav />
    </div>
  );
};

export default AiSearchPage;
