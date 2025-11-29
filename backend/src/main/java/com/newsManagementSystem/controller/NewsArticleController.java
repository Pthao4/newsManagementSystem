package com.newsManagementSystem.controller;

import com.newsManagementSystem.dto.NewsArticleRequest;
import com.newsManagementSystem.dto.NewsArticleResponse;
import com.newsManagementSystem.service.NewsArticleService;
import jakarta.transaction.Transactional;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("newsArticles")
@RequiredArgsConstructor
public class NewsArticleController {

    private final NewsArticleService newsArticleService;

    @GetMapping()
    public ResponseEntity<List<NewsArticleResponse>> getNewsArticle() {
        List<NewsArticleResponse> list = newsArticleService.getAllNewsArticle();
        return ResponseEntity.ok(list);
    }

    @GetMapping("/{id}")
    @PreAuthorize("hasRole('STAFF')")
    public ResponseEntity<NewsArticleResponse> getNewsArticleById(@PathVariable int id) {
        NewsArticleResponse newsArticleResponse = newsArticleService.getNewsArticleById(id);
        return ResponseEntity.ok(newsArticleResponse);
    }

    @PostMapping
    @Transactional
    @PreAuthorize("hasRole('STAFF')")
    public ResponseEntity<NewsArticleResponse> createNewsArticle(@RequestBody NewsArticleRequest newsArticleRequest) {
        NewsArticleResponse response = newsArticleService.createNewsArticle(newsArticleRequest);
        return ResponseEntity.ok(response);
    }

    @PutMapping("/{id}")
    @Transactional
    @PreAuthorize("hasRole('STAFF')")
    public ResponseEntity<NewsArticleResponse> updateNewsArticle(@PathVariable int id, @RequestBody NewsArticleRequest newsArticleRequest) {
        newsArticleRequest.setId(id);
        NewsArticleResponse response = newsArticleService.updateNewsArticle(newsArticleRequest);
        return ResponseEntity.ok(response);
    }

    @DeleteMapping("/{id}")
    @Transactional
    @PreAuthorize("hasRole('STAFF')")
    public ResponseEntity<NewsArticleResponse> deleteNewsArticle(@PathVariable int id) {
        NewsArticleResponse response = newsArticleService.deleteNewsArticleById(id);
        return ResponseEntity.ok(response);
    }
}
