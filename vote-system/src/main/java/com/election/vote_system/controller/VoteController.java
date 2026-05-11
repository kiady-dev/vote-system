package com.election.vote_system.controller;

import com.election.vote_system.dto.CastVoteRequest;
import com.election.vote_system.dto.CastVoteResponse;
import com.election.vote_system.service.VoteService;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/elections/{electionCode}/votes")
public class VoteController {

    private final VoteService voteService;

    public VoteController(VoteService voteService) {
        this.voteService = voteService;
    }

    @PostMapping
    public CastVoteResponse castVote(@PathVariable("electionCode") String electionCode,
                                     @RequestBody CastVoteRequest request) {
        return voteService.castVote(electionCode, request);
    }
}