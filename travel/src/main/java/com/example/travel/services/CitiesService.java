package com.example.travel.services;

import com.example.travel.dto.response.CityDto;
import com.example.travel.mapper.TravelMapper;
import com.example.travel.repositories.CitiesRepository;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class CitiesService {

    private final CitiesRepository cityRepository;
    private final TravelMapper mapper;

    public CitiesService(CitiesRepository cityRepository, TravelMapper mapper) {
        this.cityRepository = cityRepository;
        this.mapper = mapper;
    }

    public List<CityDto> getAllCities() {
        return cityRepository.findAll().stream().map(mapper::mapCityDto).toList();
    }
}
