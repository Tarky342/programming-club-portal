// src/api/authApi.js
const BASE = import.meta.env.VITE_API_BASE_URL;

export const loginAPI = async (email, password) => {
  const res = await fetch(`${BASE}/auth/login`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ email, password }),
  });

  if (!res.ok) return null;
  return await res.json();
};
