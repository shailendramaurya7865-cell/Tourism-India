package com.example.travel.services;

import com.example.travel.dto.response.StateDto;
import com.example.travel.entities.State;
import com.example.travel.exception.ResourceNotFoundException;
import com.example.travel.mapper.TravelMapper;
import com.example.travel.repositories.StateRepository;
import org.springframework.stereotype.Service;
import java.util.List;

@Service
public class StateService {

    private final StateRepository stateRepository;
    private final TravelMapper mapper;

    public StateService(StateRepository stateRepository, TravelMapper mapper) {
        this.mapper = mapper;
        this.stateRepository = stateRepository;
    }

    public List<StateDto> getAllStates() {
        return stateRepository.findAll().stream().map(mapper::mapStateDto).toList();
    }

    public StateDto getState(Long stateId) {
        State state = stateRepository.findById(stateId).orElseThrow(() -> new ResourceNotFoundException("State not found"));
        return mapper.mapStateDto(state);
    }
}