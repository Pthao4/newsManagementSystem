package com.newsManagementSystem.service;

import com.newsManagementSystem.dto.CategoryDTO;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;

import java.util.List;

public interface CategoryService {
    public CategoryDTO getCategoryById(Integer id);
    public Page<CategoryDTO> getCategories(Pageable pageable);
    public CategoryDTO saveCategory(CategoryDTO categoryDTO);
    List<CategoryDTO> getAllCategories();
}
