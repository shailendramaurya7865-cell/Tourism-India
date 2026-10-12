package com.example.travel.dto.response;

import java.util.Set;

public record TouristPlaceResponse(
        Long id,
        String name,
        String shortDescription,
        CityDto city,
        StateDto state,
        Set<CategoryDto> categories
) {}