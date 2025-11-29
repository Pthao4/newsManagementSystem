import Nav from "react-bootstrap/Nav";
import Navbar from "react-bootstrap/Navbar";
import Container from "react-bootstrap/Container";
import Dropdown from "react-bootstrap/Dropdown";
import { Link } from "react-router-dom";
import { FiSettings } from "react-icons/fi";
import { authAPI } from "../../api/authAPI";

export default function Navbars() {
  const handleLogout = async () => {
    try {
      await authAPI.logout();
      window.location.href = "/login"; // chuyển hướng sau khi logout
    } catch (error) {
      console.error("Logout failed:", error);
    }
  };

  return (
    <Navbar bg="dark" variant="dark" expand="lg" className="shadow-sm">
      <Container>
        {/* Logo */}
        <Navbar.Brand as={Link} to="/home" className="fw-bold text-uppercase">
          FUNews
        </Navbar.Brand>

        <Navbar.Toggle aria-controls="basic-navbar-nav" />

        <Navbar.Collapse id="basic-navbar-nav">
          {/* Navigation Links */}
          <Nav className="me-auto">
            <Nav.Link as={Link} to="/home" className="fw-semibold">
              Home
            </Nav.Link>
            <Nav.Link as={Link} to="/categories" className="fw-semibold">
              Category
            </Nav.Link>
            <Nav.Link as={Link} to="/newsArticles" className="fw-semibold">
              News
            </Nav.Link>
            <Nav.Link as={Link} to="/users" className="fw-semibold">
              Users
            </Nav.Link>
          </Nav>

          {/* Dropdown Settings */}
          <Dropdown align="end">
            <Dropdown.Toggle
              variant="outline-light"
              id="dropdown-settings"
              className="d-flex align-items-center border-0 bg-transparent"
            >
              <FiSettings size={22} />
            </Dropdown.Toggle>

            <Dropdown.Menu className="shadow-sm">
              <Dropdown.Item as={Link} to="/profile">
                 Profile
              </Dropdown.Item>
              <Dropdown.Item as={Link} to="/history">
                 My Articles
              </Dropdown.Item>
              <Dropdown.Divider />
              <Dropdown.Item onClick={handleLogout} className="text-danger fw-semibold">
                 Logout
              </Dropdown.Item>
            </Dropdown.Menu>
          </Dropdown>
        </Navbar.Collapse>
      </Container>
    </Navbar>
  );
}
