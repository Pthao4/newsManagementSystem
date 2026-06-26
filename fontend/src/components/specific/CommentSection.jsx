import { useState, useEffect } from "react";
import { commentAPI } from "../../api/commentAPI";
import { useAuth } from "../../context/useAuth";
import { Button, Form, Card, Spinner } from "react-bootstrap";
import { formatDate } from "../../untils/format";

const CommentItem = ({ comment, user, isReply = false, parentId = null, onEdit, onDelete, onReply }) => {
  const [isEditing, setIsEditing] = useState(false);
  const [editContent, setEditContent] = useState(comment.content);
  const [isReplying, setIsReplying] = useState(false);
  const [replyContent, setReplyContent] = useState("");
  const [submittingReply, setSubmittingReply] = useState(false);

  const handleSaveEdit = async () => {
    if (!editContent.trim()) return;
    await onEdit(comment.id, editContent, parentId);
    setIsEditing(false);
  };

  const handleReplySubmit = async (e) => {
    e.preventDefault();
    if (!replyContent.trim()) return;
    setSubmittingReply(true);
    await onReply(comment.id, replyContent);
    setReplyContent("");
    setIsReplying(false);
    setSubmittingReply(false);
  };

  return (
    <Card className={`border-0 shadow-sm ${isReply ? "mt-3 ms-5 bg-light" : ""}`}>
      <Card.Body className={isReply ? "p-3" : ""}>
        <div className="d-flex align-items-center justify-content-between mb-2">
          <div className="d-flex align-items-center gap-2">
            <img
              src={
                comment.authorAvatar ||
                `https://ui-avatars.com/api/?name=${encodeURIComponent(
                  comment.authorName || "U"
                )}&background=random`
              }
              alt="avatar"
              className="rounded-circle object-fit-cover"
              style={{ width: isReply ? "28px" : "32px", height: isReply ? "28px" : "32px" }}
            />
            <div>
              <span className="fw-semibold d-block" style={{ fontSize: "0.9rem" }}>
                {comment.authorName}
              </span>
              <span className="text-muted" style={{ fontSize: "0.75rem" }}>
                {formatDate(comment.createdDate)}
                {comment.modifiedDate !== comment.createdDate && " (Edited)"}
              </span>
            </div>
          </div>

          {user && (
            <div className="d-flex gap-2">
              {!isReply && (
                <Button
                  variant="link"
                  className="text-primary p-0 text-decoration-none small"
                  onClick={() => setIsReplying(!isReplying)}
                >
                  Reply
                </Button>
              )}
              {(user.sub === comment.authorEmail || user.role === "ROLE_ADMIN") && (
                <>
                  <Button
                    variant="link"
                    className="text-muted p-0 text-decoration-none small ms-2"
                    onClick={() => setIsEditing(!isEditing)}
                  >
                    Edit
                  </Button>
                  <Button
                    variant="link"
                    className="text-danger p-0 text-decoration-none small ms-2"
                    onClick={() => {
                      if (window.confirm("Are you sure you want to delete this comment?")) {
                        onDelete(comment.id, parentId);
                      }
                    }}
                  >
                    Delete
                  </Button>
                </>
              )}
            </div>
          )}
        </div>

        {isEditing ? (
          <div>
            <Form.Control
              as="textarea"
              rows={2}
              value={editContent}
              onChange={(e) => setEditContent(e.target.value)}
              className="mb-2"
            />
            <div className="d-flex justify-content-end gap-2">
              <Button variant="secondary" size="sm" onClick={() => setIsEditing(false)}>
                Cancel
              </Button>
              <Button variant="primary" size="sm" onClick={handleSaveEdit} disabled={!editContent.trim()}>
                Save
              </Button>
            </div>
          </div>
        ) : (
          <Card.Text className="mb-0 text-dark" style={{ whiteSpace: "pre-wrap", fontSize: isReply ? "0.9rem" : "1rem" }}>
            {comment.content}
          </Card.Text>
        )}

        {isReplying && (
          <Form onSubmit={handleReplySubmit} className="mt-3">
            <Form.Group className="mb-2">
              <Form.Control
                as="textarea"
                rows={2}
                placeholder="Write a reply..."
                value={replyContent}
                onChange={(e) => setReplyContent(e.target.value)}
                disabled={submittingReply}
                autoFocus
              />
            </Form.Group>
            <div className="d-flex justify-content-end gap-2">
              <Button variant="secondary" size="sm" onClick={() => setIsReplying(false)}>
                Cancel
              </Button>
              <Button variant="primary" size="sm" type="submit" disabled={submittingReply || !replyContent.trim()}>
                {submittingReply ? "Posting..." : "Reply"}
              </Button>
            </div>
          </Form>
        )}

        {/* Render Replies (1-level nesting) */}
        {!isReply && comment.replies && comment.replies.length > 0 && (
          <div className="mt-2">
            {comment.replies.map(reply => (
              <CommentItem 
                key={reply.id} 
                comment={reply} 
                user={user} 
                isReply={true} 
                parentId={comment.id}
                onEdit={onEdit} 
                onDelete={onDelete} 
                onReply={onReply}
              />
            ))}
          </div>
        )}
      </Card.Body>
    </Card>
  );
};

