import { useEffect, useState } from "react";
import { Table, Spinner, Alert, Card, Container } from "react-bootstrap";
import { profileAPI } from "../api/profileAPI ";

export default function HistoryPage() {
  const [articles, setArticles] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchHistory = async () => {
      try {
        const data = await profileAPI.getHistory();
        setArticles(data);
      } catch (err) {
        setError("Failed to load article history: " + err.message);
      } finally {
        setLoading(false);
      }
    };
    fetchHistory();
  }, []);

  return (
    <Container className="mt-5">
      <Card className="shadow-lg border-0 rounded-4 p-4 bg-light-subtle">
        <Card.Body>
          <Card.Title className="fw-bold fs-4 text-center mb-4">
             My Articles History
          </Card.Title>

          {loading && (
            <div className="text-center my-4">
              <Spinner animation="border" /> Loading articles...
            </div>
          )}

          {error && <Alert variant="danger">{error}</Alert>}

          {!loading && !error && (
            <>
              {articles.length === 0 ? (
                <p className="text-muted text-center">You haven’t created any articles yet.</p>
              ) : (
                <Table striped bordered hover responsive className="shadow-sm">
                  <thead className="table-dark text-center">
                    <tr>
                      <th>#</th>
                      <th>Title</th>
                      <th>Category</th>
                      <th>Tags</th>
                      <th>Status</th>
                      <th>Created</th>
                      <th>Updated</th>
                    </tr>
                  </thead>
                  <tbody>
                    {articles.map((a, i) => (
                      <tr key={a.id}>
                        <td className="text-center">{i + 1}</td>
                        <td>{a.title}</td>
                        <td>{a.categoryName || "—"}</td>
                        <td>{a.newsTagNames?.join(", ") || "—"}</td>
                        <td className="text-center">
                          {a.status ? (
                            <span className="badge bg-success">Published</span>
                          ) : (
                            <span className="badge bg-secondary">Draft</span>
                          )}
                        </td>
                        <td>{new Date(a.createdDate).toLocaleString()}</td>
                        <td>{new Date(a.modifiedDate).toLocaleString()}</td>
                      </tr>
                    ))}
                  </tbody>
                </Table>
              )}
            </>
          )}
        </Card.Body>
      </Card>
    </Container>
  );
}
