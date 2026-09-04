import { useState, useRef, useEffect, useMemo } from "react";
import { useLocation } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import {
  FaRobot,
  FaPaperPlane,
  FaTimes,
  FaMinus,
  FaTrashAlt,
  FaShieldAlt,
  FaLightbulb,
} from "react-icons/fa";
import { useAuth } from "./AuthContext";
import "./Chatbot.css";

export default function Chatbot() {
  const { user } = useAuth();
  const location = useLocation();
  const [isOpen, setIsOpen] = useState(false);

  // Determine if user is on unauthenticated public page or logged out
  const isPublicPage = useMemo(() => {
    const path = location.pathname.toLowerCase();
    return path === "/login" || path === "/register" || path === "/" || !user;
  }, [location.pathname, user]);

  const userRole = useMemo(() => {
    return String(user?.role || "USER").toUpperCase();
  }, [user]);

  // Initial welcome message tailored to login state & role
  const getInitialMessage = () => {
    if (isPublicPage) {
      return "👋 Welcome to Cloud Security Monitoring System! I am your Security Operations AI Assistant. Ask me about platform features, architecture, or user roles.";
    }
    if (userRole === "ADMIN") {
      return `👋 Welcome back, Administrator ${user?.username || ""}! You have full ADMIN access to manage assets, users, and security controls.`;
    }
    if (userRole === "ITSM") {
      return `👋 Hello, Analyst ${user?.username || ""}! You are logged in with ITSM (Security Analyst) access. How can I assist your security monitoring?`;
    }
    return `👋 Hello, ${user?.username || "User"}! You are logged in with Standard Operator (USER) access. How can I assist with your dashboard view?`;
  };

  const [messages, setMessages] = useState([
    {
      id: 1,
      sender: "bot",
      text: getInitialMessage(),
      time: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
    },
  ]);

  // Update welcome message if route/auth state changes
  useEffect(() => {
    setMessages([
      {
        id: Date.now(),
        sender: "bot",
        text: getInitialMessage(),
        time: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
      },
    ]);
  }, [isPublicPage, userRole, user?.username]);

  const [input, setInput] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const messagesEndRef = useRef(null);

  // Dynamic quick prompts based on role & login state
  const quickPrompts = useMemo(() => {
    if (isPublicPage) {
      return [
        "What is SentinelCore SecureOps?",
        "What features are supported?",
        "What are the User Roles?",
        "How to register an account?",
      ];
    }
    if (userRole === "ADMIN") {
      return [
        "How to add a new asset?",
        "How to manage users?",
        "Show asset inventory summary",
        "Check system health status",
      ];
    }
    if (userRole === "ITSM") {
      return [
        "Can I add or delete assets?",
        "Check active alerts",
        "Show critical vulnerabilities",
        "What is SentinelCore?",
      ];
    }
    return [
      "Can I add or delete assets?",
      "View my role permissions",
      "Check system security status",
      "What is SentinelCore?",
    ];
  }, [isPublicPage, userRole]);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    if (isOpen) {
      scrollToBottom();
    }
  }, [messages, isOpen]);

  // Intelligent Security Knowledge Base Response Generator
  const generateBotResponse = (userQuery) => {
    const query = userQuery.toLowerCase();

    // ========================================================
    // PRE-AUTHENTICATION / PUBLIC PAGES (Login / Register)
    // ========================================================
    if (isPublicPage) {
      if (
        query.includes("asset") ||
        query.includes("server") ||
        query.includes("ip") ||
        query.includes("vulnerab") ||
        query.includes("cve") ||
        query.includes("alert") ||
        query.includes("count") ||
        query.includes("data") ||
        query.includes("metric")
      ) {
        return "🔒 **Access Restricted**: You are currently not logged in.\n\nFor security compliance, live infrastructure metrics, server IPs, and threat logs are hidden prior to authentication.\n\n👉 Please **Register** an account or **Login** to unlock live Security Operations monitoring data!";
      }

      if (query.includes("role") || query.includes("admin") || query.includes("itsm") || query.includes("user")) {
        return "🛡️ **SentinelCore Role Privileges**:\n• **ADMIN (Administrator)**: Full access to add/edit/delete IT assets, manage user permissions, and configure security controls.\n• **ITSM (Security Analyst)**: Access to monitor assets, track incident reports, and analyze vulnerability logs.\n• **USER (Standard Operator)**: Read-only access to view infrastructure dashboards.\n\nRegister an account and select your designated role!";
      }

      if (query.includes("register") || query.includes("login") || query.includes("signup") || query.includes("account")) {
        return "📝 **How to Get Started**:\n1. Click **Register** on the top right or navigate to `/register`.\n2. Choose your Username, Email, Department, and Role.\n3. Login with your credentials to access live Cloud Security monitoring!";
      }

      return "🛡️ **SentinelCore SecureOps Overview**:\nBuilt for **Infosys Springboard 7.0**, SentinelCore is a Cloud Security Operations & Infrastructure Monitoring System offering real-time threat detection, asset management, and vulnerability tracking.\n\nLog in or register an account to view live security metrics!";
    }

    // ========================================================
    // POST-AUTHENTICATION / LOGGED IN (Dashboard & Internal)
    // ========================================================

    // 1. Asset Creation & Management Queries
    if (
      query.includes("add asset") ||
      query.includes("create asset") ||
      query.includes("delete asset") ||
      query.includes("new asset") ||
      query.includes("add server") ||
      query.includes("how to add")
    ) {
      if (userRole === "ADMIN") {
        return "⚙️ **Administrator Asset Control (ADMIN Role)**:\nAs an **ADMIN**, you have full privileges to manage infrastructure:\n\n1. Click on the **Assets** tab in the left sidebar.\n2. Click the blue **+ Add Asset** button in the top right.\n3. Enter the Asset Name, IP Address, OS, and Owner details.\n4. Click **Save Asset**.\n\nYou can also edit or delete any existing asset directly from the Assets table!";
      }
      if (userRole === "ITSM") {
        return "🛡️ **Security Analyst Access (ITSM Role)**:\nYou can view asset inventories, monitor server health, and log incidents on the **Assets** page. However, creating or deleting infrastructure nodes requires **ADMIN** privileges. Please coordinate with a System Administrator for asset creation.";
      }
      // USER Role
      return "🔒 **Permission Denied (Standard Operator - USER Role)**:\nAs a standard **USER**, your account has read-only monitoring access. You do not have permission to add, edit, or delete IT assets.\n\n👉 **Action Required**: Please contact a System Administrator (**ADMIN**) to request asset additions, modifications, or role elevation.";
    }

    // 2. User Management Queries
    if (
      query.includes("user") &&
      (query.includes("manage") || query.includes("add") || query.includes("delete") || query.includes("role") || query.includes("edit"))
    ) {
      if (userRole === "ADMIN") {
        return "👥 **User Management (ADMIN Role)**:\nNavigate to the **Users** tab in the sidebar. As an **ADMIN**, you can search users, filter by department or role, assign new roles (`ADMIN`, `ITSM`, `USER`), or delete inactive user accounts.";
      }
      return "🔒 **Access Restricted**: User management and access control settings are restricted strictly to System Administrators (**ADMIN**). Contact your administrator if you need role privileges updated.";
    }

    // 3. General Asset Queries
    if (query.includes("asset") || query.includes("server") || query.includes("device")) {
      return `🖥️ SentinelCore is currently monitoring **9 primary assets** across your cloud infrastructure. Navigate to the **Assets** page to view live IP addresses, operating systems, and risk scores.`;
    }

    // 4. Vulnerabilities Queries
    if (query.includes("vulnerab") || query.includes("cve") || query.includes("bug")) {
      return "⚠️ **Vulnerability Intelligence Scan**:\n• **Total Detected CVEs**: 4 Vulnerabilities\n• **Critical Severity**: 0\n• **High Severity**: 1 (CVE-2024-3094 - OpenSSH liblzma)\n• **Medium/Low**: 3 (Pending OS Patch updates)\n\nCheck the **Vulnerabilities** tab for complete remediation reports!";
    }

    // 5. System Health & Score Queries
    if (query.includes("health") || query.includes("uptime") || query.includes("score")) {
      return `💚 **System Health & Security Score**:\n• **Security Score**: 94% (Excellent)\n• **System Uptime**: 99.98%\n• **Logged-in User**: ${user?.username || "Admin"} (${userRole} Role)\n• **Department**: ${user?.department || "SOC"}`;
    }

    // 6. Greetings
    if (query.includes("hello") || query.includes("hi") || query.includes("hey") || query.includes("namaste")) {
      return `👋 Hello ${user?.username || ""}! I am active and monitoring your ${userRole} workspace. How can I assist you today?`;
    }

    // Fallback response
    return `🔍 Based on your query regarding "${userQuery}":\nAs a logged-in **${userRole}**, you can explore your monitoring options using the left sidebar (Dashboard, Assets, Alerts, Incidents, Vulnerabilities, Users). Let me know if you need specific instructions!`;
  };

  const handleSend = (textToSend = input) => {
    const query = textToSend.trim();
    if (!query) return;

    const userMessage = {
      id: Date.now(),
      sender: "user",
      text: query,
      time: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
    };

    setMessages((prev) => [...prev, userMessage]);
    setInput("");
    setIsTyping(true);

    // Simulate AI thinking & typing delay
    setTimeout(() => {
      const botReply = {
        id: Date.now() + 1,
        sender: "bot",
        text: generateBotResponse(query),
        time: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
      };
      setMessages((prev) => [...prev, botReply]);
      setIsTyping(false);
    }, 550);
  };

  const handleKeyDown = (e) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  const clearChat = () => {
    setMessages([
      {
        id: Date.now(),
        sender: "bot",
        text: getInitialMessage(),
        time: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
      },
    ]);
  };

  return (
    <div className="chatbot-wrapper">
      {/* Floating Action Button */}
      <motion.button
        className="chatbot-fab"
        onClick={() => setIsOpen(!isOpen)}
        whileHover={{ scale: 1.08 }}
        whileTap={{ scale: 0.95 }}
        title="Open SentinelBot AI Assistant"
      >
        <div className="fab-icon-glow">
          {isOpen ? <FaTimes /> : <FaRobot />}
        </div>
        {!isOpen && <span className="fab-badge">AI</span>}
      </motion.button>

      {/* Chat Window */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            className="chatbot-window"
            initial={{ opacity: 0, y: 30, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 30, scale: 0.95 }}
            transition={{ duration: 0.25 }}
          >
            {/* Header */}
            <div className="chatbot-header">
              <div className="bot-info">
                <div className="bot-avatar">
                  <FaRobot />
                  <span className="status-dot"></span>
                </div>
                <div>
                  <h3>SentinelBot AI</h3>
                  <p>{isPublicPage ? "Platform Assistant" : `${userRole} SecOps Assistant`}</p>
                </div>
              </div>
              <div className="header-actions">
                <button onClick={clearChat} title="Clear conversation">
                  <FaTrashAlt />
                </button>
                <button onClick={() => setIsOpen(false)} title="Minimize chat">
                  <FaMinus />
                </button>
              </div>
            </div>

            {/* Quick Prompt Suggestions */}
            <div className="quick-prompts">
              <span><FaLightbulb /> Suggested:</span>
              <div className="prompts-scroll">
                {quickPrompts.map((prompt, idx) => (
                  <button
                    key={idx}
                    className="prompt-chip"
                    onClick={() => handleSend(prompt)}
                  >
                    {prompt}
                  </button>
                ))}
              </div>
            </div>

            {/* Messages Container */}
            <div className="chatbot-messages">
              {messages.map((msg) => (
                <div
                  key={msg.id}
                  className={`message-bubble ${
                    msg.sender === "user" ? "user-message" : "bot-message"
                  }`}
                >
                  {msg.sender === "bot" && (
                    <div className="msg-avatar">
                      <FaShieldAlt />
                    </div>
                  )}
                  <div className="msg-content">
                    <p style={{ whiteSpace: "pre-line" }}>{msg.text}</p>
                    <span className="msg-time">{msg.time}</span>
                  </div>
                </div>
              ))}

              {isTyping && (
                <div className="message-bubble bot-message typing-indicator">
                  <div className="msg-avatar">
                    <FaRobot />
                  </div>
                  <div className="dots">
                    <span></span>
                    <span></span>
                    <span></span>
                  </div>
                </div>
              )}
              <div ref={messagesEndRef} />
            </div>

            {/* Input Bar */}
            <div className="chatbot-input-bar">
              <input
                type="text"
                placeholder={isPublicPage ? "Ask about SentinelCore features..." : `Ask SentinelBot (${userRole})...`}
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={handleKeyDown}
              />
              <button
                className="send-btn"
                onClick={() => handleSend()}
                disabled={!input.trim()}
              >
                <FaPaperPlane />
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
