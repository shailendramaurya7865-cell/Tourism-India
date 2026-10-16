package com.example.travel.dto.response;

import java.util.List;

public record CityDetailResponse(
        CityDto city,
        List<TouristPlaceDisplay> topTouristPlaces,
        List<NearbyCityDisplay> nearByCities
) {
}