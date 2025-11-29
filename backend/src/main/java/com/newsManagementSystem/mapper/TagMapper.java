package com.newsManagementSystem.mapper;

import com.newsManagementSystem.dto.TagDTO;
import com.newsManagementSystem.entity.Tag;
import org.springframework.stereotype.Component;

@Component
public class TagMapper {
    public Tag toEntity(TagDTO tag) {
        return Tag.builder()
                .id(tag.getId())
                .name(tag.getName())
                .note(tag.getNote())
                .build();
    }

    public TagDTO toDto(Tag tag) {
        return TagDTO.builder()
                .id(tag.getId())
                .name(tag.getName())
                .note(tag.getNote())
                .build();
    }
}
