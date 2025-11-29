package com.newsManagementSystem.service.impl;

import com.newsManagementSystem.dto.CategoryDTO;
import com.newsManagementSystem.mapper.CategoryMapper;
import com.newsManagementSystem.repository.CategoryRepository;
import com.newsManagementSystem.service.CategoryService;
import com.newsManagementSystem.entity.Category;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;

import java.util.ArrayList;
import java.util.List;
import java.util.Optional;

@Slf4j
@Service
@RequiredArgsConstructor
public class CategoryServiceImpl implements CategoryService {
    private final CategoryRepository categoryRepository;
    private final CategoryMapper categoryMapper;

    @Override
    public CategoryDTO getCategoryById(Integer id) {
        Optional<Category> category = categoryRepository.findById(id);
        return category.map(categoryMapper::toDTO).orElse(null);
    }

    @Override
    public Page<CategoryDTO> getCategories(Pageable pageable) {
        Page<Category> categories = categoryRepository.findAll(pageable);
        log.info("categories: {}", categories.getContent());
        return categoryRepository.findAll(pageable).map(categoryMapper::toDTO);
    }

    @Override
    public CategoryDTO saveCategory(CategoryDTO categoryDTO) {
        return categoryMapper.toDTO(categoryRepository.save(categoryMapper.toEntity(categoryDTO)));
    }

    @Override
    public List<CategoryDTO> getAllCategories() {
        List<Category> categories = categoryRepository.findAll();
        List<CategoryDTO> categoryDTOS = new ArrayList<>();
        categories.forEach(category -> categoryDTOS.add(categoryMapper.toDTO(category)));
        return categoryDTOS;
    }


}
