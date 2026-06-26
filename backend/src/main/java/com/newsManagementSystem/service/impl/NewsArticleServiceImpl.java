package com.newsManagementSystem.service.impl;

import com.newsManagementSystem.dto.NewsArticleRequest;
import com.newsManagementSystem.dto.NewsArticleResponse;
import com.newsManagementSystem.dto.SystemAccountDTO;
import com.newsManagementSystem.entity.Category;
import com.newsManagementSystem.entity.NewsArticle;
import com.newsManagementSystem.entity.Attachment;
import com.newsManagementSystem.entity.SystemAccount;
import com.newsManagementSystem.entity.Tag;
import com.newsManagementSystem.mapper.NewsArticleMapper;
import com.newsManagementSystem.mapper.SystemAccountMapper;
import com.newsManagementSystem.repository.CategoryRepository;
import com.newsManagementSystem.repository.NewsArticleRepository;
import com.newsManagementSystem.repository.SystemAccountRepository;
import com.newsManagementSystem.repository.TagRepository;
import com.newsManagementSystem.service.NewsArticleService;
import lombok.RequiredArgsConstructor;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Service;

import org.jsoup.Jsoup;
import org.jsoup.safety.Safelist;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class NewsArticleServiceImpl implements NewsArticleService {

    private final NewsArticleRepository newsArticleRepository;
    private final NewsArticleMapper newsArticleMapper;
    private final SystemAccountRepository systemAccountRepository;
    private final CategoryRepository categoryRepository;
    private final TagRepository tagRepository;
    private final SystemAccountMapper systemAccountMapper;
    private final TagServiceImpl tagService;

    @Override
    public List<NewsArticleResponse> getAllNewsArticle() {
        List<NewsArticle> newsArticles = newsArticleRepository.findAll();
        List<NewsArticleResponse> newsArticleResponses = newsArticles.stream().map(newsArticleMapper::entityToResponse).collect(Collectors.toList());
        return newsArticleResponses;
    }

    @Override
    public NewsArticleResponse getNewsArticleById(int id) {
        Optional<NewsArticle> newsArticle = newsArticleRepository.findById(id);
        return newsArticle.map(newsArticleMapper::entityToResponse).orElse(null);
    }

    @Override
    public NewsArticleResponse getNewsArticleByTitle(String title) {
        Optional<NewsArticle> newsArticle = newsArticleRepository.findByTitle(title);
        return newsArticle.map(newsArticleMapper::entityToResponse).orElse(null);
    }

    @Override
    public NewsArticleResponse saveNewsArticle(NewsArticleRequest newsArticleRequest) {
        System.out.println(newsArticleRequest.toString());
        NewsArticle entity = newsArticleMapper.requestToEntity(newsArticleRequest);
        if (entity.getContent() != null) {
            entity.setContent(Jsoup.clean(entity.getContent(), Safelist.relaxed()));
        }
        if (newsArticleRequest.getNewsTagNames() != null) {
            entity.setNewsTag(tagService.findOrCreateTags(newsArticleRequest.getNewsTagNames()));
        }
        NewsArticle saved = newsArticleRepository.save(entity);
        return newsArticleMapper.entityToResponse(saved);
    }

    @Override
    public NewsArticleResponse deleteNewsArticleById(int id) {
        Optional<NewsArticle> newsArticle = newsArticleRepository.findById(id);
        newsArticleRepository.delete(newsArticle.map(o->o).orElse(null));
        return newsArticle.map(newsArticleMapper::entityToResponse).orElse(null);
    }

    @Override
    public NewsArticleResponse updateNewsArticle(NewsArticleRequest newsArticleRequest) {
        NewsArticle existing = newsArticleRepository.findById(newsArticleRequest.getId()).orElse(null);
        System.out.println("Bắt đầu update");
        existing.setTitle(newsArticleRequest.getTitle());
        existing.setHeadline(newsArticleRequest.getHeadline());
        if (newsArticleRequest.getContent() != null) {
            existing.setContent(Jsoup.clean(newsArticleRequest.getContent(), Safelist.relaxed()));
        } else {
            existing.setContent(null);
        }
        existing.setSource(newsArticleRequest.getSource());
        existing.setStatus(newsArticleRequest.isStatus());
        existing.setModifiedDate(LocalDateTime.now());
        
        if (newsArticleRequest.getAttachments() != null) {
            if (existing.getAttachments() != null) {
                existing.getAttachments().clear();
            }
            List<Attachment> newAttachments = newsArticleRequest.getAttachments().stream().map(dto -> {
                Attachment att = new Attachment();
                att.setId(dto.getId());
                att.setFileName(dto.getFileName());
                att.setContentType(dto.getContentType());
                att.setSize(dto.getSize());
                att.setUrl(dto.getUrl());
                att.setNewsArticle(existing);
                return att;
            }).collect(Collectors.toList());
            if (existing.getAttachments() == null) {
                existing.setAttachments(newAttachments);
            } else {
                existing.getAttachments().addAll(newAttachments);
            }
        } else if (existing.getAttachments() != null) {
            existing.getAttachments().clear();
        }

        // ✅ Cập nhật category nếu có
        if (newsArticleRequest.getCategoryId() != null) {
            Category category = categoryRepository.findById(newsArticleRequest.getCategoryId())
                    .orElseThrow(() -> new RuntimeException("Category not found"));
            existing.setCategory(category);
        }

        // ✅ Lấy user hiện tại từ token (updatedBy)
        String email = SecurityContextHolder.getContext().getAuthentication().getName();
        SystemAccount updatedBy = systemAccountRepository.findByEmail(email).get();
        existing.setUpdatedBy(updatedBy);

        System.out.println("Cập nhật danh sách Tag");
        if (newsArticleRequest.getNewsTagNames() != null) {
            List<Tag> updatedTags = tagService.findOrCreateTags(newsArticleRequest.getNewsTagNames());
            existing.setNewsTag(updatedTags);
        } else if (newsArticleRequest.getNewsTagIDs() != null) {
            List<Tag> updatedTags = newsArticleRequest.getNewsTagIDs().stream()
                    .map(tagRepository::findById)
                    .filter(Optional::isPresent)
                    .map(Optional::get)
                    .collect(Collectors.toList());

            existing.setNewsTag(updatedTags);
        }

        System.out.println("Sau update tag");
        NewsArticle saved = newsArticleRepository.save(existing);

        return newsArticleMapper.entityToResponse(saved);
    }

    @Override
    public NewsArticleResponse createNewsArticle(NewsArticleRequest newsArticleRequest) {
        String email = SecurityContextHolder.getContext().getAuthentication().getName();
        System.out.println(email);
        newsArticleRequest.setCreatedBy(systemAccountRepository.findByEmail(email).get().getId());
        newsArticleRequest.setUpdatedBy(systemAccountRepository.findByEmail(email).get().getId());
        newsArticleRequest.setCreatedDate(LocalDateTime.now());
        newsArticleRequest.setModifiedDate(LocalDateTime.now());
        return saveNewsArticle(newsArticleRequest);
    }

    @Override
    public boolean existsAriclesDependence(SystemAccountDTO systemAccountDTO) {
        SystemAccount systemAccount = systemAccountMapper.toEntity(systemAccountDTO);
        return newsArticleRepository.existsByCreatedByOrUpdatedBy(systemAccount, systemAccount);
    }

    @Override
    public List<NewsArticleResponse> getAllNewsArticleByCreatedBy(SystemAccountDTO systemAccountDTO) {
        SystemAccount systemAccount = systemAccountMapper.toEntity(systemAccountDTO);
        List<NewsArticle> list = newsArticleRepository.findByCreatedBy(systemAccount);
        return list.stream().map(newsArticleMapper::entityToResponse).collect(Collectors.toList());
    }

}
