package com.example.travel.dto.response;

public record TouristPlaceDisplay(Long id, String title, String slug, String cityName, String stateName, Double avgRating, Double reviewCount) {
}
