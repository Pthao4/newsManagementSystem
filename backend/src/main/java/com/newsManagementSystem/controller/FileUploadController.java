package com.newsManagementSystem.controller;

import com.newsManagementSystem.service.MinioService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.util.HashMap;
import java.util.Map;

@RestController
@RequestMapping("/api/files")
@RequiredArgsConstructor
public class FileUploadController {

    private final MinioService minioService;

    @PostMapping("/upload-image")
    @PreAuthorize("hasAnyRole('STAFF', 'ADMIN')")
    public ResponseEntity<Map<String, Object>> uploadImage(@RequestParam("file") MultipartFile file) {
        String url = minioService.uploadImage(file);
        return buildResponse(file, url);
    }

    @PostMapping("/upload")
    @PreAuthorize("hasAnyRole('STAFF', 'ADMIN')")
    public ResponseEntity<Map<String, Object>> uploadFile(@RequestParam("file") MultipartFile file) {
        String url = minioService.uploadAttachment(file);
        return buildResponse(file, url);
    }

    @PostMapping("/upload-avatar")
    @PreAuthorize("hasAnyRole('USER', 'STAFF', 'ADMIN')")
    public ResponseEntity<Map<String, Object>> uploadAvatar(@RequestParam("file") MultipartFile file) {
        String url = minioService.uploadAvatar(file);
        return buildResponse(file, url);
    }

    private ResponseEntity<Map<String, Object>> buildResponse(MultipartFile file, String url) {
        Map<String, Object> response = new HashMap<>();
        response.put("fileName", file.getOriginalFilename());
        response.put("url", url);
        response.put("contentType", file.getContentType());
        response.put("size", file.getSize());
        return ResponseEntity.ok(response);
    }
}
