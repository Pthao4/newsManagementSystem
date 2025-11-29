// src/pages/SignUp.jsx
import { Container, Row, Col, Form, Button, Card, Alert } from "react-bootstrap";
import { useNavigate } from "react-router-dom";
import { useState } from "react";
import { authAPI } from "../api/authAPI";

export default function SignUp() {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
  });
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSignup = async (e) => {
    e.preventDefault();
    setError("");
    setSuccess("");

    if (formData.password !== formData.confirmPassword) {
      setError("Passwords do not match!");
      return;
    }

    try {
      const response = await authAPI.register({
        name: formData.name,
        email: formData.email,
        password: formData.password,
        role: 2, // mặc định role là 2 = Staff
      });

      setSuccess("Registration successful!");
      console.log(response.data);
      setTimeout(() => navigate("/login"), 1500);
    } catch (err) {
      console.error(err);
      setError(err.response?.data || "Registration failed. Please try again.");
    }
  };

  return (
    <Container fluid className="d-flex justify-content-center align-items-center vh-100 bg-light">
      <Row className="w-100">
        <Col xs={12} sm={10} md={6} lg={4} className="mx-auto">
          <Card className="p-4 shadow-lg rounded-4 border-0">
            <h3 className="text-center mb-4 text-success fw-bold">Create Account</h3>

            {error && <Alert variant="danger">{error}</Alert>}
            {success && <Alert variant="success">{success}</Alert>}

            <Form onSubmit={handleSignup}>
              <Form.Group className="mb-3">
                <Form.Label className="fw-semibold">Account Name</Form.Label>
                <Form.Control
                  name="name"
                  type="text"
                  placeholder="Enter your account name"
                  className="rounded-3"
                  value={formData.name}
                  onChange={handleChange}
                  required
                />
              </Form.Group>

              <Form.Group className="mb-3">
                <Form.Label className="fw-semibold">Email</Form.Label>
                <Form.Control
                  name="email"
                  type="email"
                  placeholder="Enter your email"
                  className="rounded-3"
                  value={formData.email}
                  onChange={handleChange}
                  required
                />
              </Form.Group>

              <Form.Group className="mb-3">
                <Form.Label className="fw-semibold">Password</Form.Label>
                <Form.Control
                  name="password"
                  type="password"
                  placeholder="Create a password"
                  className="rounded-3"
                  value={formData.password}
                  onChange={handleChange}
                  required
                />
              </Form.Group>

              <Form.Group className="mb-3">
                <Form.Label className="fw-semibold">Confirm Password</Form.Label>
                <Form.Control
                  name="confirmPassword"
                  type="password"
                  placeholder="Confirm your password"
                  className="rounded-3"
                  value={formData.confirmPassword}
                  onChange={handleChange}
                  required
                />
              </Form.Group>

              <Button variant="success" type="submit" className="w-100 py-2 fw-semibold rounded-3">
                Sign Up
              </Button>
            </Form>

            <div className="text-center mt-3">
              <span className="small">Already have an account? </span>
              <Button
                variant="link"
                className="p-0 text-decoration-none"
                onClick={() => navigate("/login")}
              >
                Login
              </Button>
            </div>
          </Card>
        </Col>
      </Row>
    </Container>
  );
}
