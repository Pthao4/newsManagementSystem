package com.newsManagementSystem.service.impl;

import com.newsManagementSystem.dto.TagDTO;
import com.newsManagementSystem.entity.Tag;
import com.newsManagementSystem.mapper.TagMapper;
import com.newsManagementSystem.repository.TagRepository;
import com.newsManagementSystem.service.TagService;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.ArrayList;
import java.util.List;
import java.util.Map;
import java.util.Set;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class TagServiceImpl implements TagService {
    private final TagRepository tagRepository;
    private final TagMapper tagMapper;

    @Override
    public List<TagDTO> getAllTags() {
        List<Tag> tags = tagRepository.findAll();
        return tags.stream().map(tagMapper::toDto).toList();
    }

    @Override
    public TagDTO getTagById(int id) {
        Tag tag = tagRepository.findById(id).orElse(null);
        return tagMapper.toDto(tag);
    }

    @Override
    public TagDTO saveTag(TagDTO tag) {
        Tag saved = tagRepository.save(tagMapper.toEntity(tag));
        return tagMapper.toDto(saved);
    }

    @Override
    public List<TagDTO> searchTags(String keyword) {
        if (keyword == null || keyword.isBlank()) {
            return new ArrayList<>();
        }
        return tagRepository.findByNameContainingIgnoreCase(keyword.trim())
                .stream()
                .map(tagMapper::toDto)
                .toList();
    }

    @Override
    @Transactional
    public List<Tag> findOrCreateTags(List<String> tagNames) {
        if (tagNames == null || tagNames.isEmpty()) {
            return new ArrayList<>();
        }

        // 1. Chuẩn hoá & lọc trùng lặp phía client input
        Set<String> uniqueNames = tagNames.stream()
                .filter(name -> name != null && !name.isBlank())
                .map(String::trim)
                .collect(Collectors.toSet());

        if (uniqueNames.isEmpty()) {
            return new ArrayList<>();
        }

        // 2. Bulk Fetch: Lấy tất cả tag hiện có trong 1 query
        List<Tag> existingTags = tagRepository.findByNameInIgnoreCase(uniqueNames);
        
        // Tạo map để tra cứu nhanh (case-insensitive key)
        Map<String, Tag> tagMap = existingTags.stream()
                .collect(Collectors.toMap(
                        tag -> tag.getName().toLowerCase(),
                        tag -> tag,
                        (existing, replacement) -> existing // Giữ cái đầu tiên nếu có trùng trong DB (hiếm)
                ));

        List<Tag> result = new ArrayList<>();
        List<Tag> newTagsToSave = new ArrayList<>();

        for (String name : uniqueNames) {
            Tag tag = tagMap.get(name.toLowerCase());
            if (tag != null) {
                result.add(tag);
            } else {
                // 3. Tạo mới nếu chưa có
                Tag newTag = Tag.builder()
                        .name(name)
                        .build();
                newTagsToSave.add(newTag);
            }
        }

        if (!newTagsToSave.isEmpty()) {
            List<Tag> savedNewTags = tagRepository.saveAll(newTagsToSave);
            result.addAll(savedNewTags);
        }

        return result;
    }
}
