import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

// Public routes (accessible without login)
const publicRoutes = [
    "/",
    "/login",
    "/signup",
    "/forgot-password",
    "/reset-password",
];

export function middleware(req: NextRequest) {
    const { pathname } = req.nextUrl;

    const token = req.cookies.get("token")?.value;
    const role = req.cookies.get("role")?.value;

    //  Check if route is public (handles dynamic routes too)
    const isPublicRoute = publicRoutes.some(
        (route) =>
            pathname === route || pathname.startsWith(route + "/")
    );

    //  1. If logged-in user tries to access public route → redirect
    if (isPublicRoute && token) {
        return NextResponse.redirect(new URL("/dashboard", req.url));
    }

    //  2. If NOT logged-in user tries private route → redirect to login
    if (!isPublicRoute && !token) {
        return NextResponse.redirect(new URL("/login", req.url));
    }

    return NextResponse.next();
}

// Apply middleware to all relevant routes
export const config = {
    matcher: [
        "/",
        "/login",
        "/signup",
        "/forgot-password",
        "/reset-password",
        "/dashboard/:path*",
        "/transactions/:path*",
        "/analytics/:path*",
        "/users/:path*",
    ],
};