package com.newsManagementSystem.controller;

import com.newsManagementSystem.dto.SystemAccountDTO;
import com.newsManagementSystem.enums.Role;
import com.newsManagementSystem.service.NewsArticleService;
import com.newsManagementSystem.service.SystemAccountService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequiredArgsConstructor
@RequestMapping("/users")
@PreAuthorize("hasRole('ADMIN')")
public class SystemAccountController {

    private final SystemAccountService systemAccountService;
    private final PasswordEncoder passwordEncoder;
    private final NewsArticleService newsArticleService;

    @GetMapping
    public ResponseEntity<List<SystemAccountDTO>> getSystemAccount() {
        List<SystemAccountDTO> list = systemAccountService.getSystemAccounts();
        return ResponseEntity.ok().body(list);
    }

    @PostMapping
    public ResponseEntity<?> createSystemAccount(@RequestBody SystemAccountDTO systemAccountDTO) {
        System.out.println("Create Staff Account wit email: " + systemAccountDTO.getEmail());
        if (systemAccountService.findByEmail(systemAccountDTO.getEmail()) != null) {
            return ResponseEntity.badRequest().body("Email Already Exists");
        }
        systemAccountDTO.setPassword(passwordEncoder.encode(systemAccountDTO.getPassword()));
        systemAccountDTO.setRole(Role.STAFF);
        systemAccountService.addSystemAccount(systemAccountDTO);
        return ResponseEntity.ok().body(systemAccountDTO);
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<String> deleteSystemAccount(@PathVariable Integer id) {
        System.out.println("Delete Staff Account with id: " + id);
        SystemAccountDTO foundedAccount = systemAccountService.findById(id);
        System.out.println("foundedAccount" + foundedAccount);
        if (foundedAccount != null) {
            if(foundedAccount.getRole() == Role.STAFF){
                if(newsArticleService.existsAriclesDependence(foundedAccount)){
                    return ResponseEntity.badRequest().body("Can't delete staff account because there is some article belong this account");
                }else{
                    systemAccountService.deleteSystemAccount(id);
                    return ResponseEntity.ok("Delete Staff Account successfully");
                }
            }else{
                return ResponseEntity.badRequest().body("Can't delete admin account");
            }
        }
        return ResponseEntity.badRequest().body("Account not found");
    }

    @PutMapping("/{id}")
    public ResponseEntity<?> updateSystemAccount(@PathVariable Integer id, @RequestBody SystemAccountDTO systemAccountDTO) {
        SystemAccountDTO existingAccount = systemAccountService.findById(id);
        if (existingAccount == null) {
            return ResponseEntity.badRequest().body("Account not found");
        }
        
        // Cập nhật thông tin (ví dụ: Role)
        existingAccount.setRole(systemAccountDTO.getRole());
        existingAccount.setName(systemAccountDTO.getName());
        // Có thể thêm các trường khác nếu cần

        systemAccountService.updateSystemAccount(existingAccount);
        return ResponseEntity.ok().body(existingAccount);
    }
}
