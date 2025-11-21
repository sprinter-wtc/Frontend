import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import AiSearchPage from "./pages/search/AiSearchPage";
import TagSearchPage from "./pages/search/TagSearchPage";
import Home from "./pages/Home"; // 홈 페이지
import CafeDetailPage from "./pages/cafe/CafeDetailPage";

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/ai-search" element={<AiSearchPage />} />
        <Route path="/search-select" element={<TagSearchPage />} />
        <Route path="/ai-search" element={<AiSearchPage />} />
        <Route path="/tag-search" element={<TagSearchPage />} />
        {/* <Route path="/cafe-detail" element={<CafeDetail/>}/> */}
        <Route path="/cafe/:id" element={<CafeDetailPage />} />

      </Routes>
    </Router>
  );
}

export default App;
