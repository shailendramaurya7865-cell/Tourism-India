package com.example.travel.dto.response;

import java.math.BigDecimal;

public record NearbyPlaceDto(
        Long placeId,
        String placeName,
        String placeImageUrl,
        Double  distanceKm
) {
}