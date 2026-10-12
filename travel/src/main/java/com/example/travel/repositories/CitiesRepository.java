package com.example.travel.repositories;

import com.example.travel.entities.City;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.List;

public interface CitiesRepository extends JpaRepository<City, Long> {
    @Query("""
        SELECT c
        FROM City c
        WHERE c.state.id = :stateId
        ORDER BY c.name
    """)
    List<City> findCitiesByState(@Param("stateId") Long stateId);
}