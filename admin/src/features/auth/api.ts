import type { User } from "../../../types.ts";

type Data = {
  email: string;
  password: string;
};

export async function sendLoginRequest(data: Data): Promise<User> {
  const res = await fetch("/api/login", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
  });

  if (res.status === 401) {
    throw new Error("Neteisingas el. paštas arba slaptažodis");
  }

  if (!res.ok) {
    throw new Error("Serverio klaida, bandykite vėliau");
  }

  return (await res.json()) as User;
}

export async function sendSignupRequest(data: Data): Promise<User> {
  const res = await fetch("/api/signup", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
  });

  if (!res.ok) {
    const body = await res.json().catch(() => null);
    throw new Error(body?.message ?? "Serverio klaida, bandykite vėliau");
  }

  return (await res.json()) as User;
}
