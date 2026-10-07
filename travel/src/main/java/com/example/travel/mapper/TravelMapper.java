package com.example.travel.mapper;

import com.example.travel.dto.response.*;
import com.example.travel.entities.Category;
import com.example.travel.entities.City;
import com.example.travel.entities.State;
import com.example.travel.entities.TouristPlace;
import org.springframework.stereotype.Component;

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

}