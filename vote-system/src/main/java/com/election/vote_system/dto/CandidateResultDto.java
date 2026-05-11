package com.election.vote_system.dto;

public record CandidateResultDto(
        Long candidateId,
        Integer candidateNumber,
        String fullName,
        long voteCount
) {
}