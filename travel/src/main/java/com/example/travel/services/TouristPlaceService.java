package com.example.travel.services;

import com.example.travel.dto.response.TouristPlaceDisplay;
import com.example.travel.dto.response.TouristPlaceDetailDto;
import com.example.travel.dto.response.TouristPlaceResponse;
import com.example.travel.entities.TouristPlace;
import com.example.travel.exception.ResourceNotFoundException;
import com.example.travel.mapper.TravelMapper;
import com.example.travel.repositories.TouristPlaceRepository;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class TouristPlaceService {

    private final TouristPlaceRepository repository;
    private final TravelMapper mapper;

    public TouristPlaceService(TouristPlaceRepository repository, TravelMapper mapper) {
        this.repository = repository;
        this.mapper = mapper;
    }

    public List<TouristPlaceResponse> getAllTouristPlaces() {
        return repository.findAll().stream().map(mapper::mapToResponseTourist).toList();
    }

    public TouristPlaceDetailDto getTouristPlaceDetail(Long id) {
        TouristPlace place = repository.findById(id).orElseThrow(() -> new ResourceNotFoundException("Tourist place with id " + id + " not found"));
        return mapper.mapToResponseTouristDetail(place);
    }

    public List<TouristPlaceDisplay> getFeaturedTouristPlace() {
        return repository.findFeaturedPlaces().stream().map(mapper::mapToResponseFeaturedPlace).toList();
    }
}