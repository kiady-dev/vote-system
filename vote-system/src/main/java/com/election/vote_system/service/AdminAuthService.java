package com.election.vote_system.service;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.util.StringUtils;
import org.springframework.web.server.ResponseStatusException;

@Service
public class AdminAuthService {

    private final String adminToken;

    public AdminAuthService(@Value("${app.admin.token:}") String adminToken) {
        this.adminToken = adminToken;
    }

    public void requireAdmin(String providedToken) {
        if (!StringUtils.hasText(adminToken)) {
            throw new ResponseStatusException(HttpStatus.FORBIDDEN, "Admin token is not configured");
        }
        if (!StringUtils.hasText(providedToken)) {
            throw new ResponseStatusException(HttpStatus.FORBIDDEN, "Admin token is required");
        }
        if (!adminToken.equals(providedToken)) {
            throw new ResponseStatusException(HttpStatus.FORBIDDEN, "Invalid admin token");
        }
    }
}