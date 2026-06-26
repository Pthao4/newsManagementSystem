package com.newsManagementSystem.controller;

import com.newsManagementSystem.dto.NotificationResponse;
import com.newsManagementSystem.entity.Notification;
import com.newsManagementSystem.entity.SystemAccount;
import com.newsManagementSystem.repository.NotificationRepository;
import com.newsManagementSystem.repository.SystemAccountRepository;
import jakarta.transaction.Transactional;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/notifications")
@RequiredArgsConstructor
public class NotificationController {

    private final NotificationRepository notificationRepository;
    private final SystemAccountRepository systemAccountRepository;

    @GetMapping
    @PreAuthorize("hasAnyRole('USER', 'STAFF', 'ADMIN')")
    public ResponseEntity<List<NotificationResponse>> getMyNotifications() {
        String email = SecurityContextHolder.getContext().getAuthentication().getName();
        SystemAccount account = systemAccountRepository.findByEmail(email).orElseThrow(() -> new RuntimeException("User not found"));

        List<Notification> notifications = notificationRepository.findBySystemAccountIdOrderByCreatedDateDesc(account.getId());
        
        List<NotificationResponse> responses = notifications.stream().map(n -> NotificationResponse.builder()
                .id(n.getId())
                .message(n.getMessage())
                .isRead(n.isRead())
                .createdDate(n.getCreatedDate())
                .articleId(n.getArticleId())
                .build()).collect(Collectors.toList());

        return ResponseEntity.ok(responses);
    }

    @PutMapping("/{id}/read")
    @Transactional
    @PreAuthorize("hasAnyRole('USER', 'STAFF', 'ADMIN')")
    public ResponseEntity<Void> markAsRead(@PathVariable int id) {
        String email = SecurityContextHolder.getContext().getAuthentication().getName();
        SystemAccount account = systemAccountRepository.findByEmail(email).orElseThrow(() -> new RuntimeException("User not found"));

        Notification notification = notificationRepository.findById(id).orElseThrow(() -> new RuntimeException("Notification not found"));
        
        if (notification.getSystemAccount().getId() != account.getId()) {
            return ResponseEntity.status(403).build();
        }

        notification.setRead(true);
        notificationRepository.save(notification);

        return ResponseEntity.ok().build();
    }
}
