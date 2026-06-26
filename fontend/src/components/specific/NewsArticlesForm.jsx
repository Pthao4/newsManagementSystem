import { useEffect, useState, useRef, useMemo } from "react";
import { Button, Form, Row, Col, Card, ListGroup } from "react-bootstrap";
import { useNavigate, useParams } from "react-router-dom";
import { newsArticleAPI } from "../../api/newsArticleAPI";
import { categoryAPI } from "../../api/categoryAPI";
import { fileAPI } from "../../api/fileAPI";
import { useForm, Controller } from "react-hook-form";
import TagInput from "../common/TagInput";
import ReactQuill from "react-quill-new";
import "react-quill-new/dist/quill.snow.css";
import { FaTrash, FaPaperclip } from "react-icons/fa";

export default function NewsArticlesForm({ mode = "add" }) {
  const { id } = useParams();
  const navigate = useNavigate();
  const { register, handleSubmit, reset, control, formState: { errors } } = useForm({
    defaultValues: {
      newsTagNames: []
    }
  });

  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [attachments, setAttachments] = useState([]);
  const quillRef = useRef(null);

  // Fetch categories
  useEffect(() => {
     async function loadOptions() {
      try {
        const cat = await categoryAPI.getCategories();
        setCategories(cat);
      } catch (err) {
        console.error("Error loading categories:", err);
      } finally {
        setLoading(false);
      }
    }
    loadOptions();
  }, []);

  // Fetch data if edit mode
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
          newsTagNames: article.newsTagNames || [],
        });
        if (article.attachments) {
          setAttachments(article.attachments);
        }
      }
      loadData();
    }
  }, [id, mode, reset]);

  // Image Upload Handler for ReactQuill
  const imageHandler = () => {
    const input = document.createElement("input");
    input.setAttribute("type", "file");
    input.setAttribute("accept", "image/*");
    input.click();

    input.onchange = async () => {
      const file = input.files[0];
      if (file) {
        try {
          const res = await fileAPI.uploadImage(file);
          const url = res.url;
          const quill = quillRef.current.getEditor();
          const range = quill.getSelection(true);
          quill.insertEmbed(range.index, "image", url);
        } catch (error) {
          console.error("Error uploading image:", error);
          alert("Failed to upload image.");
        }
      }
    };
  };

  const modules = useMemo(() => ({
    toolbar: {
      container: [
        [{ header: [1, 2, 3, false] }],
        ["bold", "italic", "underline", "strike"],
        [{ list: "ordered" }, { list: "bullet" }],
        ["link", "image"],
        ["clean"],
      ],
      handlers: {
        image: imageHandler,
      },
    },
  }), []);

  // Attachment Handler
  const handleAttachmentUpload = async (e) => {
    const file = e.target.files[0];
    if (file) {
      try {
        const res = await fileAPI.uploadFile(file);
        setAttachments((prev) => [...prev, {
          fileName: res.fileName,
          url: res.url,
          contentType: res.contentType,
          size: res.size
        }]);
      } catch (error) {
        console.error("Error uploading attachment:", error);
        alert("Failed to upload attachment.");
      }
    }
  };

  const removeAttachment = (index) => {
    setAttachments((prev) => prev.filter((_, i) => i !== index));
  };

  // Submit handler
  const onSubmit = async (data) => {
    const payload = {
      title: data.title,
      headline: data.headline,
      content: data.content,
      source: data.source,
      status: data.status || false,
      categoryId: Number(data.categoryId),
      newsTagNames: data.newsTagNames || [],
      attachments: attachments
    };

    try {
      if (mode === "add") {
        await newsArticleAPI.createNewsArticle(payload);
      } else {
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
          <Controller
            name="content"
            control={control}
            rules={{ required: "Content is required" }}
            render={({ field }) => (
              <ReactQuill
                ref={quillRef}
                theme="snow"
                value={field.value || ""}
                onChange={field.onChange}
                modules={modules}
                style={{ height: "300px", marginBottom: "50px" }}
              />
            )}
          />
          {errors.content && (
            <div className="text-danger mt-1" style={{ fontSize: "0.875em" }}>
              {errors.content.message}
            </div>
          )}
        </Form.Group>

        <Form.Group className="mb-3">
          <Form.Label>Attachments</Form.Label>
          <div className="mb-2">
            <Button as="label" htmlFor="attachment-upload" variant="outline-primary" size="sm">
              <FaPaperclip className="me-2" />
              Upload File (PDF, DOCX, etc.)
            </Button>
            <input
              type="file"
              id="attachment-upload"
              style={{ display: "none" }}
              onChange={handleAttachmentUpload}
              accept=".pdf,.doc,.docx,.xls,.xlsx,.ppt,.pptx"
            />
          </div>
          {attachments.length > 0 && (
            <ListGroup>
              {attachments.map((att, idx) => (
                <ListGroup.Item key={idx} className="d-flex justify-content-between align-items-center">
                  <a href={att.url} target="_blank" rel="noreferrer">{att.fileName}</a>
                  <Button variant="danger" size="sm" onClick={() => removeAttachment(idx)}>
                    <FaTrash />
                  </Button>
                </ListGroup.Item>
              ))}
            </ListGroup>
          )}
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
          <Form.Label>Tags (Press Enter to add new tag)</Form.Label>
          <Controller
            name="newsTagNames"
            control={control}
            render={({ field }) => (
              <TagInput
                value={field.value}
                onChange={field.onChange}
              />
            )}
          />
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
