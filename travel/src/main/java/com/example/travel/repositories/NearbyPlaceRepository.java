package com.example.travel.repositories;

import com.example.travel.entities.CityNearbyCities;
import com.example.travel.entities.PlaceNearbyPlaces;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface NearbyPlaceRepository extends JpaRepository<PlaceNearbyPlaces, Long> {
    List<PlaceNearbyPlaces> findByPlace_IdOrderByDistanceKmAsc(Long placeId);

}
