package com.newsManagementSystem.service;

import com.newsManagementSystem.dto.TagDTO;
import com.newsManagementSystem.entity.Tag;

import java.util.List;

public interface TagService {
    List<TagDTO> getAllTags();
    TagDTO getTagById(int id);
    TagDTO saveTag(TagDTO tag);
    List<TagDTO> searchTags(String keyword);
    List<Tag> findOrCreateTags(List<String> tagNames);
}
