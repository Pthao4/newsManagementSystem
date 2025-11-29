package com.newsManagementSystem.controller;

import com.newsManagementSystem.dto.CategoryDTO;
import com.newsManagementSystem.service.CategoryService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/categories")
@RequiredArgsConstructor
public class CategoryController {

    private final CategoryService categoryService;

    @GetMapping
    public ResponseEntity<List<CategoryDTO>> getAllCategories() {
//        Pageable pageable = PageRequest.of(page, 10);
//        Page<CategoryDTO> categories = categoryService.getCategories(pageable);
//        Map<String, Object> map = new HashMap<>();
//        map.put("data", categories.getContent());
//        map.put("page", categories.getNumber());
//        map.put("totalPages", categories.getTotalPages());
//        map.put("totalElements", categories.getTotalElements());
        List<CategoryDTO> categories = categoryService.getAllCategories();
        return ResponseEntity.ok(categories);
    }

    @PostMapping()
    public ResponseEntity<CategoryDTO> addCategory(@RequestBody CategoryDTO categoryDTO) {
        CategoryDTO savedCategory = categoryService.saveCategory(categoryDTO);
        return ResponseEntity.status(HttpStatus.CREATED).body(savedCategory);
    }

    @PutMapping("/{id}")
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
    public CategoryDTO getCategoryByID(@PathVariable Integer id) {
        CategoryDTO category = categoryService.getCategoryById(id);
        return category;
    }

    @DeleteMapping("/{id}")
    public void deleteCategory(@PathVariable Integer id) {
        CategoryDTO category = categoryService.getCategoryById(id);
        category.setActive(false);
        categoryService.saveCategory(category);
    }
}
