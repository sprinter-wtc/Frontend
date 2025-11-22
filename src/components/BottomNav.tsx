import React from "react";
import { useNavigate, useLocation } from "react-router-dom";
import "./BottomNav.css";
import HomeIcon from "@mui/icons-material/Home";
import AlarmIcon from "@mui/icons-material/Alarm";
import SearchIcon from "@mui/icons-material/Search";

const BottomNav: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();

  const navItems = [
    { path: "/timer", label: "타이머", icon: <AlarmIcon /> },
    { path: "/", label: "홈", icon: <HomeIcon /> },
    { path: "/ai-search", label: "검색", icon: <SearchIcon /> },
  ];

  return (
    <div className="bottom-nav">
      {navItems.map((item) => (
        <div
          key={item.path}
          className={location.pathname === item.path ? "nav-item active" : "nav-item"}
          onClick={() => navigate(item.path)}
        >
          {item.icon}
          <span className="nav-label">{item.label}</span>
        </div>
      ))}
    </div>
  );
};

export default BottomNav;
