package com.election.vote_system.service;

import com.election.vote_system.dto.CandidateDto;
import com.election.vote_system.dto.CandidateResultDto;
import com.election.vote_system.dto.ElectionResultsDto;
import com.election.vote_system.dto.ElectionStatusDto;
import com.election.vote_system.dto.ElectorStatusDto;
import com.election.vote_system.dto.ElectorSummaryDto;
import com.election.vote_system.dto.UpdateElectionStatusRequest;
import com.election.vote_system.entity.Election;
import com.election.vote_system.entity.Elector;
import com.election.vote_system.repository.CandidateRepository;
import com.election.vote_system.repository.ElectionRepository;
import com.election.vote_system.repository.ElectorRepository;
import com.election.vote_system.repository.VoteRepository;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.data.domain.Sort;
import org.springframework.web.server.ResponseStatusException;

import java.util.List;
import java.util.Optional;

@Service
public class ElectionService {

    private final ElectionRepository electionRepository;
    private final ElectorRepository electorRepository;
    private final CandidateRepository candidateRepository;
    private final VoteRepository voteRepository;

    public ElectionService(ElectionRepository electionRepository,
                           ElectorRepository electorRepository,
                           CandidateRepository candidateRepository,
                           VoteRepository voteRepository) {
        this.electionRepository = electionRepository;
        this.electorRepository = electorRepository;
        this.candidateRepository = candidateRepository;
        this.voteRepository = voteRepository;
    }

    @Transactional(readOnly = true)
    public List<CandidateDto> getCandidates(String electionCode) {
        requireElection(electionCode);
        return candidateRepository.findByElectionCodeOrderByCandidateNumberAsc(electionCode)
                .stream()
                .map(candidate -> new CandidateDto(
                        candidate.getId(),
                        candidate.getCandidateNumber(),
                        candidate.getFullName(),
                        candidate.getDisplayName(),
                        candidate.getBiography(),
                        candidate.getPhotoUrl()
                ))
                .toList();
    }

    @Transactional(readOnly = true)
    public ElectorStatusDto getElectorStatus(String electionCode, String voterCode) {
        requireElection(electionCode);
        Elector elector = requireElector(voterCode);
        return new ElectorStatusDto(
                elector.getVoterCode(),
                elector.getFullName(),
                elector.getPromotionLabel(),
                elector.isHasVoted(),
                elector.getVotedAt(),
                elector.getVotingChannel()
        );
    }

    @Transactional(readOnly = true)
    public ElectionStatusDto getElectionStatus(String electionCode) {
        Election election = requireElection(electionCode);
        return new ElectionStatusDto(
                election.getCode(),
                election.getTitle(),
                election.getStatus(),
                election.getStartsAt(),
                election.getEndsAt()
        );
    }

    @Transactional
    public ElectionStatusDto updateElectionStatus(String electionCode, UpdateElectionStatusRequest request) {
        if (request == null || request.status() == null) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "status is required");
        }

        Election election = requireElection(electionCode);
        election.setStatus(request.status());
        election = electionRepository.save(election);

        return new ElectionStatusDto(
                election.getCode(),
                election.getTitle(),
                election.getStatus(),
                election.getStartsAt(),
                election.getEndsAt()
        );
    }

    @Transactional(readOnly = true)
    public ElectionResultsDto getResults(String electionCode) {
        Election election = requireElection(electionCode);
        long totalVotes = voteRepository.countByElection_Code(electionCode);

        var candidateResults = candidateRepository.findResultsByElectionCode(electionCode)
                .stream()
                .map(result -> new CandidateResultDto(
                        result.getCandidateId(),
                        result.getCandidateNumber(),
                        result.getFullName(),
                        result.getVoteCount()
                ))
                .toList();

        return new ElectionResultsDto(election.getCode(), election.getStatus(), totalVotes, candidateResults);
    }

    @Transactional(readOnly = true)
    public List<ElectorSummaryDto> getElectors(String electionCode) {
        requireElection(electionCode);

        return electorRepository.findAll(Sort.by(Sort.Direction.ASC, "fullName"))
                .stream()
                .map(elector -> new ElectorSummaryDto(
                        elector.getVoterCode(),
                        elector.getFullName(),
                        elector.getPromotionLabel(),
                        elector.getStatus(),
                        elector.isHasVoted(),
                        elector.getVotedAt(),
                        elector.getVotingChannel()
                ))
                .toList();
    }

    public Election requireElection(String electionCode) {
        return electionRepository.findByCode(electionCode)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Election not found"));
    }

    public Elector requireElector(String voterCode) {
        return electorRepository.findByVoterCodeOrNationalId(voterCode, voterCode)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Elector not found"));
    }
}