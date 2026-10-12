package com.example.travel.services;

import com.example.travel.dto.response.CategoryDto;
import com.example.travel.dto.response.StateDetailResponse;
import com.example.travel.dto.response.StateDto;
import com.example.travel.entities.City;
import com.example.travel.entities.State;
import com.example.travel.entities.TouristPlace;
import com.example.travel.exception.ResourceNotFoundException;
import com.example.travel.mapper.TravelMapper;
import com.example.travel.repositories.CitiesRepository;
import com.example.travel.repositories.StateRepository;
import com.example.travel.repositories.TouristPlaceRepository;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Set;
import java.util.stream.Collectors;

@Service
public class StateService {

    private final StateRepository stateRepository;
    private final CitiesRepository citiesRepository;
    private final TouristPlaceRepository touristPlaceRepository;
    private final TravelMapper mapper;

    public StateService(StateRepository stateRepository, CitiesRepository citiesRepository, TouristPlaceRepository touristPlaceRepository, TravelMapper mapper) {
        this.stateRepository = stateRepository;
        this.citiesRepository = citiesRepository;
        this.touristPlaceRepository = touristPlaceRepository;
        this.mapper = mapper;
    }

    public List<StateDto> getAllStates() {
        return stateRepository.findAll().stream().map(mapper::mapStateDto).toList();
    }

    public StateDto getState(Long stateId) {
        State state = stateRepository.findById(stateId).orElseThrow(() -> new ResourceNotFoundException("State not found"));
        return mapper.mapStateDto(state);
    }

    public StateDetailResponse getStateDetails(Long stateId) {
        List<City> popularCities = citiesRepository.findCitiesByState(stateId);
        List<TouristPlace> places = touristPlaceRepository.findPlacesByState(stateId);
        Set<CategoryDto> categories = places.stream()
                .flatMap(place -> place.getCategories().stream())
                .map(mapper::mapCategoryDto)
                .collect(Collectors.toSet());
        return new StateDetailResponse(
                getState(stateId),
                popularCities.stream().map(mapper::mapCityDto).toList(),
                places.stream().map(mapper::mapToResponseTourist).toList(),
                categories

        );
    }
}