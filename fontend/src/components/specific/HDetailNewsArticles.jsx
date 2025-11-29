import React from "react";
import { Card } from "react-bootstrap";
import { formatDate } from "../../untils/format";
import { useNavigate } from "react-router-dom";

export default function HDetailNewsArticles({ newsArticles }) {
  const navigate = useNavigate();
  if (!newsArticles) return null;

  const { id, title, headline, content, createdDate, source } = newsArticles;

  return (
    <Card
      className="mb-3 border-0 border-start border-4 border-secondary-subtle rounded-4 shadow-sm"
      style={{
        transition: "all 0.3s ease",
        cursor: "pointer",
        minHeight: "150px",
      }}
      onClick={() => navigate(`/newsArticles/${id}`)}
    >
      <Card.Body className="p-3 d-flex flex-column justify-content-between h-100">
        {/* Tiêu đề */}
        <Card.Title
          as="h5"
          className="fw-bold text-dark mb-2 text-truncate"
          title={title}
        >
          {title}
        </Card.Title>

        {/* Headline */}
        {headline && (
          <Card.Subtitle
            className="text-muted small mb-2 fst-italic text-truncate"
            title={headline}
          >
            {headline}
          </Card.Subtitle>
        )}

        {/* Nội dung (2 dòng) */}
        <Card.Text
          className="text-secondary small mb-3 flex-grow-1"
          style={{
            display: "-webkit-box",
            WebkitLineClamp: "2",
            WebkitBoxOrient: "vertical",
            overflow: "hidden",
          }}
        >
          {content}
        </Card.Text>

        {/* Info */}
        <div className="small text-muted">
          {formatDate(createdDate)} •{" "}
          <span className="fw-semibold text-primary">
            {source || "Unknown"}
          </span>
        </div>
      </Card.Body>
    </Card>
  );
}
