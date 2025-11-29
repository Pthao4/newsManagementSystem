package com.newsManagementSystem.mapper;

import com.newsManagementSystem.dto.NewsArticleResponse;
import com.newsManagementSystem.dto.NewsArticleRequest;
import com.newsManagementSystem.entity.NewsArticle;
import com.newsManagementSystem.repository.CategoryRepository;
import com.newsManagementSystem.repository.SystemAccountRepository;
import com.newsManagementSystem.repository.TagRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Component;

import java.util.Optional;
import java.util.stream.Collectors;

@Component
@RequiredArgsConstructor
public class NewsArticleMapper {

    private final CategoryRepository categoryRepository;
    private final SystemAccountRepository systemAccountRepository;
    private final TagRepository tagRepository;

    public NewsArticleRequest entityToRequest(NewsArticle entity) {
        NewsArticleRequest request = new NewsArticleRequest();
        request.setId(entity.getId());
        request.setTitle(entity.getTitle());
        request.setHeadline(entity.getHeadline());
        request.setSource(entity.getSource());
        request.setModifiedDate(entity.getModifiedDate());
        request.setCreatedDate(entity.getCreatedDate());
        request.setStatus(entity.isStatus());
        request.setContent(entity.getContent());
        request.setNewsTagIDs(entity.getNewsTag().stream().map(tag -> tag.getId()).collect(Collectors.toList()));
        request.setCategoryId(entity.getCategory().getId());
        request.setCreatedBy(entity.getCreatedBy().getId());
        request.setUpdatedBy(entity.getUpdatedBy().getId());
        return request;
    }

    public NewsArticle requestToEntity(NewsArticleRequest request) {
        NewsArticle entity = new NewsArticle();
        entity.setId(request.getId());
        entity.setTitle(request.getTitle());
        entity.setHeadline(request.getHeadline());
        entity.setSource(request.getSource());
        entity.setContent(request.getContent());
        entity.setModifiedDate(request.getModifiedDate());
        entity.setCreatedDate(request.getCreatedDate());
        entity.setStatus(request.isStatus());

        if (request.getNewsTagIDs() != null) {
            entity.setNewsTag(
                    request.getNewsTagIDs()
                            .stream()
                            .map(tagRepository::findById)
                            .filter(Optional::isPresent)
                            .map(Optional::get)
                            .collect(Collectors.toList())
            );
        }

        if (request.getCategoryId() != null) {
            entity.setCategory(
                    categoryRepository.findById(request.getCategoryId()) // ✅ đúng
                            .orElse(null)
            );
        }

        if (request.getCreatedBy() != null) {
            entity.setCreatedBy(
                    systemAccountRepository.findById(request.getCreatedBy()) // ✅ đúng
                            .orElse(null)
            );
        }

        if (request.getUpdatedBy() != null) {
            entity.setUpdatedBy(
                    systemAccountRepository.findById(request.getUpdatedBy()) // ✅ đúng
                            .orElse(null)
            );
        }

        return entity;
    }


    public NewsArticleResponse entityToResponse(NewsArticle entity){
        NewsArticleResponse response = new NewsArticleResponse();
        response.setId(entity.getId());
        response.setTitle(entity.getTitle());
        response.setHeadline(entity.getHeadline());
        response.setSource(entity.getSource());
        response.setContent(entity.getContent());
        response.setModifiedDate(entity.getModifiedDate());
        response.setCreatedDate(entity.getCreatedDate());
        response.setStatus(entity.isStatus());

        if(entity.getNewsTag() != null) {
            response.setNewsTagIDs(entity.getNewsTag().stream().map(tag -> tag.getId()).collect(Collectors.toList()));
            response.setNewsTagNames(entity.getNewsTag().stream().map(tag -> tag.getName()).collect(Collectors.toList()));
        }

        if(entity.getCategory() != null) {
            response.setCategoryName(entity.getCategory().getName());
            response.setCategoryId(entity.getCategory().getId());
        }

        if(entity.getCreatedBy() != null) {
            response.setCreatedByName(entity.getCreatedBy().getName());
        }

        if(entity.getUpdatedBy() != null) {
            response.setUpdatedByName(entity.getUpdatedBy().getName());
        }

        return response;
    }


}
