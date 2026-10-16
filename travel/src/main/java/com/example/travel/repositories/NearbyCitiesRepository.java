package com.example.travel.repositories;

import com.example.travel.entities.CityNearbyCities;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface NearbyCitiesRepository extends JpaRepository<CityNearbyCities, Long> {
    List<CityNearbyCities> findByCity_IdOrderByDistanceKmAsc(Long cityId);
}
