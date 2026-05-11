package com.election.vote_system.repository;

import com.election.vote_system.entity.Vote;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

public interface VoteRepository extends JpaRepository<Vote, Long> {

    @Query("select count(v) > 0 from Vote v where v.election.id = :electionId and v.elector.id = :electorId")
    boolean existsVoteForElector(@Param("electionId") Long electionId, @Param("electorId") Long electorId);

    long countByElection_Code(String electionCode);
}