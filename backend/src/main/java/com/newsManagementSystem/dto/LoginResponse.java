package com.newsManagementSystem.dto;

import com.newsManagementSystem.enums.Role;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@NoArgsConstructor
@AllArgsConstructor
@Data
public class LoginResponse {
    private String token;
    private String email;
    private Role role;
    private String name;
}
