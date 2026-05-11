package com.election.vote_system.dto;

import com.election.vote_system.entity.VotingChannel;

import java.time.OffsetDateTime;

public record ElectorStatusDto(
        String voterCode,
        String fullName,
        String promotionLabel,
        boolean hasVoted,
        OffsetDateTime votedAt,
        VotingChannel votingChannel
) {
}