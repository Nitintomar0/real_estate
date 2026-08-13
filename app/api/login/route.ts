import { NextResponse } from "next/server";

// In-memory (ok for now; later we can move to DB)
let attempts = 0;
let lockUntil: number | null = null;

export async function POST(req: Request) {
  const { username, password } = await req.json();
  const now = Date.now();

  // ⛔ If locked
  if (lockUntil && now < lockUntil) {
    const remainingMs = lockUntil - now;
    return NextResponse.json({
      success: false,
      message: "Too many attempts",
      locked: true,
      remainingMs,
    });
  }

  const ADMIN_USER = "nitin";
  const ADMIN_PASS = "Tomar@123";

  // ✅ Correct
  if (username === ADMIN_USER && password === ADMIN_PASS) {
    attempts = 0;
    lockUntil = null;

    const res = NextResponse.json({ success: true });
    res.cookies.set("admin", "true", {
      httpOnly: true,
      path: "/",
    });
    return res;
  }

  // ❌ Wrong
  attempts++;

  // Lock rules
  if (attempts >= 4 && attempts < 6) {
    lockUntil = now + 2 * 60 * 1000; // 2 min
  }
  if (attempts >= 6) {
    lockUntil = now + 5 * 60 * 1000; // 5 min
  }

  return NextResponse.json({
    success: false,
    message: "Invalid username or password",
    locked: lockUntil ? true : false,
    remainingMs: lockUntil ? lockUntil - now : 0,
  });
}