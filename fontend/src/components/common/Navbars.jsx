import Nav from "react-bootstrap/Nav";
import Navbar from "react-bootstrap/Navbar";
import Container from "react-bootstrap/Container";
import Dropdown from "react-bootstrap/Dropdown";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../../context/useAuth";
import { authAPI } from "../../api/authAPI";
import { notificationAPI } from "../../api/notificationAPI";
import { FiBell } from "react-icons/fi";
import { Badge } from "react-bootstrap";
import { useState, useEffect } from "react";

export default function Navbars() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [notifications, setNotifications] = useState([]);

  useEffect(() => {
    if (user) {
      fetchNotifications();
      let intervalId = null;

      const handleVisibilityChange = () => {
        if (document.visibilityState === "visible") {
          fetchNotifications();
          intervalId = setInterval(fetchNotifications, 60000);
        } else {
          if (intervalId) clearInterval(intervalId);
        }
      };

      if (document.visibilityState === "visible") {
        intervalId = setInterval(fetchNotifications, 60000);
      }

      document.addEventListener("visibilitychange", handleVisibilityChange);

      return () => {
        if (intervalId) clearInterval(intervalId);
        document.removeEventListener("visibilitychange", handleVisibilityChange);
      };
    }
  }, [user]);

  const fetchNotifications = async () => {
    const data = await notificationAPI.getNotifications();
    setNotifications(data);
  };

  const handleNotificationClick = async (notif) => {
    const isAlreadyRead = notif.isRead || notif.read;
    if (!isAlreadyRead) {
      await notificationAPI.markAsRead(notif.id);
      setNotifications(prev => prev.map(n => n.id === notif.id ? { ...n, isRead: true, read: true } : n));
    }
    
    // If the user is already on the article page, reload the comments without navigating
    if (window.location.pathname.includes(`/newsArticles/${notif.articleId}`)) {
      window.dispatchEvent(new CustomEvent("reloadComments"));
      
      const commentHeader = document.getElementById("comments-header");
      if (commentHeader) {
        window.scrollTo({
          top: commentHeader.offsetTop - 80,
          behavior: "smooth"
        });
      }
    } else {
      navigate(`/newsArticles/${notif.articleId}`);
    }
  };

  const handleLogout = async () => {
    try {
      await authAPI.logout();
      window.location.href = "/login"; // chuyển hướng sau khi logout
    } catch (error) {
      console.error("Logout failed:", error);
    }
  };

  const isAdmin = user?.role === "ROLE_ADMIN";
  const isStaff = user?.role === "ROLE_STAFF" || isAdmin;

  return (
    <Navbar bg="dark" variant="dark" expand="lg" className="shadow-sm">
      <Container>
        {/* Logo */}
        <Navbar.Brand as={Link} to="/home" className="fw-bold text-uppercase">
          NMS
        </Navbar.Brand>

        <div className="d-flex align-items-center gap-3 order-lg-last ms-auto me-2 me-lg-0">
          {/* Notification Bell */}
          {user && (
            <Dropdown align="end">
              <Dropdown.Toggle
                variant="outline-light"
                className="border-0 bg-transparent text-light position-relative p-2"
              >
                <FiBell size={22} />
                {notifications.filter(n => !(n.isRead || n.read)).length > 0 && (
                  <Badge 
                    bg="danger" 
                    pill 
                    className="position-absolute top-0 start-100 translate-middle"
                    style={{ fontSize: "0.65rem" }}
                  >
                    {notifications.filter(n => !(n.isRead || n.read)).length}
                  </Badge>
                )}
              </Dropdown.Toggle>

              <Dropdown.Menu className="shadow-sm position-absolute" style={{ minWidth: "280px", maxWidth: "90vw", maxHeight: "400px", overflowY: "auto", right: 0, left: "auto" }}>
                <div className="px-3 py-2 border-bottom fw-bold">Notifications</div>
                {notifications.length === 0 ? (
                  <div className="text-center text-muted p-3">No notifications</div>
                ) : (
                  notifications.map(notif => {
                    const isReadStatus = notif.isRead || notif.read;
                    return (
                      <Dropdown.Item 
                        key={notif.id} 
                        className={`text-wrap py-2 border-bottom ${isReadStatus ? "text-muted bg-light" : "fw-semibold bg-white"}`}
                        onClick={() => handleNotificationClick(notif)}
                        style={{ fontSize: "0.9rem" }}
                      >
                        {notif.message}
                        <div className="text-muted small mt-1" style={{ fontSize: "0.75rem" }}>
                          {new Date(notif.createdDate).toLocaleString()}
                        </div>
                      </Dropdown.Item>
                    );
                  })
                )}
              </Dropdown.Menu>
            </Dropdown>
          )}

          {/* Dropdown Settings */}
          <Dropdown align="end">
            <Dropdown.Toggle
              variant="outline-light"
              id="dropdown-settings"
              className="d-flex align-items-center border-0 bg-transparent text-light p-1"
            >
              <img
                src={user?.avatar || `https://ui-avatars.com/api/?name=${encodeURIComponent(user?.name || 'User')}&background=random`}
                alt="Avatar"
                className="rounded-circle object-fit-cover"
                style={{ width: "32px", height: "32px" }}
              />
              <span className="fw-semibold d-none d-lg-inline ms-2">{user?.name || "User"}</span>
            </Dropdown.Toggle>

            <Dropdown.Menu className="shadow-sm position-absolute" style={{ right: 0, left: "auto" }}>
              <Dropdown.Item as={Link} to="/profile">
                Profile
              </Dropdown.Item>
              {isStaff && (
                <Dropdown.Item as={Link} to="/history">
                  My Articles
                </Dropdown.Item>
              )}
              <Dropdown.Divider />
              <Dropdown.Item onClick={handleLogout} className="text-danger fw-semibold">
                Logout
              </Dropdown.Item>
            </Dropdown.Menu>
          </Dropdown>
        </div>

        <Navbar.Toggle aria-controls="basic-navbar-nav" className="border-0 p-1" />

        <Navbar.Collapse id="basic-navbar-nav">
          {/* Navigation Links */}
          <Nav className="me-auto mt-2 mt-lg-0">
            <Nav.Link as={Link} to="/home" className="fw-semibold">
              Home
            </Nav.Link>
            {isStaff && (
              <Nav.Link as={Link} to="/categories" className="fw-semibold">
                Category
              </Nav.Link>
            )}
            {isStaff && (
              <Nav.Link as={Link} to="/newsArticles" className="fw-semibold">
                News
              </Nav.Link>
            )}
            {isAdmin && (
              <Nav.Link as={Link} to="/users" className="fw-semibold">
                Users
              </Nav.Link>
            )}
          </Nav>
        </Navbar.Collapse>
      </Container>
    </Navbar>
  );
}
