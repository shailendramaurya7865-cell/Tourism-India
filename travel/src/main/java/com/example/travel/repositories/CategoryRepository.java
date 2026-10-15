package com.example.travel.repositories;

import com.example.travel.entities.Category;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;

import java.util.List;

public interface CategoryRepository extends JpaRepository<Category, Long> {

    @Query("""
SELECT t
FROM Category t
ORDER BY t.createdAt DESC
LIMIT 9
""")
    List<Category> getPopularCategories();
}
