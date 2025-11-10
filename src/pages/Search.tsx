import React, { useState, useEffect, useRef } from "react";
import "../styles/Search.css";

const TAG_KEYWORDS: { [tag: string]: string[] } = {
  "카페": ["카페", "커피", "디저트", "케이크", "쿠키", "노트북"],
  "스터디카페": ["스터디카페", "공부", "집중"],
  "독서실": ["독서실", "책", "혼공", "조용한"],
  "조명 어두움": ["조명 어두움", "어두움", "컴컴"],
  "조명 중간": ["조명 중간", "적당한 조명", "중간"],
  "조명 밝음": ["조명 밝음", "밝은 조명", "햇빛"],
  "조용함": ["조용함", "조용한", "차분", "집중","혼자","시험"],
  "적당한소음": ["적당한소음", "보통"],
  "시끌벅적": ["시끌벅적", "북적", "떠들썩"],
  "콘센트 있음": ["콘센트", "있음", "전원","노트북","코딩"],
  "시간제한 있음": ["2시간 이하", "시간제한 있음"],
  "시간제한 없음": ["시간제한 없음", "오래있기좋음"],
  "주차 가능": ["주차 가능", "주차여유"],
  "유료주차": ["유료주차", "주차비"],
  "주차불가": ["주차불가", "주차없음"],
  "지하철근처": ["지하철", "역근처"],
  "버스정류장 근처": ["버스정류장", "버스근처"],
  "접근성좋음": ["접근성좋음", "편리", "오가기편함"],
  "번화가": ["번화가", "상권좋음", "역근처"],
  "조용한골목": ["조용한골목", "한적"],
  "공원근처": ["공원근처", "산책", "공원"],
  "캠퍼스근처": ["캠퍼스근처", "학교근처"],
  "애견동반 가능": ["애견동반", "반려견", "강아지", "애카", "동물"],
};

const DEBOUNCE_DELAY = 400;

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

interface SearchProps {
  onSearch?: (query: string, tags: string[]) => void;
}

