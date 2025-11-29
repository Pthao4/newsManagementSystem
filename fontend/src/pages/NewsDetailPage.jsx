import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Card, Button, Badge, Spinner, Container } from "react-bootstrap";
import { newsArticleAPI } from "../api/newsArticleAPI";
import { formatDate } from "../untils/format";

export default function NewsDetailPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [article, setArticle] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    newsArticleAPI
      .getNewsArticleById(id)
      .then((data) => {
        setArticle(data);
      })
      .catch((err) => console.error("Error fetching article:", err))
      .finally(() => setLoading(false));
  }, [id]);

  if (loading) {
    return (
      <div className="d-flex justify-content-center align-items-center vh-100">
        <Spinner animation="border" variant="primary" />
      </div>
    );
  }

  if (!article) {
    return (
      <Container className="py-5 text-center text-muted">
        <h5>Không tìm thấy bài viết.</h5>
        <Button variant="outline-secondary" onClick={() => navigate("/")}>
          ← Quay lại
        </Button>
      </Container>
    );
  }

  const {
    title,
    headline,
    content,
    categoryName,
    newsTagNames = [],
    createdByName,
    createdDate,
    source,
  } = article;

  return (
    <Container className="py-5">
      <Card className="shadow-lg rounded-4 border-0">
        <Card.Body className="p-4">
          {/* Category */}
          <Badge bg="primary" className="mb-3 align-self-start">
            {categoryName ? `Category • ${categoryName}` : "Category • General"}
          </Badge>

          {/* Title */}
          <Card.Title className="fw-bold text-dark fs-3 mb-3">
            {title}
          </Card.Title>

          {/* Headline */}
          {headline && (
            <Card.Subtitle className="text-muted mb-3 fst-italic">
              {headline}
            </Card.Subtitle>
          )}

          {/* Author + Date + Source */}
          <div className="text-muted small mb-3">
            By <strong>{createdByName || "Unknown"}</strong> •{" "}
            {formatDate(createdDate)} • Source:{" "}
            <span className="text-primary fw-semibold">
              {source || "Unknown"}
            </span>
          </div>

          {/* Tags */}
          {newsTagNames.length > 0 && (
            <div className="mb-3">
              {newsTagNames.map((tag, i) => (
                <Badge key={i} bg="secondary" className="me-1">
                  {tag}
                </Badge>
              ))}
            </div>
          )}

          {/* Content */}
          <Card.Text className="text-secondary fs-6 lh-base">
            {content}
          </Card.Text>
        </Card.Body>

        {/* Footer */}
        <Card.Footer className="bg-light border-0 px-4 py-3 d-flex justify-content-start">
          <Button
            variant="outline-secondary"
            className="fw-semibold rounded-3"
            onClick={() => navigate("/")}
          >
            ← Back
          </Button>
        </Card.Footer>
      </Card>
    </Container>
  );
}
