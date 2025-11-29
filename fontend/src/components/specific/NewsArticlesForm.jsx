import { useEffect, useState } from "react";
import { Button, Form, Row, Col, Card } from "react-bootstrap";
import { useNavigate, useParams } from "react-router-dom";
import { newsArticleAPI } from "../../api/newsArticleAPI";
import { categoryAPI } from "../../api/categoryAPI";
import { tagAPI } from "../../api/tagAPI";
import { useForm } from "react-hook-form";

export default function NewsArticlesForm({ mode = "add" }) {
  const { id } = useParams();
  const navigate = useNavigate();
  // const { register, handleSubmit, setValue, reset, formState: { errors } } = useForm();
  const { register, handleSubmit, reset, formState: { errors } } = useForm();


  const [categories, setCategories] = useState([]);
  const [tags, setTags] = useState([]);
  const [loading, setLoading] = useState(true);

  // Fetch categories & tags
  useEffect(() => {
     async function loadOptions() {
      try {
        const cat = await categoryAPI.getCategories();
        const tag = await tagAPI.getTags();
        setCategories(cat);
        setTags(tag);
      } catch (err) {
        console.error("Error loading categories/tags:", err);
      } finally {
        setLoading(false); // <-- xong thì tắt loading
      }
    }
    loadOptions();
  }, []);

  // Nếu là chế độ edit thì fetch dữ liệu bài viết
  useEffect(() => {
    if (mode === "edit" && id) {
      async function loadData() {
        const article = await newsArticleAPI.getNewsArticleById(id);
        console.log("Loaded article for editing:", article);
        reset({
          title: article.title,
          headline: article.headline,
          content: article.content,
          source: article.source,
          status: article.status,
          categoryId: article.categoryId,
          newsTagIDs: article.newsTagIDs.map(String) || [],
        });
      }
      loadData();
    }
  }, [id, mode, reset]);

  // Submit handler
  const onSubmit = async (data) => {
    const payload = {
      title: data.title,
      headline: data.headline,
      content: data.content,
      source: data.source,
      status: data.status || false,
      categoryId: Number(data.categoryId),
      newsTagIDs: data.newsTagIDs ? data.newsTagIDs.map(Number) : [],
    };

    try {
      if (mode === "add") {
        await newsArticleAPI.createNewsArticle(payload);
      } else {
        console.log("Updating article id:", id, "with payload:", payload);
        await newsArticleAPI.updateNewsArticle(id, payload);
      }
      navigate("/newsArticles");
    } catch (err) {
      console.error("Error saving article:", err);
    }
  };

  if(loading){
    return <div>Loading...</div>;
  }

  return (
    <Card className="p-4 shadow rounded-4 border-0">
      <h3 className="mb-4 text-primary fw-bold">
        {mode === "add" ? "Add News Article" : "Edit News Article"}
      </h3>

      <Form onSubmit={handleSubmit(onSubmit)}>
        <Row className="mb-3">
          <Col md={6}>
            <Form.Group>
              <Form.Label>Title</Form.Label>
              <Form.Control
                type="text"
                placeholder="Enter title"
                {...register("title")}
              />
            </Form.Group>
          </Col>
          <Col md={6}>
            <Form.Group>
              <Form.Label>Headline *</Form.Label>
              <Form.Control
                type="text"
                placeholder="Enter headline"
                {...register("headline", { required: "Headline is required" })}
                isInvalid={!!errors.headline}
              />
              <Form.Control.Feedback type="invalid">
                {errors.headline?.message}
              </Form.Control.Feedback>
            </Form.Group>
          </Col>
        </Row>

        <Form.Group className="mb-3">
          <Form.Label>Content *</Form.Label>
          <Form.Control
            as="textarea"
            rows={5}
            placeholder="Enter content"
            {...register("content", { required: "Content is required" })}
            isInvalid={!!errors.content}
          />
          <Form.Control.Feedback type="invalid">
            {errors.content?.message}
          </Form.Control.Feedback>
        </Form.Group>

        <Row className="mb-3">
          <Col md={6}>
            <Form.Group>
              <Form.Label>Source</Form.Label>
              <Form.Control
                type="text"
                placeholder="Enter source"
                {...register("source")}
              />
            </Form.Group>
          </Col>

          <Col md={6}>
            <Form.Group>
              <Form.Label>Category *</Form.Label>
              <Form.Select
                {...register("categoryId", { required: "Category is required" })}
                isInvalid={!!errors.categoryId}
              >
                <option value="">-- Select category --</option>
                {categories.map((cat) => (
                  <option key={cat.id} value={cat.id}>
                    {cat.name}
                  </option>
                ))}
              </Form.Select>
              <Form.Control.Feedback type="invalid">
                {errors.categoryId?.message}
              </Form.Control.Feedback>
            </Form.Group>
          </Col>
        </Row>

        <Form.Group className="mb-3">
          <Form.Label>Tags</Form.Label>
          <Form.Select multiple {...register("newsTagIDs")}>
            {tags.map((tag) => (
              <option key={tag.id} value={tag.id}>
                {tag.name}
              </option>
            ))}
          </Form.Select>
        </Form.Group>

        <Form.Group className="mb-4">
          <Form.Check
            type="checkbox"
            label="Active"
            {...register("status")}
          />
        </Form.Group>

        <div className="d-flex justify-content-end">
          <Button variant="secondary" className="me-2" onClick={() => navigate("/newsArticles")}>
            Cancel
          </Button>
          <Button variant="primary" type="submit">
            {mode === "add" ? "Create" : "Update"}
          </Button>
        </div>
      </Form>
    </Card>
  );
}
