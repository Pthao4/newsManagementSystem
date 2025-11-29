package com.newsManagementSystem.controller;

import com.newsManagementSystem.dto.NewsArticleResponse;
import com.newsManagementSystem.dto.ProfileResponse;
import com.newsManagementSystem.dto.SystemAccountDTO;
import com.newsManagementSystem.service.NewsArticleService;
import com.newsManagementSystem.service.SystemAccountService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequiredArgsConstructor
@RequestMapping("/profile")
public class ProfileController {
    private final SystemAccountService systemAccountService;
    private final NewsArticleService newsArticleService;

    @GetMapping
    public ResponseEntity<?> profile() {
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        String email = authentication.getName();
        SystemAccountDTO account = systemAccountService.findByEmail(email);
        if (account == null) return ResponseEntity.notFound().build();

        ProfileResponse profile = new ProfileResponse();
        profile.setEmail(account.getEmail());
        profile.setName(account.getName());
        return ResponseEntity.ok(profile);
    }

    @PutMapping
    @PreAuthorize("hasRole('STAFF')")
    public ResponseEntity<?> changeProfile(@RequestBody SystemAccountDTO systemAccount) {
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        String currentEmail = authentication.getName();

        SystemAccountDTO existingAccount = systemAccountService.findByEmail(currentEmail);
        if (existingAccount == null) {
            return ResponseEntity.notFound().build();
        }

        if (systemAccount.getName() != null && !systemAccount.getName().isBlank()) {
            existingAccount.setName(systemAccount.getName());
        }

        if (systemAccount.getEmail() != null && !systemAccount.getEmail().isBlank()) {
            String newEmail = systemAccount.getEmail().trim();

            if (!newEmail.equalsIgnoreCase(currentEmail)) {
                SystemAccountDTO otherAccount = systemAccountService.findByEmail(newEmail);
                if (otherAccount != null) {
                    return ResponseEntity
                            .badRequest()
                            .body("Email is already in use");
                }
                existingAccount.setEmail(newEmail);
            }
        }

        systemAccountService.updateSystemAccount(existingAccount);
        return ResponseEntity.ok(existingAccount);
    }

    @GetMapping("/history")
    @PreAuthorize("hasRole('STAFF')") 
    public ResponseEntity<?> getMyArticleHistory() {
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        String email = authentication.getName();
        SystemAccountDTO account = systemAccountService.findByEmail(email);
        List<NewsArticleResponse> articles = newsArticleService.getAllNewsArticleByCreatedBy(account);
        return ResponseEntity.ok(articles);
    }
}
