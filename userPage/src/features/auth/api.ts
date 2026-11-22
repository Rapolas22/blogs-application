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
