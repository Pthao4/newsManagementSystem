package com.newsManagementSystem.dto;

import lombok.*;

@NoArgsConstructor
@AllArgsConstructor
@Getter
@Setter
@Builder
public class TagDTO {
    private int id;
    private String name;
    private String note;
}
