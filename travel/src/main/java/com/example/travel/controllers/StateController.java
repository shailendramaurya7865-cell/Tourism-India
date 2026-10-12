package com.example.travel.controllers;

import com.example.travel.api.ApiResponse;
import com.example.travel.dto.response.StateDetailResponse;
import com.example.travel.dto.response.StateDto;
import com.example.travel.services.StateService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@CrossOrigin(origins = "*")
@RequestMapping("/api/states")
public class StateController {

    private final StateService stateService;

    public StateController(StateService stateService) {
        this.stateService = stateService;
    }

    @GetMapping
    public ResponseEntity<ApiResponse<List<StateDto>>> getAllStates() {
        List<StateDto> allStates = stateService.getAllStates();
        ApiResponse<List<StateDto>> apiStates = ApiResponse.success("States loaded successfully", allStates);
        return ResponseEntity.ok(apiStates);
    }

//    @GetMapping("/{stateId}")
//    public ResponseEntity<ApiResponse<StateDto>> getState(@PathVariable Long stateId) {
//        return ResponseEntity.ok(ApiResponse.success(stateService.getState(stateId)));
//    }

    @GetMapping("/{stateId}")
    public ResponseEntity<ApiResponse<StateDetailResponse>> getStateDetail(@PathVariable Long stateId) {
        return ResponseEntity.ok(ApiResponse.success(stateService.getStateDetails(stateId)));
    }
}