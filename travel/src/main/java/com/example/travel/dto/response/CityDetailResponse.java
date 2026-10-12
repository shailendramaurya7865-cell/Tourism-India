package com.example.travel.dto.response;

import java.util.List;

public record CityDetailResponse(
        Long id,
        String name,
        String image,
        String about,
        StateDto state,
        List<PlaceDto> touristPlaces,
        List<ActivityDto> activities,
        String bestTimeToVisit,
        LocationDto location,
        List<NearbyPlaceDto> nearbyPlaces
) {
}