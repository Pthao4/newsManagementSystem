import Card from "react-bootstrap/Card";
import Button from "react-bootstrap/Button";
import { Badge } from "react-bootstrap";
import { formatDate } from "../../untils/format";
import { useNavigate } from "react-router-dom";

export default function CardVertical({ article }) {
  const navigate = useNavigate();
  
  if (!article) return null; // Tránh lỗi nếu article = undefined

  const {
    id,
    title,
    content,
    categoryName,
    headline,
    newsTagNames = [],
    // createdDate,
  } = article;

  return (
    <Card className="my-4 shadow-lg rounded-4 h-100 border-0">
      <Card.Body className="d-flex flex-column">
        <Badge bg="primary" className="mb-2 align-self-start">
          {categoryName ? `Category • ${categoryName}` : "Category • General"}
        </Badge>

        <Card.Title className="fw-bold text-dark mb-2">
          {title}
        </Card.Title>

        {/* headline */}
        {headline && (
          <Card.Subtitle className="text-muted mb-2">
            {headline}
          </Card.Subtitle>
        )}

        {/* Hiển thị tag nếu có */}
        {newsTagNames.length > 0 && (
          <div className="mb-3">
            {newsTagNames.map((tag, i) => (
              <Badge key={i} bg="secondary" className="me-1">
                {tag}
              </Badge>
            ))}
          </div>
        )}
<div className="text-muted small mb-3">
              By <strong>{article.createdByName}</strong> •{" "}
              {formatDate(article.createdDate)} • Source:{" "}
              {article.source || "Unknown"}
            </div>
        {/* content (truncate 2 dòng) */}
        <Card.Text
          className="text-secondary"
          style={{
            display: "-webkit-box",
            WebkitLineClamp: 2,
            WebkitBoxOrient: "vertical",
            overflow: "hidden",
          }}
        >
          {content}
        </Card.Text>

      </Card.Body>
        <Card.Footer className="d-flex flex-column flex-md-row justify-content-between align-items-md-center bg-light mt-auto">
        <div className="mt-auto">
          <Button
            variant="primary"
            className="w-100 fw-semibold rounded-3"
            onClick={() => navigate(`/newsArticles/${id}`)}
          >
            Read more
          </Button>
        </div>
        </Card.Footer>
    </Card>
  );
}
