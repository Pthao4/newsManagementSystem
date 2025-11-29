package com.newsManagementSystem.service;

import com.newsManagementSystem.dto.TagDTO;

import java.util.List;

public interface TagService {
    List<TagDTO> getAllTags();
    TagDTO getTagById(int id);
    TagDTO saveTag(TagDTO tag);
}
