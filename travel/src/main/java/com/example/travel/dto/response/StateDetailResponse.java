package com.example.travel.dto.response;

import java.util.List;
import java.util.Set;

public record StateDetailResponse(StateDto state,
                                 List<CityDto> popularCities,
                                 List<TouristPlaceResponse> touristPlaces,
                                 Set<CategoryDto> categories) {
}
