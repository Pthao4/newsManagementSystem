package com.newsManagementSystem.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;
import java.util.List;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class CommentResponse {
    private int id;
    private int newsArticleId;
    private String content;
    private LocalDateTime createdDate;
    private LocalDateTime modifiedDate;
    private int authorId;
    private String authorName;
    private String authorAvatar;
    private String authorEmail;
    private List<CommentResponse> replies;
}
