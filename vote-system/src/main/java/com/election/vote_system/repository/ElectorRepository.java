package com.election.vote_system.repository;

import com.election.vote_system.entity.Elector;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Optional;

public interface ElectorRepository extends JpaRepository<Elector, Long> {

    Optional<Elector> findByVoterCode(String voterCode);

    Optional<Elector> findByNationalId(String nationalId);

    Optional<Elector> findByVoterCodeOrNationalId(String voterCode, String nationalId);
}