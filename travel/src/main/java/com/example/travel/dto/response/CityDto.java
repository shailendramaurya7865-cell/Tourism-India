package com.example.travel.dto.response;

public record CityDto(Long id, String slug, String name, String imageUrl, Long stateId, String stateName, String cityDescription, String cityTagLine) {
}
