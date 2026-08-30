import { Navigate } from "react-router-dom";
import { useAuth } from "./AuthContext";

export default function ProtectedRoute({
  children,
  allowedRoles = [],
}) {
  const { user, loading } = useAuth();

  // Loading state
  if (loading) {
    return (
      <div
        style={{
          background: "#0f172a",
          color: "#ffffff",
          height: "100vh",
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          flexDirection: "column",
          fontSize: "18px",
          fontFamily: "system-ui, sans-serif",
        }}
      >
        <div style={{
          width: "48px",
          height: "48px",
          border: "4px solid rgba(59, 130, 246, 0.2)",
          borderTop: "4px solid #3b82f6",
          borderRadius: "50%",
          animation: "spin 0.8s linear infinite",
        }} />
        <style>{`@keyframes spin { 0% { transform: rotate(0deg); } 100% { transform: rotate(360deg); } }`}</style>
        <p style={{ marginTop: "20px", color: "#60a5fa", fontWeight: "600" }}>
          Authenticating SentinelCore...
        </p>
      </div>
    );
  }

  // User not logged in
  if (!user) {
    return <Navigate to="/login" replace />;
  }

  // Role validation with case-insensitive normalization
  const normalizedRole = String(user.role || "USER").toUpperCase();
  const normalizedAllowed = allowedRoles.map((r) => String(r).toUpperCase());

  if (
    normalizedAllowed.length > 0 &&
    !normalizedAllowed.includes(normalizedRole)
  ) {
    return (
      <div
        style={{
          background: "#111827",
          color: "#ffffff",
          height: "100vh",
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          flexDirection: "column",
          textAlign: "center",
          padding: "20px",
        }}
      >
        <h1 style={{ color: "#ef4444", marginBottom: "10px" }}>
          🚫 Access Denied
        </h1>

        <p>
          You don't have permission to access this page.
        </p>
      </div>
    );
  }

  return children;
}

