package com.election.vote_system.dto;

import com.election.vote_system.entity.VotingChannel;

public record CastVoteRequest(
        String voterCode,
        String votingPassword,
        Integer candidateNumber,
        VotingChannel votingChannel,
        String recordedBy,
        String ipAddress,
        String userAgent
) {
}