package com.newsManagementSystem.controller;

import com.newsManagementSystem.dto.LoginRequest;
import com.newsManagementSystem.dto.LoginResponse;
import com.newsManagementSystem.dto.SystemAccountDTO;
import com.newsManagementSystem.security.JwtService;
import com.newsManagementSystem.service.SystemAccountService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.BadCredentialsException;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.web.bind.annotation.*;

@RestController
@RequiredArgsConstructor
@RequestMapping("/auth")
public class AuthController {
    private final AuthenticationManager authenticationManager;
    private final JwtService jwtService;
    private final SystemAccountService systemAccountService;
    private final PasswordEncoder passwordEncoder;

    @PostMapping("/login")
    public ResponseEntity<?> login(@RequestBody LoginRequest request) {
        try {
            // Xác thực thông tin đăng nhập
            Authentication authentication = authenticationManager.authenticate(
                    new UsernamePasswordAuthenticationToken(request.getEmail(), request.getPassword())
            );

            // Nếu xác thực thành công → lấy user từ DB
            SystemAccountDTO account = systemAccountService.findByEmail(request.getEmail());

            // Sinh JWT
            String jwt = jwtService.generateToken(account.getEmail(), account.getRole());

            // Xác định role
            String role = account.getRole() == 1 ? "ADMIN" : "STAFF";

            // Trả về token + thông tin user
            LoginResponse response = new LoginResponse(jwt, account.getEmail(), role, account.getName());
            return ResponseEntity.ok(response);

        } catch (BadCredentialsException e) {
            return ResponseEntity.status(401).body("Invalid email or password");
        }
    }

    @PostMapping("/register")
    public ResponseEntity<?> register(@RequestBody SystemAccountDTO newAccount) {
        System.out.println("🔥 Register API called with: " + newAccount.getEmail());
        if (systemAccountService.findByEmail(newAccount.getEmail()) != null) {
            return ResponseEntity.badRequest().body("Email already registered");
        }
        newAccount.setPassword(passwordEncoder.encode(newAccount.getPassword()));
        systemAccountService.addSystemAccount(newAccount);
        return ResponseEntity.ok("Register successful");
    }
}
