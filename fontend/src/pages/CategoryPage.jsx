import TableFormatter from "../components/common/TableFormat";
import { categoryAPI} from "../api/categoryAPI";
import { useState, useEffect } from "react";
import { Button } from "react-bootstrap";
import { useNavigate } from "react-router-dom";

export default function CategoryPage() {
  
  const [data, setData] = useState([]);
  const navigate = useNavigate();
  useEffect(() => {
    async function fetchData() {
      const result = await categoryAPI.getCategories();
      console.log("Fetched categories:", result);
      setData(result);
    }
    fetchData();
  }, []);

  const negativeAddCategoryForm = () => {
    console.log("Add Category");
    navigate("/categories/add");
  };
  
  const handleEdit = (row) => {
    console.log("Edit category:", row.id);
    navigate(`/categories/edit/${row.id}`);
  }

  const handleIsActive = async (row) => {
    try {
      await categoryAPI.updateCategory(row.id, {
        ...row,
        active: !row.active
      });
    // Sau khi gọi API thành công → gọi lại fetchData()
    const result = await categoryAPI.getCategories();
    setData(result);
  } catch (error) {
    console.error("Failed to toggle active status:", error);
  }
  }

  const columns = [
    // { header: "Category ID", accessor: "id" },
    { header: "Category Name", accessor: "name" },
    { header: "Category Description", accessor: "description" },
    { header: "Parent Name", accessor: "parentName" },
  ];
  return (
    <>
      <h2 className="mb-4">Categories</h2>
      <div className="d-flex justify-content-end">
        <Button variant="primary" className="mb-3" onClick={()=>{negativeAddCategoryForm()}}>Add Category</Button>
      </div>
      <TableFormatter columns={columns} data={data} action={{ handleEdit, handleIsActive }} />
    </>
  );
}
