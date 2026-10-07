package com.example.travel.repositories;

import com.example.travel.entities.TouristPlace;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;

import java.util.Arrays;
import java.util.List;

public interface TouristPlaceRepository extends JpaRepository<TouristPlace, Long> {

    @Query("""
SELECT t
FROM TouristPlace t
ORDER BY t.averageRating DESC
LIMIT 6
""")
    List<TouristPlace> findFeaturedPlaces();

}
