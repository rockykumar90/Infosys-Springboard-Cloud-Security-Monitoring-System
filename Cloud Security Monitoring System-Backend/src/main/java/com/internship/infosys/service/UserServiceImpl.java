package com.internship.infosys.service;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import com.internship.infosys.model.User;
import com.internship.infosys.repositary.UserRepository;

@Service
public class UserServiceImpl implements UserService {

    @Autowired
    private UserRepository repository;

    @Autowired
    private PasswordEncoder encoder;

    @Override
    public User getCurrentUser() {

        Authentication authentication =
                SecurityContextHolder
                        .getContext()
                        .getAuthentication();

        String email = authentication.getName();

        return repository.findByEmail(email)
                .orElseThrow(() ->
                        new RuntimeException("User not found"));
    }

    @Override
    public List<User> getAllUsers() {

        return repository.findAll();

    }

    @Override
    public User getUser(Long id) {

        return repository.findById(id)
                .orElseThrow(() ->
                        new RuntimeException("User not found"));

    }

    @Override
    public User updateUser(Long id, User updatedUser) {

        User user = repository.findById(id)
                .orElseThrow(() ->
                        new RuntimeException("User not found"));

        user.setUsername(updatedUser.getUsername());
        user.setEmail(updatedUser.getEmail());
        user.setDepartment(updatedUser.getDepartment());
        user.setRole(updatedUser.getRole());
        if (updatedUser.getEnabled() != null) {
            user.setEnabled(updatedUser.getEnabled());
        }

        if (updatedUser.getPassword() != null &&
                !updatedUser.getPassword().isBlank()) {

            user.setPassword(
                    encoder.encode(updatedUser.getPassword()));
        }

        return repository.save(user);
    }

    @Override
    public void deleteUser(Long id) {

        User user = repository.findById(id)
                .orElseThrow(() ->
                        new RuntimeException("User not found"));

        repository.delete(user);

    }

}