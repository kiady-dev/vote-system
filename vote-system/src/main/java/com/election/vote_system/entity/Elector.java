package com.election.vote_system.entity;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.EnumType;
import jakarta.persistence.Enumerated;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.PrePersist;
import jakarta.persistence.Table;

import java.time.LocalDate;
import java.time.OffsetDateTime;

@Entity
@Table(name = "electors")
public class Elector {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(name = "voter_code", nullable = false, unique = true)
    private String voterCode;

    @Column(name = "national_id", unique = true)
    private String nationalId;

    @Column(name = "full_name", nullable = false)
    private String fullName;

    @Column(name = "promotion_label", nullable = false)
    private String promotionLabel;

    @Column(name = "voting_password_hash")
    private String votingPasswordHash;

    private String phone;

    private String email;

    @Column(name = "date_of_birth")
    private LocalDate dateOfBirth;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private ElectorStatus status = ElectorStatus.ACTIVE;

    @Column(name = "has_voted", nullable = false)
    private boolean hasVoted;

    @Column(name = "voted_at")
    private OffsetDateTime votedAt;

    @Enumerated(EnumType.STRING)
    @Column(name = "voting_channel")
    private VotingChannel votingChannel;

    @Column(name = "created_at", nullable = false, updatable = false)
    private OffsetDateTime createdAt;

    @PrePersist
    void prePersist() {
        if (createdAt == null) {
            createdAt = OffsetDateTime.now();
        }
    }

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public String getVoterCode() {
        return voterCode;
    }

    public void setVoterCode(String voterCode) {
        this.voterCode = voterCode;
    }

    public String getNationalId() {
        return nationalId;
    }

    public void setNationalId(String nationalId) {
        this.nationalId = nationalId;
    }

    public String getFullName() {
        return fullName;
    }

    public void setFullName(String fullName) {
        this.fullName = fullName;
    }

    public String getPromotionLabel() {
        return promotionLabel;
    }

    public void setPromotionLabel(String promotionLabel) {
        this.promotionLabel = promotionLabel;
    }

    public String getVotingPasswordHash() {
        return votingPasswordHash;
    }

    public void setVotingPasswordHash(String votingPasswordHash) {
        this.votingPasswordHash = votingPasswordHash;
    }

    public String getPhone() {
        return phone;
    }

    public void setPhone(String phone) {
        this.phone = phone;
    }

    public String getEmail() {
        return email;
    }

    public void setEmail(String email) {
        this.email = email;
    }

    public LocalDate getDateOfBirth() {
        return dateOfBirth;
    }

    public void setDateOfBirth(LocalDate dateOfBirth) {
        this.dateOfBirth = dateOfBirth;
    }

    public ElectorStatus getStatus() {
        return status;
    }

    public void setStatus(ElectorStatus status) {
        this.status = status;
    }

    public boolean isHasVoted() {
        return hasVoted;
    }

    public void setHasVoted(boolean hasVoted) {
        this.hasVoted = hasVoted;
    }

    public OffsetDateTime getVotedAt() {
        return votedAt;
    }

    public void setVotedAt(OffsetDateTime votedAt) {
        this.votedAt = votedAt;
    }

    public VotingChannel getVotingChannel() {
        return votingChannel;
    }

    public void setVotingChannel(VotingChannel votingChannel) {
        this.votingChannel = votingChannel;
    }

    public OffsetDateTime getCreatedAt() {
        return createdAt;
    }

    public void setCreatedAt(OffsetDateTime createdAt) {
        this.createdAt = createdAt;
    }
}