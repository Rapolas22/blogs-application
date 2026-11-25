import type { signUpProps, loginProps } from "./types"

export async function sendLoginDataToApi(formData: loginProps) {
  const response = await fetch("/api/login", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(formData),
  })

  if (!response.ok) throw new Error("Failed to send data")
}

export async function sendSignUpDataToApi({
  formData,
}: {
  formData: signUpProps
}) {
  const response = await fetch("/api/signup", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(formData),
  })

  if (!response.ok) throw new Error("Failed to send data")
}

export async function getMe(): Promise<number | null> {
  const response = await fetch("/api/me")

  if (response.status === 401) return null
  if (!response.ok) throw new Error("Failed to check login")

  return (await response.json()) as number
}

export async function logout() {
  const response = await fetch("/api/logout")

  if (!response.ok) throw new Error("Failed to log out")
}
