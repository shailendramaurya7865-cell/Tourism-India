package com.example.travel.controllers;

import com.example.travel.api.ApiResponse;
import com.example.travel.dto.response.CategoryDto;
import com.example.travel.services.CategoryService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@RestController
@CrossOrigin
@RequestMapping("/api/categories")
public class CategoryController {

    private final CategoryService categoryService;

    public CategoryController(CategoryService categoryService) {
        this.categoryService = categoryService;
    }

    @GetMapping
    public ResponseEntity<ApiResponse<List<CategoryDto>>> getAllCategories() {
        List<CategoryDto> allCategories = categoryService.getAllCategories();
        ApiResponse<List<CategoryDto>> apiResponse = ApiResponse.success("Categories loaded successfully", allCategories);
        return ResponseEntity.ok(apiResponse);
    }

    @GetMapping("/popular")
    public ResponseEntity<ApiResponse<List<CategoryDto>>> getPopularCategories() {
        List<CategoryDto> popularCategories = categoryService.getPopularCategories();
        ApiResponse<List<CategoryDto>> apiResponse = ApiResponse.success("Categories loaded successfully", popularCategories);
        return ResponseEntity.ok(apiResponse);
    }
}
