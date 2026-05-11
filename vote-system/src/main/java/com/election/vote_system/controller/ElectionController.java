package com.election.vote_system.controller;

import com.election.vote_system.dto.AdminLoginRequest;
import com.election.vote_system.dto.CandidateDto;
import com.election.vote_system.dto.ElectionResultsDto;
import com.election.vote_system.dto.ElectionStatusDto;
import com.election.vote_system.dto.ElectorLoginRequest;
import com.election.vote_system.dto.ElectorSummaryDto;
import com.election.vote_system.dto.ElectorStatusDto;
import com.election.vote_system.dto.UpdateElectionStatusRequest;
import com.election.vote_system.service.ElectionService;
import com.election.vote_system.service.AdminAuthService;
import com.election.vote_system.service.ElectorAccessService;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PatchMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestHeader;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@RestController
@RequestMapping("/api/elections/{electionCode}")
public class ElectionController {

    private final ElectionService electionService;
    private final ElectorAccessService electorAccessService;
    private final AdminAuthService adminAuthService;

    public ElectionController(ElectionService electionService,
                              ElectorAccessService electorAccessService,
                              AdminAuthService adminAuthService) {
        this.electionService = electionService;
        this.electorAccessService = electorAccessService;
        this.adminAuthService = adminAuthService;
    }

    @GetMapping("/candidates")
    public List<CandidateDto> getCandidates(@PathVariable("electionCode") String electionCode) {
        return electionService.getCandidates(electionCode);
    }

    @GetMapping
    public ElectionStatusDto getElection(@PathVariable("electionCode") String electionCode) {
        return electionService.getElectionStatus(electionCode);
    }

    @GetMapping("/electors/{voterCode}")
    public ElectorStatusDto getElectorStatus(@PathVariable("electionCode") String electionCode,
                                             @PathVariable("voterCode") String voterCode) {
        return electionService.getElectorStatus(electionCode, voterCode);
    }

    @GetMapping("/electors")
    public List<ElectorSummaryDto> getElectors(@PathVariable("electionCode") String electionCode,
                                               @RequestHeader(value = "X-Admin-Token", required = false) String adminToken) {
        adminAuthService.requireAdmin(adminToken);
        return electionService.getElectors(electionCode);
    }

    @PostMapping("/login")
    public ElectorStatusDto login(@PathVariable("electionCode") String electionCode,
                                  @RequestBody ElectorLoginRequest request) {
        var elector = electorAccessService.verifyAccess(electionCode, request.voterCode(), request.votingPassword());
        return new ElectorStatusDto(
                elector.getVoterCode(),
                elector.getFullName(),
                elector.getPromotionLabel(),
                elector.isHasVoted(),
                elector.getVotedAt(),
                elector.getVotingChannel()
        );
    }

    @PatchMapping("/status")
    public ElectionStatusDto updateStatus(@PathVariable("electionCode") String electionCode,
                                          @RequestHeader(value = "X-Admin-Token", required = false) String adminToken,
                                          @RequestBody UpdateElectionStatusRequest request) {
        adminAuthService.requireAdmin(adminToken);
        return electionService.updateElectionStatus(electionCode, request);
    }

    @PostMapping("/admin/login")
    public void loginAdmin(@PathVariable("electionCode") String electionCode,
                           @RequestBody AdminLoginRequest request) {
        electionService.requireElection(electionCode);
        adminAuthService.requireAdmin(request.adminToken());
    }

    @GetMapping("/results")
    public ElectionResultsDto getResults(@PathVariable("electionCode") String electionCode) {
        return electionService.getResults(electionCode);
    }
}