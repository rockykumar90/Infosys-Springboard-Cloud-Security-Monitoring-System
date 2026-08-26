package com.internship.infosys.controller;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import com.internship.infosys.model.User;
import com.internship.infosys.service.UserService;

@RestController
@RequestMapping("/api/users")
public class UserController {

    @Autowired
    private UserService userService;

    // ====================================
    // Logged In User Profile
    // ====================================

    @GetMapping("/profile")
    @PreAuthorize("hasAnyRole('ADMIN','ITSM','USER')")
    public ResponseEntity<User> profile() {

        return ResponseEntity.ok(
                userService.getCurrentUser());

    }

    // ====================================
    // All Users (ADMIN)
    // ====================================

    @GetMapping
    @PreAuthorize("hasAnyRole('ADMIN','ITSM','USER')")
    public ResponseEntity<List<User>> users() {

        return ResponseEntity.ok(
                userService.getAllUsers());

    }
    // ====================================
    // User By Id
    // ====================================

    @GetMapping("/{id}")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<User> user(
            @PathVariable Long id) {

        return ResponseEntity.ok(
                userService.getUser(id));

    }

    // ====================================
    // Update User
    // ====================================

    @PutMapping("/{id}")
    @PreAuthorize("hasAnyRole('ADMIN','ITSM')")
    public ResponseEntity<User> update(
            @PathVariable Long id,
            @RequestBody User user) {

        return ResponseEntity.ok(
                userService.updateUser(id, user));

    }

    // ====================================
    // Delete User
    // ====================================

    @DeleteMapping("/{id}")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<String> delete(
            @PathVariable Long id) {

        userService.deleteUser(id);

        return ResponseEntity.ok(
                "User Deleted Successfully");

    }

}