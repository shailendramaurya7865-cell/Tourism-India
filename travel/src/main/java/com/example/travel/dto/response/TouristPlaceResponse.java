package com.example.travel.dto.response;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.util.List;
import java.util.Set;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class TouristPlaceResponse {

    private Long id;
    private String name;
    private String slug;
    private String placeholderImage;
    private String description;
    private String shortDescription;
    private CityDisplay city;
    private VisitorInformationDto visitorInformationDto;
    private RatingDto rating;
    private Set<CategoryDto> categories;
    private List<NearbyPlaceDto> nearByPlace;


    private LocationDto locationDto;
    private List<String> howToReach;
}