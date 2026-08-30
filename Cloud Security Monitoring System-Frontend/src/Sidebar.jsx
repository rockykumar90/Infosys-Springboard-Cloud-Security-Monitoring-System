import {
  FaTachometerAlt,
  FaServer,
  FaUsers,
  FaShieldAlt,
  FaBug,
  FaCloud,
  FaChartBar,
  FaBell,
  FaUserCircle,
  FaCog,
  FaSignOutAlt,
  FaChevronLeft,
  FaChevronRight,
} from "react-icons/fa";
import { NavLink } from "react-router-dom";
import { useState } from "react";
import { motion } from "framer-motion";
import { useAuth } from "./AuthContext";
import "./Dashboard.css";

function Sidebar() {
  const { user, logout } = useAuth();

  const [collapsed, setCollapsed] = useState(false);

  const menu = [
    {
      title: "Dashboard",
      icon: <FaTachometerAlt />,
      path: "/dashboard",
      roles: ["ADMIN", "ITSM", "USER"],
    },
    {
      title: "Assets",
      icon: <FaServer />,
      path: "/assets",
      roles: ["ADMIN", "ITSM", "USER"],
    },
    {
      title: "Alerts",
      icon: <FaBell />,
      path: "/alerts",
      roles: ["ADMIN", "ITSM", "USER"],
    },
    {
      title: "Incidents",
      icon: <FaShieldAlt />,
      path: "/incidents",
      roles: ["ADMIN", "ITSM", "USER"],
    },
    {
      title: "Vulnerabilities",
      icon: <FaBug />,
      path: "/vulnerabilities",
      roles: ["ADMIN", "ITSM", "USER"],
    },
    {
      title: "Cloud",
      icon: <FaCloud />,
      path: "/cloud",
      roles: ["ADMIN", "ITSM", "USER"],
    },
    {
      title: "Reports",
      icon: <FaChartBar />,
      path: "/reports",
      roles: ["ADMIN", "ITSM", "USER"],
    },
    {
      title: "Users",
      icon: <FaUsers />,
      path: "/users",
      roles: ["ADMIN", "ITSM", "USER"],
    },
  ];

  const toggleCollapse = () => {
    const nextState = !collapsed;
    setCollapsed(nextState);
    if (nextState) {
      document.body.classList.add("sidebar-collapsed");
    } else {
      document.body.classList.remove("sidebar-collapsed");
    }
  };

  return (
    <motion.div
      animate={{
        width: collapsed ? 70 : 250,
      }}
      transition={{
        duration: 0.3,
      }}
      className={`sidebar ${collapsed ? "collapsed" : ""}`}
    >
      {/* Logo */}

      <div className="sidebar-logo">

        <div className="logo-circle">
          🛡
        </div>

        {!collapsed && (
          <div>

            <h2>SentinelCore</h2>

            <span>SecureOps</span>

          </div>
        )}

      </div>

      {/* Collapse */}

      <button
        className="collapse-btn"
        onClick={toggleCollapse}
        title={collapsed ? "Expand sidebar" : "Collapse sidebar"}
      >
        {collapsed ? (
          <FaChevronRight />
        ) : (
          <FaChevronLeft />
        )}
      </button>

      {/* User */}

      <div className="sidebar-user">

        <img
          src={`https://ui-avatars.com/api/?name=${
            user?.username || "Admin"
          }&background=2563eb&color=fff`}
          alt="profile"
        />

        {!collapsed && (
          <>

            <h4>{user?.username}</h4>

            <p>{user?.role}</p>

          </>
        )}

      </div>

      {/* Navigation */}

      <ul className="sidebar-menu">

        {menu
          .filter((m) =>
            m.roles.includes(user?.role)
          )
          .map((item) => (
            <li key={item.title}>
              <NavLink
                to={item.path}
                className={({ isActive }) =>
                  isActive
                    ? "active-link"
                    : ""
                }
              >
                <span>{item.icon}</span>

                {!collapsed && (
                  <p>{item.title}</p>
                )}
              </NavLink>
            </li>
          ))}

      </ul>

      {/* Bottom */}

      <div className="sidebar-footer">

        <button
          className="logout-btn"
          onClick={logout}
        >
          <FaSignOutAlt />

          {!collapsed && (
            <span>Logout</span>
          )}

        </button>

      </div>
    </motion.div>
  );
}

export default Sidebar;