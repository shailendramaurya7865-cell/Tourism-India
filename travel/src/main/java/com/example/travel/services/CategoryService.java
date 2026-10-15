package com.example.travel.services;

import com.example.travel.dto.response.CategoryDto;
import com.example.travel.entities.Category;
import com.example.travel.mapper.TravelMapper;
import com.example.travel.repositories.CategoryRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class CategoryService {
    private final CategoryRepository categoryRepository;
    private final TravelMapper mapper;


    public CategoryService(CategoryRepository categoryRepository, TravelMapper mapper) {
        this.categoryRepository = categoryRepository;
        this.mapper = mapper;
    }

    public List<CategoryDto> getAllCategories() {
        return categoryRepository.findAll().stream().map(mapper::mapCategoryDto).toList();
    }


    public List<CategoryDto> getPopularCategories() {
        List<Category> popularCategories = categoryRepository.getPopularCategories();
        return popularCategories.stream().map(mapper::mapCategoryDto).toList();
    }
}
