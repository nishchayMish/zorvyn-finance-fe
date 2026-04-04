import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

const publicRoutes = ["/login", "/signup"];

// Role-based route access
const roleRoutes: Record<string, string[]> = {
    admin: ["/dashboard", "/transactions", "/analytics", "/users"],
    analyst: ["/dashboard", "/transactions", "/analytics"],
    viewer: ["/dashboard"],
};

export function middleware(req: NextRequest) {
    const { pathname } = req.nextUrl;

    const token = req.cookies.get("token")?.value;
    const role = req.cookies.get("role")?.value;

    // 1. Allow public routes
    if (publicRoutes.includes(pathname)) {
        if (token) {
            // already logged in → redirect to dashboard
            return NextResponse.redirect(new URL("/dashboard", req.url));
        }
        return NextResponse.next();
    }

    // 2. Protect private routes
    if (!token) {
        return NextResponse.redirect(new URL("/login", req.url));
    }

    return NextResponse.next();
}

export const config = {
    matcher: [
        "/dashboard/:path*",
        "/transactions/:path*",
        "/analytics/:path*",
        "/users/:path*",
        "/login",
        "/signup",
    ],
};