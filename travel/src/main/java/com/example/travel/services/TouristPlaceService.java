package com.example.travel.services;

import com.example.travel.dto.response.*;
import com.example.travel.entities.TouristPlace;
import com.example.travel.exception.ResourceNotFoundException;
import com.example.travel.mapper.TravelMapper;
import com.example.travel.repositories.NearbyPlaceRepository;
import com.example.travel.repositories.TouristPlaceRepository;
import jakarta.transaction.Transactional;
import org.springframework.data.domain.PageRequest;
import org.springframework.stereotype.Service;

import java.util.ArrayList;
import java.util.List;
import java.util.stream.Collectors;

@Service
public class TouristPlaceService {

    private final TouristPlaceRepository repository;
    private final TravelMapper mapper;
    private final NearbyPlaceRepository nearbyPlaceRepository;

    public TouristPlaceService(TouristPlaceRepository repository, NearbyPlaceRepository nearbyPlaceRepository, TravelMapper mapper) {
        this.repository = repository;
        this.mapper = mapper;
        this.nearbyPlaceRepository = nearbyPlaceRepository;
    }

    public List<TouristPlaceDisplay> getAllTouristPlaces() {
        return repository.findAll(PageRequest.of(0, 30)).getContent().stream()
                .map(mapper::mapToResponseFeaturedPlace).toList();
    }

    public TouristPlaceResponse getTouristPlaceDetail(Long id) {
        TouristPlace place = repository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Tourist place with id " + id + " not found"));

        List<NearbyPlaceDto> nearbyPlaces = nearbyPlaceRepository.findByPlace_IdOrderByDistanceKmAsc(id)
                        .stream()
                        .map(mapper::mapNearbyPlaceDto)
                        .toList();



        TouristPlaceResponse response = new TouristPlaceResponse();
        response.setId(place.getId());
        response.setName(place.getName());
        response.setSlug("place-slug");
        response.setPlaceholderImage("place-holder-image");
        response.setDescription("description");
        response.setShortDescription("short-description");
        response.setVisitorInformationDto(
                new VisitorInformationDto(
                        new TimingDto(null, null, List.of()),
                        new EntryFeeDto(null, "INR"),
                        null
                )
        );        response.setCity(mapper.mapCityDisplay(place.getCity()));
        response.setRating(new RatingDto(place.getAverageRating(), place.getReviewCount()));
        response.setCategories(place.getCategories().stream().map(mapper::mapCategoryDto).collect(Collectors.toSet()));
        response.setNearByPlace(nearbyPlaces);
        response.setLocationDto(new LocationDto(place.getLatitude().toBigInteger().doubleValue(), place.getLongitude().toBigInteger().doubleValue(), place.getAddress()));
        response.setHowToReach(new ArrayList<>());
        return response;
    }

    public List<TouristPlaceDisplay> getFeaturedTouristPlace() {
        return repository.findFeaturedPlaces().stream().map(mapper::mapToResponseFeaturedPlace).toList();
    }
}