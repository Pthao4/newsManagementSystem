package com.newsManagementSystem.controller;

import com.newsManagementSystem.dto.CategoryDTO;
import com.newsManagementSystem.service.CategoryService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/categories")
@RequiredArgsConstructor
public class CategoryController {

    private final CategoryService categoryService;

    @GetMapping
    @PreAuthorize("hasAnyRole('USER', 'STAFF', 'ADMIN')")
    public ResponseEntity<List<CategoryDTO>> getAllCategories() {
        List<CategoryDTO> categories = categoryService.getAllCategories();
        return ResponseEntity.ok(categories);
    }

    @PostMapping()
    @PreAuthorize("hasAnyRole('STAFF', 'ADMIN')")
    public ResponseEntity<CategoryDTO> addCategory(@RequestBody CategoryDTO categoryDTO) {
        CategoryDTO savedCategory = categoryService.saveCategory(categoryDTO);
        return ResponseEntity.status(HttpStatus.CREATED).body(savedCategory);
    }

    @PutMapping("/{id}")
    @PreAuthorize("hasAnyRole('STAFF', 'ADMIN')")
    public ResponseEntity<CategoryDTO> updateCategory(@PathVariable Integer id, @RequestBody CategoryDTO categoryDTO) {
        CategoryDTO findedCategory = categoryService.getCategoryById(id);
        findedCategory.setName(categoryDTO.getName());
        findedCategory.setDescription(categoryDTO.getDescription());
        findedCategory.setParent(categoryDTO.getParent());
        findedCategory.setActive(categoryDTO.isActive());
        CategoryDTO savedCategory = categoryService.saveCategory(findedCategory);
        return ResponseEntity.ok(savedCategory);
    }

    @GetMapping("/{id}")
    @PreAuthorize("hasAnyRole('USER', 'STAFF', 'ADMIN')")
    public CategoryDTO getCategoryByID(@PathVariable Integer id) {
        CategoryDTO category = categoryService.getCategoryById(id);
        return category;
    }

    @DeleteMapping("/{id}")
    @PreAuthorize("hasAnyRole('STAFF', 'ADMIN')")
    public void deleteCategory(@PathVariable Integer id) {
        CategoryDTO category = categoryService.getCategoryById(id);
        category.setActive(false);
        categoryService.saveCategory(category);
    }
}
