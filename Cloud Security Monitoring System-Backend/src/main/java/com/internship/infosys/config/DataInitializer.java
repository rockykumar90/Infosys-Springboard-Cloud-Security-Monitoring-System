package com.internship.infosys.config;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.List;

import org.springframework.boot.CommandLineRunner;
import org.springframework.stereotype.Component;

import com.internship.infosys.model.Asset;
import com.internship.infosys.repositary.AssetRepository;

@Component
public class DataInitializer implements CommandLineRunner {

    private final AssetRepository assetRepository;

    public DataInitializer(AssetRepository assetRepository) {
        this.assetRepository = assetRepository;
    }

    @Override
    public void run(String... args) throws Exception {
        if (assetRepository.count() == 0) {
            System.out.println(">>> Initializing 4 default enterprise security assets...");

            Asset a1 = new Asset();
            a1.setAssetName("Prod-Web-Server-01");
            a1.setAssetType("Server");
            a1.setDescription("Primary production web application server hosting core microservices");
            a1.setManufacturer("Dell Technologies");
            a1.setModel("PowerEdge R750");
            a1.setSerialNumber("SN-DELL-99201");
            a1.setAssetTag("AST-SEC-101");
            a1.setDeviceType("Rack Server");
            a1.setOwner("Hemanth Reddy");
            a1.setDepartment("IT Infrastructure");
            a1.setAssignedDepartment("DevOps");
            a1.setAssignedUser("Hemanth");
            a1.setAssignedBy("System Admin");
            a1.setAssignmentStatus("Assigned");
            a1.setAssignedDate(LocalDate.now().minusMonths(2));
            a1.setLocation("Data Center A - Rack 04");
            a1.setHostname("prod-web-01.company.local");
            a1.setIpAddress("192.168.1.10");
            a1.setMacAddress("00:1A:2B:3C:4D:5E");
            a1.setGateway("192.168.1.1");
            a1.setSubnetMask("255.255.255.0");
            a1.setDnsServer("8.8.8.8");
            a1.setOperatingSystem("Ubuntu Linux");
            a1.setOsVersion("22.04 LTS");
            a1.setArchitecture("x86_64");
            a1.setProcessor("Intel Xeon Gold 6330 @ 2.00GHz");
            a1.setCpuCores(16);
            a1.setCpuUsage(34);
            a1.setMemoryUsage(48);
            a1.setDiskUsage(52);
            a1.setNetworkUsage(28);
            a1.setGpuUsage(0);
            a1.setStatus("ACTIVE");
            a1.setHealth("Healthy");
            a1.setRiskScore(12);
            a1.setAvailability(99.99);
            a1.setVulnerabilityCount(0);
            a1.setIncidentCount(0);
            a1.setPatchLevel("Latest");
            a1.setDiscoveredBy("OSHI Automatic Discovery");
            a1.setScanStatus("Completed");
            a1.setScanDuration("45s");

            Asset a2 = new Asset();
            a2.setAssetName("Core-Database-Cluster");
            a2.setAssetType("Database Server");
            a2.setDescription("Production PostgreSQL database cluster handling core transactional data");
            a2.setManufacturer("HP Enterprise");
            a2.setModel("ProLiant DL380");
            a2.setSerialNumber("SN-HPE-88310");
            a2.setAssetTag("AST-DB-202");
            a2.setDeviceType("Database Cluster");
            a2.setOwner("Rocky Kumar");
            a2.setDepartment("Database Operations");
            a2.setAssignedDepartment("Database Team");
            a2.setAssignedUser("Rocky");
            a2.setAssignedBy("DBA Lead");
            a2.setAssignmentStatus("Assigned");
            a2.setAssignedDate(LocalDate.now().minusMonths(3));
            a2.setLocation("Data Center A - Rack 08");
            a2.setHostname("db-cluster-master.internal");
            a2.setIpAddress("192.168.1.20");
            a2.setMacAddress("00:1A:2B:99:88:77");
            a2.setGateway("192.168.1.1");
            a2.setSubnetMask("255.255.255.0");
            a2.setDnsServer("8.8.8.8");
            a2.setOperatingSystem("Red Hat Enterprise Linux");
            a2.setOsVersion("9.2");
            a2.setArchitecture("x86_64");
            a2.setProcessor("AMD EPYC 7763 64-Core Processor");
            a2.setCpuCores(32);
            a2.setCpuUsage(58);
            a2.setMemoryUsage(72);
            a2.setDiskUsage(64);
            a2.setNetworkUsage(45);
            a2.setGpuUsage(0);
            a2.setStatus("ACTIVE");
            a2.setHealth("Healthy");
            a2.setRiskScore(8);
            a2.setAvailability(99.99);
            a2.setVulnerabilityCount(0);
            a2.setIncidentCount(0);
            a2.setPatchLevel("Latest");
            a2.setDiscoveredBy("OSHI Network Scan");
            a2.setScanStatus("Completed");
            a2.setScanDuration("60s");

            Asset a3 = new Asset();
            a3.setAssetName("SecOps-Gateway-Firewall");
            a3.setAssetType("Network Gateway");
            a3.setDescription("Perimeter security firewall and intrusion prevention system (IPS)");
            a3.setManufacturer("Palo Alto Networks");
            a3.setModel("PA-3220");
            a3.setSerialNumber("SN-PALO-77110");
            a3.setAssetTag("AST-SEC-303");
            a3.setDeviceType("Hardware Firewall");
            a3.setOwner("Security Team");
            a3.setDepartment("Cyber Security");
            a3.setAssignedDepartment("SecOps");
            a3.setAssignedUser("SecOps Lead");
            a3.setAssignedBy("CISO Office");
            a3.setAssignmentStatus("Assigned");
            a3.setAssignedDate(LocalDate.now().minusMonths(6));
            a3.setLocation("Network Control Room");
            a3.setHostname("fw-primary.gateway.local");
            a3.setIpAddress("192.168.1.1");
            a3.setMacAddress("00:1A:2B:11:22:33");
            a3.setGateway("192.168.1.254");
            a3.setSubnetMask("255.255.255.0");
            a3.setDnsServer("1.1.1.1");
            a3.setOperatingSystem("PAN-OS");
            a3.setOsVersion("10.2");
            a3.setArchitecture("Security ASIC");
            a3.setProcessor("Multi-Core Security Engine");
            a3.setCpuCores(8);
            a3.setCpuUsage(22);
            a3.setMemoryUsage(35);
            a3.setDiskUsage(20);
            a3.setNetworkUsage(85);
            a3.setGpuUsage(0);
            a3.setStatus("ACTIVE");
            a3.setHealth("Healthy");
            a3.setRiskScore(15);
            a3.setAvailability(99.95);
            a3.setVulnerabilityCount(1);
            a3.setIncidentCount(0);
            a3.setPatchLevel("Pending Update");
            a3.setDiscoveredBy("Security Audit");
            a3.setScanStatus("Completed");
            a3.setScanDuration("30s");

            Asset a4 = new Asset();
            a4.setAssetName("Dev-Workstation-MacBook");
            a4.setAssetType("Workstation");
            a4.setDescription("Developer workstation assigned for Cloud Security Operations testing");
            a4.setManufacturer("Apple");
            a4.setModel("MacBook Pro 16-inch");
            a4.setSerialNumber("SN-APL-55443");
            a4.setAssetTag("AST-DEV-404");
            a4.setDeviceType("Laptop");
            a4.setOwner("Developer Admin");
            a4.setDepartment("Software Engineering");
            a4.setAssignedDepartment("Engineering");
            a4.setAssignedUser("Developer");
            a4.setAssignedBy("IT Helpdesk");
            a4.setAssignmentStatus("Assigned");
            a4.setAssignedDate(LocalDate.now().minusWeeks(2));
            a4.setLocation("Office Floor 3 - Desk 12");
            a4.setHostname("macbook-dev-04.local");
            a4.setIpAddress("192.168.1.45");
            a4.setMacAddress("F4:D4:88:AA:BB:CC");
            a4.setGateway("192.168.1.1");
            a4.setSubnetMask("255.255.255.0");
            a4.setDnsServer("8.8.8.8");
            a4.setOperatingSystem("macOS Sequoia");
            a4.setOsVersion("15.1");
            a4.setArchitecture("arm64 (Apple Silicon)");
            a4.setProcessor("Apple M3 Max");
            a4.setCpuCores(14);
            a4.setCpuUsage(18);
            a4.setMemoryUsage(42);
            a4.setDiskUsage(38);
            a4.setNetworkUsage(15);
            a4.setGpuUsage(10);
            a4.setStatus("ACTIVE");
            a4.setHealth("Healthy");
            a4.setRiskScore(5);
            a4.setAvailability(99.90);
            a4.setVulnerabilityCount(0);
            a4.setIncidentCount(0);
            a4.setPatchLevel("Latest");
            a4.setDiscoveredBy("OSHI Agent");
            a4.setScanStatus("Completed");
            a4.setScanDuration("25s");

            assetRepository.saveAll(List.of(a1, a2, a3, a4));
            System.out.println(">>> 4 Sample Enterprise Security Assets saved successfully!");
        }
    }
}
