package com.newsManagementSystem.service;


import com.newsManagementSystem.dto.NewsArticleRequest;
import com.newsManagementSystem.dto.NewsArticleResponse;
import com.newsManagementSystem.dto.SystemAccountDTO;

import java.util.List;

public interface NewsArticleService {
    List<NewsArticleResponse> getAllNewsArticle();
    NewsArticleResponse getNewsArticleById(int id);
    NewsArticleResponse getNewsArticleByTitle(String title);
    NewsArticleResponse saveNewsArticle(NewsArticleRequest newsArticleRequest);
    NewsArticleResponse deleteNewsArticleById(int id);
    NewsArticleResponse updateNewsArticle(NewsArticleRequest newsArticleRequest);
    NewsArticleResponse createNewsArticle(NewsArticleRequest newsArticleRequest);;
    boolean existsAriclesDependence(SystemAccountDTO systemAccountDTO);
    List<NewsArticleResponse> getAllNewsArticleByCreatedBy(SystemAccountDTO systemAccountDTO);

}
