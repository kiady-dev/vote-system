package com.election.vote_system.repository;

import com.election.vote_system.entity.Election;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Optional;

public interface ElectionRepository extends JpaRepository<Election, Long> {

    Optional<Election> findByCode(String code);
}