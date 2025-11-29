import { userAPI } from "../api/userAPI";
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Button, Table, Modal } from "react-bootstrap";

export default function UserPage() {
  const [data, setData] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [modalMessage, setModalMessage] = useState("");
  const navigate = useNavigate();

  const fetchData = async () => {
    try {
      const result = await userAPI.getUsersAPI();
      setData(result);
    } catch (error) {
      console.error("Error loading users:", error);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this user?")) return;
    try {
      const msg = await userAPI.deleteUserAPI(id);
      setModalMessage(msg);
      setShowModal(true);
      // Reload list sau khi xóa
      await fetchData();
    } catch (error) {
      setModalMessage(error.message); // Lấy message từ backend
      setShowModal(true);
    }
  };

  return (
    <>
      <h2 className="mb-4">System Accounts</h2>
      <Button
        variant="primary"
        className="mb-2"
        onClick={() => navigate("/users/add")}
      >
        New Staff Account
      </Button>

      <Table striped bordered hover responsive>
        <thead>
          <tr className="fw-semibold">
            <td>Account Name</td>
            <td>Account Email</td>
            <td>Account Role</td>
            <td className="text-center">Action</td>
          </tr>
        </thead>

        <tbody>
          {data.map((account) => (
            <tr key={account.id}>
              <td>{account.name}</td>
              <td>{account.email}</td>
              <td>{account.role === 1 ? "Admin" : "Staff"}</td>
              <td className="text-center">
                <Button
                  variant="danger"
                  className="fw-semibold text-white"
                  disabled={account.role === 1}
                  onClick={() => {
                     handleDelete(account.id);
                  }}
                >
                  Delete
                </Button>
              </td>
            </tr>
          ))}
        </tbody>
      </Table>

      {/* Modal hiển thị thông báo */}
      <Modal show={showModal} onHide={() => setShowModal(false)} centered>
        <Modal.Header closeButton>
          <Modal.Title >Notification</Modal.Title>
        </Modal.Header>
        <Modal.Body >{modalMessage}</Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setShowModal(false)}>
            Close
          </Button>
        </Modal.Footer>
      </Modal>
    </>
  );
}
