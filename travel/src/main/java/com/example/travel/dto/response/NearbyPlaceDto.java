package com.example.travel.dto.response;

public record NearbyPlaceDto(
        Long id,
        String name,
        String imageUrl,
        Double rating
) {
}