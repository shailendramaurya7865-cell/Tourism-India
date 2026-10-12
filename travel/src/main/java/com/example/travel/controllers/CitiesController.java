package com.example.travel.controllers;

import com.example.travel.api.ApiResponse;
import com.example.travel.dto.response.CityDetailResponse;
import com.example.travel.dto.response.CityDto;
import com.example.travel.services.CitiesService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@CrossOrigin(origins = "*")
@RestController
@RequestMapping("/api/cities")
public class CitiesController {

    private final CitiesService cityService;

    public CitiesController(CitiesService cityService) {
        this.cityService = cityService;
    }

    @GetMapping
    public ResponseEntity<ApiResponse<List<CityDto>>> getAllCities() {
        List<CityDto> respCities = cityService.getAllCities();
        ApiResponse<List<CityDto>> response = ApiResponse.success("Cities loaded successfully", respCities);
        return ResponseEntity.ok(response);
    }

    @GetMapping("/{cityId}")
    public ResponseEntity<ApiResponse<CityDetailResponse>> getCityDetail(@PathVariable Long cityId) {
        return ResponseEntity.ok(ApiResponse.success(cityService.getCityDetail(cityId)));

    }
}
