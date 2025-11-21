import React from "react";
import { useNavigate, useLocation } from "react-router-dom";
import "./BottomNav.css";

const BottomNav: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();

  return (
    <div className="bottom-nav">
      <div
        className={location.pathname === "/timer" ? "active" : "cursor-pointer"}
        onClick={() => navigate("/timer")}
      >
        <span className="material-symbols-outlined">alarm</span>
        타이머
      </div>
      <div
        className={location.pathname === "/" ? "active" : "cursor-pointer"}
        onClick={() => navigate("/")}
      >
        <span className="material-symbols-outlined">home</span>    
        홈
      </div>
      <div
        className={
          location.pathname === "/search" ? "active" : "cursor-pointer"
        }
        onClick={() => navigate("/search")}
      >
        <span className="material-symbols-outlined">search</span>
        검색
      </div>
    </div>
  );
};

export default BottomNav;
