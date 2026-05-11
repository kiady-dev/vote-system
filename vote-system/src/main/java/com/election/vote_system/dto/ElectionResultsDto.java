package com.election.vote_system.dto;

import com.election.vote_system.entity.ElectionStatus;

import java.util.List;

public record ElectionResultsDto(
        String electionCode,
        ElectionStatus status,
        long totalVotes,
        List<CandidateResultDto> candidates
) {
}