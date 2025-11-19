import React from "react";
import { useNavigate } from "react-router-dom";
import "./CafeCard.css";

export interface CafeCardData {
  id: number;
  name: string;
  category?: string;
  purpose?: string[];
  imageList?: { imageUrl: string; index: number }[];
  location?: string[];
  rating?: number;
  startingTime?: string;
  closingTime?: string;
  tags?: string[];
}

interface CafeCardProps {
  cafe: CafeCardData;
}

const CafeCard: React.FC<CafeCardProps> = ({ cafe }) => {
  const navigate = useNavigate();
  const fallbackImage = "/images/default_cafe.png";

  const checkOpenStatus = (start?: string, end?: string) => {
    if (!start || !end) return "NO_INFO";

    const now = new Date();
    const current = now.getHours() * 60 + now.getMinutes();

    const [sh, sm] = start.split(":").map(Number);
    const [eh, em] = end.split(":").map(Number);

    const startMin = sh * 60 + sm;
    const endMin = eh * 60 + em;

    if (endMin < startMin) {
      if (current >= startMin || current < endMin) return "OPEN";
      return "CLOSED";
    }

    return current >= startMin && current < endMin ? "OPEN" : "CLOSED";
  };

  const openStatus = checkOpenStatus(cafe.startingTime, cafe.closingTime);

  return (
    <div
      className="cafe-card cursor-pointer"
      onClick={() => navigate(`/cafe/${cafe.id}`)}
    >
      <div className="cafe-card-div">
        <div className="cafe-card-img">
          <img
            src={cafe.imageList?.[0]?.imageUrl || fallbackImage}
            alt={cafe.name}
            className="cafe-thumbnail"
            onError={(e) => (e.currentTarget.src = fallbackImage)}
          />
        </div>

        <div className="cafe-info">
          <div className="cafe-info-title">
            <h3>{cafe.name}</h3>
            <p className="cafe-rating">⭐ {cafe.rating}</p>
          </div>

          <p className="cafe-meta">📍 {cafe.location?.join(", ")}</p>

          <div className={`open-status-badge ${openStatus}`}>
            {openStatus === "OPEN"
              ? "영업중"
              : openStatus === "CLOSED"
              ? "영업종료"
              : "영업시간 정보없음"}
          </div>

          <div className="cafe-card-tag-list">
            {cafe.purpose?.map((tag) => (
              <span key={tag} className="cafe-card-tag">
                {tag}
              </span>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default CafeCard;
