package com.newsManagementSystem.mapper;

import com.newsManagementSystem.dto.CategoryDTO;
import com.newsManagementSystem.entity.Category;
import org.springframework.stereotype.Component;

@Component
public class CategoryMapper {
    public CategoryDTO toDTO(Category category) {
        if (category == null) {
            return null;
        }
        return CategoryDTO.builder()
                .id(category.getId())
                .name(category.getName())
                .parent(category.getParent()!=null ? category.getParent().getId() : null)
                .parentName(category.getParent()!=null ? category.getParent().getName() : null)
                .description(category.getDescription())
                .isActive(category.isActive())
                .build();
    }

    public Category toEntity(CategoryDTO dto) {
        if (dto == null) return null;

        Category parent = null;
        if (dto.getParent() != null) {  // parentId != null
            parent = new Category();
            parent.setId(dto.getParent()); // chỉ gán ID
        }

        if (dto.getId() != null) {
            return Category.builder()
                    .id(dto.getId())
                    .name(dto.getName())
                    .description(dto.getDescription())
                    .parent(parent)
                    .isActive(dto.isActive())
                    .build();
        }

        return Category.builder()
                .name(dto.getName())
                .description(dto.getDescription())
                .parent(parent)
                .isActive(dto.isActive())
                .build();
    }

}
