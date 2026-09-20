import type { NextRequest } from "next/server";

export function isAdminRequest(req: NextRequest) {
  return req.cookies.get("admin")?.value === "true";
}
