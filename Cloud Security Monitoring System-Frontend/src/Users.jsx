// src/Users.jsx

import React, {
  useEffect,
  useMemo,
  useState,
  useRef,
} from "react";

import { motion } from "framer-motion";

import {
  FaUserPlus,
  FaSearch,
  FaEdit,
  FaTrash,
  FaUserShield,
  FaUserTie,
  FaUsers,
  FaSyncAlt,
  FaTimes,
  FaSave,
  FaChevronLeft,
  FaChevronRight,
} from "react-icons/fa";

import { toast } from "react-toastify";

import Sidebar from "./Sidebar";
import Navbar from "./Navbar";
import Footer from "./Footer";
import Pagination from "./Pagination";
import { useAuth } from "./AuthContext";

import API from "./api/axios";

import "./Users.css";

export default function Users() {
  const { user: currentUser } = useAuth();
  const tableRef = useRef(null);

  const scrollTable = (direction) => {
    if (tableRef.current) {
      const scrollAmount = direction === "left" ? -400 : 400;
      tableRef.current.scrollBy({ left: scrollAmount, behavior: "smooth" });
    }
  };

  /* =====================================================
      STATES
  ===================================================== */

  const [users, setUsers] = useState([]);

  const [loading, setLoading] = useState(false);

  const [error, setError] = useState("");

  /* =====================================================
      SEARCH
  ===================================================== */

  const [search, setSearch] = useState("");

  /* =====================================================
      FILTERS
  ===================================================== */

  const [roleFilter, setRoleFilter] =
    useState("ALL");

  const [departmentFilter, setDepartmentFilter] =
    useState("ALL");

  /* =====================================================
      PAGINATION
  ===================================================== */

  const [page, setPage] = useState(1);

  const pageSize = 10;

  /* =====================================================
      EDIT MODAL
  ===================================================== */

  const [showEditModal, setShowEditModal] =
    useState(false);

  const [editingUser, setEditingUser] =
    useState(null);

  const [saving, setSaving] =
    useState(false);

  /* =====================================================
      EDIT FORM
  ===================================================== */

  const [editForm, setEditForm] = useState({

    name: "",

    email: "",

    department: "",

    role: "USER",

    enabled: true,

  });

  /* =====================================================
      LOAD USERS
  ===================================================== */

  const loadUsers = async () => {
    try {
      setLoading(true);
      setError("");

      const response = await API.get("/users");
      let fetchedUsers = Array.isArray(response.data) ? response.data : [];

      const registeredUsers = JSON.parse(localStorage.getItem("registeredUsers") || "[]");
      const defaultUsers = [
        { id: 101, username: "abc", email: "abc@example.com", department: "SOC Operations", role: "ADMIN", enabled: true },
        { id: 102, username: "rocky", email: "rocky@rocky.com", department: "Cyber Security", role: "USER", enabled: true },
        { id: 103, username: "hemanth", email: "hemanth@example.com", department: "IT Infrastructure", role: "ITSM", enabled: true },
      ];

      const disabledEmails = JSON.parse(localStorage.getItem("disabled_user_emails") || "[]");

      const mergedMap = new Map();
      [...defaultUsers, ...registeredUsers, ...fetchedUsers].forEach((u) => {
        if (u && u.email) {
          const emailKey = String(u.email || "").toLowerCase().trim();
          const isDisabled = disabledEmails.includes(emailKey);
          mergedMap.set(emailKey, {
            ...u,
            enabled: !isDisabled && u.enabled !== false,
            status: isDisabled ? "Disabled" : (u.status || "Active")
          });
        }
      });

      setUsers(Array.from(mergedMap.values()));
    } catch (err) {
      console.warn("Load Users warning, using local fallback:", err?.message);

      const registeredUsers = JSON.parse(localStorage.getItem("registeredUsers") || "[]");
      const disabledEmails = JSON.parse(localStorage.getItem("disabled_user_emails") || "[]");
      const defaultUsers = [
        { id: 101, username: "abc", email: "abc@example.com", department: "SOC Operations", role: "ADMIN", enabled: true },
        { id: 102, username: "rocky", email: "rocky@rocky.com", department: "Cyber Security", role: "USER", enabled: true },
        { id: 103, username: "hemanth", email: "hemanth@example.com", department: "IT Infrastructure", role: "ITSM", enabled: true },
      ];

      const mergedMap = new Map();
      [...defaultUsers, ...registeredUsers].forEach((u) => {
        if (u && u.email) {
          const emailKey = String(u.email || "").toLowerCase().trim();
          const isDisabled = disabledEmails.includes(emailKey);
          mergedMap.set(emailKey, {
            ...u,
            enabled: !isDisabled && u.enabled !== false,
            status: isDisabled ? "Disabled" : (u.status || "Active")
          });
        }
      });

      setUsers(Array.from(mergedMap.values()));
    } finally {
      setLoading(false);
    }
  };

  /* =====================================================
      INITIAL LOAD
  ===================================================== */

  useEffect(() => {

    loadUsers();

  }, []);

  /* =====================================================
      DELETE USER
  ===================================================== */

  const deleteUser = async (id) => {

    if (
      !window.confirm(
        "Are you sure you want to delete this user?"
      )
    ) {
      return;
    }

    try {

      await API.delete(
        `/users/${id}`
      );

      toast.success(
        "User deleted successfully."
      );

      await loadUsers();

    } catch (err) {

      console.error(
        "Delete User Error:",
        err.response?.data ||
        err.message
      );

      toast.error(
        err.response?.data?.message ||
        "Unable to delete user."
      );

    }

  };

  /* =====================================================
      TOGGLE USER STATUS (ENABLE / DISABLE)
  ===================================================== */

  const toggleUserStatus = async (userItem) => {
    const userEmail = String(userItem.email || "").toLowerCase().trim();
    const disabledEmails = JSON.parse(localStorage.getItem("disabled_user_emails") || "[]");

    const isCurrentlyActive = !disabledEmails.includes(userEmail) &&
                              userItem.enabled !== false &&
                              String(userItem.status || "").toLowerCase() !== "disabled" &&
                              String(userItem.status || "").toLowerCase() !== "inactive";

    const nextState = !isCurrentlyActive;

    // Update local users array state
    setUsers((prevUsers) =>
      prevUsers.map((u) => {
        if (String(u.email || "").toLowerCase().trim() === userEmail || u.id === userItem.id) {
          return { ...u, enabled: nextState, status: nextState ? "Active" : "Disabled" };
        }
        return u;
      })
    );

    // Update localStorage disabled_user_emails array
    if (!nextState) {
      if (!disabledEmails.includes(userEmail)) disabledEmails.push(userEmail);
    } else {
      const idx = disabledEmails.indexOf(userEmail);
      if (idx > -1) disabledEmails.splice(idx, 1);
    }
    localStorage.setItem("disabled_user_emails", JSON.stringify(disabledEmails));

    // Send API update
    try {
      await API.put(`/users/${userItem.id}`, {
        ...userItem,
        enabled: nextState,
        status: nextState ? "Active" : "Disabled",
      });
    } catch (e) {
      console.warn("Backend user status update fallback:", e?.message);
    }

    // Trigger cross-tab event & BroadcastChannel message
    window.dispatchEvent(new CustomEvent("user-status-changed", { detail: { email: userEmail, enabled: nextState } }));
    try {
      const bc = new BroadcastChannel("soc_user_status");
      bc.postMessage({ email: userEmail, enabled: nextState });
      bc.close();
    } catch (e) {}

    if (nextState) {
      toast.success(`User ${userItem.username || userItem.email} has been ENABLED.`);
    } else {
      toast.warn(`User ${userItem.username || userItem.email} has been DISABLED.`);
    }
  };

  /* =====================================================
      OPEN EDIT MODAL
  ===================================================== */

  const handleEdit = (user) => {

    setEditingUser(user);

    setEditForm({

      name:
        user.name ||
        user.username ||
        "",

      email:
        user.email ||
        "",

      department:
        user.department ||
        "",

      role:
        user.role ||
        "USER",

      enabled:
        user.enabled !== false,

    });

    setShowEditModal(true);

  };

  /* =====================================================
      HANDLE EDIT INPUT
  ===================================================== */

  const handleEditChange = (e) => {

    const {
      name,
      value,
      type,
      checked,
    } = e.target;

    setEditForm((prev) => ({

      ...prev,

      [name]:
        type === "checkbox"
          ? checked
          : value,

    }));

  };

  /* =====================================================
      VALIDATE EDIT FORM
  ===================================================== */

  const validateEditForm = () => {

    if (!editForm.name.trim()) {

      toast.error(
        "Name is required."
      );

      return false;

    }

    if (!editForm.email.trim()) {

      toast.error(
        "Email is required."
      );

      return false;

    }

    const emailRegex =
      /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    if (
      !emailRegex.test(
        editForm.email.trim()
      )
    ) {

      toast.error(
        "Enter a valid email address."
      );

      return false;

    }

    if (!editForm.department) {

      toast.error(
        "Please select a department."
      );

      return false;

    }

    if (!editForm.role) {

      toast.error(
        "Please select a role."
      );

      return false;

    }

    return true;

  };

  /* =====================================================
      UPDATE USER
  ===================================================== */

  const handleUpdateUser = async (e) => {

    e.preventDefault();

    if (!validateEditForm()) {
      return;
    }

    if (!editingUser?.id) {

      toast.error(
        "User ID is missing."
      );

      return;

    }

    try {

      setSaving(true);

      const payload = {

        name:
          editForm.name.trim(),

        email:
          editForm.email
            .trim()
            .toLowerCase(),

        department:
          editForm.department,

        role:
          editForm.role,

        enabled:
          editForm.enabled,

      };

      console.log(
        "Updating User:",
        editingUser.id,
        payload
      );

      const response =
        await API.put(
          `/users/${editingUser.id}`,
          payload
        );

      console.log(
        "User Updated:",
        response.data
      );

      toast.success(
        "User updated successfully."
      );

      setShowEditModal(false);

      setEditingUser(null);

      setEditForm({

        name: "",

        email: "",

        department: "",

        role: "USER",

        enabled: true,

      });

      await loadUsers();

    } catch (err) {

      console.error(
        "Update User Error:",
        err.response?.data ||
        err.message
      );

      toast.error(
        err.response?.data?.message ||
        "Unable to update user."
      );

    } finally {

      setSaving(false);

    }

  };

  /* =====================================================
      CLOSE EDIT MODAL
  ===================================================== */

  const closeEditModal = () => {

    if (saving) {
      return;
    }

    setShowEditModal(false);

    setEditingUser(null);

    setEditForm({

      name: "",

      email: "",

      department: "",

      role: "USER",

      enabled: true,

    });

  };

  /* =====================================================
      FILTER USERS
  ===================================================== */

  const filteredUsers = useMemo(() => {

    const keyword =
      search.trim().toLowerCase();

    return users.filter((user) => {

      const name =
        String(
          user.name ||
          user.username ||
          ""
        ).toLowerCase();

      const email =
        String(
          user.email ||
          ""
        ).toLowerCase();

      const department =
        String(
          user.department ||
          ""
        ).toUpperCase();

      const role =
        String(
          user.role ||
          ""
        ).toUpperCase();

      const matchesSearch =
        !keyword ||
        name.includes(keyword) ||
        email.includes(keyword);

      const matchesRole =
        roleFilter === "ALL" ||
        role === roleFilter;

      const matchesDepartment =
        departmentFilter === "ALL" ||
        department ===
          departmentFilter;

      return (
        matchesSearch &&
        matchesRole &&
        matchesDepartment
      );

    });

  }, [
    users,
    search,
    roleFilter,
    departmentFilter,
  ]);

  /* =====================================================
      PAGINATION
  ===================================================== */

  const totalPages = Math.max(
    1,
    Math.ceil(
      filteredUsers.length /
      pageSize
    )
  );

  const currentUsers =
    filteredUsers.slice(
      (page - 1) * pageSize,
      page * pageSize
    );

  /* =====================================================
      COUNTS
  ===================================================== */

  const admins = users.filter(
    (u) =>
      String(u.role || "")
        .toUpperCase() ===
      "ADMIN"
  ).length;

  const analysts = users.filter(
    (u) =>
      String(u.role || "")
        .toUpperCase() ===
      "ANALYST"
  ).length;

  const operators = users.filter(
    (u) =>
      String(u.role || "")
        .toUpperCase() ===
      "OPERATOR"
  ).length;

  /* =====================================================
      REFRESH
  ===================================================== */

  const refresh = () => {

    loadUsers();

    toast.success(
      "Users refreshed."
    );

  };

  /* =====================================================
      RETURN
  ===================================================== */

  return (

    <div className="dashboard">

      <Sidebar />

      <div className="content">

        <Navbar />

        <motion.div
          className="users-page"
          initial={{
            opacity: 0
          }}
          animate={{
            opacity: 1
          }}
          transition={{
            duration: 0.5
          }}
        >

          {/* =================================================
              HEADER
          ================================================= */}

          <div className="page-header">

            <div>

              <h1>
                User Management
              </h1>

              <p>
                Manage users, departments,
                permissions and roles.
              </p>

            </div>

            <button
              className="refresh-btn"
              onClick={refresh}
            >

              <FaSyncAlt />

              Refresh

            </button>

          </div>

          {/* =================================================
              SUMMARY
          ================================================= */}

          <div className="summary-grid">

            <motion.div
              whileHover={{
                scale: 1.05
              }}
              className="summary-card total"
            >

              <FaUsers />

              <h2>
                {users.length}
              </h2>

              <span>
                Total Users
              </span>

            </motion.div>

            <motion.div
              whileHover={{
                scale: 1.05
              }}
              className="summary-card admin"
            >

              <FaUserShield />

              <h2>
                {admins}
              </h2>

              <span>
                Administrators
              </span>

            </motion.div>

            <motion.div
              whileHover={{
                scale: 1.05
              }}
              className="summary-card analyst"
            >

              <FaUserTie />

              <h2>
                {analysts}
              </h2>

              <span>
                Analysts
              </span>

            </motion.div>

            <motion.div
              whileHover={{
                scale: 1.05
              }}
              className="summary-card operator"
            >

              <FaUsers />

              <h2>
                {operators}
              </h2>

              <span>
                Operators
              </span>

            </motion.div>

          </div>

          {/* =================================================
              TOOLBAR
          ================================================= */}

          <div className="toolbar">

            <div className="search-box">

              <FaSearch />

              <input
                type="text"
                placeholder="Search users..."
                value={search}
                onChange={(e) => {

                  setSearch(
                    e.target.value
                  );

                  setPage(1);

                }}
              />

            </div>

            <select
              value={roleFilter}
              onChange={(e) => {

                setRoleFilter(
                  e.target.value
                );

                setPage(1);

              }}
            >

              <option value="ALL">
                All Roles
              </option>

              <option value="ADMIN">
                ADMIN (Administrator)
              </option>

              <option value="ITSM">
                ITSM (Security Analyst)
              </option>

              <option value="USER">
                USER (Standard Operator)
              </option>

            </select>

            <select
              value={departmentFilter}
              onChange={(e) => {

                setDepartmentFilter(
                  e.target.value
                );

                setPage(1);

              }}
            >

              <option value="ALL">
                All Departments
              </option>

              <option value="SOC">
                SOC
              </option>

              <option value="IT">
                IT
              </option>

              <option value="NETWORK">
                Network
              </option>

              <option value="SECURITY">
                Security
              </option>

              <option value="DEVOPS">
                DevOps
              </option>

              <option value="HR">
                HR
              </option>

              <option value="FINANCE">
                Finance
              </option>

            </select>

          </div>

          {/* =================================================
              LOADING
          ================================================= */}

          {loading && (

            <div className="loading-container">

              <div className="loader"></div>

              <h3>
                Loading Users...
              </h3>

            </div>

          )}

          {/* =================================================
              ERROR
          ================================================= */}

          {error && (

            <div className="error-box">

              {error}

            </div>

          )}

          {/* =================================================
              TABLE
          ================================================= */}

          {!loading &&
            !error && (

              <div className="users-table-wrapper" style={{ width: "100%", display: "flex", flexDirection: "column", gap: "12px" }}>
                {/* Scroll Slider Controls */}
                <div className="table-scroll-controls" style={{ display: "flex", alignItems: "center", justifyContent: "space-between", padding: "10px 16px", background: "rgba(15, 23, 42, 0.7)", border: "1px solid rgba(255, 255, 255, 0.08)", borderRadius: "12px", flexWrap: "wrap", gap: "10px" }}>
                  <span className="scroll-hint" style={{ color: "#38bdf8", fontSize: "12.5px", fontWeight: "600", display: "flex", alignItems: "center", gap: "6px" }}>
                    💡 Use buttons or swipe trackpad horizontally to view all user columns
                  </span>
                  <div className="scroll-btn-group" style={{ display: "flex", alignItems: "center", gap: "10px" }}>
                    <button type="button" className="table-scroll-btn" onClick={() => scrollTable("left")} style={{ display: "inline-flex", alignItems: "center", gap: "8px", padding: "8px 16px", borderRadius: "8px", background: "linear-gradient(135deg, rgba(37, 99, 235, 0.25), rgba(29, 78, 216, 0.35))", border: "1px solid rgba(59, 130, 246, 0.4)", color: "#ffffff", fontSize: "12.5px", fontWeight: "600", cursor: "pointer" }}>
                      <FaChevronLeft /> Scroll Left
                    </button>
                    <button type="button" className="table-scroll-btn" onClick={() => scrollTable("right")} style={{ display: "inline-flex", alignItems: "center", gap: "8px", padding: "8px 16px", borderRadius: "8px", background: "linear-gradient(135deg, rgba(37, 99, 235, 0.25), rgba(29, 78, 216, 0.35))", border: "1px solid rgba(59, 130, 246, 0.4)", color: "#ffffff", fontSize: "12.5px", fontWeight: "600", cursor: "pointer" }}>
                      Scroll Right <FaChevronRight />
                    </button>
                  </div>
                </div>

                <motion.div
                  className="table-container"
                  ref={tableRef}
                  initial={{
                    opacity: 0,
                    y: 20
                  }}
                  animate={{
                    opacity: 1,
                    y: 0
                  }}
                  style={{ overflowX: "auto", width: "100%" }}
                >

                  <table
                    className="users-table"
                    style={{ minWidth: "1200px" }}
                  >

                    <thead>

                      <tr>

                        <th style={{ minWidth: "180px" }}>
                          Name
                        </th>

                        <th style={{ minWidth: "220px" }}>
                          Email
                        </th>

                        <th style={{ minWidth: "180px" }}>
                          Department
                        </th>

                        <th style={{ minWidth: "140px" }}>
                          Role
                        </th>

                        <th style={{ minWidth: "120px" }}>
                          Status
                        </th>

                        <th style={{ minWidth: "160px" }}>
                          Last Login
                        </th>

                        <th style={{ minWidth: "140px" }}>
                          Actions
                        </th>

                      </tr>

                    </thead>

                    <tbody>

                      {currentUsers.map(
                        (userItem) => {
                          const isSelf = currentUser && (
                            String(currentUser.id) === String(userItem.id) ||
                            (currentUser.email && userItem.email && currentUser.email.toLowerCase() === userItem.email.toLowerCase()) ||
                            (currentUser.username && userItem.username && currentUser.username.toLowerCase() === userItem.username.toLowerCase())
                          );

                          const isAdminUser = currentUser?.role === "ADMIN";

                          const userLastLogins = JSON.parse(localStorage.getItem("user_last_logins") || "{}");
                          const disabledEmails = JSON.parse(localStorage.getItem("disabled_user_emails") || "[]");
                          const userEmailKey = String(userItem.email || "").toLowerCase().trim();

                          const isUserActive = !disabledEmails.includes(userEmailKey) &&
                                               userItem.enabled !== false &&
                                               String(userItem.status || "").toLowerCase() !== "disabled" &&
                                               String(userItem.status || "").toLowerCase() !== "inactive";

                          const storedLogin = userLastLogins[userEmailKey];

                          const displayLastLogin = userItem.lastLogin ||
                                                   storedLogin ||
                                                   (isSelf ? new Date().toLocaleString('en-US', { month: 'short', day: 'numeric', year: 'numeric', hour: '2-digit', minute: '2-digit', hour12: true }) : "Never");

                          return (

                          <tr
                            key={userItem.id}
                          >

                            <td style={{ fontWeight: 600, color: "#f8fafc" }}>

                              {
                                userItem.name ||
                                userItem.username ||
                                "-"
                              }

                            </td>

                            <td style={{ fontFamily: "monospace", color: "#60a5fa" }}>
                              {userItem.email || "-"}
                            </td>

                            <td>
                              {userItem.department || "-"}
                            </td>

                            <td>

                              <span
                                className={`role-badge ${
                                  String(
                                    userItem.role ||
                                    ""
                                  ).toLowerCase()
                                }`}
                              >

                                {userItem.role || "-"}

                              </span>

                            </td>

                            <td>

                              {isSelf ? (
                                <span className="status-badge active">
                                  Active
                                </span>
                              ) : (
                                <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
                                  <button
                                    type="button"
                                    onClick={() => toggleUserStatus(userItem)}
                                    style={{
                                      width: "44px",
                                      height: "22px",
                                      borderRadius: "12px",
                                      background: isUserActive ? "linear-gradient(135deg, #10b981, #059669)" : "rgba(239, 68, 68, 0.3)",
                                      border: isUserActive ? "1px solid #10b981" : "1px solid rgba(239, 68, 68, 0.5)",
                                      position: "relative",
                                      cursor: "pointer",
                                      transition: "all 0.25s ease",
                                      padding: "2px",
                                      display: "flex",
                                      alignItems: "center",
                                      boxShadow: isUserActive ? "0 0 10px rgba(16, 185, 129, 0.4)" : "none",
                                    }}
                                    title={isUserActive ? "Click to Disable User Account" : "Click to Enable User Account"}
                                  >
                                    <div style={{
                                      width: "16px",
                                      height: "16px",
                                      borderRadius: "50%",
                                      background: "#ffffff",
                                      transform: isUserActive ? "translateX(22px)" : "translateX(0px)",
                                      transition: "all 0.25s cubic-bezier(0.4, 0, 0.2, 1)",
                                      boxShadow: "0 2px 5px rgba(0,0,0,0.3)",
                                    }} />
                                  </button>
                                  <span style={{ fontSize: "12px", fontWeight: "700", color: isUserActive ? "#34d399" : "#f87171" }}>
                                    {isUserActive ? "Enabled" : "Disabled"}
                                  </span>
                                </div>
                              )}

                            </td>

                            <td style={{ fontSize: "12.5px", color: displayLastLogin === "Never" ? "#94a3b8" : "#38bdf8" }}>

                              {displayLastLogin}

                            </td>

                            <td>

                              <div
                                className="table-actions"
                              >

                                {isSelf ? (
                                  <span style={{ fontSize: "11px", fontWeight: "700", padding: "4px 10px", borderRadius: "12px", background: "rgba(59, 130, 246, 0.2)", border: "1px solid rgba(59, 130, 246, 0.4)", color: "#60a5fa" }}>
                                    Current User (You)
                                  </span>
                                ) : isAdminUser ? (
                                  <button
                                    type="button"
                                    className="delete-btn"
                                    title="Delete User"
                                    onClick={() =>
                                      deleteUser(
                                        userItem.id
                                      )
                                    }
                                  >

                                    <FaTrash />

                                  </button>
                                ) : (
                                  <span style={{ fontSize: "11px", color: "#94a3b8" }}>
                                    Read-Only
                                  </span>
                                )}

                              </div>

                            </td>

                          </tr>

                        );
                      }
                      )}

                  </tbody>
                </table>
              </motion.div>
            </div>
          )}

          {/* =================================================
              EMPTY STATE
          ================================================= */}

          {!loading &&
            filteredUsers.length === 0 && (

              <div
                className="empty-state"
              >

                <FaUsers size={70} />

                <h2>
                  No Users Found
                </h2>

                <p>
                  No users matched your
                  search criteria.
                </p>

              </div>

            )}

          {/* =================================================
              PAGINATION
          ================================================= */}

          {!loading &&
            filteredUsers.length >
            pageSize && (

              <Pagination
                currentPage={page}
                totalPages={totalPages}
                onPageChange={setPage}
              />

            )}

        </motion.div>

        <Footer />

      </div>

      {/* =====================================================
          EDIT USER MODAL
      ===================================================== */}

      {showEditModal && (

        <div className="user-modal-overlay">

          <motion.div
            className="user-edit-modal"

            initial={{
              opacity: 0,
              scale: 0.95,
              y: 20,
            }}

            animate={{
              opacity: 1,
              scale: 1,
              y: 0,
            }}

            transition={{
              duration: 0.25,
            }}
          >

            {/* ==========================
                MODAL HEADER
            =========================== */}

            <div className="user-modal-header">

              <div>

                <h2>
                  Edit User
                </h2>

                <p>
                  Update user details
                  and permissions.
                </p>

              </div>

              <button
                type="button"
                className="modal-close-btn"
                onClick={closeEditModal}
                disabled={saving}
              >

                <FaTimes />

              </button>

            </div>

            {/* ==========================
                FORM
            =========================== */}

            <form
              className="user-edit-form"
              onSubmit={handleUpdateUser}
            >

              {/* NAME */}

              <div className="form-group">

                <label>
                  Name *
                </label>

                <input
                  type="text"
                  name="name"
                  value={editForm.name}
                  onChange={handleEditChange}
                  placeholder="Enter name"
                />

              </div>

              {/* EMAIL */}

              <div className="form-group">

                <label>
                  Email *
                </label>

                <input
                  type="email"
                  name="email"
                  value={editForm.email}
                  onChange={handleEditChange}
                  placeholder="Enter email"
                />

              </div>

              {/* DEPARTMENT */}

              <div className="form-group">

                <label>
                  Department *
                </label>

                <select
                  name="department"
                  value={
                    editForm.department
                  }
                  onChange={handleEditChange}
                >

                  <option value="">
                    Select Department
                  </option>

                  <option value="SOC">
                    SOC
                  </option>

                  <option value="IT">
                    IT
                  </option>

                  <option value="NETWORK">
                    Network
                  </option>

                  <option value="SECURITY">
                    Security
                  </option>

                  <option value="DEVOPS">
                    DevOps
                  </option>

                  <option value="HR">
                    HR
                  </option>

                  <option value="FINANCE">
                    Finance
                  </option>

                </select>

              </div>

              {/* ROLE */}

              <div className="form-group">

                <label>
                  Role *
                </label>

                <select
                  name="role"
                  value={editForm.role}
                  onChange={handleEditChange}
                >

                  <option value="ADMIN">
                    Administrator
                  </option>

                  <option value="ANALYST">
                    Analyst
                  </option>

                  <option value="OPERATOR">
                    Operator
                  </option>

                  <option value="VIEWER">
                    Viewer
                  </option>

                  <option value="USER">
                    User
                  </option>

                  <option value="ITSM">
                    ITSM
                  </option>

                </select>

              </div>

              {/* ENABLED */}

              <div className="form-group checkbox-group">

                <label>

                  <input
                    type="checkbox"
                    name="enabled"
                    checked={
                      editForm.enabled
                    }
                    onChange={
                      handleEditChange
                    }
                  />

                  <span>
                    User account enabled
                  </span>

                </label>

              </div>

              {/* BUTTONS */}

              <div className="user-modal-actions">

                <button
                  type="button"
                  className="cancel-btn"
                  onClick={closeEditModal}
                  disabled={saving}
                >
                  Cancel
                </button>

                <button
                  type="submit"
                  className="save-btn"
                  disabled={saving}
                >

                  <FaSave />

                  {saving
                    ? "Saving..."
                    : "Save Changes"}

                </button>

              </div>

            </form>

          </motion.div>

        </div>

      )}

    </div>

  );

}