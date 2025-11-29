import { newsArticleAPI } from "../api/newsArticleAPI";
import { useState, useEffect } from "react";
// import TableFormatter from "../components/common/TableFormat";
import { useNavigate } from "react-router-dom";
import { Table, Badge, Row, Button } from "react-bootstrap";
import { formatDate } from "../untils/format";

export default function NewsPage() {
  const [data, setData] = useState([]);
  const navigate = useNavigate();

  async function fetchData() {
    const result = await newsArticleAPI.getNewsArticles();
    setData(result);
    console.log("News articles data:", result);
  }

  useEffect(() => {
    fetchData();
  }, []);

  const handleAdd = () => {
    navigate("/newsArticles/add");
  };

  const handleEdit = (id) => {
    navigate(`/newsArticles/edit/${id}`);
  };
 
  const handleDelete = async (id) => {
    // Gọi API xóa bài viết theo ID
    try {
      const response = await newsArticleAPI.deleteNewsArticle(id);
      console.log("Delete response:", response);
      fetchData(); // Tải lại dữ liệu sau khi xóa
    } catch (error) {
      console.error("Error deleting news article:", error);
    }
  }
  return (
    <>
      <h2 className="mb-4">News Articles</h2>
      <div className="d-flex justify-content-end">
        <Button variant="primary" className="mb-3" onClick={()=>{handleAdd()}}>Add News Article</Button>
      </div>
      {/* <TableFormatter
        columns={columns}
        data={data}
        action={{ handleEdit, handleIsActive }}
      /> */}

      <Table striped bordered hover responsive>
      <thead className="table-light text-center align-middle">
        <tr>
          <th>Title</th>
          <th>Tags</th>
          <th>Status</th>
          <th>Category Name</th>
          <th>Created By</th>
          <th>Modified Date</th>
          <th>Actions</th>
        </tr>
      </thead>

      <tbody>
        {data.length > 0 ? (
          data.map((article, index) => (
            <tr key={index} className="align-middle">
              <td>{article.title}</td>
              <td>
                {article.newsTagNames?.length
                  ? article.newsTagNames.join(", ")
                  : "-"}
              </td>
              <td className="text-center">
                <Badge bg={article.status ? "success" : "secondary"}>
                  {article.status ? "Active" : "Inactive"}
                </Badge>
              </td>
              <td>{article.categoryName}</td>
              <td>{article.createdByName}</td>
              <td className="text-center">
                {article.modifiedDate
                  ? formatDate(new Date(article.modifiedDate).toLocaleString())
                  : "N/A"}
              </td>
              <td>
                
                  <Button
                    variant="info"
                    size="sm"
                    className="text-white m-1"
                    onClick={() => handleEdit(article.id)}
                  >
                    Edit
                  </Button>
                  <Button
                    variant="danger"
                    size="sm"
                    className="text-white m-1"
                    onClick={() => handleDelete(article.id)}
                  >
                    Delete
                  </Button>
                
              </td>
            </tr>
          ))
        ) : (
          <tr>
            <td colSpan="12" className="text-center py-3 text-muted">
              No data available
            </td>
          </tr>
        )}
      </tbody>
    </Table>
    </>
  );
}
