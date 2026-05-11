package com.election.vote_system.dto;

public record CandidateDto(
        Long id,
        Integer candidateNumber,
        String fullName,
        String displayName,
        String biography,
        String photoUrl
) {
}