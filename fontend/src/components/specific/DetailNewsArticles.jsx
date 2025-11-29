import React from "react";
import { Card, Badge, Button, Row, Col } from "react-bootstrap";
import { formatDate } from "../../untils/format";
import { useNavigate } from "react-router-dom";

export default function DetailNewsArticles({ newsArticles }) {
  const navigate = useNavigate()
  return (
    <div className="container-lg my-4">
      <Card className="shadow-lg border-0 rounded-3 overflow-hidden">
        <Row className="g-0">
          {/* Cột nội dung */}
          <Col xs={12} md={12} className="p-4">
            <Badge bg="primary" className="mb-2">
              Category • {newsArticles.categoryName || "General"}
            </Badge>

            <Card.Title as="h2" className="fw-bold mb-2">
              {newsArticles.title}
            </Card.Title>

            <Card.Subtitle className="mb-3 text-muted">
              {newsArticles.headline}
            </Card.Subtitle>

            <div className="text-muted small mb-3">
              By <strong>{newsArticles.createdByName}</strong> •{" "}
              {formatDate(newsArticles.createdDate)} • Source:{" "}
              {newsArticles.source || "Unknown"}
            </div>

            <Card.Text className="lh-base">
              {(newsArticles.content ?? "").slice(0, 200) + 
              (newsArticles.content?.length > 200 ? "..." : "")}
            </Card.Text>
          </Col>

          {/* Cột hình ảnh
          <Col
            xs={12}
            md={4}
            className="d-flex align-items-center justify-content-center p-3"
          >
            <Card.Img
              src={newsArticles.NewsArticleImage}
              alt="Article"
              className="rounded img-fluid" 
            />
          </Col> */}
        </Row>

        {/* Footer */}
        <Card.Footer className="d-flex flex-column flex-md-row justify-content-between align-items-md-center bg-light">
          {/* <div className="text-muted small mb-2 mb-md-0">
            ID: <code>{newsArticles.id || newsArticles.NewsArticleID}</code> •
            Status: {newsArticles.NewsStatus ? "Published" : "Draft"}
          </div> */}
          <div>
            {/* <Button variant="outline-primary" size="sm" className="me-2">
              Share
            </Button> */}
            <Button variant="primary" size="sm" onClick={() => navigate(`/newsArticles/${newsArticles.id}`)}>
              Read more
            </Button>
          </div>
        </Card.Footer>
      </Card>
    </div>
  );
}
