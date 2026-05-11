package com.election.vote_system.dto;

import com.election.vote_system.entity.VotingChannel;

import java.time.OffsetDateTime;

public record CastVoteResponse(
        Long voteId,
        String receiptCode,
        String electionCode,
        String voterCode,
        Long candidateId,
        Integer candidateNumber,
        String candidateName,
        VotingChannel votingChannel,
        OffsetDateTime castAt
) {
}