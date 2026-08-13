"use client";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

export default function LoginPage() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");

  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const [locked, setLocked] = useState(false);
  const [remaining, setRemaining] = useState(0);

  const router = useRouter();

  // ⏳ countdown timer
  useEffect(() => {
    if (!locked) return;

    const interval = setInterval(() => {
      setRemaining((prev) => {
        if (prev <= 1000) {
          setLocked(false);
          setError("");
          clearInterval(interval);
          return 0;
        }
        return prev - 1000;
      });
    }, 1000);

    return () => clearInterval(interval);
  }, [locked]);

  const formatTime = (ms: number) => {
    const totalSec = Math.ceil(ms / 1000);
    const m = Math.floor(totalSec / 60);
    const s = totalSec % 60;
    return `${m}:${s.toString().padStart(2, "0")}`;
  };

  const handleLogin = async () => {
    setError("");
    setLoading(true);

    try {
      const res = await fetch("/api/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ username, password }),
      });

      const data = await res.json();

      if (data.success) {
        router.push("/admin");
        return;
      }

      // ❌ show inline error
      setError(data.message || "Login failed");

      // 🔒 lock handling
      if (data.locked) {
        setLocked(true);
        setRemaining(data.remainingMs);
      }
    } catch (e) {
      setError("Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-black text-white">

      <div className="bg-[#111] p-8 rounded-2xl border border-white/10 w-[360px] shadow-xl">

        <h2 className="text-2xl mb-6 text-[#D4AF37] text-center font-semibold">
          Admin Login
        </h2>

        {/* ERROR / LOCK MESSAGE */}
        {error && (
          <div className="mb-4 p-3 rounded-lg bg-red-500/10 border border-red-500/30 text-red-400 text-sm text-center">
            {locked
              ? `Locked. Try again in ${formatTime(remaining)}`
              : error}
          </div>
        )}

        <input
          type="text"
          placeholder="Username"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          disabled={locked}
          className="w-full p-3 mb-3 bg-black border border-white/10 rounded-lg outline-none focus:border-[#D4AF37] disabled:opacity-50"
        />

        <input
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          disabled={locked}
          className="w-full p-3 mb-4 bg-black border border-white/10 rounded-lg outline-none focus:border-[#D4AF37] disabled:opacity-50"
        />

        <button
          onClick={handleLogin}
          disabled={locked || loading}
          className="w-full py-3 bg-[#D4AF37] text-black rounded-lg font-semibold hover:scale-[1.02] transition disabled:opacity-50"
        >
          {loading ? "Checking..." : locked ? "Locked" : "Login"}
        </button>

      </div>
    </div>
  );
}