package com.example.travel.controllers;

import com.example.travel.api.ApiResponse;
import com.example.travel.dto.response.FeaturedTouristPlaceDto;
import com.example.travel.dto.response.TouristPlaceDetailDto;
import com.example.travel.dto.response.TouristPlaceResponse;
import com.example.travel.services.TouristPlaceService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@CrossOrigin(origins = "*")
@RestController
@RequestMapping("/api/tourist-places")
public class TouristPlaceController {

    private final TouristPlaceService service;

    public TouristPlaceController(TouristPlaceService service) {
        this.service = service;
    }

    @GetMapping
    public ResponseEntity<ApiResponse<List<TouristPlaceResponse>>> getAllTouristPlaces() {
        return ResponseEntity.ok(ApiResponse.success("Tourist places retrieved successfully", service.getAllTouristPlaces()));
    }

    @GetMapping("/{id}")
    public ResponseEntity<ApiResponse<TouristPlaceDetailDto>> getTouristPlaceDetail(@PathVariable Long id) {
        return ResponseEntity.ok(ApiResponse.success(service.getTouristPlaceDetail(id)));
    }

    @GetMapping("/featured")
    public ResponseEntity<ApiResponse<List<FeaturedTouristPlaceDto>>> getFeaturedTouristPlace() {
        return ResponseEntity.ok(ApiResponse.success(service.getFeaturedTouristPlace()));
    }
}