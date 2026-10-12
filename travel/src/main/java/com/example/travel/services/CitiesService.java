package com.example.travel.services;

import com.example.travel.dto.response.ActivityDto;
import com.example.travel.dto.response.CityDetailResponse;
import com.example.travel.dto.response.CityDto;
import com.example.travel.dto.response.LocationDto;
import com.example.travel.dto.response.NearbyPlaceDto;
import com.example.travel.dto.response.PlaceDto;
import com.example.travel.entities.City;
import com.example.travel.entities.TouristPlace;
import com.example.travel.exception.ResourceNotFoundException;
import com.example.travel.mapper.TravelMapper;
import com.example.travel.repositories.CitiesRepository;
import com.example.travel.repositories.TouristPlaceRepository;
import org.springframework.stereotype.Service;
import tools.jackson.databind.JsonNode;
import tools.jackson.databind.ObjectMapper;

import java.util.ArrayList;
import java.util.Collections;
import java.util.List;

@Service
public class CitiesService {

    private final CitiesRepository cityRepository;
    private final TouristPlaceRepository touristPlaceRepository;
    private final TravelMapper mapper;
    private final ObjectMapper objectMapper;

    public CitiesService(CitiesRepository cityRepository, TouristPlaceRepository touristPlaceRepository, TravelMapper mapper,
            ObjectMapper objectMapper
    ) {
        this.cityRepository = cityRepository;
        this.touristPlaceRepository = touristPlaceRepository;
        this.mapper = mapper;
        this.objectMapper = objectMapper;
    }

    public List<CityDto> getAllCities() {
        return cityRepository.findAll()
                .stream()
                .map(mapper::mapCityDto)
                .toList();
    }

    public CityDto findCityById(Long cityId) {
        City city = cityRepository.findById(cityId)
                .orElseThrow(() -> new ResourceNotFoundException("City not found with id: " + cityId)
                );
        return mapper.mapCityDto(city);
    }

    public CityDetailResponse getCityDetail(Long cityId) {
        City city = cityRepository.findById(cityId)
                .orElseThrow(() -> new ResourceNotFoundException(
                                "City not found with id: " + cityId
                        )
                );

        JsonNode config = parseConfig(city.getConfig());

        /*
         * ---------------------------------------------------------
         * BASIC CITY INFORMATION
         * ---------------------------------------------------------
         */

        String image = getText(config, "image");
        String about = getText(config, "about");
        String bestTimeToVisit = getText(config, "bestTimeToVisit");

        /*
         * ---------------------------------------------------------
         * STATE
         * ---------------------------------------------------------
         */

        var stateDto = mapper.mapStateDto(city.getState());

        /*
         * ---------------------------------------------------------
         * LOCATION
         * ---------------------------------------------------------
         */

        LocationDto location = mapLocation(config, city);

        /*
         * ---------------------------------------------------------
         * TOURIST PLACES
         * ---------------------------------------------------------
         */

        List<TouristPlace> touristPlaces = touristPlaceRepository.findByCityId(cityId);

        List<PlaceDto> places = touristPlaces.stream()
                .map(mapper::mapPlaceDto)
                .toList();

        /*
         * ---------------------------------------------------------
         * ACTIVITIES
         * ---------------------------------------------------------
         */

        List<ActivityDto> activities = mapActivities(config);

        /*
         * ---------------------------------------------------------
         * NEARBY PLACES
         * ---------------------------------------------------------
         */

        List<NearbyPlaceDto> nearbyPlaces = mapNearbyPlaces(config);

        /*
         * ---------------------------------------------------------
         * FINAL RESPONSE
         * ---------------------------------------------------------
         */

        return new CityDetailResponse(
                city.getId(),
                city.getName(),
                image,
                about,
                stateDto,
                places,
                activities,
                bestTimeToVisit,
                location,
                nearbyPlaces
        );
    }

    private JsonNode parseConfig(String config) {

        if (config == null || config.isBlank()) {
            return objectMapper.createObjectNode();
        }

        try {
            return objectMapper.readTree(config);
        } catch (Exception e) {
            return objectMapper.createObjectNode();
        }
    }

    private String getText(JsonNode config, String field) {

        JsonNode node = config.get(field);

        if (node == null || node.isNull()) {
            return null;
        }

        return node.asText();
    }

    private LocationDto mapLocation(JsonNode config, City city) {

        JsonNode locationNode = config.get("location");

        if (locationNode == null || locationNode.isNull()) {
            return null;
        }

        Double latitude = locationNode.has("latitude")
                ? locationNode.get("latitude").asDouble()
                : null;

        Double longitude = locationNode.has("longitude")
                ? locationNode.get("longitude").asDouble()
                : null;

        String title = locationNode.has("title")
                ? locationNode.get("title").asText()
                : city.getName() + ", " + city.getState().getName();

        return new LocationDto(
                latitude,
                longitude,
                title
        );
    }

    private List<ActivityDto> mapActivities(JsonNode config) {

        JsonNode activitiesNode = config.get("activities");

        if (activitiesNode == null || !activitiesNode.isArray()) {
            return Collections.emptyList();
        }

        List<ActivityDto> activities = new ArrayList<>();

        for (JsonNode node : activitiesNode) {

            Long id = node.has("id")
                    ? node.get("id").asLong()
                    : null;

            String name = node.has("name")
                    ? node.get("name").asText()
                    : null;

            String image = node.has("image")
                    ? node.get("image").asText()
                    : null;

            String description = node.has("description")
                    ? node.get("description").asText()
                    : null;

            activities.add(
                    new ActivityDto(
                            id,
                            name,
                            image,
                            description
                    )
            );
        }

        return activities;
    }

    private List<NearbyPlaceDto> mapNearbyPlaces(JsonNode config) {

        JsonNode nearbyNode = config.get("nearbyPlaces");

        if (nearbyNode == null || !nearbyNode.isArray()) {
            return Collections.emptyList();
        }

        List<NearbyPlaceDto> nearbyPlaces = new ArrayList<>();

        for (JsonNode node : nearbyNode) {

            Long id = node.has("id")
                    ? node.get("id").asLong()
                    : null;

            String name = node.has("name")
                    ? node.get("name").asText()
                    : null;

            String image = node.has("image")
                    ? node.get("image").asText()
                    : null;

            String type = node.has("type")
                    ? node.get("type").asText()
                    : null;

            nearbyPlaces.add(new NearbyPlaceDto(
                            id,
                            name,
                            image,
                            type
                    )
            );
        }

        return nearbyPlaces;
    }
}