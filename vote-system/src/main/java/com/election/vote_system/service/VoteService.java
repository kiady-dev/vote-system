package com.election.vote_system.service;

import com.election.vote_system.dto.CastVoteRequest;
import com.election.vote_system.dto.CastVoteResponse;
import com.election.vote_system.entity.Candidate;
import com.election.vote_system.entity.Elector;
import com.election.vote_system.entity.Election;
import com.election.vote_system.entity.ElectionStatus;
import com.election.vote_system.entity.Vote;
import com.election.vote_system.repository.CandidateRepository;
import com.election.vote_system.repository.ElectorRepository;
import com.election.vote_system.repository.VoteRepository;
import org.springframework.dao.DataIntegrityViolationException;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.util.StringUtils;
import org.springframework.web.server.ResponseStatusException;

import java.net.InetAddress;
import java.net.UnknownHostException;
import java.time.OffsetDateTime;
import java.util.Locale;
import java.util.UUID;

@Service
public class VoteService {

    private final ElectionService electionService;
    private final ElectorAccessService electorAccessService;
    private final ElectorRepository electorRepository;
    private final CandidateRepository candidateRepository;
    private final VoteRepository voteRepository;

    public VoteService(ElectionService electionService,
                       ElectorAccessService electorAccessService,
                       ElectorRepository electorRepository,
                       CandidateRepository candidateRepository,
                       VoteRepository voteRepository) {
        this.electionService = electionService;
        this.electorAccessService = electorAccessService;
        this.electorRepository = electorRepository;
        this.candidateRepository = candidateRepository;
        this.voteRepository = voteRepository;
    }

    @Transactional
    public CastVoteResponse castVote(String electionCode, CastVoteRequest request) {
        if (request == null) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Request body is required");
        }
        if (!StringUtils.hasText(request.voterCode())) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "voterCode is required");
        }
        if (!StringUtils.hasText(request.votingPassword())) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "votingPassword is required");
        }
        if (request.candidateNumber() == null) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "candidateNumber is required");
        }
        if (request.votingChannel() == null) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "votingChannel is required");
        }

        Election election = electionService.requireElection(electionCode);
        if (election.getStatus() != ElectionStatus.OPEN) {
            throw new ResponseStatusException(HttpStatus.FORBIDDEN, "Election is not open");
        }
        Elector elector = electorAccessService.verifyAccess(electionCode, request.voterCode(), request.votingPassword());

        Candidate candidate = candidateRepository.findByElectionCodeAndCandidateNumber(electionCode, request.candidateNumber())
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Candidate not found"));

        if (elector.isHasVoted() || voteRepository.existsVoteForElector(election.getId(), elector.getId())) {
            throw new ResponseStatusException(HttpStatus.CONFLICT, "Elector has already voted");
        }

        Vote vote = new Vote();
        vote.setElection(election);
        vote.setElector(elector);
        vote.setCandidate(candidate);
        vote.setVotingChannel(request.votingChannel());
        vote.setCastAt(OffsetDateTime.now());
        vote.setRecordedBy(request.recordedBy());
        vote.setIpAddress(parseIpAddress(request.ipAddress()));
        vote.setUserAgent(request.userAgent());
        vote.setReceiptCode(generateReceiptCode());

        try {
            vote = voteRepository.save(vote);
        } catch (DataIntegrityViolationException exception) {
            throw new ResponseStatusException(HttpStatus.CONFLICT, "Elector has already voted", exception);
        }

        elector.setHasVoted(true);
        elector.setVotedAt(vote.getCastAt());
        elector.setVotingChannel(request.votingChannel());
        electorRepository.save(elector);

        return new CastVoteResponse(
                vote.getId(),
                vote.getReceiptCode(),
                election.getCode(),
                elector.getVoterCode(),
                candidate.getId(),
                candidate.getCandidateNumber(),
                candidate.getFullName(),
                vote.getVotingChannel(),
                vote.getCastAt()
        );
    }

    private String generateReceiptCode() {
        return "VOTE-" + UUID.randomUUID().toString().substring(0, 12).toUpperCase(Locale.ROOT);
    }

    private InetAddress parseIpAddress(String ipAddress) {
        if (!StringUtils.hasText(ipAddress)) {
            return null;
        }

        try {
            return InetAddress.getByName(ipAddress.trim());
        } catch (UnknownHostException exception) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Invalid IP address", exception);
        }
    }
}