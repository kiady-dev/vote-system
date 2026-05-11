package com.election.vote_system.repository;

import com.election.vote_system.entity.Candidate;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.List;
import java.util.Optional;

public interface CandidateRepository extends JpaRepository<Candidate, Long> {

    interface CandidateVoteCount {
        Long getCandidateId();

        Integer getCandidateNumber();

        String getFullName();

        long getVoteCount();
    }

    @Query("select c from Candidate c where c.election.code = :electionCode order by c.candidateNumber asc")
    List<Candidate> findByElectionCodeOrderByCandidateNumberAsc(@Param("electionCode") String electionCode);

    @Query("select c from Candidate c where c.election.code = :electionCode and c.candidateNumber = :candidateNumber")
    Optional<Candidate> findByElectionCodeAndCandidateNumber(@Param("electionCode") String electionCode,
                                                             @Param("candidateNumber") Integer candidateNumber);

        @Query("select c.id as candidateId, c.candidateNumber as candidateNumber, c.fullName as fullName, count(v.id) as voteCount " +
            "from Candidate c " +
            "left join Vote v on v.candidate = c and v.election = c.election " +
            "where c.election.code = :electionCode " +
            "group by c.id, c.candidateNumber, c.fullName " +
            "order by c.candidateNumber")
        List<CandidateVoteCount> findResultsByElectionCode(@Param("electionCode") String electionCode);
}