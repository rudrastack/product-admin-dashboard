"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { loginUser } from "@/services/auth.api";

export default function LoginPage() {
  const router = useRouter();

  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (event) => {
    event.preventDefault();

    if (loading) return;

    setError("");
    setLoading(true);

    try {
      const data = await loginUser({
        username,
        password,
      });

      localStorage.setItem("token", data.accessToken);

      router.push("/products");
    } catch (error) {
      setError("Invalid username or password.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="flex min-h-screen items-center justify-center bg-[var(--background)] px-4 py-10">
      <div className="w-full max-w-md rounded-xl border border-[var(--line)] bg-white p-7 shadow-[0_16px_40px_rgba(25,25,24,0.06)] sm:p-9">
        <div className="mb-8 flex h-11 w-11 items-center justify-center rounded-lg bg-[var(--brand)] text-lg font-bold text-white">P</div>
        <h1 className="text-3xl font-bold tracking-tight text-[#191918]">
          Product workspace
        </h1>

        <p className="mt-2 text-sm text-[#73716c]">
          Login to manage products
        </p>

        <form onSubmit={handleSubmit} className="mt-6 space-y-4">
          <div>
            <label className="mb-2 block text-sm font-semibold text-[#4f4d48]">
              Username
            </label>

            <input
              type="text"
              value={username}
              onChange={(event) => setUsername(event.target.value)}
              className="w-full rounded-md border border-[var(--line)] px-4 py-3 outline-none transition-shadow placeholder:text-[#aaa7a0] focus:border-[#a19d94] focus:ring-4 focus:ring-[#efede8]"
              placeholder="Enter your username"
            />
          </div>

          <div>
            <label className="mb-2 block text-sm font-semibold text-[#4f4d48]">
              Password
            </label>

            <input
              type="password"
              value={password}
              onChange={(event) => setPassword(event.target.value)}
              className="w-full rounded-md border border-[var(--line)] px-4 py-3 outline-none transition-shadow placeholder:text-[#aaa7a0] focus:border-[#a19d94] focus:ring-4 focus:ring-[#efede8]"
              placeholder="Enter your password"
            />
          </div>

          {error && (
            <p className="rounded-md border border-[#ead4d1] bg-[#fff8f7] px-4 py-3 text-sm font-medium text-[#9b4540]">
              {error}
            </p>
          )}

          <button
            type="submit"
            disabled={loading}
            className="w-full rounded-md bg-[var(--brand)] px-4 py-3 font-semibold text-white shadow-[0_6px_14px_rgba(25,25,24,0.14)] transition-colors hover:bg-[var(--brand-dark)] disabled:cursor-not-allowed disabled:opacity-50"
          >
            {loading ? "Logging in..." : "Login"}
          </button>
        </form>
      </div>
    </main>
  );
}