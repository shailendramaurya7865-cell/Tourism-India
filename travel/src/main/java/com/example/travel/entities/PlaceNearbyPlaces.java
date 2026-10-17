package com.example.travel.entities;

import jakarta.persistence.*;
import lombok.Getter;
import lombok.Setter;

import java.math.BigDecimal;

@Getter
@Setter
@Entity
@Table(name = "nearby_places", uniqueConstraints = {@UniqueConstraint(name = "uq_nearby_place",
        columnNames = {"place_id", "nearby_place_id"})})
public class PlaceNearbyPlaces {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY, optional = false)
    @JoinColumn(name = "place_id", nullable = false)
    private TouristPlace place;

    @ManyToOne(fetch = FetchType.LAZY, optional = false)
    @JoinColumn(name = "nearby_place_id", nullable = false)
    private TouristPlace nearbyPlace;

    @Column(name = "distance_km", precision = 6, scale = 2)
    private BigDecimal distanceKm;
}
