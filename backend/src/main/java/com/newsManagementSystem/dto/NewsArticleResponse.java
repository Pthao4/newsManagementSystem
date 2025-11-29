package com.newsManagementSystem.dto;


import lombok.*;

import java.time.LocalDateTime;
import java.util.List;


@AllArgsConstructor
@NoArgsConstructor
@Getter
@Setter
@Builder
public class NewsArticleResponse {
    private int id;
    private String title;
    private String headline;
    private String content;
    private String source;
    private List<Integer> newsTagIDs;
    private List<String> newsTagNames;
    private boolean status;
    private String categoryName;
    private Integer categoryId;
    private String createdByName;
    private String updatedByName;
    private LocalDateTime modifiedDate;
    private LocalDateTime createdDate;

}
