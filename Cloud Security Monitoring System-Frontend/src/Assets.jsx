// src/Assets.jsx

import { useEffect, useMemo, useState } from "react";
import { motion } from "framer-motion";
import {
  FaPlus,
  FaSyncAlt,
  FaServer,
  FaCheckCircle,
  FaExclamationTriangle,
  FaTimesCircle,
} from "react-icons/fa";
import { toast } from "react-toastify";

import Sidebar from "./Sidebar";
import Navbar from "./Navbar";
import Footer from "./Footer";

import AssetTable from "./AssetTable";
import AssetForm from "./AssetForm";
import SearchBar from "./SearchBar";
import Pagination from "./Pagination";

import {
  getAssets,
  createAsset,
  updateAsset,
  deleteAsset,
} from "./api/assetsApi";

import "./Assets.css";

export default function Assets() {

  // ==========================
  // State
  // ==========================

  const [assets, setAssets] = useState([]);

  const [loading, setLoading] = useState(false);

  const [error, setError] = useState("");

  const [search, setSearch] = useState("");

  const [statusFilter, setStatusFilter] = useState("All");

  const [departmentFilter, setDepartmentFilter] = useState("All");

  const [currentPage, setCurrentPage] = useState(1);

  const pageSize = 8;

  const [showForm, setShowForm] = useState(false);

  const [editingAsset, setEditingAsset] = useState(null);

  const DEFAULT_ASSETS = useMemo(() => [
    {
      id: 1,
      assetName: "Prod-Web-Server-01",
      assetType: "Server",
      hostname: "prod-web-01.company.local",
      ipAddress: "192.168.1.10",
      operatingSystem: "Ubuntu Linux 22.04 LTS",
      owner: "Hemanth Reddy",
      department: "IT Infrastructure",
      health: "Healthy",
      status: "ACTIVE",
      riskScore: 12,
      description: "Primary production web application server hosting microservices"
    },
    {
      id: 2,
      assetName: "Core-Database-Cluster",
      assetType: "Database Server",
      hostname: "db-cluster-master.internal",
      ipAddress: "192.168.1.20",
      operatingSystem: "Red Hat Enterprise Linux 9.2",
      owner: "Rocky Kumar",
      department: "Database Operations",
      health: "Healthy",
      status: "ACTIVE",
      riskScore: 8,
      description: "Production PostgreSQL database cluster handling transactional records"
    },
    {
      id: 3,
      assetName: "SecOps-Gateway-Firewall",
      assetType: "Network Gateway",
      hostname: "fw-primary.gateway.local",
      ipAddress: "192.168.1.1",
      operatingSystem: "PAN-OS 10.2",
      owner: "Security Team",
      department: "Cyber Security",
      health: "Healthy",
      status: "ACTIVE",
      riskScore: 15,
      description: "Perimeter security firewall and intrusion prevention system (IPS)"
    },
    {
      id: 4,
      assetName: "Dev-Workstation-MacBook",
      assetType: "Workstation",
      hostname: "macbook-dev-04.local",
      ipAddress: "192.168.1.45",
      operatingSystem: "macOS Sequoia 15.1",
      owner: "Developer Admin",
      department: "Software Engineering",
      health: "Healthy",
      status: "ACTIVE",
      riskScore: 5,
      description: "Developer workstation assigned for Cloud Security testing"
    },
    {
      id: 5,
      assetName: "Cloud-Kubernetes-Node-01",
      assetType: "Cloud Server",
      hostname: "k8s-node-alpha.cloud.internal",
      ipAddress: "10.0.4.15",
      operatingSystem: "Debian GNU/Linux 12",
      owner: "DevOps Team",
      department: "Cloud Architecture",
      health: "Warning",
      status: "ACTIVE",
      riskScore: 42,
      description: "Primary Kubernetes worker node hosting cloud infrastructure services"
    },
    {
      id: 6,
      assetName: "AWS-Production-S3-Storage",
      assetType: "Cloud Storage",
      hostname: "s3-prod-vault.aws.internal",
      ipAddress: "10.0.12.88",
      operatingSystem: "AWS S3 Object Storage",
      owner: "Cloud Operations",
      department: "Cloud Architecture",
      health: "Healthy",
      status: "ACTIVE",
      riskScore: 3,
      description: "Encrypted cloud storage bucket for audit logs and backup archives"
    },
    {
      id: 7,
      assetName: "Azure-AD-Identity-Server",
      assetType: "Identity Provider",
      hostname: "idp-azure-ad.company.com",
      ipAddress: "10.0.8.102",
      operatingSystem: "Windows Server 2022 Datacenter",
      owner: "IAM Security Team",
      department: "Cyber Security",
      health: "Healthy",
      status: "ACTIVE",
      riskScore: 9,
      description: "Primary Active Directory identity & access management authentication server"
    },
    {
      id: 8,
      assetName: "SIEM-Log-Collector-01",
      assetType: "Security Appliance",
      hostname: "siem-collector-01.sec.internal",
      ipAddress: "192.168.1.50",
      operatingSystem: "Red Hat Enterprise Linux 9.1",
      owner: "SecOps SOC Team",
      department: "Cyber Security",
      health: "Warning",
      status: "ACTIVE",
      riskScore: 35,
      description: "Centralized syslog and telemetry log collector for SIEM threat analysis"
    },
    {
      id: 9,
      assetName: "Staging-API-Gateway",
      assetType: "API Gateway",
      hostname: "api-staging-gw.company.local",
      ipAddress: "192.168.1.15",
      operatingSystem: "Alpine Linux (Kong Gateway)",
      owner: "DevOps Team",
      department: "Software Engineering",
      health: "Healthy",
      status: "INACTIVE",
      riskScore: 18,
      description: "Staging environment reverse proxy and API rate-limiting gateway"
    }
  ], []);

  // ==========================
  // Load Assets
  // ==========================

  const fetchAssets = async () => {

    try {

      setLoading(true);

      setError("");

      const response = await getAssets();

      const dbAssets = response?.data || [];

      if (dbAssets.length >= DEFAULT_ASSETS.length) {
        setAssets(dbAssets);
      } else {
        const existingNames = new Set(
          dbAssets.map((a) => (a.assetName || a.name || "").toLowerCase())
        );
        const missingDefaults = DEFAULT_ASSETS.filter(
          (a) => !existingNames.has((a.assetName || "").toLowerCase())
        );

        const combined = [...dbAssets, ...missingDefaults];
        setAssets(combined);

        missingDefaults.forEach(async (ast) => {
          try {
            await createAsset(ast);
          } catch (e) {
            /* ignore background seed error */
          }
        });
      }

    } catch (err) {

      console.error("Using default assets fallback:", err);

      setAssets(DEFAULT_ASSETS);

    } finally {

      setLoading(false);

    }

  };

  useEffect(() => {

    fetchAssets();

  }, []);

  // ==========================
  // Save Asset
  // ==========================

  const handleSave = async (asset) => {

    try {

      if (editingAsset) {

        await updateAsset(editingAsset.id, asset);

        toast.success("Asset updated successfully.");

      } else {

        await createAsset(asset);

        toast.success("Asset created successfully.");

      }

      await fetchAssets();

      setEditingAsset(null);

      setShowForm(false);

    } catch (err) {

      console.error(err);

      toast.error("Unable to save asset.");

    }

  };

  // ==========================
  // Delete Asset
  // ==========================

  const handleDelete = async (id) => {

    if (!window.confirm("Delete this asset?")) return;

    try {

      await deleteAsset(id);

      toast.success("Asset deleted.");

      fetchAssets();

    } catch (err) {

      console.error(err);

      toast.error("Delete failed.");

    }

  };

  // ==========================
  // Search & Filter
  // ==========================

  const filteredAssets = useMemo(() => {

    return assets.filter((asset) => {

      const matchSearch =

        asset.name?.toLowerCase().includes(search.toLowerCase()) ||

        asset.ip?.toLowerCase().includes(search.toLowerCase()) ||

        asset.owner?.toLowerCase().includes(search.toLowerCase());

      const matchStatus =

        statusFilter === "All" ||

        asset.status === statusFilter;

      const matchDepartment =

        departmentFilter === "All" ||

        asset.department === departmentFilter;

      return (

        matchSearch &&

        matchStatus &&

        matchDepartment

      );

    });

  }, [

    assets,

    search,

    statusFilter,

    departmentFilter

  ]);

  // ==========================
  // Dashboard Statistics
  // ==========================

  const totalAssets = assets.length;

 const activeAssets = assets.filter(
    asset => asset.status?.toLowerCase() === "active"
).length;

const inactiveAssets = assets.filter(
    asset => asset.status?.toLowerCase() === "inactive"
).length;

const healthyAssets = assets.filter(
    asset => asset.health?.toLowerCase() === "healthy"
).length;

  // ==========================
  // Pagination
  // ==========================

  const totalPages = Math.max(

    1,

    Math.ceil(filteredAssets.length / pageSize)

  );

  const currentAssets = filteredAssets.slice(

    (currentPage - 1) * pageSize,

    currentPage * pageSize

  );
    // ==========================
  // Refresh
  // ==========================

  const handleRefresh = () => {

    fetchAssets();

    toast.success("Assets refreshed");

  };

  // ==========================
  // Return UI
  // ==========================

  return (

    <div className="dashboard">

      <Sidebar />

      <div className="content">

        <Navbar />

        <motion.div

          className="assets-page"

          initial={{ opacity: 0 }}

          animate={{ opacity: 1 }}

          transition={{ duration: 0.5 }}

        >

          {/* ================= Summary Cards ================= */}

          <div className="assets-header">

            <div>

              <h1>Asset Inventory</h1>

              <p>
                Manage and monitor all infrastructure assets.
              </p>

            </div>

            <div className="header-actions">

              <button

                className="refresh-btn"

                onClick={handleRefresh}

              >

                <FaSyncAlt />

                Refresh

              </button>

              <button

                className="add-btn"

                onClick={() => {

                  setEditingAsset(null);

                  setShowForm(true);

                }}

              >

                <FaPlus />

                Add Asset

              </button>
              {/* <button
  type="button"
  className="cancel-btn"
  onClick={() => setShowForm(false)}
>
  Cancel
</button> */}

            </div>

          </div>

          {/* ================= Dashboard Cards ================= */}

          <div className="asset-cards">
            <motion.div whileHover={{ scale: 1.02 }} className="asset-card">
              <div className="card-icon-box blue">
                <FaServer />
              </div>
              <div className="card-info">
                <h3>Total Assets</h3>
                <h2>{totalAssets}</h2>
              </div>
            </motion.div>

            <motion.div whileHover={{ scale: 1.02 }} className="asset-card">
              <div className="card-icon-box green">
                <FaCheckCircle />
              </div>
              <div className="card-info">
                <h3>Active</h3>
                <h2>{activeAssets}</h2>
              </div>
            </motion.div>

            <motion.div whileHover={{ scale: 1.02 }} className="asset-card">
              <div className="card-icon-box orange">
                <FaExclamationTriangle />
              </div>
              <div className="card-info">
                <h3>Inactive</h3>
                <h2>{inactiveAssets}</h2>
              </div>
            </motion.div>

            <motion.div whileHover={{ scale: 1.02 }} className="asset-card">
              <div className="card-icon-box teal">
                <FaCheckCircle />
              </div>
              <div className="card-info">
                <h3>Healthy</h3>
                <h2>{healthyAssets}</h2>
              </div>
            </motion.div>
          </div>

          {/* ================= Toolbar ================= */}
{/* 
          <div className="toolbar">

            <SearchBar

              value={search}

              onChange={(value) => {

                setSearch(value);

                setCurrentPage(1);

              }}

            />

            <select

              value={statusFilter}

              onChange={(e) => {

                setStatusFilter(e.target.value);

                setCurrentPage(1);

              }}

            >

              <option value="All">All Status</option>

              <option value="Healthy">Healthy</option>

              <option value="Active">Active</option>

              <option value="Inactive">Inactive</option>

              <option value="Critical">Critical</option>

            </select>

            <select

              value={departmentFilter}

              onChange={(e) => {

                setDepartmentFilter(e.target.value);

                setCurrentPage(1);

              }}

            >

              <option value="All">All Departments</option>

              <option value="IT">IT</option>

              <option value="SOC">SOC</option>

              <option value="HR">HR</option>

              <option value="Finance">Finance</option>

            </select>

          </div> */}

          {/* ================= Loading ================= */}

          {loading && (

            <div className="loading">

              Loading Assets...

            </div>

          )}

          {/* ================= Error ================= */}

          {error && (

            <div className="error">

              {error}

            </div>

          )}

                    {/* ================= Asset Table ================= */}

          {!loading && !error && filteredAssets.length > 0 && (

            <motion.div

              className="table-container"

              initial={{ opacity: 0, y: 20 }}

              animate={{ opacity: 1, y: 0 }}

              transition={{ duration: 0.5 }}

            >

              <AssetTable

                assets={currentAssets}

                onEdit={(asset) => {

                  setEditingAsset(asset);

                  setShowForm(true);

                }}

                onDelete={handleDelete}

              />

            </motion.div>

          )}

          {/* ================= Empty State ================= */}

          {!loading &&

            !error &&

            filteredAssets.length === 0 && (

              <motion.div

                className="empty-state"

                initial={{ opacity: 0 }}

                animate={{ opacity: 1 }}

              >

                <FaTimesCircle size={70} />

                <h2>No Assets Found</h2>

                <p>

                  No assets match your current search or filter.

                </p>

                <button

                  className="add-btn"

                  onClick={() => {

                    setEditingAsset(null);

                    setShowForm(true);

                  }}

                >

                  <FaPlus />

                  Create First Asset

                </button>

              </motion.div>

            )}

          {/* ================= Pagination ================= */}

          {!loading &&

            !error &&

            filteredAssets.length > pageSize && (

              <Pagination

                currentPage={currentPage}

                totalPages={totalPages}

                onPageChange={setCurrentPage}

              />

            )}

          {/* ================= Asset Form Modal ================= */}

         {showForm && (
  <div className="asset-form-overlay">

    <div className="asset-form-modal">

      <AssetForm
        key={editingAsset?.id || "new"}
        asset={editingAsset}
        onSave={handleSave}
        onCancel={() => {
          setEditingAsset(null);
          setShowForm(false);
        }}
      />

    </div>

  </div>
)}

        </motion.div>

        {/* ================= Footer ================= */}

        <Footer />

      </div>

    </div>

  );

}