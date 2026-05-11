package com.election.vote_system.dto;

import com.election.vote_system.entity.ElectionStatus;

public record UpdateElectionStatusRequest(ElectionStatus status) {
}