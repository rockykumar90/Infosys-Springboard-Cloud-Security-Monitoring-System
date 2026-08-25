package com.internship.infosys.dto;

import java.util.List;
import lombok.Data;

@Data
public class DashboardResponse {

    private int assets;
    private int servers;
    private int endpoints;
    private int users;

    private int alerts;
    private int incidents;
    private int vulnerabilities;

    private int healthy;
    private int warning;
    private int critical;
    private int offline;

    private int cpu;
    private int memory;
    private int disk;
    private int network;
    private int gpu;
    private int database;

    private int upload;
    private int download;

    private int latency;
    private int packetLoss;

    private int malware;
    private int phishing;
    private int ransomware;
    private int ddos;

    private int securityScore;

    private double uptime;

    private List<String> cloud;

    private List<String> recommendations;

    private List<String> activities;

    private List<AlertDto> alertList;

    public DashboardResponse() {}

    public int getAssets() { return assets; }
    public void setAssets(int assets) { this.assets = assets; }

    public int getServers() { return servers; }
    public void setServers(int servers) { this.servers = servers; }

    public int getEndpoints() { return endpoints; }
    public void setEndpoints(int endpoints) { this.endpoints = endpoints; }

    public int getUsers() { return users; }
    public void setUsers(int users) { this.users = users; }

    public int getAlerts() { return alerts; }
    public void setAlerts(int alerts) { this.alerts = alerts; }

    public int getIncidents() { return incidents; }
    public void setIncidents(int incidents) { this.incidents = incidents; }

    public int getVulnerabilities() { return vulnerabilities; }
    public void setVulnerabilities(int vulnerabilities) { this.vulnerabilities = vulnerabilities; }

    public int getHealthy() { return healthy; }
    public void setHealthy(int healthy) { this.healthy = healthy; }

    public int getWarning() { return warning; }
    public void setWarning(int warning) { this.warning = warning; }

    public int getCritical() { return critical; }
    public void setCritical(int critical) { this.critical = critical; }

    public int getOffline() { return offline; }
    public void setOffline(int offline) { this.offline = offline; }

    public int getCpu() { return cpu; }
    public void setCpu(int cpu) { this.cpu = cpu; }

    public int getMemory() { return memory; }
    public void setMemory(int memory) { this.memory = memory; }

    public int getDisk() { return disk; }
    public void setDisk(int disk) { this.disk = disk; }

    public int getNetwork() { return network; }
    public void setNetwork(int network) { this.network = network; }

    public int getGpu() { return gpu; }
    public void setGpu(int gpu) { this.gpu = gpu; }

    public int getDatabase() { return database; }
    public void setDatabase(int database) { this.database = database; }

    public int getUpload() { return upload; }
    public void setUpload(int upload) { this.upload = upload; }

    public int getDownload() { return download; }
    public void setDownload(int download) { this.download = download; }

    public int getLatency() { return latency; }
    public void setLatency(int latency) { this.latency = latency; }

    public int getPacketLoss() { return packetLoss; }
    public void setPacketLoss(int packetLoss) { this.packetLoss = packetLoss; }

    public int getMalware() { return malware; }
    public void setMalware(int malware) { this.malware = malware; }

    public int getPhishing() { return phishing; }
    public void setPhishing(int phishing) { this.phishing = phishing; }

    public int getRansomware() { return ransomware; }
    public void setRansomware(int ransomware) { this.ransomware = ransomware; }

    public int getDdos() { return ddos; }
    public void setDdos(int ddos) { this.ddos = ddos; }

    public int getSecurityScore() { return securityScore; }
    public void setSecurityScore(int securityScore) { this.securityScore = securityScore; }

    public double getUptime() { return uptime; }
    public void setUptime(double uptime) { this.uptime = uptime; }

    public List<String> getCloud() { return cloud; }
    public void setCloud(List<String> cloud) { this.cloud = cloud; }

    public List<String> getRecommendations() { return recommendations; }
    public void setRecommendations(List<String> recommendations) { this.recommendations = recommendations; }

    public List<String> getActivities() { return activities; }
    public void setActivities(List<String> activities) { this.activities = activities; }

    public List<AlertDto> getAlertList() { return alertList; }
    public void setAlertList(List<AlertDto> alertList) { this.alertList = alertList; }
}