package com.example.travel.dto.response;

import java.util.Set;

public record TouristPlaceResponse(
        Long id,
        String name,
        String slug,
        String shortDescription,
        String imageUrl,
        CityDto city,
        Set<CategoryDto> categories
) {}