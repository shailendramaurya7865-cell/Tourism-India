package com.example.travel.controllers;

import com.example.travel.api.ApiResponse;
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
        ResponseEntity<ApiResponse<List<StateDto>>> ok = ResponseEntity.ok(apiStates);
        System.out.println("ok = " + ok);
        return ok;
    }

    @GetMapping("/{stateId}")
    public ResponseEntity<ApiResponse<StateDto>> getState(@PathVariable Long stateId) {
        return ResponseEntity.ok(ApiResponse.success(stateService.getState(stateId)));
    }
}