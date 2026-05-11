package com.election.vote_system.dto;

import com.election.vote_system.entity.ElectionStatus;

import java.time.OffsetDateTime;

public record ElectionStatusDto(
        String code,
        String title,
        ElectionStatus status,
        OffsetDateTime startsAt,
        OffsetDateTime endsAt
) {
}