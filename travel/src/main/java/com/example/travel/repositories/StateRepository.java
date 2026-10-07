package com.example.travel.repositories;

import org.springframework.data.jpa.repository.JpaRepository;
import com.example.travel.entities.State;


public interface StateRepository extends JpaRepository<State, Long> {
}
