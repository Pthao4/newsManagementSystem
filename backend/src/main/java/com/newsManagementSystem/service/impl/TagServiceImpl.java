package com.newsManagementSystem.service.impl;

import com.newsManagementSystem.dto.TagDTO;
import com.newsManagementSystem.entity.Tag;
import com.newsManagementSystem.mapper.TagMapper;
import com.newsManagementSystem.repository.TagRepository;
import com.newsManagementSystem.service.TagService;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;

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
}
