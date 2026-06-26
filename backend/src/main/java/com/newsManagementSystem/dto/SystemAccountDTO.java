package com.newsManagementSystem.dto;

import com.newsManagementSystem.enums.Role;
import lombok.*;

@NoArgsConstructor
@AllArgsConstructor
@Data
@Builder
public class SystemAccountDTO {
    private int id;
    private String name;
    private String email;
    private Role role;
    private String password;
    private String avatar;
}
