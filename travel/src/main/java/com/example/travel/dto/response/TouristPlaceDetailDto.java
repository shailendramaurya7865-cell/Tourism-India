package com.example.travel.dto.response;

import java.util.Set;

public record TouristPlaceDetailDto(
        Long id,
        String name,
        String description,
        String shortDescription,
        StateDto state,
        CityDto city,
        Set<CategoryDto> categories,
        LocationDto location,
        TimingDto timings,
        EntryFeeDto entryFee,
        RatingDto rating
) {
}