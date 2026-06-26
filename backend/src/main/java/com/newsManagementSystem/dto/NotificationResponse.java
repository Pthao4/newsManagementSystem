package com.newsManagementSystem.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import com.fasterxml.jackson.annotation.JsonProperty;

import java.time.LocalDateTime;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class NotificationResponse {
    private int id;
    private String message;
    @JsonProperty("isRead")
    private boolean isRead;
    private LocalDateTime createdDate;
    private int articleId;
}
