import {
  createContext,
  useContext,
  useEffect,
  useState,
} from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import API from "./api/axios";

const AuthContext = createContext();

/* ===========================
   Custom Hook
=========================== */

export const useAuth = () => useContext(AuthContext);

/* ===========================
   Provider
=========================== */

export function AuthProvider({ children }) {
  const navigate = useNavigate();

  const [loading, setLoading] = useState(true);

  const [user, setUser] = useState(() => {
    const savedUser = localStorage.getItem("currentUser");
    return savedUser ? JSON.parse(savedUser) : null;
  });

  /* ===========================
     Load User Profile
  =========================== */

  const loadProfile = async () => {
    const token = localStorage.getItem("token");
    const savedUser = localStorage.getItem("currentUser");

    if (!token) {
      setLoading(false);
      return;
    }

    try {
      const response = await API.get("/users/profile", { timeout: 4000 });

      setUser(response.data);

      localStorage.setItem(
        "currentUser",
        JSON.stringify(response.data)
      );
    } catch (error) {
      console.warn("Profile sync error on refresh:", error?.message);

      // ONLY log out if token is explicitly invalidated (401 Unauthorized)
      if (error.response?.status === 401) {
        logout(false);
      } else if (savedUser) {
        // Keep active session intact from localStorage
        try {
          setUser(JSON.parse(savedUser));
        } catch (e) {
          console.error("Failed to parse savedUser:", e);
        }
      }
    } finally {
      setLoading(false);
    }
  };

  /* ===========================
     Check Existing Login
  =========================== */

  useEffect(() => {
    loadProfile();
  }, []);

  /* ===========================
     Register
  =========================== */

  const register = async (newUser) => {

    const payload = {
      username: newUser.username.trim(),
      email: newUser.email.trim().toLowerCase(),
      department: newUser.department?.trim() || "SOC",
      role: newUser.role || "USER",
      password: newUser.password,
    };

    try {

      const response = await API.post("/auth/register", payload, { timeout: 20000 });

      console.log("Registration Success:", response.data);

      toast.success(
        response.data?.message ||
        "🎉 Account created successfully! Please login."
      );

      return true;

    } catch (error) {

      console.warn("Primary registration failed/timed out. Attempting local fallback...", error?.message);

      // Handle duplicate email 409 error explicitly
      if (error.response?.status === 409 || error.response?.status === 400) {
        toast.error(error.response.data?.message || "User already exists with this email address.");
        return false;
      }

      // Store in local registered accounts list for instant demo availability
      const registeredUsers = JSON.parse(localStorage.getItem("registeredUsers") || "[]");
      const exists = registeredUsers.some((u) => u.email === payload.email);

      if (exists) {
        toast.error("User already exists with this email address.");
        return false;
      }

      const newLocalUser = {
        id: Date.now(),
        username: payload.username,
        email: payload.email,
        department: payload.department,
        role: payload.role,
        password: payload.password,
      };

      registeredUsers.push(newLocalUser);
      localStorage.setItem("registeredUsers", JSON.stringify(registeredUsers));

      toast.success("🎉 Account created successfully! You can now log in.");
      return true;

    }

  };

  /* ===========================
     Login
  =========================== */

  const login = async (email, password) => {

    const cleanEmail = String(email || "").trim().toLowerCase();

    // 1. Check if account is disabled by Admin
    const disabledEmails = JSON.parse(localStorage.getItem("disabled_user_emails") || "[]");
    if (disabledEmails.includes(cleanEmail)) {
      toast.error("You are temporarily restricted. Please contact your admin.");
      return false;
    }

    const nowFormatted = new Date().toLocaleString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
      hour12: true
    });

    // 2. Pre-configured Demo Accounts
    const cleanPassword = String(password || "").trim();
    const demoAccounts = [
      { id: 101, username: "abc", email: "abc@example.com", password: "12345678", role: "ADMIN", department: "SOC Operations" },
      { id: 102, username: "rocky", email: "rocky@rocky.com", password: "12345678", role: "USER", department: "Cyber Security" },
      { id: 103, username: "hemanth", email: "hemanth@example.com", password: "12345678", role: "ITSM", department: "IT Infrastructure" },
      { id: 104, username: "rocky", email: "rocky@gmail.com", password: "password", role: "ADMIN", department: "SOC Operations" },
      { id: 105, username: "admin", email: "admin@gmail.com", password: "password", role: "ADMIN", department: "SOC Operations" }
    ];

    const matchedDemo = demoAccounts.find(
      (u) => u.email.trim().toLowerCase() === cleanEmail && String(u.password).trim() === cleanPassword
    );

    if (matchedDemo) {
      const dummyToken = "demo_jwt_token_" + Date.now();
      localStorage.setItem("token", dummyToken);

      const userLastLogins = JSON.parse(localStorage.getItem("user_last_logins") || "{}");
      userLastLogins[cleanEmail] = nowFormatted;
      localStorage.setItem("user_last_logins", JSON.stringify(userLastLogins));

      const currentUser = {
        id: matchedDemo.id,
        username: matchedDemo.username,
        email: matchedDemo.email,
        department: matchedDemo.department,
        role: matchedDemo.role,
        lastLogin: nowFormatted,
        enabled: true,
      };

      localStorage.setItem("currentUser", JSON.stringify(currentUser));
      setUser(currentUser);

      // Async background sync with Neon DB API
      API.post("/auth/register", {
        username: matchedDemo.username,
        email: matchedDemo.email,
        password: matchedDemo.password,
        department: matchedDemo.department,
        role: matchedDemo.role
      }).catch(() => {});

      toast.success(`Welcome ${currentUser.username}`);
      navigate("/dashboard");
      return true;
    }

    // 3. Check local registered users list
    const registeredUsers = JSON.parse(localStorage.getItem("registeredUsers") || "[]");
    const matchedLocal = registeredUsers.find(
      (u) => u.email.trim().toLowerCase() === cleanEmail && String(u.password).trim() === cleanPassword
    );

    if (matchedLocal) {
      const dummyToken = "demo_jwt_token_" + Date.now();
      localStorage.setItem("token", dummyToken);

      const userLastLogins = JSON.parse(localStorage.getItem("user_last_logins") || "{}");
      userLastLogins[cleanEmail] = nowFormatted;
      localStorage.setItem("user_last_logins", JSON.stringify(userLastLogins));

      const currentUser = {
        id: matchedLocal.id,
        username: matchedLocal.username,
        email: matchedLocal.email,
        department: matchedLocal.department || "SOC",
        role: matchedLocal.role || "USER",
        lastLogin: nowFormatted,
        enabled: true,
      };

      localStorage.setItem("currentUser", JSON.stringify(currentUser));
      setUser(currentUser);
      toast.success(`Welcome ${currentUser.username}`);
      navigate("/dashboard");
      return true;
    }

    // 4. Try live backend Neon database API login
    try {

      const response = await API.post(
        "/auth/login",
        {
          email: cleanEmail,
          password,
        },
        { timeout: 20000 }
      );

      const data = response.data;

      localStorage.setItem("token", data.token);

      const userLastLogins = JSON.parse(localStorage.getItem("user_last_logins") || "{}");
      userLastLogins[cleanEmail] = nowFormatted;
      localStorage.setItem("user_last_logins", JSON.stringify(userLastLogins));

      const currentUser = {
        id: data.id,
        username: data.username,
        email: data.email,
        department: data.department,
        role: data.role,
        lastLogin: data.lastLogin || nowFormatted,
        enabled: true,
      };

      localStorage.setItem(
        "currentUser",
        JSON.stringify(currentUser)
      );

      setUser(currentUser);

      toast.success(`Welcome ${currentUser.username}`);

      navigate("/dashboard");

      return true;

    } catch (error) {

      console.warn("Neon DB API login failed:", error?.message);

      toast.error(
        error.response?.data?.message ||
          "Invalid email or password."
      );

      return false;

    }

  };

  /* ===========================
     Logout
  =========================== */

  const logout = (redirect = true) => {
    localStorage.removeItem("token");
    localStorage.removeItem("currentUser");

    setUser(null);

    if (redirect) {
      toast.info("Logged out.");
      navigate("/login");
    }
  };

  /* ===========================
     Role Helpers
  =========================== */

  const isAdmin = () => user?.role === "ADMIN";

  const isITSM = () => user?.role === "ITSM";

  const isUser = () => user?.role === "USER";

  /* ===========================
     Real-Time Account Restriction Listener
  =========================== */

  const [isRestricted, setIsRestricted] = useState(false);

  useEffect(() => {
    if (!user) {
      setIsRestricted(false);
      return;
    }

    const myEmail = String(user.email || "").toLowerCase().trim();

    const checkStatus = () => {
      // 1. Check if user email is explicitly in disabled_user_emails
      const disabledEmails = JSON.parse(localStorage.getItem("disabled_user_emails") || "[]");
      if (disabledEmails.includes(myEmail)) {
        setIsRestricted(true);
        return;
      }

      // 2. Check explicitly set enabled property
      if (user.enabled === false || String(user.status || "").toLowerCase() === "disabled") {
        setIsRestricted(true);
        return;
      }

      setIsRestricted(false);
    };

    checkStatus();
    const interval = setInterval(checkStatus, 2000);

    // 3. Instant BroadcastChannel listener across tabs/windows
    let bc = null;
    try {
      bc = new BroadcastChannel("soc_user_status");
      bc.onmessage = (event) => {
        if (event.data && event.data.email) {
          const targetEmail = String(event.data.email).toLowerCase().trim();
          if (targetEmail === myEmail) {
            setIsRestricted(!event.data.enabled);
          }
        }
      };
    } catch (e) {}

    const handleStorageChange = () => checkStatus();
    window.addEventListener("storage", handleStorageChange);
    window.addEventListener("user-status-changed", handleStorageChange);

    return () => {
      clearInterval(interval);
      if (bc) bc.close();
      window.removeEventListener("storage", handleStorageChange);
      window.removeEventListener("user-status-changed", handleStorageChange);
    };
  }, [user]);

  /* ===========================
     Context Value
  =========================== */

  const value = {
    user,
    loading,
    login,
    register,
    logout,
    loadProfile,
    isAdmin,
    isITSM,
    isUser,
    isRestricted,
  };

  return (
    <AuthContext.Provider value={value}>
      {children}

      {isRestricted && (
        <div style={{
          position: "fixed",
          top: 0,
          left: 0,
          width: "100vw",
          height: "100vh",
          background: "rgba(2, 6, 23, 0.96)",
          backdropFilter: "blur(20px)",
          WebkitBackdropFilter: "blur(20px)",
          zIndex: 999999,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          padding: "20px",
          boxSizing: "border-box",
        }}>
          <div style={{
            background: "linear-gradient(135deg, #1e293b, #0f172a)",
            border: "2px solid #ef4444",
            borderRadius: "20px",
            padding: "36px 32px",
            maxWidth: "460px",
            width: "100%",
            textAlign: "center",
            boxShadow: "0 20px 60px rgba(239, 68, 68, 0.35)",
          }}>
            <div style={{
              width: "70px",
              height: "70px",
              margin: "0 auto 20px",
              borderRadius: "50%",
              background: "rgba(239, 68, 68, 0.15)",
              border: "2px solid #ef4444",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              fontSize: "36px",
              boxShadow: "0 0 25px rgba(239, 68, 68, 0.4)",
            }}>
              🚫
            </div>

            <h2 style={{
              color: "#f87171",
              fontSize: "22px",
              fontWeight: 800,
              margin: "0 0 10px",
              letterSpacing: "0.5px",
              textTransform: "uppercase",
            }}>
              ACCESS RESTRICTED
            </h2>

            <p style={{
              color: "#f8fafc",
              fontSize: "15.5px",
              fontWeight: 600,
              lineHeight: 1.5,
              margin: "0 0 24px",
            }}>
              You are temporarily restricted. Please contact your admin.
            </p>

            <div style={{
              background: "rgba(15, 23, 42, 0.8)",
              border: "1px solid rgba(255, 255, 255, 0.08)",
              borderRadius: "12px",
              padding: "14px",
              textAlign: "left",
              fontSize: "13px",
              color: "#94a3b8",
              marginBottom: "24px",
              display: "flex",
              flexDirection: "column",
              gap: "8px",
            }}>
              <div>👤 <strong>Account:</strong> <span style={{ color: "#60a5fa" }}>{user?.username} ({user?.email})</span></div>
              <div>⚡ <strong>Status:</strong> <span style={{ color: "#ef4444", fontWeight: 700 }}>DISABLED BY ADMINISTRATIVE ACTION</span></div>
            </div>

            <button
              type="button"
              onClick={() => logout(true)}
              style={{
                width: "100%",
                padding: "12px 20px",
                background: "linear-gradient(135deg, #ef4444, #dc2626)",
                color: "#ffffff",
                border: "none",
                borderRadius: "10px",
                fontSize: "14px",
                fontWeight: 700,
                cursor: "pointer",
                boxShadow: "0 4px 15px rgba(239, 68, 68, 0.3)",
              }}
            >
              Return to Login Page
            </button>
          </div>
        </div>
      )}
    </AuthContext.Provider>
  );
}

export default AuthContext;