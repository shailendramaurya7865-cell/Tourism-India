package com.example.travel.controllers;

import com.example.travel.api.ApiResponse;
import com.example.travel.dto.response.CityDto;
import com.example.travel.services.CitiesService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

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
}
