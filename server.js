const express = require("express");
const cors = require("cors");

const app = express();
app.use(cors());
app.use(express.json());

const PORT = 4000;

// Mock 데이터
const TAG_KEYWORDS = {
  카페: ["카페", "커피", "디저트", "케이크", "쿠키", "노트북"],
  스터디카페: ["스터디카페", "공부", "집중"],
  독서실: ["독서실", "책", "혼공", "조용한"],
  "조명 어두움": ["조명 어두움", "어두움", "어두운", "컴컴"],
  "조명 중간": ["조명 중간", "적당한 조명", "중간"],
  "조명 밝음": ["조명 밝음", "밝은 조명", "햇빛"],
  조용함: ["조용함", "조용한", "차분", "집중", "혼자", "시험", "조용", "집중"],
  적당한소음: ["적당한소음", "보통"],
  시끌벅적: ["시끌벅적", "북적", "떠들썩"],
};

const CAFES = [
  {
    id: 1,
    name: "카페 블루보틀",
    location: "서울 강남",
    tags: ["카페", "밝음", "조용함"],
    thumbnail: "https://via.placeholder.com/80",
    rating: 4.7,
    hours: "09:00~22:00",
  },
  {
    id: 2,
    name: "카페 루시드",
    location: "서울 홍대",
    tags: ["독서실", "밝음", "시간제한 없음"],
    thumbnail: "https://via.placeholder.com/80",
    rating: 4.5,
    hours: "08:00~23:00",
  },
  {
    id: 3,
    name: "스터디카페 집중존",
    location: "서울 신촌",
    tags: ["스터디카페", "조용함", "적당한소음"],
    thumbnail: "https://via.placeholder.com/80",
    rating: 4.3,
    hours: "09:00~23:00",
  },
];

// ----------------------
// 1. AI 추천 태그 API
// ----------------------
app.get("/api/ai-tags", (req, res) => {
  const { query } = req.query;

  if (!query) return res.json([]);

  const lower = query.toLowerCase();
  const matchedTags = [];

  Object.entries(TAG_KEYWORDS).forEach(([tag, keywords]) => {
    for (const kw of keywords) {
      if (lower.includes(kw.toLowerCase())) {
        matchedTags.push(tag);
        break;
      }
    }
  });

  res.json([...new Set(matchedTags)]);
});

// 추가: 태그 기반 카페 검색
app.get("/api/ai-search", (req, res) => {
  const query = req.query.query?.trim();
  if (!query) return res.status(400).json({ message: "검색어가 없습니다." });

  const results = mockData.cafes.filter((cafe) =>
    cafe.tags.some((tag) => tag.includes(query))
  );

  res.json({ cafes: results });
});
// ----------------------
// 2. 카페 검색 API
// ----------------------
app.get("/api/search-cafes", (req, res) => {
  const { tags } = req.query; // tags는 "카페,조용함" 같은 CSV 문자열
  if (!tags) return res.json([]);

  const tagArray = tags.split(",");
  const filtered = CAFES.filter((cafe) =>
    tagArray.every((t) => cafe.tags.includes(t))
  );

  res.json(filtered);
});

// ----------------------
app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
