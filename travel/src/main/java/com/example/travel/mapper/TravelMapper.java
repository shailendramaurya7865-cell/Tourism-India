package com.example.travel.mapper;

import com.example.travel.dto.response.*;
import com.example.travel.entities.*;
import org.springframework.stereotype.Component;
import tools.jackson.databind.JsonNode;
import tools.jackson.databind.ObjectMapper;

import java.util.List;
import java.util.Set;
import java.util.stream.Collectors;

@Component
public class TravelMapper {
    public StateDto mapStateDto(State state) {
        return new StateDto(state.getId(), state.getName(), "state-slug", "state-image-url", "state-tag-line", "state-description");
    }

    public CityDto mapCityDto(City city) {
        return new CityDto(city.getId(), "city-slug", city.getName(), "city-image-url", city.getState().getId(), city.getState().getName(), "city-description", "city-tag-line");
    }

    public PlaceDto mapPlaceDto(TouristPlace place) {
        RatingDto rating = new RatingDto(
                place.getAverageRating(),
                place.getReviewCount()
        );
        String image = null;

        if (place.getConfig() != null && !place.getConfig().isBlank()) {
            try {
                JsonNode config = new ObjectMapper().readTree(place.getConfig());
                if (config.has("image")) {
                    image = config.get("image").asText();
                }
            } catch (Exception ignored) {
            }
        }

        return new PlaceDto(
                place.getId(),
                place.getName(),
                image,
                rating
        );
    }

    public CategoryDto mapCategoryDto(Category category) {
        return new CategoryDto(category.getId(), "category-slug", category.getName(), "category-icon-url");
    }

    public TouristPlaceResponse mapToResponseTourist(TouristPlace place) {

        City city = place.getCity();
        State state = city.getState();

        Set<CategoryDto> categories = place.getCategories()
                .stream()
                .map(this::mapCategoryDto)
                .collect(Collectors.toSet());
        return new TouristPlaceResponse(place.getId(), place.getName(), place.getSlug(), "place-short-description", "image-url", mapCityDto(place.getCity()), categories);

    }

    public TouristPlaceDisplay mapToResponseFeaturedPlace(TouristPlace place) {
        City city = place.getCity();
        State state = city.getState();
        Long reviewCount = place.getReviewCount();
        Double averageRating = place.getAverageRating();
        return new TouristPlaceDisplay(place.getId(), place.getName(), "place-slug", city.getName(), state.getName(), "place-image" ,averageRating, reviewCount.doubleValue());
    }

    public CityDisplay mapCityDisplay(City city) {
        return new CityDisplay(city.getId(), city.getName(), "city-image-url", city.getState().getId(), city.getState().getName());
    }

    public TouristPlaceDetailDto mapToResponseTouristDetail(TouristPlace place) {
        City city = place.getCity();
        State state = city.getState();
        Set<CategoryDto> categories = place.getCategories()
                .stream()
                .map(this::mapCategoryDto)
                .collect(Collectors.toSet());
        LocationDto location = new LocationDto(
                place.getLatitude().doubleValue(),
                place.getLongitude().doubleValue(),
                place.getAddress()
        );
        TimingDto timings = new TimingDto(
                place.getOpeningTime().toString(),
                place.getClosingTime().toString(),
                List.of()
        );
        EntryFeeDto entryFee = new EntryFeeDto(
                place.getEntryFee().doubleValue(),
                "INR"
        );
        RatingDto rating = new RatingDto(
                place.getAverageRating(),
                place.getReviewCount()
        );
        return new TouristPlaceDetailDto(
                place.getId(),
                place.getName(),
                place.getDescription(),
                place.getShortDescription(),
                mapStateDto(state),
                mapCityDto(city),
                categories,
                location,
                timings,
                entryFee,
                rating
        );
    }

    public NearbyCityDisplay mapToNearbyCityDisplay(CityNearbyCities nearbyCity) {
        City city = nearbyCity.getNearbyCity();
        return new NearbyCityDisplay(city.getId(), city.getName(), "image-url", city.getState().getId(), city.getState().getName(), nearbyCity.getDistanceKm().doubleValue());
    }

}