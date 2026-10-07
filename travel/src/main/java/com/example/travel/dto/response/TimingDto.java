package com.example.travel.dto.response;

import java.util.List;

public record TimingDto(
        String openTime,
        String closeTime,
        List<String> closedDays
) {
}