const Search: React.FC<SearchProps> = ({ onSearch }) => {
  const [mode, setMode] = useState<"AI" | "CHOICE">("AI");

  // AI 검색
  const [aiQuery, setAiQuery] = useState("");
  const [debouncedQuery, setDebouncedQuery] = useState("");
  const [aiGeneratedTags, setAiGeneratedTags] = useState<string[]>([]);
  const debounceTimer = useRef<NodeJS.Timeout | null>(null);

  // 선택형
  const [selectedTags, setSelectedTags] = useState<string[]>([]);
  const [selectedOptions, setSelectedOptions] = useState<{ [key: string]: string[] }>(() => {
    const init: { [key: string]: string[] } = {};
    Object.keys(TAG_MAP).forEach((key) => (init[key] = []));
    return init;
  });

  // =========================
  // debounce AI 입력
  // =========================
  useEffect(() => {
    if (debounceTimer.current) clearTimeout(debounceTimer.current);
    debounceTimer.current = setTimeout(() => setDebouncedQuery(aiQuery), DEBOUNCE_DELAY);
    return () => {
      if (debounceTimer.current) clearTimeout(debounceTimer.current);
    };
  }, [aiQuery]);

  // =========================
  // AI 검색: 태그 생성
  // =========================
  useEffect(() => {
    if (!debouncedQuery.trim()) {
      setAiGeneratedTags([]);
      return;
    }
    const lower = debouncedQuery.toLowerCase();
    const matched: string[] = [];

    Object.entries(TAG_KEYWORDS).forEach(([tag, keywords]) => {
      for (const kw of keywords) {
        if (lower.includes(kw.toLowerCase())) {
          matched.push(tag);
          break;
        }
      }
    });

    setAiGeneratedTags(Array.from(new Set(matched)));
  }, [debouncedQuery]);

  // =========================
  // 선택형: 옵션 클릭
  // =========================
  const toggleOption = (category: string, value: string) => {
    setSelectedOptions(prev => {
      const cur = prev[category];
      const updated = cur.includes(value) ? cur.filter(v => v !== value) : [...cur, value];
      return { ...prev, [category]: updated };
    });

    setSelectedTags(prev => prev.includes(value) ? prev.filter(t => t !== value) : [...prev, value]);
  };

  // =========================
  // 모드 변경
  // =========================
  const handleModeChange = (newMode: "AI" | "CHOICE") => {
    setMode(newMode);
    setAiQuery("");
    setDebouncedQuery("");
    setAiGeneratedTags([]);
    setSelectedTags([]);
    setSelectedOptions(() => {
      const reset: { [key: string]: string[] } = {};
      Object.keys(TAG_MAP).forEach((key) => (reset[key] = []));
      return reset;
    });
  };

  // =========================
  // 상호명 검색
  // =========================
  const handleNameSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    const query = e.target.value.trim();
    if (query.length > 0) {
      setSelectedTags([]);
      setSelectedOptions(prev => {
        const reset = { ...prev };
        Object.keys(reset).forEach(key => reset[key] = []);
        return reset;
      });
    }
  };

  // =========================
  // 검색 실행
  // =========================
  const executeSearch = async () => {
    const query = mode === "AI" ? aiQuery : "";
    try {
      if (onSearch) onSearch(query, selectedTags);
    } catch (err) {
      console.error("검색 오류:", err);
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    if (e.key === "Enter") executeSearch();
  };

  return (
    <div className="search-container">
      {/* 상단 탭 */}
      <div className="search-tabs">
        <button
          className={mode === "AI" ? "active" : ""}
          onClick={() => handleModeChange("AI")}
        >
          AI 검색형
        </button>
        <button
          className={mode === "CHOICE" ? "active" : ""}
          onClick={() => handleModeChange("CHOICE")}
        >
          선택형
        </button>
      </div>

      {/* AI 검색 */}
      {mode === "AI" && (
        <div className="ai-search">
          <textarea
            placeholder="방문하고 싶은 장소를 검색하세요"
            className="ai-input"
            value={aiQuery}
            onChange={e => setAiQuery(e.target.value)}
            onKeyDown={handleKeyPress}
            rows={4}
          />
          <div className="recommend-sentences">
            {aiGeneratedTags.map(tag => (
              <span key={tag}>{tag}</span>
            ))}
          </div>
        </div>
      )}

      {/* 선택형 */}
      {mode === "CHOICE" && (
        <div className="select-search">
          {/* 상단에 선택한 태그 표시 */}
          <div className="selected-tags">
            {selectedTags.length === 0 ? (
              <p className="text-gray-400">태그를 선택해주세요</p>
            ) : (
              selectedTags.map(tag => (
                <span key={tag} className="tag active">
                  {tag}
                </span>
              ))
            )}
          </div>

          {/* 상호명 검색 */}
          <input
            type="text"
            placeholder="상호명 검색"
            className="ai-input"
            onChange={handleNameSearch}
            onKeyDown={handleKeyPress}
          />

          {/* 태그 선택 영역 */}
          <div className="max-h-[50vh] overflow-y-auto mt-2">
            {Object.entries(TAG_MAP).map(([category, options]) => (
              <div key={category} className="mb-4 filter-section">
                <label>{category}</label>
                <div className="tag-grid">
                  {options.map(opt => (
                    <button
                      key={opt}
                      className={`tag ${selectedOptions[category].includes(opt) ? "active" : ""}`}
                      onClick={() => toggleOption(category, opt)}
                    >
                      {opt}
                    </button>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* 검색 버튼 */}
      <button className="ai-input mt-4" onClick={executeSearch}>
        검색
      </button>

      {/* 하단 네비게이션 */}
      <nav className="bottom-nav">
        <div>타이머</div>
        <div className="font-bold">홈</div>
        <div>검색</div>
      </nav>
    </div>
  );
};

export default Search;
