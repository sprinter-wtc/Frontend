import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import AiSearchPage from "./pages/search/AiSearchPage";
import TagSearchPage from "./pages/search/TagSearchPage";
import Home from "./pages/Home"; // 홈 페이지
import CafeDetailPage from "./pages/cafe/CafeDetailPage";
import StudySpotRec from "./pages/recommend/StudySpotRec";



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
        <Route path="studyspot-rec" element={<StudySpotRec/>} />
        /*안드로이드 WebView가 타이머 클릭 시 가로채기 위해 반드시 필요함*/ 
        <Route path="/timer" element={<div>timer</div>} />
      </Routes>
    </Router>
  );
}

export default App;
