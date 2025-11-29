import { useEffect } from "react";
import { Container, Alert } from "react-bootstrap";
import { useNavigate } from "react-router-dom";

export default function Forbidden() {
  const navigate = useNavigate();
  useEffect(() => {
    const timer = setTimeout(() => {
      navigate("/"); // quay về Home sau 2 giây
    }, 2000);

    return () => clearTimeout(timer);
  }, [navigate]);
  return (
    <Container className="d-flex vh-100 justify-content-center align-items-center">
      <Alert variant="danger" className="text-center p-4 rounded-3 shadow-lg">
        <h2>Access Denied</h2>
        <p>You do not have permission to view this page.</p>
      </Alert>
    </Container>
  );
}
