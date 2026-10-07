package com.example.travel.dto.response;

public record RatingDto(
        Double average,
        Long totalReviews
) {
}