package com.election.vote_system.dto;

import com.election.vote_system.entity.ElectorStatus;
import com.election.vote_system.entity.VotingChannel;

import java.time.OffsetDateTime;

public record ElectorSummaryDto(
        String voterCode,
        String fullName,
        String promotionLabel,
        ElectorStatus status,
        boolean hasVoted,
        OffsetDateTime votedAt,
        VotingChannel votingChannel
) {
}