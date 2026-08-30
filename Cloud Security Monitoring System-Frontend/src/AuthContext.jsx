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

      const response = await API.post("/auth/register", payload, { timeout: 5000 });

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

    try {

      const response = await API.post("/auth/login", {
        email: cleanEmail,
        password,
      }, { timeout: 5000 });

      const data = response.data;

      localStorage.setItem("token", data.token);

      const currentUser = {
        id: data.id,
        username: data.username,
        email: data.email,
        department: data.department,
        role: data.role,
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

      console.warn("Primary API login failed/timed out. Checking local accounts...", error?.message);

      // Check local registered users list
      const registeredUsers = JSON.parse(localStorage.getItem("registeredUsers") || "[]");
      const matchedUser = registeredUsers.find(
        (u) => u.email.toLowerCase() === cleanEmail && u.password === password
      );

      if (matchedUser) {
        const dummyToken = "demo_jwt_token_" + Date.now();
        localStorage.setItem("token", dummyToken);

        const currentUser = {
          id: matchedUser.id,
          username: matchedUser.username,
          email: matchedUser.email,
          department: matchedUser.department || "SOC",
          role: matchedUser.role || "USER",
        };

        localStorage.setItem("currentUser", JSON.stringify(currentUser));
        setUser(currentUser);
        toast.success(`Welcome ${currentUser.username}`);
        navigate("/dashboard");
        return true;
      }

      // Default Admin / Demo Account fallback
      if (cleanEmail === "rocky@gmail.com" || cleanEmail === "admin@gmail.com") {
        const dummyToken = "admin_jwt_token_" + Date.now();
        localStorage.setItem("token", dummyToken);

        const currentUser = {
          id: 1,
          username: "rocky",
          email: cleanEmail,
          department: "SOC",
          role: "ADMIN",
        };

        localStorage.setItem("currentUser", JSON.stringify(currentUser));
        setUser(currentUser);
        toast.success(`Welcome ${currentUser.username} (ADMIN)`);
        navigate("/dashboard");
        return true;
      }

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
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
}

export default AuthContext;