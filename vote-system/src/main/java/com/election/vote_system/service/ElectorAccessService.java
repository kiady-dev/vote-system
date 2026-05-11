package com.election.vote_system.service;

import com.election.vote_system.entity.Elector;
import org.springframework.http.HttpStatus;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.util.StringUtils;
import org.springframework.web.server.ResponseStatusException;

@Service
public class ElectorAccessService {

    private static final PasswordEncoder PASSWORD_ENCODER = new BCryptPasswordEncoder();

    private final ElectionService electionService;

    public ElectorAccessService(ElectionService electionService) {
        this.electionService = electionService;
    }

    public Elector verifyAccess(String electionCode, String voterCode, String votingPassword) {
        if (!StringUtils.hasText(voterCode)) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "voterCode is required");
        }
        if (!StringUtils.hasText(votingPassword)) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "votingPassword is required");
        }

        electionService.requireElection(electionCode);
        Elector elector = electionService.requireElector(voterCode);

        if (!StringUtils.hasText(elector.getVotingPasswordHash())) {
            throw new ResponseStatusException(HttpStatus.FORBIDDEN, "Voting password is not configured for this elector");
        }
        if (!passwordMatches(votingPassword, elector.getVotingPasswordHash())) {
            throw new ResponseStatusException(HttpStatus.UNAUTHORIZED, "Invalid voting password");
        }

        return elector;
    }

    private boolean passwordMatches(String rawPassword, String storedPassword) {
        if (storedPassword == null) {
            return false;
        }

        if (looksLikeBcryptHash(storedPassword)) {
            return PASSWORD_ENCODER.matches(rawPassword, storedPassword);
        }

        return storedPassword.equals(rawPassword);
    }

    private boolean looksLikeBcryptHash(String value) {
        return value != null && (value.startsWith("$2a$") || value.startsWith("$2b$") || value.startsWith("$2y$"));
    }
}