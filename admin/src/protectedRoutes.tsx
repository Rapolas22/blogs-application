import { useEffect, useState } from "react";
import { Outlet, Navigate } from "react-router-dom";

export default function ProtectedRoutes() {
  // "loading" until the server answers, then "allowed" or "denied"
  const [status, setStatus] = useState<"loading" | "allowed" | "denied">(
    "loading",
  );

  useEffect(() => {
    // The browser sends the httpOnly cookie automatically, the server checks it
    fetch("/api/me")
      .then((res) => setStatus(res.ok ? "allowed" : "denied"))
      .catch(() => setStatus("denied"));
  }, []);

  if (status === "loading") return <p>Loading...</p>;

  return status === "allowed" ? <Outlet /> : <Navigate to="/signin" replace />;
}
