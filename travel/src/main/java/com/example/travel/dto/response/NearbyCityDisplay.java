package com.example.travel.dto.response;

public record NearbyCityDisplay(Long id, String name, String imageUrl, Long stateId, String stateName, Double distanceFromSource) {
}
