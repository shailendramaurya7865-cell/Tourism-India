package com.example.travel.dto.response;

public record ImageDto(
        Long id,
        String url,
        String thumbnailUrl,
        boolean isPrimary
) {
}