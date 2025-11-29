package com.newsManagementSystem.repository;

import com.newsManagementSystem.entity.NewsArticle;
import com.newsManagementSystem.entity.SystemAccount;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface NewsArticleRepository extends JpaRepository<NewsArticle, Integer> {
    Optional<NewsArticle> findByTitle(String title);
    List<NewsArticle> findByTitleContainingIgnoreCase(String title);
    boolean existsByCreatedByOrUpdatedBy(SystemAccount creatSystemAccount, SystemAccount updatedSystemAccount);
    List<NewsArticle> findByCreatedBy(SystemAccount creatSystemAccount);
}
