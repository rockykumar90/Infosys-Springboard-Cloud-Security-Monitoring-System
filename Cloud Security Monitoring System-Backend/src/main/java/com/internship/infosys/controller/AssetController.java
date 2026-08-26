package com.internship.infosys.controller;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import com.internship.infosys.dto.AssetRequest;
import com.internship.infosys.dto.AssetResponse;
import com.internship.infosys.service.AssetService;

@RestController
@RequestMapping("/api/assets")
public class AssetController {

    @Autowired
    private AssetService assetService;

    // =========================================================
    // Create Asset
    // =========================================================

    @PostMapping
    @PreAuthorize("hasAnyRole('ADMIN','ITSM')")
    public ResponseEntity<AssetResponse> createAsset(
            @RequestBody AssetRequest request) {

        AssetResponse response = assetService.createAsset(request);

        return new ResponseEntity<>(response, HttpStatus.CREATED);
    }

    // =========================================================
    // Get All Assets
    // =========================================================

    @GetMapping
    @PreAuthorize("hasAnyRole('ADMIN','ITSM','USER')")
    public ResponseEntity<List<AssetResponse>> getAllAssets() {

        return ResponseEntity.ok(assetService.getAllAssets());
    }

    // =========================================================
    // Get Asset By Id
    // =========================================================

    @GetMapping("/{id}")
    @PreAuthorize("hasAnyRole('ADMIN','ITSM','USER')")
    public ResponseEntity<AssetResponse> getAssetById(
            @PathVariable Long id) {

        return ResponseEntity.ok(assetService.getAssetById(id));
    }

    // =========================================================
    // Update Asset
    // =========================================================

    @PutMapping("/{id}")
    @PreAuthorize("hasAnyRole('ADMIN','ITSM')")
    public ResponseEntity<AssetResponse> updateAsset(
            @PathVariable Long id,
            @RequestBody AssetRequest request) {

        return ResponseEntity.ok(
                assetService.updateAsset(id, request));
    }

    // =========================================================
    // Delete Asset
    // =========================================================

    @DeleteMapping("/{id}")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<String> deleteAsset(
            @PathVariable Long id) {

        assetService.deleteAsset(id);

        return ResponseEntity.ok("Asset deleted successfully.");
    }

    // =========================================================
    // Auto Discovery
    // =========================================================

    @GetMapping("/discover")
    @PreAuthorize("hasAnyRole('ADMIN','ITSM')")
    public ResponseEntity<List<AssetResponse>> discoverAssets() {

        return ResponseEntity.ok(
                assetService.discoverAssets());
    }

    // =========================================================
    // Scan Network
    // Example:
    // /api/assets/scan?subnet=192.168.1
    // =========================================================

    @GetMapping("/scan")
    @PreAuthorize("hasAnyRole('ADMIN','ITSM')")
    public ResponseEntity<List<AssetResponse>> scanNetwork(
            @RequestParam String subnet) {

        return ResponseEntity.ok(
                assetService.scanNetwork(subnet));
    }

    // =========================================================
    // Search Assets
    // =========================================================

    @GetMapping("/search")
    @PreAuthorize("hasAnyRole('ADMIN','ITSM','USER')")
    public ResponseEntity<List<AssetResponse>> searchAssets(
            @RequestParam String keyword) {

        return ResponseEntity.ok(
                assetService.searchAssets(keyword));
    }

    // =========================================================
    // Department Assets
    // =========================================================

    @GetMapping("/department/{department}")
    @PreAuthorize("hasAnyRole('ADMIN','ITSM','USER')")
    public ResponseEntity<List<AssetResponse>> getDepartmentAssets(
            @PathVariable String department) {

        return ResponseEntity.ok(
                assetService.getAssetsByDepartment(department));
    }

    // =========================================================
    // Owner Assets
    // =========================================================

    @GetMapping("/owner/{owner}")
    @PreAuthorize("hasAnyRole('ADMIN','ITSM','USER')")
    public ResponseEntity<List<AssetResponse>> getOwnerAssets(
            @PathVariable String owner) {

        return ResponseEntity.ok(
                assetService.getAssetsByOwner(owner));
    }

    // =========================================================
    // Status Assets
    // =========================================================

    @GetMapping("/status/{status}")
    @PreAuthorize("hasAnyRole('ADMIN','ITSM','USER')")
    public ResponseEntity<List<AssetResponse>> getStatusAssets(
            @PathVariable String status) {

        return ResponseEntity.ok(
                assetService.getAssetsByStatus(status));
    }

    // =========================================================
    // Health Assets
    // =========================================================

    @GetMapping("/health/{health}")
    @PreAuthorize("hasAnyRole('ADMIN','ITSM','USER')")
    public ResponseEntity<List<AssetResponse>> getHealthAssets(
            @PathVariable String health) {

        return ResponseEntity.ok(
                assetService.getAssetsByHealth(health));
    }

    // =========================================================
    // Assets Assigned to Logged-in User
    // =========================================================

    @GetMapping("/my-assets/{username}")
    @PreAuthorize("hasAnyRole('ADMIN','ITSM','USER')")
    public ResponseEntity<List<AssetResponse>> getMyAssets(
            @PathVariable String username) {

        return ResponseEntity.ok(
                assetService.getAssetsByOwner(username));
    }

    // =========================================================
    // Dashboard Assets
    // =========================================================

    @GetMapping("/dashboard/{department}")
    @PreAuthorize("hasAnyRole('ADMIN','ITSM','USER')")
    public ResponseEntity<List<AssetResponse>> getDashboardAssets(
            @PathVariable String department) {

        return ResponseEntity.ok(
                assetService.getAssetsByDepartment(department));
    }

}