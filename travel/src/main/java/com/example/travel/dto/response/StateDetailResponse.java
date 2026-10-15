package com.example.travel.dto.response;

import java.util.List;

public record StateDetailResponse(
        StateDto state,
        List<CityDto> popularCities,
        List<TouristPlaceDisplay> topTouristPlaces) {
}
