package com.newsManagementSystem.dto;


import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;
import java.util.List;

@AllArgsConstructor
@NoArgsConstructor
@Data
@Builder
public class NewsArticleRequest {
    private int id;
    private String title;
    private String headline;
    private String content;
    private String source;
    private List<Integer> newsTagIDs;
    private boolean status;
    private Integer categoryId;
    private Integer createdBy;
    private Integer updatedBy;
    private LocalDateTime createdDate;
    private LocalDateTime modifiedDate;
}
