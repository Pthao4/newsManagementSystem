package com.newsManagementSystem.dto;

import lombok.*;

@AllArgsConstructor
@NoArgsConstructor
@Getter
@Setter
@Builder
public class CategoryDTO {
    private Integer id;
    private String name;
    private String description;
    private Integer parent;
    private String parentName;
    private boolean isActive;
}
