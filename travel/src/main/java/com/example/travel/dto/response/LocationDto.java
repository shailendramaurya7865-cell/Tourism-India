package com.example.travel.dto.response;

public record LocationDto(
        Double latitude,
        Double longitude,
        String address
) {
}