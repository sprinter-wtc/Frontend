// SearchPage.tsx
import React, { useState } from "react";
import AiSearchPage from "./search/AiSearchPage";
import TagSearchPage from "./search/TagSearchPage";

const SearchPage: React.FC = () => {
  const [mode, setMode] = useState<"AI" | "CHOICE">("AI");

  return (
    <div className="search-container pb-[80px]">
      {/* 상단 탭 */}
      <div className="search-tabs flex border-b">
        {["AI", "CHOICE"].map((tab) => (
          <div
            key={tab}
            onClick={() => setMode(tab as "AI" | "CHOICE")}
            className={`flex-1 text-center py-2 cursor-pointer ${
              mode === tab ? "border-b-2 border-black font-bold" : ""
            }`}
          >
            {tab === "AI" ? "AI 검색형" : "선택형"}
          </div>
        ))}
      </div>

      {/* 모드별 컴포넌트 */}
      {mode === "AI" ? <AiSearchPage /> : <TagSearchPage />}
    </div>
  );
};

export default SearchPage;
