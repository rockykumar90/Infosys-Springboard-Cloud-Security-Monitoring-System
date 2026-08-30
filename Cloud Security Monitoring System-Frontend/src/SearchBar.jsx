import { useState } from "react";
import { FaSearch, FaTimes } from "react-icons/fa";
import { useNavigate } from "react-router-dom";

export default function SearchBar({
  placeholder = "Search pages...",
}) {
  const [value, setValue] = useState("");
  const [showSuggestions, setShowSuggestions] = useState(false);

  const navigate = useNavigate();

  const pages = [
    {
      name: "Dashboard",
      path: "/dashboard",
      keywords: ["dashboard", "home", "main"],
    },
    {
      name: "Assets",
      path: "/assets",
      keywords: ["asset", "assets", "device", "devices", "server"],
    },
    {
      name: "Alerts",
      path: "/alerts",
      keywords: ["alert", "alerts", "notification"],
    },
    {
      name: "Users",
      path: "/users",
      keywords: ["user", "users", "employee"],
    },
    {
      name: "Incidents",
      path: "/incidents",
      keywords: ["incident", "incidents", "security"],
    },
    {
      name: "Vulnerabilities",
      path: "/vulnerabilities",
      keywords: ["vulnerability", "vulnerabilities", "cve"],
    },
    {
      name: "Reports",
      path: "/reports",
      keywords: ["report", "reports", "analytics"],
    },
    {
      name: "Cloud",
      path: "/cloud",
      keywords: ["cloud", "aws", "azure", "gcp"],
    },
    {
      name: "Profile",
      path: "/profile",
      keywords: ["profile", "account"],
    },
    {
      name: "Settings",
      path: "/settings",
      keywords: ["setting", "settings", "config"],
    },
  ];

  const filteredPages = pages.filter((page) => {
    const search = value.toLowerCase();

    return (
      page.name.toLowerCase().includes(search) ||
      page.keywords.some((keyword) =>
        keyword.toLowerCase().includes(search)
      )
    );
  });

  const handleSearch = () => {
    const search = value.trim().toLowerCase();

    if (!search) return;

    const page = pages.find((page) =>
      page.name.toLowerCase().includes(search) ||
      page.keywords.some(
        (keyword) =>
          keyword.includes(search) || search.includes(keyword)
      )
    );

    if (page) {
      navigate(page.path);
      setValue("");
      setShowSuggestions(false);
    } else {
      alert("No matching page found.");
    }
  };

  const handleKeyDown = (e) => {
    if (e.key === "Enter") {
      handleSearch();
    }
  };

  const handleSelect = (page) => {
    navigate(page.path);
    setValue("");
    setShowSuggestions(false);
  };

  const handleSearchFocus = () => {
    setShowSuggestions(true);
    // Collapse left sidebar to expand top navbar search space
    window.dispatchEvent(new CustomEvent("collapse-sidebar"));
  };

  return (
    <div
      style={{
        position: "relative",
        width: "100%",
        maxWidth: "480px",
      }}
      onClick={handleSearchFocus}
    >
      {/* Search Box */}
      <div
        style={{
          display: "flex",
          alignItems: "center",
          background: "rgba(15, 23, 42, 0.85)",
          border: "1px solid rgba(59, 130, 246, 0.3)",
          borderRadius: "30px",
          padding: "5px 16px",
          transition: "all 0.25s ease",
          boxShadow: "0 4px 12px rgba(0, 0, 0, 0.25)",
        }}
      >
        <FaSearch
          onClick={() => {
            handleSearch();
            handleSearchFocus();
          }}
          style={{
            color: "#60a5fa",
            cursor: "pointer",
            fontSize: "14px",
            marginRight: "8px",
            flexShrink: 0,
          }}
        />

        <input
          type="text"
          placeholder={placeholder}
          value={value}
          onChange={(e) => {
            setValue(e.target.value);
            setShowSuggestions(true);
          }}
          onFocus={handleSearchFocus}
          onClick={handleSearchFocus}
          onKeyDown={handleKeyDown}
          style={{
            flex: 1,
            background: "transparent",
            border: "none",
            outline: "none",
            color: "#f8fafc",
            padding: "6px 4px",
            fontSize: "13.5px",
            minWidth: 0,
          }}
        />

        {value && (
          <button
            type="button"
            onClick={() => {
              setValue("");
              setShowSuggestions(false);
            }}
            style={{
              background: "transparent",
              border: "none",
              cursor: "pointer",
              color: "#94a3b8",
              padding: "2px",
              display: "flex",
              alignItems: "center",
            }}
          >
            <FaTimes style={{ fontSize: "12px" }} />
          </button>
        )}
      </div>

      {/* Suggestions */}
      {showSuggestions && value && (
        <div
          style={{
            position: "absolute",
            top: "105%",
            left: 0,
            width: "100%",
            background: "#212529",
            border: "1px solid #495057",
            borderRadius: "10px",
            overflow: "hidden",
            boxShadow: "0 5px 15px rgba(0,0,0,0.35)",
            zIndex: 1000,
          }}
        >
          {filteredPages.length > 0 ? (
            filteredPages.map((page) => (
              <div
                key={page.path}
                onClick={() => handleSelect(page)}
                style={{
                  padding: "12px 15px",
                  cursor: "pointer",
                  color: "#fff",
                  borderBottom: "1px solid #343a40",
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.background = "#0d6efd";
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.background = "#212529";
                }}
              >
                <FaSearch style={{ marginRight: "10px" }} />
                {page.name}
              </div>
            ))
          ) : (
            <div
              style={{
                padding: "12px",
                textAlign: "center",
                color: "#adb5bd",
              }}
            >
              No matching pages found
            </div>
          )}
        </div>
      )}

      {/* Placeholder Style */}
      <style>
        {`
          input::placeholder{
            color:#adb5bd;
          }
        `}
      </style>
    </div>
  );
}