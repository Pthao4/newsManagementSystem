import { useState, useEffect, useRef } from "react";
import { Card, Button, Form, Row, Col, Alert, Spinner, Image } from "react-bootstrap";
import { profileAPI } from "../api/profileAPI ";
import axiosClient from "../api/axiosClient";

export default function ProfilePage() {
  const [profile, setProfile] = useState({ name: "", email: "", avatar: "" });
  const [avatarFile, setAvatarFile] = useState(null);
  const [avatarPreview, setAvatarPreview] = useState("");
  const [editMode, setEditMode] = useState(false);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const fileInputRef = useRef(null);

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const data = await profileAPI.getProfile();
        setProfile({
          name: data.name || "",
          email: data.email || "",
          avatar: data.avatar || "",
        });
        setAvatarPreview(data.avatar || "");
      } catch (error) {
        console.error("Error fetching profile:", error);
        setError("Failed to load profile.");
      } finally {
        setLoading(false);
      }
    };
    fetchProfile();
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setProfile((prev) => ({ ...prev, [name]: value }));
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setAvatarFile(file);
      setAvatarPreview(URL.createObjectURL(file));
    }
  };

  const handleSave = async (e) => {
    e.preventDefault();
    setSaving(true);
    setError("");
    setSuccess("");

    try {
      let avatarUrl = profile.avatar;

      // 1. Upload avatar first if a new file is selected
      if (avatarFile) {
        const formData = new FormData();
        formData.append("file", avatarFile);
        const uploadRes = await axiosClient.post("/api/files/upload-avatar", formData, {
          headers: { "Content-Type": "multipart/form-data" },
        });
        avatarUrl = uploadRes.data.url;
      }

      // 2. Update profile
      const updatedProfile = { ...profile, avatar: avatarUrl };
      const updated = await profileAPI.updateProfile(updatedProfile);

      setProfile({
        name: updated.name || "",
        email: updated.email || "",
        avatar: updated.avatar || "",
      });
      setAvatarPreview(updated.avatar || "");
      setAvatarFile(null);
      setEditMode(false);
      setSuccess("Profile updated successfully!");
    } catch (error) {
      console.error("Error updating profile:", error);
      if (error.response?.data) {
        setError(typeof error.response.data === "string" ? error.response.data : "Failed to update profile.");
      } else {
        setError("Failed to update profile.");
      }
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="text-center mt-5">
        <Spinner animation="border" /> Loading profile...
      </div>
    );
  }

  const defaultAvatar = "https://ui-avatars.com/api/?name=" + encodeURIComponent(profile.name || "User") + "&background=random";

  return (
    <div className="d-flex justify-content-center align-items-center mt-5">
      <Card className="shadow-lg border-0 rounded-4 p-4 bg-light-subtle" style={{ width: "650px" }}>
        <Card.Body>
          <Card.Title className="fw-bold text-center mb-4 fs-4 text-dark">My Profile</Card.Title>

          {error && <Alert variant="danger">{error}</Alert>}
          {success && <Alert variant="success">{success}</Alert>}

          <Form onSubmit={handleSave}>
            <Row className="align-items-center">
              {/* Cột trái: Hiển thị Avatar */}
              <Col md={4} className="text-center border-end pe-4">
                <Image
                  src={avatarPreview || defaultAvatar}
                  roundedCircle
                  width={140}
                  height={140}
                  className="object-fit-cover shadow-sm border border-3 border-white mb-3"
                  style={{ cursor: editMode ? "pointer" : "default" }}
                  onClick={() => editMode && fileInputRef.current.click()}
                />
                {editMode && (
                  <div>
                    <Button variant="outline-primary" size="sm" onClick={() => fileInputRef.current.click()}>
                      Choose Avatar
                    </Button>
                    <input
                      type="file"
                      accept="image/*"
                      ref={fileInputRef}
                      style={{ display: "none" }}
                      onChange={handleFileChange}
                    />
                  </div>
                )}
              </Col>

              {/* Cột phải: Form thông tin */}
              <Col md={8} className="ps-4">
                {!editMode ? (
                  <>
                    <h5 className="mb-1 text-primary fw-bold fs-4">{profile.name}</h5>
                    <p className="text-muted mb-4 fs-6">{profile.email}</p>
                    <Button variant="primary" className="px-4 rounded-pill" onClick={() => setEditMode(true)}>
                      Edit Profile
                    </Button>
                  </>
                ) : (
                  <>
                    <Form.Group className="mb-3">
                      <Form.Label className="fw-semibold text-secondary">Full Name</Form.Label>
                      <Form.Control
                        type="text"
                        name="name"
                        value={profile.name}
                        onChange={handleChange}
                        required
                        className="rounded-3"
                      />
                    </Form.Group>

                    <Form.Group className="mb-3">
                      <Form.Label className="fw-semibold text-secondary">Email Address</Form.Label>
                      <Form.Control
                        type="email"
                        name="email"
                        value={profile.email}
                        onChange={handleChange}
                        required
                        className="rounded-3"
                      />
                    </Form.Group>

                    <div className="d-flex justify-content-end gap-2 mt-4">
                      <Button
                        variant="light"
                        className="border rounded-pill px-3"
                        onClick={() => {
                          setEditMode(false);
                          setAvatarPreview(profile.avatar);
                          setAvatarFile(null);
                        }}
                      >
                        Cancel
                      </Button>
                      <Button variant="success" type="submit" disabled={saving} className="rounded-pill px-4 shadow-sm">
                        {saving ? "Saving..." : "Save Changes"}
                      </Button>
                    </div>
                  </>
                )}
              </Col>
            </Row>
          </Form>
        </Card.Body>
      </Card>
    </div>
  );
}
