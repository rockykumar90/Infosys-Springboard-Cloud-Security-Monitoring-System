package com.internship.infosys.dto;

import lombok.Data;

@Data
public class AlertDto {

    private Long id;
    private String severity;
    private String asset;
    private String category;
    private String description;
    private String status;
    private String assignedTo;
    private String source;
    private String createdAt;

    public AlertDto(){}

    public AlertDto(Long id, String severity, String asset, String category,
                    String description, String status, String assignedTo,
                    String source, String createdAt){
        this.id = id;
        this.severity = severity;
        this.asset = asset;
        this.category = category;
        this.description = description;
        this.status = status;
        this.assignedTo = assignedTo;
        this.source = source;
        this.createdAt = createdAt;
    }

    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }

    public String getSeverity() { return severity; }
    public void setSeverity(String severity) { this.severity = severity; }

    public String getAsset() { return asset; }
    public void setAsset(String asset) { this.asset = asset; }

    public String getCategory() { return category; }
    public void setCategory(String category) { this.category = category; }

    public String getDescription() { return description; }
    public void setDescription(String description) { this.description = description; }

    public String getStatus() { return status; }
    public void setStatus(String status) { this.status = status; }

    public String getAssignedTo() { return assignedTo; }
    public void setAssignedTo(String assignedTo) { this.assignedTo = assignedTo; }

    public String getSource() { return source; }
    public void setSource(String source) { this.source = source; }

    public String getCreatedAt() { return createdAt; }
    public void setCreatedAt(String createdAt) { this.createdAt = createdAt; }
}