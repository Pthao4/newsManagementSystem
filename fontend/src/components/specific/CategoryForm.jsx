import { useState, useEffect } from "react";
import { Form, Button } from "react-bootstrap";
import { useNavigate, useParams } from "react-router-dom";
import {categoryAPI } from "../../api/categoryAPI";

const CategoryForm = ({ mode = "add" }) => {
  const { id } = useParams(); // Lấy ID từ URL
  const navigation = useNavigate();
  const [categories, setCategories] = useState([]);
  const [formData, setFormData] = useState({
    name: "",
    description: "",
    parent: null,
    active: true,
  });
  
  const [loading, setLoading] = useState(false);

  // Fetch danh sách categories cho dropdown
  useEffect(() => {
    async function fetchCategories() {
      try {
        const result = await categoryAPI.getCategories();
        console.log("Fetched categories for dropdown:", result);
        setCategories(result);
      } catch (error) {
        console.error("Failed to fetch categories:", error);
      }
    }
    fetchCategories();
  }, []);

  // Nếu là edit mode, fetch dữ liệu category theo ID
  useEffect(() => {
    if (mode === "edit" && id) {
      setLoading(true);
      const fetchCategoryData = async () => {
        try {
          const existingCategory = await categoryAPI.getCategoryById(id);
          setFormData({
            name: existingCategory.name || "",
            description: existingCategory.description || "",
            parent: existingCategory.parent || null,
            active: existingCategory.active !== undefined ? existingCategory.active : true,
          });
        } catch (error) {
          console.error("Failed to fetch category:", error);
        } finally {
          setLoading(false);
        }
      };
      fetchCategoryData();
    }
  }, [mode, id]);

  const handleChange = (e) => {
    const { name, value, checked } = e.target;

  if (name === "active") {
    setFormData({ ...formData, active: checked });
  } else if (name === "parent") {
    // đảm bảo null nếu không chọn gì
    setFormData({ ...formData, parent: value === "" ? null : value });
  } else {
    setFormData({ ...formData, [name]: value });
  }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (mode === "add") {
      console.log("Adding category:", formData);
      // Gọi API để thêm category
      categoryAPI.createCategory(formData)
        .then((response) => {
          console.log("Category added successfully:", response);
        })
        .catch((error) => {
          console.error("Failed to add category:", error);
        });
    } else if (mode === "edit") {
      console.log("Updating category ID", id, "with data:", formData);
      // Gọi API để cập nhật category
      categoryAPI.updateCategory(id, formData)
        .then((response) => {
          console.log("Category updated successfully:", response);
        })
        .catch((error) => {
          console.error("Failed to update category:", error);
        });
    }
    backToList();
  };

  const backToList = () => {
    navigation("/categories");
  };

  if (loading) {
    return <div>Loading category data...</div>;
  }

  return (
    <div>
      <h2 className="mb-4">{mode === "add" ? "Add Category" : "Edit Category"}</h2>
      <Form onSubmit={handleSubmit}>
        <Form.Group className="mb-3" controlId="name">
          <Form.Label>Category Name</Form.Label>
          <Form.Control
            type="text"
            name="name"
            placeholder="Enter category name"
            value={formData.name}
            onChange={handleChange}
            required
          />
        </Form.Group>
        
        <Form.Group className="mb-3" controlId="description">
          <Form.Label>Category Description</Form.Label>
          <Form.Control
            as="textarea"
            rows={3}
            name="description"
            placeholder="Enter category description"
            value={formData.description}
            onChange={handleChange}
          />
        </Form.Group>
        
        <Form.Group className="mb-3" controlId="ParentCategoryID">
          <Form.Label>Parent Category</Form.Label>
          <Form.Select
            name="parent"
            value={formData.parent || ""}
            onChange={handleChange}
          >
            <option value="">None</option>
            {categories &&
              categories.map((category) => (
                <option key={category.id} value={category.id}>
                  {category.name}
                </option>
              ))}
          </Form.Select>
        </Form.Group>
        
        <Form.Check
          type="switch"
          id="custom-switch"
          name="active"
          label="Is Active"
          checked={formData.active}
          onChange={handleChange}
          className="mb-3"
        />
        <Button variant="secondary" onClick={backToList} className="me-2">Back to List</Button>
        {mode === "edit" && ( <Button variant="warning" type="submit" onClick={handleSubmit} className="me-2">Update Category</Button>)}
        {mode === "add" && ( <Button variant="success" type="submit" onClick={handleSubmit} className="me-2">Add Category</Button>)}
      </Form>
    </div>
  );
};

export default CategoryForm;
