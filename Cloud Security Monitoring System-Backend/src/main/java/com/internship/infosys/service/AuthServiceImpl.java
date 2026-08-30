package com.internship.infosys.service;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import com.internship.infosys.security.JwtUtil;
import com.internship.infosys.dto.LoginRequest;
import com.internship.infosys.dto.LoginResponse;
import com.internship.infosys.dto.RegisterRequest;
import com.internship.infosys.model.Role;
import com.internship.infosys.model.User;
import com.internship.infosys.repositary.UserRepository;

@Service
public class AuthServiceImpl implements AuthService {

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private PasswordEncoder passwordEncoder;

    @Autowired
    private JwtUtil jwtUtil;

    @Autowired
    private AuthenticationManager authenticationManager;

    // ===========================
    // REGISTER
    // ===========================

    @Override
    public String register(RegisterRequest request) {

        if (userRepository.existsByEmail(request.getEmail())) {
            throw new RuntimeException("Email already exists.");
        }

        if (userRepository.existsByUsername(request.getUsername())) {
            throw new RuntimeException("Username already exists.");
        }

        User user = new User();

        user.setUsername(request.getUsername());

        user.setEmail(request.getEmail());

        user.setDepartment(request.getDepartment());

        user.setPassword(
                passwordEncoder.encode(request.getPassword()));

        // Default Role

        if (request.getRole() == null) {
            user.setRole(Role.USER);
        } else {
            user.setRole(request.getRole());
        }

        userRepository.save(user);

        return "Registration Successful";
    }

    // ===========================
    // LOGIN
    // ===========================

    @Override
    public LoginResponse login(LoginRequest request) {

        authenticationManager.authenticate(

                new UsernamePasswordAuthenticationToken(

                        request.getEmail(),

                        request.getPassword()

                )

        );

        User user = userRepository
                .findByEmail(request.getEmail())
                .orElseThrow(() ->
                        new RuntimeException("User not found"));

        // Store current date & time as lastLogin
        try {
            java.time.LocalDateTime now = java.time.LocalDateTime.now();
            java.time.format.DateTimeFormatter formatter = java.time.format.DateTimeFormatter.ofPattern("MMM dd, yyyy, hh:mm a");
            user.setLastLogin(now.format(formatter));
            user.setEnabled(true);
            userRepository.save(user);
        } catch (Exception e) {
            // Ignore format errors
        }

        String token = jwtUtil.generateToken(user.getEmail());

        LoginResponse response = new LoginResponse();

        response.setId(user.getId());

        response.setToken(token);

        response.setUsername(user.getUsername());

        response.setEmail(user.getEmail());

        response.setDepartment(user.getDepartment());

        response.setRole(user.getRole());

        return response;

    }

}