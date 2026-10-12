package com.example.travel.repositories;

import com.example.travel.entities.TouristPlace;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.Arrays;
import java.util.List;

public interface TouristPlaceRepository extends JpaRepository<TouristPlace, Long> {

    List<TouristPlace> findByCityId(Long cityId);

    @Query("""
SELECT t
FROM TouristPlace t
ORDER BY t.averageRating DESC
LIMIT 6
""")
    List<TouristPlace> findFeaturedPlaces();

    @Query("""
        SELECT t
        FROM TouristPlace t
        WHERE t.city.state.id = :stateId
        ORDER BY t.averageRating DESC
    """)
    List<TouristPlace> findPlacesByState(
            @Param("stateId") Long stateId
    );


    @Query("""
        SELECT t
        FROM TouristPlace t
        WHERE t.city.id = :cityId
        ORDER BY t.averageRating DESC
    """)
    List<TouristPlace> findPlacesByCity(
            @Param("cityId") Long cityId
    );



}
