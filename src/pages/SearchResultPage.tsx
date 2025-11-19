import React from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { Cafe } from "../api/cafeApi";

interface LocationState {
  mode: "AI" | "CHOICE";
  query?: string;
  tags: string[];
  results: Cafe[];
}

const SearchResultPage: React.FC = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const state = location.state as LocationState | undefined;

  if (!state) {
    return (
      <div className="p-4">
        <p>검색 결과가 없습니다.</p>
        <button onClick={() => navigate("/search")} className="mt-2 text-blue-600 underline">
          검색으로 돌아가기
        </button>
      </div>
    );
  }

  const { mode, query, tags, results } = state;

  return (
    <div className="search-result-page pb-[80px]">
      {/* 상단: 검색 정보 */}
      <div className="search-info p-4 border-b">
        {mode === "AI" ? (
          <>
            <p>검색어: {query}</p>
            <div className="tags mt-2">
              {tags.map(tag => (
                <span
                  key={tag}
                  className="tag active"
                  style={{ backgroundColor: "#E58C8C", marginRight: 4 }}
                >
                  {tag}
                </span>
              ))}
            </div>
          </>
        ) : (
          <>
            <p>선택된 태그:</p>
            <div className="tags mt-2">
              {tags.map(tag => (
                <span
                  key={tag}
                  className="tag active"
                  style={{ backgroundColor: "#E58C8C", marginRight: 4 }}
                >
                  {tag}
                </span>
              ))}
            </div>
          </>
        )}
      </div>

      {/* 검색 결과 카페 리스트 */}
      <div className="cafe-list p-4">
        {results.length === 0 ? (
          <p className="text-gray-400">검색 결과가 없습니다</p>
        ) : (
          results.map(cafe => (
            <div
              key={cafe.id}
              className="cafe-card flex gap-4 mb-4 cursor-pointer"
              onClick={() => navigate(`/cafes/${cafe.id}`)} // ✅ 카페 클릭 시 상세페이지로 이동
            >
              <img
                src={cafe.thumbnail || ""}
                alt={cafe.name}
                className="w-24 h-24 object-cover"
              />
              <div className="flex-1">
                <h3 className="font-bold">{cafe.name}</h3>
                <p>{cafe.location}</p>
                {cafe.tags.length > 0 && (
                  <div className="tags mt-1 flex flex-wrap gap-1">
                    {cafe.tags.map(tag => (
                      <span
                        key={tag}
                        className="tag"
                        style={{
                          backgroundColor: "#D9D9D9",
                          padding: "2px 6px",
                          borderRadius: 4,
                        }}
                      >
                        {tag}
                      </span>
                    ))}
                  </div>
                )}
              </div>
            </div>
          ))
        )}
      </div>

      {/* 하단 고정 바 */}
      <nav className="bottom-nav fixed bottom-0 left-0 right-0 bg-white border-t flex justify-around py-3">
        <div>타이머</div>
        <div className="font-bold cursor-pointer" onClick={() => navigate("/")}>
          홈
        </div>
        <div onClick={() => navigate("/search")}>검색</div>
      </nav>
    </div>
  );
};

export default SearchResultPage;
