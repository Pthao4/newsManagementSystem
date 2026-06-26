import { useState } from "react";
import { Button, Card, Form, ListGroup } from "react-bootstrap";
import { fileAPI } from "../api/fileAPI";
import { FaTrash, FaEye } from "react-icons/fa";

export default function MinioTestPage() {
  const [file, setFile] = useState(null);
  const [imageFile, setImageFile] = useState(null);
  const [uploadResult, setUploadResult] = useState(null);
  const [uploadedFiles, setUploadedFiles] = useState([]);

  const handleFileChange = (e) => {
    setFile(e.target.files[0]);
  };

  const handleImageChange = (e) => {
    setImageFile(e.target.files[0]);
  };

  const uploadFile = async () => {
    if (!file) return alert("Please select a file first.");
    try {
      const res = await fileAPI.uploadFile(file);
      setUploadResult(res);
      setUploadedFiles((prev) => [...prev, res]);
      alert("File uploaded successfully!");
    } catch (error) {
      console.error(error);
      alert("Failed to upload file.");
    }
  };

  const uploadImage = async () => {
    if (!imageFile) return alert("Please select an image first.");
    try {
      const res = await fileAPI.uploadImage(imageFile);
      setUploadResult(res);
      setUploadedFiles((prev) => [...prev, res]);
      alert("Image uploaded successfully!");
    } catch (error) {
      console.error(error);
      alert("Failed to upload image.");
    }
  };

  const removeFileFromList = (index) => {
    // Note: This only removes it from UI. Backend delete endpoint not implemented yet.
    setUploadedFiles((prev) => prev.filter((_, i) => i !== index));
  };

  return (
    <div className="container mt-4">
      <Card className="shadow p-4 rounded-4 border-0 mb-4">
        <h3 className="mb-4 text-primary fw-bold">Test Minio Upload</h3>

        <div className="row">
          <div className="col-md-6 mb-3">
            <Form.Group>
              <Form.Label>Upload Any File</Form.Label>
              <Form.Control type="file" onChange={handleFileChange} />
              <Button className="mt-2" variant="primary" onClick={uploadFile}>
                Upload File
              </Button>
            </Form.Group>
          </div>
          <div className="col-md-6 mb-3">
            <Form.Group>
              <Form.Label>Upload Image Only</Form.Label>
              <Form.Control type="file" accept="image/*" onChange={handleImageChange} />
              <Button className="mt-2" variant="success" onClick={uploadImage}>
                Upload Image
              </Button>
            </Form.Group>
          </div>
        </div>

        {uploadResult && (
          <div className="mt-4 p-3 bg-light rounded">
            <h5>Last Upload Result:</h5>
            <pre>{JSON.stringify(uploadResult, null, 2)}</pre>
          </div>
        )}
      </Card>

      <Card className="shadow p-4 rounded-4 border-0">
        <h4 className="mb-3">Uploaded Files (Session)</h4>
        {uploadedFiles.length === 0 ? (
          <p className="text-muted">No files uploaded yet.</p>
        ) : (
          <ListGroup>
            {uploadedFiles.map((item, idx) => (
              <ListGroup.Item key={idx} className="d-flex justify-content-between align-items-center">
                <div>
                  <strong>{item.fileName}</strong> <br />
                  <small className="text-muted">{item.url}</small>
                </div>
                <div>
                  <Button variant="info" size="sm" className="me-2" onClick={() => window.open(item.url, "_blank")}>
                    <FaEye /> View
                  </Button>
                  <Button variant="danger" size="sm" onClick={() => removeFileFromList(idx)}>
                    <FaTrash />
                  </Button>
                </div>
              </ListGroup.Item>
            ))}
          </ListGroup>
        )}
      </Card>
    </div>
  );
}
