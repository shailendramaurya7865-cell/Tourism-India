package com.example.travel.dto.response;

import java.util.List;

public record VisitorInformationDto(TimingDto timing, EntryFeeDto entryFees, String bestTimeToVisit) {
}
