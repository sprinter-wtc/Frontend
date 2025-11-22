import React from "react";
import { useNavigate } from "react-router-dom";
import "./CafeCard.css";

// 공통 카페 타입
export interface CafeCardData {
  id: number;
  name: string;
  category?: string;
  address?: string;
  thumbnail?: string;
  imageList?: { imageUrl: string; index: number }[];
  tags?: string[];           // 홈용
  purpose?: string[];        // 검색용
}

interface CafeCardProps {
  cafe: CafeCardData;
  clickable?: boolean; // 클릭 가능 여부 (홈/검색 구분)
}

const CafeCard: React.FC<CafeCardProps> = ({ cafe, clickable = true }) => {
  const navigate = useNavigate();

  const handleClick = () => {
    if (clickable) navigate(`/cafes/${cafe.id}`);
  };

  return (
    <div className="cafe-card" onClick={handleClick}>
      <img
        src={cafe.thumbnail ?? cafe.imageList?.[0]?.imageUrl ?? ""}
        alt={cafe.name}
        className="cafe-img"
      />
      <div className="cafe-info">
        <h3>{cafe.name}</h3>
        {cafe.address && <p className="cafe-address">{cafe.address}</p>}
        <div className="tag-list">
          {cafe.tags?.map((tag, idx) => (
            <span key={idx} className="cafe-tag">
              {tag}
            </span>
          ))}
        </div>
      </div>
    </div>
  );
};

export default CafeCard;
