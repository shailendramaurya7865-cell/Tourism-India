package com.example.travel.repositories;

import com.example.travel.entities.City;
import org.springframework.data.jpa.repository.JpaRepository;

public interface CitiesRepository extends JpaRepository<City, Long> {
}
