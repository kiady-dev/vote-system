package com.election.vote_system.dto;

public record ElectorLoginRequest(
        String voterCode,
        String votingPassword
) {
}