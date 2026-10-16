package com.example.travel.services;

import com.example.travel.dto.response.CityDetailResponse;
import com.example.travel.dto.response.CityDto;
import com.example.travel.entities.City;
import com.example.travel.entities.CityNearbyCities;
import com.example.travel.entities.TouristPlace;
import com.example.travel.exception.ResourceNotFoundException;
import com.example.travel.mapper.TravelMapper;
import com.example.travel.repositories.CitiesRepository;
import com.example.travel.repositories.NearbyCitiesRepository;
import com.example.travel.repositories.TouristPlaceRepository;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class CitiesService {

    private final CitiesRepository cityRepository;
    private final TouristPlaceRepository touristPlaceRepository;
    private final NearbyCitiesRepository nearbyCitiesRepository;
    private final TravelMapper mapper;

    public CitiesService(CitiesRepository cityRepository, TouristPlaceRepository touristPlaceRepository, TravelMapper mapper, NearbyCitiesRepository nearbyCitiesRepository) {
        this.cityRepository = cityRepository;
        this.touristPlaceRepository = touristPlaceRepository;
        this.nearbyCitiesRepository = nearbyCitiesRepository;
        this.mapper = mapper;
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
        CityDto cityDto = findCityById(cityId);
        List<TouristPlace> topTouristPlaces = touristPlaceRepository.findTopTouristPlaces(cityId);
        List<CityNearbyCities> nearByCities = nearbyCitiesRepository.findByCity_IdOrderByDistanceKmAsc(cityId);
        return new CityDetailResponse(cityDto,
                topTouristPlaces.stream().map(mapper::mapToResponseFeaturedPlace).toList(),
                nearByCities.stream().map(mapper::mapToNearbyCityDisplay).toList());
    }
}