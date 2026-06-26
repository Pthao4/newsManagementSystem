package com.newsManagementSystem.service.impl;

import com.newsManagementSystem.dto.CommentRequest;
import com.newsManagementSystem.dto.CommentResponse;
import com.newsManagementSystem.entity.Comment;
import com.newsManagementSystem.entity.NewsArticle;
import com.newsManagementSystem.entity.Notification;
import com.newsManagementSystem.entity.SystemAccount;
import com.newsManagementSystem.repository.CommentRepository;
import com.newsManagementSystem.repository.NewsArticleRepository;
import com.newsManagementSystem.repository.NotificationRepository;
import com.newsManagementSystem.repository.SystemAccountRepository;
import com.newsManagementSystem.service.CommentService;
import lombok.RequiredArgsConstructor;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class CommentServiceImpl implements CommentService {

    private final CommentRepository commentRepository;
    private final NewsArticleRepository newsArticleRepository;
    private final SystemAccountRepository systemAccountRepository;
    private final NotificationRepository notificationRepository;

    @Override
    public List<CommentResponse> getCommentsByArticleId(int articleId) {
        List<Comment> comments = commentRepository.findByNewsArticleIdAndParentCommentIsNullOrderByCreatedDateDesc(articleId);
        return comments.stream().map(this::mapToResponse).collect(Collectors.toList());
    }

    @Override
    public CommentResponse createComment(CommentRequest request) {
        String email = SecurityContextHolder.getContext().getAuthentication().getName();
        SystemAccount account = systemAccountRepository.findByEmail(email).orElseThrow(() -> new RuntimeException("User not found"));
        NewsArticle article = newsArticleRepository.findById(request.getNewsArticleId()).orElseThrow(() -> new RuntimeException("Article not found"));

        Comment parentComment = null;
        if (request.getParentId() != null) {
            Comment requestedParent = commentRepository.findById(request.getParentId())
                    .orElseThrow(() -> new RuntimeException("Parent comment not found"));
            // Enforce 1-level nesting: if the requested parent is already a reply, use its parent instead
            parentComment = (requestedParent.getParentComment() != null) ? requestedParent.getParentComment() : requestedParent;
        }

        Comment comment = Comment.builder()
                .content(request.getContent())
                .createdDate(LocalDateTime.now())
                .modifiedDate(LocalDateTime.now())
                .newsArticle(article)
                .systemAccount(account)
                .parentComment(parentComment)
                .build();

        Comment saved = commentRepository.save(comment);

        // Notification logic for replies
        if (parentComment != null && parentComment.getSystemAccount().getId() != account.getId()) {
            Notification notification = Notification.builder()
                    .message(account.getName() + " vừa trả lời bình luận của bạn.")
                    .isRead(false)
                    .createdDate(LocalDateTime.now())
                    .articleId(article.getId())
                    .systemAccount(parentComment.getSystemAccount())
                    .build();
            notificationRepository.save(notification);
        }

        return mapToResponse(saved);
    }

    @Override
    public CommentResponse updateComment(int id, String content) {
        String email = SecurityContextHolder.getContext().getAuthentication().getName();
        SystemAccount account = systemAccountRepository.findByEmail(email).orElseThrow(() -> new RuntimeException("User not found"));
        
        Comment comment = commentRepository.findById(id).orElseThrow(() -> new RuntimeException("Comment not found"));
        
        // Ensure the user is the author
        if (comment.getSystemAccount().getId() != account.getId() && !account.getRole().name().equals("ADMIN")) {
            throw new RuntimeException("Not authorized to update this comment");
        }

        comment.setContent(content);
        comment.setModifiedDate(LocalDateTime.now());
        Comment saved = commentRepository.save(comment);
        return mapToResponse(saved);
    }

    @Override
    public void deleteComment(int id) {
        String email = SecurityContextHolder.getContext().getAuthentication().getName();
        SystemAccount account = systemAccountRepository.findByEmail(email).orElseThrow(() -> new RuntimeException("User not found"));
        
        Comment comment = commentRepository.findById(id).orElseThrow(() -> new RuntimeException("Comment not found"));
        
        // Ensure the user is the author or admin
        if (comment.getSystemAccount().getId() != account.getId() && !account.getRole().name().equals("ADMIN")) {
            throw new RuntimeException("Not authorized to delete this comment");
        }

        commentRepository.delete(comment);
    }

    private CommentResponse mapToResponse(Comment comment) {
        List<CommentResponse> mappedReplies = null;
        if (comment.getReplies() != null) {
            mappedReplies = comment.getReplies().stream()
                    .map(reply -> CommentResponse.builder()
                            .id(reply.getId())
                            .newsArticleId(reply.getNewsArticle().getId())
                            .content(reply.getContent())
                            .createdDate(reply.getCreatedDate())
                            .modifiedDate(reply.getModifiedDate())
                            .authorId(reply.getSystemAccount().getId())
                            .authorName(reply.getSystemAccount().getName())
                            .authorAvatar(reply.getSystemAccount().getAvatar())
                            .authorEmail(reply.getSystemAccount().getEmail())
                            .build() // Replies won't have replies mapped to prevent infinite loops (since it's 1-level anyway)
                    )
                    .collect(Collectors.toList());
        }

        return CommentResponse.builder()
                .id(comment.getId())
                .newsArticleId(comment.getNewsArticle().getId())
                .content(comment.getContent())
                .createdDate(comment.getCreatedDate())
                .modifiedDate(comment.getModifiedDate())
                .authorId(comment.getSystemAccount().getId())
                .authorName(comment.getSystemAccount().getName())
                .authorAvatar(comment.getSystemAccount().getAvatar())
                .authorEmail(comment.getSystemAccount().getEmail())
                .replies(mappedReplies)
                .build();
    }
}
