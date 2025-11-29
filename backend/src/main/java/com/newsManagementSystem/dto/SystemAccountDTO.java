package com.newsManagementSystem.dto;

import lombok.*;

@NoArgsConstructor
@AllArgsConstructor
@Data
@Builder
public class SystemAccountDTO {
    private int id;
    private String name;
    private String email;
    private int role;
    private String password;
}
