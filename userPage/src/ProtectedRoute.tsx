import { useEffect, useState } from "react"
import { Navigate, Outlet } from "react-router-dom"

export default function ProtectedRoutes() {
  const [status, setStatus] = useState<"Denied" | "Loading" | "Allowed">(
    "Loading"
  )

  useEffect(() => {
    const checkAuth = async () => {
      const response = await fetch("/api/me")

      if (!response.ok) {
        setStatus("Denied")
        return
      }

      setStatus("Allowed")
    }

    checkAuth()
  }, [])

  if (status === "Loading") return <p>Loading...</p>

  return status === "Allowed" ? <Outlet /> : <Navigate to="/signin" replace />
}
