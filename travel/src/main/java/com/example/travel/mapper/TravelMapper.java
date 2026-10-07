package com.example.travel.mapper;

import com.example.travel.dto.response.*;
import com.example.travel.entities.Category;
import com.example.travel.entities.City;
import com.example.travel.entities.State;
import com.example.travel.entities.TouristPlace;
import org.springframework.stereotype.Component;

import java.util.List;
import java.util.Set;
import java.util.stream.Collectors;

@Component
public class TravelMapper {
    public StateDto mapStateDto(State state) {
        return new StateDto(
                state.getId(),
                state.getName()
        );
    }

    public CityDto mapCityDto(City city) {
        return new CityDto(
                city.getId(),
                city.getName()
        );
    }

    public CategoryDto mapCategoryDto(Category category) {
        return new CategoryDto(
                category.getId(),
                category.getName()
        );
    }

    public TouristPlaceDto mapToResponseTourist(TouristPlace place) {

        City city = place.getCity();
        State state = city.getState();

        Set<CategoryDto> categories = place.getCategories()
                .stream()
                .map(this::mapCategoryDto)
                .collect(Collectors.toSet());
        return new TouristPlaceDto(place.getId(),
                place.getName(),
                place.getShortDescription(),
                mapCityDto(city),
                mapStateDto(state),
                categories);

    }

    public FeaturedTouristPlaceDto mapToResponseFeaturedPlace(TouristPlace place) {
        City city = place.getCity();
        State state = city.getState();

        return new FeaturedTouristPlaceDto(place.getId(),
                place.getName(),
                city.getName(),
                state.getName(),
                place.getAverageRating());

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
}