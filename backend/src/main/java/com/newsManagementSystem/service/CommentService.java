package com.newsManagementSystem.service;

import com.newsManagementSystem.dto.CommentRequest;
import com.newsManagementSystem.dto.CommentResponse;

import java.util.List;

public interface CommentService {
    List<CommentResponse> getCommentsByArticleId(int articleId);
    CommentResponse createComment(CommentRequest request);
    CommentResponse updateComment(int id, String content);
    void deleteComment(int id);
}
