import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

function decodeJwtPayload(token: string): Record<string, unknown> | null {
  try {
    const parts = token.split(".");
    if (parts.length !== 3) return null;
    const payload = parts[1];
    const decoded = atob(payload.replace(/-/g, "+").replace(/_/g, "/"));
    return JSON.parse(decoded);
  } catch {
    return null;
  }
}

// Routes that require authentication (any role)
const AUTH_REQUIRED_ROUTES = ["/dashboard", "/user/referral", "/user/checkout"];

// Routes only for guests (redirect to home if authenticated)
const GUEST_ONLY_ROUTES = ["/login", "/register"];

export function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl;
  const token = request.cookies.get("token")?.value;

  // Decode JWT payload
  const payload = token ? decodeJwtPayload(token) : null;
  const isAuthenticated = !!payload;

  // 1. Guest-only routes: redirect authenticated users to home
  if (GUEST_ONLY_ROUTES.some((route) => pathname.startsWith(route))) {
    if (isAuthenticated) {
      return NextResponse.redirect(new URL("/", request.url));
    }
    return NextResponse.next();
  }

  // 2. Auth-required routes: redirect unauthenticated users to login
  if (AUTH_REQUIRED_ROUTES.some((route) => pathname.startsWith(route))) {
    if (!isAuthenticated) {
      const loginUrl = new URL("/login", request.url);
      loginUrl.searchParams.set("callbackUrl", pathname);
      return NextResponse.redirect(loginUrl);
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    "/dashboard/:path*",
    "/login",
    "/register",
    "/user/referral/:path*",
    "/user/checkout/:path*",
  ],
};
