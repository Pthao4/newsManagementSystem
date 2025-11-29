import Card from "react-bootstrap/Card";
import Button from "react-bootstrap/Button";
import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";

export default function CardHorizontal({ image, title, content }) {
  return (
    <Card className="mb-4 shadow-lg rounded-4 border-0">
      <Row className="g-0">
        <Col md={4}>
          <Card.Img
            src={image}
            alt={title}
            className="h-100 rounded-start-4"
            style={{ objectFit: "cover" }}
          />
        </Col>
        <Col md={8}>
          <Card.Body className="d-flex flex-column h-100">
            <Card.Title className="fw-bold text-dark">{title}</Card.Title>
            <Card.Text
              style={{
                display: "-webkit-box",
                WebkitLineClamp: 3,
                WebkitBoxOrient: "vertical",
                overflow: "hidden",
              }}
            >
              {content}
            </Card.Text>

            <div className="mt-auto">
              <Button variant="primary" className="fw-semibold rounded-3">
                Xem chi tiết
              </Button>
            </div>
          </Card.Body>
        </Col>
      </Row>
    </Card>
  );
}