export default function CommentSection({ articleId }) {
  const { user } = useAuth();
  const [comments, setComments] = useState([]);
  const [pendingComments, setPendingComments] = useState([]);
  const [hasNewComments, setHasNewComments] = useState(false);
  const [loading, setLoading] = useState(true);
  const [newComment, setNewComment] = useState("");
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    fetchComments();

    const handleReload = () => {
      fetchComments();
    };

    window.addEventListener("reloadComments", handleReload);
    return () => window.removeEventListener("reloadComments", handleReload);
  }, [articleId]);

  const fetchComments = async () => {
    setLoading(true);
    try {
      const data = await commentAPI.getCommentsByArticle(articleId);
      setComments(data);
      setHasNewComments(false);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  // Polling for new comments every 60 seconds, only when tab is active
  useEffect(() => {
    let intervalId = null;

    const pollComments = async () => {
      try {
        const data = await commentAPI.getCommentsByArticle(articleId);
        // Check if there's a new top comment or new replies
        if (data.length > 0) {
          const currentTotal = comments.reduce((total, c) => total + 1 + (c.replies?.length || 0), 0);
          const newTotal = data.reduce((total, c) => total + 1 + (c.replies?.length || 0), 0);
          
          const isNewer = comments.length === 0 || data[0].id !== comments[0].id || newTotal > currentTotal;
          if (isNewer && !hasNewComments) {
            setPendingComments(data);
            setHasNewComments(true);
          }
        }
      } catch (err) {
        // silently ignore polling errors
      }
    };

    const handleVisibilityChange = () => {
      if (document.visibilityState === "visible") {
        pollComments();
        intervalId = setInterval(pollComments, 60000);
      } else {
        if (intervalId) clearInterval(intervalId);
      }
    };

    if (document.visibilityState === "visible") {
      intervalId = setInterval(pollComments, 60000);
    }

    document.addEventListener("visibilitychange", handleVisibilityChange);

    return () => {
      if (intervalId) clearInterval(intervalId);
      document.removeEventListener("visibilitychange", handleVisibilityChange);
    };
  }, [articleId, comments, hasNewComments]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!newComment.trim()) return;

    setSubmitting(true);
    try {
      const postedComment = await commentAPI.createComment(articleId, newComment);
      setComments([postedComment, ...comments]);
      setNewComment("");
    } catch (err) {
      console.error("Failed to post comment", err);
    } finally {
      setSubmitting(false);
    }
  };

  const handleEdit = async (commentId, content, parentId) => {
    try {
      const updatedComment = await commentAPI.updateComment(commentId, content);
      setComments(prev => {
        if (!parentId) {
          return prev.map(c => c.id === commentId ? { ...updatedComment, replies: c.replies } : c);
        } else {
          return prev.map(c => {
            if (c.id === parentId) {
              return { ...c, replies: c.replies.map(r => r.id === commentId ? updatedComment : r) };
            }
            return c;
          });
        }
      });
    } catch (err) {
      console.error("Failed to update comment", err);
    }
  };

  const handleDelete = async (commentId, parentId) => {
    try {
      await commentAPI.deleteComment(commentId);
      setComments(prev => {
        if (!parentId) {
          return prev.filter(c => c.id !== commentId);
        } else {
          return prev.map(c => {
            if (c.id === parentId) {
              return { ...c, replies: c.replies.filter(r => r.id !== commentId) };
            }
            return c;
          });
        }
      });
    } catch (err) {
      console.error("Failed to delete comment", err);
    }
  };

  const handleReply = async (parentId, content) => {
    try {
      const postedReply = await commentAPI.createComment(articleId, content, parentId);
      setComments(prev => prev.map(c => {
        if (c.id === parentId) {
          return { ...c, replies: [...(c.replies || []), postedReply] };
        }
        return c;
      }));
    } catch (err) {
      console.error("Failed to post reply", err);
    }
  };

  if (loading) {
    return (
      <div className="text-center py-4">
        <Spinner animation="border" variant="secondary" />
      </div>
    );
  }

  return (
    <div className="mt-5">
      <h5 id="comments-header" className="fw-bold mb-4 border-bottom pb-2">
        Comments ({comments.reduce((total, c) => total + 1 + (c.replies?.length || 0), 0)})
      </h5>

      {user ? (
        <Form onSubmit={handleSubmit} className="mb-4">
          <Form.Group className="mb-2">
            <Form.Control
              as="textarea"
              rows={3}
              placeholder="Write a comment..."
              value={newComment}
              onChange={(e) => setNewComment(e.target.value)}
              disabled={submitting}
            />
          </Form.Group>
          <div className="d-flex justify-content-end">
            <Button
              variant="primary"
              type="submit"
              disabled={submitting || !newComment.trim()}
            >
              {submitting ? "Posting..." : "Post Comment"}
            </Button>
          </div>
        </Form>
      ) : (
        <div className="alert alert-secondary text-center">
          Please <a href="/login">log in</a> to post a comment.
        </div>
      )}

      {hasNewComments && (
        <div 
          style={{
            position: "fixed",
            bottom: "30px",
            right: "30px",
            zIndex: 1050,
          }}
        >
          <Button
            variant="primary"
            className="rounded-pill shadow-lg px-4 py-3 fw-bold border-0"
            style={{ backgroundColor: "#0d6efd" }}
            onClick={() => {
              setComments(pendingComments);
              setHasNewComments(false);
              window.scrollTo({
                top: document.getElementById("comments-header")?.offsetTop - 80 || 0,
                behavior: "smooth"
              });
            }}
          >
            Có bình luận mới, bấm để tải ↑
          </Button>
        </div>
      )}

      <div className="d-flex flex-column gap-3">
        {comments.map((comment) => (
          <CommentItem 
            key={comment.id} 
            comment={comment} 
            user={user} 
            onEdit={handleEdit} 
            onDelete={handleDelete} 
            onReply={handleReply} 
          />
        ))}
        
        {comments.length === 0 && (
          <p className="text-center text-muted py-3">No comments yet. Be the first to comment!</p>
        )}
      </div>
    </div>
  );
}
