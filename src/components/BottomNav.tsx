import React from "react";
import { useNavigate, useLocation } from "react-router-dom";
import "./BottomNav.css";
import HomeIcon from "@mui/icons-material/Home";
import AlarmIcon from "@mui/icons-material/Alarm";
import SearchIcon from "@mui/icons-material/Search";

const BottomNav: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();

  return (
    <div className="bottom-nav">
      <div
        className={location.pathname === "/timer" ? "active" : "cursor-pointer"}
        onClick={() => navigate("/timer")}
      >
        <AlarmIcon />
        타이머
      </div>
      <div
        className={location.pathname === "/" ? "active" : "cursor-pointer"}
        onClick={() => navigate("/")}
      >
        <HomeIcon />홈
      </div>
      <div
        className={
          location.pathname === "/search" ? "active" : "cursor-pointer"
        }
        onClick={() => navigate("/search")}
      >
        <SearchIcon />
        검색
      </div>
    </div>
  );
};

export default BottomNav;
